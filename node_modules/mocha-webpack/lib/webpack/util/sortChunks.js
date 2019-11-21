'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

exports.default = sortChunks;

var _toposort = require('toposort');

var _toposort2 = _interopRequireDefault(_toposort);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// see https://github.com/jantimon/html-webpack-plugin/blob/8131d8bb1dc9b185b3c1709264a3baf32ef799bc/lib/chunksorter.js

function sortChunks(chunks, chunkGroups) {
  // We build a map (chunk-id -> chunk) for faster access during graph building.
  var nodeMap = {};

  chunks.forEach(function (chunk) {
    nodeMap[chunk.id] = chunk;
  });

  // Add an edge for each parent (parent -> child)
  var edges = chunkGroups.reduce(function (result, chunkGroup) {
    return result.concat((0, _from2.default)(chunkGroup.parentsIterable, function (parentGroup) {
      return [parentGroup, chunkGroup];
    }));
  }, []);
  var sortedGroups = _toposort2.default.array(chunkGroups, edges);
  // flatten chunkGroup into chunks
  var sortedChunks = sortedGroups.reduce(function (result, chunkGroup) {
    return result.concat(chunkGroup.chunks);
  }, []).map(function (chunk) {
    return (// use the chunk from the list passed in, since it may be a filtered list
      nodeMap[chunk.id]
    );
  }).filter(function (chunk, index, self) {
    // make sure exists (ie excluded chunks not in nodeMap)
    var exists = !!chunk;
    // make sure we have a unique list
    var unique = self.indexOf(chunk) === index;
    return exists && unique;
  });
  return sortedChunks;
}