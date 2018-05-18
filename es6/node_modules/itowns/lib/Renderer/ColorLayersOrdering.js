'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ColorLayersOrdering = exports.COLOR_LAYERS_ORDER_CHANGED = undefined;

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _Layer = require('../Core/Layer/Layer');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function updateLayersOrdering(geometryLayer, imageryLayers) {
    var sequence = _Layer.ImageryLayers.getColorLayersIdOrderedBySequence(imageryLayers);
    var cO = function (object) {
        if (object.changeSequenceLayers) {
            object.changeSequenceLayers(sequence);
        }
    };

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = (0, _getIterator3.default)(geometryLayer.level0Nodes), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var node = _step.value;

            node.traverse(cO);
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
}

var COLOR_LAYERS_ORDER_CHANGED = exports.COLOR_LAYERS_ORDER_CHANGED = 'layers-order-changed';

var ColorLayersOrdering = exports.ColorLayersOrdering = {
    /**
     * Moves up in the layer list. This function has no effect if the layer is moved to its current index.
     * @function moveLayerUp
     * @param      {View}  view the viewer
     * @param      {string}  layerId   The layer's idendifiant
     * @example
     * itowns.ColorLayersOrdering.moveLayerUp(viewer, 'idLayerToUp');
     */
    moveLayerUp: function (view, layerId) {
        var imageryLayers = view.getLayers(function (l) {
            return l.type === 'color';
        });
        var layer = view.getLayers(function (l) {
            return l.id === layerId;
        })[0];
        if (layer) {
            var previousSequence = _Layer.ImageryLayers.getColorLayersIdOrderedBySequence(imageryLayers);
            _Layer.ImageryLayers.moveLayerUp(layer, imageryLayers);
            updateLayersOrdering(view.wgs84TileLayer, imageryLayers);
            view.dispatchEvent({ type: COLOR_LAYERS_ORDER_CHANGED,
                previous: { sequence: previousSequence },
                new: { sequence: _Layer.ImageryLayers.getColorLayersIdOrderedBySequence(imageryLayers) }
            });
            view.notifyChange(true);
        } else {
            throw new Error(layerId + ' isn\'t color layer');
        }
    },
    /**
     * Moves down in the layer list. This function has no effect if the layer is moved to its current index.
     * @function moveLayerDown
     * @param      {View}  view the viewer
     * @param      {string}  layerId   The layer's idendifiant
     * @example
     * itowns.ColorLayersOrdering.moveLayerDown(viewer, 'idLayerToDown');
     */
    moveLayerDown: function (view, layerId) {
        var imageryLayers = view.getLayers(function (l) {
            return l.type === 'color';
        });
        var layer = view.getLayers(function (l) {
            return l.id === layerId;
        })[0];
        if (layer) {
            var previousSequence = _Layer.ImageryLayers.getColorLayersIdOrderedBySequence(imageryLayers);
            _Layer.ImageryLayers.moveLayerDown(layer, imageryLayers);
            updateLayersOrdering(view.wgs84TileLayer, imageryLayers);
            view.dispatchEvent({ type: COLOR_LAYERS_ORDER_CHANGED,
                previous: { sequence: previousSequence },
                new: { sequence: _Layer.ImageryLayers.getColorLayersIdOrderedBySequence(imageryLayers) }
            });
            view.notifyChange(true);
        } else {
            throw new Error(layerId + ' isn\'t color layer');
        }
    },
    /**
     * Moves a specific layer to a specific index in the layer list. This function has no effect if the layer is moved to its current index.
     * @function moveLayerToIndex
     * @param      {View}  view the viewer
     * @param      {string}  layerId   The layer's idendifiant
     * @param      {number}  newIndex   The new index
     * @example
     * itowns.ColorLayersOrdering.moveLayerToIndex(viewer, 'idLayerToChangeIndex', 2);
     */
    moveLayerToIndex: function (view, layerId, newIndex) {
        var imageryLayers = view.getLayers(function (l) {
            return l.type === 'color';
        });
        var layer = view.getLayers(function (l) {
            return l.id === layerId;
        })[0];
        if (layer) {
            var previousSequence = _Layer.ImageryLayers.getColorLayersIdOrderedBySequence(imageryLayers);
            _Layer.ImageryLayers.moveLayerToIndex(layer, newIndex, imageryLayers);
            updateLayersOrdering(view.wgs84TileLayer, imageryLayers);
            view.dispatchEvent({ type: COLOR_LAYERS_ORDER_CHANGED,
                previous: { sequence: previousSequence },
                new: { sequence: _Layer.ImageryLayers.getColorLayersIdOrderedBySequence(imageryLayers) }
            });
            view.notifyChange(true);
        } else {
            throw new Error(layerId + ' isn\'t color layer');
        }
    }
};