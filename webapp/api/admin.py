from django.contrib import admin
from django.apps import apps
from django.urls import path

from .models import Stock
from .assets_liabilities_views import refreshStockList

api_models = apps.get_app_config("api").get_models()
admin.site.register([model for model in api_models if model.__name__ != "Stock"])


# manually register Stock model since there is a associated custom view accessible through the model
@admin.register(Stock)
class StockAdmin(admin.ModelAdmin):
    change_list_template = "admin/stock_change_list.html"

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            # custom admin-only refresh stock list view
            path(
                "refresh-stock-list",
                self.admin_site.admin_view(refreshStockList),
            )
        ]
        return urls + custom_urls
