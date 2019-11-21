'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createStatsFormatter;

var _os = require('os');

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _RequestShortener = require('webpack/lib/RequestShortener');

var _RequestShortener2 = _interopRequireDefault(_RequestShortener);

var _formatUtil = require('./formatUtil');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createGetFile = function createGetFile(requestShortener) {
  return function (e) {
    /* istanbul ignore if */
    if (e.file) {
      // webpack does this also, so there must be case when this happens
      return e.file;
    } else if (e.module && e.module.readableIdentifier && typeof e.module.readableIdentifier === 'function') {
      // if we got a module, build a file path to the module without loader information
      return (0, _formatUtil.stripLoaderFromPath)(e.module.readableIdentifier(requestShortener));
    }
    /* istanbul ignore next */
    return null;
  };
};

// helper to transform strings in errors
var ensureWebpackErrors = function ensureWebpackErrors(errors) {
  return errors.map(function (e) {
    /* istanbul ignore if */
    if (typeof e === 'string') {
      // webpack does this also, so there must be case when this happens
      return { message: e };
    }
    return e;
  });
};

var prependWarning = function prependWarning(message) {
  return _chalk2.default.yellow('Warning') + ' ' + message;
};
var prependError = function prependError(message) {
  return _chalk2.default.red('Error') + ' ' + message;
};

function createStatsFormatter(rootPath) {
  var requestShortener = new _RequestShortener2.default(rootPath);
  var getFile = createGetFile(requestShortener);

  var formatError = function formatError(err) {
    var lines = [];

    var file = getFile(err);

    /* istanbul ignore else */
    if (file != null) {
      lines.push('in ' + _chalk2.default.underline(file));
      lines.push('');
    } else {
      // got no file, that happens only for more generic errors like the following from node-sass
      //    Missing binding /mocha-webpack-example/node_modules/node-sass/vendor/linux-x64-48/binding.node
      //    Node Sass could not find a binding for your current environment: Linux 64-bit with Node.js 6.x
      //    ...
      // just print 2 lines like file
      lines.push('');
      lines.push('');
    }

    lines.push((0, _formatUtil.formatErrorMessage)(err.message));

    return lines.join(_os.EOL);
  };

  return function statsFormatter(stats) {
    var compilation = stats.compilation;


    return {
      errors: ensureWebpackErrors(compilation.errors).map(formatError).map(prependError),
      warnings: ensureWebpackErrors(compilation.warnings).map(formatError).map(prependWarning)
    };
  };
}