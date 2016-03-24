'use strict';

var _ = require('lodash'),
    fs = require('fs'),
    path = require('path'),
    logger = require('../logger'),
    userConfig = require('../config/user'),
    utils = require('../utils');

module.exports = function(Resource) {
  Resource.prototype.delete = function(id, options) {
    var self = this;

    try {
      options = options || {};
      options = _.defaults(options, {});

      var originalObject = self.get(id),
          fileName = utils.getFileName(id),
          objPath = path.join(self.$resourceDirPath, fileName);

      // physical deletion
      fs.unlinkSync(objPath);
      
      logger.success('Deleted', self.$name, 'with id = ', id);
      return originalObject;
    } catch (e) {
      logger.warn('Failed to delete object with id =', id);
      return null;
    }
  };
};