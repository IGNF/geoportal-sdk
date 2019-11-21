'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.default = requireWebpackConfig;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _interpret = require('interpret');

var _interpret2 = _interopRequireDefault(_interpret);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sortExtensions(ext1, ext2) {
  if (ext1 === '.js') {
    return -1;
  }
  if (ext2 === '.js') {
    return 1;
  }
  return ext1.length - ext2.length;
}

var extensions = (0, _keys2.default)(_interpret2.default.extensions).sort(sortExtensions);

function fileExists(filePath) {
  try {
    return _fs2.default.existsSync(filePath);
  } catch (e) {
    return false;
  }
}

function findConfigFile(dirPath, baseName) {
  for (var i = 0; i < extensions.length; i += 1) {
    var filePath = _path2.default.resolve(dirPath, '' + baseName + extensions[i]);
    if (fileExists(filePath)) {
      return filePath;
    }
  }
  return null;
}

function getConfigExtension(configPath) {
  for (var i = extensions.length - 1; i >= 0; i -= 1) {
    var extension = extensions[i];
    if (configPath.indexOf(extension, configPath.length - extension.length) > -1) {
      return extension;
    }
  }
  return _path2.default.extname(configPath);
}

function registerCompiler(moduleDescriptor) {
  if (!moduleDescriptor) {
    return;
  }

  if (typeof moduleDescriptor === 'string') {
    require(moduleDescriptor); // eslint-disable-line global-require, import/no-dynamic-require
  } else if (!Array.isArray(moduleDescriptor)) {
    var module = require(moduleDescriptor.module); // eslint-disable-line global-require, import/no-dynamic-require
    moduleDescriptor.register(module);
  } else {
    for (var i = 0; i < moduleDescriptor.length; i += 1) {
      try {
        registerCompiler(moduleDescriptor[i]);
        break;
      } catch (e) {
        // do nothing
      }
    }
  }
}

function requireWebpackConfig(webpackConfig, required, env, mode) {
  var configPath = _path2.default.resolve(webpackConfig);
  var configExtension = getConfigExtension(configPath);
  var configFound = false;
  var config = {};

  if (fileExists(configPath)) {
    // config exists, register compiler for non-js extensions
    registerCompiler(_interpret2.default.extensions[configExtension]);
    // require config
    config = require(configPath); // eslint-disable-line global-require, import/no-dynamic-require
    configFound = true;
  } else if (configExtension === '.js') {
    // config path does not exist, try to require it with precompiler
    var configDirPath = _path2.default.dirname(configPath);
    var configBaseName = _path2.default.basename(configPath, configExtension);
    var configPathPrecompiled = findConfigFile(configDirPath, configBaseName);
    if (configPathPrecompiled != null) {
      // found a config that needs to be precompiled
      var configExtensionPrecompiled = getConfigExtension(configPathPrecompiled);
      // register compiler & require config
      registerCompiler(_interpret2.default.extensions[configExtensionPrecompiled]);
      config = require(configPathPrecompiled); // eslint-disable-line global-require, import/no-dynamic-require
      configFound = true;
    }
  }

  if (!configFound) {
    if (required) {
      throw new Error('Webpack config could not be found: ' + webpackConfig);
    } else if (mode != null) {
      config.mode = mode;
    }
    return config;
  }

  config = config.default || config;

  if (typeof config === 'function') {
    config = config(env);
  }

  if (mode != null) {
    config.mode = mode;
  }

  if (Array.isArray(config)) {
    throw new Error('Passing multiple configs as an Array is not supported. Please provide a single config instead.');
  }

  return config;
}