# interfaces

# import libraries
import numpy as np
import sys

# constants
# threshold
lower_bd = 0.45
higher_bd = 0.6

# data dimension
total_points = 500
per_img_points = 50
num_img = 10

# used for test.py
# total_points = 10
# per_img_points = 1
# num_img = 10

# data range
invalid_const = -1000
left = 0.0
right = 1.0

# arr is a [0,1] vector
# 1 means a kid is looking at object image
# 0 means a kid is looking at social images
# -1 means invalid data
# return int, -1 if can't identify, 0 if healthy, 1 if ASD
def final_classify(arr):
    num_obj = np.count_nonzero(arr == 1)
    num_soc = np.count_nonzero(arr == 0)

    if (num_obj + num_soc == 0):
        print("Invalid data: all eye tracking out of range.")
        sys.exit(1)

    else:
        percent = np.float(num_obj) / np.float(num_obj + num_soc)
        print("Percent of obj eye-fixation time:", percent)

        # Behaviors not discussed in paper: percent > 0.55
        result = -1
        # ASD pay no different attention to both images
        if lower_bd <= percent and percent <= higher_bd:
            result = 1
        # Healthy kids like to look at social images
        if percent < lower_bd:
            result = 0

    return result

# xdata is an array of all x position
# img_arr is a [0,1] array, 0 means obj image is on the left and 1 means obj on the right
# return a [0,1] array 
# 1 means a kid is looking at object image
# 0 means a kid is looking at social images
def construct_arr(img_arr, xdata):
    mid = (left + right) / 2

    # pos where the kid look at right
    right_arr = xdata >= mid
    # pos where the kid look at left
    left_arr = xdata < mid
    # pos where invalid data exist
    invalid_arr = xdata == invalid_const

    # pos where the kid look at right and obj is on the right,
    # and the kid look at left and obj is on the left
    arr = right_arr * img_arr - left_arr * (img_arr - 1)
    arr[invalid_arr] = -1

    return arr

# extend initial array
def construct_img_arr(ten_arr):
    idx = 0
    img_arr = np.zeros(total_points)
    for i in range(num_img):
        for j in range(per_img_points):
            img_arr[idx] = ten_arr[i]
            idx += 1
    return img_arr


# return int, -1 if can't identify, 0 if healthy, 1 if ASD
# diagnosis for a child with a chosen threshold
# left and right are different for different devices
def test_one_user(ten_arr, xdata):
    img_arr = construct_img_arr(ten_arr)
    arr = construct_arr(img_arr, xdata)
    result = final_classify(arr)
    return result



