'use strict';

var _ = require('lodash'),
    path = require('path'),
    logger = require('../logger'),
    utils = require('../utils');

module.exports = function(Resource) {
  Resource.prototype.get = function(id) {
    var that = this;

    try {
      var objPath = path.join(that.$resourceDirPath, id + '.json'),
          obj = utils.readFile(objPath);

      // parse date
      _.each(obj, function(value, prop) {
        if (that.$schema[prop] && that.$schema[prop].type === 'date') {
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