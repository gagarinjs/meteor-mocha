import { runInsideFiber } from './utils.js';

let Mocha = null;

if (Package['gagarin:mocha']) {
  Mocha = Package['gagarin:mocha'].Mocha;
  Mocha.interfaces['gagarin:bdd-fibers'] = BDDFibers;
}

/**
 * A custom Mocha interface.
 */
export function BDDFibers (suite) {
  
  // build on top of the original bdd interface
  Mocha.interfaces.bdd.apply(this, arguments);

  suite.on('pre-require', function (context) {

    const originalIt = context.it;

    context.it = runInsideFiber(context.it);
    context.it.skip = runInsideFiber(originalIt.skip);
    context.it.only = runInsideFiber(originalIt.only);
    context.specify = context.it;
    context.xspecify = context.xit = context.it.skip;

    context.before = runInsideFiber(context.before);
    context.beforeEach = runInsideFiber(context.beforeEach);
    context.after = runInsideFiber(context.after);
    context.afterEach = runInsideFiber(context.afterEach);

  });
};
