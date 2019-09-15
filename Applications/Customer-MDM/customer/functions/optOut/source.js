exports = async function(argSource){
  var result = {};
  var masterDoc = {};
  var newMasterDoc = {};
  var sourceAdressObject = context.functions.execute("addressObject", argSource);
  var master = context.services.get("mongodb-atlas").db("single").collection("master");
  var copyMaster = {"optout": "true"};
  var copySource = {};
  var nDate = new Date();
  console.log("optOut source doc: " + JSON.stringify(argSource));

  masterDoc = await context.functions.execute("findMaster", argSource);
  console.log("optOut find master doc: " + JSON.stringify(masterDoc))
  if(masterDoc.master){
    /*
    * we update the existing master doc with the source information
    * the most recent information is considered to be correct
    * this keeps data from getting stale
    */
    console.log("updating master document");
    await master.updateOne(
        { _id: masterDoc._id},
        { $set: {
          owner_id: argSource.owner_id,
          master: copyMaster,
          last_modified: nDate
          }
        }
    );
    //Loop through all additional sources
    if (masterDoc.sources && Array.isArray(masterDoc.sources) ){
      masterDoc.sources.forEach( function(mySource) {
        context.functions.execute("pullSource", masterDoc, mySource._id);
      });
    }
  } 
  result = await context.functions.execute("findMaster", argSource);
  return result;
};