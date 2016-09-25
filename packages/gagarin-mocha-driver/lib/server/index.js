import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { Mocha } from 'meteor/gagarin:mocha';
import { createDispatcher } from '../utils/createDispatcher.js';

const mocha = new Mocha({
  ui: 'gagarin:bdd-fibers',
  reporter: createDispatcher(report),
});

const context = {};
let alreadyRun = false;
mocha.suite.emit('pre-require', context, undefined, mocha);

for (const key of Object.keys(context)) {
  global[key] = context[key];
}

Meteor.methods({
  'gagarin.runTests' () {
    if (alreadyRun) return;
    alreadyRun = true;
    mocha.run();
  }
});

const reports = [];
const listeners = [];

function report (name, ...args) {
  const _id = Random.id();
  reports.push({ _id, name, args });
  listeners.forEach(listener => {
    listener(_id, name, args);
  });
}

Meteor.publish('gagarin.reports', function () {

  const onReport = (_id, name, args) => {
    this.added('gagarin.reports', _id, { name, args });
  };

  reports.forEach(({ _id, name, args }) => {
    onReport(_id, name, args);
  });

  listeners.push(onReport);
  this.onStop(() => {
    const index = listeners.findIndex(onReport);
    listeners.splice(index, 1);
  });

  this.ready();
});
