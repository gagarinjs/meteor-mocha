var Mocha = require('mocha');

function Receiver (reporter, reporterOptions, onEnd) {
  this.reporter = reporter;
  this.onEnd = onEnd;
  this.reporterOptions = reporterOptions || {};
  this.rootSuite = this.suite = new Mocha.Suite('');
}

Receiver.prototype.emit = function emit(name /* , ...args */) {
  var args = Array.prototype.slice.call(arguments, 1);
  switch (name) {
    case 'waiting':
      this.runner.emit(name, this.rootSuite);
      break;
    case 'suite':
      this.suite = this.createSuite(args[0]);
      this.runner.emit(name, this.suite);
      break;
    case 'suite end':
      this.runner.emit(name, this.suite);
      this.suite = this.suite.parent;
      break;
    case 'test end':
    case 'pending':
    case 'pass':
      this.runner.emit(name, this.createTest(args[0]));
      break;
    case 'fail':
      this.runner.emit(name, this.createTest(args[0]), this.createError(args[1]));
      break;
    case 'start':
      this.runner = this.createRunner(args[0].total);
      this.runner.emit(name, args[0]);
      break;
    case 'end':
      this.runner.emit(name, args[0]);
      if (this.onEnd) {
        this.onEnd(args[0]);
      }
      break;
    default:
      this.runner.emit.apply(this.runner, [name].concat(args));
  }
};

Receiver.prototype.createRunner = function createRunner(total) {
  var runner = new Mocha.Runner(this.suite);
  runner.total = total;
  new this.reporter(runner, this.reporterOptions);
  return runner;
};

Receiver.prototype.createSuite = function createSuite(rawSuite) {
  var suite = new Mocha.Suite(rawSuite.title);
  suite.parent = this.suite;
  return suite;
};

Receiver.prototype.createTest = function createTest(rawTest) {
  var test = new Mocha.Test(rawTest.title);
  test.parent = this.suite;
  test.speed = rawTest.speed;
  test.duration = rawTest.duration;
  return test;
};

Receiver.prototype.createError = function createError(rawError) {
  return rawError;
};

module.exports = Receiver;
