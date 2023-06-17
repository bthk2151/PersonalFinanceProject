import os
import requests

from django.http import JsonResponse

from .serializers import *
from .models import *
from .custom_errors import *


# NOTE: this is an admin-only view, accessible only from admin portal
def refreshStockList(request):
    # since its an admin only view, can use a generic Django view with a JsonResponse rather than DRF
    api_key = str(os.getenv("EMAIL_HOST_EODHD_API_KEY"))
    url = (
        "https://eodhistoricaldata.com/api/exchanges/KLSE?fmt=json&api_token=" + api_key
    )
    response = requests.get(url)

    if response.status_code == 200:
        stock_data = response.json()
        stock_data_saved = []

        for stock in stock_data:
            if stock["Currency"] != "MYR":
                continue  # only take MYR stock data to retain simplicity in the module

            # either update (if exist), or create stock name
            (stock_saved, _) = Stock.objects.update_or_create(
                code=stock["Code"], defaults={"name": stock["Name"].strip()}
            )

            stock_data_saved.append(stock_saved)

        serializer = GetLatestStockListSerializer(stock_data_saved, many=True)
        return JsonResponse({"stock_data": serializer.data})
    else:
        return JsonResponse(
            {
                "code": "error",
                "detail": "Failed to fetch latest stock data (if response status code is 402, EODHD API request limit has been exceeded)",
            },
            status=response.status_code,
        )
