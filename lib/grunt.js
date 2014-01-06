/*jshint globalstrict: true*/ 'use strict';

var path = require('path'),
    child_process = require('child_process'),
    environment = require('grunt-splunk/lib/environment');

module.exports = function(task, verbose, done) {
   var args = [
    task,
    '--gruntfile',
    path.join(__dirname, './../Gruntfile.splunk.js')
  ];
  if (verbose) {
    args.push('--verbose');
    args.push('--debug');
    console.log('Executing grunt task: ' + task + 'with arguments: ' + args.join(' ')); 
  }
  var command = 'grunt' + (environment.isWindows() ? '.cmd' : '');
  var proc = child_process.spawn(command, args, { stdio: 'inherit' });
  proc.on('error', function(err) {
    console.error(err);
    process.exit(4);
  });
  proc.on('exit', function(code) { 
    if (code !== 0) {
      console.error('ERRCODE: ' + code);
      process.exit(4);
    } else {
      if (done) {
        done();
      }
    }
  });
};