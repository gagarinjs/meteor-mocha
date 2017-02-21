/*eslint-env mocha*/
import { Meteor } from 'meteor/meteor';
import { Sandbox } from 'meteor/gagarin:unit';
import { Posts } from '../collections';
import { create, delay } from './methods.js';
import { USER, POST, POST_ID, USER_ID } from '../fixtures';

describe('Test Methods.', function () {

  before(function () {
    this.sandbox = new Sandbox();
    this.sandbox.collection(Meteor.users, [ USER ]);
    this.sandbox.collection(Posts, [ POST ]);
  });

  after(function () {
    this.sandbox.restore();
  });

  describe('Given I query a user', function () {
    beforeEach(function () {
      this.user = Meteor.users.findOne({ _id: USER_ID });
    });
    afterEach(function () {
      delete this.user;
    });
    it('should exist', function () {
      this.user.should.be.ok;
    });
    it('should have the rigth properties', function () {
      this.user.should.deep.equal(USER);
    });
  });

  describe('Given I query a post', function () {
    beforeEach(function () {
      this.post = Posts.findOne({ _id: POST_ID });
    });
    afterEach(function () {
      delete this.post;
    });
    it('should exist', function () {
      this.post.should.be.ok;
    });
    it('should have the right properties', function () {
      this.post.should.deep.equal(POST);
    });
  });

  describe('Given I am not logged in', function () {
    it('calling "create" should fail', function () {
      (()=>{
        create._execute({}, {
          title: 'Title',
          content: 'Content',
        });
      }).should.throw(/notAllowed/);
    });
    it('calling "delay" should succeed', function () {
      delay._execute({}, {
        ms: 100
      });
    });
  });

  describe('Given I am logged in and I create a post', function () {

    const rawPost = {
      title: 'Title',
      content: 'Content',
    };

    beforeEach(function () {
      this.postId = create._execute({
        userId: USER_ID,
      }, rawPost);
    });

    afterEach(function () {
      Posts.remove({ _id: this.postId });
      delete this.postId;
    });

    describe('when I query the post', function () {
      beforeEach(function () {
        this.post = Posts.findOne({ _id: this.postId });
      });
      it('should exist', function () {
        this.post.should.be.ok;
      });
      it('should have the right properties', function () {
        this.post.should.deep.equal({
          _id: this.postId,
          ...rawPost
        });
      });
    });

  });

});
