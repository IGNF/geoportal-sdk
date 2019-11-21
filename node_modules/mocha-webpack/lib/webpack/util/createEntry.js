'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createEntry;
function createEntry(filePaths) {
  return ['// runtime helper', 'function inManifest(id) { return global.__webpackManifest__.indexOf(id) >= 0;}', 'function run(id) { __webpack_require__(id);}', '', '// modules to execute goes here', 'var ids = [', filePaths.map(function (path) {
    return 'require.resolve(' + path + ')';
  }).join(','), '];', '', 'ids.filter(inManifest).forEach(run)'].join('\n');
}