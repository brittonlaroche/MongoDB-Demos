exports = function(source){
  //Master has an array of adresses
  //Source has an adress object
  var copy = {};
  var addressCopy = {};
  copy._id = source._id;
  copy.first_name = source.first_name;
  copy.middle_name = source.middle_name;
  copy.last_name = source.last_name;
  copy.gender = source.gender;
  copy.dob = source.dob;
  copy.phone = source.phone;
  copy.email = source.email;
  

  if (source) {
      if (source.address) {
       source.address.forEach(function(myAddress) {
          addressCopy =  myAddress;
        });
      }
  }
  
  copy.address = addressCopy;
  
  return copy;
};