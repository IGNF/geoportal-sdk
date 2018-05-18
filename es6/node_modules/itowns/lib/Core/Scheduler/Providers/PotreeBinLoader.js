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

// Parse .bin PotreeConverter format
exports.default = {
    parse: function (buffer) {
        if (!buffer) {
            throw new Error('No array buffer provided.');
        }

        var view = new DataView(buffer);
        // Format: X1,Y1,Z1,R1,G1,B1,A1,[...],XN,YN,ZN,RN,GN,BN,AN
        var numPoints = Math.floor(buffer.byteLength / 16);

        var positions = new Float32Array(3 * numPoints);
        var colors = new Uint8Array(4 * numPoints);

        var tightbbox = new THREE.Box3();
        tightbbox.min.set(Infinity, Infinity, Infinity);
        tightbbox.max.set(-Infinity, -Infinity, -Infinity);
        var tmp = new THREE.Vector3();

        var offset = 0;
        for (var i = 0; i < numPoints; i++) {
            positions[3 * i] = view.getUint32(offset + 0, true);
            positions[3 * i + 1] = view.getUint32(offset + 4, true);
            positions[3 * i + 2] = view.getUint32(offset + 8, true);

            tmp.fromArray(positions, 3 * i);
            tightbbox.min.min(tmp);
            tightbbox.max.max(tmp);

            colors[4 * i] = view.getUint8(offset + 12);
            colors[4 * i + 1] = view.getUint8(offset + 13);
            colors[4 * i + 2] = view.getUint8(offset + 14);
            colors[4 * i + 3] = 255;

            offset += 16;
        }

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