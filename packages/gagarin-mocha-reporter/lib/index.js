import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { Mocha } from 'meteor/gagarin:mocha';
import { ReactiveVar } from 'meteor/reactive-var';
import {
  clientSuiteId,
  serverSuiteId,
} from 'meteor/gagarin:mocha-driver';
import './index.css';
import './index.html';
import './reporter.js';

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
