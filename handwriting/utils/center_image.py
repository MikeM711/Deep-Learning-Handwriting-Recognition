def center_image(mod_array):
    # Find the top-most part of a letter

    def y_letter_boundary(arr):
        is_top_found = False
        # get top_arr
        for i in range(len(arr)):
            for j in range(len(arr[i])):
                if arr[i][j] != 0:
                    is_top_found = True
                    top_arr = i
                    break
            if is_top_found == True:
                break

        # get bottom_arr
        is_bottom_found = False
        for i in range(len(arr) - 1, 0, -1):
            for j in range(len(arr[i])):
                if arr[i][j] != 0:
                    is_bottom_found = True
                    bottom_arr = i
                    break
            if is_bottom_found == True:
                break

        return top_arr, bottom_arr

    y_begin_image, y_end_image = y_letter_boundary(mod_array)

    print('y_begin, y_end', y_begin_image, y_end_image)

    # image trimmed on top and bottom
    mod_array = mod_array[y_begin_image:y_end_image]

    def x_letter_boundary(arr):
        is_left_found = False
        for i in range(len(arr[0])):
            for j in range(len(arr)):
                if arr[j][i] != 0:
                    is_left_found = True
                    left_idx = i
                    break
            if is_left_found == True:
                break

        # Get right arr
        is_right_found = False
        for i in range(len(arr[0]) - 1, 0, -1):
            for j in range(len(arr)):
                if arr[j][i] != 0:
                    is_right_found = True
                    right_idx = i
                    break
            if is_right_found == True:
                break

        return left_idx, right_idx

    x_begin_image, x_end_image = x_letter_boundary(mod_array)

    print('x_begin', x_begin_image)
    print('x_end', x_end_image)

    # Trim off the left and right of the image
    for x in range(len(mod_array)):
        mod_array[x] = mod_array[x][x_begin_image:]
        img_x_size = x_end_image - x_begin_image
        mod_array[x] = mod_array[x][:img_x_size]
        
    # mod_array number now fits fully in its image 
    return mod_array