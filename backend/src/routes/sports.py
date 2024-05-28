from typing import List
from fastapi import APIRouter, Depends

from prisma.models import Sport
from prisma.types import (
    SportCreateInput,
    SportInclude,
    SportWhereUniqueInput,
    FindManyTeamArgsFromSport,
    TeamIncludeFromTeamRecursive1,
)

from infra.prisma import getPrisma  # type: ignore
from routes.auth.utils import check_super_admin, check_token, check_admin  # type: ignore

sports_router = APIRouter(
    prefix="/sports",
    tags=["sports"],
    dependencies=[Depends(check_token)],
)
prisma = getPrisma()


@sports_router.get("", response_model=List[Sport])
async def get_all_sports():
    packs = await prisma.sport.find_many()
    return packs


@sports_router.get(
    "/{sport_id}", response_model=Sport, dependencies=[Depends(check_admin)]
)
async def get_sport(sport_id: int):
    sport = await prisma.sport.find_unique(
        where=SportWhereUniqueInput(id=sport_id),
        include=SportInclude(
            teams=FindManyTeamArgsFromSport(
                include=TeamIncludeFromTeamRecursive1(
                    participants=True, school=True
                )
            )
        ),
    )
    return sport


@sports_router.post(
    "/",
    response_model=Sport,
    dependencies=[Depends(check_super_admin)],
)
async def create_sport(
    sport: str,
    nb_of_teams: int,
    nb_players_min: int,
    nb_players_max: int,
    is_collective: bool,
):
    new_sport = await prisma.sport.create(
        data=SportCreateInput(
            sport=sport,
            nbOfTeams=nb_of_teams,
            nbPlayersMin=nb_players_min,
            nbPlayersMax=nb_players_max,
            isCollective=is_collective,
        )
    )
    return new_sport


@sports_router.put(
    "/{sport_id}",
    response_model=Sport,
    dependencies=[Depends(check_super_admin)],
)
async def update_sport(
    sport_id: int,
    sport: str,
    nb_of_teams: int,
    nb_players_min: int,
    nb_players_max: int,
    is_collective: bool,
):
    updated_sport = await prisma.sport.update(
        where=SportWhereUniqueInput(id=sport_id),
        data=SportCreateInput(
            sport=sport,
            nbOfTeams=nb_of_teams,
            nbPlayersMin=nb_players_min,
            nbPlayersMax=nb_players_max,
            isCollective=is_collective,
        ),
    )
    return updated_sport


@sports_router.delete("/{sport_id}", dependencies=[Depends(check_super_admin)])
async def delete_sport(sport_id: int):
    await prisma.sport.delete(where=SportWhereUniqueInput(id=sport_id))
