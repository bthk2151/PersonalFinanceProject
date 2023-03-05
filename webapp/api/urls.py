from django.urls import path
from .views import UserView, IncomeView, ExpenseView

urlpatterns = [
    path('', UserView.as_view()),
    path('income', IncomeView.as_view()),
    path('expense', ExpenseView.as_view())
]
