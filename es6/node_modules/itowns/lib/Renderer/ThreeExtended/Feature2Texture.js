'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _three = require('three');

var THREE = _interopRequireWildcard(_three);

var _Coordinates = require('../../Core/Geographic/Coordinates');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pt = new THREE.Vector2();

function drawPolygon(ctx, vertices, origin, dimension, properties) {
    var style = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

    if (vertices.length === 0) {
        return;
    }
    // compute scale transformation extent to canvas
    //
    var scale = new THREE.Vector2(ctx.canvas.width / dimension.x, ctx.canvas.width / dimension.y);
    ctx.beginPath();
    pt.x = vertices[0]._values[0] - origin.x;
    pt.y = vertices[0]._values[1] - origin.y;
    pt.multiply(scale);
    // Place the first point
    ctx.moveTo(pt.x, pt.y);
    vertices.shift();

    // build path
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = (0, _getIterator3.default)(vertices), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var vertice = _step.value;

            pt.x = vertice._values[0] - origin.x;
            pt.y = vertice._values[1] - origin.y;
            pt.multiply(scale);
            ctx.lineTo(pt.x, pt.y);
        }

        // draw line polygon
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

    if (style.stroke || properties.stroke) {
        ctx.strokeStyle = style.stroke || properties.stroke;
        ctx.lineWidth = style.strokeWidth || properties['stroke-width'] || 2.0;
        ctx.globalAlpha = style.strokeOpacity || properties['stroke-opacity'] || 1.0;
        ctx.stroke();
    }

    // fill polygon
    if (style.fill || properties.fill) {
        ctx.closePath();
        ctx.fillStyle = style.fill || properties.fill;
        ctx.globalAlpha = style.fillOpacity || properties['fill-opacity'] || 1.0;
        ctx.fill();
    }
}

function drawPoint(ctx, vertice, origin, dimension) {
    var style = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

    var scale = new THREE.Vector2(ctx.canvas.width / dimension.x, ctx.canvas.width / dimension.y);
    pt.x = vertice._values[0] - origin.x;
    pt.y = vertice._values[1] - origin.y;
    pt.multiply(scale);

    ctx.beginPath();
    ctx.arc(pt.x, pt.y, style.radius || 3, 0, 2 * Math.PI, false);
    ctx.fillStyle = style.fill || 'white';
    ctx.fill();
    ctx.lineWidth = style.lineWidth || 1.0;
    ctx.strokeStyle = style.stroke || 'red';
    ctx.stroke();
}

function drawFeature(ctx, feature, origin, dimension, extent) {
    var style = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

    var properties = feature.properties;
    var coordinates = feature.geometry.coordinates.slice();
    if (feature.geometry.type === 'point') {
        drawPoint(ctx, coordinates[0], origin, dimension, style);
    } else if (feature.geometry.extent.intersectsExtent(extent)) {
        ctx.globalCompositeOperation = 'destination-over';
        drawPolygon(ctx, coordinates, origin, dimension, properties, style);
    }
}

function drawFeatureCollection(ctx, collection, origin, dimension, extent) {
    var style = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = (0, _getIterator3.default)(collection.geometries), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var features = _step2.value;

            /* eslint-disable guard-for-in */
            if (features.extent.intersectsExtent(extent)) {
                for (var id in features.featureVertices) {
                    var polygon = features.featureVertices[id];
                    var properties = collection.features[id].properties;
                    var coordinates = features.coordinates.slice(polygon.offset, polygon.offset + polygon.count);
                    if (features.type === 'point') {
                        drawPoint(ctx, coordinates[0], origin, dimension, style);
                    } else if (polygon.extent.intersectsExtent(extent)) {
                        ctx.globalCompositeOperation = 'destination-over';
                        drawPolygon(ctx, coordinates, origin, dimension, properties, style);
                    }
                }
            }
        }
        /* eslint-enable guard-for-in */
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
}

exports.default = {
    createTextureFromFeature: function createTextureFromFeature(feature, extent, sizeTexture, style) {
        // A texture is instancied drawn canvas
        // origin and dimension are used to transform the feature's coordinates to canvas's space
        var origin = new THREE.Vector2(extent.west(_Coordinates.UNIT.DEGREE), extent.south(_Coordinates.UNIT.DEGREE));
        var dimension = extent.dimensions(_Coordinates.UNIT.DEGREE);
        var c = document.createElement('canvas');

        c.width = sizeTexture;
        c.height = sizeTexture;
        var ctx = c.getContext('2d');

        // Draw the canvas
        if (feature.geometries) {
            drawFeatureCollection(ctx, feature, origin, dimension, extent, style);
        } else {
            drawFeature(ctx, feature, origin, dimension, extent, style);
        }

        var texture = new THREE.Texture(c);
        texture.flipY = false;
        texture.generateMipmaps = false;
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearFilter;
        texture.needsUpdate = true;
        return texture;
    }
};