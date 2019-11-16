from django.urls import path

from . import views

urlpatterns = [
    # path('', views.index, name='index'),
    # path('', views.index),
    path('test/', views.data_return)
]