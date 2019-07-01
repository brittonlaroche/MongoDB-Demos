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
```
{"_id":{"$oid":"5d12bcd6873143e36b737000"},   
"shipment_id":{"$numberInt":"100"},   
"customer_id":"ABC123",  
"first_name":"Bob",   
"last_name":"Jones",   
"contact_phone":"19721234444",   
"contact_email":"bjones@mail.com",   
"address":"123 Main Street, Frisco TX 75034",   
"description":"5x8x10 Cargo hold expect 5 to 10 Packages",   
"plan":[   
    {"flight":"123","from":"DFW","to":"BOS","date":"07/25/2019"},   
    {"flight":"227","from":"BOS","to":"BUF","date":"07/25/2019"}
],   
"packages":[   
    {"package_id":"ABCXYZ1233",   
     "tag_id":"XYZ123",   
     "desc":"2x4 Foot Locker Blue",   
     "weight":"125 lbs",   
     "last_event":"curbside check in",   
     "last_modified":{"$date":{"$numberLong":"1564091863001"}}},{"package_id":"ABCXYZ1234","tag_id":"XYZ1234","desc":"2x4 Foot Locker Red","weight":"120 lbs","last_event":"curbside check in","last_modified":{"$date":{"$numberLong":"1564091863007"}}},{"package_id":"ABCXYZ1235","tag_id":"XYZ1235","description":"black suitcase","weight":"55 lbs","last_event":"curbside check in","last_modified":{"$date":{"$numberLong":"1564091863033"}}},{"package_id":"ABCXYZ1236","tag_id":"XYZ1236","desc":"Laundry Bag of foot ball jerseys","weight":"35 lbs","last_event":"curbside check in","last_modified":{"$date":{"$numberLong":"1564091863533"}}},{"package_id":"ABCXYZ1236","tag_id":"XYZ1236","desc":"Laundry Bag of football jerseys","weight":"35 lbs","last_event":"curbside check in","last_modified":{"$date":{"$numberLong":"1564091863633"}}},{"package_id":"ABCXYZ1237","tag_id":"XYZ1236","FedexTracking":"12344456789","desc":"8 x 10 Envelope","weight":"8 ounces","last_event":"Fed Ex Delivery","last_modified":{"$date":{"$numberLong":"1564091863033"}}},{"package_id":"DDFEGC123000","fullDocument":{"package_id":"DDFEGC123000","owner_id":"webhook","shipment_id":{"$numberLong":"100"},"tag_id":"DDFEGC123","current_event":"off loaded from plane","description":"5x10x5 fedex box","weight":"5 lbs","final_destination":"BUF","fedex_tracking":"123555678911","last_modified":{"$date":{"$numberLong":"1561510050810"}},"parent_id":{"$oid":"5d12bd1e6a9a9a73a533eb0f"}}}],"last_modified":"07/25/2019"}
```
