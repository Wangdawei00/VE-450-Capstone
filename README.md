# VE-450-Capstone

Note: this setup should be run under a Linux environment (either WSL or Linux distribution), it is not guaranteed to work on MacOS.

Run the following command to set up a new environment
```
bin/asdinstall
```

You might be prompted to install python3, python3-venv or node. 
The installation might take a few minutes, be patient.

**_Note_:** If you are using WSL, the installation might be faster if you put this project under the Linux path instead of the Windows path. npm tends to work slower over a network connection.
|**Bad Example**|**Good Example**|
|---------------|----------------|
|/mnt/d/Users/Wangdawei/VE-450-Capstone|/home/wangdawei/VE-450-Capstone|

Then you should activate the python virtual environment:
```
source env/bin/activate
```
After that, you can use the following command to setup a local website

```
bin/asdrun
```

After a few seconds, an ip address, together with a port, will appear in the command line and you can visit it in your browser.

**Note:** If you did not change the javascript file, you can comment out line 14 `npx webpack` in `bin/asdrun` to save time from compiling the bundled js files.
