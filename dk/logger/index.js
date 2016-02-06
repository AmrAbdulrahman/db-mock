'use strict';

var colors = require('colors');

colors.setTheme({
  success: 'green',
  info: 'cyan',
  warn: 'yellow',
  error: 'red'
});

var logType = {
  INFO:     'INFO   ',
  WARN:     'WARN   ',
  ERROR:    'ERROR  ',
  SUCCESS:  'SUCCESS'
};

function readMsg(args) {
  var msg = '',
      options = {},
      hasOptions = false;

  if (typeof args[args.length-1] === 'object') {
    options = args[args.length-1];
    hasOptions = true;
  }

  var argsLastIndex = hasOptions ? args.length - 1 : args.length;

  for (var i=0; i<argsLastIndex; i++) {
    if (i) {
      msg += ' ';
    }

    msg += args[i];
  }

  return {
    msg: msg,
    options: options
  };
}

function log(type, msgParts) {
  var msgComponents = readMsg(msgParts),
      msg = msgComponents.msg,
      options = msgComponents.options;

  msg = '[DB-MOCK:' + type + ']: ' + msg;

  if (options.bold) {
    msg = msg.bold;
  }

  switch(type) {
    case logType.INFO:
      console.log(msg.info);
      break;
    case logType.WARN:
      console.log(msg.warn);
      break;
    case logType.ERROR:
      console.log(msg.red.bgWhite);
      break;
    case logType.SUCCESS:
      console.log(msg.success);
      break;
  }

  if (type === logType.ERROR) {
    throw new Error(msg);
  }
}

function info() {
  log(logType.INFO, arguments);
}

function warn() {
  log(logType.WARN, arguments);
}

function error() {
  log(logType.ERROR, arguments);
}

function success() {
  log(logType.SUCCESS, arguments);
}

module.exports = {
  info: info,
  warn: warn,
  error: error,
  success: success
};