exports = function(source){
  //Master has an array of adresses
  //Source has an adress object
  var copy = {};
  var addressCopy = {};
  if (source) {
      copy._id = source._id;
      copy.first_name = source.first_name;
      copy.middle_name = source.middle_name;
      copy.last_name = source.last_name;
      copy.gender = source.gender;
      copy.dob = source.dob;
      copy.phone = source.phone;
      copy.email = source.email;
      if (source.address) {
        if (Array.isArray(source.address)) {
          source.address.forEach(function(myAddress) {
            //copy the address for each element
            //overwrite with the value from the last element
            addressCopy =  myAddress;
          });
        } else {
            //We have an object just copy it
            addressCopy = source.address;
        }
      }
      copy.address = addressCopy;
  }
  return copy;
};