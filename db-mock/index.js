'use strict';

var sockets = require('./sockets'),
    webConsole = require('./web-console'),
    mode = process.argv[2];

// if (_.isUndefined(mode) === true) {
//   logger.warn('use mode (sockets) by default');
//   mode = 'sockets';
// }

if (mode === 'sockets') {
  sockets.run();
} else if (mode === 'web-console') {
  webConsole.run();
}

module.exports = require('./sub-module');