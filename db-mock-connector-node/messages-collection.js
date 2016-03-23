'use strict';

var q = require('q'),
    Message = require('./message');

function MessagesCollection() {
  var self = this;
  self.messages = {};

  self.add = function(data) {
    var id = (new Date()).getTime(),
        defer = q.defer();

    var message = new Message(id, defer, data);
    self.messages[id] = message; // keep it in dict
  
    return message;
  };

  self.get = function(id) {
    return self.messages[id];
  };
}

module.exports = MessagesCollection;