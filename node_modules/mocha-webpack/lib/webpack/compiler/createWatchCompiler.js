'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

exports.default = createWatchCompiler;

var _Watching = require('webpack/lib/Watching');

var _Watching2 = _interopRequireDefault(_Watching);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var noop = function noop() {
  return undefined;
};
function createWatchCompiler(compiler, watchOptions) {
  // this ugly statement to create a watch compiler is unfortunately necessary,
  // as webpack clears the file timestamps with the official compiler.watch()
  var createWatcher = function createWatcher() {
    return new _Watching2.default(compiler, watchOptions, noop);
  };
  var watchCompiler = null;

  return {
    watch: function watch() {
      if (watchCompiler === null) {
        watchCompiler = createWatcher();
      } else {
        var times = compiler.watchFileSystem.watcher.getTimes();
        // check if we can store some collected file timestamps
        // the non-empty check is necessary as the times will be reseted after .close()
        // and we don't want to reset already existing timestamps
        if ((0, _keys2.default)(times).length > 0) {
          var timesMap = new _map2.default((0, _keys2.default)(times).map(function (key) {
            return [key, times[key]];
          }));
          // set already collected file timestamps to cache compiled files
          // webpack will do this only after a file change, but that will not happen when we add or delete files
          // and this means that we have to test the whole test suite again ...
          compiler.fileTimestamps = timesMap; // eslint-disable-line no-param-reassign
          compiler.contextTimestamps = timesMap; // eslint-disable-line no-param-reassign
        }

        watchCompiler.close(function () {
          watchCompiler = createWatcher();
        });
      }
    },
    pause: function pause() {
      if (watchCompiler !== null && watchCompiler.watcher) {
        watchCompiler.watcher.pause();
      }
    },
    getWatchOptions: function getWatchOptions() {
      // 200 is the default value by webpack
      return (0, _get3.default)(watchCompiler, 'watchOptions', { aggregateTimeout: 200 });
    }
  };
}