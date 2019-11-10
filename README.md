# Handwriting Recognition

A Python and TensorFlow/Django backend with a React frontend to read handwriting

### Currently

Working on the frontend
- Created a canvas using p5
- We are able to get X and Y coordinates on mouse down, we stop getting coordinates when mouse is up, we don't get any coordinates if mouse is not on canvas

No backend as of yet


### Todos
The first goal: recognize the letters 'a', 'b', and 'c'

Frontend
1. Be able to draw on the canvas with coordinates received (in white)
2. Be able to read that drawing in React (assuming in the form of pixels? we'll see) upon submit

Create the testing samples
3. Once we are able to read the data, we will create tons of 'a', 'b', and 'c' letters to train our model with. Have an appropriate file structure for the data to make it easy to gather

Create standalone Python/Tensorflow files
4. Py data file - Create the dataset (use pickle)
5. Py train file - Create a model for the dataset - find the best one, pay close attention to val_loss (Tensorboard)
6. Py predict file - Test out a couple of your own samples -  just to make sure model.predict() works as intended. This is what will be used in production. 

Backend
7. First make sure I can have React talk to Django (because I've never done this before), and vice-versa
8. Test out some calls - more than likely we'll be using postman, and then try it with React
9. Hook up Python and Django together for the complete backend endpoint
10. Test out some calls again

Back to frontend
11. Have React receive the call back from Django and output that in some `Result` section of the frontend


### Future:
- Be able to read all lowercase a-z (one input in the canvas)
  - Will need samples of all of these lowercase letters, of course
- Be able to read all uppercase A-Z
- Be able to read full words/sentences, plan below:
  - "chop" up every single letter in the canvas
  	- We could say one "chop" happens when we have a good amount of black pixel space between 2 drawn lines (letters)
  	- Caveat: we should not allow letters to interfere with other letters' vertical space (ie: writing "hey" - we should not allow the 'y' to end up under the 'e' so that this algorithm can work properly)
  	- A giant amount of black pixel space indicates a space

### Extras
- Giving the user more "canvas" space if they perfer so
  - We would do this by allowing the page to scroll left and right
- Giving the user some sort of "undo" function
  - We could do that by eliminating data in React state!
- If we are doing "chops", we will probably need to normalize the data so that all images are the same size
  - Maybe we would pad the images with black space?
- using 'o' vs 'O' - I'm thinking we would get a reference of the height of all letters that are being handwritten and adjust the letter going into the model accordingly


### Initialization
- Be sure to download p5 directly [from the p5 site](https://p5js.org/download/) and drop it in `node_modules` manually
