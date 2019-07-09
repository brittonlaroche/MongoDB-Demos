# Shipping Application

## Overview
This shipping application provides to methods of getting data into and out of the MongoDB database.  One is through a REST based API that we will create in this section of the tutorial.  The other method utilizes stitch "Query Anywhere" and allows us to use the stitch browser SDK to query the database directly.  Lets get started with the REST based API.


## Stitch Serverless Rest Based API

The diagram below shows how a third party shipping provider can interact with us through the REST based API utilizing stitch authentication to call a webhook that will insert and retrieve shipping documents.

![Rest Diagram](../../img/queryAnywhereRestAPI.png)   


We will focus on creating the findShipmentService, the addShipmentService, and the updatePackageService.  These services will have correespond webhooks that allow the third party shipping providers to access their data in our system.

### Prerequisites
[Postman](https://www.getpostman.com/downloads/) or curl   


### 1. Create a stitch function to query shipment data
log into the atlas console https://cloud.mongodb.com and click the "Stitch" menu item on the left. Select your stitch application "__shipping__." Select "functions" from the menu item on the left and create a new function named: __findShipment__   

![Console](../../img/findShipment2.jpg "Console")

Select "Functions" from the left navigation panel in the stitch console. Click the "Create New Function" button in the upper right corner.  Give the function a name __"findShipment"__ and click "Save."  This will bring up the function editor, cut and paste the code below and click "Save."
```js
exports = async function( aSearchDoc ){
  /*
    Accessing application's values:
    var x = context.values.get("value_name");

    Accessing a mongodb service:
    var collection = context.services.get("mongodb-atlas").db("dbname").collection("coll_name");
    var doc = collection.findOne({owner_id: context.user.id});

    To call other named functions:
    var result = context.functions.execute("function_name", arg1, arg2);

    Try running in the console below.
  */
  
  console.log(JSON.stringify("Function findShipment called ... executing..." ));
  var shipment = context.services.get("mongodb-atlas").db("ship").collection("shipment");
  var doc = shipment.findOne(aSearchDoc);
  console.log(JSON.stringify("return document" ));
  console.log(JSON.stringify(doc));
  return doc;
};
```

Notice that we made this function async in the declaration.  This will allow the calling function to await a database response while this function does the work to find the shipment specified.  The shipment search criteria is specified in the search document passed in as an argument.

### 2. Create a webhook to call the function to query shipment data
Create the __"findShipmentService"__    
Select "Services" from the left navigation panel in the Stitch Console.  Click the "Add a Service" button. In the add a service dialog select the "HTTP" button and give the service a name __"findShipmentService"__ and click the "Add Service" button.   

![Console](../../img/findShipmentService.jpg "Console")
Create the __"findShipmentWebhook"__   
Next we add an incoming webhook.  The prompt screen should appear after saving the service.  Click the "Add Incoming Webhook" button. In the add webhook screen give the webhook a name __"findShipmentWebhook"__ and move the slider to "Respond with Result."  For now we will turn off validation. Click the save button.  

![Webhook](img/findEmployee3.jpg "Webhook")

After saving the findShipmentWebhook the function editor is now present.  Cut and paste the code below and click "Save."

```js
// This function is the webhook's request handler.
exports = async function(payload) {
    // Data can be extracted from the request as follows:

    var body = {};
    var result = {};
    if (payload.body) {
      console.log(JSON.stringify(payload.body));
      body = EJSON.parse(payload.body.text());
      console.log(JSON.stringify(body));
      result = await context.functions.execute("findShipment", body);
    }
    
    return  result;
};
```

Notice that in our webhook function we take in the payload body, which should be a search document, and call our find shipment function created earlier.
