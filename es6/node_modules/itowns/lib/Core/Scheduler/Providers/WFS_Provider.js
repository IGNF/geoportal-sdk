'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _create = require('babel-runtime/core-js/object/create');

var _create2 = _interopRequireDefault(_create);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _Extent = require('../../Geographic/Extent');

var _Extent2 = _interopRequireDefault(_Extent);

var _Provider = require('./Provider');

var _Provider2 = _interopRequireDefault(_Provider);

var _Fetcher = require('./Fetcher');

var _Fetcher2 = _interopRequireDefault(_Fetcher);

var _CacheRessource = require('./CacheRessource');

var _CacheRessource2 = _interopRequireDefault(_CacheRessource);

var _GeoJSON2Features = require('../../../Renderer/ThreeExtended/GeoJSON2Features');

var _GeoJSON2Features2 = _interopRequireDefault(_GeoJSON2Features);

var _Feature2Mesh = require('../../../Renderer/ThreeExtended/Feature2Mesh');

var _Feature2Mesh2 = _interopRequireDefault(_Feature2Mesh);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Generated On: 2016-03-5
 * Class: WFS_Provider
 * Description: Provides data from a WFS stream
 */

function WFS_Provider() {
    this.cache = (0, _CacheRessource2.default)();
    this.pointOrder = new _map2.default();
}

WFS_Provider.prototype = (0, _create2.default)(_Provider2.default.prototype);
WFS_Provider.prototype.constructor = WFS_Provider;

WFS_Provider.prototype.url = function (bbox, layer) {
    var box = bbox.as(layer.projection);
    var w = box.west();
    var s = box.south();
    var e = box.east();
    var n = box.north();

    // TODO: use getPointOrder


    return layer.customUrl.replace('%bbox', w + ',' + s + ',' + e + ',' + n);
};

WFS_Provider.prototype.preprocessDataLayer = function (layer) {
    if (!layer.typeName) {
        throw new Error('layer.typeName is required.');
    }
    layer.format = layer.options.mimetype || 'json';
    layer.crs = layer.projection || 'EPSG:4326';
    layer.version = layer.version || '2.0.2';
    layer.opacity = layer.opacity || 1;
    layer.wireframe = layer.wireframe || false;
    if (!(layer.extent instanceof _Extent2.default)) {
        layer.extent = new _Extent2.default(layer.projection, layer.extent);
    }
    layer.customUrl = layer.url + 'SERVICE=WFS&REQUEST=GetFeature&typeName=' + layer.typeName + '&VERSION=' + layer.version + '&SRSNAME=' + layer.crs + '&outputFormat=' + layer.format + '&BBOX=%bbox,' + layer.crs;
};

WFS_Provider.prototype.tileInsideLimit = function (tile, layer) {
    return (layer.level === undefined || tile.level === layer.level) && layer.extent.intersectsExtent(tile.extent);
};

WFS_Provider.prototype.executeCommand = function (command) {
    var layer = command.layer;
    var tile = command.requester;
    var destinationCrs = command.view.referenceCrs;

    // TODO : support xml, gml2
    var supportedFormats = {
        json: this.getFeatures.bind(this),
        geojson: this.getFeatures.bind(this)
    };

    var func = supportedFormats[layer.format];
    if (func) {
        return func(destinationCrs, tile, layer, command).then(function (result) {
            return command.resolve(result);
        });
    } else {
        return _promise2.default.reject(new Error('Unsupported mimetype ' + layer.format));
    }
};

function assignLayer(object, layer) {
    if (object) {
        object.layer = layer.id;
        object.layers.set(layer.threejsLayer);
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = (0, _getIterator3.default)(object.children), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var c = _step.value;

                assignLayer(c, layer);
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

        return object;
    }
}

WFS_Provider.prototype.getFeatures = function (crs, tile, layer) {
    if (!layer.tileInsideLimit(tile, layer) || tile.material === null) {
        return _promise2.default.resolve();
    }

    var url = this.url(tile.extent.as(layer.crs), layer);
    var result = {};

    result.feature = this.cache.getRessource(url);

    if (result.feature !== undefined) {
        return _promise2.default.resolve(result);
    }

    layer.convert = layer.convert ? layer.convert : _Feature2Mesh2.default.convert({});

    return _Fetcher2.default.json(url, layer.networkOptions).then(function (geojson) {
        return assignLayer(layer.convert(_GeoJSON2Features2.default.parse(crs, geojson, tile.extent, { filter: layer.filter })), layer);
    });
};

WFS_Provider.prototype.getPointOrder = function (crs) {
    if (this.pointOrder[crs]) {
        return this.pointOrder[crs];
    }

    var pointOrder = { lat: 0, long: 1 };

    if (crs.type == 'EPSG' && crs.properties.code == '4326') {
        pointOrder.long = 0;
        pointOrder.lat = 1;
        return pointOrder;
    } else if (crs.type == 'name') {
        if (crs.properties.name) {
            var regExpEpsg = new RegExp(/^urn:[x-]?ogc:def:crs:EPSG:(\d*.?\d*)?:\d{4}/);
            if (regExpEpsg.test(crs.properties.name)) {
                return pointOrder;
            } else {
                var regExpOgc = new RegExp(/^urn:[x-]?ogc:def:crs:OGC:(\d*.?\d*)?:(CRS)?(WSG)?\d{0,2}/);
                if (regExpOgc.test(crs.properties.name)) {
                    pointOrder.long = 0;
                    pointOrder.lat = 1;
                    return pointOrder;
                }
            }
        }
    }
};

exports.default = WFS_Provider;