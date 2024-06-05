from datetime import datetime
from typing import Annotated, Tuple
from fastapi import HTTPException, Depends
from prisma.models import Team, User, Participant

from prisma.types import (
    TeamWhereInput,
    TeamInclude,
    TeamUpdateInput,
    ParticipantCreateInput,
    FindManyParticipantArgsFromTeam,
    ParticipantIncludeFromParticipantRecursive1,
    ParticipantWhereInput,
    ParticipantUpdateInput,
)
from prisma.enums import Gender, EnumUserStatus, mailClient
from pydantic import BaseModel

from infra.utils import get_html_template_file, fill_template  # type: ignore
from infra.prisma import getPrisma  # type: ignore
from routes.auth.utils import check_user  # type: ignore
from infra.aws.ses import EmailClient  # type: ignore
from infra.mailgun.mailgun import MailgunClient

prisma = getPrisma()

mailgun_client = MailgunClient()
email_client = EmailClient()


class ParticipantInput(BaseModel):
    gender: Gender
    firstname: str
    lastname: str
    email: str
    dateOfBirth: datetime
    isCaptain: bool
    isBoursier :bool
    ValidateBoursier : bool


async def get_team_if_allowed(
    team_id: int, user: Annotated[User, Depends(check_user)]
) -> Team:
    if user.status == EnumUserStatus.SuperAdminStatus:
        existing_team = await prisma.team.find_first(
            where=TeamWhereInput(id=team_id),
            include=TeamInclude(
                participants=FindManyParticipantArgsFromTeam(
                    include=ParticipantIncludeFromParticipantRecursive1(
                        
                    )
                ),
                sport=True,
            ),
        )
        if existing_team is None:
            raise HTTPException(
                status_code=400,
                detail="This team does not exist",
            )
        return existing_team

    elif user.status == EnumUserStatus.AdminStatus:
        existing_team = await prisma.team.find_first(
            where=TeamWhereInput(id=team_id, sportId=user.sportAdminId),
            include=TeamInclude(
                participants=FindManyParticipantArgsFromTeam(
                    include=ParticipantIncludeFromParticipantRecursive1(
                        
                    )
                ),
                sport=True,
            ),
        )
        if existing_team is None:
            raise HTTPException(
                status_code=400,
                detail="This user is not an admin of this team",
            )
        if user.sportAdminId != existing_team.sportId:
            raise HTTPException(
                status_code=403,
                detail="This user is not an admin of this sport",
            )
        return existing_team

    else:
        existing_team = await prisma.team.find_first(
            where=TeamWhereInput(id=team_id, teamAdminUserId=user.id),
            include=TeamInclude(
                participants=FindManyParticipantArgsFromTeam(
                    include=ParticipantIncludeFromParticipantRecursive1(
                    )
                ),
                sport=True,
            ),
        )
        if existing_team is None:
            raise HTTPException(
                status_code=403,
                detail="This user is not an admin of this team",
            )
    return existing_team


async def add_participant_to_team(
    team_id: int,
    school_id: int,
    charte_password: str,
    new_participant: ParticipantInput,
) -> Participant:

   

    participant = await prisma.participant.create(
        data=ParticipantCreateInput(
            isCaptain=new_participant.isCaptain,
            gender=new_participant.gender,
            firstname=new_participant.firstname,
            lastname=new_participant.lastname,
            email=new_participant.email,
            dateOfBirth=new_participant.dateOfBirth,
            isBoursier=new_participant.isBoursier,
            ValidateBoursier=False,
            charteIsValidated=False,
            chartePassword=charte_password,
            teamId=team_id,
            schoolId=school_id,
            ),
    )
    return participant


async def check_and_update_team_amount_to_pay_then_get_team(
    team_id: int, team: Team | None = None
) -> Tuple[Team, int]:
    if team is None:
        team = await prisma.team.find_first(
            where=TeamWhereInput(id=team_id),
            include=TeamInclude(
                participants=FindManyParticipantArgsFromTeam(
                    include=ParticipantIncludeFromParticipantRecursive1(
                    
                    )
                )
            ),
        )

    if team is None:
        raise HTTPException(status_code=404, detail="Team not found")

    amount_to_pay_in_cents = 0

    if team.participants is None:
        return team, amount_to_pay_in_cents

    for participant in team.participants:
        if participant.isBoursier : 
            amount_to_pay_in_cents += 3500
            print("nkcelecl")
        else:
            amount_to_pay_in_cents += 4400
            print("pas boursier")
            
    if team.amountToPayInCents != amount_to_pay_in_cents:
        team = await prisma.team.update(
            data=TeamUpdateInput(
                amountToPayInCents=amount_to_pay_in_cents,
            ),
            where=TeamWhereInput(id=team_id),
            include=TeamInclude(participants=True),
        )
        if team is None:
            raise HTTPException(
                status_code=500,
                detail="Error while updating team amount to pay",
            )

    return team, amount_to_pay_in_cents


async def send_charte_email(
    email: str, firstname: str, charte_password: str, url: str
) -> None:
    general_config = await prisma.generalconfig.find_first()
    html_template = get_html_template_file("charte_email.html")
    txt_template = get_html_template_file("charte_email.txt")
    content = {
        "FIRSTNAME": firstname,
        "PASSWORD": charte_password,
        "URL": url,
    }
    html_content = fill_template(html_template, content)
    txt_content = fill_template(txt_template, content)

    if general_config.canSendEmails == True:
        if general_config.mailClient == mailClient.SES:

            try:
                email_client.send_email(
                    to_address=email,
                    subject="[SIXTE 2025] Charte participant",
                    body_html=html_content,
                    body_text=txt_content,
                )
                await prisma.participant.update(
                    where=ParticipantWhereInput(email=email),
                    data=ParticipantUpdateInput(charteEmailSent=True),
                )
            except Exception:
                pass
        else:
            try:
                mailgun_client.send_email(
                    from_email="contacts@cs-sports.fr",
                    to_email=email,
                    subject="[SIXTE 2025] Charte participant",
                    text=txt_content,
                    html=html_content,
                )
                await prisma.participant.update(
                    where=ParticipantWhereInput(email=email),
                    data=ParticipantUpdateInput(charteEmailSent=True),
                )
            except Exception:
                pass