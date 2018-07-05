
Package.describe({
  name:          'gagarin:unit',
  version:       '0.5.1',
  summary:       'A toolbelt containing libraries useful for writing unit tests',
  testOnly:      true,
  git:           'https://github.com/gagarinjs/meteor-mocha.git',
  documentation: '../../README.md',
});

Npm.depends({
  chai: '4.1.2',
  sinon: '6.1.0',
  jsverify: '0.8.3',
  'sinon-chai': '3.2.0',
  'chai-as-promised': '7.1.1',
});

Package.onUse(function (api) {
  api.versionsFrom('1.4');
  api.use('mongo');
  api.use('ecmascript');
  api.use('promise');
  api.use('es5-shim');
  api.mainModule('lib/index.js');
});
