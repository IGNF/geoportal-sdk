'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TextEncoder = exports.TextDecoder = undefined;

var _textEncodingUtf = require('text-encoding-utf-8');

var TextDecoder = exports.TextDecoder = typeof global.TextDecoder === 'function' ? global.TextDecoder : _textEncodingUtf.TextDecoder;
var TextEncoder = exports.TextEncoder = typeof global.TextEncoder === 'function' ? global.TextEncoder : _textEncodingUtf.TextEncoder;