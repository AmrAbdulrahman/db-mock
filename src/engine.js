'use strict';

var logger = require('./logger'),
    schema = require('./schema/schema-loader'),
    resource = require('./resource/resource-loader');

function run() {
  schema.load();
  resource.load();
}

module.exports = {
  run: run
};