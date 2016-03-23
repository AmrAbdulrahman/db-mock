'use strict';

var engine = require('../engine'),
    resourcesCollection = require('../resource/resources-collection');

engine.run();
module.exports = resourcesCollection.get();