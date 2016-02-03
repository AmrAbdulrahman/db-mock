'use strict';

var path = require('path'),
    userConfig = require('../config/user'),
    logger = require('../logger'),
    utils = require('../utils'),
    IDTick = require('./id-tick');

function Resource(schema) {
  this.$schema = schema;
  this.$name = schema.$name;
  this.$resourceDirPath = path.join(userConfig.data, this.$name);

  logger.info('loading', this.$name, '...');

  // mkdir for resource
  utils.mkDir(this.$resourceDirPath);

  // read/create/set id tick
  this.idTick = new IDTick(this.$resourceDirPath);
}

require('./resource.get')(Resource);
require('./resource.add')(Resource);

module.exports = Resource;