from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .auth_views import *
from .income_expenses_views import *

urlpatterns = [
    # initial email verification link to user will be sent here
    path("create-user", CreateUserView.as_view()),
    path("resend-verification-link", ResendVerificationEmail.as_view()),
    path("verify-user", VerifyUserView.as_view(), name="verify-user"),
    path("token", LoginView.as_view()),
    path("token/refresh", TokenRefreshView.as_view()),
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
