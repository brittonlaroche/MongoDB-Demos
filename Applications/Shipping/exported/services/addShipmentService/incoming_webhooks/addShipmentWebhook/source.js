exports = async function(payload) {
  var shipment = context.services.get("mongodb-atlas").db("ship").collection("shipment");
  console.log("Executing addShipmentWebhook");
  var queryArg = payload.query.arg || '';
  var body = {};
  var result = { "status": "Unknown: Payload body may be empty"};
  
  if (payload.body) {
    console.log(JSON.stringify(payload.body));
    body = EJSON.parse(payload.body.text());
    console.log(JSON.stringify(body));
    var nDate = new Date();
    //check the employee_id
    if ( body.shipment_id ) {
        console.log("inserting shipment collection");
        result = await shipment.insertOne(body);
        console.log("after update");
    } else {
      result = { "status": "Error: shipment_id is not present"};
      return result;
    }
  }
  return  result;
};
