from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .income_expenses_views import *

urlpatterns = [
    path("token", TokenObtainPairView.as_view(), name="token-obtain-pair"),
    path("token/refresh", TokenRefreshView.as_view(), name="token-refresh"),
    path("create-income", CreateIncomeView.as_view()),
    path("income/<int:pk>/delete", DeleteIncomeView.as_view(), name="delete-income"),
    path("create-expense", CreateExpenseView.as_view()),
    path("expense/<int:pk>/delete", DeleteExpenseView.as_view(), name="delete-expense"),
    path("create-debtor", CreateDebtorView.as_view()),
    path("create-creditor", CreateCreditorView.as_view()),
    path(
        "top-income-expense-entries",
        GetTop5EntriesOfEachIncomeExpenseCategoryView.as_view(),
    ),
    path("income-expense-list", GetIncomeExpenseListView.as_view()),
    path("debtor-creditor-list", GetDebtorCreditorListView.as_view()),
    path("debtor/<int:pk>/delete", DeleteDebtorView.as_view()),
    path("creditor/<int:pk>/delete", DeleteCreditorView.as_view()),
]
