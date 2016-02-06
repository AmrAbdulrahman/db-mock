'use strict';

var _ = require('lodash'),
    SchemaObjectRelation = require('./schema-object-relation');

var schemaObjectRelationsDefaults = {
  one: [],
  many: []
};

function SchemaObjectRelations(relationsDefinition) {
  var self = this;

  self.one = [];
  self.many = [];

  if (_.isPlainObject(relationsDefinition) === false) {
    throw new Error('($has) should be an object of (one) and (many) properties');
  }

  _.each(Object.keys(relationsDefinition), function(key) {
    if (key !== 'one' && key !== 'many') {
      throw new Error('($has) should only contain (one) and (many) properties');
    }
  });

  relationsDefinition = _.defaults(relationsDefinition, schemaObjectRelationsDefaults);

  if (_.isArray(relationsDefinition.one) === false || _.isArray(relationsDefinition.many) === false) {
    throw new Error('($has.one) and ($has.many) must be of type (array)');
  }

  _.each(['one', 'many'], function(relationType) {
    _.each(relationsDefinition[relationType], function(relation) {
      var isOne = relationType === 'one',
          schemaObjectRelation = new SchemaObjectRelation(relation, isOne);
      self[relationType].push(schemaObjectRelation);
    });
  });
}

module.exports = SchemaObjectRelations;