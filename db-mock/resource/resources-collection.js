'use strict';

var _ = require('lodash'),
    logger = require('../logger'),
    resourcesCollection = {};

function get(resourceName) {
  if (_.isEmpty(resourcesCollection)) {
    return logger.error('resources are not loaded yet');
  }

  if (resourceName && _.isUndefined(resourcesCollection[resourceName])) {
    return logger.error('(' + resourceName + ') can\'t be found');
  }

  if (resourceName) {
    return resourcesCollection[resourceName];
  } else {
    return resourcesCollection;
  }
}

module.exports = {
  of: resourcesCollection,
  get: get
};