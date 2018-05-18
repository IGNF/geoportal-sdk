'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _three = require('three');

var THREE = _interopRequireWildcard(_three);

var _LayerUpdateState = require('../Core/Layer/LayerUpdateState');

var _LayerUpdateState2 = _interopRequireDefault(_LayerUpdateState);

var _CancelledCommandException = require('../Core/Scheduler/CancelledCommandException');

var _CancelledCommandException2 = _interopRequireDefault(_CancelledCommandException);

var _ObjectRemovalHelper = require('./ObjectRemovalHelper');

var _ObjectRemovalHelper2 = _interopRequireDefault(_ObjectRemovalHelper);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var vector = new THREE.Vector3();
function applyOffset(obj, offset, quaternion, offsetAltitude) {
    if (obj.geometry) {
        if (obj.geometry instanceof THREE.BufferGeometry) {
            for (var i = 0; i < obj.geometry.attributes.position.count; i++) {
                var i3 = 3 * i;
                vector.fromArray(obj.geometry.attributes.position.array, i3);
                vector.add(offset).applyQuaternion(quaternion);
                if (offsetAltitude) {
                    vector.z -= offsetAltitude;
                }
                vector.toArray(obj.geometry.attributes.position.array, i3);
            }
            obj.geometry.attributes.position.needsUpdate = true;
        } else {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = (0, _getIterator3.default)(obj.geometry.vertices), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var v = _step.value;

                    v.add(offset).applyQuaternion(quaternion);
                    if (offsetAltitude) {
                        v.z -= offsetAltitude;
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

            obj.geometry.verticesNeedUpdate = true;
        }
    }
    obj.children.forEach(function (c) {
        return applyOffset(c, offset, quaternion, offsetAltitude);
    });
}

var quaternion = new THREE.Quaternion();
exports.default = {
    update: function update(context, layer, node) {
        if (!node.parent && node.children.length) {
            // if node has been removed dispose three.js resource
            _ObjectRemovalHelper2.default.removeChildrenAndCleanupRecursively(layer.id, node);
            return;
        }
        if (!node.visible) {
            return;
        }

        var features = node.children.filter(function (n) {
            return n.layer == layer.id;
        });
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = (0, _getIterator3.default)(features), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var feat = _step2.value;

                feat.traverse(function (o) {
                    if (o.material) {
                        o.material.transparent = layer.opacity < 1.0;
                        o.material.opacity = layer.opacity;
                        o.material.wireframe = layer.wireframe;
                        if (layer.size) {
                            o.material.size = layer.size;
                        }
                        if (layer.linewidth) {
                            o.material.linewidth = layer.linewidth;
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

        if (features.length > 0) {
            return features;
        }

        if (!layer.tileInsideLimit(node, layer)) {
            return;
        }

        if (node.layerUpdateState[layer.id] === undefined) {
            node.layerUpdateState[layer.id] = new _LayerUpdateState2.default();
        }

        var ts = Date.now();

        if (!node.layerUpdateState[layer.id].canTryUpdate(ts)) {
            return;
        }

        node.layerUpdateState[layer.id].newTry();

        var command = {
            layer: layer,
            view: context.view,
            threejsLayer: layer.threejsLayer,
            requester: node
        };

        context.scheduler.execute(command).then(function (result) {
            // if request return empty json, WFS_Provider.getFeatures return undefined
            if (result) {
                // call onMeshCreated callback if needed
                if (layer.onMeshCreated) {
                    layer.onMeshCreated(result);
                }
                node.layerUpdateState[layer.id].success();
                if (!node.parent) {
                    _ObjectRemovalHelper2.default.removeChildrenAndCleanupRecursively(layer.id, result);
                    return;
                }
                // We don't use node.matrixWorld here, because feature coordinates are
                // expressed in crs coordinates (which may be different than world coordinates,
                // if node's layer is attached to an Object with a non-identity transformation)
                var tmp = node.extent.center().as(context.view.referenceCrs).xyz().negate();
                quaternion.setFromRotationMatrix(node.matrixWorld).inverse();
                // const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), node.extent.center().geodesicNormal).inverse();
                applyOffset(result, tmp, quaternion, result.minAltitude);
                if (result.minAltitude) {
                    result.position.z = result.minAltitude;
                }
                result.layer = layer.id;
                node.add(result);
                node.updateMatrixWorld();
            } else {
                node.layerUpdateState[layer.id].failure(1, true);
            }
        }, function (err) {
            if (err instanceof _CancelledCommandException2.default) {
                node.layerUpdateState[layer.id].success();
            } else if (err instanceof SyntaxError) {
                node.layerUpdateState[layer.id].failure(0, true);
            } else {
                node.layerUpdateState[layer.id].failure(Date.now());
                setTimeout(node.layerUpdateState[layer.id].secondsUntilNextTry() * 1000, function () {
                    context.view.notifyChange(false);
                });
            }
        });
    }
};