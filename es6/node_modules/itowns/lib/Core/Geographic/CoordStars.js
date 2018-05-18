'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Coordinates = require('./Coordinates');

var _Coordinates2 = _interopRequireDefault(_Coordinates);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CoordStars = {
    getSunPosition: function getSunPosition() {
        var m = Math;
        var PI = m.PI;
        var sin = m.sin;
        var cos = m.cos;
        var tan = m.tan;
        var asin = m.asin;
        var atan = m.atan2;

        var rad = PI / 180;

        var e = rad * 23.4397; // obliquity of the Earth

        function toJulian(date) {
            return date.valueOf() / (1000 * 60 * 60 * 24) - 0.5 + 2440588;
        }

        function toDays(date) {
            return toJulian(date) - 2451545;
        }

        function getRightAscension(l, b) {
            return atan(sin(l) * cos(e) - tan(b) * sin(e), cos(l));
        }

        function getDeclination(l, b) {
            return asin(sin(b) * cos(e) + cos(b) * sin(e) * sin(l));
        }

        function getAzimuth(H, phi, dec) {
            return atan(sin(H), cos(H) * sin(phi) - tan(dec) * cos(phi));
        }

        function getAltitude(H, phi, dec) {
            return asin(sin(phi) * sin(dec) + cos(phi) * cos(dec) * cos(H));
        }

        function getSiderealTime(d, lw) {
            return rad * (280.16 + 360.9856235 * d) - lw;
        }

        function getSolarMeanAnomaly(d) {
            return rad * (357.5291 + 0.98560028 * d);
        }

        function getEquationOfCenter(M) {
            return rad * (1.9148 * sin(M) + 0.0200 * sin(2 * M) + 0.0003 * sin(3 * M));
        }

        function getEclipticLongitude(M, C) {
            // perihelion of the Earth
            return M + C + rad * 102.9372 + PI;
        }

        return function (date, lat, lon) {
            var phi = rad * lat;
            var d = toDays(date);
            var M = getSolarMeanAnomaly(d);
            var C = getEquationOfCenter(M);
            var L = getEclipticLongitude(M, C);
            var D = getDeclination(L, 0);
            var A = getRightAscension(L, 0);
            var t = getSiderealTime(d, rad * -lon);
            var H = t - A;

            return {
                EclipticLongitude: L,
                declinaison: D,
                ascension: A,
                H: H,
                SiderealTime: t,
                altitude: getAltitude(H, phi, D),
                azimuth: getAzimuth(H, phi, D) + PI / 2 // + PI// - PI/2 // origin: north !!! not like original Mourner code but more classical ref
            };
        };
    },


    // Return scene coordinate ({x,y,z}) of sun
    getSunPositionInScene: function getSunPositionInScene(date, lat, lon) {
        var sun = CoordStars.getSunPosition()(date, lat, lon);
        var dayMilliSec = 24 * 3600000;
        var longitude = sun.ascension + date % dayMilliSec / dayMilliSec * -360 + 180; // cause midday
        var coSunCarto = new _Coordinates2.default('EPSG:4326', longitude, lat, 50000000).as('EPSG:4978').xyz();

        return coSunCarto;
    }
}; /**
    * Generated On: 2016-02-25
    * Class: CoordStars
    * Description: get coord of stars like earth...
    */
exports.default = CoordStars;