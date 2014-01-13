/*jshint globalstrict: true*/ 'use strict';

// This is grunt file which is used to launch grunt tasks from splunkdev

var configuration = require('grunt-splunk/lib/configuration');

module.exports = function(grunt) {
  // Initialize Splunk config
  grunt.config.init({
    splunk: configuration.get()
  });

  // Load grunt-splunk
  grunt.loadNpmTasks('grunt-splunk');
};
