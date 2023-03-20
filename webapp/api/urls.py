from django.urls import path
from .user_views import UserView
from .income_expenses_views import CreateIncomeView, CreateExpenseView, CreateDebtorView, CreateCreditorView

urlpatterns = [
    path('user', UserView.as_view()),
    path('create-income', CreateIncomeView.as_view()),
    path('create-expense', CreateExpenseView.as_view()),
    path('create-debtor', CreateDebtorView.as_view()),
    path('create-creditor', CreateCreditorView.as_view())
]
