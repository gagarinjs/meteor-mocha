import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Meteor } from 'meteor/meteor';
import { Posts } from '../collections';

export const create = new ValidatedMethod({
  name: 'Posts.create',
  validate: new SimpleSchema({
    title:   { type: String },
    content: { type: String, optional: true },
  }).validator(),
  run ({
    title,
    content,
  }) {
    const user = this.userId && Meteor.users.findOne({_id: this.userId});
    if (!user) {
      throw new Meteor.Error('Posts.create.notAllowed', 'Not logged in.');
    }
    return Posts.insert({ title, content });
  }
});

export const delay = new ValidatedMethod({
  name: 'Posts.delay',
  validate: new SimpleSchema({
    ms: { type: Number },
  }).validator(),
  run (params) {
    if (Meteor.isServer) {
      return require('./server/methods.js').delay(this, params);
    }
  }
});
