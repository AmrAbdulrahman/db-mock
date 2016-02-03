'use strict';

var _ = require('lodash'),
    schema = require('../schema/schema-loader'),
    userConfig = require('../config/user'),
    logger = require('../logger'),
    utils = require('../utils'),
    Resource = require('./resource'),
    ResourceCollection = {};

function load() {
  logger.info('loading resources...', {bold: true});
  
  // mkdir data
  utils.mkDir(userConfig.data);

  // create resources
  _.each(schema.get(), function(resourceSchema) {
    ResourceCollection[resourceSchema.$name] = new Resource(resourceSchema);
  });

  return ResourceCollection;
}

function get(resourceName) {
  if (_.isEmpty(ResourceCollection)) {
    return logger.error('resources are not loaded yet');
  }

  if (resourceName && _.isUndefined(ResourceCollection[resourceName])) {
    return logger.error('(' + resourceName + ') can\'t be found');
  }

  if (resourceName) {
    return ResourceCollection[resourceName];
  } else {
    return ResourceCollection;
  }
}

module.exports = {
  load: load,
  get: get
};