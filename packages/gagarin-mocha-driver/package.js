
Package.describe({
  name        : 'gagarin:mocha-driver',
  version     : '0.0.1',
  description : 'Mocha test driver package from Gagarin team',
  testOnly    : true,
});

Npm.depends({
  xterm: '1.0.0'
});

Package.onUse(function (api) {
  api.versionsFrom('1.4');
  api.use('ecmascript');
  api.use('promise');
  api.use('templating');
  api.use('es5-shim');
  api.use('mongo');
  api.use('reactive-var');
  api.use('tmeasday:check-npm-versions');
  api.use('gagarin:mocha');
  api.use('gagarin:mocha-fibers');

  api.addFiles(['lib/client/index.css'], 'client');
  api.mainModule('lib/client/index.js', 'client');
  api.mainModule('lib/server/index.js', 'server');
});
