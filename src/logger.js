'use strict';

var colors = require('colors');

colors.setTheme({
  success: 'green',
  notify: 'cyan',
  warn: 'yellow',
  error: 'red'
});

var logType = {
  NOTIFY:   'INFO   ',
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
    case logType.NOTIFY:
      console.log(msg.notify);
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
}

function notify() {
  log(logType.NOTIFY, arguments);
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
  notify: notify,
  warn: warn,
  error: error,
  success: success
};