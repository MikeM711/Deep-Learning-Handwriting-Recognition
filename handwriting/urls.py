from django.urls import path, include, re_path
from django.views.generic import TemplateView

from . import views

urlpatterns = [
    # path('', views.index, name='index'),
    path('test/', views.data_return),
    re_path(r'^.*', TemplateView.as_view(template_name='index.html')),
]