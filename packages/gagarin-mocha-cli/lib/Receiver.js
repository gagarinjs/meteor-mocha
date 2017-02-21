const Mocha = require('mocha');

class Receiver {
  constructor(reporter, reporterOptions = {}) {
    this.reporter = reporter;
    this.reporterOptions = reporterOptions;
    this.rootSuite = this.suite = new Mocha.Suite('');
  }

  emit(name, ...args) {
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
        break;
      default:
        this.runner.emit(name, ...args);
    }
  }

  createRunner(total) {
    const runner = new Mocha.Runner(this.suite);
    runner.total = total;
    new this.reporter(runner, this.reporterOptions);
    return runner;
  }

  createSuite(rawSuite) {
    const suite = new Mocha.Suite(rawSuite.title);
    suite.parent = this.suite;
    return suite;
  }

  createTest(rawTest) {
    const test = new Mocha.Test(rawTest.title);
    test.parent = this.suite;
    test.speed = rawTest.speed;
    test.duration = rawTest.duration;
    return test;
  }

  createError(rawError) {
    return rawError;
  }

}

module.exports = Receiver;
