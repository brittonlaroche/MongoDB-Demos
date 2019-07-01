# Shipping Application

## Overview 

In this short tutorial we are going to create a Shipping application that tracks changes to packages as they are transported over time.  To accomplish this we will modify the results of our [MongoDB blog tutorial](https://docs.mongodb.com/stitch/tutorials/blog-overview/) by adding additional fields and using an "upsert" (update / insert) into a new __"Ship"__ database with a __shipment, package and checkpoint__ collection. We will add a trigger to update the shipment bill of lading and insert the full document to a checkpoint collection when changes are made to the package collection.

![Diagram](img/packageTrigger3.png "Diagram")   

It is important to note the various componets we will be using in the tutorial, listed in the diagram above. The Stitch serverless framework will monitor the package collection through a Stitch trigger.  As soon as it detects a change, the trigger function will execute inside the Stitch serverless framework and outside of the database.  This affords a highly scalable solution with out impacting database processing, as the trigger function code always executes outside of the database server. Additonal information on triggers are available here [MongoDB Trigger Documenatation](https://docs.mongodb.com/stitch/triggers/).

The process begins with a user inserting a shipping document insto the shipping collection.  The shipping collection containins an array of packages to be shipped.  As the packages are tagged and checked in, the package information is updated or inserted into the package collection.  The trigger fires and updates the shipping document with the new package location and event information.

![Bag Check](img/efficiencies-check.jpg "Bag Check")  
