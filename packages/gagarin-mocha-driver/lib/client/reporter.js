import { Template } from 'meteor/templating';
import { Mocha } from 'meteor/gagarin:mocha';
import { Receiver } from '../utils/Receiver.js';
import { captureAllOutput } from '../utils/captureAllOutput';
import { Reports } from './Reports.js';
import Terminal from 'xterm';
import 'xterm/src/xterm.css';
import './reporter.html';
import './reporter.css';

Template.reporter.onCreated(function () {
  this.subscribe('gagarin.reports');
});

Template.reporter.onRendered(function () {
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

  Mocha.reporters.Base.useColors = true;
  Mocha.reporters.Base.window.width = xterm.cols;

  xterm.open(this.find('.xterm'));

  const receiver = new Receiver(Mocha.reporters.spec);
  let output;
  Reports.find({
    source: 'server'
  }).observe({
    added (doc) {
      if (doc.name === 'start') {
        output = captureAllOutput({
          onOutput: xterm.write.bind(xterm),
          onUpdate: resize,
        });
      }
      receiver.emit(doc.name, ...doc.args);
      if (doc.name === 'end' && output) {
        output.restore();
        output = null;
      }
    }
  });
});
