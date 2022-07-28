# read data

# import libraries
import numpy as np
import sys


# helper function used to test the number of lines in a.txt
def test_num_lines(filepath):
    lines = []
    with open(filepath) as f:
        lines = f.readlines()

    count = 0
    for line in lines:
        count += 1

    print(count)
    f.close()


# function to read data from txt
def split_data(data: str):
    # owner, class, xdata, ydata, type, flipped
    contents_split = data.split("|")
    # get data
    try:
        d_owner = contents_split[0]
        d_class = contents_split[1]
        d_xdata = contents_split[2].split(" ")
        d_ydata = contents_split[3].split(" ")
        d_type = contents_split[4]
        d_flipped = contents_split[5].split(" ")
        d_xdata = [float(i) for i in d_xdata]
        d_ydata = [float(i) for i in d_ydata]
        d_flipped = [int(i) for i in d_flipped]
    except:
        print("Invalid data: wrong input file structure.")
        sys.exit(1)
    # print(len(d_xdata))
    # print(len(d_flipped))

    if (int(d_type) == 0):
        print("Declare to be healthy.")
    elif (int(d_type) == 1):
        print("Declare to have ASD.")
    else:
        print("Unknown patients.")

    ten_arr = np.array(d_flipped)
    xdata = np.array(d_xdata)
    # print(ten_arr)
    # print(xdata)
    return ten_arr, xdata


def main():
    filepath = '../a.txt'
    with open(filepath) as f:
        contents = f.read()
    ten_arr, xdata = split_data(contents)


if __name__ == "__main__":
    main()
