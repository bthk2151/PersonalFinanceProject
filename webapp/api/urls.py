from django.urls import path
from .user_views import UserView
from .income_expenses_views import CreateIncomeView, CreateExpenseView, CreateDebtorView, CreateCreditorView

urlpatterns = [
    path('user', UserView.as_view()),
    path('income', CreateIncomeView.as_view()),
    path('expense', CreateExpenseView.as_view()),
    path('debtor', CreateDebtorView.as_view()),
    path('creditor', CreateCreditorView.as_view())
]
