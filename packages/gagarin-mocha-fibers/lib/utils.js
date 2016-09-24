import Fiber, { Future } from 'fibers';

export function wrapPromisesForFiber(obj, methods) {
  var proxy = {};
  methods.forEach(function(method) {
    var original = obj[method];
    proxy[method] = function (...args) {
      var f = new Future();
      var promise = original.apply(obj, args);
      promiseAsThunk(promise)(function(error, value) {
        if (error) {
          f.throw(error);
        } else {
          f.return(value);
        }
      });
      return f.wait();
    };
  });
  return proxy;
}

export function promiseAsThunk(promise) {
  return function(done) {
    promise.then(function(value) {
      done(null, value);
    }).catch(function(error) {
      done(error);
    });
  };
}

export function runInsideFiber(originalFunction) {
  function wrapped(name, fn) {
    if (typeof name === "function") {
      fn = name;
      name = null;
    }
    if (fn) {
      return originalFunction(name, function(done) {
        new Fiber(function() {
          if (fn.length > 0) {
            fn(done);
          } else {
            var promise = fn();
            if (promise && promise.then) {
              promiseAsThunk(promise)(done);
            } else {
              done();
            }
          }
        }).run();
      });
    }
    return originalFunction(name);
  };
  return wrapped;
}
