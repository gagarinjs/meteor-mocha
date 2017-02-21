import { Meteor } from 'meteor/meteor';
import { Mocha } from 'meteor/gagarin:mocha';

export function createDispatcher (dispatch) {
  return function Dispatcher (runner) {
    const total = runner.total;

    Mocha.reporters.Base.call(this, runner);

    runner.on('start', function() {
      dispatch('start', { total: total });
    });

    runner.on('end', () => {
      dispatch('end', this.stats);
    });

    runner.on('pass', test => {
      dispatch('pass', cleanTest(test));
    });

    runner.on('fail', (test, error) => {
      if (Meteor.isClient) {
        console.error(error);
      }
      dispatch('fail', cleanTest(test), cleanError(error));
    });

    runner.on('test end', test => {
      dispatch('test end', cleanTest(test));
    });

    runner.on('pending', test => {
      dispatch('pending', cleanTest(test));
    });

    runner.on('suite', suite => {
      dispatch('suite', cleanSuite(suite));
    });

    runner.on('waiting', suite => {
      dispatch('waiting', cleanSuite(suite));
    });

    runner.on('suite end', suite => {
      dispatch('suite end', cleanSuite(suite));
    });
  };
}

function cleanError(error) {
  return {
    message: error.message,
    stack: error.stack,
    showDiff: error.showDiff,
    actual: error.actual,
    expected: error.expected,
  };
}

function cleanSuite(suite) {
  return {
    title: suite.title,
    pending: suite.pending,
  };
}

function cleanTest(test) {
  return {
    speed: test.speed,
    title: test.title,
    duration: test.duration,
  };
}
