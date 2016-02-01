module.exports = function(grunt, config) {
  return {
    all: [
      'src/**/*.js',
      './Gruntfile.js'
    ],
    options: grunt.file.readJSON('.jshintrc')
  };
};