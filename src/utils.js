'use strict';

var fs = require('fs'),
    rimraf = require('rimraf'),
    _ = require('lodash'),
    logger = require('./logger');

function mkDir(path, options) {
  options = _.defaults(options, {
    cleanIfExist: false
  });

  try {
    fs.mkdirSync(path);
    logger.notify(path, 'created');
  } catch (e) {
    if (e.code === 'EEXIST') {
      logger.notify(path, 'already exists');

      if (options.cleanIfExist === true) {
        rimraf.sync(path); // remove folder first
        fs.mkdirSync(path);
        logger.notify(path, 'cleaned');        
      }
    } else {
      logger.error('can\'t create dir:', path);
    }
  }
}

function readFile(path, options) {
  options = _.defaults(options, {
    json: true,
    failSoft: false
  });

  try {
    var file = fs.readFileSync(path);

    if (options.json) {
      file = JSON.parse(file);
    }

    logger.notify('read', path);
    return file;
  } catch (e) {
    if (options.failSoft) {
      return false;
    } else {
      throw e;
    }
  }
}

function writeFile(path, data, options) {
  options = _.defaults(options, {
    json: true
  });

  try {
    if (options.json) {
      data = JSON.stringify(data, null, 4);
    }

    fs.writeFileSync(path, data);
    logger.notify('write', path);
  } catch (e) {
    logger.error('can\'t write file', path);
  }
}

module.exports = {
    mkDir: mkDir,
    readFile: readFile,
    writeFile: writeFile
};