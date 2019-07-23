
# Customer MDM Application
_Solution Architect Author_: [Britton LaRoche](mailto:britton.laroche@mongodb.com)   

## Tutorial Contents 
(Note: This prototype tutorial is hands on and should take an estimated time of less than 60 minutes)
1. [Overview](.)
2. [Accesing shipment data through a REST based API](tutorial/rest/README.md)
3. [Tiggers and Functions](tutorial/triggers/README.md)
4. [QueryAnywhere](tutorial/queryAnywhere/README.md)
5. [Importing from GitHub: Stitch Command Line tool](tutorial/cli/README.md)
6. [Host your application tutorial](tutorial/hosting/README.md)  

## Overview 
![Kankata](img/kankatalogo2.png "Kankata")  

We've been hired by a fictitious auto manufacturing company called "Kankata" to build a customer MDM application prototype.  Kankata has a global market place consisting of automobile dealerships online websites for its customers of its two major brands. Kankata motors sells quality family vehicles, and its high end luxury brand Legacy motors sells high performance extreemly high end luxury vehicles.  Each brand has its own set of dealerships and systems that repersent the customer in a variety of different ways.  Kankata may have the same customer or the same customer household buying both brands and is unaware that these two apparently different customers may be the same individual buying cars for the same household.

![Kankata Sedan](img/kankatasedan2.png "Kankata")  

You have been tasked to create a minimum viable product (MVP), a basic protype, of a customer MDM application across all dealerships and online sites for both Kanakata and Legacy brands. They wish to test both the functionality and performance of the application.  The functionality includes identifying a single customer from all systems and providing customer updates in real time to their third party dealerships and financing division.

![Legacy](img/legacylogo.png "Legacy")  

Additionally Kankata motors has been given the task of removing sesnitive customer data from all its transaction systems. The California Consumer Privacy Act (CCPA) goes into effect at the beginning of next year.  The intent is to identify the customer through a unique token in the Customer MDM and use only the token in all the related transactional systems.  When a transaction system needs to display customer information it will request that information via a webservice that will communicate to the Customer MDM application through a rest API.

The desire is to have a serveless REST based API layer that will not require maintenance and can scale automatically as demand increases with out maintenance or human intervention.

![Legacy GS480](img/legacycar.jpg "Legacy GS480")  

Customer data will be loaded into the Customer MDM as new customers come into the website and sign up for promotional offerings.  Customer data will also come into the Customer MDM with nightly batch loads from Kankata financial services for the previous days loan applications.  The two different dealerships also load prospective customers and customer purchase data when a vehicle is taken for a test drive or purchased.  All of these websites and dealerships have a variety of data formats.

Our job is to ingest data from all these sources and both preserve a record of the data as it exists in each of these systems as well as a master copy that reconciles the customer into a single view and golden source of truth across all of the systems.
