'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _some2 = require('lodash/some');

var _some3 = _interopRequireDefault(_some2);

var _filter2 = require('lodash/filter');

var _filter3 = _interopRequireDefault(_filter2);

var _flatten2 = require('lodash/flatten');

var _flatten3 = _interopRequireDefault(_flatten2);

var _kebabCase2 = require('lodash/kebabCase');

var _kebabCase3 = _interopRequireDefault(_kebabCase2);

var _isArray2 = require('lodash/isArray');

var _isArray3 = _interopRequireDefault(_isArray2);

var _forOwn2 = require('lodash/forOwn');

var _forOwn3 = _interopRequireDefault(_forOwn2);

var _has2 = require('lodash/has');

var _has3 = _interopRequireDefault(_has2);

var _forEach2 = require('lodash/forEach');

var _forEach3 = _interopRequireDefault(_forEach2);

var _isUndefined2 = require('lodash/isUndefined');

var _isUndefined3 = _interopRequireDefault(_isUndefined2);

var _omitBy2 = require('lodash/omitBy');

var _omitBy3 = _interopRequireDefault(_omitBy2);

var _pick2 = require('lodash/pick');

var _pick3 = _interopRequireDefault(_pick2);

var _identity2 = require('lodash/identity');

var _identity3 = _interopRequireDefault(_identity2);

var _values2 = require('lodash/values');

var _values3 = _interopRequireDefault(_values2);

var _mapValues2 = require('lodash/mapValues');

var _mapValues3 = _interopRequireDefault(_mapValues2);

var _pickBy2 = require('lodash/pickBy');

var _pickBy3 = _interopRequireDefault(_pickBy2);

var _camelCase2 = require('lodash/camelCase');

var _camelCase3 = _interopRequireDefault(_camelCase2);

var _keys2 = require('lodash/keys');

var _keys3 = _interopRequireDefault(_keys2);

var _map2 = require('lodash/map');

var _map3 = _interopRequireDefault(_map2);

exports.default = parseArgv;

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BASIC_GROUP = 'Basic options:';
var OUTPUT_GROUP = 'Output options:';
var ADVANCED_GROUP = 'Advanced options:';

var options = {
  'async-only': {
    alias: 'A',
    type: 'boolean',
    describe: 'force all tests to take a callback (async) or return a promise',
    group: ADVANCED_GROUP
  },
  colors: {
    alias: 'c',
    type: 'boolean',
    default: undefined,
    describe: 'force enabling of colors',
    group: OUTPUT_GROUP
  },
  quiet: {
    alias: 'q',
    type: 'boolean',
    default: undefined,
    describe: 'does not show informational messages',
    group: OUTPUT_GROUP
  },
  interactive: {
    type: 'boolean',
    default: !!process.stdout.isTTY,
    describe: 'force interactive mode (default enabled in terminal)',
    group: OUTPUT_GROUP
  },
  growl: {
    alias: 'G',
    type: 'boolean',
    describe: 'enable growl notification support',
    group: OUTPUT_GROUP
  },
  recursive: {
    type: 'boolean',
    describe: 'include sub directories',
    group: ADVANCED_GROUP
  },
  reporter: {
    alias: 'R',
    type: 'string',
    describe: 'specify the reporter to use',
    group: OUTPUT_GROUP,
    default: 'spec',
    requiresArg: true
  },
  'reporter-options': {
    alias: 'O',
    type: 'string',
    describe: 'reporter-specific options, --reporter-options <k=v,k2=v2,...>',
    group: OUTPUT_GROUP,
    requiresArg: true
  },
  bail: {
    alias: 'b',
    type: 'boolean',
    describe: 'bail after first test failure',
    group: ADVANCED_GROUP,
    default: false
  },
  glob: {
    type: 'string',
    describe: 'only test files matching <pattern> (only valid for directory entry)',
    group: ADVANCED_GROUP,
    requiresArg: true
  },
  grep: {
    alias: 'g',
    type: 'string',
    describe: 'only run tests matching <pattern>',
    group: ADVANCED_GROUP,
    requiresArg: true
  },
  fgrep: {
    alias: 'f',
    type: 'string',
    describe: 'only run tests containing <string>',
    group: ADVANCED_GROUP,
    requiresArg: true
  },
  invert: {
    alias: 'i',
    type: 'boolean',
    describe: 'inverts --grep and --fgrep matches',
    group: ADVANCED_GROUP,
    default: false
  },
  require: {
    alias: 'r',
    type: 'string',
    describe: 'require the given module',
    group: ADVANCED_GROUP,
    requiresArg: true,
    multiple: true
  },
  include: {
    type: 'string',
    describe: 'include the given module into test bundle',
    group: ADVANCED_GROUP,
    requiresArg: true,
    multiple: true
  },
  slow: {
    alias: 's',
    describe: '"slow" test threshold in milliseconds',
    group: ADVANCED_GROUP,
    default: 75,
    defaultDescription: '75 ms',
    requiresArg: true
  },
  timeout: {
    alias: 't',
    describe: 'set test-case timeout in milliseconds',
    group: ADVANCED_GROUP,
    default: 2000,
    defaultDescription: '2000 ms',
    requiresArg: true
  },
  ui: {
    alias: 'u',
    describe: 'specify user-interface (e.g. "bdd", "tdd", "exports", "qunit")',
    group: BASIC_GROUP,
    default: 'bdd',
    requiresArg: true
  },
  watch: {
    alias: 'w',
    type: 'boolean',
    describe: 'watch files for changes',
    group: BASIC_GROUP,
    default: false
  },
  'check-leaks': {
    type: 'boolean',
    describe: 'check for global variable leaks',
    group: ADVANCED_GROUP,
    default: false
  },
  'full-trace': {
    type: 'boolean',
    describe: 'display the full stack trace',
    group: ADVANCED_GROUP,
    default: false
  },
  'inline-diffs': {
    type: 'boolean',
    describe: 'display actual/expected differences inline within each string',
    group: ADVANCED_GROUP,
    default: false
  },
  exit: {
    type: 'boolean',
    describe: 'require a clean shutdown of the event loop: mocha will not call process.exit',
    group: ADVANCED_GROUP,
    default: false
  },
  retries: {
    describe: 'set numbers of time to retry a failed test case',
    group: BASIC_GROUP,
    requiresArg: true
  },
  delay: {
    type: 'boolean',
    describe: 'wait for async suite definition',
    group: ADVANCED_GROUP,
    default: false
  },
  mode: {
    type: 'string',
    choices: ['development', 'production'],
    describe: 'webpack mode to use',
    group: BASIC_GROUP,
    requiresArg: true
  },
  'webpack-config': {
    type: 'string',
    describe: 'path to webpack-config file',
    group: BASIC_GROUP,
    requiresArg: true,
    default: 'webpack.config.js'
  },
  'webpack-env': {
    describe: 'environment passed to the webpack-config, when it is a function',
    group: BASIC_GROUP
  },
  opts: {
    type: 'string',
    describe: 'path to webpack-mocha options file',
    group: BASIC_GROUP,
    requiresArg: true
  }
};

var paramList = function paramList(opts) {
  return (0, _map3.default)((0, _keys3.default)(opts), _camelCase3.default);
};
var parameters = paramList(options); // camel case parameters
var parametersWithMultipleArgs = paramList((0, _pickBy3.default)((0, _mapValues3.default)(options, function (v) {
  return !!v.requiresArg && v.multiple === true;
}))); // eslint-disable-line max-len
var groupedAliases = (0, _values3.default)((0, _mapValues3.default)(options, function (value, key) {
  return [(0, _camelCase3.default)(key), key, value.alias].filter(_identity3.default);
})); // eslint-disable-line max-len

function parseArgv(argv) {
  var ignoreDefaults = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var parsedArgs = (0, _yargs2.default)().help('help').alias('help', 'h').version().options(options).strict().parse(argv);

  var files = parsedArgs._;

  if (!files.length) {
    files = ['./test'];
  }

  var parsedOptions = (0, _pick3.default)(parsedArgs, parameters); // pick all parameters as new object
  var validOptions = (0, _omitBy3.default)(parsedOptions, _isUndefined3.default); // remove all undefined values

  (0, _forEach3.default)(parametersWithMultipleArgs, function (key) {
    if ((0, _has3.default)(validOptions, key)) {
      var value = validOptions[key];
      if (!Array.isArray(value)) {
        validOptions[key] = [value];
      }
    }
  });

  (0, _forOwn3.default)(validOptions, function (value, key) {
    // validate all non-array options with required arg that it is not duplicated
    // see https://github.com/yargs/yargs/issues/229
    if (parametersWithMultipleArgs.indexOf(key) === -1 && (0, _isArray3.default)(value)) {
      var arg = (0, _kebabCase3.default)(key);
      var provided = value.map(function (v) {
        return '--' + arg + ' ' + v;
      }).join(' ');
      var expected = '--' + arg + ' ' + value[0];

      throw new Error('Duplicating arguments for "--' + arg + '" is not allowed. "' + provided + '" was provided, but expected "' + expected + '"'); // eslint-disable-line max-len
    }
  });

  validOptions.files = files;

  var reporterOptions = {};

  if (validOptions.reporterOptions) {
    validOptions.reporterOptions.split(',').forEach(function (opt) {
      var L = opt.split('=');
      if (L.length > 2 || L.length === 0) {
        throw new Error('invalid reporter option ' + opt);
      } else if (L.length === 2) {
        reporterOptions[L[0]] = L[1]; // eslint-disable-line prefer-destructuring
      } else {
        reporterOptions[L[0]] = true;
      }
    });
  }

  validOptions.reporterOptions = reporterOptions;
  validOptions.require = validOptions.require || [];
  validOptions.include = validOptions.include || [];

  if (ignoreDefaults) {
    var userOptions = (0, _yargs2.default)(argv).argv;
    var providedKeys = (0, _keys3.default)(userOptions);
    var usedAliases = (0, _flatten3.default)((0, _filter3.default)(groupedAliases, function (aliases) {
      return (0, _some3.default)(aliases, function (alias) {
        return providedKeys.indexOf(alias) !== -1;
      });
    }));

    if (parsedArgs._.length) {
      usedAliases.push('files');
    }

    return (0, _pick3.default)(validOptions, usedAliases);
  }

  return validOptions;
}