/*jshint globalstrict: true*/ 'use strict';

var child_process = require('child_process');

module.exports = function(app, verbose, done) {
  var args = [
    'splunkapp',
    app.path()
  ];
  var proc = child_process.spawn('yo', args, { stdio: 'inherit' });
  console.dir(args);
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