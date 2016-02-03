'use strict';

var _ = require('lodash'),
    path = require('path'),
    logger = require('../logger'),
    utils = require('../utils'),
    userConfig = require('../config/user'),
    dataTypeValidate = require('../data-type-validate');

module.exports = function(Resource) {
  Resource.prototype.add = function(resource) {
    var that = this;

    try {
      var object = {};

      // assign ID
      object[userConfig.IDProperty] = this.idTick.get();
      this.idTick.increment();

      // note: going through the schema prunes extra data
      _.each(that.$schema.props({withRelations: false}), function(prop) {
        dataTypeValidate(resource, prop, that.$schema[prop].type);
        object[prop] = resource[prop];
      });

      // check $has
      _.each(that.$schema.$has, function(relationResource) {
        var relationResourceProp = relationResource + '_id',
            foreignID = resource[relationResourceProp];

        // if foreign ID is not a number
        if (foreignID && _.isNumber(foreignID) === false) {
          throw new Error('ID reference to ' + relationResource + ' should be of type number');
        }

        // valid foreign ID
        if (_.isNumber(foreignID) === true) {
          var referencedResource = ResourceCollection[relationResource].get(foreignID);

          if (_.isNull(referencedResource) === true) {
            throw new Error(relationResource + ' has no object with ID = ' + foreignID);
          } else {
            object[relationResourceProp] = foreignID;
          }
        }
      });

      // todo: $has_all
      // ...

      // write file
      var objPath = path.join(that.$resourceDirPath, object[userConfig.IDProperty] + '.json');
      utils.writeFile(objPath, object);

      // return the newly created obj
      return object;
    } catch (e) {
      logger.error('Failed to save', '('+this.$name+')' , e.message);
    }
  };
};