# Shipping Application

## Overview 

In this short 60 minute tutorial we are going to create a shipping application that tracks changes to packages as they are transported over time.  To accomplish this we will modify the results of our [MongoDB blog tutorial](https://docs.mongodb.com/stitch/tutorials/blog-overview/) to create a new shipping html file by adding additional fields and using an "upsert" (update / insert) into a new __"Ship"__ database with a __shipment, package and checkpoint__ collection. We will add a trigger to update the shipment bill of lading and insert the full document to a checkpoint collection when changes are made to the package collection.  We will add some additional functions and enable a REST based API through a serverless framework to communicate with external shipping companies, cutomers and baggage and package handlers.

![Diagram](img/packageTrigger3.png "Diagram")   

It is important to note the various componets we will be using in the tutorial, listed in the diagram above. The Stitch serverless framework will monitor the package collection through a Stitch trigger.  As soon as it detects a change, the trigger function will execute inside the Stitch serverless framework and outside of the database.  This affords a highly scalable solution with out impacting database processing, as the trigger function code always executes outside of the database server. Additonal information on triggers are available here [MongoDB Trigger Documenatation](https://docs.mongodb.com/stitch/triggers/).

The process begins with a user inserting a shipping document into the shipping collection.  The shipping document containins an array of packages to be shipped.  The original document can be inserted through a webhook using a REST based API or through a browser application.
As the packages are tagged and checked in, the package information is updated or inserted into the package collection.  The trigger fires and updates the shipping document with the new package location and event information.

![Bag Check](img/efficiencies-check.jpg "Bag Check")  

The bag scanner or the application that is updated by the bag scanner can update the package information using the stitch serverless rest based API called Stitch.  The REST based API opens the door for shipping companies to send shipping documents before the packages arrive.  The shipping document is updated as the packages are checked in and loaded and acts as a bill of lading, acknowledging receipt of each package as cargo for shipment.

![REST API](img/queryAnywhereRestAPI.png "REST API")  


All of the major components of the shipping application have been captured in the diagrams above. In this tutorial we will create the following objects to develop the shipping application.

## MongoDB Objects Required

### Collections
__shipment__   
__package__   
__checkpoint__   

### Functions
__findShipment__   
__findPackage__   
__fncPackageUpdate__   

### Trigger
__trgPackageCheckpoint__   

### Services
__findShipmentService__   
__findPackageService__   
__addShipmentService__   
__updatePackageService__   


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
	"description": "5x8x10 Cargo hold expect 5 to 10 Packages",
	"plan": [
        {
            "order": 1,
	    "flight": "123",
            "from": "DFW",
            "to": "BOS",
            "date": "07/25/2019"
        },
        {
            "order": 2,
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
            "desc": "2x4 Foot Locker Blue",
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
            "package_id": "ABCXYZ1234",
            "tag_id": "XYZ1234",
            "desc": "2x4 Foot Locker Red",
            "weight": "120 lbs",
            "last_event": "curbside check in",
	    "location": "DFW",
            "last_modified": {
		        "$date": {
		            "$numberLong": "1564091863007"
		        }
		    }
        },
        {
            "package_id": "ABCXYZ1235",
            "tag_id": "XYZ1235",
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
            "package_id": "ABCXYZ1236",
            "tag_id": "XYZ1236",
            "desc": "Laundry Bag of foot ball jerseys",
            "weight": "35 lbs",
            "last_event": "curbside check in",
	    "location": "DFW",
            "last_modified": {
		        "$date": {
		            "$numberLong": "1564091863533"
		        }
		    }
        },{
            "package_id": "ABCXYZ1236",
            "tag_id": "XYZ1236",
            "desc": "Laundry Bag of football jerseys",
            "weight": "35 lbs",
            "last_event": "curbside check in",
	    "location": "DFW",
            "last_modified": {
		        "$date": {
		            "$numberLong": "1564091863633"
		        }
		    }
        },
        {
            "package_id": "ABCXYZ1237",
            "tag_id": "XYZ1236",
            "FedexTracking": "12344456789",
            "desc": "8 x 10 Envelope",
            "weight": "8 ounces",
            "last_event": "Fed Ex Dropship",
	    "location": "DFW",
            "last_modified": {
		        "$date": {
		            "$numberLong": "1564091863033"
		        }
		    }
        }
    ],
    "last_modified": "07/25/2019"
}
```
Notice that the shipping document has a plan.  The plan is an array of subdocuments or objects that describe what flights the packages will be shipped on and in what order. Now that we have a basic overview, we are ready to begin developing the shipping application.

## Creating an Atlas Cluster
Our first step is to create an atlas cluster.  In our example we will create a free tier cluster known as an M0.  Head to https:/cloud.mongodb.com to sign up.  Additional instructions are available here: [Atlas getting started Guide](https://docs.atlas.mongodb.com/getting-started/)   

## Creating the stitch shipping application
Once we have created the cluster we will create a new stitch application.  Select "Stitch" from the left hand navigation pane of the Atlas console.  This brings up the stitch console and presents us with a button labled "Create New Stitch Application."

