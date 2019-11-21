'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extensionsToGlob = exports.ensureGlob = exports.glob = undefined;

require('nodent-runtime');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _globby = require('globby');

var _globby2 = _interopRequireDefault(_globby);

var _isGlob = require('is-glob');

var _isGlob2 = _interopRequireDefault(_isGlob);

var _globParent = require('glob-parent');

var _globParent2 = _interopRequireDefault(_globParent);

var _normalizePath = require('normalize-path');

var _normalizePath2 = _interopRequireDefault(_normalizePath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isDirectory = function isDirectory(filePath) {
  return _path2.default.extname(filePath).length === 0;
};
var glob = exports.glob = function glob(patterns, options) {
  return new Promise(function ($return, $error) {
    return $return((0, _globby2.default)(patterns, options));
  }.$asyncbind(this));
};

var ensureGlob = exports.ensureGlob = function ensureGlob(entry) {
  var recursive = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var pattern = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '*.js';

  var normalized = (0, _normalizePath2.default)(entry);

  if ((0, _isGlob2.default)(normalized)) {
    return normalized;
  } else if (isDirectory(normalized)) {
    if (!(0, _isGlob2.default)(pattern)) {
      throw new Error('Provided Glob ' + pattern + ' is not a valid glob pattern');
    }

    var parent = (0, _globParent2.default)(pattern);
    if (parent !== '.' || pattern.indexOf('**') !== -1) {
      throw new Error('Provided Glob ' + pattern + ' must be a file pattern like *.js');
    }

    var globstar = recursive ? '**/' : '';

    return normalized + '/' + globstar + pattern;
  }
  return normalized;
};

var extensionsToGlob = exports.extensionsToGlob = function extensionsToGlob(extensions) {
  var filtered = extensions.filter(Boolean);

  if (filtered.length === 0) {
    return '*.js';
  } else if (filtered.length === 1) {
    return '*' + filtered[0];
  }
  return '*{' + filtered.join(',') + '}';
};