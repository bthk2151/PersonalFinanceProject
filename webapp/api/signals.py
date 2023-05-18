from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from django.forms import ValidationError


# this signal is just to ensure that under all circumstance, no duplicate user emails are saved across all users
# standard validation should still be conducted in every explicit user generation / update
@receiver(pre_save, sender=User)
def check_email_if_exists(sender, instance, **kwargs):
    email = instance.email
    if sender.objects.filter(email=email).exclude(username=instance.username).exists():
        raise ValidationError(
            {
                "code": "email_already_exists",
                "detail": "Email already exists",
            }
        )
