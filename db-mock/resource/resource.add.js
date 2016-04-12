'use strict';

var _ = require('lodash'),
    path = require('path'),
    logger = require('../logger'),
    utils = require('../utils'),
    userConfig = require('../config/user'),
    dataTypeValidate = require('../data-type-validate'),
    resourcesCollection = require('./resources-collection');

module.exports = function(Resource) {
  Resource.prototype.add = function(resource) {
    var self = this;

    try {
      var object = {};

      // assign ID then tick
      object[userConfig.IDProperty] = self.idTick.get();
      self.idTick.increment();

      // note: going through the schema prunes extra data
      _.each(self.$schema.props({withRelations: false}), function(prop) {
        if (_.isUndefined(resource[prop]) === true) {
          return;
        }

        if (resource[prop] !== null) {
          dataTypeValidate(resource, prop, self.$schema[prop].type);
          object[prop] = resource[prop];
        }
      });

      _.each(['one', 'many'], function(relationType) {
        var isOne = relationType === 'one',
            isMany = relationType === 'many';

        _.each(self.$schema.$has[relationType], function(relation) {
          var relationPropSuffix = isOne === true ? userConfig.foreignIDSuffix : userConfig.foreignIDSuffixMany,
              relationResourceProp = relation.relationWith + relationPropSuffix,
              foreignID = resource[relationResourceProp];

          if (_.isUndefined(foreignID) === true && relation.required === true) {
            throw new Error('object of type (' + self.$name + ') must have a relation with (' + relation.relationWith + ')');
          }

          // if foreign ID is not a number in case of 1-1 relation
          if (isOne === true &&
              _.isUndefined(foreignID) === false &&
              _.isNumber(foreignID) === false) {
            throw new Error('ID reference to (' + relation.relationWith + ') must be of type (number)');
          }

          // if foreign IDs is not an array in case of 1-OO relation
          if (isMany === true &&
              _.isUndefined(foreignID) === false &&
              _.isArray(foreignID) === false) {
            throw new Error('ID references to (' + relation.relationWith + ') must be of type (array)');
          }

          // valid foreign ID
          if (isOne === true && _.isNumber(foreignID) === true) {
            var referencedResource = resourcesCollection.of[relation.relationWith].get(foreignID, {
              plain: true
            });

            if (_.isNull(referencedResource) === true) {
              throw new Error(relation.relationWith + ' has no object with ID = ' + foreignID);
            }

            // all fine!
            object[relationResourceProp] = foreignID;
          }

          if (isMany === true && _.isArray(foreignID) === true) {
            _.each(foreignID, function(id) {
              if (_.isNumber(id) === false) {
                throw new Error('ID reference to (' + relation.relationWith + ') must be of type (number)');
              }

              var referencedResource = resourcesCollection.of[relation.relationWith].get(id, {
                plain: true
              });

              if (_.isNull(referencedResource) === true) {
                throw new Error(relation.relationWith + ' has no object with ID = ' + id);
              }
            });

            object[relationResourceProp] = foreignID;
          }
        });
      });

      // add meta data
      var now = new Date();
      if (userConfig.enableCreatedAtProperty === true) {
        object[userConfig.createdAtProperty] = now;
      }

      if (userConfig.enableUpdatedAtProperty === true) {
        object[userConfig.updatedAtProperty] = now;
      }

      // write file
      var fileName = utils.getFileName(object[userConfig.IDProperty]),
          objPath = path.join(self.$resourceDirPath, fileName);

      utils.writeFile(objPath, object);

      // return the newly created obj
      return self.get(object[userConfig.IDProperty]);
    } catch (e) {
      logger.error('Failed to save', '(' + self.$name + ')' , e.message);
    }
  };
};
