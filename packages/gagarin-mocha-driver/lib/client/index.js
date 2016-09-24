import { Meteor } from 'meteor/meteor';
import { Mocha } from 'meteor/gagarin:mocha';
import Terminal from 'xterm';
import 'xterm/src/xterm.css';
import { Mongo } from 'meteor/mongo';
import { Receiver } from '../utils/Receiver.js';
import './index.html';

const Reports = new Mongo.Collection('gagarin.reports');
const mocha = new Mocha({
  ui: 'bdd',
  reporter: 'spec',
});

const context = {};
mocha.suite.emit('pre-require', context, undefined, mocha);

for (const key of Object.keys(context)) {
  global[key] = context[key];
}

Meteor.startup(function () {
  Meteor.subscribe('gagarin.reports.all');
});

export function runTests () {
  
  const nCols = 140;
  const xterm = new Terminal({
    cols: nCols,
    rows: 40,
    convertEol: true,
    cursorBlink: true,
    scrollback: 0, // should result in infinite buffer?
  });

  let waitingForResize = false;
  const resize = function () {
    if (!waitingForResize) {
      setTimeout(function () {
        xterm.resize(nCols, xterm.lines.length);
        waitingForResize = false;
      }, 50);
      waitingForResize = true;
    }
  };

  const originalConsoleLog = console.log;
  Mocha.process.stdout.write = function (data) {
    xterm.write(data);
    resize();
  };
  Mocha.reporters.Base.useColors = true;
  Mocha.reporters.Base.window.width = xterm.cols;
  // global.console.log =
  
  function consoleLog (fmt, ...args) {
    if (typeof fmt === 'string') {
      fmt = fmt
        .replace(/%[sd]/g, function () {
          const value = args[0];
          args = args.slice(1);
          return value;
        });
    }
    xterm.write(stringify(fmt));
    for (const arg of args) {
      xterm.write(stringify(arg));
    }
    xterm.write('\n');
    resize();
  };
  xterm.open();
  // mocha.run(function () {
  //   global.console.log = originalConsoleLog;
  // });
  // global.xterm = xterm;
  // global.Mocha = Mocha;
  const receiver = new Receiver(mocha._reporter, mocha.options);
  Meteor.call('gagarin.runTests');
  Reports.find({}).observe({
    added (doc) {
      if (doc.name === 'start') {
        xterm.reset();
        global.console.log = consoleLog;
      }
      
      receiver.emit(doc.name, ...doc.args);
      
      if (doc.name === 'end') {
        global.console.log = originalConsoleLog;
      }
    }
  });
}

function stringify (data) {
  if (typeof data === 'string') {
    // return data.replace(/\n/g, '\n\r');
    return data;
  } else if (typeof data === 'object') {
    return JSON.stringify(data);
  } else if (data || data === 0) {
    return data.toString();
  }
  return '';
}
