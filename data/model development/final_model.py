import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, Activation, Flatten
from tensorflow.keras.layers import Conv2D, MaxPooling2D
from tensorflow.keras.callbacks import TensorBoard
from tensorflow.keras.callbacks import TensorBoard
from sklearn.model_selection import train_test_split
import pickle
import time

# Constants
HEIGHT = 28
WIDTH = 28
class_num = 47

train_x = pickle.load(open("train_x.pickle", "rb"))
train_y = pickle.load(open("train_y.pickle", "rb"))

test_x = pickle.load(open("test_x.pickle", "rb"))
test_y = pickle.load(open("test_y.pickle", "rb"))

print(test_x.shape)

# partition to train and val
train_x, val_x, train_y, val_y = train_test_split(
    train_x, train_y, test_size=0.10, random_state=7)

# The final model: 2-conv-128-nodes-2-dense-0.2-Dropout
dense_layers = [2]
layer_sizes = [128]
conv_layers = [2]

for dense_layer in dense_layers:
    for layer_size in layer_sizes:
        for conv_layer in conv_layers:
            NAME = "Final:{}-conv-{}-nodes-{}-dense-0.2-Dropout-{}".format(
                conv_layer, layer_size, dense_layer, int(time.time()))
            
            # initialize TensorBoard in the loop
            tensorboard = TensorBoard(log_dir='logs/{}'.format(NAME))
            print(NAME) # Final:2-conv-128-nodes-2-dense-0.2-Dropout

            # Build the model
            model = Sequential()

            # Begin with Conv2D layer
            model.add(Conv2D(layer_size, (3, 3), input_shape=(HEIGHT, WIDTH, 1)))
            model.add(Activation('relu'))
            model.add(MaxPooling2D(pool_size=(2, 2)))

            for l in range(conv_layer - 1):
                # Extra Conv2D layers
                model.add(Conv2D(layer_size, (3, 3)))
                model.add(Activation('relu'))
                model.add(MaxPooling2D(pool_size=(2, 2)))

            model.add(Flatten())

            for l in range(dense_layer):
                # Adding dense layers
                model.add(Dense(layer_size))
                model.add(Activation('relu'))
                model.add(Dropout(0.2))

            # Output layer
            model.add(Dense(units=class_num, activation='softmax'))

            # Train the model
            model.compile(optimizer='adam',
                        loss='categorical_crossentropy',
                        metrics=['accuracy'])

            model.fit(train_x, train_y, epochs=10, batch_size=32,
                    validation_data=(val_x, val_y),
                    callbacks=[tensorboard])

            model.save('model.h5')
