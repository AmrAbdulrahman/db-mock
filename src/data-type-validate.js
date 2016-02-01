'use strict';

var _ = require('lodash'),
    dataTypes = require('./data-types');

function validate(resource, prop, type) {
  var value = resource[prop];

  if (_.isUndefined(value) === true) {
    return true;
  }

  if ((type === 'string' && _.isString(value) === false) || 
      (type === 'date' && _.isDate(value) === false) || 
      (type === 'number' && _.isNumber(value) === false)) {
    throw new Error('invalid value (' + value + ') assigned to (' + prop + '), should be of type (' + type + ')');
  } else if (dataTypes.indexOf(type) === -1) {
    throw new Error('(' + type + ') unknown');
  }
}

module.exports = validate;