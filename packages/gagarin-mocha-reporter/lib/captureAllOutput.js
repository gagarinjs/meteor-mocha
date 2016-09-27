import { Mocha } from 'meteor/gagarin:mocha';

const noop = function () {};
export function captureAllOutput ({ onOutput=noop, onUpdate=noop }={}) {
  const originalConsoleLog = console.log;
  const originalMochaWrite = Mocha.process.stdout.write;
  Mocha.process.stdout.write = function write (data) {
    onOutput(data);
    onUpdate();
  };
  global.console.log = function log (fmt, ...args) {
    if (typeof fmt === 'string') {
      fmt = fmt
        .replace(/%[sd]/g, function () {
          const value = args[0];
          args = args.slice(1);
          return value;
        });
    }
    onOutput(stringify(fmt));
    for (const arg of args) {
      onOutput(stringify(arg));
    }
    onOutput('\n');
    onUpdate();
  };
  return {
    original (...args) {
      return originalConsoleLog(...args);
    },
    restore () {
      Mocha.process.stdout.write = originalMochaWrite;
      global.console.log = originalConsoleLog;
    }
  };
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

