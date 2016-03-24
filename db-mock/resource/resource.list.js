'use strict';

var _ = require('lodash'),
    logger = require('../logger'),
    utils = require('../utils'),
    internalConfig = require( '../config/internal'),
    fs = require('fs');

module.exports = function(Resource) {
  Resource.prototype.list = function(options) {
    var self = this;

    try {
      options = options || {};
      options = _.defaults(options, {});

      var resourcesFiles = fs.readdirSync(self.$resourceDirPath);
          
      _.remove(resourcesFiles, function(resourcePath) {
        return resourcePath === internalConfig.IDTickFile;
      });
      
      return _.map(resourcesFiles, function(resourcePath) {
        var fileName = _.last(resourcePath.split('/')),
            resourceID = utils.getID(fileName);
            
        return self.get(resourceID);
      });
    } catch (e) {
      logger.warn('Failed to list ', self.$name);
      return null;
    }
  };
};