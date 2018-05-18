'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _three = require('three');

var THREE = _interopRequireWildcard(_three);

var _Extent = require('../../Geographic/Extent');

var _Extent2 = _interopRequireDefault(_Extent);

var _OGCWebServiceHelper = require('./OGCWebServiceHelper');

var _OGCWebServiceHelper2 = _interopRequireDefault(_OGCWebServiceHelper);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Return url wmts MNT
 * @param {String} options.url: service base url
 * @param {String} options.layer: requested data layer
 * @param {String} options.format: image format (default: format/jpeg)
 */
function WMS_Provider() {} /**
                            * Generated On: 2015-10-5
                            * Class: WMS_Provider
                            * Description: Provides data from a WMS stream
                            */

WMS_Provider.prototype.url = function (bbox, layer) {
    var box = bbox.as(layer.projection);
    var w = box.west();
    var s = box.south();
    var e = box.east();
    var n = box.north();

    var bboxInUnit = layer.axisOrder === 'swne' ? s + ',' + w + ',' + n + ',' + e : w + ',' + s + ',' + e + ',' + n;

    return layer.customUrl.replace('%bbox', bboxInUnit);
};

WMS_Provider.prototype.tileTextureCount = function (tile, layer) {
    return tile.extent.crs() == layer.projection ? 1 : tile.getCoordsForLayer(layer).length;
};

WMS_Provider.prototype.preprocessDataLayer = function (layer) {
    if (!layer.name) {
        throw new Error('layer.name is required.');
    }
    if (!layer.extent) {
        throw new Error('layer.extent is required');
    }
    if (!layer.projection) {
        throw new Error('layer.projection is required');
    }

    if (!(layer.extent instanceof _Extent2.default)) {
        layer.extent = new _Extent2.default(layer.projection, layer.extent);
    }

    if (!layer.options.zoom) {
        layer.options.zoom = { min: 0, max: 21 };
    }

    layer.format = layer.options.mimetype || 'image/png';
    layer.width = layer.heightMapWidth || 256;
    layer.version = layer.version || '1.3.0';
    layer.style = layer.style || '';
    layer.transparent = layer.transparent || false;

    if (!layer.axisOrder) {
        // 4326 (lat/long) axis order depends on the WMS version used
        if (layer.projection == 'EPSG:4326') {
            // EPSG 4326 x = lat, long = y
            // version 1.1.0 long/lat while version 1.3.0 mandates xy (so lat,long)
            layer.axisOrder = layer.version === '1.1.0' ? 'wsen' : 'swne';
        } else {
            // xy,xy order
            layer.axisOrder = 'wsen';
        }
    }
    var crsPropName = 'SRS';
    if (layer.version === '1.3.0') {
        crsPropName = 'CRS';
    }

    layer.customUrl = layer.url + '?SERVICE=WMS&REQUEST=GetMap&LAYERS=' + layer.name + '&VERSION=' + layer.version + '&STYLES=' + layer.style + '&FORMAT=' + layer.format + '&TRANSPARENT=' + layer.transparent + '&BBOX=%bbox' + ('&' + crsPropName + '=' + layer.projection + '&WIDTH=' + layer.width + '&HEIGHT=' + layer.width);
};

WMS_Provider.prototype.tileInsideLimit = function (tile, layer) {
    return tile.level >= layer.options.zoom.min && tile.level <= layer.options.zoom.max && layer.extent.intersectsExtent(tile.extent);
};

WMS_Provider.prototype.getColorTexture = function (tile, layer, targetLevel, tileCoords) {
    if (!this.tileInsideLimit(tile, layer)) {
        return _promise2.default.reject('Tile \'' + tile + '\' is outside layer bbox ' + layer.extent);
    }
    if (tile.material === null) {
        return _promise2.default.resolve();
    }

    var extent = tileCoords ? tileCoords.as(layer.projection) : tile.extent;
    // if no specific level requester, use tile.level
    if (targetLevel === undefined) {
        targetLevel = tile.level;
    } else if (!tileCoords) {
        var parentAtLevel = tile;
        while (parentAtLevel && parentAtLevel.level > targetLevel) {
            parentAtLevel = parentAtLevel.parent;
        }
        if (!parentAtLevel) {
            return _promise2.default.reject('Invalid targetLevel requested ' + targetLevel);
        }
        extent = parentAtLevel.extent;
        targetLevel = parentAtLevel.level;
    }

    var coords = extent.as(layer.projection);
    var url = this.url(coords, layer);
    var pitch = tileCoords ? new THREE.Vector4(0, 0, 1, 1) : tile.extent.offsetToParent(extent);
    var result = { pitch: pitch };

    return _OGCWebServiceHelper2.default.getColorTextureByUrl(url, layer.networkOptions).then(function (texture) {
        result.texture = texture;
        result.texture.extent = extent;
        if (layer.transparent) {
            texture.premultiplyAlpha = true;
        }
        if (tileCoords) {
            result.texture.coords = tileCoords;
        } else {
            result.texture.coords = coords;
            // LayeredMaterial expects coords.zoom to exist, and describe the
            // precision of the texture (a la WMTS).
            result.texture.coords.zoom = targetLevel;
        }
        return result;
    });
};

WMS_Provider.prototype.executeCommand = function (command) {
    var tile = command.requester;

    var layer = command.layer;
    var getTextureFunction = tile.extent.crs() == layer.projection ? this.getColorTexture : this.getColorTextures;
    var supportedFormats = {
        'image/png': getTextureFunction.bind(this),
        'image/jpg': getTextureFunction.bind(this),
        'image/jpeg': getTextureFunction.bind(this)
    };

    var func = supportedFormats[layer.format];

    if (func) {
        return func(tile, layer, command.targetLevel);
    } else {
        return _promise2.default.reject(new Error('Unsupported mimetype ' + layer.format));
    }
};

// In the case where the tilematrixset of the tile don't correspond to the projection of the layer
// when the projection of the layer corresponds to a tilematrixset inside the tile, like the PM
WMS_Provider.prototype.getColorTextures = function (tile, layer, targetLevel) {
    if (tile.material === null) {
        return _promise2.default.resolve();
    }
    var promises = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = (0, _getIterator3.default)(tile.getCoordsForLayer(layer)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var coord = _step.value;

            promises.push(this.getColorTexture(tile, layer, targetLevel, coord));
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

    return _promise2.default.all(promises);
};

exports.default = WMS_Provider;