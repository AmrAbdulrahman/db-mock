'use strict';

var _ = require('lodash');

var schemaObjectPropertyDefaults = {
  required: false,
  min: 0,
  max: 10000
};

function SchemaObjectProperty(propertyDefinition) {
  var that = this;

  if (_.isString(propertyDefinition) === true) {
    propertyDefinition = {
      type: propertyDefinition
    };

    propertyDefinition = _.defaults(propertyDefinition, schemaObjectPropertyDefaults);
  }

  _.each(propertyDefinition, function(value, key) {
    that[key] = value;
  });
}

module.exports = SchemaObjectProperty;