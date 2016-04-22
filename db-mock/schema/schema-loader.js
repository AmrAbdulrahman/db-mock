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
  return _.last(fileName.split('/')).replace('.json', '');
}

function load() {
  logger.info('loading schema from', userConfig.schema, '...', {bold: true});

  var resourcesFiles = [],
      resourcesCount = 0,
      schema = {},
      errors = [];

  try {
    resourcesFiles = utils.readDirSyncRecursive(userConfig.schema);
  } catch (e) {
    logger.error(userConfig.schema, 'not found');
    throw new Error('Can\'t load schema.');
  }

  if (resourcesFiles.length === 0) {
    logger.warn(userConfig.schema, 'is empty');
  }

  _.each(resourcesFiles, function(resourcePath) {
    var resourceSchema = utils.readFile(resourcePath);

    try {
      var resourceName = getResourceName(resourcePath);
      schema[resourceName] = new SchemaObject(resourceName, resourceSchema);
      resourcesCount++;
    } catch (e) {
      errors.push(e.message);
    }
  });

  // validate iff schema loaded successfully
  if (errors.length === 0) {
    logger.success(resourcesCount, 'schema(s) loaded successfully', {bold: true});
    logger.blank();

    errors = validate(schema, resourcesCount);
  }

  // all fine!
  if (errors.length === 0) {
    schemaInstance = schema;
  // display errors and force terminate
  } else {
    _.each(errors, function(error) {
      logger.error(error);
    });

    throw new Error('can\'t load schema');
  }
}

function validate(schema, resourcesCount) {
  logger.info('validating schema...', {bold: true});

  var errors = [];

  _.each(schema, function(resource) {
    errors = _.concat(errors, resource.validate(schema));
  });

  if (errors.length === 0) {
    logger.success(resourcesCount, 'schema(s) validated successfully', {bold: true});
    logger.blank();
  }

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
