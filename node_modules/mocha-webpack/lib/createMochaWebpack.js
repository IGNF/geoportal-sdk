'use strict';

var _MochaWebpack = require('./MochaWebpack');

var _MochaWebpack2 = _interopRequireDefault(_MochaWebpack);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// module.exports cause of babel 6
module.exports = function createMochaWebpack() {
  return new _MochaWebpack2.default();
};