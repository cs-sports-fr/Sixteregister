import os
import boto3  # type: ignore
from botocore.exceptions import ClientError  # type: ignore
from dotenv import load_dotenv, find_dotenv

# Charge le fichier .env en remontant automatiquement depuis le répertoire courant
# jusqu'à trouver le premier .env (par exemple à la racine du projet).
load_dotenv(find_dotenv())
AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY")
AWS_SECRET_KEY = os.getenv("AWS_SECRET_KEY")
AWS_REGION = "eu-west-3"
CHARSET = "UTF-8"
SENDER = "Sixte 2026 <inscriptions@toss-register.bds-cs.fr>"


class EmailClient:
    def __init__(self) -> None:
        self.client = boto3.client(
            "ses",
            region_name=AWS_REGION,
            aws_access_key_id=AWS_ACCESS_KEY,
            aws_secret_access_key=AWS_SECRET_KEY,
        )

    def send_email(
        self, to_address: str, subject: str, body_html: str, body_text: str
    ) -> None:
        self.client.send_email(
            Destination={
                "ToAddresses": [
                    to_address,
                ],
            },
            Message={
                "Body": {
                    "Html": {
                        "Charset": CHARSET,
                        "Data": body_html,
                    },
                    "Text": {
                        "Charset": CHARSET,
                        "Data": body_text,
                    },
                },
                "Subject": {
                    "Charset": CHARSET,
                    "Data": subject,
                },
            },
            Source=SENDER,
        )
