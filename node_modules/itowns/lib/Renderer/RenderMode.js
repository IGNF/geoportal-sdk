"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var MODES = {
  FINAL: 0,
  // final color
  DEPTH: 1,
  // depth buffer
  ID: 2 // id object

};

function push(object3d, mode) {
  var _mode = object3d.mode !== undefined ? object3d.mode : MODES.FINAL;

  if (_mode == mode) {
    return function () {};
  }

  var setMode = function (m) {
    return function (node) {
      var material = node.material;

      if (material) {
        material.mode = m;
      }
    };
  };

  object3d.traverse(setMode(mode));
  return function () {
    object3d.traverse(setMode(_mode));
  };
} // Rendering mode
// According to the rendering mode, the material's object switches
// the mode property of the materials


var _default = {
  MODES: MODES,
  push: push
};
exports["default"] = _default;