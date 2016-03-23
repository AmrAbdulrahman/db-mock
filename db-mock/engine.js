'use strict';

var schema = require('./schema/schema-loader'),
    resource = require('./resource/resource-loader'),
    resourcesCollection = require('./resource/resources-collection');

function run() {
  schema.load();
  resource.load();
  // seed
  // generate

  return resourcesCollection.get();
}

module.exports = {
  run: run
};