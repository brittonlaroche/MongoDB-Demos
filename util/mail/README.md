# Gmail contact creator

## Getting started
Its a 5 step process to be a pro at creating your own personal contact list based on your gmail account.  Any email or meeting invite sent via email will have a list of contacts you can search with this script. This script gathers everyone in the email chain, from, to and cc and gathers their first and last name if provided and generates a list while removing everyone from mongodb or 10gen.

1. Be sure you have python istalled.
2. Copy the source file ---> [here](https://raw.githubusercontent.com/brittonlaroche/MongoDB-Demos/master/util/mail/source/mail.py) <--- and save it as mail.py.
3. Set up a google app password 
4. Run the program and specify the company name you wish to generate email contacts for
5. Clean the output and import into google sheets

## Step 3 - Set up a google app password
Follow the instructions here: https://support.google.com/accounts/answer/185833

1. Go to your Google Account.   
2. On the left navigation panel, choose Security.   
3. On the "Signing in to Google" panel, choose App Passwords. If you don’t see this option:   
    2-Step Verification is not set up for your account.    
    2-Step Verification is set up for security keys only.   
    Your account is through work, school, or other organization.    
    You’ve turned on Advanced Protection for your account.    
4. At the bottom, choose Select app and choose the app you’re using.   
5. Choose Select device and choose the device you’re using.  (this will be your mac)   
6. Choose Generate.    
7. Follow the instructions to enter the App Password. The App Password is the 16-character code in the yellow bar on your device.
Choose Done.    
    Take this app key and replace the line in the script with your own   . 



