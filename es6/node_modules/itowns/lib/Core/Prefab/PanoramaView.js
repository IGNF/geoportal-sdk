'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _create = require('babel-runtime/core-js/object/create');

var _create2 = _interopRequireDefault(_create);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

exports.createPanoramaLayer = createPanoramaLayer;

var _three = require('three');

var THREE = _interopRequireWildcard(_three);

var _View = require('../View');

var _View2 = _interopRequireDefault(_View);

var _Layer = require('../Layer/Layer');

var _Extent = require('../Geographic/Extent');

var _Extent2 = _interopRequireDefault(_Extent);

var _TiledNodeProcessing = require('../../Process/TiledNodeProcessing');

var _LayeredMaterialNodeProcessing = require('../../Process/LayeredMaterialNodeProcessing');

var _PanoramaTileProcessing = require('../../Process/PanoramaTileProcessing');

var _PanoramaTileBuilder = require('./Panorama/PanoramaTileBuilder');

var _PanoramaTileBuilder2 = _interopRequireDefault(_PanoramaTileBuilder);

var _SubdivisionControl = require('../../Process/SubdivisionControl');

var _SubdivisionControl2 = _interopRequireDefault(_SubdivisionControl);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createPanoramaLayer(id, coordinates, ratio) {
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    var tileLayer = new _Layer.GeometryLayer(id, options.object3d || new THREE.Group());

    coordinates.xyz(tileLayer.object3d.position);
    tileLayer.object3d.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), coordinates.geodesicNormal);
    tileLayer.object3d.updateMatrixWorld(true);

    // FIXME: add CRS = '0' support
    tileLayer.extent = new _Extent2.default('EPSG:4326', {
        west: -180,
        east: 180,
        north: 90,
        south: -90
    });

    if (ratio == 2) {
        // equirectangular -> spherical geometry
        tileLayer.schemeTile = [new _Extent2.default('EPSG:4326', {
            west: -180,
            east: 0,
            north: 90,
            south: -90
        }), new _Extent2.default('EPSG:4326', {
            west: 0,
            east: 180,
            north: 90,
            south: -90
        })];
    } else {
        // cylindrical geometry
        tileLayer.schemeTile = [new _Extent2.default('EPSG:4326', {
            west: -180,
            east: -90,
            north: 90,
            south: -90
        }), new _Extent2.default('EPSG:4326', {
            west: -90,
            east: 0,
            north: 90,
            south: -90
        }), new _Extent2.default('EPSG:4326', {
            west: 0,
            east: 90,
            north: 90,
            south: -90
        }), new _Extent2.default('EPSG:4326', {
            west: 90,
            east: 180,
            north: 90,
            south: -90
        })];
    }
    tileLayer.disableSkirt = true;

    // Configure tiles


    function _commonAncestorLookup(a, b) {
        if (!a || !b) {
            return undefined;
        }
        if (a.level == b.level) {
            if (a.id == b.id) {
                return a;
            } else if (a.level != 0) {
                return _commonAncestorLookup(a.parent, b.parent);
            } else {
                return undefined;
            }
        } else if (a.level < b.level) {
            return _commonAncestorLookup(a, b.parent);
        } else {
            return _commonAncestorLookup(a.parent, b);
        }
    }

    tileLayer.preUpdate = function (context, layer, changeSources) {
        _SubdivisionControl2.default.preUpdate(context, layer);

        if (changeSources.has(undefined) || changeSources.size == 0) {
            return layer.level0Nodes;
        }

        var commonAncestor = void 0;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = (0, _getIterator3.default)(changeSources.values()), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var source = _step.value;

                if (source.isCamera) {
                    // if the change is caused by a camera move, no need to bother
                    // to find common ancestor: we need to update the whole tree:
                    // some invisible tiles may now be visible
                    return layer.level0Nodes;
                }
                if (source.layer === layer.id) {
                    if (!commonAncestor) {
                        commonAncestor = source;
                    } else {
                        commonAncestor = _commonAncestorLookup(commonAncestor, source);
                        if (!commonAncestor) {
                            return layer.level0Nodes;
                        }
                    }
                    if (commonAncestor.material == null) {
                        commonAncestor = undefined;
                    }
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        if (commonAncestor) {
            return [commonAncestor];
        } else {
            return layer.level0Nodes;
        }
    };

    tileLayer.update = (0, _TiledNodeProcessing.processTiledGeometryNode)(_PanoramaTileProcessing.panoramaCulling, function (context, layer, node) {
        if (_SubdivisionControl2.default.hasEnoughTexturesToSubdivide(context, layer, node)) {
            return (0, _PanoramaTileProcessing.panoramaSubdivisionControl)(options.maxSubdivisionLevel || 10, new THREE.Vector2(512, 512 / ratio))(context, layer, node);
        }
        return false;
    });
    tileLayer.builder = new _PanoramaTileBuilder2.default(ratio);
    tileLayer.onTileCreated = function (layer, parent, node) {
        if (layer.noTextureColor) {
            node.material.uniforms.noTextureColor.value.copy(layer.noTextureColor);
        }
        node.material.depthWrite = false;
    };
    tileLayer.type = 'geometry';
    tileLayer.protocol = 'tile';
    tileLayer.visible = true;
    tileLayer.segments = 8;
    tileLayer.quality = 0.5;
    tileLayer.lighting = {
        enable: false,
        position: { x: -0.5, y: 0.0, z: 1.0 }
    };

    return tileLayer;
}

function PanoramaView(viewerDiv, coordinates, ratio) {
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    THREE.Object3D.DefaultUp.set(0, 0, 1);

    // Setup View
    _View2.default.call(this, coordinates.crs, viewerDiv, options);

    // Configure camera
    coordinates.xyz(this.camera.camera3D.position);
    this.camera.camera3D.fov = 45;

    this.camera.camera3D.near = 0.1;
    this.camera.camera3D.far = 1000;
    this.camera.camera3D.up = coordinates.geodesicNormal;
    this.camera.camera3D.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), coordinates.geodesicNormal);
    this.camera.camera3D.updateProjectionMatrix();
    this.camera.camera3D.updateMatrixWorld();

    var tileLayer = createPanoramaLayer('panorama', coordinates, ratio, options);

    _View2.default.prototype.addLayer.call(this, tileLayer);

    this.baseLayer = tileLayer;
}

PanoramaView.prototype = (0, _create2.default)(_View2.default.prototype);
PanoramaView.prototype.constructor = PanoramaView;

PanoramaView.prototype.addLayer = function (layer) {
    if (layer.type == 'color') {
        layer.update = _LayeredMaterialNodeProcessing.updateLayeredMaterialNodeImagery;
    } else {
        throw new Error('Unsupported layer type ' + layer.type + ' (PanoramaView only support \'color\' layers)');
    }
    return _View2.default.prototype.addLayer.call(this, layer, this.baseLayer);
};

exports.default = PanoramaView;