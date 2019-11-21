'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

require('nodent-runtime');

var _TestRunner = require('./runner/TestRunner');

var _TestRunner2 = _interopRequireDefault(_TestRunner);

var _testRunnerReporter = require('./runner/testRunnerReporter');

var _testRunnerReporter2 = _interopRequireDefault(_testRunnerReporter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MochaWebpack = function () {
  function MochaWebpack() {
    (0, _classCallCheck3.default)(this, MochaWebpack);
    this.entries = [];
    this.includes = [];
    this.options = {
      cwd: process.cwd(),
      webpackConfig: {},
      bail: false,
      reporter: 'spec',
      reporterOptions: {},
      ui: 'bdd',
      invert: false,
      ignoreLeaks: true,
      fullStackTrace: false,
      useInlineDiffs: false,
      timeout: 2000,
      slow: 75,
      asyncOnly: false,
      delay: false,
      interactive: !!process.stdout.isTTY,
      quiet: false
    };
  }
  /**
   * Files to run test against
   *
   * @private
   */

  /**
   * Files to include into the bundle
   *
   * @private
   */

  /**
   * Options
   *
   * @private
   */


  (0, _createClass3.default)(MochaWebpack, [{
    key: 'addEntry',


    /**
     * Add file run test against
     *
     * @public
     * @param {string} file file or glob
     * @return {MochaWebpack}
     */
    value: function addEntry(file) {
      this.entries = [].concat((0, _toConsumableArray3.default)(this.entries), [file]);
      return this;
    }

    /**
     * Add file to include into the test bundle
     *
     * @public
     * @param {string} file absolute path to module
     * @return {MochaWebpack}
     */

  }, {
    key: 'addInclude',
    value: function addInclude(file) {
      this.includes = [].concat((0, _toConsumableArray3.default)(this.includes), [file]);
      return this;
    }

    /**
     * Sets the current working directory
     *
     * @public
     * @param {string} cwd absolute working directory path
     * @return {MochaWebpack}
     */

  }, {
    key: 'cwd',
    value: function (_cwd) {
      function cwd(_x) {
        return _cwd.apply(this, arguments);
      }

      cwd.toString = function () {
        return _cwd.toString();
      };

      return cwd;
    }(function (cwd) {
      this.options = (0, _extends3.default)({}, this.options, {
        cwd: cwd
      });
      return this;
    })

    /**
     * Sets the webpack config
     *
     * @public
     * @param {Object} config webpack config
     * @return {MochaWebpack}
     */

  }, {
    key: 'webpackConfig',
    value: function webpackConfig() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.options = (0, _extends3.default)({}, this.options, {
        webpackConfig: config
      });
      return this;
    }

    /**
     * Enable or disable bailing on the first failure.
     *
     * @public
     * @param {boolean} [bail]
     * @return {MochaWebpack}
     */

  }, {
    key: 'bail',
    value: function (_bail) {
      function bail() {
        return _bail.apply(this, arguments);
      }

      bail.toString = function () {
        return _bail.toString();
      };

      return bail;
    }(function () {
      var bail = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      this.options = (0, _extends3.default)({}, this.options, {
        bail: bail
      });
      return this;
    })

    /**
     * Set reporter to `reporter`, defaults to "spec".
     *
     * @param {string|Function} reporter name or constructor
     * @param {Object} reporterOptions optional options
     * @return {MochaWebpack}
     */

  }, {
    key: 'reporter',
    value: function (_reporter) {
      function reporter(_x2, _x3) {
        return _reporter.apply(this, arguments);
      }

      reporter.toString = function () {
        return _reporter.toString();
      };

      return reporter;
    }(function (reporter, reporterOptions) {
      this.options = (0, _extends3.default)({}, this.options, {
        reporter: reporter,
        reporterOptions: reporterOptions
      });
      return this;
    })

    /**
     * Set test UI, defaults to "bdd".
     *
     * @public
     * @param {string} ui bdd/tdd
     * @return {MochaWebpack}
     */

  }, {
    key: 'ui',
    value: function (_ui) {
      function ui(_x4) {
        return _ui.apply(this, arguments);
      }

      ui.toString = function () {
        return _ui.toString();
      };

      return ui;
    }(function (ui) {
      this.options = (0, _extends3.default)({}, this.options, {
        ui: ui
      });
      return this;
    })

    /**
     * Only run tests containing <string>
     *
     * @public
     * @param {string} str
     * @return {MochaWebpack}
     */

  }, {
    key: 'fgrep',
    value: function fgrep(str) {
      this.options = (0, _extends3.default)({}, this.options, {
        fgrep: str
      });
      return this;
    }

    /**
     * Only run tests matching <pattern>
     *
     * @public
     * @param {string|RegExp} pattern
     * @return {MochaWebpack}
     */

  }, {
    key: 'grep',
    value: function grep(pattern) {
      this.options = (0, _extends3.default)({}, this.options, {
        grep: pattern
      });
      return this;
    }

    /**
     * Invert `.grep()` matches.
     *
     * @public
     * @return {MochaWebpack}
     */

  }, {
    key: 'invert',
    value: function invert() {
      this.options = (0, _extends3.default)({}, this.options, {
        invert: true
      });
      return this;
    }

    /**
     * Ignore global leaks.
     *
     * @public
     * @param {boolean} ignore
     * @return {MochaWebpack}
     */

  }, {
    key: 'ignoreLeaks',
    value: function ignoreLeaks(ignore) {
      this.options = (0, _extends3.default)({}, this.options, {
        ignoreLeaks: ignore
      });
      return this;
    }

    /**
     * Display long stack-trace on failing
     *
     * @public
     * @return {MochaWebpack}
     */

  }, {
    key: 'fullStackTrace',
    value: function fullStackTrace() {
      this.options = (0, _extends3.default)({}, this.options, {
        fullStackTrace: true
      });
      return this;
    }

    /**
     * Emit color output.
     *
     * @public
     * @param {boolean} colors
     * @return {MochaWebpack}
     */

  }, {
    key: 'useColors',
    value: function useColors(colors) {
      this.options = (0, _extends3.default)({}, this.options, {
        colors: colors
      });
      return this;
    }

    /**
     * Quiet informational messages.
     *
     * @public
     * @return {MochaWebpack}
     */

  }, {
    key: 'quiet',
    value: function quiet() {
      this.options = (0, _extends3.default)({}, this.options, {
        quiet: true
      });
      return this;
    }

    /**
     * Use inline diffs rather than +/-.
     *
     * @public
     * @param {boolean} inlineDiffs
     * @return {MochaWebpack}
     */

  }, {
    key: 'useInlineDiffs',
    value: function useInlineDiffs(inlineDiffs) {
      this.options = (0, _extends3.default)({}, this.options, {
        useInlineDiffs: inlineDiffs
      });
      return this;
    }

    /**
     * Set the timeout in milliseconds. Value of 0 disables timeouts
     *
     * @public
     * @param {number} timeout time in ms
     * @return {MochaWebpack}
     */

  }, {
    key: 'timeout',
    value: function (_timeout) {
      function timeout(_x5) {
        return _timeout.apply(this, arguments);
      }

      timeout.toString = function () {
        return _timeout.toString();
      };

      return timeout;
    }(function (timeout) {
      this.options = (0, _extends3.default)({}, this.options, {
        timeout: timeout
      });
      return this;
    })

    /**
     * Set the number of times to retry failed tests.
     *
     * @public
     * @param {number} count retry times
     * @return {MochaWebpack}
     */

  }, {
    key: 'retries',
    value: function retries(count) {
      this.options = (0, _extends3.default)({}, this.options, {
        retries: count
      });
      return this;
    }

    /**
     * Set slowness threshold in milliseconds.
     *
     * @public
     * @param {number} threshold time in ms
     * @return {MochaWebpack}
     */

  }, {
    key: 'slow',
    value: function slow(threshold) {
      this.options = (0, _extends3.default)({}, this.options, {
        slow: threshold
      });
      return this;
    }

    /**
     * Makes all tests async (accepting a callback)
     *
     * @public
     * @return {MochaWebpack}
     */

  }, {
    key: 'asyncOnly',
    value: function asyncOnly() {
      this.options = (0, _extends3.default)({}, this.options, {
        asyncOnly: true
      });
      return this;
    }

    /**
     * Delay root suite execution.
     *
     * @public
     * @return {MochaWebpack}
     */

  }, {
    key: 'delay',
    value: function delay() {
      this.options = (0, _extends3.default)({}, this.options, {
        delay: true
      });
      return this;
    }

    /**
     * Force interactive mode (default enabled in terminal)
     *
     * @public
     * @param {boolean} interactive
     * @return {MochaWebpack}
     */

  }, {
    key: 'interactive',
    value: function (_interactive) {
      function interactive(_x6) {
        return _interactive.apply(this, arguments);
      }

      interactive.toString = function () {
        return _interactive.toString();
      };

      return interactive;
    }(function (interactive) {
      this.options = (0, _extends3.default)({}, this.options, {
        interactive: interactive
      });
      return this;
    })

    /**
     * Enable growl notification support
     *
     * @public
     * @param {boolean} growl
     * @return {MochaWebpack}
     */

  }, {
    key: 'growl',
    value: function growl() {
      this.options = (0, _extends3.default)({}, this.options, {
        growl: true
      });
      return this;
    }

    /**
     * Run tests
     *
     * @public
     * @return {Promise<number>} a Promise that gets resolved with the number of failed tests or rejected with build error
     */

  }, {
    key: 'run',
    value: function run() {
      return new Promise(function ($return, $error) {
        var runner = new _TestRunner2.default(this.entries, this.includes, this.options);
        (0, _testRunnerReporter2.default)({
          eventEmitter: runner,
          interactive: this.options.interactive,
          quiet: this.options.quiet,
          cwd: this.options.cwd
        });
        return $return(runner.run());
      }.$asyncbind(this));
    }

    /**
     * Run tests and rerun them on changes
     * @public
     */

  }, {
    key: 'watch',
    value: function watch() {
      return new Promise(function ($return, $error) {
        var runner;

        runner = new _TestRunner2.default(this.entries, this.includes, this.options);
        (0, _testRunnerReporter2.default)({
          eventEmitter: runner,
          interactive: this.options.interactive,
          quiet: this.options.quiet,
          cwd: this.options.cwd
        });
        return runner.watch().then(function ($await_1) {
          return $return();
        }.$asyncbind(this, $error), $error);
      }.$asyncbind(this));
    }
  }]);
  return MochaWebpack;
}();

exports.default = MochaWebpack;