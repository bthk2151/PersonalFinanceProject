from rest_framework import generics
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .serializers import UserSerializer
from .models import User


# custom drf simple jwt token obtain serializer, adding additional claims required by the app to the jwt
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token["first_name"] = user.first_name
        token["last_name"] = user.last_name

        return token


# retrieve user id object


class UserView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
