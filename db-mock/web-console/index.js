'use strict';

var express = require('express'),
    logger = require('../logger'),
    userConfig = require('../config/user');

var WebConsole = {};

WebConsole.run = function() {
  var app = express();

  // index
  app.use(express.static('./web-console'));
  app.get('/', function(req, res) {
    res.sendFile('index.html', {
      root: __dirname
    });
  });

  var server = app.listen(userConfig.webConsolePort, function() {
    var port = server.address().port;

    logger.success('web console is up and running on port', port, '...', {bold: true});
  });
};

module.exports = WebConsole;
// app.get('/resources-collection', function(req, res) {
//   res.send(resourcesCollection);
// });

// app.get('/operation', function(req, res) {
//   console.log(req.body);
//   res.send({resp: 'resp'});
// });

