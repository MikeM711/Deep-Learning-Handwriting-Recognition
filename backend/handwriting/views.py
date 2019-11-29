from django.shortcuts import render
from django.http import HttpResponse
from django.http import HttpRequest
from django.views.decorators.csrf import csrf_exempt

from PIL import Image
from cv2 import *
import numpy as np
import tensorflow.keras as keras
from rest_framework.decorators import api_view

from backend.handwriting.utils.center_image import center_image
from backend.handwriting.utils.pad_image import pad_image
from backend.handwriting.utils.predictions import predictions

# Create your views here.

@api_view(['POST'])
def data_return(request):
    image_request = request.data['image'].file
    im = Image.open(image_request)
    # im.show()
    filepath = 'backend/static/handwritingrecognition/user_image.png'
    im.save(filepath)
    
    IMG_SIZE = 28
    img_array = cv2.imread(filepath, cv2.IMREAD_GRAYSCALE)
    mod_array = list(img_array)

    # center the image - no padding
    mod_array = center_image(mod_array)

    # we will now begin padding
    mod_array = pad_image(mod_array)

    # convert to a numpy array
    mod_array = np.array(mod_array, dtype='uint8')

    # resize the image, reshape, make prediction
    new_array = cv2.resize(mod_array, (IMG_SIZE, IMG_SIZE))
    new_array = new_array.reshape(-1, IMG_SIZE, IMG_SIZE, 1)
    prediction = predictions(new_array)

    print(prediction)

    return HttpResponse(prediction)
