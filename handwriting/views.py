from django.shortcuts import render
from django.http import HttpResponse
from django.http import HttpRequest
from django.views.decorators.csrf import csrf_exempt

max_ = max # cv2 * overrides python max function
from PIL import Image
from cv2 import *
import numpy as np
import tensorflow.keras as keras
from rest_framework.decorators import api_view

from handwriting.utils.center_image import center_image
from handwriting.utils.pad_image import pad_image
from handwriting.utils.cut_pictures import cut_pictures

# The "model jury" 
model_1 = keras.models.load_model("handwriting/utils/models/model_1.h5")
model_2 = keras.models.load_model("handwriting/utils/models/model_2.h5")
model_3 = keras.models.load_model("handwriting/utils/models/model_3.h5")
model_4 = keras.models.load_model("handwriting/utils/models/model_4.h5")
model_5 = keras.models.load_model("handwriting/utils/models/model_5.h5")


@api_view(['POST'])
def data_return(request):

    # Function prepares the raw image given by the user for predictions
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
            return False, False, False, False

        # Trim off all excess pixels and center it up
        mod_array = center_image(mod_array)

        # Here is where we cut the images up
        # We will find where letters start and end and where large spaces are found
        array_of_chars, space_location = cut_pictures(mod_array)

        char_img_converted_to_in_sample = []
        char_img_heights = []
        char_img_widths = [] # Helps us differentiate between "O" and "0" if needed. 
        # I currently have the decision for this commented out below
        # As I am having second-thoughts on manipulating the neural net's predictions too much

        for char_img in array_of_chars:

            # trim off all excess pixels and center the char_img up
            char_img = center_image(char_img)

            char_img_heights.append(len(char_img))
            char_img_widths.append(len(char_img[0]))

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
        return char_img_converted_to_in_sample, space_location, char_img_heights, char_img_widths

    # Function takes in a model and img and outputs a character prediction
    def make_prediction(model, img):
        prediction = model.predict(img)
        idx_prediction = np.argmax(prediction[0])
        return class_mapping[idx_prediction]
    
    # This function is where all model predictions come together, the most popular prediction wins
    def model_jury_ruling(*argv):
        all_predictions = []
        for arg in argv:
            all_predictions.append(arg)
        
        hash = {}
        
        for prediction in all_predictions:
            if prediction not in hash:
                hash[prediction] = 1
            else:
                hash[prediction] += 1
            
        print(hash)
        
        # If all models do not have a unanimous vote, majority rules
        # Note: If there is a tie, the first item of the tie that is added gets priority over rest of the items
        return max_(hash, key=hash.get)


    # Save the image to a predetermined filepath
    image_request = request.data['image'].file
    im = Image.open(image_request)
    # im.show()
    filepath = 'static/handwritingrecognition/user_image.png'
    im.save(filepath)

    # The "answer key"
    # If a lowercase letter is not found in the string, that means the only difference in casing is the size
    class_mapping = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabdefghnqrt'

    # Identifying the what case uniformed-cased letters should be
    # Example: when a c should be a C
    # We will say that half the canvas dictates the casing
    LOWER_CASE = im.height * .50

    # The below letters are special letters
    # Not only are their lowercase counterparts the same, they can also be the same height
    # These characters need special params to identify upper and lowercase
    tall_uniform_lc_letters = 'klpy'
    TALL_UNIFORM_LC = im.height * .70

    # Prepare the image
    final_images, space_location, char_img_heights, char_img_widths = prepare(filepath)

    # For the case where nothing is drawing
    if final_images == False and space_location == False and char_img_heights == False:
        return HttpResponse('Please draw something!')

    # Iterate through the images
    # All 5 models will make a prediction at each image, and the majority rules
    final_prediction = []
    for idx, img in enumerate(final_images):

        char_prediction_1 = make_prediction(model_1, img)
        char_prediction_2 = make_prediction(model_2, img)
        char_prediction_3 = make_prediction(model_3, img)
        char_prediction_4 = make_prediction(model_4, img)
        char_prediction_5 = make_prediction(model_5, img)

        print('\n',char_prediction_1, char_prediction_2, char_prediction_3, char_prediction_4, char_prediction_5)

        # Combined prediction
        final_char_prediction = model_jury_ruling(char_prediction_1, char_prediction_2, char_prediction_3, char_prediction_4, char_prediction_5)


        # Differentiate between a "0" and a "O" - commented out for now
        # Problem: "O" and "0" have incredibly similar-looking samples, every model has trouble with these 2 classifications
        # Solution: The ratio of height and width of all images will determine what is a "0" (narrow) or a "O" (fat)
        # if final_char_prediction == "0" or final_char_prediction == "O":

        #     HEIGHT_WIDTH_RATIO = 1.2 # upperbound is 0, lowerbound is O
        #     img_height_width_ratio = char_img_heights[idx] / char_img_widths[idx]
        #     # print(img_height_width_ratio)

        #     if img_height_width_ratio < HEIGHT_WIDTH_RATIO:
        #         final_char_prediction = "O"
        #     else:
        #         final_char_prediction = "0"


        # Convert letter to lowercase if the final prediction is a character that is drawn small, and is not found in class_mapping
        if final_char_prediction.isnumeric() == False and final_char_prediction.lower() not in class_mapping:
            if final_char_prediction.lower() in tall_uniform_lc_letters:
                if char_img_heights[idx] < TALL_UNIFORM_LC:
                    final_char_prediction = final_char_prediction.lower()
            elif char_img_heights[idx] < LOWER_CASE:
                final_char_prediction = final_char_prediction.lower()

        # Typically, "zeroes" (0) are fairly large, we would typically rather have "o" instead if a 0 if a user makes them small
        if final_char_prediction == '0' and char_img_heights[idx] < LOWER_CASE:
            final_char_prediction = 'o'
            
        final_prediction.append(final_char_prediction)
        # print('we predict the answer is:', final_char_prediction)
        if idx in space_location:
            final_prediction.append(' ')

    print('Final Prediction: ', final_prediction)

    return HttpResponse(final_prediction)
