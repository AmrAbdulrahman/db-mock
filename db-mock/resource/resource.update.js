'use strict';

var _ = require('lodash'),
    path = require('path'),
    logger = require('../logger'),
    utils = require('../utils'),
    userConfig = require('../config/user'),
    dataTypeValidate = require('../data-type-validate'),
    resourcesCollection = require('./resources-collection');

module.exports = function(Resource) {
  Resource.prototype.update = function(updatedResource) {
    var self = this;

    try {
      // Error: ID not exist
      if (_.isUndefined(updatedResource[userConfig.IDProperty]) === true) {
        throw new Error('object has no ID');
      }

      var resourceID = updatedResource[userConfig.IDProperty],
          currentResource = resourcesCollection.of[self.$name].get(resourceID, {
            plain: true,
          });

      // non-existing object with this ID
      if (_.isNull(currentResource) === true) {
        throw new Error('there\'s no object with ID = ' + resourceID);
      }


      // note: going through the schema prunes extra data
      _.each(self.$schema.props({withRelations: false}), function(prop) {
        if (_.isUndefined(updatedResource[prop]) === true) {
          return;
        }

        dataTypeValidate(updatedResource, prop, self.$schema[prop].type);
        currentResource[prop] = updatedResource[prop];
      });

      _.each(['one', 'many'], function(relationType) {
        var isOne = relationType === 'one',
            isMany = relationType === 'many';

        _.each(self.$schema.$has[relationType], function(relation) {
          var relationPropSuffix = isOne === true ? userConfig.foreignIDSuffix : userConfig.foreignIDSuffixMany,
              relationResourceProp = relation.relationWith + relationPropSuffix,
              foreignID = updatedResource[relationResourceProp];

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
            currentResource[relationResourceProp] = foreignID;
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

            currentResource[relationResourceProp] = foreignID;
          }
        });
      });

      // add meta data
      if (userConfig.enableUpdatedAtProperty === true) {
        currentResource[userConfig.updatedAtProperty] = new Date();
      }

      // write file
      var fileName = utils.getFileName(currentResource[userConfig.IDProperty]),
          objPath = path.join(self.$resourceDirPath, fileName);

      utils.writeFile(objPath, currentResource);

      // return the updated obj
      return self.get(currentResource[userConfig.IDProperty]);
    } catch (e) {
      logger.error('Failed to update', '(' + self.$name + ')' , e.message);
    }
  };
};
