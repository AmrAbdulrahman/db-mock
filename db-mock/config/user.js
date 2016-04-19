'use strict';

var _ = require('lodash'),
    logger = require('../logger'),
    utils = require('../utils'),
    internalConfig = require('./internal'),
    userConfig = {};

var configDefaults = {
  socketsPort: 6789,
  webConsolePort: 6790,
  data: 'db-mock/data/',
  schema: 'db-mock/schema/',
  seed: 'db-mock/seed.js',
  IDProperty: 'ID',
  foreignIDSuffix: '_ID',
  enableCreatedAtProperty: true,
  createdAtProperty: '_createdAt',
  enableUpdatedAtProperty: true,
  updatedAtProperty: '_updatedAt',
  injectResourceName: true,
  resourceNameProperty: '_name'
};

try {
    logger.info('reading user config...', {bold: true});
    userConfig = utils.readFile(internalConfig.userConfigFilePath);
    logger.success('config read successfully', {bold: true});
    logger.blank();
} catch(e) {
    logger.warn('no user config provided.');
}

userConfig = _.defaults(userConfig, configDefaults);
// so, 'ID' becomes 'IDs' and '_ID' becomes '_IDs', and so on
userConfig.foreignIDSuffixMany = userConfig.foreignIDSuffix + 's';
module.exports = userConfig;
