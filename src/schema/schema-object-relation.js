'use strict';

var _ = require('lodash');

// defaults
var schemaObjectRelationDefaults = {
  required: false
};

function SchemaObjectRelation(relationDefinition) {
  var that = this;

  if (_.isString(relationDefinition) === true) {
    relationDefinition = {
      relationWith: relationDefinition
    };

    relationDefinition = _.defaults(relationDefinition, schemaObjectRelationDefaults);
  }

  _.each(relationDefinition, function(value, key) {
    that[key] = value;
  });
}

module.exports = SchemaObjectRelation;