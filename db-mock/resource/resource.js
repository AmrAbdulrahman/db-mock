'use strict';

var path = require('path'),
    userConfig = require('../config/user'),
    logger = require('../logger'),
    utils = require('../utils'),
    IDTick = require('./id-tick');

function Resource(schema) {
  var self = this;
  
  self.$schema = schema;
  self.$name = schema.$name;
  self.$resourceDirPath = path.join(userConfig.data, self.$name);

  logger.info('loading', self.$name, '...');

  // mkdir for resource
  utils.mkDir(self.$resourceDirPath);

  // read/create/set id tick
  self.idTick = new IDTick(self.$resourceDirPath);
}

require('./resource.get')(Resource);
require('./resource.add')(Resource);
require('./resource.update')(Resource);
require('./resource.list')(Resource);
require('./resource.delete')(Resource);

module.exports = Resource;