'use strict';

var _ = require('lodash');

var schemaObjectPropertyDefaults = {
  required: false,
  min: 0,
  max: 10000
};

function SchemaObjectProperty(propertyDefinition) {
  var self = this;

  if (_.isString(propertyDefinition) === true) {
    propertyDefinition = {
      type: propertyDefinition
    };

    propertyDefinition = _.defaults(propertyDefinition, schemaObjectPropertyDefaults);
  }

  _.each(propertyDefinition, function(value, key) {
    self[key] = value;
  });
}

module.exports = SchemaObjectProperty;