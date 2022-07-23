# test cases

# remember to set in helper.py so that
# total_points = 10
# per_img_points = 1
# num_img = 10

# import libraries
from helper import final_classify, construct_arr, construct_img_arr, test_one_user
import numpy as np

# test functions
def test_construct_img_arr_1():
    ten_arr = np.array([1,1,1,1,1,1,1,1,1,1]) # all obj images on the right
    img_arr = construct_img_arr(ten_arr)
    print(img_arr)

def test_construct_arr_1():
    ten_arr = np.array([1,1,1,1,1,1,1,1,1,1]) # all obj images on the right
    img_arr = construct_img_arr(ten_arr)
    basis_arr = np.ones(5)
    xdata = np.concatenate([basis_arr * 0.2, basis_arr * 0.8]) # first half look at left, second half look at right
    arr = construct_arr(img_arr, xdata)
    print(arr)

def test_construct_arr_2():
    ten_arr = np.array([1,1,1,1,1,1,1,1,1,1]) # all obj images on the right
    img_arr = construct_img_arr(ten_arr)
    basis_arr = np.ones(10) * 0.2 # all look at social images
    xdata = basis_arr
    arr = construct_arr(img_arr, xdata)
    print(arr)

def test_final_classify_1():
    arr = np.ones(10) # all look at obj
    prediction = final_classify(arr)
    if (prediction == -1):
        print("pass test final classify 1")
    else:
        print("fail test final classify 1")

def test_final_classify_2():
    arr = np.zeros(10) # all look at soc
    prediction = final_classify(arr)
    if (prediction == 0):
        print("pass test final classify 2")
    else:
        print("fail test final classify 2")

def test_suite_1():
    ten_arr = np.array([1,1,1,1,1,1,1,1,1,1]) # all obj images on the right
    basis_arr = np.ones(5)
    xdata = np.concatenate([basis_arr * 0.2, basis_arr * 0.8])
    prediction = test_one_user(ten_arr, xdata)
    if (prediction == 1):
        print("pass test suite 1")
    else:
        print("fail test suite 1")

def test_suite_2():
    ten_arr = np.array([1,1,1,1,1,1,1,1,1,1]) # all obj images on the right
    basis_arr = np.ones(10) * 0.2 # all look at social images
    xdata = basis_arr
    prediction = test_one_user(ten_arr, xdata)
    if (prediction == 0):
        print("pass test suite 2")
    else:
        print("fail test suite 2")

def main():
    test_construct_img_arr_1()
    test_construct_arr_1()
    test_construct_arr_2()
    test_final_classify_1()
    test_final_classify_2()
    test_suite_1()
    test_suite_2()

if __name__ == "__main__":
    main()