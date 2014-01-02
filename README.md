# Splunk development command line interface

> Command line interface for Splunk applications development.

Install this globally and you'll have access to the grunt command anywhere on your system.

```
npm install -g splunk-cli
```

## Usage

To get started 

### splunk-cli --help

```

  Usage: splunk-cli [options] [command]

  Commands:

    apps [options] [filter] - show / maintain applications
    create [name]          - create new application
    service [options] <action> - perform action (start|stop|restart) on splunk services
    watch [options]        - watch for changes
    reload                 - reload application configurations
    config [options]       - configure cli for current splunk instance

  Options:

    -h, --help               output usage information
    -V, --version            output the version number
    -H, --splunkHome <path>  specify Splunk home folder
    -v, --verbose            verbose output


```

### splunk-cli apps --help

> show / maintain applications

```

  Usage: apps [options] [filter]

  Options:

    -h, --help           output usage information
    -s, --system         include system applications
    -d, --disabled       include disabled applications
    -s, --state <state>  change application state (enabled|disabled)
    -R, --remove         remove application from splunk instance


```

#### Examples

Show installed applications:

```
splunk-cli apps
```

Show all installed applications (included disabled and system applications):

```
splunk-cli apps --disabled --system
```

Show applications with name which starts with "test"

```
splunk-cli apps "test*"
```

Remove application "my_application"

```
splunk-cli apps my_application --remove
```

Remove applications with name which starts with "test"

```
splunk-cli apps "test*" --remove
```

Change state for application "my_application" to disabled

```
splunk-cli apps my_application --state disabled
```

Change state for application "my_application" to enabled

```
splunk-cli apps my_application --state enabled
```

### splunk-cli create --help

> create new application

```

  Usage: create [options] [name]

  Options:

    -h, --help  output usage information


```

### splunk-cli service --help

> perform action (start|stop|restart) on splunk services

```

  Usage: service [options] <action>

  Options:

    -h, --help            output usage information
    -s, --service <name>  service name (splunkd|splunkweb|*) [*]


```

#### Examples

Start all Splunk services

```
splunk-cli service start
```

Restart all Splunk services

```
splunk-cli service restart
```

Stop all Splunk services

```
splunk-cli service stop
```

Start splunkd service

```
splunk-cli service stop --service splunkd
```

Restart splunkweb service

```
splunk-cli service restart --service splunkweb
```

### splunk-cli watch --help

> watch for changes

```

  Usage: watch [options]

  Options:

    -h, --help        output usage information
    -a, --app [name]  watch for application changes
    -s, --splunk      watch for splunk changes


```

#### Examples

Watch for changes in application "my_application". If something will be changed and this will require to restart/reload any of the services/configurations in Splunk - this will happened automatically.

```
splunk-cli watch --app my_application
```


### splunk-cli reload --help

> reload application configurations

```

  Usage: reload [options]

  Options:

    -h, --help  output usage information


```

### splunk-cli config --help

> configure cli for current splunk instance

```

  Usage: config [options]

  Options:

    -h, --help    output usage information
    -R, --remove  remove configuration for current splunk instance


```