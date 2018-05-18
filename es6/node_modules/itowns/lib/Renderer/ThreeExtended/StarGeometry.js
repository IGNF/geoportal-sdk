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

function StarGeometry() {
    THREE.Geometry.call(this);

    for (var i = 0; i < 10000; i++) {
        var vertex = new THREE.Vector3();
        vertex.x = THREE.Math.randFloatSpread(20000000000);
        vertex.y = THREE.Math.randFloatSpread(20000000000);
        vertex.z = THREE.Math.randFloatSpread(20000000000);

        this.vertices.push(vertex);
    }
} /*
   * To change this license header, choose License Headers in Project Properties.
   * To change this template file, choose Tools | Templates
   * and open the template in the editor.
   */

StarGeometry.prototype = (0, _create2.default)(THREE.Geometry.prototype);
StarGeometry.prototype.constructor = StarGeometry;

exports.default = StarGeometry;