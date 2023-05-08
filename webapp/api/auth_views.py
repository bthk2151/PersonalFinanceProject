from rest_framework import generics
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from django.contrib.auth.models import User


# custom drf simple jwt token obtain serializer, adding additional claims required by the app to the jwt
# used in settings.py -> SIMPLE_JWT value
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token["first_name"] = user.first_name
        token["last_name"] = user.last_name

        return token
