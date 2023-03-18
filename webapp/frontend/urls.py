from django.urls import path, re_path
from .views import index

urlpatterns = [
    path('', index),
    path('financial-goal', index),
    path('assets-liabilities', index),
    path('income-expenses', index),
    re_path(r'^(?!api/).+', index)  # for all paths excluding the api directory
]
