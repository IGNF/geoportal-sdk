'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _three = require('three');

var _Extent = require('../../Geographic/Extent');

var _Extent2 = _interopRequireDefault(_Extent);

var _OGCWebServiceHelper = require('./OGCWebServiceHelper');

var _OGCWebServiceHelper2 = _interopRequireDefault(_OGCWebServiceHelper);

var _Fetcher = require('./Fetcher');

var _Fetcher2 = _interopRequireDefault(_Fetcher);

var _LayeredMaterialConstants = require('../../../Renderer/LayeredMaterialConstants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// select the smallest image entirely covering the tile
function selectBestImageForExtent(images, extent) {
    var selection = void 0;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = (0, _getIterator3.default)(images), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var entry = _step.value;

            if (extent.isInside(entry.extent)) {
                if (!selection) {
                    selection = entry;
                } else {
                    var d = selection.extent.dimensions();
                    var e = entry.extent.dimensions();
                    if (e.x <= d.x && e.y <= d.y) {
                        selection = entry;
                    }
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

    return selection;
}

function buildUrl(layer, image) {
    return layer.url.href.substr(0, layer.url.href.lastIndexOf('/') + 1) + image;
}

function getTexture(tile, layer) {
    if (!layer.tileInsideLimit(tile, layer)) {
        return _promise2.default.reject('Tile \'' + tile + '\' is outside layer bbox ' + layer.extent);
    }
    if (!tile.material) {
        return _promise2.default.resolve();
    }

    if (!layer.images) {
        return _promise2.default.reject();
    }

    var selection = selectBestImageForExtent(layer.images, tile.extent);

    if (!selection) {
        return _promise2.default.reject(new Error('No available image for tile ' + tile));
    }

    var fn = layer.options.mimetype.indexOf('image/x-bil') === 0 ? _OGCWebServiceHelper2.default.getXBilTextureByUrl : _OGCWebServiceHelper2.default.getColorTextureByUrl;
    return fn(buildUrl(layer, selection.image), layer.networkOptions).then(function (texture) {
        // adjust pitch
        var result = {
            texture: texture,
            pitch: new _three.Vector4(0, 0, 1, 1)
        };

        result.texture.extent = selection.extent;
        result.texture.coords = selection.extent;
        if (!result.texture.coords.zoom || result.texture.coords.zoom > tile.level) {
            result.texture.coords.zoom = tile.level;
            result.texture.file = selection.image;
        }
        // TODO: modify TileFS to handle tiles with ratio != image's ratio
        result.pitch = tile.extent.offsetToParent(selection.extent);
        if (layer.transparent) {
            texture.premultiplyAlpha = true;
        }

        return result;
    });
}

/**
 * This provider uses no protocol but instead download static images directly.
 *
 * It uses as input 'image_filename: extent' values and then tries to find the best image
 * for a given tile using the extent property.
 */
exports.default = {
    preprocessDataLayer: function preprocessDataLayer(layer) {
        if (!layer.extent) {
            throw new Error('layer.extent is required');
        }

        if (!(layer.extent instanceof _Extent2.default)) {
            layer.extent = new (Function.prototype.bind.apply(_Extent2.default, [null].concat([layer.projection], (0, _toConsumableArray3.default)(layer.extent))))();
        }

        layer.options = layer.options || {};
        layer.canTileTextureBeImproved = this.canTileTextureBeImproved;
        layer.url = new URL(layer.url, window.location);
        return _Fetcher2.default.json(layer.url.href).then(function (metadata) {
            layer.images = [];
            // eslint-disable-next-line guard-for-in
            for (var image in metadata) {
                var extent = new (Function.prototype.bind.apply(_Extent2.default, [null].concat([layer.projection], (0, _toConsumableArray3.default)(metadata[image]))))();
                layer.images.push({
                    image: image,
                    extent: extent
                });
            }
        }).then(function () {
            if (!layer.options.mimetype) {
                // fetch the first image to detect mimetype
                if (layer.images.length) {
                    var url = buildUrl(layer, layer.images[0].image);
                    return fetch(url, layer.networkOptions).then(function (response) {
                        layer.options.mimetype = response.headers.get('Content-type');
                        if (layer.options.mimetype === 'application/octet-stream') {
                            layer.options.mimetype = 'image/x-bil';
                        }
                        if (!layer.options.mimetype) {
                            throw new Error('Could not detect layer\'s mimetype');
                        }
                    });
                }
            }
        });
    },
    tileInsideLimit: function tileInsideLimit(tile, layer) {
        if (!layer.images) {
            return false;
        }

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = (0, _getIterator3.default)(layer.images), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var entry = _step2.value;

                if (tile.extent.isInside(entry.extent)) {
                    return true;
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

        return false;
    },
    canTileTextureBeImproved: function canTileTextureBeImproved(layer, tile) {
        if (!layer.images) {
            return false;
        }
        var s = selectBestImageForExtent(layer.images, tile.extent);
        if (!s) {
            return false;
        }
        var mat = tile.material;
        var layerType = layer.type === 'color' ? _LayeredMaterialConstants.l_COLOR : _LayeredMaterialConstants.l_ELEVATION;
        var currentTexture = mat.getLayerTextures(layerType, layer.id)[0];
        if (!currentTexture.file) {
            return true;
        }
        return currentTexture.file != s.image;
    },
    executeCommand: function executeCommand(command) {
        var tile = command.requester;
        var layer = command.layer;
        return getTexture(tile, layer);
    }
};