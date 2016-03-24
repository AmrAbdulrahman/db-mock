'use strict';

var sockets = require('./sockets'),
    webConsole = require('./web-console'),
    seed = require('./actions/seed'),
    clean = require('./actions/clean'),
    logger = require('./logger'),
    mode = process.argv[2];

logger.info('running db-mock in mode:', mode);

// just run seed
if (mode === 'seed') {
  return seed.run();
}

if (mode === 'clean') {
  return clean.run();
}

// run in sockets mode or web-console
if (mode === 'sockets') {
  sockets.run();
} else if (mode === 'web-console') {
  webConsole.run();
}

// as a node module, export db
module.exports = require('./sub-module');