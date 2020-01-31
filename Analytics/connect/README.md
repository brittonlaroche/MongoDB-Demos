# Connecting to an Atlas instance from MongoDB Compass

Complete the registration process by clicking the link sent to your email address.  You have been given project owner permissions which gives you full control to perform the following steps.

## Log in
Go to https://cloud.mongodb.com   
and login with the username of your email address and the use the password you specified during registration.  In order to connect compass to the database you will need to configure network access and create a database user.

## 1. Network Access
Click the __"Network Access"__ menu item from the left hand navigation menu under the __"Security"__ header.

![Network](img/networkAccess.png "Network")   

Click the __"Add IP Adress"__ button on the far right.

![IP](img/addIP.png "IP")  

Add in the IP Address and CIDR information

![IP](img/addIP2.png "IP")  

## 2. Create a user for Database Access
Click the __"Database Access"__ menu item from the left hand navigation menu under the __"Security"__ header.   

![database](img/databaseAccess.png "database")  

Create a new user, password and assign roles.  In the example above we created a __"test"__ user with admin priviliges.

## 3. Copy the connect string information from the Atlas Console
Click the __"Connect"__ button from the top cluster view in the Atlas console.





