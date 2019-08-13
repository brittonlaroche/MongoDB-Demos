exports = async function(argDocument){

  var groupDoc = {};
  var groupDocFinal = {};
  var group = context.services.get("mongodb-atlas").db("single").collection("group");
  var nDate = new Date();
  console.log("Group Sources Argument: " + JSON.stringify(argDocument));

  groupDoc = await context.functions.execute("findGroup", argDocument);
  if (groupDoc) {
   groupDoc.sources.forEach(function(myDoc) {
      console.log("find master argGroup sources id: " + JSON.stringify(myDoc._id));
    });
  }
  return {groupDoc};
};