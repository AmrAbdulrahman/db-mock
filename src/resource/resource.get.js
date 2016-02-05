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

      if (plain === true) {
        return object;
      }

      // inject relations if any
      var relations = _.concat(self.$schema.$has.one, self.$schema.$has.many);
      _.each(relations, function(relation) {
        if (relation.inject === false) {
          return;
        }

        if (relation.isOne === true) {
          var relationResourceProp = relation.relationWith + userConfig.foreignIDSuffix,
              foreignID = object[relationResourceProp],
              referencedResource = resourcesCollection.of[relation.relationWith].get(foreignID, true);

          // assign even if 'null', it means, the object has been
          // deleted, and user knows.
          object[relation.relationWith] = referencedResource;
        } else {
          var relationResourcePropMany = relation.relationWith + userConfig.foreignIDSuffixMany,
              foreignIDs = object[relationResourcePropMany],
              relationWithProp = relation.relationWith + 's';
              // todo: use pluralize

          _.each(foreignIDs, function(foreignID) {
            var referencedResource = resourcesCollection.of[relation.relationWith].get(foreignID, true);

            if (_.isNull(referencedResource) === false) {
              object[relationWithProp] = object[relationWithProp] || [];
              object[relationWithProp].push(referencedResource);
            }
          });
        }
      });

      return object;
    } catch (e) {
      logger.warn('Failed to get object with id =', id);
      return null;
    }
  };
};