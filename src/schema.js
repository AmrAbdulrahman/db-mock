'use strict';

var fs = require('fs'),
    _ = require('lodash'),
    path = require('path'),
    config = require('./config'),
    logger = require('./logger'),
    dataTypes = require('./data-types'),
    SchemaObject = require('./schema-object'),
    utils = require('./utils'),
    schemaInstance = null;

function getResourceName(fileName) {
  return fileName.replace('.json', '');
}

function load() {
  logger.notify('loading schema from', config.schema, '...', {bold: true});

  var resourcesFiles = [],
      resourcesCount = 0,
      schema = {},
      errors = [];

  try {
    resourcesFiles = fs.readdirSync(config.schema);
  } catch (e) {
    logger.error(config.schema, 'not found');
    throw new Error('Can\'t load schema.');
  }

  if (resourcesFiles.length === 0) {
    logger.warn(config.schema, 'is empty');
  }

  _.each(resourcesFiles, function(file) {
    var resourcePath = path.join(config.schema, file),
        resourceSchema = utils.readFile(resourcePath);

    try {
      var resourceName = getResourceName(file);
      schema[resourceName] = new SchemaObject(resourceName, resourceSchema);
      resourcesCount++;
    } catch (e) {
      errors.push('(' + file + ') is not a valid json');
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
  logger.notify('validating schema...', {bold: true});

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