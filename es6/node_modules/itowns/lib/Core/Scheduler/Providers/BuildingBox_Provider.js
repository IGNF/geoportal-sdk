'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _create = require('babel-runtime/core-js/object/create');

var _create2 = _interopRequireDefault(_create);

var _three = require('three');

var THREE = _interopRequireWildcard(_three);

var _earcut = require('earcut');

var _earcut2 = _interopRequireDefault(_earcut);

var _Provider = require('./Provider');

var _Provider2 = _interopRequireDefault(_Provider);

var _WFS_Provider = require('./WFS_Provider');

var _WFS_Provider2 = _interopRequireDefault(_WFS_Provider);

var _Coordinates = require('../../Geographic/Coordinates');

var _Coordinates2 = _interopRequireDefault(_Coordinates);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function BuildingBox_Provider(options) {
    // Constructor

    // Provider.call( this,new IoDriver_XBIL());
    // this.cache         = CacheRessource();
    this.WFS_Provider = new _WFS_Provider2.default(options);
    this.geometry = null;
    this.geometryRoof = null;
    this.pivot = null;
    this.roadOn = true;
    this.rtcOn = true;
} /*
   * To change this license header, choose License Headers in Project Properties.
   * To change this template file, choose Tools | Templates
   * and open the template in the editor.
   */

/**
 * Generated On: 2015-10-5
 * Class: WMTS_Provider
 * Description: Fournisseur de données à travers un flux WMTS
 */

// TODO , will use WFS_Provider


BuildingBox_Provider.prototype = (0, _create2.default)(_Provider2.default.prototype);
BuildingBox_Provider.prototype.constructor = BuildingBox_Provider;

/**
 * Return url wmts MNT
 * @param {number} longitude
 * @param {number} latitude
 * @param {number} radius
 * @returns {string}
 */
BuildingBox_Provider.prototype.url = function (longitude, latitude, radius) {
    // var key    = "wmybzw30d6zg563hjlq8eeqb";
    // var key    = coWMTS.zoom > 11 ? "va5orxd0pgzvq3jxutqfuy0b" : "wmybzw30d6zg563hjlq8eeqb"; // clef pro va5orxd0pgzvq3jxutqfuy0b

    var bottomLeft = new THREE.Vector2(longitude - radius, latitude - radius);

    // var layer  = "BDTOPO_BDD_WLD_WGS84G:bati_remarquable,BDTOPO_BDD_WLD_WGS84G:bati_indifferencie"

    var topRight = new THREE.Vector2(longitude + radius, latitude + radius);

    var url = 'http://wxs.ign.fr/' + '72hpsel8j8nhb5qgdh07gcyp' + '/geoportail/wfs?' + 'service=WFS&version=2.0.0&REQUEST=GetFeature&typeName=BDTOPO_BDD_WLD_WGS84G:bati_remarquable,BDTOPO_BDD_WLD_WGS84G:bati_indifferencie' + '&bbox=' + bottomLeft.x + ',' + bottomLeft.y + ',' + topRight.x + ',' + topRight.y + ',epsg:4326&outputFormat=json';

    return url;
};

BuildingBox_Provider.prototype.getData = function (bbox, altitude) {
    var _this = this;

    return this.WFS_Provider.getData(bbox).then(function (data) {
        _this.generateMesh(data, bbox, altitude); // console.log(data);
        return _this.geometry;
    });
};

BuildingBox_Provider.prototype.generateMesh = function (elements, bbox, altitude) {
    var roofGeometry = new THREE.Geometry(); // for the roof
    var _geometry = new THREE.Geometry(); // for the walls
    var geometry = new THREE.Geometry(); // for the roof
    // So we don't cut the roof
    var features = elements.features;
    var altitude_ground = altitude - 1.5; // 35;  // truck height

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = (0, _getIterator3.default)(features), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var feature = _step.value;

            var hauteur = feature.properties.hauteur + 10 || 0;
            var z_min = altitude_ground; // features[r].properties.z_min;  // altitude_ground // force altitude ground
            var polygon = feature.geometry.coordinates[0][0];

            var arrPoint2D = [];
            if (polygon.length > 2) {
                // VERTICES
                for (var j = 0; j < polygon.length - 1; ++j) {
                    var pt2DTab = polygon[j]; // .split(' ');
                    var p1 = new THREE.Vector3(parseFloat(pt2DTab[0]), 0, parseFloat(pt2DTab[1]));

                    var coordCarto1 = new _Coordinates2.default('EPSG:4326', p1.x, p1.z, z_min);
                    var coordCarto2 = new _Coordinates2.default('EPSG:4326', p1.x, p1.z, z_min + hauteur); // + Math.random(1000) );
                    var pgeo1 = coordCarto1.as('EPSG:4978').xyz();
                    var pgeo2 = coordCarto2.as('EPSG:4978').xyz();

                    var vector3_1 = new THREE.Vector3(pgeo1.x, pgeo1.y, pgeo1.z); // - x temporary, bug
                    var vector3_2 = new THREE.Vector3(pgeo2.x, pgeo2.y, pgeo2.z);

                    arrPoint2D.push(p1.z, p1.x);
                    _geometry.vertices.push(vector3_1, vector3_2);
                }

                // FACES
                // indice of the first point of the polygon 3D
                for (var k = _geometry.vertices.length - (polygon.length - 1) * 2; k < _geometry.vertices.length; k += 2) {
                    var l = k; // % (pts2DTab.length);
                    if (l > _geometry.vertices.length - 4) {
                        l = _geometry.vertices.length - (polygon.length - 1) * 2;
                    }
                    _geometry.faces.push(new THREE.Face3(l, l + 1, l + 3));
                    _geometry.faces.push(new THREE.Face3(l, l + 3, l + 2));
                }

                var ll = _geometry.vertices.length - (polygon.length - 1) * 2;
                _geometry.faces.push(new THREE.Face3(ll, ll + 1, _geometry.vertices.length - 1));
                _geometry.faces.push(new THREE.Face3(ll, _geometry.vertices.length - 1, _geometry.vertices.length - 2));
            }

            //* *************** ROOF ****************************

            var triangles = (0, _earcut2.default)(arrPoint2D);
            for (var w = 0; w < triangles.length; w += 3) {
                var pt1 = new THREE.Vector2(arrPoint2D[triangles[w] * 2], arrPoint2D[triangles[w] * 2 + 1]);
                var pt2 = new THREE.Vector2(arrPoint2D[triangles[w + 1] * 2], arrPoint2D[triangles[w + 1] * 2 + 1]);
                var pt3 = new THREE.Vector2(arrPoint2D[triangles[w + 2] * 2], arrPoint2D[triangles[w + 2] * 2 + 1]);
                var c1 = new _Coordinates.C.EPSG_4326(pt1.x, pt1.y, z_min + hauteur);
                var c2 = new _Coordinates.C.EPSG_4326(pt2.x, pt2.y, z_min + hauteur);
                var c3 = new _Coordinates.C.EPSG_4326(pt3.x, pt3.y, z_min + hauteur);

                roofGeometry.vertices.push(c1.as('EPSG:4978').xyz());
                roofGeometry.vertices.push(c2.as('EPSG:4978').xyz());
                roofGeometry.vertices.push(c3.as('EPSG:4978').xyz());

                var face = new THREE.Face3(geometry.vertices.length - 3, geometry.vertices.length - 2, geometry.vertices.length - 1);
                geometry.faces.push(face);
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

    if (this.roadOn) {
        this.addRoad(_geometry, bbox, altitude_ground);
    }

    _geometry.computeFaceNormals(); // WARNING : VERY IMPORTANT WHILE WORKING WITH RAY CASTING ON CUSTOM MESH
    geometry.computeFaceNormals();

    /*
        var matLambert = new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.8});
        var _currentMeshForRoof  = new THREE.Mesh(_geometry, matLambert);// //geometryClickToGo,mat);
        gfxEngine().add3DScene(_currentMeshForRoof);
    */

    // Test if we return brute geometry or if we use local pivot (for useRTC)
    var firstPos = new THREE.Vector3();
    if (this.rtcOn) {
        firstPos = _geometry.vertices[0].clone();
        // create pivot from 1st pos vertex
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = (0, _getIterator3.default)(_geometry.vertices), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var vertice = _step2.value;

                vertice.sub(firstPos);
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

        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
            for (var _iterator3 = (0, _getIterator3.default)(geometry.vertices), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var _vertice = _step3.value;

                _vertice.sub(firstPos);
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
    }

    this.geometry = _geometry;
    this.pivot = firstPos;
    this.geometryRoof = geometry;

    return {
        geometry: _geometry,
        pivot: firstPos,
        geometryRoof: geometry
    };
};

BuildingBox_Provider.prototype.addRoad = function (geometry, bbox, altitude_road) {
    // Version using SIMPLE PLANE ROAD for Click and Go
    var ratio = 0.2;
    var roadWidth = (bbox.east() - bbox.west()) * ratio;
    var roadHeight = (bbox.north() - bbox.south()) * ratio;
    var pos = new THREE.Vector3((bbox.south() + bbox.north()) / 2, altitude_road, (bbox.west() + bbox.east()) / 2); // 48.8505774,  altitude_sol, 2.3348124);

    var coordCarto1 = new _Coordinates2.default('EPSG:4326', pos.x - roadWidth, pos.z - roadHeight, altitude_road);
    var coordCarto2 = new _Coordinates2.default('EPSG:4326', pos.x - roadWidth, pos.z + roadHeight, altitude_road);
    var coordCarto3 = new _Coordinates2.default('EPSG:4326', pos.x + roadWidth, pos.z + roadHeight, altitude_road);
    var coordCarto4 = new _Coordinates2.default('EPSG:4326', pos.x + roadWidth, pos.z - roadHeight, altitude_road);

    var pgeo1 = coordCarto1.as('EPSG:4978').xyz();
    var pgeo2 = coordCarto2.as('EPSG:4978').xyz();
    var pgeo3 = coordCarto3.as('EPSG:4978').xyz();
    var pgeo4 = coordCarto4.as('EPSG:4978').xyz();

    geometry.vertices.push(new THREE.Vector3(pgeo1.x, pgeo1.y, pgeo1.z));
    geometry.vertices.push(new THREE.Vector3(pgeo2.x, pgeo2.y, pgeo2.z));
    geometry.vertices.push(new THREE.Vector3(pgeo3.x, pgeo3.y, pgeo3.z));
    geometry.vertices.push(new THREE.Vector3(pgeo4.x, pgeo4.y, pgeo4.z));

    var len = geometry.vertices.length;
    geometry.faces.push(new THREE.Face3(len - 4, len - 3, len - 2));
    geometry.faces.push(new THREE.Face3(len - 4, len - 2, len - 1));
};

exports.default = BuildingBox_Provider;