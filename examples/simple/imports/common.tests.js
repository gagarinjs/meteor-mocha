/*eslint-env mocha*/
import { Fake } from 'meteor/anti:fake';

describe('Test Anything', function () {
  describe('Given a very long test report', function () {
    for (let i=0; i<50; i+=1) {
      it(`should ${Fake.sentence().toLowerCase()}`, () => {});
    }
  });

  describe('Given some tests fail', function () {
    it('should fail', () => {
      throw new Error(Fake.sentence());
    });
  });
});
