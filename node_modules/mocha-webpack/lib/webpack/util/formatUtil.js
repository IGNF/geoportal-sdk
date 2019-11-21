'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stripLoaderFromPath = exports.formatErrorMessage = undefined;

var _flow2 = require('lodash/flow');

var _flow3 = _interopRequireDefault(_flow2);

var _os = require('os');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var syntaxErrorLabel = 'Syntax error:';

// we replace all EOL combinations with \n and replace to work in a consistent way

var replaceEol = function replaceEol(message) {
  return message.replace(/\r?\n/g, '\n');
};
// undo eol replacements
var useValidEol = function useValidEol(message) {
  return message.replace('\n', _os.EOL);
};

// strip stacks for module builds as they are useless and just show what happened inside the loader
// strip at ... ...:x:y
var stripStackTrace = function stripStackTrace(message) {
  return message.replace(/^\s*at\s.*\(.+\)\n?/gm, '');
};

var cleanUpModuleNotFoundMessage = function cleanUpModuleNotFoundMessage(message) {
  if (message.indexOf('Module not found:') === 0) {
    return message.replace('Cannot resolve \'file\' or \'directory\' ', '').replace('Cannot resolve module ', '').replace('Error: Can\'t resolve ', '').replace('Error: ', '');
  }
  return message;
};

var cleanUpBuildError = function cleanUpBuildError(message) {
  if (message.indexOf('Module build failed:') === 0) {
    // check if first line of message just contains 'Module build failed: '
    if (/Module build failed:\s*$/.test(message.split('\n')[0])) {
      var lines = message.split('\n');
      var replacement = lines[0];

      // try to detect real type of build error
      if (/File to import not found or unreadable/.test(message)) {
        // sass-loader file not found -> module not found
        replacement = 'Module not found:';
      } else if (/Invalid CSS/.test(message)) {
        // sass-loader css error -> syntax error
        replacement = syntaxErrorLabel;
      }

      lines[0] = replacement;
      message = lines.join('\n'); // eslint-disable-line no-param-reassign
    }

    return message.replace('Module build failed: SyntaxError:', syntaxErrorLabel) // babel-loader error
    .replace('Module build failed:', ''); // otherwise remove it as it's already clear that this is an module error
  }
  return message;
};

// removes new line characters at the end of message
var cleanUpUnwantedEol = function cleanUpUnwantedEol(message) {
  return message.replace(/\s*\n\s*$/, '');
};

// indent all lines by 2 spaces
var indent = function indent(message) {
  return message.split('\n').map(function (l) {
    return '  ' + l;
  }).join('\n');
};

// gets executed from top to bottom
var formatErrorMessage = exports.formatErrorMessage = (0, _flow3.default)([replaceEol, stripStackTrace, cleanUpModuleNotFoundMessage, cleanUpBuildError, cleanUpUnwantedEol, indent, useValidEol]);

var stripLoaderFromPath = exports.stripLoaderFromPath = function stripLoaderFromPath(file) {
  // Remove webpack-specific loader notation from filename.
  // Before:
  // ../mocha-webpack/lib/webpack/loader/entryLoader.js!../mocha-webpack/lib/entry.js
  // After:
  // ../mocha-webpack/lib/entry.js
  if (file.lastIndexOf('!') !== -1) {
    return file.substr(file.lastIndexOf('!') + 1);
  }
  return file;
};