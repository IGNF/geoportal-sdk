'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _has2 = require('lodash/has');

var _has3 = _interopRequireDefault(_has2);

var _debounce2 = require('lodash/debounce');

var _debounce3 = _interopRequireDefault(_debounce2);

var _once2 = require('lodash/once');

var _once3 = _interopRequireDefault(_once2);

require('nodent-runtime');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _chokidar = require('chokidar');

var _chokidar2 = _interopRequireDefault(_chokidar);

var _glob = require('../util/glob');

var _paths = require('../util/paths');

var _createCompiler = require('../webpack/compiler/createCompiler');

var _createCompiler2 = _interopRequireDefault(_createCompiler);

var _createWatchCompiler = require('../webpack/compiler/createWatchCompiler');

var _createWatchCompiler2 = _interopRequireDefault(_createWatchCompiler);

var _registerInMemoryCompiler = require('../webpack/compiler/registerInMemoryCompiler');

var _registerInMemoryCompiler2 = _interopRequireDefault(_registerInMemoryCompiler);

var _registerReadyCallback = require('../webpack/compiler/registerReadyCallback');

var _registerReadyCallback2 = _interopRequireDefault(_registerReadyCallback);

var _entryLoader = require('../webpack/loader/entryLoader');

var _configureMocha = require('./configureMocha');

var _configureMocha2 = _interopRequireDefault(_configureMocha);

var _getBuildStats = require('../webpack/util/getBuildStats');

var _getBuildStats2 = _interopRequireDefault(_getBuildStats);

var _buildProgressPlugin = require('../webpack/plugin/buildProgressPlugin');

var _buildProgressPlugin2 = _interopRequireDefault(_buildProgressPlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// $FlowFixMe
var entryPath = _path2.default.resolve(__dirname, '../entry.js');

var entryLoaderPath = _path2.default.resolve(__dirname, '../webpack/loader/entryLoader.js');
var includeLoaderPath = _path2.default.resolve(__dirname, '../webpack/loader/includeFilesLoader.js');
var noop = function noop() {
  return undefined;
};

var TestRunner = function (_EventEmitter) {
  (0, _inherits3.default)(TestRunner, _EventEmitter);

  function TestRunner(entries, includes, options) {
    (0, _classCallCheck3.default)(this, TestRunner);

    var _this = (0, _possibleConstructorReturn3.default)(this, (TestRunner.__proto__ || (0, _getPrototypeOf2.default)(TestRunner)).call(this));

    _this.entries = entries;
    _this.includes = includes;

    _this.options = options;
    return _this;
  }

  (0, _createClass3.default)(TestRunner, [{
    key: 'prepareMocha',
    value: function prepareMocha(webpackConfig, stats) {
      var mocha = (0, _configureMocha2.default)(this.options);
      var outputPath = webpackConfig.output.path;
      var buildStats = (0, _getBuildStats2.default)(stats, outputPath);

      global.__webpackManifest__ = buildStats.affectedModules; // eslint-disable-line

      // clear up require cache for changed files to make sure that we get the latest changes
      buildStats.affectedFiles.forEach(function (filePath) {
        delete require.cache[filePath];
      });
      // pass webpack's entry files to mocha
      mocha.files = buildStats.entries;
      return mocha;
    }
  }, {
    key: 'run',
    value: function run() {
      return new Promise(function ($return, $error) {
        var $Try_1_Finally = function ($Try_1_Exit) {
          return function ($Try_1_Value) {
            // clean up single run
            dispose();
            return $Try_1_Exit && $Try_1_Exit.call(this, $Try_1_Value);
          }.$asyncbind(this, $error);
        }.$asyncbind(this);

        var _this2, _ref, config, failures, compiler, dispose;

        _this2 = this;
        return this.createWebpackConfig().then(function ($await_6) {
          _ref = $await_6, config = _ref.webpackConfig;

          failures = 0;
          compiler = (0, _createCompiler2.default)(config);

          compiler.hooks.run.tapAsync('mocha-webpack', function (c, cb) {
            _this2.emit('webpack:start');
            // $FlowFixMe
            cb();
          });

          dispose = (0, _registerInMemoryCompiler2.default)(compiler);
          var $Try_1_Post = function () {
            return $return(failures);
          }.$asyncbind(this, $error);var $Try_1_Catch = function ($exception_2) {
            throw $exception_2;
          }.$asyncbind(this, $Try_1_Finally($error));try {
            return new _promise2.default(function (resolve, reject) {
              (0, _registerReadyCallback2.default)(compiler, function (err, webpackStats) {
                _this2.emit('webpack:ready', err, webpackStats);
                if (err || !webpackStats) {
                  reject();
                  return;
                }
                try {
                  var mocha = _this2.prepareMocha(config, webpackStats);
                  _this2.emit('mocha:begin');
                  try {
                    mocha.run(function (fails) {
                      _this2.emit('mocha:finished', fails);
                      resolve(fails);
                    });
                  } catch (e) {
                    _this2.emit('exception', e);
                    resolve(1);
                  }
                } catch (e) {
                  reject(e);
                }
              });
              compiler.run(noop);
            }).then(function ($await_7) {
              failures = $await_7;
              return $Try_1_Finally($Try_1_Post)();
            }.$asyncbind(this, $Try_1_Catch), $Try_1_Catch);
          } catch ($exception_2) {
            $Try_1_Catch($exception_2)
          }
        }.$asyncbind(this, $error), $error);
      }.$asyncbind(this));
    }
  }, {
    key: 'watch',
    value: function watch() {
      return new Promise(function ($return, $error) {
        var _this3, _ref2, config, entryConfig, mochaRunner, stats, compilationScheduler, uncaughtExceptionListener, runMocha, compiler, watchCompiler, watchOptions, pollingInterval, watcher, restartWebpackBuild, fileDeletedOrAdded;

        _this3 = this;
        return this.createWebpackConfig().then(function ($await_8) {
          _ref2 = $await_8, config = _ref2.webpackConfig, entryConfig = _ref2.entryConfig;


          mochaRunner = null;
          stats = null;
          compilationScheduler = null;

          uncaughtExceptionListener = function uncaughtExceptionListener(err) {
            // mocha catches uncaughtException only while tests are running,
            // that's why we register a custom error handler to keep this process alive
            _this3.emit('uncaughtException', err);
          };

          runMocha = function runMocha() {
            try {
              // $FlowFixMe
              var mocha = _this3.prepareMocha(config, stats);
              // unregister our custom exception handler (see declaration)
              process.removeListener('uncaughtException', uncaughtExceptionListener);

              // run tests
              _this3.emit('mocha:begin');
              mochaRunner = mocha.run((0, _once3.default)(function (failures) {
                // register custom exception handler to catch all errors that may happen after mocha think tests are done
                process.on('uncaughtException', uncaughtExceptionListener);

                // need to wait until next tick, otherwise mochaRunner = null doesn't work..
                process.nextTick(function () {
                  mochaRunner = null;
                  if (compilationScheduler != null) {
                    _this3.emit('mocha:aborted');
                    compilationScheduler();
                    compilationScheduler = null;
                  } else {
                    _this3.emit('mocha:finished', failures);
                  }
                });
              }));
            } catch (err) {
              _this3.emit('exception', err);
            }
          };

          compiler = (0, _createCompiler2.default)(config);
          (0, _registerInMemoryCompiler2.default)(compiler);
          // register webpack start callback
          compiler.hooks.watchRun.tapAsync('mocha-webpack', function (c, cb) {
            // check if mocha tests are still running, abort them and start compiling
            if (mochaRunner) {
              compilationScheduler = function compilationScheduler() {
                _this3.emit('webpack:start');
                // $FlowFixMe
                cb();
              };

              mochaRunner.abort();
              // make sure that the current running test will be aborted when timeouts are disabled for async tests
              if (mochaRunner.currentRunnable) {
                var runnable = mochaRunner.currentRunnable;
                runnable.retries(0);
                runnable.enableTimeouts(true);
                runnable.timeout(1);
                runnable.resetTimeout(1);
              }
            } else {
              _this3.emit('webpack:start');
              // $FlowFixMe
              cb();
            }
          });
          // register webpack ready callback
          (0, _registerReadyCallback2.default)(compiler, function (err, webpackStats) {
            _this3.emit('webpack:ready', err, webpackStats);
            if (err) {
              // wait for fixed tests
              return;
            }
            stats = webpackStats;
            runMocha();
          });

          watchCompiler = (0, _createWatchCompiler2.default)(compiler, config.watchOptions);
          // start webpack build immediately
          watchCompiler.watch();

          // webpack enhances watch options, that's why we use them instead
          watchOptions = watchCompiler.getWatchOptions();
          pollingInterval = typeof watchOptions.poll === 'number' ? watchOptions.poll : undefined;

          watcher = _chokidar2.default.watch(this.entries, {
            cwd: this.options.cwd,
            // see https://github.com/webpack/watchpack/blob/e5305b53ac3cf2a70d49a772912b115fa77665c2/lib/DirectoryWatcher.js
            ignoreInitial: true,
            persistent: true,
            followSymlinks: false,
            ignorePermissionErrors: true,
            ignored: watchOptions.ignored,
            usePolling: watchOptions.poll ? true : undefined,
            interval: pollingInterval,
            binaryInterval: pollingInterval
          });

          restartWebpackBuild = (0, _debounce3.default)(function () {
            return watchCompiler.watch();
          }, watchOptions.aggregateTimeout);
          fileDeletedOrAdded = function fileDeletedOrAdded(file, deleted) {
            var filePath = _path2.default.join(_this3.options.cwd, file);
            if (deleted) {
              _this3.emit('entry:removed', file);
              entryConfig.removeFile(filePath);
            } else {
              _this3.emit('entry:added', file);
              entryConfig.addFile(filePath);
            }

            // pause webpack watch immediately before webpack will be notified
            watchCompiler.pause();
            // call debounced webpack runner to rebuild files
            restartWebpackBuild();
          };

          // add listener for entry creation & deletion events
          watcher.on('add', function (file) {
            return fileDeletedOrAdded(file, false);
          });
          watcher.on('unlink', function (file) {
            return fileDeletedOrAdded(file, true);
          });

          return $return(new _promise2.default(function () {
            return undefined;
          })); // never ending story
        }.$asyncbind(this, $error), $error);
      }.$asyncbind(this));
    }
  }, {
    key: 'createWebpackConfig',
    value: function createWebpackConfig() {
      return new Promise(function ($return, $error) {
        var _this4, webpackConfig, files, entryConfig, tmpPath, withCustomPath, outputPath, publicPath, plugins, userLoaders, config;

        _this4 = this;
        webpackConfig = this.options.webpackConfig;
        return (0, _glob.glob)(this.entries, {
          cwd: this.options.cwd,
          absolute: false // this option isn't covered by the version range in 'globby' for 'glob' (default value is false)
        }).then(function ($await_9) {

          files = $await_9;

          entryConfig = new _entryLoader.EntryConfig();
          files.map(function (f) {
            return (0, _paths.ensureAbsolutePath)(f, _this4.options.cwd);
          }).forEach(function (f) {
            return entryConfig.addFile(f);
          });

          tmpPath = _path2.default.join(this.options.cwd, '.tmp', 'mocha-webpack', Date.now().toString());
          withCustomPath = (0, _has3.default)(webpackConfig, 'output.path');
          outputPath = _path2.default.normalize((0, _get3.default)(webpackConfig, 'output.path', tmpPath));
          publicPath = withCustomPath ? (0, _get3.default)(webpackConfig, 'output.publicPath', undefined) : outputPath + _path2.default.sep;

          plugins = [];

          if (this.options.interactive) {
            plugins.push((0, _buildProgressPlugin2.default)());
          }

          userLoaders = (0, _get3.default)(webpackConfig, 'module.rules', []);
          userLoaders.unshift({
            test: entryPath,
            use: [{
              loader: includeLoaderPath,
              options: {
                include: this.includes
              }
            }, {
              loader: entryLoaderPath,
              options: {
                entryConfig: entryConfig
              }
            }]
          });

          config = (0, _extends3.default)({}, webpackConfig, {
            entry: entryPath,
            module: (0, _extends3.default)({}, webpackConfig.module, {
              rules: userLoaders
            }),
            output: (0, _extends3.default)({}, webpackConfig.output, {
              path: outputPath,
              publicPath: publicPath
            }),
            plugins: [].concat((0, _toConsumableArray3.default)(webpackConfig.plugins || []), plugins)
          });
          return $return({
            webpackConfig: config,
            entryConfig: entryConfig
          });
        }.$asyncbind(this, $error), $error);
      }.$asyncbind(this));
    }
  }]);
  return TestRunner;
}(_events2.default);

exports.default = TestRunner;