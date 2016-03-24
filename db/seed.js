var _ = require('lodash');

module.exports = function(db) {
  _.times(20, function() {
    db.student.add({
      name: 'amr',
      sons: ['muslim']
    })
  });
};