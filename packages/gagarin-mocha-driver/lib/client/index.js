import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Mocha } from 'meteor/gagarin:mocha';
import { Reports } from './Reports.js';
import { createDispatcher } from '../utils/createDispatcher.js';
import './index.html';
import './reporter.js';

const mocha = new Mocha({
  ui: 'bdd',
  reporter: createDispatcher(dispatch),
});

const context = {};
mocha.suite.emit('pre-require', context, undefined, mocha);

for (const key of Object.keys(context)) {
  global[key] = context[key];
}

export function runTests () {
  mocha.run();
  Meteor.call('gagarin.runTests');
}

function dispatch (name, ...args) {
  Reports.insert({
    name,
    args,
    source: 'client',
  });
}

Template.body.helpers({
  _reporter () {
    return Mocha.reporters.spec;
  }
});
