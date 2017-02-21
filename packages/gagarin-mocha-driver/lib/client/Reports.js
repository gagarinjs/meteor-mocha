import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const GagarinReports = new Mongo.Collection('Gagarin.Reports');
export const Reports = new Mongo.Collection(null);

Meteor.startup(() => {
  GagarinReports.find().observeChanges({
    added(id, fields) {
      Reports.insert({
        _id: id,
        ...fields,
      });
    },
  });
});
