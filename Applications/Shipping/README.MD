# Shipping Application
_Solution Architect Author_: [Britton LaRoche](mailto:britton.laroche@mongodb.com)   

## Tutorial Contents 
(Note: All HR tutorials are hands on and should take an estimated time of less than 20 minutes)
1. [Overview](.)
2. [Accesing shipment data through a REST based API](tutorial/rest/README.md)
3. [QueryAnywhere, Triggers and Functions](tutorial/queryAnywhere/README.md)
4. [Importing from GitHub: Stitch Command Line tool](tutorial/cli/README.md)
5. [Host your application tutorial](tutorial/hosting/README.md) 


## Overview 
![Pronto](html/logo.png "Pronto")  

We've been hired by a ficticous airline called pronto to build a shipping application.  Pronto has a global fleet of passanger jetliners and makes multiple trips between major cities every day.  Pronto relaized that it could make use of its extra large cargo holds to take on additional cargo from third party shippers and companies that need to make timely deliveries. Pronto ran the numbers and now realize that this excess cargo space could increase regional profits by over 5 million dollars a month.

You have been tasked creating a minimum viable product (MVP) a basic protype of the application they wish to build to test both functionality and performance of renting cargo space and providing shipment updates in real time to their third party shippers.

In this 60 minute tutorial we are going to create a shipping application that utilizines a living shipping document that tracks changes to packages as they are transported over time.  To accomplish this take we will modify the results of our [MongoDB blog tutorial](https://docs.mongodb.com/stitch/tutorials/blog-overview/) to create a new shipping html file by adding additional fields and using an "upsert" (update / insert) into a new __"Ship"__ database with a __shipment, package and checkpoint__ collection. We will add a trigger to update the shipment bill of lading and insert the full document to a checkpoint collection when changes are made to the package collection.  We will add some additional functions and enable a REST based API through a serverless framework to communicate with external shipping companies, cutomers and baggage and package handlers.

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

![Building blocks](img/blocks.jpg "Build anything")  

Once you learn the basics of the docuemnt model and how the objects work together you will quickly relize you can build anything.  This shipping application is extremely similar to the [HR Application](../../Stitch/rest/README.md) in many respects, as many of the same concepts and objects were used to create the HR application.

### Functions:
__findShipment__: finds a specific shipping document based on a search document   
__findPackage__: finds a specific package document based on a search document   
__fncPackageUpdate__: a function that updates the checkpoint and shipping collection   

### Triggers:
__trgPackageCheckpoint__: a trigger that watches the package collection and calls the __fncPackageUpdate__ function   

### Services:
__findShipmentService__: A REST based service that calls the __findShipment__ function and returns the shipment document   
__findPackageService__: A REST based service that calls the __findPackage__ function and returns a specific package document
__addShipmentService__: A REST based service that allows a full shipping document to be inserted into MongoDB   
__updatePackageService__: A REST based service that can be called from multiple sources including a package scanner to update package events, checkpoints and location information.   

### Collections:
__shipment__: contains the full shipping document that acts as a bill of lading.   
__package__: conatins the package information, its last update and curent location   
__checkpoint__: contains a history of the package and the time for each checkpoint it passed through   
__codes__: a special collection containing codes for insuring certain fields use required values

### Indexes:
We need one unique index on the shipment id to avoid creating duplicates.

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

__Please click the link here__ [stitch-cli](tutorial/cli/README.md) to learn how to use the stitch command line interface.  

## Next Steps
The next step is to insert the shipping document through the stitch serveless REST based API.  Please click the link here [Shipping REST API](tutorial/rest/README.md) to continue building the application.  
