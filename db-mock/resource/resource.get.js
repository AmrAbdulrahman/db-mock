'use strict';

var _ = require('lodash'),
    path = require('path'),
    logger = require('../logger'),
    userConfig = require('../config/user'),
    utils = require('../utils'),
    resourcesCollection = require('./resources-collection');

module.exports = function(Resource) {
  Resource.prototype.get = function(id, options) {
    var self = this;

    try {
      options = options || {};
      options = _.defaults(options, {
        plain: false,
        parents: []
      });

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

      if (options.plain === true) {
        return object;
      }

      // inject relations if any
      var relations = _.concat(self.$schema.$has.one, self.$schema.$has.many);
      _.each(relations, function(relation) {
        if (relation.inject === false) {
          return;
        }

        // prevent infinite recursion by watching parents chain
        if (_.indexOf(options.parents, relation.relationWith) !== -1) {
          return;
        }

        if (relation.isOne === true) {
          var relationResourceProp = relation.relationWith + userConfig.foreignIDSuffix,
              foreignID = object[relationResourceProp],
              referencedResource = resourcesCollection.of[relation.relationWith].get(foreignID, {
                parents: _.concat(options.parents, self.$name)
              });

          // assign even if 'null', it means, the object has been
          // deleted, and user knows.
          object[relation.relationWith] = referencedResource;
        } else { // isMany
          var relationResourcePropMany = relation.relationWith + userConfig.foreignIDSuffixMany,
              foreignIDs = object[relationResourcePropMany],
              relationWithProp = relation.relationWith + 's';
              // todo: use pluralize

          // return an empty array anyway
          object[relationWithProp] = [];

          _.each(foreignIDs, function(foreignID) {
            var referencedResource = resourcesCollection.of[relation.relationWith].get(foreignID, {
              parents: _.concat(options.parents, self.$name)
            });

            if (_.isNull(referencedResource) === false) {
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
