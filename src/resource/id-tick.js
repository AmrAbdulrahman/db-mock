'use strict';

var path = require('path'),
    internalConfig = require( '../config/internal'),
    utils = require('../utils');

function IDTick(resourceDirPath) {
    var resourceIDPath = path.join(resourceDirPath, internalConfig.IDTickFile);
    var tick = utils.readFile(resourceIDPath, {
        failSoft: true
    });

    if (tick === false) {
        this.tick = internalConfig.IDStartValue;
        utils.writeFile(resourceIDPath, this.tick);
    } else {
        this.tick = tick;
    }

    this.get = function() {
        return this.tick;
    };

    this.increment = function() {
        this.tick++;
        utils.writeFile(resourceIDPath, this.tick);
    };
}

module.exports = IDTick;