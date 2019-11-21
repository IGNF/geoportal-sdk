'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getBuildStats;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _sortChunks = require('./sortChunks');

var _sortChunks2 = _interopRequireDefault(_sortChunks);

var _getAffectedModuleIds = require('./getAffectedModuleIds');

var _getAffectedModuleIds2 = _interopRequireDefault(_getAffectedModuleIds);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getBuildStats(stats, outputPath) {
  var _stats$compilation = stats.compilation,
      chunks = _stats$compilation.chunks,
      chunkGroups = _stats$compilation.chunkGroups,
      modules = _stats$compilation.modules;


  var sortedChunks = (0, _sortChunks2.default)(chunks, chunkGroups);
  var affectedModules = (0, _getAffectedModuleIds2.default)(chunks, modules);

  var entries = [];
  var js = [];
  var pathHelper = function pathHelper(f) {
    return _path2.default.join(outputPath, f);
  };

  sortedChunks.forEach(function (chunk) {
    var files = Array.isArray(chunk.files) ? chunk.files : [chunk.files];

    if (chunk.isOnlyInitial()) {
      // only entry files
      var entry = files[0];
      entries.push(entry);
    }

    if (chunk.getModules().some(function (module) {
      return affectedModules.indexOf(module.id) !== -1;
    })) {
      files.forEach(function (file) {
        if (/\.js$/.test(file)) {
          js.push(file);
        }
      });
    }
  });

  var buildStats = {
    affectedModules: affectedModules,
    affectedFiles: js.map(pathHelper),
    entries: entries.map(pathHelper)
  };

  return buildStats;
}