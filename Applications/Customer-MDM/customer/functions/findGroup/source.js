exports = async function(argDocument){
  var groupDoc = {};
  var groupDoc2 = {};
  var fdist = 0;
  var ldist = 0;
  var cdist = 0;
  var vfound = 0
  var group = context.services.get("mongodb-atlas").db("single").collection("group");
  console.log("find group Argument: " + JSON.stringify(argDocument));

  // Try to find an existing group document
  // search by _id
  groupDoc = await group.findOne({"sources._id": argDocument._id});
  if (groupDoc) {
    console.log("Find Group Matching Source._id: " + JSON.stringify(groupDoc));
    vfound = 1;
    return groupDoc;
  } else {
    // did not find a matching _id, search by date of birth
    console.log("did not find doc for source._id, searching by dob");
    groupDoc2 = await group.findOne({"discriminator": argDocument.dob});
    if (groupDoc2) {
      if(groupDoc2.sources){
        groupDoc2.sources.forEach( function(myDoc) {
          fdist = context.functions.execute("getNormalizedDistance", argDocument.first_name,myDoc.first_name);
          ldist = context.functions.execute("getNormalizedDistance", argDocument.last_name,myDoc.last_name);
          cdist = (0.5 * fdist) + (0.5 * ldist);
          if (cdist < 0.4) {
            console.log("Found Group Matching Names and DOB: " + JSON.stringify(groupDoc2));
            vfound = 2;
            return groupDoc2;
          } 
        });
      }
    }
  }
  if (vfound == 0) {
    return {};
  } 
  if (vfound == 1) {
    return groupDoc;
  } 
  if (vfound == 2) {
    return groupDoc2;
  } 
};