from rest_framework import generics
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from django.urls import reverse
from django.conf import settings
from django.shortcuts import redirect
from django.core import exceptions
from django.contrib.auth.models import User
from django.contrib.sites.shortcuts import get_current_site

import jwt

from .serializers import *
from .models import *
from .utils import Util
from .custom_errors import *


class CreateUserView(generics.CreateAPIView):
    serializer_class = CreateUserSerializer

    def perform_create(self, serializer):
        # validate that there is no existing user with same username or email
        existing_username = User.objects.filter(
            username=serializer.validated_data["username"]
        ).exists()
        existing_email = User.objects.filter(
            email=serializer.validated_data["email"]
        ).exists()

        if existing_username or existing_email:
            invalid_field = (
                "username and email address are"
                if existing_username and existing_email
                else "username is"
                if existing_username
                else "email address is"
            )
            # following conventional json api error format, response.error.data shall contain code, detail and (additional) meta key values
            raise Http409ConflictError(
                {
                    "code": "username_or_email_already_exists",
                    "detail": "The provided " + invalid_field + " already in use.",
                    "meta": {
                        "username_exists": existing_username,
                        "email_exists": existing_email,
                    },
                }
            )

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


# this view is only used when verification links have expired, and the user has requested for a new link sent to their email
class ResendVerificationEmail(generics.GenericAPIView):
    def post(self, request):
        try:
            # request payload is in jwt form so that it is encrypted, where the user can simply send a user_id to get a new verification link
            user_jwt = request.data.get("expired_token")
            user_id = jwt.decode(
                user_jwt,
                key=settings.SECRET_KEY,
                algorithms="HS256",
                options={"verify_exp": False},
            )["user_id"]
            user = User.objects.get(id=user_id)

            # resend verification email to activate user
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
                "email_subject": "[Resent] Activate your PFP account by verifying your email",
                "email_body": "Dear "
                + user.first_name
                + ",\n\nYou have requested for a new verification link.\nUpon clicking the link below, your account will be activated and you may proceed to use my app:\n\n"
                + absolute_url
                + "\n\nRegards,\nBryan :)",
            }

            Util.send_email(data)  # static function, so can directly call send_email

            # to successfully indicate a resend verification link process, return the user entry
            serializer = CreateUserSerializer(data=user)
            # when serializer is parsed through "data" key, need to call is_valid() prior to accessing serializer.data, else error
            serializer.is_valid()

            return Response(serializer.data)

        except jwt.exceptions.DecodeError:
            raise Http400BadRequest(
                {
                    "code": "invalid_token",
                    "detail": "Invalid account verification token",
                }
            )


# this view will only be accessible through the link sent to the email for account activation
# therefore, will need to redirect the user to the frontend with the appropriate response params
class VerifyUserView(generics.GenericAPIView):
    def get(self, request):
        token = request.GET.get("token")
        try:
            # all jwt decode uses django app SECRET_KEY
            user_id = jwt.decode(
                token,
                key=settings.SECRET_KEY,
                algorithms="HS256",
                # to decode without validating jwt expiry
                options={"verify_exp": False},
            )["user_id"]
            user = User.objects.get(id=user_id)

            if user.is_active:
                # user already activated
                return redirect("/activation?status=activated")

            try:
                # decode once more without jwt expiry validation, if expired, it should trigger ExpiredSignatureError exception
                jwt.decode(
                    token,
                    key=settings.SECRET_KEY,
                    algorithms="HS256",
                )
                user.is_active = True
                user.save()
                return redirect("/activation?status=success")
            except jwt.ExpiredSignatureError:
                # if expired, pass back also the expired token because the user_id is required to resend a new verification link
                return redirect("/activation?status=expired&token=" + token)

        except (jwt.exceptions.DecodeError, exceptions.ObjectDoesNotExist):
            return redirect("/activation?status=invalid")


# for custom validation during login, inherit and override TokenObtainPairView's default obtain token post request
class LoginView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        # first verify if account has been activated
        user = User.objects.get(
            username=request.data.get("username"),
        )
        if not user.is_active:
            raise Http401Unauthorized(
                {
                    "code": "user_not_verified",
                    "detail": "Please verify your email to gain access to your account",
                }
            )

        # then check credentials
        try:
            # if credentials are incorrect, it will raise exception below
            # otherwise, all checks passed, return token
            return super().post(request, *args, **kwargs)
        except Exception:
            raise Http401Unauthorized(
                {
                    "code": "invalid_credentials",
                    "detail": "Invalid username or password",
                }
            )
