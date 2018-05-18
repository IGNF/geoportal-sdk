'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Fetcher = require('./Fetcher');

var _Fetcher2 = _interopRequireDefault(_Fetcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var portableXBIL = function (buffer) {
    this.floatArray = new Float32Array(buffer);
    this.max = undefined;
    this.min = undefined;
    this.texture = null;
};

function IoDriver_XBIL() {}

IoDriver_XBIL.prototype.computeMinMaxElevation = function (buffer, width, height, offsetScale) {
    var min = 1000000;
    var max = -1000000;

    if (!buffer) {
        return { min: null, max: null };
    }

    var sizeX = offsetScale ? Math.floor(offsetScale.z * width) : buffer.length;
    var sizeY = offsetScale ? Math.floor(offsetScale.z * height) : 1;
    var xs = offsetScale ? Math.floor(offsetScale.x * width) : 0;
    var ys = offsetScale ? Math.floor(offsetScale.y * height) : 0;

    var inc = offsetScale ? Math.max(Math.floor(sizeX / 8), 2) : 16;

    for (var y = ys; y < ys + sizeY; y += inc) {
        var pit = y * (width || 0);
        for (var x = xs; x < xs + sizeX; x += inc) {
            var val = buffer[pit + x];
            if (val > -10.0 && val !== undefined) {
                max = Math.max(max, val);
                min = Math.min(min, val);
            }
        }
    }

    if (max === -1000000 || min === 1000000) {
        return { min: null, max: null };
    }
    return { min: min, max: max };
};

IoDriver_XBIL.prototype.parseXBil = function (buffer, url) {
    if (!buffer) {
        throw new Error('Error processing XBIL');
    }

    var result = new portableXBIL(buffer);

    var elevation = this.computeMinMaxElevation(result.floatArray);

    result.min = elevation.min;
    result.max = elevation.max;

    result.url = url;

    return result;
};

IoDriver_XBIL.prototype.read = function (url, networkOptions) {
    var _this = this;

    return _Fetcher2.default.arrayBuffer(url, networkOptions).then(function (buffer) {
        return _this.parseXBil(buffer, url);
    });
};

exports.default = IoDriver_XBIL;