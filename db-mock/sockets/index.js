'use strict';

var logger = require('../logger'),
    userConfig = require('../config/user'),
    engine = require('../engine'),
    resourcesCollection = require('../resource/resources-collection'),
    net = require('net'),
    JsonSocket = require('json-socket');

var Sockets = {};

Sockets.run = function() {
  var self = this,
      server = net.createServer();

  engine.run();

  server.listen(userConfig.socketsPort);
  logger.success('sockets is up and running on port', userConfig.socketsPort, '...', {bold: true});

  server.on('connection', function(socket) {
    self.socket = new JsonSocket(socket);
    self.socket.on('message', self.onMessage);
    logger.info('client just connected');
  });
};

Sockets.onMessage = function(message) {
  var self = this,
      data = message.data,
      type = data.type;

  logger.info('new message', message.type);

  if (type === 'handshake') {
    message.response = 'handshake back!';
  } else if (type === 'resources') {
    message.response = resourcesCollection.get();
  } else if (type === 'operation') {
    var resource = data.response;
    var action = data.action;
    var args = data.arguments;
    message.response = resourcesCollection.of[resource][action](args);
  }

  self.socket.sendEndMessage(message);
};

module.exports = Sockets;