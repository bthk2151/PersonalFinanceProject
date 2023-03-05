from rest_framework import serializers
from .models import User, Income, Expense


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'created_date_time')


class IncomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Income
        fields = ('date_time', 'name', 'amount', 'is_main')


class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = ('date_time', 'name', 'amount', 'is_necessary')
