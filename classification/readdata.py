# read data

# import libraries
import numpy as np

# helper function used to test the number of lines in a.txt
def test_num_lines():
    lines = []
    with open('../a.txt') as f:
        lines = f.readlines()

    count = 0
    for line in lines:
        count += 1

    print(count)
    f.close()

def split_data():
    # owner, class, xdata, ydata, type, flipped
    contents_split = []
    with open('../a.txt') as f:
        contents = f.read()
        contents_split = contents.split("|")
    f.close()

    # get data
    d_owner = contents_split[0]
    d_class = contents_split[1]
    d_xdata = contents_split[2].split(" ")
    d_ydata = contents_split[3].split(" ")
    d_type = contents_split[4]
    d_flipped = contents_split[5].split(" ")
    d_xdata = [float(i) for i in d_xdata]
    d_ydata = [float(i) for i in d_ydata]
    d_flipped = [int(i) for i in d_flipped]
    # print(len(d_xdata))
    # print(len(d_flipped))

    ten_arr = np.array(d_flipped)
    xdata = np.array(d_xdata)
    # print(ten_arr)
    # print(xdata)


def main():
    split_data()


if __name__ == "__main__":
    main()