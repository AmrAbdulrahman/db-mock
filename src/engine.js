'use strict';

var schema = require('./schema/schema-loader'),
    resource = require('./resource/resource-loader');

function run() {
  schema.load();
  resource.load();
  // seed
  // generate
}

module.exports = {
  run: run
};