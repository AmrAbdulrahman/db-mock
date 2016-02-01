'use strict';

var fs = require('fs'),
    _ = require('lodash'),
    logger = require('./logger'),
    configDefaults = require('./config-defaults'),
    userConfig = {};

var userConfigFilePath = './db-mock-config.json';

try {
    logger.notify('reading user config...', {bold: true});
    userConfig = fs.readFileSync(userConfigFilePath);
    userConfig = JSON.parse(userConfig);
    logger.success('config read successfully');
} catch(e) {
    logger.warn('no user config provided.');
}

module.exports = _.defaults(userConfig, configDefaults);