import { Mongo } from 'meteor/mongo';
import sinon from 'sinon';
import jsc from 'jsverify';

export function union (array1, array2) {
  const result = new Set(array1);
  for (const item of array2) {
    result.add(item);
  }
  return Array.from(result);
}

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
  constructor () {
    this.sandbox = sinon.sandbox.create();
  }
  collection (collection, documents=[]) {
    const testCollection = new Mongo.Collection(null, {
      transform: collection._transform
    });
    [
      'find',
      'findOne',
      'insert',
      'update',
      'remove',
    ].forEach(name => {
      this.sandbox.stub(collection, name, testCollection[name].bind(testCollection));
    });
    for (const doc of documents) {
      testCollection.insert(doc);
    }
  }
  restore () {
    this.sandbox.restore();
  }
}
