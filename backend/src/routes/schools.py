from typing import List
from fastapi import APIRouter, Depends, HTTPException
from prisma.models import School

from prisma.types import (
    SchoolCreateInput,
    SchoolWhereUniqueInput,
    SchoolInclude,
    TeamSumAggregateInput,
    TeamWhereInput,
    TeamUpdateInput,
    TeamWhereUniqueInput,
)

from infra.prisma import getPrisma  # type: ignore
from routes.auth.utils import check_super_admin  # type: ignore


schools_router = APIRouter(
    prefix="/schools", tags=["schools"], dependencies=[])
prisma = getPrisma()


@schools_router.get("", response_model=List[School], dependencies=[])
async def get_all_schools():
    schools = await prisma.school.find_many()
    return schools


@schools_router.post(
    "/", response_model=School, dependencies=[Depends(check_super_admin)]
)
async def create_school(name: str):
    school = await prisma.school.create(
        data=SchoolCreateInput(name=name)
    )
    return school


@schools_router.put(
    "/{school_id}",
    response_model=School,
    dependencies=[Depends(check_super_admin)],
)
async def update_school(school_id: int, name: str):
    school = await prisma.school.update(
        where=SchoolWhereUniqueInput(id=school_id),
        data=SchoolCreateInput(name=name),
    )
    return school


@schools_router.delete(
    "/{school_id}", dependencies=[Depends(check_super_admin)]
)
async def delete_school(school_id: int):
    await prisma.school.delete(
        where=SchoolWhereUniqueInput(id=school_id),
    )


@schools_router.put(
    "/{school_id}/paid", dependencies=[Depends(check_super_admin)]
)
async def school_paid(school_id: int, amountPaidInCents: int):

    school = await prisma.school.find_unique(
        where=SchoolWhereUniqueInput(id=school_id),
        include=SchoolInclude(teams=True),
    )

    if school is None:
        raise HTTPException(
            status_code=400,
            detail="This school does not exist",
        )

    # Ajout de la condition pour filtrer uniquement les équipes sur la liste principale
    amounts = await prisma.team.group_by(
        by=["schoolId"],
        sum=TeamSumAggregateInput(
            amountPaidInCents=True,
            amountToPayInCents=True,
        ),
        where=TeamWhereInput(schoolId=school_id, status="PrincipalList"),
    )
    schoolAmountPaidInCents = amounts[0]["_sum"]["amountPaidInCents"]
    schoolAmountToPayInCents = amounts[0]["_sum"]["amountToPayInCents"]

    schoolAmountLeftToPayInCents = (
        schoolAmountToPayInCents - schoolAmountPaidInCents
    )

    if schoolAmountLeftToPayInCents <= 0:
        raise HTTPException(
            status_code=400,
            detail="No payment needed",
        )

    if amountPaidInCents != schoolAmountLeftToPayInCents:
        raise HTTPException(
            status_code=400,
            detail={
                "error": f"Amount paid does not match the amount left to pay : amountPaidInCents[{amountPaidInCents}] != schoolAmountLeftToPayInCents[{schoolAmountLeftToPayInCents}]",
                "schoolAmountLeftToPayInCents": schoolAmountLeftToPayInCents,
                "amountPaidInCents": amountPaidInCents,
            },
        )

    # Mettre à jour uniquement les équipes sur la liste principale
    teams = await prisma.team.find_many(
        where=TeamWhereInput(schoolId=school_id, status="PrincipalList"),
    )
    for team in teams:
        await prisma.team.update(
            where=TeamWhereUniqueInput(id=team.id),
            data=TeamUpdateInput(
                amountPaidInCents=team.amountToPayInCents,
            ),
        )
