# for accessing .env variables
import os

from django.core.mail import EmailMessage


class Util:
    @staticmethod
    def send_email(data):
        email = EmailMessage(
            to=[data["email_recipient"]],  # takes a list of recipients
            cc=[str(os.getenv("EMAIL_HOST_USER"))],
            subject=data["email_subject"],
            body=data["email_body"],
        )
        email.send()
