import { Meteor } from 'meteor/meteor';
import sleep from './sleep';

Meteor.startup(() => {
  // code to run on server at startup
  console.log('STARTUP');
  sleep(1000);
  console.log('DONE');
});
