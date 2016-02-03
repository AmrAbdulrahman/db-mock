'use strict';

var _ = require('lodash'),
    logger = require('../logger'),
    utils = require('../utils'),
    internalConfig = require('./internal'),
    userConfig = {};

var configDefaults = {
  data: 'db/data/',
  schema: 'db/schema/',
  seed: 'db/seed/',
  IDProperty: 'ID'
};

try {
    logger.notify('reading user config...', {bold: true});
    userConfig = utils.readFile(internalConfig.userConfigFilePath);
    logger.success('config read successfully');
} catch(e) {
    logger.warn('no user config provided.');
}

module.exports = _.defaults(userConfig, configDefaults);