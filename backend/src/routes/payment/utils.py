import hashlib
import hmac
import os
import logging
from fastapi import HTTPException
from prisma.models import User
import httpx

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

logger = logging.getLogger(__name__)
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
    hash_value = generate_hmac(payment.id)

    payment_message = f"[SIXTE] {user.email}"
    if payment.team is not None:
        payment_message += f" pour equipe {payment.team.name}"
        if payment.team.school is not None:
            payment_message += f" de {payment.team.school.name}"

    # Enlever le slash final de FRONTEND_URL s'il existe
    frontend_url = FRONTEND_URL.rstrip("/")
    success_url = f"{frontend_url}/success-payment/{payment.id}"

    data = {
        "vendor_token": LYDIA_VENDOR_TOKEN,
        "amount": str(round(payment.amountInCents / 100, 2)),
        "currency": "EUR",
        "type": "email",
        "recipient": user.email,
        "message": payment_message,
        "confirm_url": f"{BACKEND_URL}/payment/confirm?payment_id={payment.id}&hash={hash_value}",
        "cancel_url": f"{BACKEND_URL}/payment/cancel?payment_id={payment.id}&hash={hash_value}",
        "expire_url": f"{BACKEND_URL}/payment/expire?payment_id={payment.id}&hash={hash_value}",
        "browser_success_url": success_url,
        "end_mobile_url": success_url,
        "display_confirmation": "no",
    }

    logger.info(f"Requesting Lydia payment for payment {payment.id}")
    logger.debug(f"Request data: {data}")
    logger.info(f"LYDIA_VENDOR_TOKEN: '{LYDIA_VENDOR_TOKEN}' (length: {len(LYDIA_VENDOR_TOKEN) if LYDIA_VENDOR_TOKEN else 0})")

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            logger.info(f"Sending POST request to {LYDIA_API_URL}/api/request/do.json")
            response = await client.post(
                f"{LYDIA_API_URL}/api/request/do.json",
                data=data,
            )

            logger.info(f"Lydia response status: {response.status_code}")
            logger.debug(f"Lydia response: {response.text}")

            if response.status_code != 200:
                await prisma.payment.update(
                    where=PaymentWhereUniqueInput(id=payment.id),
                    data=PaymentUpdateInput(paymentStatus=PaymentStatus.Failed),
                )
                raise HTTPException(
                    status_code=500,
                    detail=f"Error from Lydia API: {response.status_code} - {response.text}",
                )

            json_result = response.json()
            logger.debug(f"Lydia JSON response: {json_result}")

            # Vérifier si Lydia a renvoyé une erreur (format: status, code, message)
            if "status" in json_result and json_result.get("status") == "error":
                await prisma.payment.update(
                    where=PaymentWhereUniqueInput(id=payment.id),
                    data=PaymentUpdateInput(paymentStatus=PaymentStatus.Failed),
                )
                raise HTTPException(
                    status_code=500,
                    detail=f"Lydia API error: {json_result.get('message', 'Unknown error')} (code: {json_result.get('code', 'N/A')})",
                )

            # Ancien format d'erreur avec "error"
            if str(json_result.get("error", "0")) != "0":
                await prisma.payment.update(
                    where=PaymentWhereUniqueInput(id=payment.id),
                    data=PaymentUpdateInput(paymentStatus=PaymentStatus.Failed),
                )
                raise HTTPException(
                    status_code=500,
                    detail=f"Lydia API error: {json_result.get('message', 'Unknown error')}",
                )

            request_id = json_result.get("request_id")
            request_uuid = json_result.get("request_uuid")
            mobile_url = json_result.get("mobile_url")

            if not all([request_id, request_uuid, mobile_url]):
                logger.error(f"Missing fields in Lydia response: {json_result}")
                await prisma.payment.update(
                    where=PaymentWhereUniqueInput(id=payment.id),
                    data=PaymentUpdateInput(paymentStatus=PaymentStatus.Failed),
                )
                raise HTTPException(
                    status_code=500,
                    detail=f"Invalid response from Lydia. Got: {list(json_result.keys())}. request_id={request_id}, request_uuid={request_uuid}, mobile_url={mobile_url}",
                )

            await prisma.payment.update(
                where=PaymentWhereUniqueInput(id=payment.id),
                data=PaymentUpdateInput(
                    paymentStatus=PaymentStatus.Pending,
                    requestId=request_id,
                    requestUuid=request_uuid,
                ),
            )

            logger.info(f"Payment {payment.id} successfully created with Lydia")
            return mobile_url

    except httpx.HTTPError as e:
        logger.error(f"HTTP error while requesting Lydia payment: {e}")
        logger.error(f"Error type: {type(e).__name__}")
        logger.error(f"Error details: {str(e)}")
        await prisma.payment.update(
            where=PaymentWhereUniqueInput(id=payment.id),
            data=PaymentUpdateInput(paymentStatus=PaymentStatus.Failed),
        )
        raise HTTPException(
            status_code=500,
            detail=f"Network error while contacting Lydia: {type(e).__name__} - {str(e)}",
        )
    except Exception as e:
        logger.error(f"Unexpected error while requesting Lydia payment: {e}")
        logger.error(f"Error type: {type(e).__name__}")
        await prisma.payment.update(
            where=PaymentWhereUniqueInput(id=payment.id),
            data=PaymentUpdateInput(paymentStatus=PaymentStatus.Failed),
        )
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected error: {type(e).__name__} - {str(e)}",
        )


async def check_lydia_payment_state(payment: Payment, user: User):
    logger.info(f"Checking Lydia payment state for payment {payment.id}")

    data = {
        "vendor_token": LYDIA_VENDOR_TOKEN,
        "order_ref": payment.id,
        "request_uuid": payment.requestUuid,
        "request_id": payment.requestId,
    }

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{LYDIA_API_URL}/api/request/state.json",
                data=data,
            )

            logger.info(f"Lydia state response status: {response.status_code}")
            logger.debug(f"Lydia state response: {response.text}")

            if response.status_code != 200:
                raise HTTPException(
                    status_code=500,
                    detail=f"Error from Lydia API: {response.status_code} - {response.text}",
                )

            json_result = response.json()
            logger.debug(f"Lydia state JSON response: {json_result}")

            state = json_result.get("state")
            if state == "1":
                return PaymentStatus.Paid
            elif state == "0":
                return PaymentStatus.Pending
            else:
                return PaymentStatus.Canceled

    except httpx.HTTPError as e:
        logger.error(f"HTTP error while checking Lydia payment state: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Network error while checking payment state: {str(e)}",
        )


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
