from django.contrib.auth.models import User
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

# auth models


# based on django docs, default way to extend the in-built auth user model and store extra info related to the user
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    # api token to access eodhistoricaldata financial market data
    eodhd_api_token = models.CharField(max_length=255, blank=True)


# income expenses models


class Income(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    day_of_week = models.SmallIntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(6)]
    )
    date = models.DateField()
    name = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    is_main = models.BooleanField()
    created_date_time = models.DateTimeField(auto_now_add=True)


class Expense(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    day_of_week = models.SmallIntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(6)]
    )
    date = models.DateField()
    name = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    is_necessary = models.BooleanField()
    created_date_time = models.DateTimeField(auto_now_add=True)


class Debtor(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    created_date_time = models.DateTimeField(auto_now_add=True)


class Creditor(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    created_date_time = models.DateTimeField(auto_now_add=True)


class Stock(models.Model):
    code = models.CharField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
