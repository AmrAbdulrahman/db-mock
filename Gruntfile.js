'use strict';

module.exports = function(grunt) {
  var config = grunt.file.readJSON('./grunt/config.json');

  function loadGruntTask(name) {
    return require('./grunt/' + name)(grunt, config);
  }

  // plugins
  require('load-grunt-tasks')(grunt);
  
  // configurations
  grunt.initConfig({
    jshint: loadGruntTask('jshint'),
    jscs: loadGruntTask('jscs')
  });

  grunt.registerTask('default', [
    'jshint:all',
    'jscs:all'
  ]);
};
