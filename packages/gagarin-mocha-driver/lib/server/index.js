import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { Mocha } from 'meteor/gagarin:mocha';
import { createDispatcher } from '../createDispatcher.js';
import { SUBSCRIPTION_ALL_REPORTS } from '../constants.js';

const reports = [];
const listeners = [];

function addReport (suiteId, name, ...args) {
  const _id = Random.id();
  const rawReport = {
    _id,
    name,
    suiteId,
    args,
    index: reports.length,
  };
  reports.push(rawReport);
  listeners.forEach(listener => {
    listener(rawReport);
  });
}

const suiteId = Random.id();
const dispatch = addReport.bind(null, suiteId);
const mocha = new Mocha({
  ui: 'gagarin:bdd-fibers',
  reporter: createDispatcher(dispatch),
});

const context = {};
let alreadyRun = false;
mocha.suite.emit('pre-require', context, undefined, mocha);

for (const key of Object.keys(context)) {
  global[key] = context[key];
}

Meteor.methods({
  'Gagarin.runTests' () {
    if (!alreadyRun) {
      alreadyRun = true;
      mocha.run();
    }
    return suiteId;
  },
  'Gagarin.Reports.insert': function (suiteId, rawReport) {
    addReport(suiteId, rawReport.name, ...rawReport.args);
  },
});

Meteor.publish(SUBSCRIPTION_ALL_REPORTS, function () {

  const onReport = rawReport => {
    const fields = { ...rawReport };
    delete fields._id;
    this.added('Gagarin.Reports', rawReport._id, fields);
  };

  reports.forEach(rawReport => {
    onReport(rawReport);
  });

  listeners.push(onReport);
  this.onStop(() => {
    const index = listeners.findIndex(onReport);
    listeners.splice(index, 1);
  });

  this.ready();
});
