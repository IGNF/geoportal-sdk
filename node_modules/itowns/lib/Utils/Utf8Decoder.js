"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.TextDecoder = void 0;

var _textEncodingUtf = require("text-encoding-utf-8");

var TextDecoder = typeof global.TextDecoder === 'function' ? global.TextDecoder : _textEncodingUtf.TextDecoder;
exports.TextDecoder = TextDecoder;

var _default = new TextDecoder('utf-8');

exports["default"] = _default;