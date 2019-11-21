'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseConfig;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _exists = require('../util/exists');

var _parseArgv = require('./parseArgv');

var _parseArgv2 = _interopRequireDefault(_parseArgv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultConfig = 'mocha-webpack.opts';

function handleMissingConfig(config) {
  if (config) {
    throw new Error('Options file \'' + config + '\' not found');
  }

  return {};
}

var createStripSurroundingChar = function createStripSurroundingChar(c) {
  return function (s) {
    if (s.indexOf(c) === 0 && s.lastIndexOf(c) === s.length - 1 && s.indexOf(c) !== s.lastIndexOf(c)) {
      return s.substring(1, s.length - 1);
    }
    return s;
  };
};

var stripSingleQuotes = createStripSurroundingChar("'");
var stripDoubleQuotes = createStripSurroundingChar('"');

var removeSurroundingQuotes = function removeSurroundingQuotes(str) {
  var stripped = stripDoubleQuotes(str);

  if (stripped !== str) {
    // strip only once
    return stripped;
  }
  return stripSingleQuotes(str);
};

function parseConfig(explicitConfig) {
  var config = explicitConfig || defaultConfig;

  if (!(0, _exists.existsFileSync)(config)) {
    return handleMissingConfig(explicitConfig);
  }

  var argv = _fs2.default.readFileSync(config, 'utf8').replace(/\\\s/g, '%20').split(/\s/).filter(Boolean).map(function (value) {
    return value.replace(/%20/g, ' ');
  }).map(removeSurroundingQuotes);
  var defaultOptions = (0, _parseArgv2.default)(argv, true);
  return defaultOptions;
}