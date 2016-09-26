
Package.describe({
  name        : 'gagarin:mocha-fibers',
  version     : '0.0.1',
  description : 'Mocha bdd wrapper for serve-side tests',
  testOnly    : true,
});

Package.onUse(function (api) {
  api.versionsFrom('1.4');
  api.use('ecmascript');
  api.use('promise');
  api.use('es5-shim');
  api.use('gagarin:mocha', { week: true });
  api.mainModule('lib/index.js', 'server');
});
