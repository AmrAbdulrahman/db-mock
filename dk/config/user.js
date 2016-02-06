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
    logger.success('config read successfully');
} catch(e) {
    logger.warn('no user config provided.');
}

userConfig = _.defaults(userConfig, configDefaults);
// so, 'ID' becomes 'IDs' and '_ID' becomes '_IDs', and so on
userConfig.foreignIDSuffixMany = userConfig.foreignIDSuffix + 's';
module.exports = userConfig;
