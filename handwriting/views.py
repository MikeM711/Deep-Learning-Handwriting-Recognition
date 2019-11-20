from .serializers import PostSerializer
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
from .models import Post
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
import tempfile
import numpy as np
import tensorflow.keras as keras

from handwriting.utils.center_image import center_image
from handwriting.utils.pad_image import pad_image
from handwriting.utils.predictions import predictions

# Create your views here.

# @csrf_exempt
# def index(request):
#     print('anything?')
#     return HttpResponse("Hello, world. You're at the polls index cool lol.")

@api_view(['POST']) # Yes this is very much needed!
def data_return(request):
    print('hello')
    parser_classes = (MultiPartParser, FormParser)
    posts_serializer = PostSerializer(data=request.data)
    # im = Image.open('static/handwritingrecognition/testImage.png')
    # im.show()
    if posts_serializer.is_valid():
        print("great! It's valid!")
    else:
        print('\nthis is not valid\n')
    image_request = posts_serializer.data['image'].file
    im = Image.open(image_request)
    # im.show()
    filepath = 'static/handwritingrecognition/user_image.png'
    im.save(filepath)


    # tf = tempfile.NamedTemporaryFile() 
    # print(tf.name)

    # with tempfile.NamedTemporaryFile(mode="wb") as jpg:
    #     # jpg.write(b"Hello World!")
    #     jpg.write(im.content)
    #     print (jpg.name)
    

    # im = Image.open(posts_serializer)
    # print(plt)
    # filepath = 'testImage.png'
    # img_array = cv2.imread(filepath, cv2.IMREAD_GRAYSCALE)
    # print('img_array: ',img_array)
    # im = Image.open('static/handwritingrecognition/testImage.png')
    # print(im.size, im.width, im.height)
    # im.show()
    # print('we got: {}'.format(request.data['react_data']))

    # filepath = 'static/handwritingrecognition/testImage.png'
    
    IMG_SIZE = 28
    img_array = cv2.imread(filepath, cv2.IMREAD_GRAYSCALE)
    # plt.imshow(img_array, cmap=plt.cm.binary)
    # plt.show()

    mod_array = list(img_array)

    # center the image - no padding
    mod_array = center_image(mod_array)

    # we will now begin padding
    mod_array = pad_image(mod_array)

    # convert to a numpy array
    mod_array = np.array(mod_array, dtype='uint8')

    # resize the image
    new_array = cv2.resize(mod_array, (IMG_SIZE, IMG_SIZE))

    new_array = new_array.reshape(-1, IMG_SIZE, IMG_SIZE, 1)

    prediction = predictions(new_array)

    
    print(prediction)


    # img_array = cv2.imread(filepath, cv2.IMREAD_GRAYSCALE)
    # print(img_array)
    print('goodbye')
    # if request.method == 'POST':
        # data_from_react = request.data['react_data']
        # data_to_react = 'Django says: "{}"'.format(data_from_react)
    return HttpResponse(prediction)
