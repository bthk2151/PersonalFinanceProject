from rest_framework import generics, status

# python view rest commands, since exclusively an API view, this is the only Response import required
from rest_framework.views import APIView
from rest_framework.response import Response

from .serializers import CreateIncomeSerializer, CreateExpenseSerializer, CreateDebtorSerializer, CreateCreditorSerializer
from .models import User, Income, Expense, Debtor, Creditor

from datetime import datetime


# income expenses views


class CreateIncomeView(APIView):
    serializer_class = CreateIncomeSerializer

    # def get(self, request):
    #     if not request.session.exists('user_id'):
    #         # [CHANGE LATER] session.user_id should only exist if user is logged on, for now, all users is me
    #         request.session['user_id'] = 1

    #     user = User.objects.get(id=request.session.get('user_id'))
    #     incomes = Income.objects.filter(user=user)
    #     serializer = self.serializer_class(incomes, many=True)
    #     return Response(serializer.data)

    def post(self, request):
        if not request.session.exists('user_id'):
            # [CHANGE LATER] session.user_id should only exist if user is logged on, for now, all users is me
            request.session['user_id'] = 1

        serializer = self.serializer_class(data=request.data)
        if (serializer.is_valid()):  # validate request data with serializer class
            date = serializer.data.get('date')
            name = serializer.data.get('name')
            amount = serializer.data.get('amount')
            is_main = serializer.data.get('is_main')

            user = User.objects.get(id=request.session.get('user_id'))
            day_of_week = datetime.fromisoformat(date).weekday()

            income = Income(date=date, name=name, amount=amount,
                            is_main=is_main, user=user, day_of_week=day_of_week)
            income.save()

            return Response(status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)

    # def delete(self, request, id):
    #     if not request.session.exists('user_id'):
    #         # [CHANGE LATER] session.user_id should only exist if user is logged on, for now, all users is me
    #         request.session['user_id'] = 1

    #     try:
    #         income = Income.objects.get(id=id)
    #         income.delete()
    #         return Response(status=status.HTTP_202_ACCEPTED)
    #     except (Income.DoesNotExist, Income.MultipleObjectsReturned):
    #         return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CreateExpenseView(APIView):
    serializer_class = CreateExpenseSerializer

    def post(self, request):
        if not request.session.exists('user_id'):
            # [CHANGE LATER] session.user_id should only exist if user is logged on, for now, all users is me
            request.session['user_id'] = 1

        serializer = self.serializer_class(data=request.data)
        if (serializer.is_valid()):  # validate request data with serializer class
            date = serializer.data.get('date')
            name = serializer.data.get('name')
            amount = serializer.data.get('amount')
            is_necessary = serializer.data.get('is_necessary')

            user = User.objects.get(id=request.session.get('user_id'))
            day_of_week = datetime.fromisoformat(date).weekday()

            expense = Expense(date=date, name=name, amount=amount,
                              is_necessary=is_necessary, user=user, day_of_week=day_of_week)
            expense.save()

            return Response(status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class CreateDebtorView(APIView):
    serializer_class = CreateDebtorSerializer

    def post(self, request):
        if not request.session.exists('user_id'):
            # [CHANGE LATER] session.user_id should only exist if user is logged on, for now, all users is me
            request.session['user_id'] = 1

        serializer = self.serializer_class(data=request.data)
        if (serializer.is_valid()):  # validate request data with serializer class
            name = serializer.data.get('name')
            amount = serializer.data.get('amount')
            phone_no = serializer.data.get('phone_no')

            user = User.objects.get(id=request.session.get('user_id'))

            debtor = Debtor(name=name, amount=amount,
                            phone_no=phone_no or None, user=user)
            debtor.save()

            return Response(status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class CreateCreditorView(APIView):
    serializer_class = CreateCreditorSerializer

    def post(self, request):
        if not request.session.exists('user_id'):
            # [CHANGE LATER] session.user_id should only exist if user is logged on, for now, all users is me
            request.session['user_id'] = 1

        serializer = self.serializer_class(data=request.data)
        if (serializer.is_valid()):  # validate request data with serializer class
            name = serializer.data.get('name')
            amount = serializer.data.get('amount')
            phone_no = serializer.data.get('phone_no')

            user = User.objects.get(id=request.session.get('user_id'))

            creditor = Creditor(name=name, amount=amount,
                                phone_no=phone_no or None, user=user)
            creditor.save()

            return Response(status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)