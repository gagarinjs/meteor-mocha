import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { Mocha } from 'meteor/gagarin:mocha';
import { ReactiveVar } from 'meteor/reactive-var';
import { createDispatcher } from '../createDispatcher.js';
import { Reports } from './Reports.js';
import { SUBSCRIPTION_ALL_REPORTS } from '../constants.js';

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

function runTests () {
  mocha.run();
  Meteor.call('Gagarin.getSuiteId', (err, suiteId) => {
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

export {
  runTests,
  Reports,
  clientSuiteId,
  serverSuiteId,
  SUBSCRIPTION_ALL_REPORTS,
};
