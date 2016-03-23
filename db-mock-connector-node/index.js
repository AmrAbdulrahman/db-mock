'use strict';

var execSync = require('child_process').execSync;

var res = execSync('node ' + __dirname + '/sync-connection') + '';
console.log(res);






// var connector = require('./connector');

// function connect() {
//   return connector.connect(); // returns handshake promise
// }

// module.exports = {
//   connect: connect
// };