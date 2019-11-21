'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loadUI;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _mocha = require('mocha');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function loadUI(ui, cwd) {
  // try to load built-in ui like 'bdd'
  if (typeof _mocha.interfaces[ui] !== 'undefined') {
    return ui;
  }

  var loadedUI = null;
  try {
    // try to load reporter from node_modules
    loadedUI = require.resolve(ui);
  } catch (e) {
    // try to load reporter from cwd
    loadedUI = require.resolve(_path2.default.resolve(cwd, ui));
  }
  return loadedUI;
}