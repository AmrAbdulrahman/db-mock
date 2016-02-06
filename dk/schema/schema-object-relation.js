'use strict';

var _ = require('lodash');

// defaults
var schemaObjectRelationDefaults = {
  required: false
};

function SchemaObjectRelation(relationDefinition, isOne) {
  var self = this;

  if (_.isString(relationDefinition) === true) {
    relationDefinition = {
      relationWith: relationDefinition
    };

    relationDefinition = _.defaults(relationDefinition, schemaObjectRelationDefaults);
  }

  self.isOne = isOne;
  
  _.each(relationDefinition, function(value, key) {
    self[key] = value;
  });
}

module.exports = SchemaObjectRelation;