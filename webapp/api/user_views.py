from rest_framework import generics

from .serializers import UserSerializer
from .models import User

# user views

# retrieve user id object


class UserView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
