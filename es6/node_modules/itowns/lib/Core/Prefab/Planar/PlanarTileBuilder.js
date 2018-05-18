'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _three = require('three');

var THREE = _interopRequireWildcard(_three);

var _OBB = require('../../../Renderer/ThreeExtended/OBB');

var _OBB2 = _interopRequireDefault(_OBB);

var _Coordinates = require('../../Geographic/Coordinates');

var _Coordinates2 = _interopRequireDefault(_Coordinates);

var _Extent = require('../../Geographic/Extent');

var _Extent2 = _interopRequireDefault(_Extent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function PlanarTileBuilder() {
    this.tmp = {
        coords: new _Coordinates2.default('EPSG:4326', 0, 0),
        position: new THREE.Vector3(),
        normal: new THREE.Vector3(0, 0, 1)
    };

    this.type = 'p';
}

PlanarTileBuilder.prototype.constructor = PlanarTileBuilder;

// prepare params
// init projected object -> params.projected
PlanarTileBuilder.prototype.Prepare = function (params) {
    params.nbRow = Math.pow(2.0, params.zoom + 1.0);
    params.projected = new THREE.Vector3();
};

// get center tile in cartesian 3D
var center = new THREE.Vector3();
PlanarTileBuilder.prototype.Center = function (extent) {
    extent.center(this.tmp.coords);
    center.set(this.tmp.coords.x(), this.tmp.coords.y(), 0);
    return center;
};

// get position 3D cartesian
PlanarTileBuilder.prototype.VertexPosition = function (params) {
    this.tmp.position.set(params.projected.x, params.projected.y, 0);
    return this.tmp.position;
};

// get normal for last vertex
PlanarTileBuilder.prototype.VertexNormal = function () {
    return this.tmp.normal;
};

// coord u tile to projected
PlanarTileBuilder.prototype.uProjecte = function (u, params) {
    params.projected.x = params.extent.west() + u * (params.extent.east() - params.extent.west());
};

// coord v tile to projected
PlanarTileBuilder.prototype.vProjecte = function (v, params) {
    params.projected.y = params.extent.south() + v * (params.extent.north() - params.extent.south());
};

// get oriented bounding box of tile
PlanarTileBuilder.prototype.OBB = function (boundingBox) {
    return new _OBB2.default(boundingBox.min, boundingBox.max);
};

var quaternion = new THREE.Quaternion();
PlanarTileBuilder.prototype.computeSharableExtent = function (extent) {
    // compute sharable extent to pool the geometries
    // the geometry in common extent is identical to the existing input
    // with a translation
    var sharableExtent = new _Extent2.default(extent.crs(), 0, Math.abs(extent.west() - extent.east()), 0, Math.abs(extent.north() - extent.south()));
    sharableExtent._internalStorageUnit = extent._internalStorageUnit;
    return {
        sharableExtent: sharableExtent,
        quaternion: quaternion,
        position: this.Center(extent).clone()
    };
};

exports.default = PlanarTileBuilder;