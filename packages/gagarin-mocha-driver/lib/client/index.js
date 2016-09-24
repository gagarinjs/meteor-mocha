import { Mocha } from 'meteor/gagarin:mocha';
import Terminal from 'xterm';
import 'xterm/src/xterm.css';

const mocha = new Mocha({
  ui: 'bdd',
  reporter: 'spec',
});

const context = {};
mocha.suite.emit('pre-require', context, undefined, mocha);

for (const key of Object.keys(context)) {
  global[key] = context[key];
}

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
  mocha.run(function () {
    global.console.log = originalConsoleLog;
  });
  global.xterm = xterm;
  global.Mocha = Mocha;
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


