'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _three = require('three');

var THREE = _interopRequireWildcard(_three);

var _PointsMaterial = require('../../../Renderer/PointsMaterial');

var _PointsMaterial2 = _interopRequireDefault(_PointsMaterial);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// Parse .cin PotreeConverter format (see https://github.com/peppsac/PotreeConverter/tree/custom_bin)
exports.default = {
    parse: function (buffer) {
        if (!buffer) {
            throw new Error('No array buffer provided.');
        }

        // Format: MinX,MinY,MinZ,MaxX,MaxY,MaxZ,X1,Y1,Z1,[...],XN,YN,ZN,R1,G1,B1,A1,[...],RN,GN,BN,AN
        var view = new DataView(buffer, 0, 6 * 4);
        var min = new THREE.Vector3(view.getFloat32(0, true), view.getFloat32(4, true), view.getFloat32(8, true));
        var max = new THREE.Vector3(view.getFloat32(12, true), view.getFloat32(16, true), view.getFloat32(20, true));
        var tightbbox = new THREE.Box3(min, max);

        var numPoints = Math.floor((buffer.byteLength - 24) / 16);

        var positions = new Float32Array(buffer, 24, 3 * numPoints);
        var colors = new Uint8Array(buffer, 24 + 3 * 4 * numPoints, 4 * numPoints);

        var geometry = new THREE.BufferGeometry();
        geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.addAttribute('color', new THREE.BufferAttribute(colors, 4, true));

        var material = new _PointsMaterial2.default();
        var points = new THREE.Points(geometry, material);

        points.frustumCulled = false;
        points.matrixAutoUpdate = false;
        points.realPointCount = numPoints;
        points.tightbbox = tightbbox;

        return points;
    }
};