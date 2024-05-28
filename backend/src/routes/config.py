from datetime import datetime
from fastapi import APIRouter, Depends

from prisma.models import GeneralConfig
from prisma.types import GeneralConfigWhereUniqueInput
from pydantic import BaseModel

from infra.prisma import getPrisma  # type: ignore
from routes.auth.utils import check_super_admin, check_token  # type: ignore

config_router = APIRouter(
    prefix="/config",
    tags=["configurations"],
    dependencies=[Depends(check_token)],
)
prisma = getPrisma()


class GeneralConfigUpdate(BaseModel):
    editionYear: int
    isRegistrationOpen: bool
    isPaymentOpen: bool
    expectedRegistrationDate: datetime


@config_router.get("", response_model=GeneralConfig)
async def get_config():
    config = await prisma.generalconfig.find_first()
    return config


@config_router.put(
    "", response_model=GeneralConfig, dependencies=[Depends(check_super_admin)]
)
async def update_config(config: GeneralConfigUpdate):
    updated_config = await prisma.generalconfig.update(
        where=GeneralConfigWhereUniqueInput(id=1),
        data=dict(
            editionYear=config.editionYear,
            isRegistrationOpen=config.isRegistrationOpen,
            isPaymentOpen=config.isPaymentOpen,
            expectedRegistrationDate=config.expectedRegistrationDate,
        ),
    )
    return updated_config
