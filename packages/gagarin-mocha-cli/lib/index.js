var childProcess = require('child_process');
var Mocha = require('mocha');
var WebSocket = require('faye-websocket');
var createClass = require('asteroid').createClass;
var Spinner = require('cli-spinner').Spinner;
var minimist = require('minimist');
var Receiver = require('./Receiver.js');
var clear = require('cli-clear');
var assign = require('lodash.assign');

var argv = minimist(process.argv.slice(2), {
  default: {
    port: '3000',
  }
});
if (argv.help) {
  console.log([
'Usage:',
'',
'--port     <number>   specify on which port meteor is running (default: 3000)',
'--settings <path>     specify path to the settings file',
'--full-app            if present tests will be run in "full app" mode',
'--raw-logs            same as Meteor\'s --raw-logs',
'--reporter <reporter> choose a custom mocha reporter (default: spec)',
'--once                only run once',
'--report-only         only show reporter output',
'--remote              don\'t spawn own meteor process, instead connect to this url,',
'                      e.g. ws://localhost:3000/websocket',
''].join('\n'));
  process.exit();
}

var hasError = true;
var reporter = argv.reporter ? Mocha.reporters[argv.reporter] : Mocha.reporters.spec;
if (!reporter) {
  console.error(`Unknown reporter: "${argv.reporter}"\n`);
  process.exit(1);
}

var meteor;
if (!argv.remote) {
  const args = [
    'test',
    '--port',
    argv.port,
    '--driver-package',
    'gagarin:mocha-driver',
  ];
  if (argv.settings) {
    args.push(
      '--settings',
      argv.settings,
    );
  }
  if (argv['full-app']) {
    args.push('--full-app');
  }
  if (argv['raw-logs']) {
    args.push('--raw-logs');
  }  
  meteor = childProcess.spawn('meteor', args, {
    stdio: 'pipe',
    env: assign(
      {},
      process.env,
      {
        GAGARIN_MOCHA_RUN_TESTS_MANUALLY: '1',
      }
    ),
  });

  meteor.stdout.on('data', function (data) {
    // Only try to connect when you see "app running at" message
    if (/App running at:/.test(data)) {
      initialize(null, true);
    }
    if (!argv['report-only']) {
      process.stdout.write(data);
    }
  });

  meteor.stderr.on('data', function (data) {
    if (!argv['report-only']) {
      process.stderr.write(data);
    }
  }); 

  meteor.on('exit', () => {
    process.exit(hasError ? 1 : 0);
  });
} else {
  initialize(argv.remote);
}

var initialized = false;
function initialize(remote, runTestsManually) {
  if (initialized) {
    return;
  }
  initialized = true;

  var endpoint = remote || 'ws://127.0.0.1:' + argv.port + '/websocket';
  var Asteroid = createClass();
  var asteroid = new Asteroid({
    endpoint: endpoint,
    SocketConstructor: WebSocket.Client,
    reconnectInterval: 2000,
  });

  var receiver;
  var spinner = new Spinner('  waiting for server... %s');

  asteroid.subscribe('Gagarin.Reports.all');
  asteroid.on('connected', function () {
    if (!argv.once) {
      spinner.stop();
    }
    if (runTestsManually) {
      asteroid
        .call('Gagarin.runTests')
        .catch(function (err) {
          console.error(err);
        });
    }
  });

  asteroid.on('disconnected', function () {
    if (!argv.once) {
      spinner.start();
    }
  });

  asteroid.ddp.on('ready', function () {
    if (!argv.once) {
      spinner.stop();
    }
  });

  asteroid.ddp.on('added', function (options) {
    var collection = options.collection;
    var fields = options.fields;
    if (collection !== 'Gagarin.Reports') {
      return;
    }
    if (fields.name === 'start') {
      if (!argv.once) {
        spinner.stop();
        clear();
      }
      hasError = false;
      receiver = new Receiver(reporter, {}, function (result) {
        if (argv.once) {
          hasError = result.failures > 0;
          if (meteor) {
            meteor.kill();
          } else {
            process.exit(hasError ? 1 : 0);
          }
        }
      });
    }
    if (fields.name === 'fail' && !hasError) {
      hasError = true;
    }
    if (receiver) {
      receiver.emit.apply(receiver, [fields.name].concat(fields.args));
    }
    if (fields.name === 'end') {
      receiver = null;
    }
  });
}
