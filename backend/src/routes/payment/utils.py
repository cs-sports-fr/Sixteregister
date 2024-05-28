import hashlib
import hmac
import os
from fastapi import HTTPException
from prisma.models import User
import json
import requests  # type: ignore

from prisma.models import Payment
from prisma.types import (
    PaymentWhereUniqueInput,
    PaymentUpdateInput,
    TeamWhereUniqueInput,
    TeamUpdateInput,
    _IntIncrementInput,
)
from prisma.enums import PaymentStatus

from infra.prisma import getPrisma  # type: ignore

prisma = getPrisma()

HMAC_SECRET_KEY = os.getenv("HMAC_SECRET_KEY")
LYDIA_API_URL = os.getenv("LYDIA_API_URL")
LYDIA_VENDOR_TOKEN = os.getenv("LYDIA_VENDOR_TOKEN")
BACKEND_URL = os.getenv("BACKEND_URL")
FRONTEND_URL = os.getenv("FRONTEND_URL")


def generate_hmac(message):
    hmac_hash = hmac.new(
        bytes(HMAC_SECRET_KEY, encoding="utf8"),
        bytes(str(message), encoding="utf8"),
        hashlib.sha256,
    )

    hex_hash = hmac_hash.hexdigest()

    return hex_hash


async def request_lydia_payment_url(payment: Payment, user: User):
    hash = generate_hmac(payment.id)

    payement_message = f"[TOSS] {user.email}"
    if payment.team is not None:
        payement_message += f" pour equipe {payment.team.name}"
        if payment.team.school is not None:
            payement_message += f" de {payment.team.school.name}"

    success_url = f"{FRONTEND_URL}"
    if payment.team is not None:
        success_url += f"/team/{payment.team.id}"

    response: requests.Response = requests.post(
        f"{LYDIA_API_URL}/api/request/do.json",
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        data={
            "vendor_token": LYDIA_VENDOR_TOKEN,
            "amount": str(round(payment.amountInCents / 100, 2)),
            "currency": "EUR",
            "type": "email",  # "phone" TODO : check what we do
            "recipient": user.email,
            "message": payement_message,
            "confirm_url": f"{BACKEND_URL}/payment/confirm?payment_id={payment.id}&hash={hash}",
            "cancel_url": f"{BACKEND_URL}/payment/cancel?payment_id={payment.id}&hash={hash}",
            "expire_url": f"{BACKEND_URL}/payment/expire?payment_id={payment.id}&hash={hash}",
            "browser_success_url": success_url,
            "end_mobile_url": success_url,
            "display_confirmation":"no",
        },
    )

    if response.status_code != 200:
        prisma.payment.update(
            where=PaymentWhereUniqueInput(id=payment.id),
            data=PaymentUpdateInput(paymentStatus=PaymentStatus.Failed),
        )
        raise HTTPException(
            status_code=500,
            detail=f"Error while adding requesting payment",
        )

    json_result: dict = json.loads(response.text)

    if json_result["error"] != "0":
        await prisma.payment.update(
            where=PaymentWhereUniqueInput(id=payment.id),
            data=PaymentUpdateInput(paymentStatus=PaymentStatus.Failed),
        )
        raise HTTPException(
            status_code=500,
            detail=f"Error while adding requesting payment",
        )
    request_id = json_result["request_id"]
    request_uuid = json_result["request_uuid"]
    mobile_url = json_result["mobile_url"]

    await prisma.payment.update(
        where=PaymentWhereUniqueInput(id=payment.id),
        data=PaymentUpdateInput(
            paymentStatus=PaymentStatus.Pending,
            requestId=request_id,
            requestUuid=request_uuid,
        ),
    )

    return mobile_url


async def check_lydia_payment_state(payment: Payment, user: User):

    response: requests.Response = requests.post(
        f"{LYDIA_API_URL}/api/request/state.json",
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        data={
            "vendor_token": LYDIA_VENDOR_TOKEN,
            "order_ref": payment.id,
            "request_uuid": payment.requestUuid,
            "request_id": payment.requestId,
        },
    )

    if response.status_code != 200:
        raise HTTPException(
            status_code=500,
            detail=f"Error while checking payment state",
        )

    json_result: dict = json.loads(response.text)

    match json_result["state"]:
        case "1":
            return PaymentStatus.Paid
        case "0":
            return PaymentStatus.Pending
        case default:
            return PaymentStatus.Canceled


async def update_payment_after_confirmation(payment: Payment):
    await prisma.payment.update(
        where=PaymentWhereUniqueInput(id=payment.id),
        data=PaymentUpdateInput(paymentStatus=PaymentStatus.Paid),
    )
    await prisma.team.update(
        where=TeamWhereUniqueInput(id=payment.teamId),
        data=TeamUpdateInput(
            amountPaidInCents=_IntIncrementInput(
                increment=payment.amountInCents
            )
        ),
    )
