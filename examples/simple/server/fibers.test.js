/*eslint-env mocha*/
import { Fake } from 'meteor/anti:fake';
import sleep from './sleep';

describe('Test Fibers', function () {

  beforeEach(function () {
    this.timeout(100);
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
