'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _create = require('babel-runtime/core-js/object/create');

var _create2 = _interopRequireDefault(_create);

var _three = require('three');

var THREE = _interopRequireWildcard(_three);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function SphereHelper(radius) {
    THREE.Mesh.call(this);

    this.geometry = new THREE.SphereGeometry(radius, 8, 8);
    var color = new THREE.Color(Math.random(), Math.random(), Math.random());
    this.material = new THREE.MeshBasicMaterial({
        color: color.getHex(),
        wireframe: true
    });
} /*
   * To change this license header, choose License Headers in Project Properties.
   * To change this template file, choose Tools | Templates
   * and open the template in the editor.
   */

SphereHelper.prototype = (0, _create2.default)(THREE.Mesh.prototype);
SphereHelper.prototype.constructor = SphereHelper;

SphereHelper.prototype.update = function (radius) {
    this.geometry.dispose();
    this.geometry = new THREE.SphereGeometry(radius, 8, 8);
};

exports.default = SphereHelper;