
Package.describe({
  name:          'gagarin:mocha-fibers',
  version:       '0.0.2',
  summary:       'A wrapper for mocha bdd interface for writing fiber-aware tests',
  testOnly:      true,
  git:           'https://github.com/gagarinjs/meteor-mocha.git',
  documentation: '../../README.md',
});

Package.onUse(function (api) {
  api.versionsFrom('1.4');
  api.use('ecmascript');
  api.use('promise');
  api.use('es5-shim');
  api.use('gagarin:mocha@0.0.1', { week: true });
  api.mainModule('lib/index.js', 'server');
});
