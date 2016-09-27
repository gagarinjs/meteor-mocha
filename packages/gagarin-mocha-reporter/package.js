
Package.describe({
  name        : 'gagarin:mocha-reporter',
  version     : '0.0.1',
  description : 'A simple mocha reporter',
  testOnly    : true,
});

Npm.depends({
  xterm: '1.0.0'
});

Package.onUse(function (api) {
  api.versionsFrom('1.4');
  api.use('ecmascript');
  api.use('promise');
  api.use('es5-shim');
  api.use('mongo');
  api.use('templating');
  api.use('reactive-var');
  api.use('gagarin:mocha');
  api.use('gagarin:mocha-driver');
  api.mainModule('lib/index.js', 'client');
});
