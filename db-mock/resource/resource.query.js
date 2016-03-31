'use strict';

var _ = require('lodash'),
    logger = require('../logger'),
    utils = require('../utils'),
    internalConfig = require( '../config/internal'),
    fs = require('fs');

module.exports = function(Resource) {
  Resource.prototype.query = function(comparer, options) {
    var self = this;

    try {
      options = options || {};
      options = _.defaults(options, {});

      return _.filter(self.list(), comparer);
    } catch (e) {
      logger.warn('Failed to query', self.$name);
      return null;
    }
  };
};