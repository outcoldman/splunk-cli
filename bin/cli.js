#!/usr/bin/env node
/*jshint globalstrict: true*/ 'use strict';

var _ = require('underscore'),
    async = require('async'),
    chalk = require('chalk'),
    commander = require('commander'),
    configuration = require('grunt-splunk/lib/configuration'),
    environment = require('grunt-splunk/lib/environment'),
    grunt = require('./../lib/grunt'),
    yo = require('./../lib/yo'),
    splunkApps = require('grunt-splunk/lib/apps'),
    inquirer = require('inquirer');

var checkSplunkHome = function() {
  if (commander.splunkHome) {
    environment.splunkHome(commander.splunkHome);
  }

  var splunkHome = environment.splunkHome();
  if (!splunkHome) {
    console.error(chalk.red('Could not locate Splunk directory.\n' +
      'You can specify it with SPLUNK_HOME shell variable\n' +
      'or specify it with --splunkHome option\n' +
      'or simple launch this tool under Splunk folder.'));
    process.exit(4);
  } else {
    console.log(chalk.green('Splunk: ' + chalk.underline(splunkHome)));
  }
};

// Standard options
commander
  .version(require('./../package.json').version)
  .option('-H, --splunkHome <path>', 'specify Splunk home folder')
  .option('-v, --verbose', 'verbose output');

// Command to work on splunk apps
commander
  .command('apps [filter]')
  .description('- show / maintain applications')
  .option('-s, --system', 'include system applications', false)
  .option('-d, --disabled', 'include disabled applications', false)
  .option('-s, --state <state>', 'change application state (enabled|disabled)')
  .option('-R, --remove', 'remove application from splunk instance')
  .action(function(filter, cmd) {
    checkSplunkHome();

    var actionPerformed = false;
    async.waterfall([
      function(next) {
        var apps;
        if (!filter) {
          var app = splunkApps.getCurrentApp();
          if (app) {
            apps = [app];
          }
        }
        if (!apps) {
          apps = splunkApps.findAll({ 
            filter: filter,
            system: cmd.system,
            // in case if user wants to enable application - he probably
            // wants to do this on disabled applications
            disabled: (cmd.disabled | cmd.state === 'enabled')
          });
        }
        next(null, apps);
      }, 
      function(apps, next) {
        // Disable/enable applications
        if (cmd.state) {
          _(apps).each(function(app) {
            app.disabled(cmd.state === 'disabled');
          });
          actionPerformed = true;
        }
        next(null, apps);
      }, 
      function(apps, next) {
        // Remove applications
        if (cmd.remove) {
          _(apps).each(function(app) {
            app.remove();
          });
          actionPerformed = true;
        }
        next(null, apps);
      }, 
      function(apps, next) {
        // Reload applications
        // TODO: reload only specified applications
        if (cmd.reload) {
          
        } else {
          next(null, apps);
        }
      }
    ], function(err, apps) {
      if (err) {
        console.error(err);
        process.exit(4);
      } else {
        // If we did not perform any actions - let's just list applications
        if (!actionPerformed) {
          _(apps).each(function(app) {
            console.log(app.displayName());
          });
        }
        process.exit(0);
      }
    });
  });

commander
  .command('create [name]')
  .description('- create new application')
  .action(function(appname) {
    checkSplunkHome();
    yo(splunkApps.create(appname), commander.verbose, function() {
      inquirer.prompt({
        type: 'confirm',
        name: 'restart',
        message: 'Do you want to restart Splunk?',
        default: true
      }, function(answers) {
        if (answers.restart) {
          grunt('splunk-services:*:restart', commander.verbose);
        }
      });
    });
  });

commander
  .command('service <action>')
  .description('- perform action (start|stop|restart) on splunk services')
  .option('-n, --name <name>', 'service name (splunkd|splunkweb|*) [*]', '*')
  .action(function(action, cmd) {
    checkSplunkHome();
    // Verify action
    if (['start', 'stop', 'restart'].indexOf(action) < 0) {
      console.error('Unknown action: ' + action);
      process.exit(4);
    }
    // Verify service
    if (['splunkd', 'splunkweb', '*'].indexOf(cmd.name) < 0) {
      console.error('Unknown service: ' + cmd.name);
      process.exit(4);
    }
    grunt('splunk-services:' + cmd.name + ':' + action, commander.verbose);
  });

commander
  .command('watch')
  .description('- watch for changes')
  .option('-a, --app [name]', 'watch for application changes')
  .option('-s, --splunk', 'watch for splunk changes')
  .action(function(cmd) {
    checkSplunkHome();
    var taskArguments;
    if (cmd.splunk) {
      taskArguments = 'splunk';
    } else if (cmd.app) {
      taskArguments = 'apps:' + cmd.app;
    } else {
      var app = splunkApps.getCurrentApp();
      if (app) {
        taskArguments = 'apps:' + app.name();
      } else {
        taskArguments = '*';
      }
    }
    grunt('splunk-watch:' + taskArguments, commander.verbose);
  });

commander
  .command('reload')
  .description('- reload application configurations')
  .action(function() {
    checkSplunkHome();
    configuration.executeUnderConfiguration(
      function(done) {
        grunt('splunk-services:reload-apps', commander.verbose, done);
      });
  });

// Set configuration for current splunk instance
commander
  .command('config')
  .description('- configure cli for current splunk instance')
  .option('-R, --remove', 'remove configuration for current splunk instance')
  .action(function(cmd) {
    checkSplunkHome();
    if (cmd.remove) {
      // Remove configuration
      // splunkdev config -R
      configuration.remove();
    } else {
      // Configure current instance
      // splunkdev config
      configuration.configure();
    }
  });

commander.parse(process.argv);

if (!commander.args.length) {
  commander.outputHelp();
  process.exit(1);
}