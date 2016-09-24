
Package.describe({
  name        : 'gagarin:mocha-fibers',
  version     : '0.0.1',
  description : 'Mocha test driver package from Gagarin team',
  testOnly    : true,
});

Npm.depends({
  'mocha': '2.5.3',
});

Package.onUse(function (api) {
  api.versionsFrom('1.3');
  api.use('ecmascript');
  api.use('promise');
  api.use('es5-shim');
  api.use('gagarin:mocha', { week: true });
  api.mainModule('lib/index.js', 'server');
});
