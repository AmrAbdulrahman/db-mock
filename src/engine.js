'use strict';

var logger = require('./logger'),
    schema = require('./schema'),
    resource = require('./resource');

function run() {
  try {
    schema.load();
    resource.load();
  } catch (e) {
    logger.error(e.message);
  }
}

module.exports = {
  run: run
};