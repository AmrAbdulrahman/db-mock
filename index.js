'use strict';

var db = require('./src');
db.load();

var profile = db.Resource.profile.add({
  address: 'address1',
  phone: '01212121212'
});

var student = db.Resource.student.add({
  name: 'Amr',
  DOB: new Date(),
  married: false,
  sons: ['koko', 'soso'],
  profile_ID: profile.ID
});

console.log(db.Resource.student.get(student.ID));