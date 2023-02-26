from django.urls import path
from .views import index

urlpatterns = [
    path('', index),
    path('financial-goal', index),
    path('assets-liabilities', index),
    path('income-expenses', index),
    path('<path:path>', index)
]
