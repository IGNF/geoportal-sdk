'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _three = require('three');

var THREE = _interopRequireWildcard(_three);

var _togeojson = require('togeojson');

var _togeojson2 = _interopRequireDefault(_togeojson);

var _Extent = require('../../Geographic/Extent');

var _Extent2 = _interopRequireDefault(_Extent);

var _Feature2Texture = require('../../../Renderer/ThreeExtended/Feature2Texture');

var _Feature2Texture2 = _interopRequireDefault(_Feature2Texture);

var _GeoJSON2Features = require('../../../Renderer/ThreeExtended/GeoJSON2Features');

var _GeoJSON2Features2 = _interopRequireDefault(_GeoJSON2Features);

var _Fetcher = require('./Fetcher');

var _Fetcher2 = _interopRequireDefault(_Fetcher);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Class: Raster_Provider
 * Description: Provides textures from a vector data
 */

var supportedFormats = ['vector/kml', 'vector/gpx', 'vector/geojson'];

var fetcher = {
    'vector/kml': _Fetcher2.default.xml,
    'vector/gpx': _Fetcher2.default.xml,
    'vector/geojson': _Fetcher2.default.json
};

function getExtension(path) {
    path = String(path);
    var basename = path.split(/[\\/]/).pop();
    var pos = basename.lastIndexOf('.');
    if (basename === '' || pos < 1) {
        return '';
    }
    return basename.slice(pos + 1);
}

function getExtentFromGpxFile(file) {
    var bound = file.getElementsByTagName('bounds')[0];
    if (bound) {
        var west = bound.getAttribute('minlon');
        var east = bound.getAttribute('maxlon');
        var south = bound.getAttribute('minlat');
        var north = bound.getAttribute('maxlat');
        return new _Extent2.default('EPSG:4326', west, east, south, north);
    }
    return new _Extent2.default('EPSG:4326', -180, 180, -90, 90);
}

function createTextureFromVector(tile, layer) {
    if (!tile.material) {
        return _promise2.default.resolve();
    }

    if (layer.type == 'color') {
        var coords = tile.extent.as(layer.projection);
        var result = { pitch: new THREE.Vector4(0, 0, 1, 1) };
        result.texture = _Feature2Texture2.default.createTextureFromFeature(layer.feature, tile.extent, 256, layer.style);
        result.texture.extent = tile.extent;
        result.texture.coords = coords;
        result.texture.coords.zoom = tile.level;

        if (layer.transparent) {
            result.texture.premultiplyAlpha = true;
        }
        return _promise2.default.resolve(result);
    } else {
        return _promise2.default.resolve();
    }
}

exports.default = {
    preprocessDataLayer: function preprocessDataLayer(layer) {
        if (!layer.url) {
            throw new Error('layer.url is required');
        }

        var extention = getExtension(layer.url).toLowerCase();
        var format = 'vector/' + extention;
        layer.options = layer.options || {};

        if (!supportedFormats.includes(format) && !layer.options.mimetype) {
            return _promise2.default.reject(new Error('layer.options.mimetype is required'));
        } else {
            return fetcher[format](layer.url).then(function (file) {
                // Know if it's an xml file, then it can be kml or gpx
                if (file.getElementsByTagName) {
                    if (file.getElementsByTagName('kml')[0]) {
                        layer.options.mimetype = 'vector/kml';
                        // KML crs specification : 'EPSG:4326'
                        layer.projection = layer.projection || 'EPSG:4326';
                    } else if (file.getElementsByTagName('gpx')[0]) {
                        // GPX crs specification : 'EPSG:4326'
                        layer.options.mimetype = 'vector/gpx';
                        layer.projection = layer.projection || 'EPSG:4326';
                    } else {
                        throw new Error('Unsupported xml file data vector');
                    }
                    // Know if it's an geojson file
                } else if (file.type == 'Feature' || file.type == 'FeatureCollection') {
                    layer.options.mimetype = 'vector/geojson';
                } else {
                    throw new Error('Unsupported json file data vector');
                }

                if (!(layer.extent instanceof _Extent2.default)) {
                    layer.extent = new _Extent2.default(layer.projection, layer.extent);
                }

                if (!layer.options.zoom) {
                    layer.options.zoom = { min: 5, max: 21 };
                }

                layer.format = layer.options.mimetype;
                layer.style = layer.style || {};

                // Rasterization of data vector
                // It shouldn't use parent's texture outside the extent
                // Otherwise artefacts appear at the outer edge
                layer.noTextureParentOutsideLimit = true;
                var options = { buildExtent: true, crsIn: layer.projection };

                if (layer.options.mimetype === 'vector/geojson') {
                    layer.feature = _GeoJSON2Features2.default.parse(layer.reprojection, file, layer.extent, options);
                    layer.extent = layer.feature.extent || layer.feature.geometry.extent;
                } else if (layer.options.mimetype === 'vector/kml') {
                    var geojson = _togeojson2.default.kml(file);
                    layer.feature = _GeoJSON2Features2.default.parse(layer.reprojection, geojson, layer.extent, options);
                    layer.extent = layer.feature.extent;
                } else if (layer.options.mimetype === 'vector/gpx') {
                    var _geojson = _togeojson2.default.gpx(file);
                    layer.style.stroke = layer.style.stroke || 'red';
                    layer.extent = getExtentFromGpxFile(file);
                    layer.feature = _GeoJSON2Features2.default.parse(layer.reprojection, _geojson, layer.extent, options);
                    layer.extent = layer.feature.extent;
                }
                // GeoJSON2Features.parse reprojects in local tile texture space
                // Rasterizer gives textures in this new reprojection space
                // layer.projection is now reprojection
                layer.originalprojection = layer.projection;
                layer.projection = layer.reprojection;
            });
        }
    },
    tileInsideLimit: function tileInsideLimit(tile, layer) {
        return tile.level >= layer.options.zoom.min && tile.level <= layer.options.zoom.max && layer.extent.intersectsExtent(tile.extent);
    },
    executeCommand: function executeCommand(command) {
        var layer = command.layer;
        if (!supportedFormats.includes(layer.format)) {
            return _promise2.default.reject(new Error('Unsupported mimetype ' + layer.format));
        }
        var tile = command.requester;

        return createTextureFromVector(tile, layer);
    }
};