'use strict';

var engine = require('./engine'),
    resourcesCollection = require('./resource/resources-collection'),
    exports = module.exports; // because we gonna assign 'Resource' at some point of time

exports.load = function () {
    engine.run();

    // this is to allow user to access resources by key
    // without the need of calling .get() first
    // now user can => db.Resource.student.operation()
    exports.Resource = resourcesCollection.get();
};