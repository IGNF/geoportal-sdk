'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

exports.planarCulling = planarCulling;
exports.prePlanarUpdate = prePlanarUpdate;
exports.planarSubdivisionControl = planarSubdivisionControl;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function frustumCullingOBB(node, camera) {
    return camera.isBox3Visible(node.OBB().box3D, node.OBB().matrixWorld);
}

function planarCulling(node, camera) {
    return !frustumCullingOBB(node, camera);
}

function _isTileBigOnScreen(camera, node) {
    var onScreen = camera.box3SizeOnScreen(node.OBB().box3D, node.matrixWorld);

    // onScreen.x/y/z are [-1, 1] so divide by 2
    // (so x = 0.4 means the object width on screen is 40% of the total screen width)
    var dim = {
        x: 0.5 * (onScreen.max.x - onScreen.min.x),
        y: 0.5 * (onScreen.max.y - onScreen.min.y)
    };

    // subdivide if on-screen width (and resp. height) is bigger than 30% of the screen width (resp. height)
    // TODO: the 30% value is arbitrary and needs to be configurable by the user
    // TODO: we might want to use texture resolution here as well
    return dim.x >= 0.3 && dim.y >= 0.3;
}

function prePlanarUpdate(context, layer) {
    var elevationLayers = context.view.getLayers(function (l, a) {
        return a && a.id == layer.id && l.type == 'elevation';
    });
    context.maxElevationLevel = -1;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = (0, _getIterator3.default)(elevationLayers), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var e = _step.value;

            context.maxElevationLevel = Math.max(e.options.zoom.max, context.maxElevationLevel);
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

    if (context.maxElevationLevel == -1) {
        context.maxElevationLevel = Infinity;
    }
}

function planarSubdivisionControl(maxLevel, maxDeltaElevationLevel) {
    return function (context, layer, node) {
        if (maxLevel <= node.level) {
            return false;
        }

        // Prevent to subdivise the node if the current elevation level
        // we must avoid a tile, with level 20, inherits a level 3 elevation texture.
        // The induced geometric error is much too large and distorts the SSE
        var currentElevationLevel = node.material.getElevationLayerLevel();
        if (node.level < context.maxElevationLevel + maxDeltaElevationLevel && currentElevationLevel >= 0 && node.level - currentElevationLevel >= maxDeltaElevationLevel) {
            return false;
        }

        return _isTileBigOnScreen(context.camera, node);
    };
}