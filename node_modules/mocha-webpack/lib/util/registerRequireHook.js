'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

exports.default = registerRequireHook;

var _module = require('module');

var _module2 = _interopRequireDefault(_module);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// the module in which the require() call originated
var requireCaller = void 0;
// all custom registered resolvers

/*  eslint-disable no-underscore-dangle */

// see https://github.com/nodejs/node/blob/master/lib/module.js
// $FlowFixMe
var pathResolvers = [];

// keep original Module._resolveFilename
var originalResolveFilename = _module2.default._resolveFilename;
// override Module._resolveFilename
_module2.default._resolveFilename = function _resolveFilename() {
  for (var _len = arguments.length, parameters = Array(_len), _key = 0; _key < _len; _key++) {
    parameters[_key] = arguments[_key];
  }

  var parent = parameters[1];
  // store require() caller (the module in which this require() call originated)
  requireCaller = parent;
  return originalResolveFilename.apply(this, parameters);
};

// keep original Module._findPath
var originalFindPath = _module2.default._findPath;
// override Module._findPath
_module2.default._findPath = function _findPath() {
  for (var _len2 = arguments.length, parameters = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    parameters[_key2] = arguments[_key2];
  }

  var request = parameters[0];

  // try to resolve the path with custom resolvers
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = (0, _getIterator3.default)(pathResolvers), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var resolve = _step.value;

      var resolved = resolve(request, requireCaller);
      if (typeof resolved !== 'undefined') {
        return resolved;
      }
    }

    // and when none found try to resolve path with original resolver
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  var filename = originalFindPath.apply(this, parameters);
  if (filename !== false) {
    return filename;
  }

  return false;
};

function registerRequireHook(dotExt, resolve) {
  // cache source code after resolving to avoid another access to the fs
  var sourceCache = {};
  // store all files that were affected by this hook
  var affectedFiles = {};

  var resolvePath = function resolvePath(path, parent) {
    // get CommonJS module source code for this require() call
    var _resolve = resolve(path, parent),
        resolvedPath = _resolve.path,
        source = _resolve.source;

    // if no CommonJS module source code returned - skip this require() hook


    if (resolvedPath == null) {
      return undefined;
    }

    // flush require() cache
    delete require.cache[resolvedPath];

    // put the CommonJS module source code into the hash
    sourceCache[resolvedPath] = source;

    // return the path to be require()d in order to get the CommonJS module source code
    return resolvedPath;
  };

  var resolveSource = function resolveSource(path) {
    var source = sourceCache[path];
    delete sourceCache[path];
    return source;
  };

  pathResolvers.push(resolvePath);

  // keep original extension loader
  var originalLoader = _module2.default._extensions[dotExt];
  // override extension loader
  _module2.default._extensions[dotExt] = function (module, filename) {
    var source = resolveSource(filename);

    if (typeof source === 'undefined') {
      // load the file with the original loader
      (originalLoader || _module2.default._extensions['.js'])(module, filename);
      return;
    }

    affectedFiles[filename] = true;

    // compile javascript module from its source
    module._compile(source, filename);
  };

  return function unmout() {
    pathResolvers = pathResolvers.filter(function (r) {
      return r !== resolvePath;
    });
    _module2.default._extensions[dotExt] = originalLoader;
    (0, _keys2.default)(affectedFiles).forEach(function (path) {
      delete require.cache[path];
      delete sourceCache[path];
      delete affectedFiles[path];
    });
  };
}