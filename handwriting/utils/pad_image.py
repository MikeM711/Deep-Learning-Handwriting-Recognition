import numpy as np

# add 1/4 pixles of padding to the top and bottom
def pad_image(arr):
    # padding for top and bottom
    # we will pad 1/4 pixels of the height
    height_pad = len(arr)/4
    pre_pad_width = len(arr[0])
    arr_of_zeroes_height = pre_pad_width * [0]
    
    for px in range(int(height_pad)):
        arr.insert(0, arr_of_zeroes_height)
        arr.append(arr_of_zeroes_height)
    

    # We will now padd the sides so that the image is square
    post_pad_height = len(arr)
    width_pad = (post_pad_height - pre_pad_width) / 2
    arr_of_zeroes_width = int(width_pad) * [0]

    # we will add "width_pad" pixles to both sides of the image
    for px_height in range(len(arr)):
        # insert loop
        # for i in range(int(width_pad)):
        #     arr[px_height].insert(0)
        arr[px_height] = np.insert(arr[px_height], 0, arr_of_zeroes_width)
        arr[px_height] = np.append(arr[px_height], arr_of_zeroes_width)

    return arr