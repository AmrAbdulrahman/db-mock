'use strict';

var _ = require('lodash'),
    dataTypes = require('../data-types'),
    logger = require('../logger'),
    internalConfig = require('../config/internal'),
    SchemaObjectRelations = require('./schema-object-relations'),
    SchemaObjectProperty = require('./schema-object-property');

function SchemaObject(name, resourceSchema) {
  var self = this;

  self.$name = name;

  _.each(resourceSchema, function(propertyDefinition, propertyName) {
    if(propertyName === internalConfig.relationsProperty) {
      self[propertyName] = new SchemaObjectRelations(propertyDefinition);
    } else {
      self[propertyName] = new SchemaObjectProperty(propertyDefinition);
    }
  });

  if (_.isUndefined(self[internalConfig.relationsProperty]) === true) {
    self[internalConfig.relationsProperty] = new SchemaObjectRelations({});
  }

  self.props = function(options) {
    options = options || {};
    options = _.defaults(options, {
      withRelations: false
    });

    var res = _.filter(Object.keys(self), function(prop) {
      return typeof(self[prop]) !== 'function' && prop !== '$name';
    });

    if (options.withRelations === true) {
      return res;
    }

    // remove relations
    return _.filter(res, function(prop) {
      return prop !== internalConfig.relationsProperty;
    });
  };

  this.validate = function(schema) {
    logger.info('validating', self.$name ,'...');

    var errors = [];

    // validate that relations are valid references
    var relations = [];

    if(_.isUndefined(self.$has) === false) {
      relations = _.concat(self.$has.one, self.$has.many);
    }

    _.each(relations, function(relation) {
      var relationWith = relation.relationWith;

      if (self.$name === relationWith) {
        errors.push('resource (' + self.$name + ') references itself');
      }

      if (_.isUndefined(schema[relationWith]) === true) {
        errors.push('resource (' + self.$name + ') references non-existing resource (' + relationWith + ')'); 
      }
    });

    // validate data types
    _.each(self.props(), function(prop) {
      var type = self[prop].type;

      if (_.indexOf(dataTypes, type) === -1) {
        errors.push('resource (' + self.$name + ') / field (' + prop + ') has invalid type (' + type + ')');
      }
    });

    return errors;
  };
}

module.exports = SchemaObject;