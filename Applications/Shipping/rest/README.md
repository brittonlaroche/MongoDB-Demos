# Shipping Application

## Overview
This shipping application provides to methods of getting data into and out of the MongoDB database.  One is through a REST based API that we will create in this section of the tutorial.  The other method utilizes stitch "Query Anywhere" and allows us to use the stitch browser SDK to query the database directly.  Lets get started with the REST based API.


## Stitch Serverless Rest Based API

The diagram below shows how a third party shipping provider can interact with us through the REST based API utilizing stitch authentication to call a webhook that will insert and retrieve shipping documents.

![Rest Diagram](../img/queryAnywhereRestAPI.png)   


We will focus on creating the findShipmentService, the addShipmentService, and the updatePackageService.  These services will have correespond webhooks that allow the third party shipping providers to access their data in our system.
