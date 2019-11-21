'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _values = require('babel-runtime/core-js/object/values');

var _values2 = _interopRequireDefault(_values);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.default = getAffectedModuleIds;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isBuilt = function isBuilt(module) {
  return module.built;
};

var getId = function getId(module) {
  return module.id;
};

var affectedModules = function affectedModules(map, usageMap, affected, moduleId) {
  if (typeof affected[moduleId] !== 'undefined') {
    // module was already inspected, stop here otherwise we get into endless recursion
    return;
  }
  // module is identified as affected by this function call
  var module = map[moduleId];
  affected[module.id] = module; // eslint-disable-line no-param-reassign

  // next we need to mark all usages aka parents also as affected
  var usages = usageMap[module.id];
  if (typeof usages !== 'undefined') {
    var ids = (0, _keys2.default)(usages);
    ids.forEach(function (id) {
      return affectedModules(map, usageMap, affected, id);
    });
  }
};

/**
 * Builds a map where all modules are indexed by it's id
 * {
 *   [moduleId]: Module
 * }
 */
var buildModuleMap = function buildModuleMap(modules) {
  var moduleMap = modules.reduce(function (memo, module) {
    return (0, _extends4.default)({}, memo, (0, _defineProperty3.default)({}, module.id, module));
  }, {});
  return moduleMap;
};

/**
 * Builds a map with all modules that are used in other modules (child -> parent relation)
 *
 * {
 *  [childModuleId]: {
 *    [parentModuleId]: ParentModule
 *  }
 * }
 *
 * @param modules Array<number>
 * @return ModuleUsageMap
 */
var buildModuleUsageMap = function buildModuleUsageMap(chunks, modules) {
  // build a map of all modules with their parent
  // {
  //    [childModuleId]: {
  //      [parentModuleId]: ParentModule
  //    }
  // }
  var moduleUsageMap = modules.reduce(function (memo, module) {
    module.dependencies.forEach(function (dependency) {
      var dependentModule = dependency.module;

      if (!dependentModule) {
        return;
      }
      if (typeof memo[dependentModule.id] === 'undefined') {
        memo[dependentModule.id] = {}; // eslint-disable-line no-param-reassign
      }
      memo[dependentModule.id][module.id] = module; // eslint-disable-line no-param-reassign
    });
    return memo;
  }, {});

  // build a map of all chunks with their modules
  // {
  //    [chunkId]: {
  //      [moduleId]: Module
  //    }
  // }
  var chunkModuleMap = chunks.reduce(function (memo, chunk) {
    // build chunk map first to get also empty chunks (without modules)
    memo[chunk.id] = {}; // eslint-disable-line no-param-reassign
    return memo;
  }, {});
  modules.reduce(function (memo, module) {
    module.getChunks().forEach(function (chunk) {
      memo[chunk.id][module.id] = module; // eslint-disable-line no-param-reassign
    });
    return memo;
  }, chunkModuleMap);

  // detect modules with code split points (e.g. require.ensure) and enhance moduleUsageMap with that information
  modules.forEach(function (module) {
    module.blocks
    // chunkGroup can be invalid in in some cases
    .filter(function (block) {
      return block.chunkGroup != null;
    }).forEach(function (block) {
      // loop through all generated chunks by this module
      // $FlowFixMe - flow thinks that block.chunkGroup could be null
      block.chunkGroup.chunks.map(getId).forEach(function (chunkId) {
        // and mark all modules of this chunk as a direct dependency of the original module
        (0, _values2.default)(chunkModuleMap[chunkId]).forEach(function (childModule) {
          if (typeof moduleUsageMap[childModule.id] === 'undefined') {
            moduleUsageMap[childModule.id] = {};
          }
          moduleUsageMap[childModule.id][module.id] = module;
        });
      });
    });
  });

  return moduleUsageMap;
};

/**
 * Builds a list with ids of all affected modules in the following way:
 *  - affected directly by a file change
 *  - affected indirectly by a change of it's dependencies and so on
 *
 * @param chunks Array<Chunk>
 * @param modules Array<Module>
 * @return {Array.<number>}
 */
function getAffectedModuleIds(chunks, modules) {
  var moduleMap = buildModuleMap(modules);
  var moduleUsageMap = buildModuleUsageMap(chunks, modules);

  var builtModules = modules.filter(isBuilt);
  var affectedMap = {};
  builtModules.forEach(function (module) {
    return affectedModules(moduleMap, moduleUsageMap, affectedMap, module.id);
  });

  return (0, _values2.default)(affectedMap).map(getId);
}