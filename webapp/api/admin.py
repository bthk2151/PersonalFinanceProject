from django.contrib import admin
from django.apps import apps

api_models = apps.get_app_config("api").get_models()

admin.site.register([model for model in api_models])
