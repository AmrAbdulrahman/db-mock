'use strict';

var db = require('./src');
db.load();

// create course
var course = db.Resource.course.add({
  name: 'course-example',
  student_IDs: []
});

// wait for a second, then
setTimeout(function() {
  // create two students with profiles
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

  course.ID = -1;
  course = db.Resource.course.update(course);

  console.log(course);
}, 1000);