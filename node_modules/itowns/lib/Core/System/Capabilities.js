"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

/* babel-plugin-inline-import '../../Renderer/Shader/SampleTestFS.glsl' */
var SampleTestFS = "uniform sampler2D uni[SAMPLE];\nvoid main() {\n    gl_FragColor += texture2D(uni[SAMPLE-1], vec2(0));\n}";

/* babel-plugin-inline-import '../../Renderer/Shader/SampleTestVS.glsl' */
var SampleTestVS = "void main() {\n    gl_Position = vec4( 0.0, 0.0, 0.0, 1.0 );\n}"; // default values

var logDepthBufferSupported = false;
var maxTexturesUnits = 8;
var maxTextureSize = 4096;

function _WebGLShader(renderer, type, string) {
  var gl = renderer.getContext();
  var shader = gl.createShader(type);
  gl.shaderSource(shader, string);
  gl.compileShader(shader);
  return shader;
}

function isFirefox() {
  return navigator && navigator.userAgent && navigator.userAgent.toLowerCase().includes('firefox');
}

var _default = {
  isLogDepthBufferSupported: function isLogDepthBufferSupported() {
    return logDepthBufferSupported;
  },
  isFirefox: isFirefox,
  isInternetExplorer: function isInternetExplorer() {
    var internetExplorer = false || !!document.documentMode;
    return internetExplorer;
  },
  getMaxTextureUnitsCount: function getMaxTextureUnitsCount() {
    return maxTexturesUnits;
  },
  getMaxTextureSize: function getMaxTextureSize() {
    return maxTextureSize;
  },
  updateCapabilities: function updateCapabilities(renderer) {
    var gl = renderer.getContext();
    maxTexturesUnits = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
    maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    var program = gl.createProgram();

    var glVertexShader = _WebGLShader(renderer, gl.VERTEX_SHADER, SampleTestVS);

    var fragmentShader = "#define SAMPLE ".concat(maxTexturesUnits, "\n");
    fragmentShader += SampleTestFS;

    var glFragmentShader = _WebGLShader(renderer, gl.FRAGMENT_SHADER, fragmentShader);

    gl.attachShader(program, glVertexShader);
    gl.attachShader(program, glFragmentShader);
    gl.linkProgram(program);

    if (gl.getProgramParameter(program, gl.LINK_STATUS) === false) {
      if (maxTexturesUnits > 16) {
        var info = gl.getProgramInfoLog(program); // eslint-disable-next-line no-console

        console.warn("".concat(info, ": using a maximum of 16 texture units instead of the reported value (").concat(maxTexturesUnits, ")"));

        if (isFirefox()) {
          // eslint-disable-next-line no-console
          console.warn("It can come from a Mesa/Firefox bug;\n                        the shader compiles to an error when using more than 16 sampler uniforms,\n                        see https://bugzilla.mozilla.org/show_bug.cgi?id=777028");
        }

        maxTexturesUnits = 16;
      } else {
        throw new Error("The GPU capabilities could not be determined accurately.\n                    Impossible to link a shader with the Maximum texture units ".concat(maxTexturesUnits));
      }
    }

    gl.deleteProgram(program);
    gl.deleteShader(glVertexShader);
    gl.deleteShader(glFragmentShader);
    logDepthBufferSupported = renderer.capabilities.logarithmicDepthBuffer;
  }
};
exports["default"] = _default;