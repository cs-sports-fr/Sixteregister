import os

from typing import Annotated, List
from fastapi import APIRouter, HTTPException, Depends, UploadFile
from fastapi.responses import FileResponse
from prisma.models import User, Participant, Team
from prisma.types import (
    PackWhereUniqueInput,
    ParticipantWhereInput,
    ParticipantUpdateInput,
    ParticipantInclude,
    PackUpdateOneWithoutRelationsInput,
    ProductUpdateManyWithoutRelationsInput,
    _ProductWhereUnique_id_Input,
)

from infra.aws.s3 import fileStorageClient  # type: ignore
from starlette.background import BackgroundTasks

from .utils import (
    ParticipantInput,
    add_participant_to_team,
    check_and_update_team_amount_to_pay_then_get_team,
    get_team_if_allowed,
    send_charte_email,
    send_host_rez_email,
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

        if participant.mailHebergeur != None:
            if participant.packId == 5 or participant.packId == 6 or participant.packId == 11 or participant.packId == 12: ## TODO change to better logic
                ## Send email
                await send_host_rez_email(participant.mailHebergeur, participant.firstname)

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

    product_connections = [
        _ProductWhereUnique_id_Input(id=id_) for id_ in participant.productsIds
    ]

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
            isVegan=participant.isVegan,
            hasAllergies=participant.hasAllergies,
            weight=participant.weight,
            products=ProductUpdateManyWithoutRelationsInput(
                set=product_connections,
            ),
            pack=PackUpdateOneWithoutRelationsInput(
                connect=PackWhereUniqueInput(id=participant.packId)
            ),
            mailHebergeur=participant.mailHebergeur,
            classementTennis=participant.classementTennis,
            classementTT=participant.classementTT,
            armeVoeu1=participant.armeVoeu1,
            armeVoeu2=participant.armeVoeu2,
            armeVoeu3=participant.armeVoeu3,
        ),
    )

    if existing_participant.mailHebergeur != None and existing_participant.mailHebergeur != participant.mailHebergeur:
        if participant.packId == 5 or participant.packId == 6 or participant.packId == 11 or participant.packId == 12: ## TODO change to better logic
            ## Send email
            await send_host_rez_email(participant.mailHebergeur, participant.firstname)

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


@team_participants_router.post(
    "/{team_id}/participant/{participant_id}/certificate",
)
async def participant_add_certificate(
    team_id: int,
    participant_id: int,
    certificate: UploadFile,
):

    existing_participant = await prisma.participant.find_first(
        where=ParticipantWhereInput(id=participant_id, teamId=team_id),
    )
    if not existing_participant:
        raise HTTPException(status_code=404, detail="Participant not found")
    if certificate is None:
        raise HTTPException(status_code=400, detail="No file provided")
    if certificate.size is None:
        raise HTTPException(status_code=400, detail="No file size provided")
    if certificate.size > 10485760:  # 10MB
        raise HTTPException(status_code=400, detail="File too large")

    if certificate.filename is None:
        raise HTTPException(
            status_code=400,
            detail="No file name on original file : cannot get file extension",
        )
    extension = certificate.filename.split(".")[-1]

    if extension not in ["pdf", "jpeg", "jpg", "png", "JPG", "JPEG", "PNG"]:
        raise HTTPException(status_code=400, detail="Invalid file extension")

    try:
        os.makedirs("tmp", exist_ok=True)
        temp_file = f"tmp/{team_id}_{participant_id}.{extension}"
        with open(temp_file, "wb") as buffer:
            buffer.write(await certificate.read())
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error while saving file: {e}"
        )
    try:
        certificate_url = f"certificates/team_{team_id}/participant_{participant_id}.{extension}"
        file_storage_client.upload_file(
            temp_file, "toss-register-certificates", certificate_url
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error while uploading file to s3: {e}"
        )

    os.remove(temp_file)

    await prisma.participant.update(
        where=ParticipantWhereInput(id=participant_id),
        data=ParticipantUpdateInput(certificateLink=certificate_url),
    )


@team_participants_router.get(
    "/{team_id}/participant/{participant_id}/certificate",
    dependencies=[Depends(check_admin)],
    response_class=FileResponse,
)
async def participant_get_certificate(
    team_id: int, participant_id: int, background_tasks: BackgroundTasks
):
    existing_participant = await prisma.participant.find_first(
        where=ParticipantWhereInput(id=participant_id, teamId=team_id),
    )
    if not existing_participant:
        raise HTTPException(status_code=404, detail="Participant not found")

    if existing_participant.certificateLink is None:
        raise HTTPException(status_code=404, detail="No certificate found")

    try:
        download_path = (
            f"tmp/{existing_participant.certificateLink.replace('/', '_')}"
        )
        file_storage_client.download_file(
            "toss-register-certificates",
            existing_participant.certificateLink,
            download_path,
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error while downloading file from s3: {e}"
        )
    background_tasks.add_task(os.remove, download_path)
    return FileResponse(download_path)
