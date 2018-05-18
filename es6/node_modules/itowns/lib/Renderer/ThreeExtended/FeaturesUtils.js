'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function pointIsOverLine(point, linePoints, epsilon) {
    var x0 = point._values[0];
    var y0 = point._values[1];
    // for each segment of the line (j is i -1)
    for (var i = 1, j = 0; i < linePoints.length; j = i++) {
        /* **********************************************************
            norm     : norm of vector P1P2
            distance : distance point P0 to line P1P2
            scalar   : dot product of P1P0 and P1P2 divide by norm, it represents the projection of P0 on the line
             Point is over segment P1P2 if :
                * if the distance, , is inferior to epsilon
                * and if :  -epsilon ≤ scalar ≤ (||P1P2|| +  epsilon)
                             + (P0) _
                            |      |
                            |      |
             <---scalar---->|    distance
                            |      |
                            |      v
             +-------------------------------+
            (P1)                            (P2)
        *********************************************************** */

        var x1 = linePoints[i]._values[0];
        var y1 = linePoints[i]._values[1];
        var x2 = linePoints[j]._values[0];
        var y2 = linePoints[j]._values[1];

        var x21 = x2 - x1;
        var y21 = y2 - y1;
        var norm = Math.sqrt(x21 * x21 + y21 * y21);
        var scalar = ((x0 - x1) * x21 + (y0 - y1) * y21) / norm;

        if (scalar >= -epsilon && scalar <= norm + epsilon) {
            var distance = Math.abs(y21 * x0 - x21 * y0 + x2 * y1 - y2 * x1) / norm;
            if (distance <= epsilon) {
                return true;
            }
        }
    }

    return false;
}

function getClosestPoint(point, points, epsilon) {
    var x0 = point._values[0];
    var y0 = point._values[1];
    var squaredEpsilon = epsilon * epsilon;
    var closestPoint = void 0;
    for (var i = 0; i < points.length; ++i) {
        var x1 = points[i]._values[0];
        var y1 = points[i]._values[1];
        var xP = x0 - x1;
        var yP = y0 - y1;
        var n = xP * xP + yP * yP;
        if (n < squaredEpsilon) {
            closestPoint = points[i];
            squaredEpsilon = n;
        }
    }
    return closestPoint;
}

function pointIsInsidePolygon(point, polygonPoints) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

    var x = point._values[0];
    var y = point._values[1];

    var inside = false;
    // in first j is last point of polygon
    // for each segment of the polygon (j is i -1)
    for (var i = 0, j = polygonPoints.length - 1; i < polygonPoints.length; j = i++) {
        var xi = polygonPoints[i]._values[0];
        var yi = polygonPoints[i]._values[1];
        var xj = polygonPoints[j]._values[0];
        var yj = polygonPoints[j]._values[1];

        // isIntersect semi-infinite ray horizontally with polygon's edge

        if (yi > y != yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi) {
            inside = !inside;
        }
    }

    return inside;
}

function isFeatureUnderCoordinate(coordinate, type, coordinates, epsilon) {
    if (type == 'linestring' && pointIsOverLine(coordinate, coordinates, epsilon)) {
        return true;
    } else if (type == 'polygon' && pointIsInsidePolygon(coordinate, coordinates)) {
        return true;
    } else if (type == 'point') {
        var closestPoint = getClosestPoint(coordinate, coordinates, epsilon);
        if (closestPoint) {
            return { coordinates: closestPoint };
        }
    }
}

exports.default = {
    /**
     * filters the features that are under the coordinate
     *
     * @param      {Coordinates}  coordinate  the coordinate for the filter condition
     * @param      {Features}  features  features to filter
     * @param      {number}  epsilon  tolerance around the coordinate (in coordinate's unit)
     * @return     {array}  array of filters features
     */
    filterFeaturesUnderCoordinate: function filterFeaturesUnderCoordinate(coordinate, features) {
        var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.1;

        var result = [];
        if (features.geometries) {
            if (features.extent && !features.extent.isPointInside(coordinate, epsilon)) {
                return result;
            }
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = (0, _getIterator3.default)(features.geometries), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var feature = _step.value;

                    if (feature.extent && !feature.extent.isPointInside(coordinate, epsilon)) {
                        continue;
                    }
                    /* eslint-disable guard-for-in */
                    for (var id in feature.featureVertices) {
                        var polygon = feature.featureVertices[id];
                        if (polygon.extent && !polygon.extent.isPointInside(coordinate, epsilon)) {
                            continue;
                        }
                        var properties = features.features[id].properties;
                        var coordinates = feature.coordinates.slice(polygon.offset, polygon.offset + polygon.count);
                        var under = isFeatureUnderCoordinate(coordinate, feature.type, coordinates, epsilon);
                        if (under) {
                            result.push({
                                coordinates: under.coordinates || coordinates,
                                type: feature.type,
                                properties: properties
                            });
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
        } else if (features.geometry) {
            if (features.geometry.extent && !features.geometry.extent.isPointInside(coordinate, epsilon)) {
                return result;
            }
            var _under = isFeatureUnderCoordinate(coordinate, features.geometry.type, features.geometry.coordinates, epsilon);
            if (_under) {
                result.push({
                    coordinates: _under.coordinates || features.geometry.coordinates,
                    type: features.geometry.type,
                    properties: features.properties
                });
            }
        }
        return result;
    }
};