'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ensureAbsolutePath = ensureAbsolutePath;

var _path = require('path');

// eslint-disable-next-line import/prefer-default-export
function ensureAbsolutePath(path, basePath) {
  return _path.posix.isAbsolute(path) || _path.win32.isAbsolute(path) ? path : (0, _path.join)(basePath, path);
}