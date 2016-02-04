'use strict';

var _ = require('lodash'),
    path = require('path'),
    logger = require('../logger'),
    userConfig = require('../config/user'),
    utils = require('../utils');

module.exports = function(Resource) {
  Resource.prototype.get = function(id) {
    var self = this;

    try {
      var fileName = utils.getFileName(id),
          objPath = path.join(self.$resourceDirPath, fileName),
          object = utils.readFile(objPath);

      // parse date
      _.each(object, function(value, prop) {
        if (self.$schema[prop] && self.$schema[prop].type === 'date') {
          object[prop] = new Date(value);
        }
      });

      if (userConfig.enableCreatedAtProperty === true) {
        object[userConfig.createdAtProperty] = new Date(object[userConfig.createdAtProperty]);
      }

      if (userConfig.enableUpdatedAtProperty === true) {
        object[userConfig.updatedAtProperty] = new Date(object[userConfig.updatedAtProperty]);
      }

      if (userConfig.injectResourceName === true) {
        object[userConfig.resourceNameProperty] = self.$name;
      }

      return object;
    } catch (e) {
      logger.warn('Failed to get object with id =', id);
      return null;
    }
  };
};