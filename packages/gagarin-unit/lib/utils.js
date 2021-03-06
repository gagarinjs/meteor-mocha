import { Mongo } from 'meteor/mongo';
import sinon from 'sinon';
import jsc from 'jsverify';

export function property (arbitrary, verify) {
  let error = null;
  const test = jsc.forall(arbitrary, function (...args) {
    try {
      return verify(...args);
    } catch (err) {
      error = err;
    }
    return false;
  });
  return function () {
    try {
      jsc.assert(test);
    } catch (err) {
      if (error) {
        error.message = err.message + '; Original message: ' + error.message;
        throw error;
      }
      throw err;
    }
  };
}

export class Sandbox {
  constructor() {
    this.sandbox = sinon.createSandbox();
  }
  collection(collection, documents = []) {
    const testCollection = new Mongo.Collection(null, {
      transform: collection._transform,
    });
    const collectionName = collection._name;
    testCollection._collection.name = collectionName;
    testCollection._name = collectionName;
    [
      'find',
      'findOne',
      'insert',
      'upsert',
      'update',
      'remove',
    ].forEach((name) => {
      this.sandbox.stub(collection, name).callsFake(testCollection[name].bind(testCollection));
      if (collection.direct) {
        this.sandbox.stub(collection.direct, name).callsFake(testCollection[name].bind(testCollection));
      }
    });
    for (const doc of documents) {
      testCollection.insert(doc);
    }
  }
  restore() {
    this.sandbox.restore();
  }
}
