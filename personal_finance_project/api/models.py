from django.db import models


class User(models.Model):
    email = models.CharField(max_length=255, unique=True)
    created_date_time = models.DateTimeField(auto_now_add=True)


class Income(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    short_day = models.CharField(max_length=3)
    date_time = models.DateTimeField()
    name = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    is_main = models.BooleanField()
    created_date_time = models.DateTimeField(auto_now_add=True)
    is_delete = models.BooleanField()


class Expense(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    short_day = models.CharField(max_length=3)
    date_time = models.DateTimeField()
    name = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    is_necessary = models.BooleanField()
    created_date_time = models.DateTimeField(auto_now_add=True)
    is_delete = models.BooleanField()


class Debtor(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    phone_no = models.CharField(max_length=50)
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    created_date_time = models.DateTimeField(auto_now_add=True)
    is_settled = models.BooleanField()


class Creditor(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    phone_no = models.CharField(max_length=50)
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    created_date_time = models.DateTimeField(auto_now_add=True)
    is_settled = models.BooleanField()
