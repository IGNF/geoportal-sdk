'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _create = require('babel-runtime/core-js/object/create');

var _create2 = _interopRequireDefault(_create);

var _jszip = require('jszip');

var _jszip2 = _interopRequireDefault(_jszip);

var _three = require('three');

var THREE = _interopRequireWildcard(_three);

var _Coordinates = require('../../Core/Geographic/Coordinates');

var _Coordinates2 = _interopRequireDefault(_Coordinates);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function KMZLoader() {
    this.colladaLoader = new THREE.ColladaLoader();
    this.colladaLoader.options.convertUpAxis = true;
    this.cache = [];
} /**
   * @author mrdoob / http://mrdoob.com/
   */

KMZLoader.prototype = (0, _create2.default)(KMZLoader.prototype);

KMZLoader.prototype.constructor = KMZLoader;

KMZLoader.prototype.parseCollada = function (buffer) {
    var zip = new _jszip2.default(buffer);
    var collada;
    var coordCarto;

    for (var name in zip.files) {
        if (name.toLowerCase().substr(-4) === '.dae') {
            collada = this.colladaLoader.parse(zip.file(name).asText());
        } else if (name.toLowerCase().substr(-4) === '.kml') {
            var parser = new DOMParser();
            var doc = parser.parseFromString(zip.file(name).asText(), 'text/xml');

            var longitude = Number(doc.getElementsByTagName('longitude')[0].childNodes[0].nodeValue);
            var latitude = Number(doc.getElementsByTagName('latitude')[0].childNodes[0].nodeValue);
            var altitude = Number(doc.getElementsByTagName('altitude')[0].childNodes[0].nodeValue);

            coordCarto = new _Coordinates2.default('EPSG:4326', longitude, latitude, altitude);
        }
    }

    collada.coorCarto = coordCarto;
    return collada;
};

KMZLoader.prototype.load = function (url) {
    var _this = this;

    return fetch(url).then(function (response) {
        if (response.status < 200 || response.status >= 300) {
            throw new Error('Error loading ' + url + ': status ' + response.status);
        }
        return response.arrayBuffer();
    }).then(function (buffer) {
        return _this.parseCollada(buffer);
    });
};

exports.default = KMZLoader;