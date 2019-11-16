from django.shortcuts import render
from django.http import HttpResponse
from django.http import HttpRequest
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.decorators import api_view

# Create your views here.
@csrf_exempt
def index(request):
    print('anything?')
    return HttpResponse("Hello, world. You're at the polls index cool lol.")

@api_view(['POST']) # Yes this is very much needed!
def data_return(request):
    print('hello')
    if request.method == 'POST':
        data_from_react = request.data['react_data']
        #data_to_react = 'Django says: " ', data_from_react, '"'
        data_to_react = 'Django says: "{}"'.format(data_from_react)
    return HttpResponse(data_to_react)
