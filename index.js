'use strict';

var db = require('./src');
db.load();

var course = {
  name: 'course-example',
  student_IDs: []
};

for (var i=0; i<5; i++) {
  var profile = db.Resource.profile.add({
    address: 'address'
  });

  var student = db.Resource.student.add({
    name: 'Amr',
    DOB: new Date(),
    married: false,
    sons: ['koko', 'soso'],
    profile_ID: profile.ID
  });

  course.student_IDs.push(student.ID);
}

course = db.Resource.course.add(course);
console.log(course);