from fastapi import APIRouter, Depends, HTTPException
from prisma.models import User


from prisma.models import Payment
from prisma.types import (
    PaymentCreateInput,
    PaymentInclude,
    TeamArgsFromPayment,
    TeamIncludeFromTeamRecursive1,
    PaymentWhereUniqueInput,
    PaymentUpdateInput,
)
from prisma.enums import PaymentStatus

from routes.payment.utils import (  # type: ignore
    check_lydia_payment_state,
    generate_hmac,
    request_lydia_payment_url,
    update_payment_after_confirmation,
)

from routes.teams.utils import get_team_if_allowed  # type: ignore

from infra.prisma import getPrisma  # type: ignore
from routes.auth.utils import check_user, check_admin  # type: ignore

payment_router = APIRouter(prefix="/payment", tags=["payment"])
prisma = getPrisma()


@payment_router.post("/confirm")
async def confirm_payment(payment_id: int, hash: str):

    if not hash == generate_hmac(payment_id):
        try:
            await prisma.payment.update(
                where=PaymentWhereUniqueInput(id=payment_id),
                data=PaymentUpdateInput(paymentStatus=PaymentStatus.Forged),
            )
        except Exception:
            raise HTTPException(status_code=403)
        raise HTTPException(status_code=403)

    payment = await prisma.payment.find_unique(
        where=PaymentWhereUniqueInput(id=payment_id),
    )
    if payment is None or payment.paymentStatus != PaymentStatus.Pending:
        raise HTTPException(
            status_code=404,
            detail="Payment not found or not pending",
        )
    await update_payment_after_confirmation(payment)
    return {"status": "ok"}


@payment_router.post("/cancel")
async def cancel_payment(payment_id: int, hash: str):

    if not hash == generate_hmac(payment_id):
        try:
            await prisma.payment.update(
                where=PaymentWhereUniqueInput(id=payment_id),
                data=PaymentUpdateInput(paymentStatus=PaymentStatus.Forged),
            )
        except Exception:
            raise HTTPException(status_code=403)
        raise HTTPException(status_code=403)

    await prisma.payment.update(
        where=PaymentWhereUniqueInput(id=payment_id),
        data=PaymentUpdateInput(paymentStatus=PaymentStatus.Canceled),
    )
    return {"status": "ok"}


@payment_router.post("/expire")
async def expire_payment(payment_id: int, hash: str):

    if not hash == generate_hmac(payment_id):
        try:
            await prisma.payment.update(
                where=PaymentWhereUniqueInput(id=payment_id),
                data=PaymentUpdateInput(paymentStatus=PaymentStatus.Forged),
            )
        except Exception:
            raise HTTPException(status_code=403)
        raise HTTPException(status_code=403)

    await prisma.payment.update(
        where=PaymentWhereUniqueInput(id=payment_id),
        data=PaymentUpdateInput(paymentStatus=PaymentStatus.Canceled),
    )
    return {"status": "ok"}


@payment_router.post("/request")
async def request_payment(team_id: int, user: User = Depends(check_user)):
    existing_team = await get_team_if_allowed(team_id, user)
    
    # Vérifier que l'équipe a le statut PrincipalList
    from prisma.enums import TeamStatus
    if existing_team.status != TeamStatus.PrincipalList:
        raise HTTPException(
            status_code=400,
            detail="L'équipe doit être sélectionnée (statut 'Liste principale') pour effectuer un paiement"
        )
    
    amountLeftToPayInCents = (
        existing_team.amountToPayInCents - existing_team.amountPaidInCents
    )
    general_config = await prisma.generalconfig.find_first()
    if general_config is None:
        raise HTTPException(status_code=500, detail="General config not found")

    if not general_config.isPaymentOpen:
        raise HTTPException(status_code=400, detail="Payment is still closed")
    if amountLeftToPayInCents <= 0:
        raise HTTPException(
            status_code=400,
            detail="No payment needed",
        )

    payment = await prisma.payment.create(
        data=PaymentCreateInput(
            amountInCents=amountLeftToPayInCents,
            teamId=existing_team.id,
            userId=user.id,
            paymentStatus=PaymentStatus.Pending,
        ),
        include=PaymentInclude(
            team=TeamArgsFromPayment(
                include=TeamIncludeFromTeamRecursive1(school=True)
            )
        ),
    )

    payment_url = await request_lydia_payment_url(payment, user)

    return payment_url


@payment_router.get("/{payment_id}")
async def get_payment(payment_id: int, user: User = Depends(check_user)):
    """Récupérer un paiement spécifique"""
    payment = await prisma.payment.find_unique(
        where=PaymentWhereUniqueInput(id=payment_id),
    )
    
    if payment is None:
        raise HTTPException(
            status_code=404,
            detail="Payment not found",
        )
    
    # Vérifier que le paiement appartient à l'utilisateur
    if payment.userId != user.id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to access this payment",
        )
    
    return payment


@payment_router.post(
    "/check-state/{payment_id}"
)
async def check_payment_state(payment_id: int, user: User = Depends(check_user)):
    payment = await prisma.payment.find_unique(
        where=PaymentWhereUniqueInput(id=payment_id),
        include=PaymentInclude(team=True),
    )
    if payment is None:
        raise HTTPException(
            status_code=404,
            detail="Payment not found",
        )

    # Vérifier que le paiement appartient à l'utilisateur
    if payment.userId != user.id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to check this payment",
        )

    if payment.paymentStatus != PaymentStatus.Pending:
        return {"status": payment.paymentStatus, "message": "Payment already processed"}

    payment_status = await check_lydia_payment_state(payment, user)
    if payment_status == PaymentStatus.Paid:
        await update_payment_after_confirmation(payment)
        return {"status": "Paid", "message": "Payment confirmed"}
    else:
        await prisma.payment.update(
            where=PaymentWhereUniqueInput(id=payment.id),
            data=PaymentUpdateInput(paymentStatus=payment_status),
        )
        return {"status": payment_status, "message": "Payment status updated"}
