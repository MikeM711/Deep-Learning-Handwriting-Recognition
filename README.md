# Deep Learning Handwriting Recognition

A full stack React/JavaScript and Python/Django web application that recognizes handwriting and converts it into text, by incorporating a machine learning model that was pre-trained using the [EMNIST Dataset](https://www.kaggle.com/crawford/emnist) on Kaggle. This neural network model recognizes all digits, all uppercase letters, and all lowercase letters that are visibly different from their uppercase counterparts. 

The model was trained on the following characters: `0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabdefghnqrt`

To account for these "left out" lowercase letters that look like their uppercase complement, the final prediction for these characters are converted into lowercase if the character is drawn less than half the height of the canvas. For "tall" versions of these lowercase characters, `ikpy`, these characters will be converted into lowercase if their heights are less than 70% of the canvas height.

## Features
- The following characters can be predicted from handwriting: `0-9, a-z, A-Z` (62 characters)
- Characters can be placed anywhere on the canvas, providing that the character has some horizontal space between other characters
- Whole sentences can be created
- "Broken" and "sloppy" letters can be detected with pretty good accuracy
- React as the frontend

Website: [Live Heroku App](https://handwriting-recognition-py-js.herokuapp.com/)

<img width=600px src="https://raw.githubusercontent.com/MikeM711/Deep-Learning-Handwriting-Recognition/master/data/screenshot.png"/>

## Model
There are some models that people have made over at [Kaggle](https://www.kaggle.com/crawford/emnist/kernels) that also use Tensorflow/Keras. But I created my own model and saved it as `model.h5`.

-- MODEL TWEAKING: WORK IN PROGRESS --

## How the Incoming Data is Fed Into The Model
1. Example: A user writes and submits the handwriting, "Hey you", on the client.
2. The frontend takes the image data found in the canvas element and converts it into a binary blob.
3. The blob is sent as a `POST` request to Django.
4. The image is saved in Django and the filepath is loaded into `cv2`.
5. The entire "Hey you" image is trimmed of excess pixels.
6. "Hey you" is cut up on each character giving us the 6 images "H", "e", "y", "y", "o", "u".
   * Images are cut up where drawing lines in the x-direction are not continuous, and where the space of discontinuity is of a decent size. Small discontinuous spaces are left alone.
   * The algorithm will notice a very large discontinuous space in the x-direction between the two "y" letters, which is implied to be a text-space. We will store this knowledge in the variable `space_location`.
7. Each image is trimmed of excess pixels. The height of each "raw" image is accounted for in the variable `char_img_heights`.
8. Each image is padded with extra pixels in a way where the image becomes a square shape. This is so that the image will not be warped when the image is resized down during data normalization.
9. Each image is normalized. Each image is converted to a numpy array, reshaped, and the pixel values range from 0 to 1 instead of 0 to 255.
10. We loop through all of these images - we make a predicton at each image and append the character result to `final_prediction`.
    * The model prediction for each image will be an output of a number between `0` through `46` which corresponds to the index of the 47 characters that the model was trained on. (Ex: an output of `17` corresponds to `H` in the mapping).
    * When the final prediction is mapped and if that prediction is alphabetical, we make sure that the lowercase compliment is found inside of the mapping. If it is not, that means we have a letter where the lower and uppercase are similar, the only difference is the size. We need to make a decision on the output casing based on the size of the image, which we get from `char_img_heights`. This decision will be performed on the images "y", "y", "o" and "u". The letter "y" gets a special constraint because its height is larger than the average lowercase letter.
    * While iterating, if the number of loop iterations equals a number inside `space_location`, a `" "` is appended to the final result. In this example, `space_location` will have `[2]` signaling that there's a space after "y" - which will give us a `"Hey "` at the end of the first "y" iteration.
11. Django responds with `final_prediction` to React with `"Hey you"`, and React displays the result on the client.


## Installation

1. Clone the repo: `git clone https://github.com/MikeM711/Deep-Learning-Handwriting-Recognition.git`
2. Go into the root file: `cd Deep-Learning-Handwriting-Recognition`
3. Install npm packages for React: `npm install`
4. Make sure you have pipenv installed via pip: `sudo -H pip install pipenv`
5. Create a shell inside a virtual environment, at the address of your root: `pipenv shell`
6. Install packages for Django while inside your virtual environment: `pip install -r requirements.txt`
7. Run the frontend server: `npm start`
8. Run backend server within your virtual environment: `python manage.py runserver`

**Toubleshooting**
- Q: "How do I know that I am in my virtual environment?"
- A: In your terminal tab, you will notice that the address of the folder is in parenthesis. It should look like `(Deep-Learning-Handwriting-Recognition)...`