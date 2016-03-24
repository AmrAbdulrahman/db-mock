'use strict';

var userConfig = require('../config/user'),
    logger = require('../logger'),
    rimraf = require('rimraf'),
    fs = require('fs');

function run() {
  logger.info('cleaning data directory', userConfig.data, '...', {bold: true});

  // run script
  rimraf.sync(userConfig.data); // remove folder first
  fs.mkdirSync(userConfig.data);

  logger.success(userConfig.data, 'cleaned successfully', {bold: true});
}

module.exports = {
  run: run
};