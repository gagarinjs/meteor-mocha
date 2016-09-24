import 'meteor/gagarin:module-paths';
import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';

checkNpmVersions({
  'mocha' : '^3.0.2',
}, 'gagarinjs:mocha');
