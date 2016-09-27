import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { Mocha } from 'meteor/gagarin:mocha';
import { ReactiveVar } from 'meteor/reactive-var';
import { createDispatcher } from '../utils/createDispatcher.js';
import './index.html';
import './reporter.js';

const clientSuiteId = new ReactiveVar(Random.id());
const serverSuiteId = new ReactiveVar('');
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
  Meteor.call('Gagarin.runTests', (err, suiteId) => {
    if (!err && suiteId) {
      serverSuiteId.set(suiteId);
    }
  });
}

function dispatch (name, ...args) {
  Meteor.call('Gagarin.Reports.insert', clientSuiteId.get(), {
    name, args,
  });
}

Template.body.helpers({
  _reporter () {
    return Mocha.reporters.spec;
  },
  suites () {
    return [
      { id: clientSuiteId.get(), title: 'client' },
      { id: serverSuiteId.get(), title: 'server' },
    ];
  },
});
