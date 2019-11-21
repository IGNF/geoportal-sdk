'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

exports.default = registerInMemoryCompiler;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _sourceMapSupport = require('source-map-support');

var _sourceMapSupport2 = _interopRequireDefault(_sourceMapSupport);

var _memoryFs = require('memory-fs');

var _memoryFs2 = _interopRequireDefault(_memoryFs);

var _registerRequireHook = require('../../util/registerRequireHook');

var _registerRequireHook2 = _interopRequireDefault(_registerRequireHook);

var _paths = require('../../util/paths');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function registerInMemoryCompiler(compiler) {
  // register memory fs to webpack
  var memoryFs = new _memoryFs2.default();
  compiler.outputFileSystem = memoryFs; // eslint-disable-line no-param-reassign

  // build asset map to allow fast checks for file existence
  var assetMap = new _map2.default();
  compiler.hooks.done.tap('mocha-webpack', function (stats) {
    assetMap.clear();

    if (!stats.hasErrors()) {
      (0, _keys2.default)(stats.compilation.assets).forEach(function (assetPath) {
        return assetMap.set((0, _paths.ensureAbsolutePath)(assetPath, compiler.options.output.path), true);
      });
    }
  });

  // provide file reader to read from memory fs
  var readFile = function readFile(filePath) {
    if (assetMap.has(filePath)) {
      try {
        var code = memoryFs.readFileSync(filePath, 'utf8');
        return code;
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  // module resolver for require calls from memory fs
  var resolveFile = function resolveFile(filePath, requireCaller) {
    // try to read file from memory-fs as it is
    var code = readFile(filePath);
    var resolvedPath = filePath;

    if (code === null && requireCaller != null) {
      var filename = requireCaller.filename;

      if (filename != null) {
        // if that didn't work, resolve the file relative to it's parent
        resolvedPath = _path2.default.resolve(_path2.default.dirname(filename), filePath);
        code = readFile(resolvedPath);
      }
    }
    return { path: code !== null ? resolvedPath : null, source: code };
  };

  // install require hook to be able to require webpack bundles from memory
  var unmountHook = (0, _registerRequireHook2.default)('.js', resolveFile);

  // install source map support to read source map from memory
  _sourceMapSupport2.default.install({
    emptyCacheBetweenOperations: true,
    handleUncaughtExceptions: false,
    environment: 'node',
    retrieveFile: function retrieveFile(f) {
      return readFile(f);
    } // wrapper function to fake an unmount function
  });

  return function unmount() {
    unmountHook();
    readFile = function readFile(filePath) {
      return null;
    }; // eslint-disable-line no-unused-vars
  };
}