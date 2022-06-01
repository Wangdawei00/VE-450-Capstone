# VE-450-Capstone

Note: this setup should be run under a Linux environment (either WSL or Linux distribution), it is not guaranteed to work on MacOS.

Run the following command to set up a new environment
```
bin/asdinstall
```

You might be prompted to install python3 or python3-venv. 
The installation might take a few minutes, be patient.

**_Note_:** If you are using WSL, the installation might be faster if you put this project under the Linux path instead of the Windows path. npm tends to work slower over a network connection.
|**Bad Example**|**Good Example**|
|---------------|----------------|
|/mnt/d/Users/Wangdawei/VE-450-Capstone|/home/wangdawei/VE-450-Capstone|


After that, you can use the following command to setup a local website

```
bin/asdrun
```

After a few seconds, an ip address, together with a port, will appear in the command line and you can visit it in your browser.
