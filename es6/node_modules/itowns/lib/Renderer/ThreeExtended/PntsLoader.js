'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _three = require('three');

var THREE = _interopRequireWildcard(_three);

var _BatchTable = require('./BatchTable');

var _BatchTable2 = _interopRequireDefault(_BatchTable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = {
    parse: function (buffer, textDecoder) {
        if (!buffer) {
            throw new Error('No array buffer provided.');
        }
        var view = new DataView(buffer);

        var byteOffset = 0;
        var pntsHeader = {};
        var batchTable = {};
        var point = {};

        // Magic type is unsigned char [4]
        pntsHeader.magic = textDecoder.decode(new Uint8Array(buffer, byteOffset, 4));
        byteOffset += 4;

        if (pntsHeader.magic) {
            // Version, byteLength, batchTableJSONByteLength, batchTableBinaryByteLength and batchTable types are uint32
            pntsHeader.version = view.getUint32(byteOffset, true);
            byteOffset += Uint32Array.BYTES_PER_ELEMENT;

            pntsHeader.byteLength = view.getUint32(byteOffset, true);
            byteOffset += Uint32Array.BYTES_PER_ELEMENT;

            pntsHeader.FTJSONLength = view.getUint32(byteOffset, true);
            byteOffset += Uint32Array.BYTES_PER_ELEMENT;

            pntsHeader.FTBinaryLength = view.getUint32(byteOffset, true);
            byteOffset += Uint32Array.BYTES_PER_ELEMENT;

            pntsHeader.BTJSONLength = view.getUint32(byteOffset, true);
            byteOffset += Uint32Array.BYTES_PER_ELEMENT;

            pntsHeader.BTBinaryLength = view.getUint32(byteOffset, true);
            byteOffset += Uint32Array.BYTES_PER_ELEMENT;

            // binary table
            if (pntsHeader.FTBinaryLength > 0) {
                point = parseFeatureBinary(buffer, byteOffset, pntsHeader.FTJSONLength, textDecoder);
            }

            // batch table
            if (pntsHeader.BTJSONLength > 0) {
                var sizeBegin = 28 + pntsHeader.FTJSONLength + pntsHeader.FTBinaryLength;
                batchTable = _BatchTable2.default.parse(buffer.slice(sizeBegin, pntsHeader.BTJSONLength + sizeBegin), textDecoder);
            }

            var pnts = { point: point, batchTable: batchTable };
            return pnts;
        } else {
            throw new Error('Invalid pnts file.');
        }
    }
};


function parseFeatureBinary(array, byteOffset, FTJSONLength, textDecoder) {
    // Init geometry
    var geometry = new THREE.BufferGeometry();
    var material = new THREE.PointsMaterial({ size: 0.05, vertexColors: THREE.VertexColors, sizeAttenuation: true });

    // init Array feature binary
    var subArrayJson = textDecoder.decode(new Uint8Array(array, byteOffset, FTJSONLength));
    var parseJSON = JSON.parse(subArrayJson);
    var lengthFeature = void 0;
    if (parseJSON.POINTS_LENGTH) {
        lengthFeature = parseJSON.POINTS_LENGTH;
    }
    if (parseJSON.POSITION) {
        var byteOffsetPos = parseJSON.POSITION.byteOffset + subArrayJson.length + byteOffset;
        var positionArray = new Float32Array(array, byteOffsetPos, lengthFeature * 3);
        geometry.addAttribute('position', new THREE.BufferAttribute(positionArray, 3));
    }
    if (parseJSON.RGB) {
        var byteOffsetCol = parseJSON.RGB.byteOffset + subArrayJson.length + byteOffset;
        var colorArray = new Uint8Array(array, byteOffsetCol, lengthFeature * 3);
        geometry.addAttribute('color', new THREE.BufferAttribute(colorArray, 3, true));
    }
    if (parseJSON.POSITION_QUANTIZED) {
        throw new Error('For pnts loader, POSITION_QUANTIZED: not yet managed');
    }
    if (parseJSON.RGBA) {
        throw new Error('For pnts loader, RGBA: not yet managed');
    }
    if (parseJSON.RGB565) {
        throw new Error('For pnts loader, RGB565: not yet managed');
    }
    if (parseJSON.NORMAL) {
        throw new Error('For pnts loader, NORMAL: not yet managed');
    }
    if (parseJSON.NORMAL_OCT16P) {
        throw new Error('For pnts loader, NORMAL_OCT16P: not yet managed');
    }
    if (parseJSON.BATCH_ID) {
        throw new Error('For pnts loader, BATCH_ID: not yet managed');
    }
    // creation points with geometry and material
    var points = new THREE.Points(geometry, material);
    points.realPointCount = lengthFeature;

    // Add RTC feature
    if (parseJSON.RTC_CENTER) {
        points.position.fromArray(parseJSON.RTC_CENTER);
    }

    return points;
}