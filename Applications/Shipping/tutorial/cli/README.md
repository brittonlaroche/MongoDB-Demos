## Importing the shipping Application from GitHub
_Solution Architect Author_: [Britton LaRoche](mailto:britton.laroche@mongodb.com)   

## Tutorial Contents 
(Note: All HR tutorials are hands on and should take an estimated time of less than 20 minutes)
1. [Overview](../../README.md)
2. [Accesing shipment data through a REST based API](../rest/)
3. [Query Anywhere, Tiggers and Functions](../queryAnywhere)
4. [Importing from GitHub: Stitch Command Line tool](../cli)
5. [Host your application tutorial](../hosting)   

## Overview
__Note:__ only follow this section if you plan on importing the application rather than learning all the steps to build it.  __Please click the link here__ [Shipping REST API](../rest/README.md) to continue following the flow of the tutorial.  

The following section shows how to import the application via this GitHub and the stitch command line tool __"stitch-cli"__. Knowledge of how the stitch command line works is important as you can integrate stitch-cli with your CICD (continuous integration and continuous delivery) tools.  This allows you to work in your native development enviroment, commit changes to GitHub and then deploy and test as you would normally through your CICD work flow.

The directions here are terse but complete as I refer you to documenation on setting up the stitch command line interface tool and importing the existing stitch shipping application:

#### 1. Intsall the stitch-cli tool
Begin by [Installing the Stitch Command Line Interface tool](https://docs.mongodb.com/stitch/import-export/stitch-cli-reference/)

#### 2. Creat a project API key
Next [Create a Project API key](https://docs.atlas.mongodb.com/configure-api-access/#programmatic-api-keys).  When you createthe API key be sure to give yourself the __"Project Owner"__ role as you will need this to import the stitch application.   

Right click this link [Create a Project API key](https://docs.atlas.mongodb.com/configure-api-access/#programmatic-api-keys) open in new tab. Follow intrsuction under __Manage Programmatic Access to a Project__ perform each step listed in the section __Create an API Key for a Project__ be sure to copy the private API key somewhere safe for future refence.

#### 3. Download the GitHub code
Export the MongoDB Demos as a zip file from https://github.com/brittonlaroche/MongoDB-Demos. Press the green button in the upper right labled __"Clone Or Download"__ and press the download a zip file link.   

#### 4. Extract the zip file
Exctact the zip file to the directory you installed the stitch-cli tool.  The shipping application stitch export is located under (stitch-cli path)/MongoDB-Demos-master/Applications/Shipping/exported

#### 5. Log in via stitch-cli
log into your atlas cluster with your API key (public and pprivate keys) with the stich command line tool.

Sample login instructions:
```
stitch-cli login --api-key=my-api-key --private-api-key=my-private-api-key
```

Example login:
```
stitch-cli login --api-key=ytqictxq --private-api-key=8137b118-4a36-4197-a3c7-23b73ba49775
←[0;0myou have successfully logged in as ytqictxq←[0m
```

#### 6. Import the shipping application
After logging in the command line maintains the connection until you execute the command __stitch-cli logout__.  We are now ready to import the application. The following command below should work.
```
stitch-cli import  --app-id=shipping-ekqoy --path=./MongoDB-Demos-master/Applications/Shipping/exported --strategy=replace
```

Follow the prompts and respond __y__ when asked if you would like to create a new app. Press enter to accept the default values.  Change the values to match your configuration.  An example is provided below.

```
stitch-cli import  --app-id=shipping-ekqoy --path=./MongoDB-Demos-master/Applications/Shipping/exported --strategy=replace
←[0;0mUnable to find app with ID: "shipping-ekqoy": would you like to create a new app? [y/n]:←[0m y
←[0;0mApp name [shipping]:←[0m
←[0;0mAvailable Projects:←[0m
←[0;0mProject 0 - 5ce58a9fc56c98145d922e93←[0m
←[0;0mAtlas Project Name or ID [Project 0]:←[0m
←[0;0mLocation [US-VA]:←[0m
←[0;0mDeployment Model [GLOBAL]:←[0m
←[0;0mNew app created: shipping-vibtf←[0m
←[0;0mImporting app...←[0m
←[0;0mDone.←[0m
←[0;0mSuccessfully imported 'shipping-vibtf'←[0m

stitch-cli logout

```

If you named your cluster anything other than the default __"Cluster0"__ then you will need to modify a json document to reflect your cluster name. The document is located in your directory here: /MongoDB-Demos-master/Applications/Shipping/exportedservices/mongodb-atlas/config.json

If you named your cluster "DevCluster" for example you would change the __"clusterName":__ field from __"Cluster0"__ to __"DevCluster"__.  An example has been provided below.

```

{
    "id": "5d218cb4e0601bec3de065c7",
    "name": "mongodb-atlas",
    "type": "mongodb-atlas",
    "config": {
        "clusterName": "DevCluster",
        "readPreference": "primary",
        "wireProtocolEnabled": false
    },
    "version": 1
}
```
Once you save your changes you are ready to try the import again.

#### 7. Prepare the database

Now that the application is created we need to prepare the database.  One of the things we need to do is add a unique index on the shipping_id field so we dont accidentally create duplicate shipment documents if someone attempts to add the same shipment twice.


