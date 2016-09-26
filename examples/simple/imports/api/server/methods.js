import { Meteor } from 'meteor/meteor';
import 'fibers';
import Future from 'fibers/future';

export function delay (invocation, ms) {
  const future = new Future();
  Meteor.setTimeout(function () {
    future.return();
  }, 500);
  return future.wait();
}