exports = async function(argMaster, argSourceId){
  var master = context.services.get("mongodb-atlas").db("single").collection("master");
  var source = context.services.get("mongodb-atlas").db("single").collection("source");
  var copySource = {"optout":"true"};
  var nDate = new Date();
  console.log("pullSource source id: " + JSON.stringify(argSourceId));
  console.log("pullSource master doc: " + JSON.stringify(argMaster));
  
  if(argMaster.master){
    /*
    * Remove all customer master data from the source array
    */
    if (argMaster.sources){
      console.log("master ... $pull..." );
      await master.updateOne(
        	{ _id: argMaster._id },
        	{ $pull: { "sources": { _id: argSourceId } }	}
        );
    }
    console.log("master ... $addToSet..." );
    copySource._id = argSourceId;
    await master.updateOne(
    	{ _id: argMaster._id },
    	{ $addToSet: { "sources": copySource  } } 
    );
    /*
    * Remove all customer source data as well
    */
    console.log("source ... delete..." );
    await source.deleteOne(
    	{ _id: argSourceId }
    );
  } 
  
  return "complete";
};