/*eslint-env mocha*/
import { Fake } from 'meteor/anti:fake';
import Future from 'fibers/future';

const sleep = (ms, err) => {
  const future = new Future();
  setTimeout(() => {
    if (err) {
      future.throw(err);
    } else {
      future.return();
    }
  }, ms);
  return future.wait();
};

describe('Test Anything', function () {
  beforeEach(() => {
    sleep(50);
  });

  afterEach(() => {
    sleep(50);
  });

  describe('Given a couple of tests', function () {
    for (let i=0; i<10; i+=1) {
      it(`should ${Fake.sentence().toLowerCase()}`, () => {});
    }
  });
});
