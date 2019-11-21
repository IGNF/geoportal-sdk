'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.existsFileSync = existsFileSync;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable import/prefer-default-export */

function existsFileSync(file) {
  try {
    _fs2.default.accessSync(file, _fs2.default.F_OK);
    return true;
  } catch (e) {
    return false;
  }
}