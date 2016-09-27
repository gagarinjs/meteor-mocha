// NOTE: This is a temporary workaround for the issue reported here:
//       https://github.com/benjamn/install/issues/9#issuecomment-249371064

Object.defineProperty(module.constructor.prototype, 'paths', {
  get: function () {
    if (!Object.hasOwnProperty(this, 'paths')) {
      return this.paths = [];
    }
  }
});

try {
  require('mocha');
} catch (err) {
  console.warn('Looks like mocha is not installed.');
}
