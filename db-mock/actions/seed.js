'use strict';

var userConfig = require('../config/user'),
    engine = require('../engine'),
    logger = require('../logger'),
    path = require('path');

function run() {
  var db = engine.run();

  logger.info('running seed script in', userConfig.seed, '...', {bold: true});

  // run script
  var seedPath = path.join(process.env.PWD, userConfig.seed);
  require(seedPath)(db);

  logger.success('seed script ran successfully', {bold: true});
}

module.exports = {
  run: run
};

