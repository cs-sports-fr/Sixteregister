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
    StringFilter,
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
    send_participant_rez_email,
    send_participant_selected_email,
    send_participant_com_email,
    send_participant_com_email2
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

    # Récupérer le sport pour vérifier le nombre max de participants
    team_with_sport = await prisma.team.find_unique(
        where={"id": team_id},
        include={"sport": True, "participants": True}
    )
    
    if not team_with_sport:
        raise HTTPException(
            status_code=404,
            detail="Team not found"
        )
    
    max_players = team_with_sport.sport.nbPlayersMax
    current_participants_count = len(team_with_sport.participants)
    new_participants_count = len(participants)
    
    if current_participants_count + new_participants_count > max_players:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot add {new_participants_count} participant(s). Team currently has {current_participants_count} participant(s) and maximum is {max_players}."
        )

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

        if participant.packId == 1 or participant.packId == 6: ## TODO change to better logic
            await send_host_rez_email(participant.mailHebergeur, participant.firstname, participant.lastname)
        
        if participant.packId == 1 or participant.packId == 6: ## TODO change to better logic
            await send_participant_rez_email(participant.email, participant.firstname)


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

    # Check if participant is switching from a non-residence pack to a residence pack
    was_residence_pack = existing_participant.packId in [1, 6]
    is_residence_pack = participant.packId in [1, 6]
    reset_logement_rez_ok = False

    # If switching from non-residence to residence pack, set logementRezOk to False
    if not was_residence_pack and is_residence_pack:
        reset_logement_rez_ok = True

    updated_participant = await prisma.participant.update(
        where=ParticipantWhereInput(id=participant_id),
        data=ParticipantUpdateInput(
            gender=participant.gender,
            firstname=participant.firstname,
            lastname=participant.lastname,
            email=participant.email,
            mobile=participant.mobile,
            dateOfBirth=participant.dateOfBirth,
            isCaptain=participant.isCaptain,
            licenceID=participant.licenceID,
            isVegan=participant.isVegan,
            hasAllergies=participant.hasAllergies,
            weight=participant.weight,
            charteIsValidated=participant.charteValidated,
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
            # Reset logementRezOk if needed
            logementRezOk=False if reset_logement_rez_ok else existing_participant.logementRezOk,
        ),
    )

    # Handle email notifications for residence packs
    residence_pack_ids = [1, 6]  # List of pack IDs that require residence
    
    # Send emails if mailHebergeur changed
    if existing_participant.mailHebergeur != participant.mailHebergeur and participant.mailHebergeur is not None:
        if participant.packId in residence_pack_ids:
            await send_host_rez_email(participant.mailHebergeur, participant.firstname, participant.lastname)
            await send_participant_rez_email(participant.email, participant.firstname)
    
    # Also send emails if pack type changed to residence pack
    elif not was_residence_pack and is_residence_pack and participant.mailHebergeur is not None:
        await send_host_rez_email(participant.mailHebergeur, participant.firstname, participant.lastname)
        await send_participant_rez_email(participant.email, participant.firstname)

    await check_and_update_team_amount_to_pay_then_get_team(team_id=team_id)

    return updated_participant


@team_participants_router.post(
    "/{team_id}/participant/{participant_id}/resend-charte-email",
    dependencies=[Depends(check_user)],
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
    "/{team_id}/participant/{participant_id}/resend-caution-email",
    dependencies=[Depends(check_admin)],
)
async def participant_resend_caution_email(team_id: int, participant_id: int):
    """
    Resend the selection notification email to a specific participant.
    Only accessible by admins.
    """
    # First check if the participant exists and belongs to the team
    participant = await prisma.participant.find_first(
        where=ParticipantWhereInput(id=participant_id, teamId=team_id),
        include={"team": {"include": {"sport": True}}}
    )
    
    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")
    
    if not participant.team:
        raise HTTPException(status_code=404, detail="Team not found for participant")
    
    if not participant.team.sport:
        raise HTTPException(status_code=404, detail="Sport not found for team")
        
    sport_links = {
        3: "https://pots.lydia.me/collect/toss-caution-10km-mazars-8946642/fr",
        4: "https://pots.lydia.me/collect/toss-caution-athletisme/fr",
        5: "https://pots.lydia.me/collect/toss-caution-badminton-8982694/fr",
        6: "https://pots.lydia.me/collect/toss-caution-badminton-8982694/fr",
        7: "https://pots.lydia.me/collect/toss-caution-badminton-8982694/fr",
        8: "https://pots.lydia.me/collect/toss-caution-badminton-8982694/fr",
        9: "https://pots.lydia.me/collect/toss-caution-badminton-8982694/fr",
        10: "https://pots.lydia.me/collect/toss-alten-basket-game/fr",    
        11: "https://pots.lydia.me/collect/toss-alten-basket-game/fr",
        12: "https://pots.lydia.me/collect/toss-caution-boxe/fr",
        13: "https://pots.lydia.me/collect/toss-caution-cheerleading/fr",
        14: "https://pots.lydia.me/collect/toss-caution-equitation/fr",
        15: "https://pots.lydia.me/collect/toss-caution-escalade/fr",
        16: "https://pots.lydia.me/collect/toss-caution-escrime/fr",
        17: "https://pots.lydia.me/collect/toss-caution-football-by-revlon/fr",
        18: "https://pots.lydia.me/collect/toss-caution-football-by-revlon/fr",
        19: "https://pots.lydia.me/collect/toss-caution-golf-8982611/fr",
        20: "https://pots.lydia.me/collect/toss-caution-handball/fr",
        21: "https://pots.lydia.me/collect/toss-caution-handball/fr",
        22: "https://pots.lydia.me/collect/toss-caution-tennis-fauteuil/fr",
        23: "https://pots.lydia.me/collect/toss-caution-judo/fr",
        24: "https://pots.lydia.me/collect/toss-caution-natation/fr",
        25: "https://pots.lydia.me/collect/toss-caution-rugby-8946602/fr",
        26: "https://pots.lydia.me/collect/toss-caution-rugby-8946602/fr",
        27: "https://pots.lydia.me/collect/toss-caution-spike/fr",
        28: "https://pots.lydia.me/collect/toss-caution-tennis/fr",
        29: "https://pots.lydia.me/collect/toss-caution-tennis-de-table/fr",
        30: "https://pots.lydia.me/collect/toss-caution-ultimate/fr",
        31: "https://pots.lydia.me/collect/toss-cautions-8843844/fr",
        32: "https://pots.lydia.me/collect/toss-cautions-8843844/fr",
        33: "https://pots.lydia.me/collect/toss-caution-waterpolo-8982594/fr",
        "default": "https://pots.lydia.me/collect/toss-caution-10km-mazars-8946642/fr",

    }
    
    # Get sport-specific link
    sport_id = participant.team.sportId
    sport_name = participant.team.sport.sport
    team_name = participant.team.name
    sport_link = sport_links.get(sport_id, sport_links["default"])
    
    # Resend the selection email
    try:
        await send_participant_selected_email(
            participant.email,
            participant.firstname,
            sport_link,
            sport_name,
            team_name
        )
        
        return {
            "message": f"Selection email resent successfully to {participant.firstname} {participant.lastname}",
            "email": participant.email
        }
    except Exception as e:
        print(f"Failed to send email to participant {participant.id}: {e}")
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to send email: {str(e)}"
        )




@team_participants_router.post(
    "/participant/sign-charte"
)
async def participant_sign_charte(
    email: str,
    charte_password: str,
):
    existing_participant = await prisma.participant.find_first(
        where=ParticipantWhereInput(
            email=StringFilter(
                equals=email,
                mode="insensitive" 
            )
        ),
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




@team_participants_router.put("/{team_id}/participant/{participant_id}/validate-rez")
async def validate_participant_rez(
    team_id: int,
    participant_id: int,
    user: Annotated[User, Depends(check_admin)]  # Only admins can access this endpoint
):
    """
    Toggle a participant's logementRezOk status between true and false.
    This endpoint is used to validate or invalidate a participant's accommodation status.
    """
    # First check if the team exists
    team = await prisma.team.find_unique(
        where={
            "id": team_id
        }
    )
    
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    # Then check if the participant exists and belongs to the team
    participant = await prisma.participant.find_unique(
        where={
            "id": participant_id
        }
    )
    
    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")
    
    if participant.teamId != team_id:
        raise HTTPException(status_code=403, detail="Participant does not belong to this team")
    
    # Toggle the logementRezOk status instead of just setting it to True
    new_logement_status = not participant.logementRezOk
    
    updated_participant = await prisma.participant.update(
        where={
            "id": participant_id
        },
        data={
            "logementRezOk": new_logement_status
        }
    )
    
    status_message = "validated" if new_logement_status else "invalidated"
    return {"message": f"Participant accommodation {status_message} successfully"}

@team_participants_router.put("/{team_id}/participant/{participant_id}/validate-caution")
async def validate_participant_caution(
    team_id: int,
    participant_id: int,
    user: Annotated[User, Depends(check_admin)]  # Only admins can access this endpoint
):
    """
    Toggle a participant's caution status between true and false.
    This endpoint is used to validate or invalidate a participant's caution status.
    """
    # First check if the team exists
    team = await prisma.team.find_unique(
        where={
            "id": team_id
        }
    )
    
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    # Then check if the participant exists and belongs to the team
    participant = await prisma.participant.find_unique(
        where={
            "id": participant_id
        }
    )
    
    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")
    
    if participant.teamId != team_id:
        raise HTTPException(status_code=403, detail="Participant does not belong to this team")
    
    # Toggle the cautionOK status instead of just setting it to True
    new_caution_status = not participant.cautionOK
    
    updated_participant = await prisma.participant.update(
        where={
            "id": participant_id
        },
        data={
            "cautionOK": new_caution_status
        }
    )
    
    status_message = "validated" if new_caution_status else "invalidated"
    return {"message": f"Participant caution {status_message} successfully"}


@team_participants_router.put("/{team_id}/participant/{participant_id}/validate-certificateandlicence")
async def validate_participant_certificate(
    team_id: int,
    participant_id: int,
    user: Annotated[User, Depends(check_admin)]  # Only admins can access this endpoint
):
    """
    Toggle a participant's certificateOK status between true and false.
    """
    # First check if the team exists
    team = await prisma.team.find_unique(
        where={
            "id": team_id
        }
    )
    
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    participant = await prisma.participant.find_unique(
        where={
            "id": participant_id
        }
    )
    
    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")
    
    if participant.teamId != team_id:
        raise HTTPException(status_code=403, detail="Participant does not belong to this team")
    
    # Toggle the certificateOK status
    new_certificate_status = not participant.certificateOK
    
    updated_participant = await prisma.participant.update(
        where={
            "id": participant_id
        },
        data={
            "certificateOK": new_certificate_status
        }
    )
    
    status_message = "validated" if new_certificate_status else "invalidated"
    return {"message": f"Participant certificate {status_message} successfully"}




from typing import Optional, List
from fastapi import Query
from prisma.enums import TeamStatus

@team_participants_router.get("/packs/statistics")
async def get_pack_statistics(
    user: Annotated[User, Depends(check_admin)],
    team_status: Optional[List[TeamStatus]] = Query(None, description="Filter by team status"),
    sport_ids: Optional[List[int]] = Query(None, description="Filter by sport IDs"),
    school_ids: Optional[List[int]] = Query(None, description="Filter by school IDs"),
    pack_ids: Optional[List[int]] = Query(None, description="Filter by pack IDs"),
    gender: Optional[List[str]] = Query(None, description="Filter by participant gender"),
    include_dates: bool = Query(False, description="Group statistics by registration date")
):
    try:
        # Build where conditions
        where_conditions = {}
        team_where = {}
        if team_status:
            team_where["status"] = {"in": team_status}
        if sport_ids:
            team_where["sportId"] = {"in": sport_ids}
        if school_ids:
            team_where["schoolId"] = {"in": school_ids}
        if team_where:
            where_conditions["team"] = team_where
        if pack_ids:
            where_conditions["packId"] = {"in": pack_ids}
        if gender:
            where_conditions["gender"] = {"in": gender}
        
        # Get all participants matching the filters
        participants = await prisma.participant.find_many(
            where=where_conditions,
            include={
                "team": {
                    "include": {
                        "sport": True,
                        "school": True
                    }
                },
                "pack": True,
                "products": True
            }
        )
        
        if not participants:
            return {"message": "No participants found matching the criteria", "total": 0, "packs": {}}
        
        # Initialize statistics
        stats = {
            "total": len(participants),
            "by_pack": {},
            "by_school": {},
            "by_sport": {},
            "by_gender": {},
            "by_product": {},
        }
        products_revenue = 0
        pack17_count_global = 0  # if needed for global purposes
        
        for participant in participants:
            # Determine pack
            if not participant.pack:
                pack_id = "No Pack"
                pack_name = "No Pack"
            else:
                pack_id = participant.pack.id
                pack_name = participant.pack.name

            # Count pack id 17
            if participant.pack and participant.pack.id == 17:
                pack17_count_global += 1

            participant_gender = participant.gender if getattr(participant, "gender", None) else "Unknown"
            
            # Process by_pack statistics
            if pack_id not in stats["by_pack"]:
                stats["by_pack"][pack_id] = {
                    "name": pack_name,
                    "count": 0,
                    "price": participant.pack.priceInCents/100 if participant.pack else 0,
                    "participants": [] if include_dates else None
                }
            stats["by_pack"][pack_id]["count"] += 1

            # Process product statistics
            if participant.products:
                for product in participant.products:
                    product_id = product.id
                    product_name = product.name
                    product_price = product.priceInCents/100
                    products_revenue += product_price
                    if product_id not in stats["by_product"]:
                        stats["by_product"][product_id] = {
                            "name": product_name,
                            "count": 0,
                            "price": product_price,
                            "total_revenue": 0
                        }
                    stats["by_product"][product_id]["count"] += 1
                    stats["by_product"][product_id]["total_revenue"] += product_price

            if include_dates:
                stats["by_pack"][pack_id]["participants"].append({
                    "id": participant.id,
                    "name": f"{participant.firstname} {participant.lastname}",
                    "created_at": participant.createdAt,
                    "gender": participant_gender,
                    "team_name": participant.team.name if participant.team else None,
                    "sport": participant.team.sport.sport if participant.team and participant.team.sport else None,
                    "school": participant.team.school.name if participant.team and participant.team.school else None
                })
            
            # Process by_school statistics
            school_name = participant.team.school.name if participant.team and participant.team.school else "Unknown"
            school_id = participant.team.schoolId if participant.team else 0
            if school_id not in stats["by_school"]:
                stats["by_school"][school_id] = {
                    "name": school_name,
                    "count": 0,
                    "packs": {}
                }
            stats["by_school"][school_id]["count"] += 1
            if pack_id not in stats["by_school"][school_id]["packs"]:
                stats["by_school"][school_id]["packs"][pack_id] = {
                    "name": pack_name,
                    "count": 0
                }
            stats["by_school"][school_id]["packs"][pack_id]["count"] += 1

            # Process by_sport statistics
            sport_name = participant.team.sport.sport if participant.team and participant.team.sport else "Unknown"
            sport_id = participant.team.sportId if participant.team else 0
            if sport_id not in stats["by_sport"]:
                stats["by_sport"][sport_id] = {
                    "name": sport_name,
                    "count": 0,
                    "packs": {},
                    "pack17_count": 0   # count for pack 17
                }
            stats["by_sport"][sport_id]["count"] += 1
            if participant.pack and participant.pack.id == 17:
                stats["by_sport"][sport_id]["pack17_count"] += 1
            if pack_id not in stats["by_sport"][sport_id]["packs"]:
                stats["by_sport"][sport_id]["packs"][pack_id] = {
                    "name": pack_name,
                    "count": 0
                }
            stats["by_sport"][sport_id]["packs"][pack_id]["count"] += 1

            # Process by_gender statistics
            if participant_gender not in stats["by_gender"]:
                stats["by_gender"][participant_gender] = {
                    "count": 0,
                    "packs": {}
                }
            stats["by_gender"][participant_gender]["count"] += 1
            if pack_id not in stats["by_gender"][participant_gender]["packs"]:
                stats["by_gender"][participant_gender]["packs"][pack_id] = {
                    "name": pack_name,
                    "count": 0
                }
            stats["by_gender"][participant_gender]["packs"][pack_id]["count"] += 1
        
        # Compute revenue summary
        packs_revenue = sum(
            stats["by_pack"][pid]["count"] * stats["by_pack"][pid]["price"]
            for pid in stats["by_pack"]
            if pid != "No Pack"
        )
        total_revenue = packs_revenue + products_revenue

        # Sort entries (optional)
        stats["by_pack"] = dict(sorted(stats["by_pack"].items(), key=lambda item: item[1]["count"], reverse=True))
        stats["by_product"] = dict(sorted(stats["by_product"].items(), key=lambda item: item[1]["count"], reverse=True))
        stats["by_school"] = dict(sorted(stats["by_school"].items(), key=lambda item: item[1]["count"], reverse=True))
        stats["by_sport"] = dict(sorted(stats["by_sport"].items(), key=lambda item: item[1]["count"], reverse=True))
        stats["by_gender"] = dict(sorted(stats["by_gender"].items(), key=lambda item: item[1]["count"], reverse=True))
        
        # Add summary fields
        stats["total_revenue"] = total_revenue
        stats["packs_revenue"] = packs_revenue
        stats["products_revenue"] = products_revenue
        stats["average_price_per_participant"] = total_revenue / stats["total"] if stats["total"] > 0 else 0
        
        # For each sport, calculate the maximum possible participants and set the pack17 ratio
        all_sports = await prisma.sport.find_many()
        sports_by_id = {sport.id: sport for sport in all_sports}
        for sport_id, sport_stats in stats["by_sport"].items():
            sport_info = sports_by_id.get(int(sport_id))
            if sport_info and sport_info.nbOfTeams and sport_info.nbPlayersMax:
                max_participants = sport_info.nbOfTeams * sport_info.nbPlayersMax
                sport_stats["pack17_ratio"] = sport_stats["pack17_count"] / max_participants if max_participants > 0 else None
            else:
                sport_stats["pack17_ratio"] = None
        
        return stats
    except Exception as e:
        import traceback
        print(f"Error calculating pack statistics: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))
    
    
@team_participants_router.get("/participants/details")
async def get_participants_details(
    user: Annotated[User, Depends(check_admin)],
    team_status: Optional[List[TeamStatus]] = Query(None, description="Filter by team status"),
    sport_ids: Optional[List[int]] = Query(None, description="Filter by sport IDs"),
    school_ids: Optional[List[int]] = Query(None, description="Filter by school IDs"),
    pack_ids: Optional[List[int]] = Query(None, description="Filter by pack IDs"),
    gender: Optional[List[str]] = Query(None, description="Filter by participant gender"),
    search: Optional[str] = Query(None, description="Search participants by name or email")
):
    try:
        # Build where conditions based on provided filters
        where_conditions = {}
        
        # Only include participants from specific teams if filtered
        team_where = {}
        if team_status:
            team_where["status"] = {"in": team_status}
        if sport_ids:
            team_where["sportId"] = {"in": sport_ids}
        if school_ids:
            team_where["schoolId"] = {"in": school_ids}
        if team_where:
            where_conditions["team"] = team_where
        
        # Add pack filter directly if provided
        if pack_ids:
            where_conditions["packId"] = {"in": pack_ids}
        
        # Add gender filter directly if provided
        if gender:
            where_conditions["gender"] = {"in": gender}
        
        # Add search filter on firstname, lastname, or email
        if search:
            where_conditions["OR"] = [
                {"firstname": {"contains": search, "mode": "insensitive"}},
                {"lastname": {"contains": search, "mode": "insensitive"}},
                {"email": {"contains": search, "mode": "insensitive"}}
            ]
        
        # Get all participants that match our filters, including their products
        participants = await prisma.participant.find_many(
            where=where_conditions,
            include={
                "team": {
                    "include": {
                        "sport": True,
                        "school": True
                    }
                },
                "pack": True,
                "products": True
            },
            take=502  
        )
        
        if not participants:
            return {"message": "No participants found matching the criteria", "participants": []}
        
        # Format each participant with the requested information
        participants_details = []
        for participant in participants:
            pack_price = participant.pack.priceInCents/100 if participant.pack else 0
            products_price = sum(product.priceInCents/100 for product in participant.products) if participant.products else 0
            total_price = pack_price + products_price
            
            participant_detail = {
                "id": participant.id,
                "firstname": participant.firstname,
                "lastname": participant.lastname,
                "email": participant.email,
                "mobile": participant.mobile,
                "isCaptain": participant.isCaptain,
                "gender": participant.gender or "Unknown",
                "products": [
                    {
                        "id": product.id,
                        "name": product.name,
                        "price": product.priceInCents/100
                    } for product in participant.products
                ] if participant.products else [],
                "pack": {
                    "id": participant.pack.id,
                    "name": participant.pack.name,
                    "price": pack_price
                } if participant.pack else None,
                "school": {
                    "id": participant.team.schoolId,
                    "name": participant.team.school.name if participant.team and participant.team.school else "Unknown"
                } if participant.team else None,
                "team": {
                    "id": participant.teamId,
                    "name": participant.team.name if participant.team else "Unknown"
                } if participant.teamId else None,
                "sport": {
                    "id": participant.team.sportId,
                    "name": participant.team.sport.sport if participant.team and participant.team.sport else "Unknown"
                } if participant.team else None,
                "total_price": total_price,
            }
            
            participants_details.append(participant_detail)
        
        return {
            "total": len(participants_details),
            "participants": participants_details
        }
        
    except Exception as e:
        import traceback
        print(f"Error retrieving participant details: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))
    


#Email pour le toss result 



@team_participants_router.post(
    "/{team_id}/participant/send-email-com",
    dependencies=[Depends(check_admin)],
)
async def participant_send_email_com(team_id: int):
    """
    Resend the selection notification email to all participants of a team.
    Only accessible by admins.
    """
    participants = await prisma.participant.find_many(
        where={"teamId": team_id},
        include={"team": {"include": {"sport": True}}}
    )
    
    if not participants:
        raise HTTPException(status_code=404, detail="Participant not found")

    sportId = participants[0].team.sport.id
    sent = []
    failed = []

    for participant in participants:
        try:
            await send_participant_com_email(
                participant.email,
                participant.firstname,
                sportId,
            )
            sent.append({
                "firstname": participant.firstname,
                "lastname": participant.lastname,
                "email": participant.email
            })
        except Exception as e:
            print(f"Failed to send email to participant {participant.id}: {e}")
            failed.append({
                "id": participant.id,
                "error": str(e)
            })

    return {
        "message": f"Emails sent: {len(sent)}, failed: {len(failed)}",
        "sent": sent,
        "failed": failed
    }

@team_participants_router.post(
    "/{team_id}/participant/send-email-com2",
    dependencies=[Depends(check_admin)],
)
async def participant_send_email_com2(team_id: int):
    """
    Resend the selection notification email to all participants of a team using send_participant_com_email2.
    Only accessible by admins.
    """
    participants = await prisma.participant.find_many(
        where={"teamId": team_id},
        include={"team": {"include": {"sport": True}}}
    )
    
    if not participants:
        raise HTTPException(status_code=404, detail="Participant not found")

    sportId = participants[0].team.sport.id
    sent = []
    failed = []

    for participant in participants:
        try:
            await send_participant_com_email2(
                participant.email,
                participant.firstname,
                sportId,
            )
            sent.append({
                "firstname": participant.firstname,
                "lastname": participant.lastname,
                "email": participant.email
            })
        except Exception as e:
            print(f"Failed to send email to participant {participant.id}: {e}")
            failed.append({
                "id": participant.id,
                "error": str(e)
            })

    return {
        "message": f"Emails sent: {len(sent)}, failed: {len(failed)}",
        "sent": sent,
        "failed": failed
    }