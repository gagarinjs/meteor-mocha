import { Meteor } from 'meteor/meteor';
import { Mocha } from 'meteor/gagarin:mocha';
import Terminal from 'xterm';
import 'xterm/src/xterm.css';
import { Mongo } from 'meteor/mongo';

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

  const xterm = new Terminal({
    cols: 140,
    rows: 40,
    convertEol: true,
    cursorBlink: true,
    scrollback: 0, // should result in infinite buffer?
  });

  let waitingForResize = false;
  const resize = function () {
    if (!waitingForResize) {
      setTimeout(function () {
        xterm.resize(140, xterm.lines.length);
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
  global.console.log = function (fmt, ...args) {
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
  const runner = mocha.createRunner();
  // mocha.run(function () {
  //   global.console.log = originalConsoleLog;
  // });
  Reports.find({}).observe({
    added (doc) {
      switch (doc.name) {
        case 'suite':
        case 'suite end':
        case 'waiting':
          runner.emit(doc.name, createSuite(doc.data));
          break;
        case 'test end':
        case 'pending':
        case 'pass':
        case 'fail':
          runner.emit(doc.name, createTest(doc.data));
          break;
        case 'end':
          runner.emit(doc.name, doc.data);
          global.console.log = originalConsoleLog;
          break;
        default:
          runner.emit(doc.name, doc.data);
      }
    }
  });
}

function createSuite (data) {
  const suite = new Mocha.Suite(data.title);
  Object.assign(suite, data);
  return suite;
}

function createTest (data) {
  const test = new Mocha.Test(data.title);
  Object.assign(test, data);
  return test;
}

// FlowRouter.route('/', { action: function () {} });

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

Mocha.prototype.createRunner = function() {
  if (this.files.length) {
    this.loadFiles();
  }
  const suite = this.suite;
  const options = this.options;
  options.files = this.files;
  const runner = new Mocha.Runner(suite, options.delay);
  const reporter = new this._reporter(runner, options);
  runner.ignoreLeaks = options.ignoreLeaks !== false;
  runner.fullStackTrace = options.fullStackTrace;
  runner.hasOnly = options.hasOnly;
  runner.asyncOnly = options.asyncOnly;
  runner.allowUncaught = options.allowUncaught;
  if (options.grep) {
    runner.grep(options.grep, options.invert);
  }
  if (options.globals) {
    runner.globals(options.globals);
  }
  return runner;
};

