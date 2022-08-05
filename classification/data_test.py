# demo

# import libraries
from helper import test_one_user
from readdata import split_data
import numpy as np
from os import listdir
from os.path import isfile, join


def per_user_test(filepath):
    
    ten_arr, xdata = split_data(filepath)
    prediction = test_one_user(ten_arr, xdata)
    if (prediction == 0):
        print("The user is not likely to have ASD.")
    elif (prediction == 1):
        print("The user may have ASD.")
    else:
        print("Can't identify.")


def main():
    mypath = "data"
    filepath_list = [f for f in listdir(mypath) if isfile(join(mypath, f))]
    print(filepath_list)
    
    for filepath in filepath_list:
        per_user_test(filepath)


if __name__ == "__main__":
    main()
