from fastapi import APIRouter, Depends
from typing import List
from prisma.models import Match, Pool, Team, Sport
from prisma.types import MatchCreateInput
from infra.prisma import getPrisma
from routes.auth.utils import check_admin, check_token
from routes.matches.utils import generate_round_robin_matches, schedule_matches
from datetime import timedelta,datetime
from pydantic import BaseModel
from fastapi import Body
from typing import Optional
from fastapi import HTTPException
import random
import math
from prisma.enums import PhaseType
from enum import Enum
from fastapi import Query




matches_router = APIRouter(
    prefix="/matches",
    tags=["matches"],
    dependencies=[Depends(check_token)],
)
prisma = getPrisma()

@matches_router.get("/{sport_id}")
async def get_match_pools(
    sport_id: int,
):
    try:
        matches = await prisma.match.find_many(
            where={
                "sportId": sport_id,
            },
            include={
                "teamOne": {
                    "include": {
                        "school": True,
                        "pools": True,
                    },
                },
                "teamTwo": {
                    "include": {
                        "school": True,
                        "pools": True,
                    },
                },
                "place": True,  # Include the place of the match
            },
            order=[
                {"matchTime": "asc"},
                {"field": "asc"},
            ],
        )
        return matches
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@matches_router.get("/unique/{match_id}")
async def get_unique_match(match_id: int):
    match = await prisma.match.find_unique(
        where={"id": match_id},
        include={
            "teamOne": {
                "include": {
                    "school": True,
                    "pools": True,
                },
            },
            "teamTwo": {
                "include": {
                    "school": True,
                    "pools": True,
                },
            },
            "place": True,  
            "sport": True,  
        },
    )
    if not match:
        raise HTTPException(status_code=404, detail="Match not found.")
    return match
    

@matches_router.post("/generate/{sport_id}", dependencies=[Depends(check_admin)])
async def generate_matches(sport_id: int):
    sport = await prisma.sport.find_unique(
        where={"id": sport_id},
        include={
            "pools": {
                "include": {
                    "teams": True,
                    "Place": True,
                }
            },
            "placesSaturday": True,
        }
    )

    if not sport:
        raise HTTPException(status_code=404, detail="Sport not found.")

    pool_match_length = sport.poolMatchLength

    # Group pools by their assigned Place and by morning/afternoon
    place_id_to_pools_morning = {}
    place_id_to_pools_afternoon = {}

    for pool in sport.pools:
        if pool.PlaceId is not None and pool.teams:
            if pool.isMorning:
                place_id_to_pools_morning.setdefault(pool.PlaceId, []).append(pool)
            else:
                place_id_to_pools_afternoon.setdefault(pool.PlaceId, []).append(pool)

    all_scheduled_matches = []

    # Schedule morning matches
    for place in sport.placesSaturday:
        pools_for_place = place_id_to_pools_morning.get(place.id, [])
        if not pools_for_place:
            continue
        matches_for_pools = []
        for pool in pools_for_place:
            pool_matches = generate_round_robin_matches(pool.teams)
            matches_for_pools.append(pool_matches)
        scheduled_matches = schedule_matches(
            pools=matches_for_pools,
            number_of_fields=place.numberOfFields,
            match_length=pool_match_length,
            start_time=place.startTime, 
        )
        for match_info in scheduled_matches:
            match_info["placeId"] = place.id
        all_scheduled_matches.extend(scheduled_matches)

    # Schedule afternoon matches
    for place in sport.placesSaturday:
        pools_for_place = place_id_to_pools_afternoon.get(place.id, [])
        if not pools_for_place:
            continue
        matches_for_pools = []
        for pool in pools_for_place:
            pool_matches = generate_round_robin_matches(pool.teams)
            matches_for_pools.append(pool_matches)
        scheduled_matches = schedule_matches(
            pools=matches_for_pools,
            number_of_fields=place.numberOfFields,
            match_length=pool_match_length,
            start_time=place.startTimeAfternoon, 
        )
        for match_info in scheduled_matches:
            match_info["placeId"] = place.id
        all_scheduled_matches.extend(scheduled_matches)

    # Save scheduled matches to the database
    for match_info in all_scheduled_matches:
        match = match_info['match']
        match_time = match_info['time_slot']
        field = match_info['field']
        place_id = match_info['placeId']

        await prisma.match.create(
            data={
                "phase": "GroupStage",
                "teamOneId": match['team_one_id'],
                "teamTwoId": match['team_two_id'],
                "sportId": sport_id,
                "matchTime": match_time,
                "field": field,
                "isScheduled": True,
                "placeId": place_id,
            }
        )

    return {"status": "Matches generated successfully"}


class MatchUpdate(BaseModel):
    field: Optional[int] = None
    matchTime: Optional[datetime] = None



@matches_router.put("/{match_id}", dependencies=[Depends(check_admin)])
async def update_match(match_id: int, update_data: MatchUpdate = Body(...)):
    update_fields = {}
    if update_data.field is not None:
        update_fields["field"] = update_data.field
    if update_data.matchTime is not None:
        update_fields["matchTime"] = update_data.matchTime

    if not update_fields:
        raise HTTPException(status_code=400, detail="No fields to update.")

    updated_match = await prisma.match.update(
        where={"id": match_id},
        data=update_fields,
    )
    return updated_match

class MatchScoreUpdate(BaseModel):
    scoreTeamOne: int
    scoreTeamTwo: int
    winnerId: Optional[int] = None  # Optionally set the winner

@matches_router.put("/start/{match_id}")
async def start_match(match_id: int):
    match = await prisma.match.update(
        where={"id": match_id},
        data={"hasStarted": True}
    )
    return match

@matches_router.put("/end/{match_id}")
async def end_match(match_id: int):
    match = await prisma.match.update(
        where={"id": match_id},
        data={"hasEnded": True}
    )
    return match





class MatchScoreUpdate(BaseModel):
    scoreTeamOne: int
    scoreTeamTwo: int


@matches_router.put("/score/{match_id}")
async def update_match_score(match_id: int, score_data: MatchScoreUpdate):
    # Fetch the match details
    match = await prisma.match.find_unique(
        where={"id": match_id}
    )
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    
    # Determine the match phase
    match_phase = match.phase  # Assuming 'phase' is a field in the match model
    
     # Fetch sport settings for points configuration
    sport_settings = await prisma.sport.find_unique(where={"id": match.sportId})
    if not sport_settings:
        raise ValueError("Sport settings not found for this match.")

        # Points configuration
    points_per_win = sport_settings.pointsperwin
    points_per_defeat = sport_settings.pointsperdefeat
    points_per_draw = sport_settings.pointsperdraw
    
    if match_phase == "GroupStage":
        # Existing logic for group stage matches

        # Fetch the previous scores and determine the previous winner
        previous_score_team_one = match.scoreTeamOne
        previous_score_team_two = match.scoreTeamTwo
        previous_winner_id = match.winnerId

        # Reverse previous match effects if the match was already scored
        if previous_score_team_one is not None and previous_score_team_two is not None:
            # Undo goals scored and conceded
            await prisma.team.update(
                where={"id": match.teamOneId},
                data={
                    "goalsScored": {"decrement": previous_score_team_one},
                    "goalsConceded": {"decrement": previous_score_team_two},
                },
            )
            await prisma.team.update(
                where={"id": match.teamTwoId},
                data={
                    "goalsScored": {"decrement": previous_score_team_two},
                    "goalsConceded": {"decrement": previous_score_team_one},
                },
            )

            # Undo tournament points and match stats
            if previous_score_team_one > previous_score_team_two:
                # Team One was the previous winner
                await prisma.team.update(
                    where={"id": match.teamOneId},
                    data={
                        "tournamentPoints": {"decrement": points_per_win},
                        "poolmatcheswon": {"decrement": 1},
                    },
                )
                await prisma.team.update(
                    where={"id": match.teamTwoId},
                    data={
                        "tournamentPoints": {"decrement": points_per_defeat},
                        "poolmatcheslost": {"decrement": 1},
                    },
                )
            elif previous_score_team_two > previous_score_team_one:
                # Team Two was the previous winner
                await prisma.team.update(
                    where={"id": match.teamTwoId},
                    data={
                        "tournamentPoints": {"decrement": points_per_win},
                        "poolmatcheswon": {"decrement": 1},
                    },
                )
                await prisma.team.update(
                    where={"id": match.teamOneId},
                    data={
                        "tournamentPoints": {"decrement": points_per_defeat},
                        "poolmatcheslost": {"decrement": 1},
                    },
                )
            else:
                # It was a draw
                await prisma.team.update(
                    where={"id": match.teamOneId},
                    data={
                        "tournamentPoints": {"decrement": points_per_draw},
                        "poolmatchesdraw": {"decrement": 1},
                    },
                )
                await prisma.team.update(
                    where={"id": match.teamTwoId},
                    data={
                        "tournamentPoints": {"decrement": points_per_draw},
                        "poolmatchesdraw": {"decrement": 1},
                    },
                )


        # Calculate the winner and assign points
        winner_id = None
        points_team_one = 0
        points_team_two = 0
        team_one_update = {}
        team_two_update = {}

        if score_data.scoreTeamOne > score_data.scoreTeamTwo:
            winner_id = match.teamOneId
            points_team_one = points_per_win
            points_team_two = points_per_defeat
            team_one_update = {"poolmatcheswon": {"increment": 1}}
            team_two_update = {"poolmatcheslost": {"increment": 1}}
        elif score_data.scoreTeamTwo > score_data.scoreTeamOne:
            winner_id = match.teamTwoId
            points_team_one = points_per_defeat
            points_team_two = points_per_win
            team_one_update = {"poolmatcheslost": {"increment": 1}}
            team_two_update = {"poolmatcheswon": {"increment": 1}}
        else:
            points_team_one = points_per_draw
            points_team_two = points_per_draw
            team_one_update = {"poolmatchesdraw": {"increment": 1}}
            team_two_update = {"poolmatchesdraw": {"increment": 1}}

        # Update match result
        await prisma.match.update(
            where={"id": match_id},
            data={
                "scoreTeamOne": score_data.scoreTeamOne,
                "scoreTeamTwo": score_data.scoreTeamTwo,
                "winnerId": winner_id,
            },
        )

        # Update goals scored and conceded for both teams
        await prisma.team.update(
            where={"id": match.teamOneId},
            data={
                "goalsScored": {"increment": score_data.scoreTeamOne},
                "goalsConceded": {"increment": score_data.scoreTeamTwo},
                "tournamentPoints": {"increment": points_team_one},
                **team_one_update,
            },
        )
        await prisma.team.update(
            where={"id": match.teamTwoId},
            data={
                "goalsScored": {"increment": score_data.scoreTeamTwo},
                "goalsConceded": {"increment": score_data.scoreTeamOne},
                "tournamentPoints": {"increment": points_team_two},
                **team_two_update,
            },
        )
    
    else:
        # Determine the winner based on the scores
        if score_data.scoreTeamOne > score_data.scoreTeamTwo:
            winner_id = match.teamOneId
        elif score_data.scoreTeamTwo > score_data.scoreTeamOne:
            winner_id = match.teamTwoId
        else:
            # Handle draw scenarios in knockout (e.g., penalties)
            # Assuming `winnerId` must be set; you might need additional data to determine the winner
            raise HTTPException(status_code=400, detail="Knockout matches must have a clear winner")

        # Update match result without altering goals, points, or stats
        await prisma.match.update(
            where={"id": match_id},
            data={
                "scoreTeamOne": score_data.scoreTeamOne,
                "scoreTeamTwo": score_data.scoreTeamTwo,
                "winnerId": winner_id,
            },
        )

    return {"status": "Score and match result updated successfully"}

@matches_router.get(
    "/group-stage/team/{team_id}",
    response_model=List[Match],
    dependencies=[Depends(check_admin)],
)
async def get_group_stage_matches_for_team(team_id: int):
    
    matches = await prisma.match.find_many(
        where={
            "phase": PhaseType.GroupStage,  # Use enum for phase if defined
            "OR": [
                {"teamOneId": team_id},
                {"teamTwoId": team_id}
            ]
        },
        include={
            "teamOne": {
                "include": {
                    "school": True,
                }
            },
            "teamTwo": {
                "include": {
                    "school": True,
                }
            }
        },
        order=[
            {"matchTime": "asc"},
            {"field": "asc"},
        ],
    )

    # If no matches found, check if the team exists
    if not matches:
        team = await prisma.team.find_unique(where={"id": team_id})
        if not team:
            raise HTTPException(status_code=404, detail="Team not found")
        # Team exists but has no GroupStage matches
        return []

    return matches

@matches_router.get(
    "/knockout/team/{team_id}",
    response_model=List[Match],
    dependencies=[Depends(check_admin)],
)
async def get_group_stage_matches_for_team(team_id: int):
    # Fetch the sport associated with the team to get startTimeSunday
    team = await prisma.team.find_unique(
        where={"id": team_id},
        include={"sport": True},
    )

    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    start_time_sunday = team.sport.startTimeSunday

    # Fetch matches where matchTime > startTimeSunday
    matches = await prisma.match.find_many(
        where={
            "matchTime": {"gte": start_time_sunday},
            "OR": [
                {"teamOneId": team_id},
                {"teamTwoId": team_id},
            ],
        },
        include={
            "teamOne": {
                "include": {"school": True},
            },
            "teamTwo": {
                "include": {"school": True},
            },
        },
        order=[
            {"matchTime": "asc"},
            {"field": "asc"},
        ],
    )

    return matches



@matches_router.get(
    "/all/team/{team_id}",
    response_model=List[Match],
    dependencies=[Depends(check_admin)],
)
async def get_group_stage_matches_for_team(team_id: int):
    team = await prisma.team.find_unique(
        where={"id": team_id},
    )

    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    # Fetch matches where matchTime > startTimeSunday
    matches = await prisma.match.find_many(
        where={
            "OR": [
                {"teamOneId": team_id},
                {"teamTwoId": team_id},
            ],
        },
        include={
            "teamOne": {
                "include": {"school": True},
            },
            "teamTwo": {
                "include": {"school": True},
            },
        },
        order=[
            {"matchTime": "asc"},
            {"field": "asc"},
        ],
    )

    return matches




### Permet de créer un match à la main au cas ou le système de génération automatique ne fonctionne pas ###



class MatchCreate(BaseModel):
    phase: PhaseType
    teamOneId: Optional[int] 
    teamTwoId: Optional[int] 
    teamOneSource: Optional[str]
    teamTwoSource: Optional[str]
    field: int 
    matchTime: datetime
    sportId: int
    placeId: Optional[int]

    
@matches_router.post("/create", dependencies=[Depends(check_admin)], response_model=Match)
async def create_match(match: MatchCreate):
    # Validate that sport exists
    sport = await prisma.sport.find_unique(where={"id": match.sportId})
    if not sport:
        raise HTTPException(status_code=404, detail="Sport not found.")

    # Validate that teams exist if provided
    if match.teamOneId:
        team_one = await prisma.team.find_unique(where={"id": match.teamOneId})
        if not team_one:
            raise HTTPException(status_code=404, detail="Team One not found.")
    if match.teamTwoId:
        team_two = await prisma.team.find_unique(where={"id": match.teamTwoId})
        if not team_two:
            raise HTTPException(status_code=404, detail="Team Two not found.")

    # Create the match
    try:
        new_match = await prisma.match.create(
            data={
                "phase": match.phase,
                "teamOneId": match.teamOneId,
                "teamTwoId": match.teamTwoId,
                "field": match.field,
                "matchTime": match.matchTime,
                "sportId": match.sportId,
                "isScheduled": True,
                "hasStarted": False,
                "hasEnded": False,
                "placeId": match.placeId,
                "teamOneSource": match.teamOneSource,
                "teamTwoSource": match.teamTwoSource,
        }
        )
        return new_match
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

#Permet de modifier un match 


class MatchModifyRequest(BaseModel):
    phase: Optional[PhaseType] = None
    teamOneId: Optional[int] = None
    teamTwoId: Optional[int] = None
    teamOneSource: Optional[str] = None
    teamTwoSource: Optional[str] = None
    field: Optional[int] = None
    matchTime: Optional[datetime] = None
    sportId: Optional[int] = None
    placeId: Optional[int] = None
    isScheduled: Optional[bool] = None
    hasStarted: Optional[bool] = None
    hasEnded: Optional[bool] = None

@matches_router.put("/modify/{match_id}", dependencies=[Depends(check_admin)], response_model=Match)
async def modify_match(match_id: int, data: MatchModifyRequest = Body(...)):
    match = await prisma.match.find_unique(where={"id": match_id})
    if not match:
        raise HTTPException(status_code=404, detail="Match not found.")

    update_data = {k: v for k, v in data.dict(exclude_unset=True).items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update.")

    updated_match = await prisma.match.update(
        where={"id": match_id},
        data=update_data
    )
    return updated_match


    
##Permet d'effacer un match 

@matches_router.delete("/{match_id}", dependencies=[Depends(check_admin)])
async def delete_match(match_id: int):
    # Fetch the match details
    match = await prisma.match.find_unique(where={"id": match_id})
    if not match:
        raise HTTPException(status_code=404, detail="Match not found.")

    # Fetch sport settings for points configuration
    sport_settings = await prisma.sport.find_unique(where={"id": match.sportId})
    if not sport_settings:
        raise ValueError("Sport settings not found for this match.")

    # Points configuration
    points_per_win = sport_settings.pointsperwin
    points_per_defeat = sport_settings.pointsperdefeat
    points_per_draw = sport_settings.pointsperdraw

    # Check if the match has ended
    if match.hasEnded:
        previous_score_team_one = match.scoreTeamOne
        previous_score_team_two = match.scoreTeamTwo

        if match.phase == PhaseType.GroupStage:
            # Reverse the effects of the match for GroupStage
            if previous_score_team_one is not None and previous_score_team_two is not None:
                # Undo goals scored and conceded
                await prisma.team.update(
                    where={"id": match.teamOneId},
                    data={
                        "goalsScored": {"decrement": previous_score_team_one},
                        "goalsConceded": {"decrement": previous_score_team_two},
                    },
                )
                await prisma.team.update(
                    where={"id": match.teamTwoId},
                    data={
                        "goalsScored": {"decrement": previous_score_team_two},
                        "goalsConceded": {"decrement": previous_score_team_one},
                    },
                )

                # Undo tournament points and match stats
                if previous_score_team_one > previous_score_team_two:
                    # Team One was the winner
                    await prisma.team.update(
                        where={"id": match.teamOneId},
                        data={
                            "tournamentPoints": {"decrement": points_per_win},
                            "poolmatcheswon": {"decrement": 1},
                        },
                    )
                    await prisma.team.update(
                        where={"id": match.teamTwoId},
                        data={
                            "tournamentPoints": {"decrement": points_per_defeat},
                            "poolmatcheslost": {"decrement": 1},
                        },
                    )
                elif previous_score_team_two > previous_score_team_one:
                    # Team Two was the winner
                    await prisma.team.update(
                        where={"id": match.teamTwoId},
                        data={
                            "tournamentPoints": {"decrement": points_per_win},
                            "poolmatcheswon": {"decrement": 1},
                        },
                    )
                    await prisma.team.update(
                        where={"id": match.teamOneId},
                        data={
                            "tournamentPoints": {"decrement": points_per_defeat},
                            "poolmatcheslost": {"decrement": 1},
                        },
                    )
                else:
                    # It was a draw
                    await prisma.team.update(
                        where={"id": match.teamOneId},
                        data={
                            "tournamentPoints": {"decrement": points_per_draw},
                            "poolmatchesdraw": {"decrement": 1},
                        },
                    )
                    await prisma.team.update(
                        where={"id": match.teamTwoId},
                        data={
                            "tournamentPoints": {"decrement": points_per_draw},
                            "poolmatchesdraw": {"decrement": 1},
                        },
                    )

    # Delete the match
    await prisma.match.delete(where={"id": match_id})

    return {"message": "Match deleted successfully, and team stats updated if applicable."}


@matches_router.delete("/sport/{sport_id}/all", dependencies=[Depends(check_admin)])
async def delete_all_matches_of_sport(sport_id: int):
    # Fetch all matches for the given sport
    matches = await prisma.match.find_many(where={"sportId": sport_id})
    deleted_count = 0

    for match in matches:
        await prisma.match.delete(where={"id": match.id})
        deleted_count += 1

    return {"message": f"Deleted {deleted_count} matches for sport {sport_id}."}


#pour le teamOneSource et teamTwoSource, on va chercher les id des équipes en fonction de la source

from fastapi import APIRouter, HTTPException
from typing import Optional

@matches_router.post("/resolve-sources/sport/{sport_id}", dependencies=[Depends(check_admin)])
async def resolve_match_sources(sport_id: int):
    matches = await prisma.match.find_many(
        where={
            "sportId": sport_id,
            "OR": [
                {"AND": [{"teamOneId": None}, {"teamOneSource": {"not": None}}]},
                {"AND": [{"teamTwoId": None}, {"teamTwoSource": {"not": None}}]},
            ]
        }
    )
    updated_count = 0

    for match in matches:
        updated = False
        team_one_id = match.teamOneId
        team_two_id = match.teamTwoId

        # Resolve teamOneSource if needed
        if match.teamOneSource and not team_one_id:
            team_id = await resolve_team_source(match.teamOneSource, match.sportId)
            if team_id:
                team_one_id = team_id
                updated = True

        # Resolve teamTwoSource if needed
        if match.teamTwoSource and not team_two_id:
            team_id = await resolve_team_source(match.teamOneSource, match.sportId)
            if team_id:
                team_two_id = team_id
                updated = True

        if updated:
            await prisma.match.update(
                where={"id": match.id},
                data={
                    "teamOneId": team_one_id,
                    "teamTwoId": team_two_id,
                },
            )
            updated_count += 1

    return {"status": "ok", "updated_matches": updated_count}


async def resolve_team_source(source: str, sport_id: int) -> Optional[int]:
    if source.startswith("winner:"):
        match_id = int(source.split(":")[1])
        ref_match = await prisma.match.find_unique(where={"id": match_id})
        if not ref_match or ref_match.scoreTeamOne is None or ref_match.scoreTeamTwo is None:
            return None
        if ref_match.scoreTeamOne > ref_match.scoreTeamTwo:
            return ref_match.teamOneId
        if ref_match.scoreTeamTwo > ref_match.scoreTeamOne:
            return ref_match.teamTwoId
        return None  # Draw or not played

    if source.startswith("loser:"):
        match_id = int(source.split(":")[1])
        ref_match = await prisma.match.find_unique(where={"id": match_id})
        if not ref_match or ref_match.scoreTeamOne is None or ref_match.scoreTeamTwo is None:
            return None
        if ref_match.scoreTeamOne < ref_match.scoreTeamTwo:
            return ref_match.teamOneId
        if ref_match.scoreTeamTwo < ref_match.scoreTeamOne:
            return ref_match.teamTwoId
        return None  # Draw or not played

    if source.startswith("rank:"):
        _, rank, pool_id = source.split(":")
        team = await get_team_by_pool_rank(int(pool_id), int(rank))
        return team.id if team else None
    
    if source.startswith("best:"):
        from routes.pools import get_single_pool_ranking

        parts = source.split(":")
        rank = int(parts[1])
        nth = int(parts[2]) if len(parts) > 2 else 1

        pools = await prisma.pool.find_many(where={"sportId": sport_id})
        ranked_teams = []
        for pool in pools:
            ranking = await get_single_pool_ranking(pool.id)
            teams = ranking["teams"]
            if len(teams) >= rank:
                ranked_teams.append(teams[rank - 1])  

        if len(ranked_teams) >= nth:
            team_id = ranked_teams[nth - 1]["id"]
            team = await prisma.team.find_unique(where={"id": team_id})
            return team.id if team else None
        return None

    return None

async def get_team_by_pool_rank(pool_id: int, rank: int):
    # Use your pool ranking logic from pools.py
    from routes.pools import get_single_pool_ranking
    ranking = await get_single_pool_ranking(pool_id)
    if not ranking or not ranking["teams"]:
        return None
    teams = ranking["teams"]
    if 0 < rank <= len(teams):
        # rank is 1-based
        team_id = teams[rank - 1]["id"]
        team = await prisma.team.find_unique(where={"id": team_id})
        return team
    return None


@matches_router.post("/resolve-sources/{match_id}", dependencies=[Depends(check_admin)])
async def resolve_single_match_sources(match_id: int):
    match = await prisma.match.find_unique(where={"id": match_id})
    if not match:
        raise HTTPException(status_code=404, detail="Match not found.")

    updated = False
    team_one_id = match.teamOneId
    team_two_id = match.teamTwoId

    # Always resolve teamOneSource if present
    if match.teamOneSource:
        team_id = await resolve_team_source(match.teamOneSource, match.sportId)
        if team_id != team_one_id:
            team_one_id = team_id
            updated = True

    # Always resolve teamTwoSource if present
    if match.teamTwoSource:
        team_id = await resolve_team_source(match.teamTwoSource, match.sportId)
        if team_id != team_two_id:
            team_two_id = team_id
            updated = True

    if updated:
        await prisma.match.update(
            where={"id": match.id},
            data={
                "teamOneId": team_one_id,
                "teamTwoId": team_two_id,
            },
        )
        return {"status": "ok", "updated": True}
    else:
        return {"status": "ok", "updated": False, "message": "No sources to resolve or already up to date."}
    
    
    
@matches_router.post("/clear-resolved-sources/{match_id}", dependencies=[Depends(check_admin)])
async def clear_resolved_sources(match_id: int):
    match = await prisma.match.find_unique(
        where={
            "id": match_id,
            "AND": [
                {"AND": [{"teamOneSource": {"not": None}}, {"teamOneId": {"not": None}}]},
                {"AND": [{"teamTwoSource": {"not": None}}, {"teamTwoId": {"not": None}}]},
            ]
        }
    )
    
    if not match:
        raise HTTPException(status_code=404, detail="Match not found.")

    update_data = {}
    if match.teamOneSource and match.teamOneId is not None:
        update_data["teamOneId"] = None
    if match.teamTwoSource and match.teamTwoId is not None:
        update_data["teamTwoId"] = None
    if update_data:
        await prisma.match.update(
            where={"id": match.id},
            data=update_data
        )

    return {"status": "ok"}