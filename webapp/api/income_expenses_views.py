# python view rest commands
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response

from django.db.models import Count

from .serializers import *
from .models import *

from datetime import datetime


# income expenses views

class CreateIncomeView(generics.CreateAPIView):
    # no need to explicitly specify the specific model when you have the associated serializer class (which is derived from the model)
    serializer_class = CreateIncomeSerializer

    def perform_create(self, serializer):
        if not self.request.session.exists('user_id'):
            # [CHANGE LATER] session.user_id should only exist if user is logged on, for now, all users is me
            self.request.session['user_id'] = 1

        # non-posted additional model data to be saved
        user = User.objects.get(id=self.request.session.get('user_id'))
        day_of_week = datetime.fromisoformat(
            str(serializer.validated_data['date'])).weekday()
        serializer.save(user=user, day_of_week=day_of_week)

        # ensure all other default behavior of CreateAPIView class is performed
        return super().perform_create(serializer)


class CreateExpenseView(generics.CreateAPIView):
    serializer_class = CreateExpenseSerializer

    def perform_create(self, serializer):
        if not self.request.session.exists('user_id'):
            # [CHANGE LATER] session.user_id should only exist if user is logged on, for now, all users is me
            self.request.session['user_id'] = 1

        user = User.objects.get(id=self.request.session.get('user_id'))
        day_of_week = datetime.fromisoformat(
            str(serializer.validated_data['date'])).weekday()
        serializer.save(user=user, day_of_week=day_of_week)

        return super().perform_create(serializer)


class CreateDebtorView(generics.CreateAPIView):
    serializer_class = CreateDebtorSerializer

    def perform_create(self, serializer):
        if not self.request.session.exists('user_id'):
            # [CHANGE LATER] session.user_id should only exist if user is logged on, for now, all users is me
            self.request.session['user_id'] = 1

        user = User.objects.get(id=self.request.session.get('user_id'))
        serializer.save(user=user)

        return super().perform_create(serializer)


class CreateCreditorView(generics.CreateAPIView):
    serializer_class = CreateCreditorSerializer

    def perform_create(self, serializer):
        if not self.request.session.exists('user_id'):
            # [CHANGE LATER] session.user_id should only exist if user is logged on, for now, all users is me
            self.request.session['user_id'] = 1

        user = User.objects.get(id=self.request.session.get('user_id'))
        serializer.save(user=user)

        return super().perform_create(serializer)


class GetTop5EntriesOfEachIncomeExpenseCategoryView(APIView):
    def get(self, request):
        if not self.request.session.exists('user_id'):
            # [CHANGE LATER] session.user_id should only exist if user is logged on, for now, all users is me
            self.request.session['user_id'] = 1

        user = User.objects.get(id=self.request.session.get('user_id'))

        top_main_income_entries = Income.objects.filter(user=user, is_main=True).values('name').annotate(
            count=Count('name')).order_by('-count')[:5]

        top_side_income_entries = Income.objects.filter(user=user, is_main=False).values('name').annotate(
            count=Count('name')).order_by('-count')[:5]

        top_necessary_expense_entries = Expense.objects.filter(user=user, is_necessary=True).values('name').annotate(
            count=Count('name')).order_by('-count')[:5]

        top_luxury_expense_entries = Expense.objects.filter(user=user, is_necessary=False).values('name').annotate(
            count=Count('name')).order_by('-count')[:5]

        data = {'top_main_income_entries': [record['name'] for record in top_main_income_entries],
                'top_side_income_entries': [record['name'] for record in top_side_income_entries],
                'top_necessary_expense_entries': [record['name'] for record in top_necessary_expense_entries],
                'top_luxury_expense_entries': [record['name'] for record in top_luxury_expense_entries]}

        return Response(data)
