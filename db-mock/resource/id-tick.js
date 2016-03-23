'use strict';

var path = require('path'),
    internalConfig = require( '../config/internal'),
    utils = require('../utils');

function IDTick(resourceDirPath) {
    var self = this,
        resourceIDPath = path.join(resourceDirPath, internalConfig.IDTickFile),
        tick = utils.readFile(resourceIDPath, {
            failSoft: true
        });

    if (tick === false) {
        self.tick = internalConfig.IDStartValue;
        utils.writeFile(resourceIDPath, self.tick);
    } else {
        self.tick = tick;
    }

    self.get = function() {
        return self.tick;
    };

    self.increment = function() {
        self.tick++;
        utils.writeFile(resourceIDPath, self.tick);
    };
}

module.exports = IDTick;