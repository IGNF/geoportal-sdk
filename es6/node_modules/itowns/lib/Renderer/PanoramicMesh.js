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

var PanoramicMesh = function (geom, mat, absC) {
    THREE.Mesh.call(this);

    this.matrixAutoUpdate = false;
    this.rotationAutoUpdate = false;

    this.geometry = geom;
    this.material = mat;
    this.absoluteCenter = absC;
    this.position.copy(this.absoluteCenter);
    this.name = 'terrestrialMesh';

    this.frustumCulled = false;

    // console.log("this.absoluteCenter",this.absoluteCenter);
}; /**
    * Generated On: 2015-10-5
    * Class: PanoramicMesh
    * PanoramicMesh is using projectiveTextureMaterial to texture geometryProj
    *
    */

PanoramicMesh.prototype = (0, _create2.default)(THREE.Mesh.prototype);
PanoramicMesh.prototype.constructor = PanoramicMesh;

PanoramicMesh.prototype.setGeometry = function (geom) {
    this.geometry = geom;
};

PanoramicMesh.prototype.setMaterial = function (mat) {
    this.material = mat;
};

PanoramicMesh.prototype.setFog = function () {
    //  this.material.setFogDistance(fog);
};

PanoramicMesh.prototype.setSelected = function () {
    //  this.material.setSelected(select);
};

exports.default = PanoramicMesh;