exports = async function( aSearchDoc ){

  console.log(JSON.stringify("Function findCustomer called ... executing..." ));
  var shipment = context.services.get("mongodb-atlas").db("single").collection("master");
  var doc = shipment.findOne(aSearchDoc);
  console.log(JSON.stringify("return document" ));
  console.log(JSON.stringify(doc));
  return doc;
};