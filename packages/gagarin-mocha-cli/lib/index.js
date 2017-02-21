const Mocha = require('mocha');
const WebSocket = require('faye-websocket');
const createClass = require('asteroid').createClass;
const Receiver = require('./Receiver.js');
const Spinner = require('cli-spinner').Spinner;
const spinner = new Spinner('  -%s- waiting for server...');

const Asteroid = createClass();
const asteroid = new Asteroid({
  endpoint: 'ws://localhost:3000/websocket',
  SocketConstructor: WebSocket.Client,
});

let receiver;
asteroid.subscribe('Gagarin.Reports.all');
asteroid.on('connected', () => {
  spinner.stop();
});
asteroid.on('disconnected', () => {
  spinner.start();
});
asteroid.ddp.on('added', ({ fields }) => {
  if (fields.name === 'start') {
    receiver = new Receiver(Mocha.reporters.spec);
  }
  if (receiver) {
    receiver.emit(fields.name, ...fields.args);
  }
  if (fields.name === 'end') {
    receiver = null;
  }
});
