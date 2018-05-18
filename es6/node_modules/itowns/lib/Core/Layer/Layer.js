'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ImageryLayers = exports.Layer = exports.GeometryLayer = exports.defineLayerProperty = undefined;

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _create = require('babel-runtime/core-js/object/create');

var _create2 = _interopRequireDefault(_create);

var _defineProperty = require('babel-runtime/core-js/object/define-property');

var _defineProperty2 = _interopRequireDefault(_defineProperty);

var _getOwnPropertyDescriptor = require('babel-runtime/core-js/object/get-own-property-descriptor');

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

var _three = require('three');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Fires when layer sequence change (meaning when the order of the layer changes in the view)
 * @event Layer#sequence-property-changed
 * @property new {object}
 * @property new.sequence {number} the new value of the layer sequence
 * @property previous {object}
 * @property previous.sequence {number} the previous value of the layer sequence
 * @property target {Layer} dispatched on layer
 * @property type {string} sequence-property-changed
*/
/**
 * Fires when layer opacity change
 * @event Layer#opacity-property-changed
 * @property new {object}
 * @property new.opacity {object} the new value of the layer opacity
 * @property previous {object}
 * @property previous.opacity {object} the previous value of the layer opacity
 * @property target {Layer} dispatched on layer
 * @property type {string} opacity-property-changed
*/
/**
 * Fires when layer visibility change
 * @event Layer#visible-property-changed
 * @property new {object}
 * @property new.visible {object} the new value of the layer visibility
 * @property previous {object}
 * @property previous.visible {object} the previous value of the layer visibility
 * @property target {Layer} dispatched on layer
 * @property type {string} visible-property-changed
*/

var defineLayerProperty = exports.defineLayerProperty = function (layer, propertyName, defaultValue, onChange) {
    var existing = (0, _getOwnPropertyDescriptor2.default)(layer, propertyName);
    if (!existing || !existing.set) {
        var property = layer[propertyName] == undefined ? defaultValue : layer[propertyName];
        (0, _defineProperty2.default)(layer, propertyName, { get: function get() {
                return property;
            },
            set: function set(newValue) {
                if (property !== newValue) {
                    var event = { type: propertyName + '-property-changed', previous: {}, new: {} };
                    event.previous[propertyName] = property;
                    event.new[propertyName] = newValue;
                    property = newValue;
                    if (onChange) {
                        onChange(layer, propertyName);
                    }
                    layer.dispatchEvent(event);
                }
            } });
    }
};

function GeometryLayer(id, object3d) {
    if (!id) {
        throw new Error('Missing id parameter (GeometryLayer must have a unique id defined)');
    }
    if (!object3d || !object3d.isObject3D) {
        throw new Error('Missing/Invalid object3d parameter (must be a three.js Object3D instance)');
    }
    this._attachedLayers = [];

    if (object3d && object3d.type === 'Group' && object3d.name === '') {
        object3d.name = id;
    }

    Object.defineProperty(this, 'object3d', {
        value: object3d,
        writable: false
    });

    Object.defineProperty(this, 'id', {
        value: id,
        writable: false
    });

    this.postUpdate = function () {};
}

GeometryLayer.prototype = (0, _create2.default)(_three.EventDispatcher.prototype);
GeometryLayer.prototype.constructor = GeometryLayer;

GeometryLayer.prototype.attach = function (layer) {
    if (!layer.update) {
        throw new Error('Missing \'update\' function -> can\'t attach layer ' + layer.id);
    }
    this._attachedLayers.push(layer);
};

GeometryLayer.prototype.detach = function (layer) {
    var count = this._attachedLayers.length;
    this._attachedLayers = this._attachedLayers.filter(function (attached) {
        return attached.id != layer.id;
    });
    return this._attachedLayers.length < count;
};

/**
 * Don't use directly constructor to instance a new Layer
 * use addLayer in {@link View}
 * @example
 * // add and create a new Layer
 * const newLayer = view.addLayer({options});
 *
 * // Change layer's visibilty
 * const layerToChange = view.getLayers(layer => layer.id == 'idLayerToChange')[0];
 * layerToChange.visible = false;
 * view.notifyChange(true); // update viewer
 *
 * // Change layer's opacity
 * const layerToChange = view.getLayers(layer => layer.id == 'idLayerToChange')[0];
 * layerToChange.opacity = 0.5;
 * view.notifyChange(true); // update viewer
 *
 * // Listen properties
 * const layerToListen = view.getLayers(layer => layer.id == 'idLayerToListen')[0];
 * layerToListen.addEventListener('visible-property-changed', (event) => console.log(event));
 * layerToListen.addEventListener('opacity-property-changed', (event) => console.log(event));
 * @constructor
 * @protected
 * @param      {String}  id
 */
function Layer(id) {
    Object.defineProperty(this, 'id', {
        value: id,
        writable: false
    });
}

Layer.prototype = (0, _create2.default)(_three.EventDispatcher.prototype);
Layer.prototype.constructor = Layer;

var ImageryLayers = {
    // move layer to new index
    // After the modification :
    //      * the minimum sequence will always be 0
    //      * the maximum sequence will always be layers.lenght - 1
    // the ordering of all layers (Except that specified) doesn't change
    moveLayerToIndex: function (layer, newIndex, imageryLayers) {
        newIndex = Math.min(newIndex, imageryLayers.length - 1);
        newIndex = Math.max(newIndex, 0);
        var oldIndex = layer.sequence;

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = (0, _getIterator3.default)(imageryLayers), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var imagery = _step.value;

                if (imagery.id === layer.id) {
                    // change index of specified layer
                    imagery.sequence = newIndex;
                } else if (imagery.sequence > oldIndex && imagery.sequence <= newIndex) {
                    // down all layers between the old index and new index (to compensate the deletion of the old index)
                    imagery.sequence--;
                } else if (imagery.sequence >= newIndex && imagery.sequence < oldIndex) {
                    // up all layers between the new index and old index (to compensate the insertion of the new index)
                    imagery.sequence++;
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
    },

    moveLayerDown: function (layer, imageryLayers) {
        if (layer.sequence > 0) {
            this.moveLayerToIndex(layer, layer.sequence - 1, imageryLayers);
        }
    },

    moveLayerUp: function (layer, imageryLayers) {
        var m = imageryLayers.length - 1;
        if (layer.sequence < m) {
            this.moveLayerToIndex(layer, layer.sequence + 1, imageryLayers);
        }
    },

    getColorLayersIdOrderedBySequence: function (imageryLayers) {
        var copy = (0, _from2.default)(imageryLayers);
        copy.sort(function (a, b) {
            return a.sequence - b.sequence;
        });
        return copy.map(function (l) {
            return l.id;
        });
    }
};

exports.GeometryLayer = GeometryLayer;
exports.Layer = Layer;
exports.ImageryLayers = ImageryLayers;