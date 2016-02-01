'use strict';

var _ = require('lodash'),
    dataTypes = require('./data-types'),
    logger = require('./logger');

var resourcePropertyDefaults = {
  type: 'string',
  nullable: true
};

var relationsProps = ['$has', '$has_many'];

function ResourceProperty(propertyDefinition) {
  var that = this;

  if (_.isString(propertyDefinition) === true) {
    propertyDefinition = {
      type: propertyDefinition
    };

    propertyDefinition = _.defaults(propertyDefinition, resourcePropertyDefaults);
  }

  _.each(propertyDefinition, function(value, key) {
    that[key] = value;
  });
}

function SchemaObject(name, resourceSchema) {
  var that = this;

  this.$name = name;

  _.each(resourceSchema, function(propertyDefinition, propertyName) {
    if (_.indexOf(relationsProps, propertyName) !== -1) {
      that[propertyName] = propertyDefinition;
    } else {
      that[propertyName] = new ResourceProperty(propertyDefinition);
    }
  });

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
      return _.indexOf(relationsProps, prop) === -1;
    });
  };

  this.validate = function(schema) {
    logger.notify('validating', that.$name ,'...');

    var errors = [];

    // validate that $has and $has_many have valid references
    var relations = _.concat([], that.$has || [], that.$has_many || []);

    _.each(relations, function(relation) {
      if (that.$name === relation) {
        errors.push('resource (' + that.$name + ') references itself');
      }

      if (_.isUndefined(schema[relation]) === true) {
        errors.push('resource (' + that.$name + ') references non-existing resource (' + relation + ')'); 
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