'use strict';

var _ = require('lodash'),
    dataTypes = require('../data-types'),
    logger = require('../logger'),
    internalConfig = require('../config/internal'),
    SchemaObjectRelations = require('./schema-object-relations'),
    SchemaObjectProperty = require('./schema-object-property');

function SchemaObject(name, resourceSchema) {
  var that = this;

  this.$name = name;

  _.each(resourceSchema, function(propertyDefinition, propertyName) {
    if(propertyName === internalConfig.relationsProperty) {
      that[propertyName] = new SchemaObjectRelations(propertyDefinition);
    } else {
      that[propertyName] = new SchemaObjectProperty(propertyDefinition);
    }
  });

  if (_.isUndefined(that[internalConfig.relationsProperty]) === true) {
    that[internalConfig.relationsProperty] = new SchemaObjectRelations({});
  }

  this.props = function(options) {
    options = options || {};
    options = _.defaults(options, {
      withRelations: false
    });

    var res = _.filter(Object.keys(this), function(prop) {
      return typeof(that[prop]) !== 'function' && prop !== '$name';
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
    logger.info('validating', that.$name ,'...');

    var errors = [];

    // validate that relations are valid references
    var relations = [];

    if(_.isUndefined(that.$has) === false) {
      relations = _.concat(that.$has.one, that.$has.many);
    }

    _.each(relations, function(relation) {
      var relationWith = relation.relationWith;

      if (that.$name === relationWith) {
        errors.push('resource (' + that.$name + ') references itself');
      }

      if (_.isUndefined(schema[relationWith]) === true) {
        errors.push('resource (' + that.$name + ') references non-existing resource (' + relationWith + ')'); 
      }
    });

    // validate data types
    _.each(that.props(), function(prop) {
      var type = that[prop].type;

      if (_.indexOf(dataTypes, type) === -1) {
        errors.push('resource (' + that.$name + ') / field (' + prop + ') has invalid type (' + type + ')');
      }
    });

    return errors;
  };
}

module.exports = SchemaObject;