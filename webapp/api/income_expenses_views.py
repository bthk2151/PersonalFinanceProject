# python view rest commands
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response

from django.db.models import Count, Value
from django.core.exceptions import ValidationError

from .permissions import IsAuthenticatedAndOwner
from .serializers import *
from .models import *
from .custom_errors import *

from datetime import datetime


# income expenses views


class CreateIncomeView(generics.CreateAPIView):
    # only authenticated users can use view
    permission_classes = [IsAuthenticatedAndOwner]
    # no need to explicitly specify the specific model when you have the associated serializer class (which is derived from the model)
    serializer_class = CreateIncomeSerializer

    def perform_create(self, serializer):
        date = serializer.validated_data["date"]

        # non-posted additional model data to be saved
        user = self.request.user
        day_of_week = datetime.fromisoformat(str(date)).weekday()

        if serializer.validated_data["is_main"]:  # if main income
            # validate that there is no existing main income entry for the user in the selected month
            existing_entry = Income.objects.filter(
                user=user, date__month=date.month, date__year=date.year
            ).exists()

            if existing_entry:
                # following conventional naming pattern, response.error.data shall contain code and detail key values
                raise Http422UnprocessableEntityError(
                    {
                        "code": "main_income_entry_already_exists",
                        "detail": "Maximum one main income entry per month",
                    }
                )

        # serializer save only after all validation completed
        serializer.save(user=user, day_of_week=day_of_week)

        # ensure all other default behavior of CreateAPIView class is performed
        return super().perform_create(serializer)


class DeleteIncomeView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticatedAndOwner]
    serializer_class = DeleteIncomeSerializer
    queryset = Income.objects.all()


class CreateExpenseView(generics.CreateAPIView):
    permission_classes = [IsAuthenticatedAndOwner]
    serializer_class = CreateExpenseSerializer

    def perform_create(self, serializer):
        user = self.request.user
        day_of_week = datetime.fromisoformat(
            str(serializer.validated_data["date"])
        ).weekday()
        serializer.save(user=user, day_of_week=day_of_week)

        return super().perform_create(serializer)


class DeleteExpenseView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticatedAndOwner]
    serializer_class = DeleteIncomeSerializer
    queryset = Expense.objects.all()


class CreateDebtorView(generics.CreateAPIView):
    permission_classes = [IsAuthenticatedAndOwner]
    serializer_class = CreateDebtorSerializer

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(user=user)

        return super().perform_create(serializer)


class DeleteDebtorView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticatedAndOwner]
    serializer_class = DeleteDebtorSerializer
    queryset = Debtor.objects.all()


class CreateCreditorView(generics.CreateAPIView):
    permission_classes = [IsAuthenticatedAndOwner]
    serializer_class = CreateCreditorSerializer

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(user=user)

        return super().perform_create(serializer)


class DeleteCreditorView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticatedAndOwner]
    serializer_class = DeleteCreditorSerializer
    queryset = Creditor.objects.all()


class GetTop5EntriesOfEachIncomeExpenseCategoryView(APIView):
    permission_classes = [IsAuthenticatedAndOwner]

    def get(self, request):
        user = request.user

        top_main_income_entries = (
            Income.objects.filter(user=user, is_main=True)
            .values("name")
            .annotate(count=Count("name"))
            .order_by("-count")[:5]
        )

        top_side_income_entries = (
            Income.objects.filter(user=user, is_main=False)
            .values("name")
            .annotate(count=Count("name"))
            .order_by("-count")[:5]
        )

        top_necessary_expense_entries = (
            Expense.objects.filter(user=user, is_necessary=True)
            .values("name")
            .annotate(count=Count("name"))
            .order_by("-count")[:5]
        )

        top_luxury_expense_entries = (
            Expense.objects.filter(user=user, is_necessary=False)
            .values("name")
            .annotate(count=Count("name"))
            .order_by("-count")[:5]
        )

        data = {
            "top_main_income_entries": [
                record["name"] for record in top_main_income_entries
            ],
            "top_side_income_entries": [
                record["name"] for record in top_side_income_entries
            ],
            "top_necessary_expense_entries": [
                record["name"] for record in top_necessary_expense_entries
            ],
            "top_luxury_expense_entries": [
                record["name"] for record in top_luxury_expense_entries
            ],
        }

        serializer = GetTop5EntriesOfEachIncomeExpenseCategorySerializer(data=data)
        # when serializer is parsed through "data" key, need to call is_valid() prior to accessing serializer.data, else error
        serializer.is_valid()

        return Response(serializer.data)


class GetIncomeExpenseListView(APIView):
    permission_classes = [IsAuthenticatedAndOwner]

    def get(self, request):
        user = request.user
        month = request.query_params.get("month")
        year = request.query_params.get("year")

        income_query = (
            Income.objects.filter(user=user, date__month=month, date__year=year)
            .annotate(type=Value("I"))
            .values(
                "id",
                "type",
                "day_of_week",
                "date",
                "name",
                "is_main",
                "amount",
                "created_date_time",
            )
        )
        expense_query = (
            Expense.objects.filter(user=user, date__month=month, date__year=year)
            .annotate(type=Value("E"))
            .values(
                "id",
                "type",
                "day_of_week",
                "date",
                "name",
                "is_necessary",
                "amount",
                "created_date_time",
            )
        )
        income_expense_query = income_query.union(expense_query).order_by(
            "-date", "-created_date_time"
        )

        serializer = GetIncomeExpenseListSerializer(income_expense_query, many=True)

        return Response(serializer.data)


class GetDebtorCreditorListView(APIView):
    permission_classes = [IsAuthenticatedAndOwner]

    def get(self, request):
        user = request.user

        debtor_query = (
            Debtor.objects.filter(user=user)
            .annotate(type=Value("D"))
            .values("id", "type", "name", "amount", "created_date_time")
        )
        creditor_query = (
            Creditor.objects.filter(user=user)
            .annotate(type=Value("C"))
            .values("id", "type", "name", "amount", "created_date_time")
        )
        debtor_creditor_query = debtor_query.union(creditor_query).order_by(
            "created_date_time"
        )

        serializer = GetDebtorCreditorListSerializer(debtor_creditor_query, many=True)

        return Response(serializer.data)
