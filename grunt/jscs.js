module.exports = function(grunt, config) {
  return {
    all: [
      'src/**/*.js',
      './Gruntfile.js'
    ],
    options: {
      config: "./.jscsrc",
      verbose: true,
      //fix: true,
      requireCurlyBraces: [
        'if',
        'for'
      ]
    }
  };
};