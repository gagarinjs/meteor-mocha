/*eslint-env mocha*/
import { Fake } from 'meteor/anti:fake';
import { Sandbox } from 'meteor/gagarin:unit';
import { Posts } from './Posts';

describe('Test Posts', function () {
  beforeEach(function () {
    this.sandbox = new Sandbox();
    this.sandbox.collection(Posts, [
      {
        title: 'Title',
        content: 'Content',
      },
    ]);
  });

  it('should save document to collection', function () {
    const post = Posts.findOne();
    post.should.include({
      title: 'Title',
      content: 'Content',
    });
  });
});
