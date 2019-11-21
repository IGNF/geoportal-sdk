'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = buildProgressPlugin;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _progress = require('progress');

var _progress2 = _interopRequireDefault(_progress);

var _webpack = require('webpack');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function buildProgressPlugin() {
  var bar = new _progress2.default('  [:bar] ' + _chalk2.default.bold(':percent') + ' (' + _chalk2.default.dim(':msg') + ')', {
    total: 100,
    complete: '=',
    incomplete: ' ',
    width: 25
  });
  return new _webpack.ProgressPlugin(function (percent, msg) {
    bar.update(percent, {
      msg: percent === 1 ? 'completed' : msg
    });
    if (percent === 1) {
      bar.terminate();
    }
  });
}