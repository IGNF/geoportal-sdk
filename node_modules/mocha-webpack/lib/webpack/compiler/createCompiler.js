'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createCompiler;

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createCompiler(webpackConfig) {
  var compiler = (0, _webpack2.default)(webpackConfig);

  return compiler;
}