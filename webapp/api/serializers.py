from rest_framework import serializers
from .models import User, Income, Expense, Debtor, Creditor


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "email", "created_date_time")


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
