
Package.describe({
  name:          'gagarin:mocha-driver',
  version:       '0.0.1',
  summary:       'An alternative mocha test driver package',
  testOnly:      true,
  git:           'https://github.com/gagarinjs/meteor-mocha.git',
  documentation: '../../README.md',
});

Package.onUse(function (api) {
  api.versionsFrom('1.4');
  api.use('ecmascript');
  api.use('promise');
  api.use('es5-shim');
  api.use('mongo');
  api.use('reactive-var');
  api.use('gagarin:mocha@0.0.1');
  api.use('gagarin:mocha-fibers@0.0.1');

  api.mainModule('lib/client/index.js', 'client');
  api.mainModule('lib/server/index.js', 'server');
});
