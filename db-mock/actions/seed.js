'use strict';

var userConfig = require('../config/user'),
    engine = require('../engine'),
    logger = require('../logger');

function run() {
  var db = engine.run();

  logger.info('running seed script in', userConfig.seed, '...', {bold: true});

  // run script
  require('../../' + userConfig.seed)(db);

  logger.success('seed script ran successfully', {bold: true});
}

module.exports = {
  run: run
};