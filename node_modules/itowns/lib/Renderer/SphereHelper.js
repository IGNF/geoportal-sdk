"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var THREE = _interopRequireWildcard(require("three"));

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function SphereHelper(radius) {
  THREE.Mesh.call(this);
  this.geometry = new THREE.SphereGeometry(radius, 8, 8);
  var color = new THREE.Color(Math.random(), Math.random(), Math.random());
  this.material = new THREE.MeshBasicMaterial({
    color: color.getHex(),
    wireframe: true
  });
}

SphereHelper.prototype = Object.create(THREE.Mesh.prototype);
SphereHelper.prototype.constructor = SphereHelper;

SphereHelper.prototype.update = function (radius) {
  this.geometry.dispose();
  this.geometry = new THREE.SphereGeometry(radius, 8, 8);
};

var _default = SphereHelper;
exports["default"] = _default;