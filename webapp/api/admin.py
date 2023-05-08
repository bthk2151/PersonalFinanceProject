from django.contrib import admin
from django.apps import apps

# Register your models here.
from .models import *

admin.site.register([Income, Expense, Debtor, Creditor])
