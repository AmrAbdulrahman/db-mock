'use strict';

var db = require('./src');
db.load();

var course = {
  name: 'course-example',
  student_IDs: []
};

for (var i=0; i<2; i++) {
  var profile = db.Resource.profile.add({
    address: 'address of user ' + i
  });

  var student = db.Resource.student.add({
    name: 'student ' + i,
    dateOfBirth: new Date(),
    married: false,
    sons: ['koko', 'soso'],
    profile_ID: profile.ID,
    course_IDs: [0, 1, 2]
  });

  course.student_IDs.push(student.ID);
}

course = db.Resource.course.add(course);
console.log(course);