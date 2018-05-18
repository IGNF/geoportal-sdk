'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _create = require('babel-runtime/core-js/object/create');

var _create2 = _interopRequireDefault(_create);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

exports.createPlanarLayer = createPlanarLayer;

var _three = require('three');

var THREE = _interopRequireWildcard(_three);

var _View = require('../View');

var _View2 = _interopRequireDefault(_View);

var _MainLoop = require('../MainLoop');

var _RendererConstant = require('../../Renderer/RendererConstant');

var _RendererConstant2 = _interopRequireDefault(_RendererConstant);

var _LayeredMaterial = require('../../Renderer/LayeredMaterial');

var _Layer = require('../Layer/Layer');

var _TiledNodeProcessing = require('../../Process/TiledNodeProcessing');

var _LayeredMaterialNodeProcessing = require('../../Process/LayeredMaterialNodeProcessing');

var _PlanarTileProcessing = require('../../Process/PlanarTileProcessing');

var _PlanarTileBuilder = require('./Planar/PlanarTileBuilder');

var _PlanarTileBuilder2 = _interopRequireDefault(_PlanarTileBuilder);

var _SubdivisionControl = require('../../Process/SubdivisionControl');

var _SubdivisionControl2 = _interopRequireDefault(_SubdivisionControl);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createPlanarLayer(id, extent, options) {
    var tileLayer = new _Layer.GeometryLayer(id, options.object3d || new THREE.Group());
    tileLayer.extent = extent;
    tileLayer.schemeTile = [extent];

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

        (0, _PlanarTileProcessing.prePlanarUpdate)(context, layer);

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

    tileLayer.update = (0, _TiledNodeProcessing.processTiledGeometryNode)(_PlanarTileProcessing.planarCulling, function (context, layer, node) {
        if (_SubdivisionControl2.default.hasEnoughTexturesToSubdivide(context, layer, node)) {
            return (0, _PlanarTileProcessing.planarSubdivisionControl)(options.maxSubdivisionLevel || 5, options.maxDeltaElevationLevel || 4)(context, layer, node);
        }
        return false;
    });
    tileLayer.builder = new _PlanarTileBuilder2.default();
    tileLayer.onTileCreated = function (layer, parent, node) {
        node.material.setLightingOn(layer.lighting.enable);
        node.material.uniforms.lightPosition.value = layer.lighting.position;

        if (layer.noTextureColor) {
            node.material.uniforms.noTextureColor.value.copy(layer.noTextureColor);
        }
    };
    tileLayer.type = 'geometry';
    tileLayer.protocol = 'tile';
    tileLayer.visible = true;
    tileLayer.lighting = {
        enable: false,
        position: { x: -0.5, y: 0.0, z: 1.0 }
    };

    return tileLayer;
}

function PlanarView(viewerDiv, extent) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    THREE.Object3D.DefaultUp.set(0, 0, 1);

    // Setup View
    _View2.default.call(this, extent.crs(), viewerDiv, options);

    // Configure camera
    var dim = extent.dimensions();
    var positionCamera = extent.center().clone();
    positionCamera._values[2] = Math.max(dim.x, dim.y);
    var lookat = positionCamera.xyz();
    lookat.z = 0;

    this.camera.setPosition(positionCamera);
    this.camera.camera3D.lookAt(lookat);
    this.camera.camera3D.near = 0.1;
    this.camera.camera3D.far = 2 * Math.max(dim.x, dim.y);
    this.camera.camera3D.updateProjectionMatrix();
    this.camera.camera3D.updateMatrixWorld(true);

    var tileLayer = createPlanarLayer('planar', extent, options);

    this.addLayer(tileLayer);

    this._renderState = _RendererConstant2.default.FINAL;
    this._fullSizeDepthBuffer = null;

    this.tileLayer = tileLayer;
}

PlanarView.prototype = (0, _create2.default)(_View2.default.prototype);
PlanarView.prototype.constructor = PlanarView;

PlanarView.prototype.addLayer = function (layer) {
    if (layer.type == 'color') {
        layer.update = _LayeredMaterialNodeProcessing.updateLayeredMaterialNodeImagery;
        if (layer.protocol === 'rasterizer') {
            layer.reprojection = this.referenceCrs;
        }
    } else if (layer.type == 'elevation') {
        layer.update = _LayeredMaterialNodeProcessing.updateLayeredMaterialNodeElevation;
    }
    return _View2.default.prototype.addLayer.call(this, layer, this.tileLayer);
};

PlanarView.prototype.selectNodeAt = function (mouse) {
    var selectedId = this.screenCoordsToNodeId(mouse);

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = (0, _getIterator3.default)(this.tileLayer.level0Nodes), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var n = _step2.value;

            n.traverse(function (node) {
                // only take of selectable nodes
                if (node.setSelected) {
                    node.setSelected(node.id === selectedId);

                    if (node.id === selectedId) {
                        // eslint-disable-next-line no-console
                        console.info(node);
                    }
                }
            });
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    this.notifyChange();
};

PlanarView.prototype.screenCoordsToNodeId = function (mouse) {
    var dim = this.mainLoop.gfxEngine.getWindowSize();

    var previousRenderState = this._renderState;
    this.changeRenderState(_RendererConstant2.default.ID);

    var buffer = this.mainLoop.gfxEngine.renderViewTobuffer(this, this.mainLoop.gfxEngine.fullSizeRenderTarget, mouse.x, dim.y - mouse.y, 1, 1);

    this.changeRenderState(previousRenderState);

    var depthRGBA = new THREE.Vector4().fromArray(buffer).divideScalar(255.0);

    // unpack RGBA to float
    var unpack = (0, _LayeredMaterial.unpack1K)(depthRGBA, Math.pow(256, 3));

    return Math.round(unpack);
};

PlanarView.prototype.readDepthBuffer = function (x, y, width, height) {
    var g = this.mainLoop.gfxEngine;
    var previousRenderState = this._renderState;
    this.changeRenderState(_RendererConstant2.default.DEPTH);
    var buffer = g.renderViewTobuffer(this, g.fullSizeRenderTarget, x, y, width, height);
    this.changeRenderState(previousRenderState);
    return buffer;
};

var matrix = new THREE.Matrix4();
var screen = new THREE.Vector2();
var pickWorldPosition = new THREE.Vector3();
var ray = new THREE.Ray();
var direction = new THREE.Vector3();
PlanarView.prototype.getPickingPositionFromDepth = function (mouse) {
    var l = this.mainLoop;
    var viewPaused = l.scheduler.commandsWaitingExecutionCount() == 0 && l.renderingState == _MainLoop.RENDERING_PAUSED;
    var g = l.gfxEngine;
    var dim = g.getWindowSize();
    var camera = this.camera.camera3D;

    mouse = mouse || dim.clone().multiplyScalar(0.5);
    mouse.x = Math.floor(mouse.x);
    mouse.y = Math.floor(mouse.y);

    // Prepare state
    var prev = camera.layers.mask;
    camera.layers.mask = 1 << this.tileLayer.threejsLayer;

    // Render/Read to buffer
    var buffer = void 0;
    if (viewPaused) {
        this._fullSizeDepthBuffer = this._fullSizeDepthBuffer || this.readDepthBuffer(0, 0, dim.x, dim.y);
        var id = ((dim.y - mouse.y - 1) * dim.x + mouse.x) * 4;
        buffer = this._fullSizeDepthBuffer.slice(id, id + 4);
    } else {
        buffer = this.readDepthBuffer(mouse.x, dim.y - mouse.y - 1, 1, 1);
    }

    screen.x = mouse.x / dim.x * 2 - 1;
    screen.y = -(mouse.y / dim.y) * 2 + 1;

    // Origin
    ray.origin.copy(camera.position);

    // Direction
    ray.direction.set(screen.x, screen.y, 0.5);
    // Unproject
    matrix.multiplyMatrices(camera.matrixWorld, matrix.getInverse(camera.projectionMatrix));
    ray.direction.applyMatrix4(matrix);
    ray.direction.sub(ray.origin);

    direction.set(0, 0, 1.0);
    direction.applyMatrix4(matrix);
    direction.sub(ray.origin);

    var angle = direction.angleTo(ray.direction);
    var orthoZ = g.depthBufferRGBAValueToOrthoZ(buffer, camera);
    var length = orthoZ / Math.cos(angle);

    pickWorldPosition.addVectors(camera.position, ray.direction.setLength(length));

    camera.layers.mask = prev;

    if (pickWorldPosition.length() > 10000000) {
        return undefined;
    }

    return pickWorldPosition;
};

PlanarView.prototype.changeRenderState = function (newRenderState) {
    if (this._renderState == newRenderState || !this.tileLayer.level0Nodes) {
        return;
    }

    // build traverse function
    var changeStateFunction = function () {
        return function (object3D) {
            if (object3D.changeState) {
                object3D.changeState(newRenderState);
            }
        };
    }();

    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
        for (var _iterator3 = (0, _getIterator3.default)(this.tileLayer.level0Nodes), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var n = _step3.value;

            n.traverseVisible(changeStateFunction);
        }
    } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
            }
        } finally {
            if (_didIteratorError3) {
                throw _iteratorError3;
            }
        }
    }

    this._renderState = newRenderState;
};

exports.default = PlanarView;