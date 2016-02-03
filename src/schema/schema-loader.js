'use strict';

var fs = require('fs'),
    _ = require('lodash'),
    path = require('path'),
    userConfig = require('../config/user'),
    logger = require('../logger'),
    utils = require('../utils'),
    SchemaObject = require('./schema-object'),
    schemaInstance = null;

function getResourceName(fileName) {
  return fileName.replace('.json', '');
}

function load() {
  logger.info('loading schema from', userConfig.schema, '...', {bold: true});

  var resourcesFiles = [],
      resourcesCount = 0,
      schema = {},
      errors = [];

  try {
    resourcesFiles = fs.readdirSync(userConfig.schema);
  } catch (e) {
    logger.error(userConfig.schema, 'not found');
    throw new Error('Can\'t load schema.');
  }

  if (resourcesFiles.length === 0) {
    logger.warn(userConfig.schema, 'is empty');
  }

  _.each(resourcesFiles, function(file) {
    var resourcePath = path.join(userConfig.schema, file),
        resourceSchema = utils.readFile(resourcePath);

    try {
      var resourceName = getResourceName(file);
      schema[resourceName] = new SchemaObject(resourceName, resourceSchema);
      resourcesCount++;
    } catch (e) {
      errors.push(e.message);
    }
  });

  // validate iff schema loaded successfully
  if (errors.length === 0) {
    logger.success(resourcesCount, 'resource(s) loaded successfully');
    errors = validate(schema);
  }

  // all fine!
  if (errors.length === 0) {
    logger.success(resourcesCount, 'resource(s) validated successfully');
    schemaInstance = schema;
  
  // display errors and force terminate
  } else {
    _.each(errors, function(error) {
      logger.error(error);
    });

    throw new Error('can\'t load schema');
  }
}

function validate(schema) {
  logger.info('validating schema...', {bold: true});

  var errors = [];

  _.each(schema, function(resource) {
    errors = _.concat(errors, resource.validate(schema));
  });

  return errors;
}

function get(resource) {
  if (_.isNull(schemaInstance)) {
    return logger.error('schema is not loaded yet');
  }

  if (resource && _.isUndefined(schemaInstance[resource])) {
    return logger.error('(' + resource + ') can\'t be found');
  }  

  if (resource) {
    return schemaInstance[resource];
  } else {
    return schemaInstance;
  }
}

module.exports = {
  load: load,
  get: get
};