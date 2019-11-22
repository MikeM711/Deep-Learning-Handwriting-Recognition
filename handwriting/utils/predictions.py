import tensorflow.keras as keras

def predictions(img_array):
    model = keras.models.load_model("handwriting/utils/model.h5")
    predictions = model.predict_classes(img_array)
    return predictions[0]