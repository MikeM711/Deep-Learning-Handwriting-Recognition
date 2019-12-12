from django.shortcuts import render
from django.http import HttpResponse
from django.http import HttpRequest
from django.views.decorators.csrf import csrf_exempt

from PIL import Image
from cv2 import *
import numpy as np
import tensorflow.keras as keras
from rest_framework.decorators import api_view

from handwriting.utils.center_image import center_image
from handwriting.utils.pad_image import pad_image
from handwriting.utils.cut_pictures import cut_pictures
# from handwriting.utils.predictions import predictions

# Create your views here.

@api_view(['POST'])
def data_return(request):
    image_request = request.data['image'].file
    im = Image.open(image_request)
    # im.show()
    filepath = 'static/handwritingrecognition/user_image.png'
    im.save(filepath)

    model = keras.models.load_model("handwriting/utils/models/model_best_emnist.h5")

    # prepare for predictions

    def prepare(filepath):
        IMG_SIZE = 28
        img_array = cv2.imread(filepath, cv2.IMREAD_GRAYSCALE)

        mod_array = list(img_array)

         # test to see if anything was drawn
        for col in range(len(mod_array[0])):
            for row in range(len(mod_array)):
                pxl_value = mod_array[row][col]
                if pxl_value != 0:
                    break
            if pxl_value != 0:
                    break

        print(row, col)
        if col == len(mod_array[0]) - 1 and row == len(mod_array) - 1:
            return False, False, False

        # trim off all excess pixels and center it up
        mod_array = center_image(mod_array)

        # here is where we cut the images up
        #### We will find where letters start and end and where large spaces are found
        array_of_chars, space_location = cut_pictures(mod_array)

        char_img_converted_to_in_sample = []
        char_img_heights = []
        for char_img in array_of_chars:

            # trim off all excess pixels and center the char_img up
            char_img = center_image(char_img)

            char_img_heights.append(len(char_img))

            # we will now begin padding
            char_img = pad_image(char_img)
            # convert to a numpy array
            char_img = np.array(char_img, dtype='float32')

            # resize the image, reshape, make prediction
            char_img = cv2.resize(char_img, (IMG_SIZE, IMG_SIZE))
            char_img /= 255

            # plt.imshow(char_img, cmap=plt.cm.binary)
            # plt.show()

            char_img = char_img.reshape(-1, IMG_SIZE, IMG_SIZE, 1)
            char_img_converted_to_in_sample.append(char_img)
        return char_img_converted_to_in_sample, space_location, char_img_heights

    # The "answer key"
    class_mapping = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabdefghnqrt'


    # Identifying the what case uniformed-cased letters should be
    # Example: when a c should be a C
    # We will say that half the canvas dictates the casing
    LOWER_CASE = 200

    # The below letters are special letters
    # not only are their lowercase counterparts the same, they can also be the same height
    # these characters need special params to identify upper and lowercase
    tall_uniform_lc_letters = 'klpy'
    TALL_UNIFORM_LC = 280

    final_images, space_location, char_img_heights = prepare(filepath)

    # For the case where nothing is drawin
    if final_images == False and space_location == False and char_img_heights == False:
        return HttpResponse('Please draw something!')

    final_prediction = []
    for idx, img in enumerate(final_images):
        prediction = model.predict(img)

        idx_prediction = np.argmax(prediction[0])
        char_prediction = class_mapping[idx_prediction]

        # Convert letter to lowercase if it is relatively small
        if char_prediction.isnumeric() == False and char_prediction.lower() not in class_mapping:
            if char_prediction.lower() in tall_uniform_lc_letters:
                if char_img_heights[idx] < TALL_UNIFORM_LC:
                    char_prediction = char_prediction.lower()
            elif char_img_heights[idx] < LOWER_CASE:
                char_prediction = char_prediction.lower()
        
        # Typically, "zeroes" (0) are fairly large, we would typically rather have "o" instead if a user makes them small
        if char_prediction == '0' and char_img_heights[idx] < LOWER_CASE:
            char_prediction = 'o'

        # create an "i vs l" if statement if needed
        # Try to make a better model first

        final_prediction.append(char_prediction)
        # print('we predict the answer is:', char_prediction)
        if idx in space_location:
            final_prediction.append(' ')

    print('Final Prediction: ', final_prediction)

    return HttpResponse(final_prediction)
