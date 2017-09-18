import Fiber from 'fibers';

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
