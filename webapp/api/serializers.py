from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from django.contrib.auth.models import User

from .models import *
from .custom_errors import *

# auth serializers


# note: profile extends from the existing in-built auth user model
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ("eodhd_api_token",)


class CreateUserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()

    class Meta:
        model = User
        fields = (
            "id",  # id is required for sending verification email to user
            "username",
            "password",
            "email",
            "first_name",
            "last_name",
            "profile",
        )
        extra_kwargs = {
            # disable pre-built default username's uniqueness validator, so that my own raised error in CreateUserView class is executed and returned the frontend
            "username": {"validators": []},
            # write_only to ensure the password is not returned in the response
            "password": {"write_only": True},
            "email": {"required": True, "allow_blank": False},
            "first_name": {"required": True, "allow_blank": False},
            "last_name": {"required": True, "allow_blank": False},
        }

    def create(self, validated_data):
        profile_data = validated_data.pop("profile", None)
        # user will be inactive until email verified
        validated_data["is_active"] = False

        user = User.objects.create_user(**validated_data)
        Profile.objects.create(user=user, **profile_data)

        return user


# custom drf simple jwt token obtain serializer, adding additional claims required by the app to the jwt
# used in settings.py -> SIMPLE_JWT value
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token["first_name"] = user.first_name
        token["last_name"] = user.last_name

        return token


# income expenses serializers


class CreateIncomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Income
        fields = ("date", "name", "amount", "is_main")


class DeleteIncomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Income
        fields = "id"


class CreateExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = ("date", "name", "amount", "is_necessary")


class DeleteExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = "id"


class GetTop5EntriesOfEachIncomeExpenseCategorySerializer(serializers.Serializer):
    top_main_income_entries = serializers.ListField(
        child=serializers.CharField(max_length=255)
    )
    top_side_income_entries = serializers.ListField(
        child=serializers.CharField(max_length=255)
    )
    top_necessary_expense_entries = serializers.ListField(
        child=serializers.CharField(max_length=255)
    )
    top_luxury_expense_entries = serializers.ListField(
        child=serializers.CharField(max_length=255)
    )


class GetIncomeExpenseListSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    type = serializers.CharField(max_length=1)
    day_of_week = serializers.IntegerField(min_value=0, max_value=6)
    date = serializers.DateField()
    name = serializers.CharField(max_length=255)
    amount = serializers.DecimalField(max_digits=15, decimal_places=2)
    is_main = serializers.BooleanField()
    created_date_time = serializers.DateTimeField()


class CreateDebtorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Debtor
        fields = ("name", "amount")


class DeleteDebtorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Debtor
        fields = "id"


class CreateCreditorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Creditor
        fields = ("name", "amount")


class DeleteCreditorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Creditor
        fields = "id"


class GetDebtorCreditorListSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    type = serializers.CharField(max_length=1)
    name = serializers.CharField(max_length=255)
    amount = serializers.DecimalField(max_digits=15, decimal_places=2)
    created_date_time = serializers.DateTimeField()
