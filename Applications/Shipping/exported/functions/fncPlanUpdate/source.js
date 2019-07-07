exports = async function(argPlanDoc){
  console.log("Function fncPackageUpdate called ... executing..." );
  var shipment = context.services.get("mongodb-atlas").db("ship").collection("shipment");
  var nDate = new Date();
  if (argPlanDoc){
    //update the shipping document with the new plan information
    console.log("Shipment plan updateOne ... executing..." );
    shipment.updateOne(
    	{ shipment_id: parseInt(argPlanDoc.shipment_id) },
    	{ $pull: { "plan": { order: argPlanDoc.order } }	}
    );
    console.log("Shipment plan ... $addToSet..." );
    shipment.updateOne(
    	{ shipment_id: parseInt(argPlanDoc.shipment_id) },
    	{ $addToSet: { "plan": { 
    	  order: argPlanDoc.order, 
    	  flight: argPlanDoc.flight, 
    	  from: argPlanDoc.from, 
    	  to: argPlanDoc.to,
    	  date: argPlanDoc.date,
    	  last_modified: nDate} } }
    );
  } else {
    return {"Status": "Error Plan document is empty"};
  }
    return {"Success": "Updated Plan"};
};