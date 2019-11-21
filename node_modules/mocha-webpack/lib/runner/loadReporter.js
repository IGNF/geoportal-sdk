'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loadReporter;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _mocha = require('mocha');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function loadReporter(reporter, cwd) {
  // if reporter is already loaded, just return it
  if (typeof reporter === 'function') {
    return reporter;
  }

  // try to load built-in reporter like 'spec'
  if (typeof _mocha.reporters[reporter] !== 'undefined') {
    return _mocha.reporters[reporter];
  }

  var loadedReporter = null;
  try {
    // try to load reporter from node_modules
    loadedReporter = require(reporter); // eslint-disable-line global-require, import/no-dynamic-require
  } catch (e) {
    // try to load reporter from cwd
    // eslint-disable-next-line global-require, import/no-dynamic-require
    loadedReporter = require(_path2.default.resolve(cwd, reporter));
  }
  return loadedReporter;
}