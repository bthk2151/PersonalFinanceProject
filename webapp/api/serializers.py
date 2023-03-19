from rest_framework import serializers
from .models import User, Income, Expense, Debtor, Creditor


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'created_date_time')


class CreateIncomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Income
        fields = ('date', 'name', 'amount', 'is_main')


class CreateExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = ('date', 'name', 'amount', 'is_necessary')


class CreateDebtorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Debtor
        fields = ('name', 'amount', 'phone_no')


class CreateCreditorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Creditor
        fields = ('name', 'amount', 'phone_no')
