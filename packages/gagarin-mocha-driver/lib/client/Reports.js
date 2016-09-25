import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const ReportsServer = new Mongo.Collection('gagarin.reports');
export const Reports = new Mongo.Collection(null);

Meteor.startup(function () {
  ReportsServer.find({}).observeChanges({
    added (_id, fields) {
      Reports.insert({
        _id,
        ...fields,
        source: 'server',
      });
    }
  });
});
