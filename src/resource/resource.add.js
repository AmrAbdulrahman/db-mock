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

        dataTypeValidate(resource, prop, self.$schema[prop].type);
        object[prop] = resource[prop];
      });

      // check 1-1 relations
      _.each(self.$schema.$has.one, function(relation) {
        var relationResourceProp = relation.relationWith + userConfig.foreignIDSuffix,
            foreignID = resource[relationResourceProp];

        if (_.isUndefined(foreignID) === true && relation.required === true) {
          throw new Error('object of type (' + self.$name + ') must have a relation with (' + relation.relationWith + ')');
        }

        // if foreign ID is not a number
        if (_.isUndefined(foreignID) === false && _.isNumber(foreignID) === false) {
          throw new Error('ID reference to (' + relation.relationWith + ') must be of type (number)');
        }

        // valid foreign ID
        if (_.isNumber(foreignID) === true) {
          var referencedResource = resourcesCollection.of[relation.relationWith].get(foreignID);

          if (_.isNull(referencedResource) === true) {
            throw new Error(relation.relationWith + ' has no object with ID = ' + foreignID);
          } else { // all fine!
            object[relationResourceProp] = foreignID;
          }
        }
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
      return object;
    } catch (e) {
      logger.error('Failed to save', '(' + self.$name + ')' , e.message);
    }
  };
};