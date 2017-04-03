
Package.describe({
  name:          'gagarin:mocha-reporter',
  version:       '0.0.1',
  summary:       'A simple mocha reporter bulit on top of xtermjs',
  testOnly:      true,
  git:           'https://github.com/gagarinjs/meteor-mocha.git',
  documentation: '../../README.md',
});

Npm.depends({
  xterm: '2.3.2'
});

Package.onUse(function (api) {
  api.versionsFrom('1.4');
  api.use('ecmascript');
  api.use('promise');
  api.use('es5-shim');
  api.use('mongo');
  api.use('templating');
  api.use('reactive-var');
  api.use('gagarin:mocha@0.0.1');
  api.use('gagarin:mocha-driver@0.0.1');
  api.mainModule('lib/index.js', 'client');
});
