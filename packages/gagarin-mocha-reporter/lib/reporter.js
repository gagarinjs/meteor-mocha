import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { Mocha } from 'meteor/gagarin:mocha';
import { Reports, SUBSCRIPTION_ALL_REPORTS } from 'meteor/gagarin:mocha-driver';
import { ReactiveVar } from 'meteor/reactive-var';
import { $ } from 'meteor/jquery';
import Terminal from 'xterm/dist/xterm.js';
import 'xterm/dist/addons/fit';
import 'xterm/dist/xterm.css';
import { captureAllOutput } from './captureAllOutput';
import { Receiver } from './Receiver.js';
import './reporter.html';
import './reporter.css';

Template.reporter.onCreated(function () {
  this.subscribe(SUBSCRIPTION_ALL_REPORTS);
  this.currentSuiteId = new ReactiveVar(this.data.suites[0].id);
  this.nColumns = new ReactiveVar(140);
  this.needsRedraw = new Tracker.Dependency();
});

Template.reporter.helpers({
  currentSuiteId() {
    return Template.instance().currentSuiteId.get();
  },
  activeIf(suiteId) {
    return Template.instance().currentSuiteId.get() === suiteId ? 'active' : '';
  },
  status(suiteId) {
    if (Reports.find({ suiteId, name: 'fail' }).count() > 0) {
      return 'error';
    }
    return 'success';
  },
  icon(suiteId) {
    if (Reports.find({ suiteId, name: 'fail' }).count() > 0) {
      return Mocha.reporters.Base.symbols.err;
    }
    return Mocha.reporters.Base.symbols.ok;
  },
});

Template.reporter.events({
  'click .js-suite': function (e, t) {
    t.currentSuiteId.set(this.id);
  },
});

Template.reporter.onRendered(function () {
  const xterm = new Terminal({
    cols: this.nColumns.get(),
    rows: 40,
    convertEol: true,
    cursorBlink: true,
    scrollback: 2048,
  });

  let processing = false;
  this.resize = () => {
    if (!processing) {
      setTimeout(() => {
        xterm.fit();
        xterm.showCursor();
        this.needsRedraw.changed();
        processing = false;
      }, 50);
      processing = true;
    }
  };

  $(window).on('resize', this.resize);

  Mocha.reporters.Base.useColors = true;
  Mocha.reporters.Base.window.width = xterm.cols;

  xterm.open(this.find('.xterm'));
  xterm.fit();

  this.autorun(() => {
    this.needsRedraw.depend();
    const { mochaReporter } = Template.currentData();
    const currentSuiteId = this.currentSuiteId.get();
    const receiver = new Receiver(mochaReporter);
    let output;
    xterm.reset();
    xterm.showCursor();

    Reports.find({
      suiteId: currentSuiteId,
    }, {
      sort: { index: 1 },
    }).observe({
      added(event) {
        if (event.name === 'start') {
          output = captureAllOutput({
            onOutput: xterm.write.bind(xterm),
          });
        }
        receiver.emit(event.name, ...event.args);
        if (event.name === 'end' && output) {
          output.restore();
          output = null;
        }
      },
    });
  });
});

Template.reporter.onDestroyed(function () {
  $(window).off('resize', this.resize);
});
