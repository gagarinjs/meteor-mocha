import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export class Post {
  constructor (doc) {
    Object.assign(this, doc);
  }
}

export const Posts = new Mongo.Collection('Posts');
Posts.schema = new SimpleSchema({
  title:   { type: String },
  content: { type: String },
});
Posts.attachSchema(Posts.schema);
