# Atlas and Stitch - Quick Start Hands on Lab

# Overview
Our lab is designed to teach Atlas and Stitch as quickly as possible with no dependencies.  You will only need a browser and a text editor. We will create a free tier Atlas cluster, load in some sample data and explore document data model.  We will learn some basic queries against the document datamodel.  Next we will create our first stitch application and query the database.  We will enable the Stitch serverlss REST API to access and update data.  We will create a stitch trigger and finally a QueryAnywhere browser SDK application.

![Diagram](../img/workshop6.png "Diagram")

The diagram above shows us all the objects we will be creating in this quick tutorial and how they interact.  The next 12 steps will give you the understanding you need to develop your own application using Atlas and Stitch.

## ![1](../img/1b.png) Create your first Atlas cluster

Open a modern browser and go to https://cloud.mongodb.com.  Register for an atlas account by clicking the __"get started free"__ button.

![Get Started](../img/register1.jpg "Get started")

Click the __"get started free"__ button.  This will bring up a screen for you to enter your personal information.

![Create free your account](../img/register2.jpg "Create your free account")   

Fill in your personal information.  Feel free to use your work or personal email address, either is fine as this is your personal "free for life" development environment.  Agree to the terms of service and click the __"get started free"__ button.  


![build your cluster](../img/register3.jpg "build your first cluster")   

This will bring up window promptin you to build your first cluster.  Click the __"build your first cluster"__ button.  When prompted select "Learning MongoDB" as to the reason you are interested in Atlas. After clicking the Click the __"build your first cluster"__ button, you will be prompted to name your cluster.  "

![Name your cluster](../img/register4.jpg "Name your cluster")   

__"Cluster0"__ is the default name and works well for importing data and projects later. Click the __"Create Cluster"__ button at the bottom and your cluster will be ready in the next 7 to 10 minutes.

## ![2](../img/2b.png) Load Sample Data

Once we have our cluster created the next step is to load data and explore the document structure.  Atlas provides sample data that helps viusalize some examples.  

![Load Sample Data](../img/loadSampleData.jpg "Load Sample Data")   
On the main screen for the __"Cluster0"__ home page you will notice four buttons, "Connect", "Metrics", "Collections" and  three dots "..." Click the button labeled with three dots __"..."__ to see a menu list of items.  Select the menu item __"Load Sample Dataset"__

After the sample data is loaded, we will want to see the data and explore the document datamodel.  Lets click the __"Collections"__ button and explore the databases and collections we just loaded.

![Collections](../img/collections.jpg "Collections") 

Navigate to the __"samples_supplies"__ database namespace and expand the database to see the sales collection.  Click the __"sales"__ collection and the sales data is displayed in document format.  If you hover over the first document a __">"__ arrow will appear in the upper left, pressing the button will expand the document and show all the values in nested arrays.

## ![3](../img/3b.png)  Query the Sample data

We can create a simple query to pull back sales data for the store located in austin with the following document query:   

```{"storeLocation": "Austin"}```   

Type this in query in the filter section and press the __"Find"__ button.

![Query data](../img/find.jpg "Find") 


We can do a more advanced find.  Suppose you were asked to generate a report on customers who were of retirement age to offer a promotion and a special discount on their next purchase.  The customer is an object embeded in the sales document and we need to refrence the age demographic value.  A simple nested query with dot notaion will allow us to get all the customers greater than or equal to 65 years of age.

``` 
{"customer.age":  {$gte: 65}}
```  

## ![4](../img/4b.png) Create a Stitch Application   
![Application](../img/stitch1.jpg)

![Application](../img/stitch2.jpg)

## ![5](../img/5b.png) Create a Stitch function to query customer data  
![Function](../img/function1.jpg)

```js
exports = async function( aSearchDoc ){
  console.log("Function findCustomer called ... executing..." );
  var sales = context.services.get("mongodb-atlas").db("sample_supplies").collection("sales");
  console.log("Function findCustomer Search document");
  console.log(JSON.stringify(aSearchDoc));
  var doc = await sales.findOne(aSearchDoc);
  console.log("return document");
  console.log(JSON.stringify(doc));
  return doc;
};
```
![Function](../img/function2.jpg)
```js
exports({"customer.email": "div@me.it"})
```
![Function](../img/function3.jpg)


## ![6](../img/6b.png) Create a Stitch service to expose the search function as a REST API

![Service](../img/service.jpg)

![webhook](../img/webhook1.jpg)

```js
// This function is the webhook's request handler.
exports = async function(payload) {
    // Data can be extracted from the request as follows:

    var body = {};
    var result = {};
    console.log("inside getCustomerWebhook");
    if (payload.body) {
      console.log("Payload body");
      console.log(JSON.stringify(payload.body));
      body = EJSON.parse(payload.body.text());
      console.log("Parsed Payload body");
      console.log(JSON.stringify(body));
      result = await context.functions.execute("findCustomer", body);
    }
    return  result;
};
```

![webhook](../img/webhook2.jpg)

## ![7](../img/7b.png) Create a webpage to show the document from the search service


```js
        const response = await fetch(webhook_url, {
          method: httpVerb,
          body: inputDoc, // string or object
          headers: {
            'Content-Type': 'application/json'
          }
```
![Postrapper](../img/postrapper2.jpg)

```js
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Postrapper</title>
    <!-- When you need to test a json body in a REST API call, but don't have access to postman. -->
    <!-- Britton LaRoche's Postrapper can get you the results you need!  -->
    <!-- Let's use Bootstrap improve the default look a bit -->
    <link
      rel="stylesheet"
      href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css"
    />
  </head>
  <style>
    div {
      margin-left: 40px;
    }
    table td {
      padding: 5px;
    }
  </style>
  <body>
    <div>
      <h2>Postrapper</h2>
      <p>
        This simple page demonstrates json REST based API calls
      </p>
      <form>
        <table>
          <tr><td style="padding: 10">URL:</td><td><input style="min-width: 1000px;" type="text" id="input_url" name="input_url"/></td></tr>
          <tr><td> VERB:</td><td> <input type="text" id="input_verb" name="input_verb" value="POST" /></td></tr>
          <tr><td> Input Document:</td><td> <textarea class="form-control" id="input_json" rows="5"></textarea></td></tr>
          <tr><td> Results: </td><td> <textarea class="form-control" id="results" rows="10"></textarea></td></tr>
        </table>
      </form>
      <br>
      <button type="submit" onclick="sendJson()">Send</button>
    </div>
    <script>
      const sendJson = async () => {
        var txt = "";
        var httpVerb = document.getElementById("input_verb").value;
        var webhook_url = document.getElementById("input_url").value;
        var inputDoc = document.getElementById("input_json").value; 
        console.log(webhook_url);
        const response = await fetch(webhook_url, {
          method: httpVerb,
          body: inputDoc, // string or object
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const myJson = await response.json(); //extract JSON from the http response
        console.log(myJson);
        document.getElementById("results").innerHTML = JSON.stringify(myJson, undefined, 2);
      };
    </script>
  </body>
</html>
```

![webhook](../img/webhook3.jpg)   

```{"customer.email": "div@me.it"}```   

## ![8](../img/8b.png) Create a user with an API key
We begin by adding a bit of security and creating an API Key and assoicated user permissions.  This is not necessary as we could create an anonymous user, use a third party athentication method (facebook, google, AWS Cognito, JWT etc..)  Let us quickly explore our options.  Click on the __"Users"__ menu item in the left hand navigation pane in the stitch console.  The users window will display a list of users (we have not created any). Lets click the providers tab at the top of the users window.  We are presented with a list of options as seen below.

![users](../img/users5.jpg "users")

Third party providers such as facebook and google provide an excellent way for customers to access data and will be covered at a point in the future.  For now explore the custom option as you can see how to integrate with a Single Sign On (SSO) provider like AWS cognito, or something you are using in house through Java Web Tokens (JWT) as this eliminates the headache of user management for your application.

For now we will generate an API Key.  Select the __"API Keys"__ option and click the edit button.

![users](../img/users3.jpg "users")

Type in a name for the API Key, something like "BackOffice" or "WebAccess" and click save.  A private key will be displayed.  Copy that key and paste it into a text editor of your choice.  Then create the api key.  We will use that key to access the database through the stitch browser SDK.

## ![9](../img/9b.png) Create a web application for a marketing promotion
The best getting started guide with the browser client SDK is [the blog tutorial](https://docs.mongodb.com/stitch/tutorials/blog-overview/).  It consists of two main parts, the [Blog Tutorial back end](https://docs.mongodb.com/stitch/tutorials/guides/blog-backend/), and the [Blog Tutorial Front end](https://docs.mongodb.com/stitch/tutorials/guides/blog-web/).  We will offer a condensed version of the blog tutorial with a couple of new concepts.  It is highly recommended to complete the blog tutorial when you have time.

We will be using the [Mongo DB Stitch Browser SDK](https://docs.mongodb.com/stitch-sdks/js/4/index.html) to create a web based application that turns the browser into a fully functional stitch client.  The client will be able to execute the MongoDb Query Language (MQL) directly from the browser.  This will help us build an application to select specific customers for a promotional offering.

![Rules 1](../img/rules1.jpg)
![Rules 2](../img/rules2.jpg)
![Rules 3](../img/rules3.jpg)
![Rules 3](../img/rules4.jpg)

Copy the code from the [QueryAnywhere.html](../html/QueryAnywhere.html) file.  Right click and select "open file in new tab" the [QueryAnywhere.html](../html/QueryAnywhere.html) link click the view raw file button select all the text and paste it in a text editor.  Save the file as QueryAnywhere.html

Replace your your-api-key with the private api key you generated in step 8. You may have to repeat step 8 if you forgot to copy the private API key.  Replace your-app-id with the stitch APP-ID located in the upper left of the stitch console.
```js
      const credential = new stitch.UserApiKeyCredential("your-api-key");
      const client = stitch.Stitch.initializeDefaultAppClient('your-app-id');
```
Example
```js
      const credential = new stitch.UserApiKeyCredential("1kJ3BEMz4LGyvKGhcxqyWi8wAUnFJ8y3O6clY6WAQLIv8D45xM9Az9rVPEjribVZ");
      const client = stitch.Stitch.initializeDefaultAppClient('sales-oxwdn');
```

Double click the file and you should see someting very similar to the following image.

![Rules 1](../img/QueryAnywhere.jpg)


## ![10](../img/10b.png) Create a trigger to capture changes to sales data

## ![11](../img/11b.png) Modify the trigger to capture marketing data

## ![12](../img/12b.png) Create an Atlas Chart


