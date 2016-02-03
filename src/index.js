'use strict';

var engine = require('./engine'),
    Resource = require('./resource/resource-loader');

function load() {
    engine.run();
}

module.exports = {
    load: load,
    Resource: Resource
};