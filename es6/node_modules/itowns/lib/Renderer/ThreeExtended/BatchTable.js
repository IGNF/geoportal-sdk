"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    parse: function parse(buffer, textDecoder) {
        var content = textDecoder.decode(new Uint8Array(buffer));
        var json = JSON.parse(content);
        return json;
    }
};