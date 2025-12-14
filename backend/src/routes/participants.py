# Ce fichier est exlucsivement dédié aux routes liées aux participants pour le toss result
from typing import List, Optional
from fastapi import APIRouter, Depends, Body, HTTPException
from pydantic import BaseModel
from prisma.models import Participant, Team, School, Pool, Pack
from infra.prisma import getPrisma  # type: ignore
from routes.auth.utils import check_super_admin, check_token, check_admin  # type: ignore
from fastapi import Query

participant_router = APIRouter(
    prefix="/participants",
    tags=["participants"],
    dependencies=[Depends(check_token)],
)
prisma = getPrisma()

class ParticipantUpdate(BaseModel):
    lieutenteId: Optional[int] = None
    lieupetitdejsamediId: Optional[int] = None
    lieudejsamediId: Optional[int] = None
    lieudinersamediId: Optional[int] = None
    lieupetitdejdimancheId: Optional[int] = None
    lieudejdimancheId: Optional[int] = None
    heurepetitdejsamedi: Optional[str] = None
    heuredejsamedi: Optional[str] = None
    heuredinersamedi: Optional[str] = None
    heurepetitdejdimanche: Optional[str] = None
    heuredejdimanche: Optional[str] = None
    navettesamedialler: Optional[str] = None
    navettesamediretour: Optional[str] = None
    navettedimanchealler: Optional[str] = None
    navettedimancheretour: Optional[str] = None
    numerotente: Optional[str] = None

@participant_router.put("/group/batch", response_model=dict)
async def batch_update_participants(
    updates: ParticipantUpdate = Body(...),
    team_id: Optional[int] = None,
    school_id: Optional[int] = None,
    pool_id: Optional[int] = None,
    pack_ids: Optional[List[int]] = Query(None),
):
    if not updates:
        raise HTTPException(status_code=400, detail="Updates cannot be empty.")

    # Build the filtering query
    filters = {}
    if team_id:
        filters["teamId"] = team_id
    if school_id:
        filters["schoolId"] = school_id
    if pool_id:
        # Fetch participants by pool
        pool = await prisma.pool.find_unique(
            where={"id": pool_id},
            include={"teams": {"include": {"participants": True}}},
        )
        if not pool or not pool.teams:
            raise HTTPException(status_code=404, detail="No participants found for this pool")
        participant_ids = [
            participant.id for team in pool.teams for participant in team.participants
        ]
        filters["id"] = {"in": participant_ids}

    if pack_ids:
        filters["packId"] = {"in": pack_ids}  # Filter participants by pack IDs

    # Fetch participants to ensure valid filtering
    participants = await prisma.participant.find_many(where=filters)
    if not participants:
        raise HTTPException(status_code=404, detail="No participants match the specified criteria")

    # Update participants
    for participant in participants:
        await prisma.participant.update(
            where={"id": participant.id},
            data=updates.dict(exclude_unset=True),
        )

    return {"status": "success", "updated_participants": len(participants)}


# Route to fetch participants for validation or reporting
@participant_router.get("/", response_model=dict)
async def get_participants(
    team_id: Optional[int] = None,
    school_id: Optional[int] = None,
    pool_id: Optional[int] = None,
):
    filters = {}
    if team_id:
        filters["teamId"] = team_id
    if school_id:
        filters["schoolId"] = school_id
    if pool_id:
        # Fetch participants by pool
        pool = await prisma.pool.find_unique(
            where={"id": pool_id},
            include={"teams": {"include": {"participants": True}}},
        )
        if not pool or not pool.teams:
            raise HTTPException(status_code=404, detail="No participants found for this pool")
        participant_ids = [
            participant.id for team in pool.teams for participant in team.participants
        ]
        filters["id"] = {"in": participant_ids}

    participants = await prisma.participant.find_many(where=filters)
    return {"participants": participants}


# Route for updating a single participant
@participant_router.put("/{participant_id}", response_model=Participant)
async def update_participant(participant_id: int, updates: ParticipantUpdate):
    participant = await prisma.participant.find_unique(where={"id": participant_id})
    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found.")

    updated_participant = await prisma.participant.update(
        where={"id": participant_id},
        data=updates.dict(exclude_unset=True)  # Only include fields that were sent
    )
    return updated_participant




#Get all the participants of a given team 

@participant_router.get("/team/{team_id}", dependencies=[Depends(check_admin)], response_model=List[Participant])
async def get_team_participants(team_id: int):
    # Query participants where the team_id matches the provided team_id
    participants = await prisma.participant.find_many(
        where={"teamId": team_id}, 
        include={  
            "pack": True,
            "lieutente": True,
            "lieupetitdejsamedi": True,
            "lieupetitdejdimanche": True,
            "lieudejsamedi": True,
            "lieudejdimanche": True,
            "lieudinersamedi": True,
        }
    )

    if not participants:
        raise HTTPException(status_code=404, detail="Participants not found for this team.")

    return participants




class Lieutente(BaseModel):
    id: int
    name: str  # Replace with the actual fields of the 'Place' model

    class Config:
        orm_mode = True
        
class Pack(BaseModel):
    id: int
    name: str  # Replace with your actual pack fields

    class Config:
        orm_mode = True

        
class Participant(BaseModel):
    id: int
    firstname: str
    lastname: str
    email: str
    numerotente: Optional[str]
    pack: Pack  # Add the Pack model
    lieutente: Optional[Lieutente]  # Add the Lieutente model, it may be null

    class Config:
        orm_mode = True

@participant_router.get("/search", response_model=List[Participant])
async def search_participants(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    search: Optional[str] = None,
):
    # Pagination logic
    skip = (page - 1) * page_size

    # Construct filters if search query is provided
    filters = {}
    if search:
        filters['OR'] = [
            {'firstname': {'contains': search, 'mode': 'insensitive'}},
            {'lastname': {'contains': search, 'mode': 'insensitive'}},
            {'email': {'contains': search, 'mode': 'insensitive'}}
        ]

    # Fetch participants with pagination, search filters, and include 'pack' and 'lieutente'
    participants = await prisma.participant.find_many(
        where=filters,
        skip=skip,
        take=page_size,
        include={
            "pack": True,  # Include the Pack relation
            "lieutente": True  # Include the Lieutente relation
        }
    )

    return participants



@participant_router.get("/sport/{sport_id}/schools")
async def get_schools_teams_captains_products_packs(sport_id: int):
    # Fetch all teams for the sport, including school and participants
    teams = await prisma.team.find_many(
        where={
            "sportId": sport_id,
            "status": {"in": ["Validated", "PrincipalList"]},
        },
        include={
            "school": True,
            "participants": {
                "include": {
                    "pack": True,
                    "products": True,
                }
            }
        }
    )

    # Group teams by school
    schools_dict = {}
    for team in teams:
        school_id = team.school.id
        if school_id not in schools_dict:
            schools_dict[school_id] = {
                "school_name": team.school.name,
                "teams": []
            }

        # Find captain (adjust logic if you use a different method)
        captain = next((p for p in team.participants if getattr(p, "isCaptain", False)), None)
        if not captain and hasattr(team, "captainId"):
            captain = next((p for p in team.participants if p.id == team.captainId), None)

        # Count packs
        packs_count = {}
        participant_count = 0
        participant_not_validated = []
        for participant in team.participants:
            participant_count += 1
            if not participant.cautionOK:
               # collect (first, last) in a list
               participant_not_validated.append(
                   [participant.firstname, participant.lastname]
               )
            if participant.pack:
                pack_name = participant.pack.name
                packs_count[pack_name] = packs_count.get(pack_name, 0) + 1

        # Count products
        products_count = {}
        for participant in team.participants:
            for product in participant.products:
                product_name = product.name
                products_count[product_name] = products_count.get(product_name, 0) + 1

        schools_dict[school_id]["teams"].append({
            "team_name": team.name,
            "status": team.status,    
            "number_of_participants": participant_count,
            "captain_name": f"{captain.firstname} {captain.lastname}" if captain else None,
            "captain_phone": captain.mobile if captain else None,
            "packs_count": packs_count,
            "products_count": products_count,
            "participant_not_validated": participant_not_validated,
        })

    # Return as a list of schools
    return list(schools_dict.values())


@participant_router.get("/team/{team_id}/convocation-links", response_model=List[dict])
async def get_team_convocation_links(team_id: int):
    prisma = getPrisma()
    participants = await prisma.participant.find_many(
        where={"teamId": team_id},
    )
    return [
        {
            "prenom": p.firstname,
            "nom": p.lastname,
            "convocationLink": p.convocationLink,
        }
        for p in participants
    ]
    