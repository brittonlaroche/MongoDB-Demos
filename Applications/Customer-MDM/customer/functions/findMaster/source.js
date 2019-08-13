exports = async function(argSource){
  var masterDoc = {};
  var masterDoc2 = {};
  var lowestDistance = 1;
  var closestMaster = {};
  var searchString = "";
  var vfound = 0;
  var sourceCount = 0;
  var fdist = 1;
  var ldist = 1;
  var cdist = 1;

  var master = context.services.get("mongodb-atlas").db("single").collection("master");
  
  console.log("findMaster 1");
  masterDoc = await master.findOne({"sources._id": argSource._id});
  if (masterDoc){
    if (masterDoc.master){
      return masterDoc;
    } 
  }
  
  console.log("findMaster 2");
  // Try to find an existing master document. 
  // Search by the date of birth and compare first and last names
  var masterDocList = await master.find({"master.dob": argSource.dob}).toArray()
  .then( docs => {
      docs.map(c => {
        if(c.sources){
          c.sources.forEach( function(testSource){
            fdist = context.functions.execute("getNormalizedDistance", argSource.first_name,testSource.first_name);
            ldist = context.functions.execute("getNormalizedDistance", argSource.last_name,testSource.last_name);
            cdist = (0.5 * fdist) + (0.5 * ldist);
            //console.log("testSource._id: " + testSource._id + ", ts first_name: " + testSource.first_name + ", ts last_name: " + testSource.last_name + ", cdist: " + cdist);
            if (cdist < 0.4) {
              console.log("Found Group Matching Names and DOB: " + JSON.stringify(c));
              masterDoc2 = c;
            } 
          });
        }
      });
  });
  
  
  //console.log("Final sourceList: " + JSON.stringify(sourceList));
  return masterDoc2;

};