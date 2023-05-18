from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from django.urls import reverse
from django.conf import settings
from django.shortcuts import redirect
from django.contrib.auth.models import User
from django.contrib.sites.shortcuts import get_current_site

import jwt

from .serializers import *
from .models import *
from .utils import Util


class CreateUserView(generics.CreateAPIView):
    serializer_class = CreateUserSerializer

    def perform_create(self, serializer):
        # serializer saved returns an instance of newly created User, also creates (User model extended) Profile instance
        user = serializer.save()

        # send verification email to activate user
        protocol = "https" if self.request.is_secure() else "http"
        current_site = get_current_site(self.request).domain
        # see urls.py endpoint with name=verify-user
        relative_link = reverse("verify-user")
        token = str(RefreshToken.for_user(user).access_token)
        absolute_url = (
            protocol + "://" + current_site + relative_link + "?token=" + token
        )

        data = {
            "email_recipient": user.email,
            "email_subject": "Activate your PFP account by verifying your email",
            "email_body": "Dear "
            + user.first_name
            + ",\n\nThank you for your interest in my personal finance project!\nUpon clicking the link below, your account will be activated and you may proceed to use my app:\n\n"
            + absolute_url
            + "\n\nRegards,\nBryan :)",
        }

        Util.send_email(data)  # static function, so can directly call send_email

        return user


# this view will only be accessible through the link sent to the email for account activation
# therefore, will need to redirect the user to the frontend with the appropriate response params
class VerifyUserView(generics.GenericAPIView):
    def get(self, request):
        token = request.GET.get("token")
        try:
            # all jwt decode uses django app SECRET_KEY
            user_id = jwt.decode(
                jwt=token, key=settings.SECRET_KEY, algorithms="HS256"
            )["user_id"]
            user = User.objects.get(id=user_id)
            if user.is_active:
                return Response(
                    {
                        "code": "user_already_activated",
                        "detail": "The user account has already been activated",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
            else:
                user.is_active = True
                user.save()
                return Response(
                    user,
                    status=status.HTTP_200_OK,
                )
        except jwt.ExpiredSignatureError:
            return Response(
                {
                    "code": "token_expired",
                    "detail": "The email activation token has expired, please register again to obtain a new token",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        except jwt.exceptions.DecodeError:
            return Response(
                {
                    "code": "token_invalid",
                    "detail": "Invalid token",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
