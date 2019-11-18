from django.shortcuts import render
from django.http import HttpResponse
from django.http import HttpRequest
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.decorators import api_view
from PIL import Image
# import matplotlib.pyplot as plt
import os
from cv2 import *

# Create your views here.

# @csrf_exempt
# def index(request):
#     print('anything?')
#     return HttpResponse("Hello, world. You're at the polls index cool lol.")

@api_view(['POST']) # Yes this is very much needed!
def data_return(request):
    print('hello')
    # print(plt)
    # filepath = 'testImage.png'
    # img_array = cv2.imread(filepath, cv2.IMREAD_GRAYSCALE)
    # print('img_array: ',img_array)
    # im = Image.open('static/handwritingrecognition/testImage.png')
    # print(im.size, im.width, im.height)
    # im.show()
    print('we got: {}'.format(request.data['react_data']))
    filepath = 'static/handwritingrecognition/testImage.png'
    img_array = cv2.imread(filepath, cv2.IMREAD_GRAYSCALE)
    print(img_array)
    print('goodbye')
    # if request.method == 'POST':
        # data_from_react = request.data['react_data']
        # data_to_react = 'Django says: "{}"'.format(data_from_react)
    return HttpResponse(img_array)
