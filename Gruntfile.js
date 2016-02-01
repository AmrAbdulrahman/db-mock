'use strict';

module.exports = function(grunt) {
  var config = grunt.file.readJSON('./grunt/config.json');

  function loadGruntTask(name) {
    return require('./grunt/' + name)(grunt, config);
  }

  // Plugins
  require('load-grunt-tasks')(grunt);
  
  // Configurations
  grunt.initConfig({
    jshint: loadGruntTask('jshint')
  });

  grunt.registerTask('default', [
    'jshint:all'
  ]);
};
