'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _three = require('three');

var THREE = _interopRequireWildcard(_three);

var _three2 = require('three.meshline');

var _three3 = _interopRequireDefault(_three2);

var _Fetcher = require('./Fetcher');

var _Fetcher2 = _interopRequireDefault(_Fetcher);

var _Coordinates = require('../../Geographic/Coordinates');

var _Coordinates2 = _interopRequireDefault(_Coordinates);

var _Capabilities = require('../../System/Capabilities');

var _Capabilities2 = _interopRequireDefault(_Capabilities);

var _dTiles_Provider = require('./3dTiles_Provider');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Generated On: 2016-07-07
 * Class: GpxUtils
 * Description: Parse Gpx file to get [lat, lon, alt]
 */

function _gpxToWayPointsArray(gpxXML) {
    return gpxXML.getElementsByTagName('wpt');
}

function _gGpxToWTrackPointsArray(gpxXML) {
    return gpxXML.getElementsByTagName('trkpt');
}

function _gGpxToWTrackSegmentsArray(gpxXML) {
    return gpxXML.getElementsByTagName('trkseg');
}

function _gpxPtToCartesian(pt, crs) {
    var longitude = Number(pt.attributes.lon.nodeValue);
    var latitude = Number(pt.attributes.lat.nodeValue);
    // TODO: get elevation with terrain
    var elem = pt.getElementsByTagName('ele')[0];
    var elevation = elem ? Number(elem.childNodes[0].nodeValue) : 0;

    return new _Coordinates2.default('EPSG:4326', longitude, latitude, elevation).as(crs).xyz();
}

var geometryPoint = new THREE.BoxGeometry(1, 1, 80);
var materialPoint = new THREE.MeshBasicMaterial({ color: 0xffffff });
var positionCamera = new THREE.Vector3();

function getDistance(object, camera) {
    var point = object.geometry.boundingSphere.center.clone().applyMatrix4(object.matrixWorld);
    positionCamera.setFromMatrixPosition(camera.matrixWorld);
    return positionCamera.distanceTo(point);
}

function updatePointScale(renderer, scene, camera) {
    var distance = getDistance(this, camera);
    var scale = Math.max(2, Math.min(100, distance / renderer.getSize().height));
    this.scale.set(scale, scale, scale);
    this.updateMatrixWorld();
}

function _gpxToWayPointsMesh(gpxXML, crs) {
    var wayPts = _gpxToWayPointsArray(gpxXML);

    if (wayPts.length) {
        var points = new THREE.Group();

        gpxXML.center = gpxXML.center || _gpxPtToCartesian(wayPts[0], crs);

        var lookAt = gpxXML.center.clone().negate();

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = (0, _getIterator3.default)(wayPts), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var wayPt = _step.value;

                var position = _gpxPtToCartesian(wayPt, crs).sub(gpxXML.center);
                // use Pin to make it more visible
                var mesh = new THREE.Mesh(geometryPoint, materialPoint);
                mesh.position.copy(position);
                mesh.lookAt(lookAt);

                // Scale pin in function of distance
                mesh.onBeforeRender = updatePointScale;

                points.add(mesh);
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

        return points;
    } else {
        return null;
    }
}

function updatePath(renderer, scene, camera) {
    var distance = getDistance(this, camera);
    this.material.depthTest = distance < this.geometry.boundingSphere.radius * 2;
    var size = renderer.getSize();
    this.material.uniforms.resolution.value.set(size.width, size.height);
}

function _gpxToWTrackPointsMesh(gpxXML, options) {
    var trackSegs = _gGpxToWTrackSegmentsArray(gpxXML);
    var masterObject = new THREE.Object3D();

    if (trackSegs.length) {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = (0, _getIterator3.default)(trackSegs), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var trackSeg = _step2.value;

                var trackPts = _gGpxToWTrackPointsArray(trackSeg);

                if (trackPts.length) {
                    gpxXML.center = gpxXML.center || _gpxPtToCartesian(trackPts[0], options.crs);

                    var geometry = new THREE.Geometry();

                    var _iteratorNormalCompletion3 = true;
                    var _didIteratorError3 = false;
                    var _iteratorError3 = undefined;

                    try {
                        for (var _iterator3 = (0, _getIterator3.default)(trackPts), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                            var trackPt = _step3.value;

                            var point = _gpxPtToCartesian(trackPt, options.crs).sub(gpxXML.center);
                            geometry.vertices.push(point);
                        }
                    } catch (err) {
                        _didIteratorError3 = true;
                        _iteratorError3 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                _iterator3.return();
                            }
                        } finally {
                            if (_didIteratorError3) {
                                throw _iteratorError3;
                            }
                        }
                    }

                    var line = new _three3.default.MeshLine();
                    line.setGeometry(geometry);
                    // Due to limitations in the ANGLE layer,
                    // with the WebGL renderer on Windows platforms
                    // lineWidth will always be 1 regardless of the set value
                    // Use MeshLine to fix it
                    var material = new _three3.default.MeshLineMaterial({
                        lineWidth: options.lineWidth || 12,
                        sizeAttenuation: 0,
                        color: new THREE.Color(0xFF0000)
                    });

                    if (_Capabilities2.default.isLogDepthBufferSupported()) {
                        material.fragmentShader = material.fragmentShader.replace(/.*/, '').substr(1);
                        (0, _dTiles_Provider.patchMaterialForLogDepthSupport)(material);
                        // eslint-disable-next-line no-console
                        console.warn('MeshLineMaterial shader has been patched to add log depth buffer support');
                    }

                    var pathMesh = new THREE.Mesh(line.geometry, material);
                    // update size screen uniform
                    // update depth test for visibilty path, because of the proximity of the terrain and gpx mesh
                    pathMesh.onBeforeRender = updatePath;
                    masterObject.add(pathMesh);
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

        return masterObject;
    } else {
        return null;
    }
}

function _gpxToMesh(gpxXML) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (!gpxXML) {
        return undefined;
    }

    if (options.enablePin == undefined) {
        options.enablePin = true;
    }

    var gpxMesh = new THREE.Object3D();

    // Getting the track points
    var trackPts = _gpxToWTrackPointsMesh(gpxXML, options);

    if (trackPts) {
        gpxMesh.add(trackPts);
    }

    if (options.enablePin) {
        // Getting the waypoint points
        var wayPts = _gpxToWayPointsMesh(gpxXML, options.crs);

        if (wayPts) {
            gpxMesh.add(wayPts);
        }
    }

    gpxMesh.position.copy(gpxXML.center);
    gpxMesh.updateMatrixWorld();
    // gpxMesh is static data, it doens't need matrix update
    gpxMesh.matrixAutoUpdate = false;

    return gpxMesh;
}

exports.default = {
    /** @module gpxUtils */
    /** Load gpx file and convert to THREE.Mesh
     * @function load
     * @param {string} urlFile  The url of gpx file
     * @param {string} crs - The default CRS of Three.js coordinates. Should be a cartesian CRS.
     * @param {Object=} options Optional properties.
     * @param {boolean=} [options.enablePin=true] draw pin for way points
     * @param {NetworkOptions=} options.networkOptions Options for fetching resources over network
     * @param {number=} [options.lineWidth=12] set line width to track line
     * @return {THREE.Mesh} Three.js Mesh see {@link https://threejs.org/docs/#api/objects/Mesh}
     * @example
     * // How add gpx object
     * itowns.GpxUtils.load(url, viewer.referenceCrs).then((gpx) => {
     *      if (gpx) {
     *         viewer.scene.add(gpx);
     *         viewer.notifyChange(true);
     *      }
     * });
     *
     */
    load: function load(urlFile, crs) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        options.crs = crs;
        return _Fetcher2.default.xml(urlFile, options.networkOptions).then(function (gpxXML) {
            return _gpxToMesh(gpxXML, options);
        });
    }
};