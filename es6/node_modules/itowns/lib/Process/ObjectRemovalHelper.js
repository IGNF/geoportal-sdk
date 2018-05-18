'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    /**
     * Cleanup obj to release three.js allocated resources
     * @param {Object3D} obj object to release
     */
    cleanup: function cleanup(obj) {
        if (typeof obj.dispose === 'function') {
            obj.dispose();
        } else {
            if (obj.geometry) {
                obj.geometry.dispose();
                obj.geometry = null;
            }
            if (obj.material) {
                obj.material.dispose();
                obj.material = null;
            }
        }
    },


    /**
     * Remove obj's children belonging to layerId layer.
     * Neither obj nor its children will be disposed!
     * @param {String} layerId The id of the layer that objects must belong to. Other object are ignored
     * @param {Object3D} obj The Object3D we want to clean
     * @return {Array} an array of removed Object3D from obj (not including the recursive removals)
     */
    removeChildren: function removeChildren(layerId, obj) {
        var toRemove = obj.children.filter(function (c) {
            return c.layer === layerId;
        });
        obj.remove.apply(obj, (0, _toConsumableArray3.default)(toRemove));
        return toRemove;
    },


    /**
     * Remove obj's children belonging to layerId layer and cleanup objexts.
     * obj will be disposed but its children **won't**!
     * @param {String} layerId The id of the layer that objects must belong to. Other object are ignored
     * @param {Object3D} obj The Object3D we want to clean
     * @return {Array} an array of removed Object3D from obj (not including the recursive removals)
     */
    removeChildrenAndCleanup: function removeChildrenAndCleanup(layerId, obj) {
        var toRemove = obj.children.filter(function (c) {
            return c.layer === layerId;
        });

        if (obj.layer === layerId) {
            this.cleanup(obj);
        }

        obj.remove.apply(obj, (0, _toConsumableArray3.default)(toRemove));
        return toRemove;
    },


    /**
     * Recursively remove obj's children belonging to layerId layer.
     * All removed obj will have their geometry/material disposed.
     * @param {String} layerId The id of the layer that objects must belong to. Other object are ignored
     * @param {Object3D} obj The Object3D we want to clean
     * @return {Array} an array of removed Object3D from obj (not including the recursive removals)
     */
    removeChildrenAndCleanupRecursively: function removeChildrenAndCleanupRecursively(layerId, obj) {
        var toRemove = obj.children.filter(function (c) {
            return c.layer === layerId;
        });
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = (0, _getIterator3.default)(toRemove), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var c = _step.value;

                this.removeChildrenAndCleanupRecursively(layerId, c);
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

        if (obj.layer === layerId) {
            this.cleanup(obj);
        }
        obj.remove.apply(obj, (0, _toConsumableArray3.default)(toRemove));
        return toRemove;
    }
};