# demo

# import libraries
from helper import test_one_user
from readdata import split_data
import numpy as np


# demo usage
def main():
    # filepath = 'data/wangdawei.txt'
    # filepath = 'data/huiyu.txt'
    # filepath = 'data/huiyu2.txt'
    # filepath = 'data/wangtutu.txt'
    # filepath = 'data/hongfu.txt'
    # filepath = 'data/yewuqingfeng.txt'
    # filepath = 'data/huanghuiyuan.txt'
    # filepath = 'data/qianhaocheng.txt'
    # filepath = 'data/wanglinlin.txt'
    # filepath = 'data/wupengfei.txt'
    filepath = 'data/zhangsan.txt'
    
    ten_arr, xdata = split_data(filepath)
    prediction = test_one_user(ten_arr, xdata)
    if (prediction == 0):
        print("The user is not likely to have ASD.")
    elif (prediction == 1):
        print("The user may have ASD.")
    else:
        print("Can't identify.")


if __name__ == "__main__":
    main()
