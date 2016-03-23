'use strict';

var net = require('net'),
    JsonSocket = require('json-socket'),
    port = 6789,
    host = 'localhost';

// create sockets connection
var socket = new JsonSocket(new net.Socket());
socket.connect(port, host);

// connect and attach on-message handler
socket.on('connect', function() {
  socket.on('message', onMessage);

  // construct message object, and send it to server
  socket.sendMessage({
    type: 'handshake'
  });
});

// on-message handler
function onMessage(message) {
  process.stdout.write(message.response);
  process.exit();
}

//onMessage({response: 'shit'});