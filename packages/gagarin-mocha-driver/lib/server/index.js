import { Meteor } from 'meteor/meteor';
import { Mocha } from 'meteor/gagarin:mocha';

const mocha = new Mocha({
  ui: 'gagarin:bdd-fibers',
});

const context = {};
mocha.suite.emit('pre-require', context, undefined, mocha);

for (const key of Object.keys(context)) {
  global[key] = context[key];
}

Meteor.startup(function () {
  mocha.run();
});
