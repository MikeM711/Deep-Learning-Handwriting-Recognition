# import tensorflow.keras as keras
# import numpy as np

# def predictions(img_array):
#     model = keras.models.load_model("handwriting/utils/model.h5")

#     #idx prediction
#     prediction = model.predict(img_array)

#     # predictions = model.predict_classes(img_array)
#     idx_prediction = np.argmax(prediction[0])
#     class_mapping = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabdefghnqrt'
#     char_prediction = class_mapping[idx_prediction]
#     # return predictions[0]
#     return char_prediction