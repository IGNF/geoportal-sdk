'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = configureMocha;

var _mocha = require('mocha');

var _mocha2 = _interopRequireDefault(_mocha);

var _loadReporter = require('./loadReporter');

var _loadReporter2 = _interopRequireDefault(_loadReporter);

var _loadUI = require('./loadUI');

var _loadUI2 = _interopRequireDefault(_loadUI);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function configureMocha(options) {
  // infinite stack traces
  Error.stackTraceLimit = Infinity;

  // init mocha
  var mocha = new _mocha2.default();

  // reporter
  var reporter = (0, _loadReporter2.default)(options.reporter, options.cwd);
  mocha.reporter(reporter, options.reporterOptions);

  // colors
  mocha.useColors(options.colors);

  // inline-diffs
  mocha.useInlineDiffs(options.useInlineDiffs);

  // slow <ms>
  mocha.suite.slow(options.slow);

  // timeout <ms>
  if (options.timeout === 0) {
    mocha.enableTimeouts(false);
  } else {
    mocha.suite.timeout(options.timeout);
  }

  // bail
  mocha.suite.bail(options.bail);

  // grep
  if (options.grep) {
    mocha.grep(new RegExp(options.grep));
  }

  // fgrep
  if (options.fgrep) {
    mocha.grep(options.fgrep);
  }

  // invert
  if (options.invert) {
    mocha.invert();
  }

  // check-leaks
  if (options.ignoreLeaks === false) {
    mocha.checkLeaks();
  }

  // full-trace
  if (options.fullStackTrace) {
    mocha.fullTrace();
  }

  // growl
  if (options.growl) {
    mocha.growl();
  }

  // async-only
  if (options.asyncOnly) {
    mocha.asyncOnly();
  }

  // delay
  if (options.delay) {
    mocha.delay();
  }

  // retries
  if (options.retries) {
    mocha.suite.retries(options.retries);
  }

  // interface
  var ui = (0, _loadUI2.default)(options.ui, options.cwd);
  mocha.ui(ui);

  return mocha;
}