# Shipping Application

## Overview 

In this 60 minute tutorial we are going to create a shipping application that utilizines a living shipping document that tracks changes to packages as they are transported over time.  To accomplish this we will modify the results of our [MongoDB blog tutorial](https://docs.mongodb.com/stitch/tutorials/blog-overview/) to create a new shipping html file by adding additional fields and using an "upsert" (update / insert) into a new __"Ship"__ database with a __shipment, package and checkpoint__ collection. We will add a trigger to update the shipment bill of lading and insert the full document to a checkpoint collection when changes are made to the package collection.  We will add some additional functions and enable a REST based API through a serverless framework to communicate with external shipping companies, cutomers and baggage and package handlers.

![Diagram](img/packageTrigger3.png "Diagram")   

It is important to note the various componets we will be using in the tutorial, listed in the diagram above. The Stitch serverless framework will monitor the package collection through a Stitch trigger.  As soon as it detects a change, the trigger function will execute inside the Stitch serverless framework and outside of the database.  This affords a highly scalable solution with out impacting database processing, as the trigger function code always executes outside of the database server. Additonal information on triggers are available here [MongoDB Trigger Documenatation](https://docs.mongodb.com/stitch/triggers/).

The process begins with a user inserting a shipping document into the shipping collection.  The shipping document containins an array of packages to be shipped.  The original document can be inserted through a webhook using a REST based API or through a browser application.
As the packages are tagged and checked in, the package information is updated or inserted into the package collection.  The trigger fires and updates the shipping document with the new package location and event information.

![Bag Check](img/efficiencies-check.jpg "Bag Check")  

The bag scanner or the application that is updated by the bag scanner can update the package information using the stitch serverless rest based API called Stitch.  The REST based API opens the door for shipping companies to send shipping documents before the packages arrive.  The shipping document is updated as the packages are checked in and loaded and acts as a bill of lading, acknowledging receipt of each package as cargo for shipment.

![REST API](img/queryAnywhereRestAPI.png "REST API")  


All of the major components of the shipping application have been captured in the diagrams above. In this tutorial we will create the following objects to develop the shipping application.

## MongoDB, Atlas & Stitch Objects Required

Think of all these objects as building blocks.  You can use them in unique ways, connect them together and build anything. Today we will use them to build a complete shipping application in the cloud with database as a service.  All of these triggers and functions will run serverless, no maintenance no fuss and with near limitless scale.

![Building blocks](img/buildingBlocks2.png "Build anything")  

### Collections
__shipment__: contains the full shipping document that acts as a bill of lading.   
__package__: conatins the package information, its last update and curent location   
__checkpoint__: contains a history of the package and the time for each checkpoint it passed through   

### Functions
__findShipment__: finds a specific shipping document based on a search document   
__findPackage__: finds a specific package document based on a search document   
__fncPackageUpdate__: a function that updates the checkpoint and shipping collection   

### Triggers
__trgPackageCheckpoint__: a trigger that watches the package collection and calls the __fncPackageUpdate__ function   

### Services
__findShipmentService__: A REST based service that calls the __findShipment__ function and returns the shipment document   
__findPackageService__: A REST based service that calls the __findPackage__ function and returns a specific package document
__addShipmentService__: A REST based service that allows a full shipping document to be inserted into MongoDB   
__updatePackageService__: A REST based service that can be called from multiple sources including a package scanner to update package events, checkpoints and location information.   


## Shipping Document
Below we have a sample shipping document with a mix of items.  A football team is shipping its gear along with a mix of coordinated FedEx packages and envelopes related to the football game.  Additional items are expected and will be added to the packages array when they are checked in.
```
{ 
	"shipment_id": 100,
	"customer_id": "ABC123",
	"first_name": "Bob",
	"last_name": "Jones",
	"contact_phone": "19721234444",
	"contact_email": "bjones@mail.com",
	"address": "123 Main Street, Frisco TX 75034",
	"description": "5x8x10 Cargo hold. Expect 5 to 10 Packages Football team shipment.",
	"ship_date": "07/25/2019",
	"last_modified": "07/25/2019",
	"plan": [
        {
            "order": "1",
	    "flight": "123",
            "from": "DFW",
            "to": "BOS",
            "date": "07/25/2019"
        },
        {
            "order": "2",
            "flight": "227",
            "from": "BOS",
            "to": "BUF",
            "date": "07/25/2019"
        }
    ],
    "packages": [
    	{
            "package_id": "ABCXYZ1233",
            "tag_id": "XYZ123",
            "type": "DIRECT SHIP",
            "description": "2x4 Foot Locker Blue",
            "weight": "125 lbs",
            "last_event": "curbside check in",
            "location": "DFW",
            "last_modified": {
		        "$date": {
		            "$numberLong": "1564091863001"
		        }
		    }
        },
        {
            "package_id": "ABCXYZ1235",
            "tag_id": "XYZ1235",
            "type": "DIRECT SHIP",
            "description": "black suitcase",
            "weight": "55 lbs",
            "last_event": "curbside check in",
            "location": "DFW",
            "last_modified": {
		        "$date": {
		            "$numberLong": "1564091863033"
		        }
		    }
        },
        {
            "package_id": "ABCXYZ1237",
            "tag_id": "XYZ1236",
            "type": "FEDEX",
            "tracking": "12344456789",
            "description": "8 x 10 Envelope",
            "weight": "8 ounces",
            "last_event": "Fed Ex Dropship",
            "location": "DFW",
            "last_modified": {
		        "$date": {
		            "$numberLong": "1564091863033"
		        }
		    }
        }
    ]
}
```
Notice that the shipping document has a plan.  The plan is an array of subdocuments or objects that describe what flights the packages will be shipped on and in what order. Now that we have a basic overview, we are ready to begin developing the shipping application.

## Design Patterns
One of the most critical aspects of application design is getting the document schema correct.  In our application we could have one single shipping collection.  We would maintain all packages in an array in the main shipping document.  This would satisfy the majority of the requirements. Lets assume that tracking the package and knowing its history is important.  We want to know how long it takes to load a package from curbside checkin to the plane, and how long it takes to offload the packages and put them in the right location once the plane lands.  This information is critical for process improvements that reduce costs and increase revenue.  Additionally most of the updates are directed to the package not any of the shipping information.  

Lets review some of the design patterns here [MongoDB Docunent Design Patterns](https://www.mongodb.com/blog/post/building-with-patterns-a-summary) to get some ideas that may help shape our collection choices and our schema design.  After reviewing the patterns we see two that help us come up with an efficent design to handle updates and search requests at the package level, and to keep a full history of the time it took to process the package at each step.

To capture the changes to the packages over time keeping a full history of the time it took to pass through each checkpoint we will use apsect of the [document versioning](https://www.mongodb.com/blog/post/building-with-patterns-the-document-versioning-pattern) pattern.  In order to keep package information relevant with shipping information we can use the [extended reference](https://www.mongodb.com/blog/post/building-with-patterns-the-extended-reference-pattern) pattern.

We will dicuss the use of the design patterns in the relevant sections of the tutorial, for now we simply wish to introduce the concept of using design patterns to develop and effective document schema.

## 1. Create an Atlas Cluster
Our first step is to create an atlas cluster.  In our example we will create a free tier cluster known as an M0.  Click the following link https://cloud.mongodb.com to sign up.  Additional instructions on creating an Atlas cluster are available here: [Atlas getting started Guide](https://docs.atlas.mongodb.com/getting-started/)   

## 2. Create the stitch shipping application
Once we have created the cluster we will create a new stitch application.  There are two different approaches to creating the shipping application.  Because the application has been created and hosted in GitHub, you could import the application directly into your environment.  Alternatively you can follow this tutorial and manually create the application. 

If you are new to MongoDB Stitch I recommend creating the functions and services manually through this tutorial as it will help you learn the process of creating a stitch application step by step.  You can follow up with the stitch command line tool by exporting your completed application and loading it into GitHub.

### A. Manually Creating the Application
Select "Stitch" from the left hand navigation pane of the Atlas console.  This brings up the stitch console and presents us with a button labled "Create New Stitch Application." Click the create new application button and give the new stitch application the name "__shipping__" in the pop up window.  Scroll to the bottom of the window and click the create button.

The stitch application console should appear displaying new stitch shipping application window.   

![Stitch App](img/shippingApp.jpg "Stitch App") 

### B. Continue the shipping Tutorial
The next step is to insert the shipping document through the stitch serveless REST based API.  Please click the link here [Shipping REST API](tutorial/rest/README.md) to continue building the application.  

### C. Importing the Application from GitHub
__Note:__ only follow this section if you plan on importing the application rather than learning all the steps to build it.  __Please click the link here__ [Shipping REST API](tutorial/rest/README.md) to continue following the flow of the tutorial.  

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


