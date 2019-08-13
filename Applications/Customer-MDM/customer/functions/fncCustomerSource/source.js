exports = async function(changeEvent) {
  //We have a new source document
  console.log("fncCustomerSource");
  const fullDocument = changeEvent.fullDocument;
  await context.functions.execute("updateMaster", fullDocument);
};
