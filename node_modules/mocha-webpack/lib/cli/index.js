'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _defaults2 = require('lodash/defaults');

var _defaults3 = _interopRequireDefault(_defaults2);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _parseArgv = require('./parseArgv');

var _parseArgv2 = _interopRequireDefault(_parseArgv);

var _exists = require('../util/exists');

var _parseConfig = require('./parseConfig');

var _parseConfig2 = _interopRequireDefault(_parseConfig);

var _requireWebpackConfig = require('./requireWebpackConfig');

var _requireWebpackConfig2 = _interopRequireDefault(_requireWebpackConfig);

var _glob = require('../util/glob');

var _createMochaWebpack = require('../createMochaWebpack');

var _createMochaWebpack2 = _interopRequireDefault(_createMochaWebpack);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function resolve(mod) {
  var absolute = (0, _exists.existsFileSync)(mod) || (0, _exists.existsFileSync)(mod + '.js');
  var file = absolute ? _path2.default.resolve(mod) : mod;
  return file;
}

function exit(lazy, code) {
  if (lazy) {
    process.on('exit', function () {
      process.exit(code);
    });
  } else {
    process.exit(code);
  }
}

var cliOptions = (0, _parseArgv2.default)(process.argv.slice(2), true);
var configOptions = (0, _parseConfig2.default)(cliOptions.opts);
var requiresWebpackConfig = cliOptions.webpackConfig != null || configOptions.webpackConfig != null;
var defaultOptions = (0, _parseArgv2.default)([]);

var options = (0, _defaults3.default)({}, cliOptions, configOptions, defaultOptions);

options.require.forEach(function (mod) {
  require(resolve(mod)); // eslint-disable-line global-require, import/no-dynamic-require
});

options.include = options.include.map(resolve);

options.webpackConfig = (0, _requireWebpackConfig2.default)(options.webpackConfig, requiresWebpackConfig, options.webpackEnv, options.mode);

var mochaWebpack = (0, _createMochaWebpack2.default)();

options.include.forEach(function (f) {
  return mochaWebpack.addInclude(f);
});

var extensions = (0, _get3.default)(options.webpackConfig, 'resolve.extensions', ['.js']);
var fallbackFileGlob = (0, _glob.extensionsToGlob)(extensions);
var fileGlob = options.glob != null ? options.glob : fallbackFileGlob;

options.files.forEach(function (f) {
  return mochaWebpack.addEntry((0, _glob.ensureGlob)(f, options.recursive, fileGlob));
});

mochaWebpack.cwd(process.cwd());
mochaWebpack.webpackConfig(options.webpackConfig);
mochaWebpack.bail(options.bail);
mochaWebpack.reporter(options.reporter, options.reporterOptions);
mochaWebpack.ui(options.ui);
mochaWebpack.interactive(options.interactive);

if (options.fgrep) {
  mochaWebpack.fgrep(options.fgrep);
}

if (options.grep) {
  mochaWebpack.grep(options.grep);
}

if (options.invert) {
  mochaWebpack.invert();
}

if (options.checkLeaks) {
  mochaWebpack.ignoreLeaks(false);
}

if (options.fullTrace) {
  mochaWebpack.fullStackTrace();
}

if (options.quiet) {
  mochaWebpack.quiet();
}

mochaWebpack.useColors(options.colors);
mochaWebpack.useInlineDiffs(options.inlineDiffs);
mochaWebpack.timeout(options.timeout);

if (options.retries) {
  mochaWebpack.retries(options.retries);
}

mochaWebpack.slow(options.slow);

if (options.asyncOnly) {
  mochaWebpack.asyncOnly();
}

if (options.delay) {
  mochaWebpack.delay();
}

if (options.growl) {
  mochaWebpack.growl();
}

_promise2.default.resolve().then(function () {
  if (options.watch) {
    return mochaWebpack.watch();
  }
  return mochaWebpack.run();
}).then(function (failures) {
  exit(options.exit, failures);
}).catch(function (e) {
  if (e) {
    console.error(e.stack); // eslint-disable-line
  }
  exit(options.exit, 1);
});