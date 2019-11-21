'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

exports.default = registerReadyCallback;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function registerReadyCallback(compiler, cb) {
  compiler.hooks.failed.tap('mocha-webpack', cb);
  compiler.hooks.done.tap('mocha-webpack', function (stats) {
    if (stats.hasErrors()) {
      var jsonStats = stats.toJson();

      var _jsonStats$errors = (0, _slicedToArray3.default)(jsonStats.errors, 1),
          _err = _jsonStats$errors[0];

      cb(_err, stats);
    } else {
      cb(null, stats);
    }
  });
}