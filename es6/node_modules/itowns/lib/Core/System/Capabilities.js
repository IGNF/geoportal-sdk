'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
// default values
var logDepthBufferSupported = false;
var maxTexturesUnits = 8;

exports.default = {
    isLogDepthBufferSupported: function isLogDepthBufferSupported() {
        return logDepthBufferSupported;
    },
    isInternetExplorer: function isInternetExplorer() {
        var internetExplorer = false || !!document.documentMode;
        return internetExplorer;
    },
    getMaxTextureUnitsCount: function getMaxTextureUnitsCount() {
        return maxTexturesUnits;
    },
    updateCapabilities: function updateCapabilities(renderer) {
        var gl = renderer.context;
        maxTexturesUnits = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);

        var debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo !== null) {
            var vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
            if (vendor.indexOf('mesa') > -1 || vendor.indexOf('Mesa') > -1) {
                maxTexturesUnits = Math.min(16, maxTexturesUnits);
            }
        } else {
            maxTexturesUnits = Math.min(16, maxTexturesUnits);
        }

        logDepthBufferSupported = renderer.capabilities.logarithmicDepthBuffer;
    }
};