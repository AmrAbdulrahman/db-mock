var db = require('./src');

db.load();

// add profile
// var profile = db.Resource.get().profile.add({
//   address: 'address1',
//   phone: '01212121212'
// });

// var student = db.Resource.get().student.add({
//   name: 'Amr',
//   DOB: new Date(),
//   married: false,
//   sons: ['koko', 'soso']
// });

console.log(db.Resource.get().student.get(9));