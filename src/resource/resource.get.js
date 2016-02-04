'use strict';

var _ = require('lodash'),
    path = require('path'),
    logger = require('../logger'),
    utils = require('../utils');

module.exports = function(Resource) {
  Resource.prototype.get = function(id) {
    var self = this;

    try {
      var fileName = utils.getFileName(id),
          objPath = path.join(self.$resourceDirPath, fileName),
          obj = utils.readFile(objPath);

      // parse date
      _.each(obj, function(value, prop) {
        if (self.$schema[prop] && self.$schema[prop].type === 'date') {
          obj[prop] = new Date(value);
        }
      });

      return obj;
    } catch (e) {
      logger.warn('Failed to get object with id =', id);
      return null;
    }
  };
};