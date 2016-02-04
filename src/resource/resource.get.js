'use strict';

var _ = require('lodash'),
    path = require('path'),
    logger = require('../logger'),
    userConfig = require('../config/user'),
    utils = require('../utils'),
    resourcesCollection = require('./resources-collection');

module.exports = function(Resource) {
  Resource.prototype.get = function(id, plain) {
    var self = this;

    try {
      if (_.isUndefined(plain) === true) {
        plain = false;
      }

      var fileName = utils.getFileName(id),
          objPath = path.join(self.$resourceDirPath, fileName),
          object = utils.readFile(objPath);

      // parse date
      _.each(object, function(value, prop) {
        if (self.$schema[prop] && self.$schema[prop].type === 'date') {
          object[prop] = new Date(value);
        }
      });

      // meta data
      if (userConfig.enableCreatedAtProperty === true) {
        object[userConfig.createdAtProperty] = new Date(object[userConfig.createdAtProperty]);
      }

      if (userConfig.enableUpdatedAtProperty === true) {
        object[userConfig.updatedAtProperty] = new Date(object[userConfig.updatedAtProperty]);
      }

      if (userConfig.injectResourceName === true) {
        object[userConfig.resourceNameProperty] = self.$name;
      }

      // inject relations if any
      var relations = plain === true ? [] : self.$schema.$has.one;
      _.each(relations, function(relation) {
        if (relation.inject === false) {
          return;
        }

        var relationResourceProp = relation.relationWith + userConfig.foreignIDSuffix,
            foreignID = object[relationResourceProp],
            referencedResource = resourcesCollection.of[relation.relationWith].get(foreignID, true);

        // assign even if 'null', it means, the object has been
        // deleted, and user knows.
        object[relation.relationWith] = referencedResource;
      });

      return object;
    } catch (e) {
      logger.warn('Failed to get object with id =', id);
      return null;
    }
  };
};