
Package.describe({
  name:          'gagarin:unit',
  version:       '0.0.1',
  summary:       'A toolbelt containing libraries useful for writing unit tests',
  testOnly:      true,
  git:           'https://github.com/gagarinjs/meteor-mocha.git',
  documentation: '../../README.md',
});

Npm.depends({
  chai: '3.5.0',
  sinon: '1.17.5',
  jsverify: '0.7.1',
  'sinon-chai': '2.8.0',
  'chai-as-promised': '5.3.0',
});

Package.onUse(function (api) {
  api.versionsFrom('1.4');
  api.use('mongo');
  api.use('ecmascript');
  api.use('promise');
  api.use('es5-shim');
  api.mainModule('lib/index.js');
});
