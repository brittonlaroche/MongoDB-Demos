exports = async function(payload) {
  var cPackage = context.services.get("mongodb-atlas").db("ship").collection("package");
  console.log("Executing updatePackageWebhook");
  var queryArg = payload.query.arg || '';
  var body = {};
  var result = {"status": "Unknown: Payload body may be empty"};
  var currentPkgDoc = {};
  var updatePackageDoc = {};
  var searchDoc = {};
  
  if (payload.body) {
    console.log(JSON.stringify(payload.body));
    body = EJSON.parse(payload.body.text());
    console.log(JSON.stringify(body));
    var nDate = new Date();
    
    //abort if we dont have a shipment_id or package_id
    if (body.shipment_id){
      //continue
    } else {
      result = { "status": "Error: shipment_id is not present"};
      return result;
    }
    
    //check the package_id
    if ( body.package_id ) {
        //Get current package from shipping document to insure we dont lose data 
        searchDoc = {"shipment_id": parseInt(body.shipment_id), "package_id": body.package_id};
        currentPkgDoc = await context.functions.execute("findPackage", searchDoc);
        if (currentPkgDoc){
          console.log("Current Package Found");
        } else {
          currentPkgDoc = {};
        }
        //build an update document
        //if data is missing on the body set it to the currentPkgDoc
        if (body.owner_id) {
          updatePackageDoc.owner_id = body.owner_id;
        } else {
           if (currentPkgDoc.owner_id){updatePackageDoc.owner_id = currentPkgDoc.owner_id;}
        }
        if (body.tag_id) {
          updatePackageDoc.tag_id = body.tag_id;
        } else {
           if (currentPkgDoc.tag_id) {updatePackageDoc.tag_id = currentPkgDoc.tag_id;}
        }
        if (body.type) {
          updatePackageDoc.type = body.type;
        } else {
           if (currentPkgDoc.type) {updatePackageDoc.type = currentPkgDoc.type;} 
        }
        if (body.tracking) {
          updatePackageDoc.tracking = body.tracking;
        } else {
           if (currentPkgDoc.tracking) {updatePackageDoc.tracking = currentPkgDoc.tracking;} 
        }
        if (body.description) {
          updatePackageDoc.description = body.description;
        } else {
           if (currentPkgDoc.description) {updatePackageDoc.description = currentPkgDoc.description;} 
        }
        if (body.last_event) {
          updatePackageDoc.last_event = body.last_event;
        } else {
           if (currentPkgDoc.last_event) {updatePackageDoc.last_event = currentPkgDoc.last_event};
        }
        if (body.location) {
          updatePackageDoc.location = body.location;
        } else {
           if(currentPkgDoc.location) {updatePackageDoc.location = currentPkgDoc.location;}
        }
        console.log("updating package collection");
        cPackage.updateOne(
          {package_id: body.package_id},
          {$set: {
              owner_id: updatePackageDoc.owner_id,
              shipment_id: parseInt(body.shipment_id),
              package_id: body.package_id,
              tag_id: updatePackageDoc.tag_id,
              type: updatePackageDoc.type,
              tracking: updatePackageDoc.tracking,
              description: updatePackageDoc.description,
              last_event: updatePackageDoc.last_event,
              location: updatePackageDoc.location,
              last_modified: nDate,
              total_body: body
              }
          },
          {upsert: true}
        );
        console.log("after update");
    } else {
      result = { "status": "Error: package_id is not present"};
      return result;
    }

    // Let's return the document we find after creating the employee 
    searchDoc = {"shipment_id": body.shipment_id, "package_id": body.package_id};
    result = await context.functions.execute("findPackage", searchDoc);
  }
  return  result;
};