from django.urls import path, include, re_path
from django.views.generic import TemplateView

from . import views

urlpatterns = [
    path('', views.data_return),
]