const Mocha = require('mocha');
const WebSocket = require('faye-websocket');
const createClass = require('asteroid').createClass;
const Spinner = require('cli-spinner').Spinner;
const minimist = require('minimist');
const Receiver = require('./Receiver.js');
const clear = require('cli-clear');

const spinner = new Spinner('  waiting for server... %s');
const argv = minimist(process.argv.slice(2));
const Asteroid = createClass();
const asteroid = new Asteroid({
  endpoint: `ws://localhost:${argv.port || 3000}/websocket`,
  SocketConstructor: WebSocket.Client,
  reconnectInterval: 1000,
});
const reporter = argv.reporter ? Mocha.reporters[argv.reporter] : Mocha.reporters.spec;

if (argv.help) {
  console.log(`\
Usage:

--port     <number>   specify on which port meteor is running (default: 3000)
--reporter <reporter> choose a custom mocha reporter (default: spec)
--once                only run once

`);
  process.exit();
}

if (!reporter) {
  console.error(`Unknown reporter: "${argv.reporter}"\n`);
  process.exit(1);
}

let hasError = true;
let receiver;

asteroid.subscribe('Gagarin.Reports.all');
asteroid.on('connected', () => {
  if (!argv.once) {
    spinner.stop();
  }
});

asteroid.on('disconnected', () => {
  if (!argv.once) {
    spinner.start();
  }
});

asteroid.ddp.on('ready', () => {
  if (argv.once) {
    process.exit(hasError ? 1 : 0);
  } else {
    spinner.stop();
  }
});

asteroid.ddp.on('added', ({ collection, fields }) => {
  if (collection !== 'Gagarin.Reports') {
    return;
  }
  if (fields.name === 'start') {
    if (!argv.once) {
      spinner.stop();
      clear();
    }
    hasError = false;
    receiver = new Receiver(reporter);
  }
  if (fields.name === 'fail' && !hasError) {
    hasError = true;
  }
  if (receiver) {
    receiver.emit(fields.name, ...fields.args);
  }
  if (fields.name === 'end') {
    receiver = null;
  }
});
