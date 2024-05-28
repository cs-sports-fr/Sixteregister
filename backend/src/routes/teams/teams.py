import os

from typing import Annotated, List
from fastapi import APIRouter, HTTPException, Depends
from prisma.models import Team, User
from prisma.types import (
    TeamCreateInput,
    TeamUpdateInput,
    TeamWhereInput,
    TeamInclude,
    ParticipantWhereInput,
    FindManyParticipantArgsFromTeam,
    ParticipantIncludeFromParticipantRecursive1,
)

from prisma.enums import TeamStatus, EnumUserStatus
from .utils import (
    ParticipantInput,
    add_participant_to_team,
    check_and_update_team_amount_to_pay_then_get_team,
    get_team_if_allowed,
    send_charte_email,
    send_host_rez_email,
)

from infra.prisma import getPrisma  # type: ignore
from routes.auth.utils import check_super_admin, check_user, check_admin, generate_password  # type: ignore

teams_router = APIRouter(
    prefix="/teams",
    tags=["teams"],
)
prisma = getPrisma()

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")


@teams_router.post(
    "/",
    response_model=Team,
)
async def create_team(
    name: str,
    sportId: int,
    participants: List[ParticipantInput],
    user: Annotated[User, Depends(check_user)],
):
    general_config = await prisma.generalconfig.find_first()
    if general_config is None:
        raise HTTPException(status_code=500, detail="General config not found")

    if not general_config.isRegistrationOpen:
        raise HTTPException(
            status_code=400, detail="Registration is still closed"
        )

    existing_team = await prisma.team.find_first(
        where=TeamWhereInput(name=name)
    )
    if existing_team:
        raise HTTPException(
            status_code=400, detail="A team with this name already exists"
        )

    team = await prisma.team.create(
        data=TeamCreateInput(
            name=name,
            sportId=sportId,
            status=TeamStatus.Waiting,
            teamAdminUserId=user.id,
            schoolId=user.schoolId,
        )
    )
    url = f"{FRONTEND_URL}/charte"
    for new_participant in participants:

        charte_password = generate_password()
        try:
            participant = await add_participant_to_team(
                team_id=team.id,
                school_id=team.schoolId,
                charte_password=charte_password,
                new_participant=new_participant,
            )

            await send_charte_email(
                participant.email,
                participant.firstname,
                participant.chartePassword,
                url,
            )

            if participant.mailHebergeur is not None:
                await send_host_rez_email(participant.mailHebergeur, participant.firstname)

        except Exception:
            pass

    team, _ = await check_and_update_team_amount_to_pay_then_get_team(
        team_id=team.id
    )
    if team is None or team.participants is None or len(team.participants) == 0:
        try:
            await prisma.team.delete(where=TeamWhereInput(id=team.id))
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail="Error while creating team: deleting team failed",
            )
        raise HTTPException(
            status_code=500,
            detail="Error while creating team: no participant added",
        )
    return team


@teams_router.put("/{team_id}", response_model=Team)
async def update_team(
    team_id: int,
    name: str,
    user: Annotated[User, Depends(check_user)],
):
    existing_team = await get_team_if_allowed(team_id, user)

    team = await prisma.team.update(
        data=TeamUpdateInput(name=name),
        where=TeamWhereInput(id=existing_team.id),
    )

    return team


@teams_router.put(
    "/{team_id}/status",
    response_model=Team,
    dependencies=[Depends(check_admin)],
)
async def update_team_status(team_id: int, status: TeamStatus):
    team = await prisma.team.update(
        data=TeamUpdateInput(status=status),
        where=TeamWhereInput(id=team_id),
    )

    return team


@teams_router.put(
    "/{team_id}/amount-paid",
    response_model=Team,
    dependencies=[Depends(check_super_admin)],
)
async def update_team_amount_paid(team_id: int, amount_paid_in_cents: int):
    team = await prisma.team.update(
        data=TeamUpdateInput(amountPaidInCents=amount_paid_in_cents),
        where=TeamWhereInput(id=team_id),
    )

    return team


@teams_router.get("", response_model=List[Team])
async def get_teams(user: Annotated[User, Depends(check_user)]):
    if user.status == EnumUserStatus.SuperAdminStatus:
        teams = await prisma.team.find_many(
            include=TeamInclude(
                participants=FindManyParticipantArgsFromTeam(
                    include=ParticipantIncludeFromParticipantRecursive1(
                        products=True
                    )
                ),
                sport=True,
            )
        )
        return teams

    elif (
        user.status == EnumUserStatus.AdminStatus
        and user.sportAdminId is not None
    ):
        teams = await prisma.team.find_many(
            where=TeamWhereInput(
                schoolId=user.schoolId, sportId=user.sportAdminId
            ),
            include=TeamInclude(
                participants=FindManyParticipantArgsFromTeam(
                    include=ParticipantIncludeFromParticipantRecursive1(
                        products=True
                    )
                ),
                sport=True,
            ),
        )
        return teams

    teams = await prisma.team.find_many(
        where=TeamWhereInput(teamAdminUserId=user.id),
        include=TeamInclude(
            participants=FindManyParticipantArgsFromTeam(
                include=ParticipantIncludeFromParticipantRecursive1(
                    products=True
                )
            ),
            sport=True,
        ),
    )
    return teams


@teams_router.get("/{team_id}", response_model=Team)
async def get_team(team_id: int, user: Annotated[User, Depends(check_user)]):

    return await get_team_if_allowed(team_id, user)


@teams_router.delete("/{team_id}")
async def delete_team(team_id: int, user: Annotated[User, Depends(check_user)]):
    existing_team = await get_team_if_allowed(team_id, user)

    if existing_team.participants is not None:
        for participant in existing_team.participants:
            await prisma.participant.delete(
                where=ParticipantWhereInput(id=participant.id)
            )

    await prisma.team.delete(
        where=TeamWhereInput(id=existing_team.id),
        include=TeamInclude(participants=True),
    )
