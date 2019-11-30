import cv2
import numpy as np
import copy 

def cut_pictures(mod_array):

    # columns that are filled with zeroes (blank space)
    blank_cols = []

    for col in range(len(mod_array[0])):
        for row in range(len(mod_array)):
            #print(row, col)
            # find columns that are filled with zeroes
            # If we find a value, we will break
            pxl_value = mod_array[row][col]

            # break loop if we find a pxl value that is not 0
            # we will move on to the next column
            if pxl_value != 0:
                break

            # If we have traversed the entire row and found all zeroes, we will append that row to the  blank_cols array
            if row == len(mod_array) - 1:
                blank_cols.append(col)

    print(blank_cols)
    
    LETTER_SEPERATOR = 25
    SPACE_SEPERATOR = 125

    # if the user inputs one letter, we will simply return the image back, as an array
    # we will also send a space_location as an empty array
    if len(blank_cols) == 0:
        return [mod_array], []

    # If the user inputs exactly 2 drawings, but are VERY close to each other vertically, we will return the image back
    # We are saing that these 2 drawings are part of one character
    
    if blank_cols[len(blank_cols) - 1] - blank_cols[0] < LETTER_SEPERATOR:
        return [mod_array], []

    class BlankPxlColSpace:
        def __init__(self, start, end):
            self.start = start
            self.end = end

    grouped_blank_cols = []

    for i in range(len(blank_cols)):
        # initiate a "start" variable when we start the loop, and when the last row is not continuous with the first row
        if i == 0 or blank_cols[i] - blank_cols[i-1] != 1:
            start = blank_cols[i]
        
        # we end the group when we are at the end of the loop: blank_cols[len(blank_cols) - 1]
        if i == len(blank_cols) - 1 or blank_cols[i+1] - blank_cols[i] != 1:
            end = blank_cols[i]
            grouped_blank_cols.append(BlankPxlColSpace(start,end))

    print(grouped_blank_cols)

    # loop through grouped_blank_cols
    # Discard any start/end's that are less than LETTER_SEPERATOR
    # create an array to hold the position of spaces

    space_location = []
    img_cols_to_seperate = []

    for idx, group in enumerate(grouped_blank_cols):

        # If the grouping of blank columns are larger than the LETTER_SEPERATOR, bring them into the img_cols_to_seperate array
        if group.end - group.start > LETTER_SEPERATOR:
            img_cols_to_seperate.append(group)
        # If the grouping of blank columns are larger than the SPACE_SEPERATOR, take note of that position in our spaces array
        if group.end - group.start > SPACE_SEPERATOR:
            print('we have a space!')
            space_location.append(idx)
    
    # If there are no columns to seperate, we can assume that this is one full character
    if len(img_cols_to_seperate) == 0:
        return [mod_array], []

    print('space_location', space_location)
    print('img_cols_to_seperate', img_cols_to_seperate)

    def slice_image_vertically(start,end,img_arr):
        for row in range(len(img_arr)):
            img_arr[row] = img_arr[row][start:end]
        return img_arr

    characters_from_image = []
    for idx in range(len(img_cols_to_seperate) +1):

        if idx == 0 and len(img_cols_to_seperate) != 0:
            letter_begin = 0
            letter_end = img_cols_to_seperate[idx].start
        elif idx == len(img_cols_to_seperate):
            letter_begin = img_cols_to_seperate[idx-1].end
            letter_end = len(mod_array[0])
        else:
            letter_begin = img_cols_to_seperate[idx-1].end
            letter_end = img_cols_to_seperate[idx].start

        mod_array_for_slice = copy.deepcopy(mod_array)
        full_character = slice_image_vertically(letter_begin, letter_end, mod_array_for_slice)
        
        # plt.imshow(full_character, cmap=plt.cm.binary)
        # plt.show()

        characters_from_image.append(full_character)

    return characters_from_image, space_location