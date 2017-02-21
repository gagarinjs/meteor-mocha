import { Template } from 'meteor/templating';
import { Mocha } from 'meteor/gagarin:mocha';
import {
  clientSuiteId,
  serverSuiteId,
} from 'meteor/gagarin:mocha-driver';
import './index.css';
import './index.html';
import './reporter.js';

const parseQuery = (query) => {
  const object = {};
  query.split('&').forEach((part) => {
    const keyValue = part.split('=');
    object[decodeURIComponent(keyValue[0])] = decodeURIComponent(keyValue[1]);
  });
  return object;
};

Template.body.helpers({
  mochaReporter () {
    const query = parseQuery(window.location.search.substr(1));
    if (query.reporter) {
      return Mocha.reporters[query.reporter] || Mocha.reporters.spec;
    }
    return Mocha.reporters.spec;
  },
  suites () {
    return [
      { id: clientSuiteId.get(), title: 'client' },
      { id: serverSuiteId.get(), title: 'server' },
    ];
  },
});
