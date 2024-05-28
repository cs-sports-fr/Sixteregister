import os

from typing import Annotated, List
from fastapi import APIRouter, HTTPException, Depends, UploadFile
from fastapi.responses import FileResponse
from prisma.models import User, Participant, Team
from prisma.types import (
    ParticipantWhereInput,
    ParticipantUpdateInput,
    ParticipantInclude,
)

from infra.aws.s3 import fileStorageClient  # type: ignore
from starlette.background import BackgroundTasks

from .utils import (
    ParticipantInput,
    add_participant_to_team,
    check_and_update_team_amount_to_pay_then_get_team,
    get_team_if_allowed,
    send_charte_email,
)

from infra.prisma import getPrisma  # type: ignore
from routes.auth.utils import check_user, check_admin, generate_password  # type: ignore

team_participants_router = APIRouter(
    prefix="/teams",
    tags=["teams-participants"],
)
prisma = getPrisma()

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
file_storage_client = fileStorageClient()


@team_participants_router.get(
    "/{team_id}/participants", response_model=List[Participant]
)
async def team_get_participants(
    team_id: int,
    user: Annotated[User, Depends(check_user)],
):
    existing_team = await get_team_if_allowed(team_id, user)

    return existing_team.participants


@team_participants_router.post("/{team_id}/participants", response_model=Team)
async def team_add_participants(
    team_id: int,
    participants: List[ParticipantInput],
    user: Annotated[User, Depends(check_user)],
):
    existing_team = await get_team_if_allowed(team_id, user)

    for new_participant in participants:

        charte_password = generate_password()

        participant = await add_participant_to_team(
            team_id=existing_team.id,
            school_id=existing_team.schoolId,
            charte_password=charte_password,
            new_participant=new_participant,
        )

        url = f"{FRONTEND_URL}/charte"

        await send_charte_email(
            participant.email,
            participant.firstname,
            participant.chartePassword,
            url,
        )



    updated_team, _ = await check_and_update_team_amount_to_pay_then_get_team(
        team_id=existing_team.id
    )

    return updated_team


@team_participants_router.delete("/{team_id}/participants", response_model=Team)
async def team_delete_participants(
    team_id: int,
    participant_ids: List[int],
    user: Annotated[User, Depends(check_user)],
):
    existing_team = await get_team_if_allowed(team_id, user)

    if not existing_team.participants:
        raise HTTPException(
            status_code=404, detail="No participants found in team"
        )

    for participant_id in participant_ids:
        id_found = None
        for team_participants in existing_team.participants:
            if team_participants.id == participant_id:
                id_found = participant_id
                break
        if not id_found:
            raise HTTPException(
                status_code=404, detail="Participant not found in team"
            )
        await prisma.participant.delete(
            where=ParticipantWhereInput(id=participant_id)
        )

    updated_team, _ = await check_and_update_team_amount_to_pay_then_get_team(
        team_id=existing_team.id
    )

    return updated_team


@team_participants_router.put(
    "/{team_id}/participant/{participant_id}", response_model=Participant
)
async def team_update_participant(
    team_id: int,
    participant_id: int,
    participant: ParticipantInput,
    user: Annotated[User, Depends(check_user)],
):
    await get_team_if_allowed(team_id, user)

    existing_participant = await prisma.participant.find_first(
        where=ParticipantWhereInput(id=participant_id, teamId=team_id),
        include=ParticipantInclude(products=True),
    )
    if not existing_participant:
        raise HTTPException(status_code=404, detail="Participant not found")

    updated_participant = await prisma.participant.update(
        where=ParticipantWhereInput(id=participant_id),
        data=ParticipantUpdateInput(
            gender=participant.gender,
            firstname=participant.firstname,
            lastname=participant.lastname,
            email=participant.email,
            dateOfBirth=participant.dateOfBirth,
            isCaptain=participant.isCaptain,
            licenceID=participant.licenceID,
        ),
    )



    await check_and_update_team_amount_to_pay_then_get_team(team_id=team_id)

    return updated_participant


@team_participants_router.post(
    "/{team_id}/participant/{participant_id}/resend-charte-email",
    dependencies=[Depends(check_admin)],
)
async def participant_resend_charte_email(team_id: int, participant_id: int):
    existing_participant = await prisma.participant.find_first(
        where=ParticipantWhereInput(id=participant_id, teamId=team_id),
    )
    if not existing_participant:
        raise HTTPException(status_code=404, detail="Participant not found")

    url = f"{FRONTEND_URL}/charte/{existing_participant.id}"

    await send_charte_email(
        existing_participant.email,
        existing_participant.firstname,
        existing_participant.chartePassword,
        url,
    )


@team_participants_router.post(
    "/participant/sign-charte"
)
async def participant_sign_charte(
    email: str,
    charte_password: str,
):
    existing_participant = await prisma.participant.find_first(
        where=ParticipantWhereInput(email=email),
    )
    if not existing_participant:
        raise HTTPException(status_code=404, detail="Participant not found")

    if existing_participant.chartePassword == charte_password:
        await prisma.participant.update(
            where=ParticipantWhereInput(id=existing_participant.id),
            data=ParticipantUpdateInput(
                charteIsValidated=True,
                chartePassword=charte_password,
            ),
        )
    else:
        raise HTTPException(status_code=403, detail="Invalid charte password")



