import chai from 'chai';
import sinon from 'sinon';
import 'chai-as-promised';
import jsc from 'jsverify';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import { property, Sandbox } from './utils.js';

chai.should();
chai.use(sinonChai);
chai.use(chaiAsPromised);

export const expect = chai.expect;
export const assert = chai.assert;
export { chai, sinon, jsc, property, Sandbox };
