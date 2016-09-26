import { Meteor } from 'meteor/meteor';
export * from './methods.js';

if (Meteor.isServer) {
  require('./server/methods.js');
}
