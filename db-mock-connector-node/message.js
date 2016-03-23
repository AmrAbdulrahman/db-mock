'use strict';

function Message(id, defer, data) {
  this.id = id;
  this.defer = defer;
  this.data = data;
  this.resolved = false;

  this.resolve = function() {
    this.resolved = true;
  };
}

module.exports = Message;