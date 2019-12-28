# Deep Learning Handwriting Recognition

A full stack React/JavaScript and Python/Django web application that recognizes handwriting and converts it into text, by incorporating multiple machine learning models that were pre-trained using the [EMNIST Dataset](https://www.kaggle.com/crawford/emnist) on Kaggle. These neural network models recognize all digits, all uppercase letters, and all lowercase letters that are visibly different from their uppercase counterparts.

The models were trained on the following characters: `0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabdefghnqrt`

To account for these "left out" lowercase letters that look like their uppercase complement, the final prediction for these characters are converted into lowercase if the character is drawn less than half the height of the canvas. For "tall" versions of these lowercase characters, `klpy`, these characters will be converted into lowercase if their heights are less than 70% of the canvas height.

The best independent model used inside of this application is more accurate than the rest of the models created by Kaggle users who use Tensorflow/Keras. To extend onto this - when this model, a similar model, and 3 other sub-optimal models (due to Heroku limitations) are combined, accuracy increases another `0.5%`.

## The Neural Network Models: Jupyter Notebook

The [Jupyter Notebook](https://github.com/MikeM711/Deep-Learning-Handwriting-Recognition/blob/master/data/Jupyter%20Notebook/Handwriting%20Recognition.ipynb) inside this repo describes how the neural network models were created for this web application. It goes step by step: from acquiring the outside dataset for learning to Heroku deployment.

## Demo

![demo](https://raw.githubusercontent.com/MikeM711/Deep-Learning-Handwriting-Recognition/master/data/hey-there-prediction.gif)


## Features
- The following characters can be predicted from handwriting: `0-9, a-z, A-Z` (62 characters)
- Characters can be placed anywhere on the canvas, providing that the character has some horizontal space between other characters
- Whole sentences can be created
- "Broken" and "messy" letters can be detected with pretty good accuracy
- React as the frontend

Website: [Live Heroku App](https://handwriting-recognition-py-js.herokuapp.com/)

<img width=600px src="https://raw.githubusercontent.com/MikeM711/Deep-Learning-Handwriting-Recognition/master/data/screenshot.png"/>

## How the Incoming Data is Fed Into The Models
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
10. We loop through all of these images - each model makes a prediction at each image. The most popular prediction between the models will be added to the final character result, `final_prediction`.
    * Each model prediction for each image will be an output of a number between `0` through `46` which corresponds to the index of the 47 characters that each model was trained on. (Ex: an output of `17` corresponds to `H` in the mapping).
    * The prediction of each model is mapped and compared with the model group.
    * The most popular prediction between the models in the group will be the final prediction.
    * If the final prediction between the models is alphabetical, we make sure that the lowercase compliment is found inside of the mapping. If it is not, that means we have a letter where the lower and uppercase are similar, the only difference is the size. We need to make a decision on the output casing based on the size of the image, which we get from `char_img_heights`. This decision will be performed on the images "y", "y", "o" and "u". The letter "y" gets a special constraint because its height is larger than the average lowercase letter.
    * While iterating, if the number of loop iterations equals a number inside `space_location`, a `" "` is appended to the final result. In this example, `space_location` will have `[2]` signaling that there's a space after "y" - which will give us a `"Hey "` at the end of the first "y" iteration.
11. Django responds with `final_prediction` to React with `"Hey you"`, and React displays the result on the client.

## My Views on Hard-Coded Prediction Tweaks

After a prediction has been decided by the neural network, I personally try to be as hands-off as possible when it comes to manipulating these results.

The current prediction manipulations I use are:

1. Convert characters to lowercase if a letter is both small, and the lowercase complement of the prediction is not found in the EMNIST dataset.
    * The reason for this manipulation is to have access to all lowercase letters as predictions.
2. If a prediction is `0` and the character is drawn quite small, the prediction is manipulated to a lowercase `o`
    * The reason for this manipulation is so that a small `0` will be read as an `o`, much like the manipulation of uppercase `O`
    * At this time, I am still hesitant on keeping this manipulation.

### If Manipulations Are Your Thing

I left in commented code where, if either characters `0` or `O` were predicted, the final prediction is dependent on the ratio of height/width of the character image. If a user writes a fat circle, the result will be a capital or lowercase `O`; if a user writes a narrow circle, the result will be the number `0`.

For determining "i" vs "I" (another issue with the EMNIST dataset), one could cook up some code during the `cv` portion and determine if a character has a hovering dot. One could do a better height estimate for casing by taking the total character height and negating the space between the dot and the base of the "i". 

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