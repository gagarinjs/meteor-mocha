/*eslint-env mocha*/
import { Fake } from 'meteor/anti:fake';
import { Meteor } from 'meteor/meteor';
import sleep from './sleep';

console.error('Error');

describe('Test Settings (full app)', function () {

  beforeEach(function () {
    this.timeout(100);
    sleep(50);
  });

  afterEach(() => {
    sleep(50);
  });

  it('should receive the right settings object', function () {
    Meteor.settings.should.deep.equal({
      public: {},
      private: {
        test: true,
      },
    });
  });
});
