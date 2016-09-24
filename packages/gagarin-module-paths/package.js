
Package.describe({
  name        : 'gagarin:module-paths',
  version     : '0.0.1',
  description : 'A fix for missing module.paths property',
  testOnly    : true,
});

Package.onUse(function (api) {
  api.versionsFrom('1.4');
  api.use('modules');
  api.mainModule('index.js');
});
