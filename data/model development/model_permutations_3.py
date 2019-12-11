import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, Activation, Flatten
from tensorflow.keras.layers import Conv2D, MaxPooling2D
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

# train and val split
train_x, val_x, train_y, val_y = train_test_split(
    train_x, train_y, test_size=0.10, random_state=7)

# 3rd run: All layers have 256 neurons with dropout
dense_layers = [1, 2]
layer_sizes = [256]
conv_layers = [2]

for dense_layer in dense_layers:
    for layer_size in layer_sizes:
        for conv_layer in conv_layers:
            # Dropout used in the name
            NAME = "{}-conv-{}-nodes-{}-dense-0.2-Dropout-{}".format(
                conv_layer, layer_size, dense_layer, int(time.time()))
            
            # initialize TensorBoard in the loop
            tensorboard = TensorBoard(log_dir='logs/{}'.format(NAME))
            print(NAME)

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
                # Below 2nd time around
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