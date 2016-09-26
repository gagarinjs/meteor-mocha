
Package.describe({
  name        : 'gagarin:mocha',
  version     : '0.0.1',
  description : 'A mocha wrapper from Gagarin',
  testOnly    : true,
});

Package.onUse(function (api) {
  api.versionsFrom('1.4');
  api.use('ecmascript');
  api.use('promise');
  api.use('es5-shim');
  api.use('gagarin:module-paths');
  api.mainModule('lib/client.js', 'client');
  api.mainModule('lib/server.js', 'server');
});
