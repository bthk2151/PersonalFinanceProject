# python view rest commands, since exclusively an API view, this is the only Response import required
from rest_framework import generics

from .serializers import CreateIncomeSerializer, CreateExpenseSerializer, CreateDebtorSerializer, CreateCreditorSerializer
from .models import User

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
