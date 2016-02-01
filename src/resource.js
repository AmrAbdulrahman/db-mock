'use strict';

var fs = require('fs'),
    _ = require('lodash'),
    path = require('path'),
    schema_ = require('./schema'),
    config = require('./config'),
    logger = require('./logger'),
    utils = require('./utils'),
    IDTick = require('./id-tick'),
    dataTypeValidate = require('./data-type-validate'),
    ResourceCollection = {};

function Resource(schema) {
  this.$name = schema.$name;
  logger.notify('loading', this.$name, '...');

  // mkdir for resource
  var resourceDirPath = path.join(config.data, this.$name);
  utils.mkDir(resourceDirPath);

  // read/create/set id tick
  this.idTick = new IDTick(resourceDirPath);

  this.get = function(id) {
    try {
      var objPath = path.join(resourceDirPath, id + '.json');
      var obj = utils.readFile(objPath);
      return obj;
    } catch (e) {
      logger.warn('Failed to get object with id =', id);
      return null;
    }
  };

  this.add = function(resource) {
    try {
      var object = {};

      // assign ID
      object[config.IDProperty] = this.idTick.get();
      this.idTick.increment();

      // note: going through the schema prunes extra data
      _.each(schema.props({withRelations: false}), function(prop) {
        dataTypeValidate(resource, prop, schema[prop].type);
        object[prop] = resource[prop];
      });

      // check $has
      _.each(schema.$has, function(relationResource) {
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

      // TODO: $has_all
      // ...

      // write file
      var objPath = path.join(resourceDirPath, object[config.IDProperty] + '.json');
      utils.writeFile(objPath, object);

      // return the newly created obj
      return object;
    } catch (e) {
      logger.error('Failed to save', '('+this.$name+')' , e.message);
    }
  };
}

function load() {
  logger.notify('loading resources...', {bold: true});
  
  // mkdir data
  utils.mkDir(config.data);

  // create resources
  var schema = schema_.get();
  _.each(schema, function(resourceSchema) {
    ResourceCollection[resourceSchema.$name] = new Resource(resourceSchema);
  });

  return ResourceCollection;
}

function get(resourceName) {
  if (_.isEmpty(ResourceCollection)) {
    return logger.error('resources are not loaded yet');
  }

  if (resourceName && _.isUndefined(ResourceCollection[resourceName])) {
    return logger.error('(' + resourceName + ') can\'t be found');
  }

  if (resourceName) {
    return ResourceCollection[resourceName];
  } else {
    return ResourceCollection;
  }
}

module.exports = {
  load: load,
  get: get
};