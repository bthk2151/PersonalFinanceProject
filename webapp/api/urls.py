from django.urls import path
from .user_views import UserView
from .income_expenses_views import *

urlpatterns = [
    path('user/<int:pk>', UserView.as_view()),
    path('create-income', CreateIncomeView.as_view()),
    path('income/<int:pk>/delete', DeleteIncomeView.as_view(), name="delete-income"),
    path('create-expense', CreateExpenseView.as_view()),
    path('expense/<int:pk>/delete',
         DeleteExpenseView.as_view(), name="delete-expense"),
    path('create-debtor', CreateDebtorView.as_view()),
    path('create-creditor', CreateCreditorView.as_view()),
    path('top-income-expense-entries',
         GetTop5EntriesOfEachIncomeExpenseCategoryView.as_view()),
    path('income-expense-list', GetIncomeExpenseListView.as_view())
]
