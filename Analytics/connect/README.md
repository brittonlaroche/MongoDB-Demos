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

![connect](img/connect1.png "connect") 

The list of connection methods are shown.  We select connect "Connect with MongoDB Compass"__   

![connect](img/connect2.png "connect") 

We click the copy button to copy the connect string as seen below:   

![connect](img/connect3.png "connect") 

## 4. Connect via Compass
Open Compass, it sould automatically detect the connect string in the windows copy buffer.  If it does not fill in the information as shown below.  Note that the __"Authentication Database"__ should be __"admin"__ and not __"test"__.

![copmass](img/compassConnect.png "compass") 


## 5. Create Scripts that call the API
Everything done above can be scripted through the Atlas API the over all refernce is listed below:   
https://docs.atlas.mongodb.com/reference/api-resources/

For database users:   
https://docs.atlas.mongodb.com/reference/api/database-users/

For IP Whitelist Network Access:  
https://docs.atlas.mongodb.com/reference/api/whitelist/



