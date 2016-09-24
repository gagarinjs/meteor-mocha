import { Meteor } from 'meteor/meteor';
import { Mocha } from 'meteor/gagarin:mocha';
import Terminal from 'xterm';
import 'xterm/src/xterm.css';
import { Mongo } from 'meteor/mongo';

class Report {
  constructor (doc) {
    Object.assign(this, doc);
  }
}

const Reports = new Mongo.Collection('gagarin.reports', {
  transform: doc => new Report(doc),
});

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
  
  const nCols = 300;
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
  let runner = null;
  let suite = new Mocha.Suite('');
  // mocha.run(function () {
  //   global.console.log = originalConsoleLog;
  // });
  // global.xterm = xterm;
  // global.Mocha = Mocha;
  Meteor.call('gagarin.runTests');
  Reports.find({}).observe({
    added (doc) {
      switch (doc.name) {
        case 'suite':
          suite = createSuite(doc.args[0], suite);
          runner.emit(doc.name, suite);
          break;
        case 'suite end':
          suite = suite.parent;
          runner.emit(doc.name, createSuite(doc.args[0]));
          break;
        case 'waiting':
          runner.emit(doc.name, createSuite(doc.args[0]));
          break;
        case 'test end':
        case 'pending':
        case 'pass':
          runner.emit(doc.name, createTest(doc.args[0]));
          break;
        case 'fail':
          runner.emit(doc.name, createTest(doc.args[0], suite), createError(doc.args[1]));
          break;
        case 'end':
          runner.emit(doc.name, doc.args[0]);
          global.console.log = originalConsoleLog;
          break;
        case 'start':
          runner = createRunner(suite, mocha._reporter, mocha.options);
          runner.emit(doc.name, doc.args[0]);
          xterm.reset();
          global.console.log = consoleLog;
          break;
        default:
          runner.emit(doc.name, doc.args[0]);
      }
    }
  });
}

function createSuite (rawSuite, parent) {
  const suite = new Mocha.Suite(rawSuite.title);
  suite.parent = parent;
  return suite;
}

function createTest (rawTest, parent) {
  const test = new Mocha.Test(rawTest.title);
  // Object.assign(test, rawTest);
  test.parent = parent;
  return test;
}

function createError (rawError) {
  return rawError;
}

function createRunner (suite, reporter, options) {
  const runner = new Mocha.Runner(suite, options.delay);
  new reporter(runner, mocha.options);
  return runner;
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

