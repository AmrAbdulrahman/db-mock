'use strict';

var engine = require('./engine'),
    Resource = require('./resource');

function load() {
    engine.run();
}

module.exports = {
    load: load,
    Resource: Resource
};