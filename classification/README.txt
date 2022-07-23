Overview:
readdata.py implements helper functions for reading data from txt from one user
helper.py implements helper functions for processing data and doing classification after reading the data
test.py tests all sub-functions and the main function for classification
demo.py shows how to do classification for one user when having data stored in a txt file

Requirements:
python 3.7.12
numpy 1.21.6

Example of setting up the environment:
conda create -n asd_test python=3.7
conda activate asd_test
conda install numpy

Usage:
1. Make sure you store one user's data into one txt file. Such as "../a.txt"
2. Once you have this txt file, sample usage is in demo.py
    a. filepath = '../a.txt'
    b. ten_arr, xdata = split_data(filepath)
    c. prediction = test_one_user(ten_arr, xdata)
    d. prediction = 0 means healthy, 1 means possibly ASD, -1 means can't decide

Note:
The classification method, and result are not fully studied due to lack of data. 
This result is based on a simple classification method for the purpose of showing the full pipeline.
