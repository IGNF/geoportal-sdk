'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    preUpdate: function preUpdate(context, layer) {
        context.colorLayers = context.view.getLayers(function (l, a) {
            return a && a.id == layer.id && l.type == 'color';
        });
        context.elevationLayers = context.view.getLayers(function (l, a) {
            return a && a.id == layer.id && l.type == 'elevation';
        });
    },

    hasEnoughTexturesToSubdivide: function hasEnoughTexturesToSubdivide(context, layer, node) {
        // Prevent subdivision if node is covered by at least one elevation layer
        // and if node doesn't have a elevation texture yet.
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = (0, _getIterator3.default)(context.elevationLayers), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var e = _step.value;

                if (!e.frozen && e.ready && e.tileInsideLimit(node, e) && !node.isElevationLayerLoaded()) {
                    // no stop subdivision in the case of a loading error
                    if (node.layerUpdateState[e.id] && node.layerUpdateState[e.id].inError()) {
                        continue;
                    }
                    return false;
                }
            }

            // Prevent subdivision if missing color texture
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

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = (0, _getIterator3.default)(context.colorLayers), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var c = _step2.value;

                if (c.frozen || !c.visible || !c.ready) {
                    continue;
                }
                // no stop subdivision in the case of a loading error
                if (node.layerUpdateState[c.id] && node.layerUpdateState[c.id].inError()) {
                    continue;
                }
                if (c.tileInsideLimit(node, c) && !node.isColorLayerLoaded(c.id)) {
                    return false;
                }
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

        return true;
    }
};