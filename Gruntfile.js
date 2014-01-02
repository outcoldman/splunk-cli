/*jshint globalstrict: true*/ 'use strict';

module.exports = function(grunt) {
  // Initialize Splunk config
  grunt.config.init({
    jshint: {
      // define the files to lint
      files: ['Gruntfile.js', 'Gruntfile.splunk.js', 'lib/**/*.js', 'bin/**/*.js'],
      // configure JSHint (documented at http://www.jshint.com/docs/)
      options: {
          // more options here if you want to override JSHint defaults
        globals: {
          console: true,
          module: true,
          require: true,
          process: true,
          Buffer: true,
          __dirname: true
        }
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
    }
  });

  // Load grunt-splunk
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['watch']);
};
