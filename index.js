var db = require('./src');

db.load();

// add profile
var profile = db.Resource.get().profile.add({
  address: 'address1',
  phone: '01212121212'
});

console.log(profile);

var student = db.Resource.get().student.add({
  name: 'Amr',
  profile_id: profile.ID
});

console.log(student);