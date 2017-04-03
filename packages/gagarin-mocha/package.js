
Package.describe({
  name:          'gagarin:mocha',
  version:       '0.0.1',
  summary:       'A simple wrapper that allows importing mocha in Meteor environemnt',
  testOnly:      true,
  git:           'https://github.com/gagarinjs/meteor-mocha.git',
  documentation: '../../README.md',
});

Package.onUse(function (api) {
  api.versionsFrom('1.4');
  api.use('ecmascript');
  api.use('promise');
  api.use('es5-shim');
  api.mainModule('lib/client.js', 'client');
  api.mainModule('lib/server.js', 'server');
});
