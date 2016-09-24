import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { Mocha } from 'meteor/gagarin:mocha';
const Base = Mocha.reporters.Base;

const mocha = new Mocha({
  ui: 'gagarin:bdd-fibers',
  reporter: Reporter,
});

const context = {};
mocha.suite.emit('pre-require', context, undefined, mocha);

for (const key of Object.keys(context)) {
  global[key] = context[key];
}

Meteor.methods({
  'gagarin.runTests' () {
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

function Reporter (runner) {
  Base.call(this, runner);

  const total = runner.total;

  runner.on('start', function() {
    report('start', { total: total });
  });

  runner.on('end', () => {
    if (this.stats.failures) {
      // this.stats.message = listAllFailures(this.failures);
    }
    report('end', this.stats);
  });
  
  // TEST

  runner.on('pass', test => {
    report('pass', cleanTest(test));
  });

  runner.on('fail', (test, error) => {
    report('fail', cleanTest(test), cleanError(error));
  });

  runner.on('test end', test => {
    report('test end', cleanTest(test));
  });

  runner.on('pending', test => {
    report('pending', cleanTest(test));
  });

  // SUITE
  
  runner.on('suite', suite => {
    report('suite', cleanSuite(suite));
  });

  runner.on('waiting', suite => {
    report('waiting', cleanSuite(suite));
  });

  runner.on('suite end', suite => {
    report('suite end', cleanSuite(suite));
  });
}

Meteor.publish('gagarin.reports.all', function () {

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
