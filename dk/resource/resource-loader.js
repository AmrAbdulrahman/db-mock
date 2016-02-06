'use strict';

var _ = require('lodash'),
    schema = require('../schema/schema-loader'),
    userConfig = require('../config/user'),
    logger = require('../logger'),
    utils = require('../utils'),
    resourcesCollection = require('./resources-collection'),
    Resource = require('./resource');

function load() {
  logger.info('loading resources...', {bold: true});
  
  // mkdir data
  utils.mkDir(userConfig.data);

  // create resources
  _.each(schema.get(), function(resourceSchema) {
    resourcesCollection.of[resourceSchema.$name] = new Resource(resourceSchema);
  });

  return resourcesCollection.get();
}

module.exports = {
  load: load
};