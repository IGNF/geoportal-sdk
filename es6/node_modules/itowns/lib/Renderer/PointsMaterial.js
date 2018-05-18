'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _three = require('three');

var _PointsVS = "precision highp float;\nprecision highp int;\n\n#include <logdepthbuf_pars_vertex>\n#define EPSILON 1e-6\n\nuniform float size;\nuniform float scale;\nuniform mat4 projectionMatrix;\nuniform mat4 modelViewMatrix;\nuniform vec2 resolution;\nuniform bool pickingMode;\nuniform float density; // points per on screen pixels\n\nattribute vec4 unique_id;\nattribute vec3 color;\nattribute vec3 position;\n\nvarying vec4 vColor;\n\nvoid main() {\n    if (pickingMode) {\n        vColor = unique_id;\n    } else {\n        vColor = vec4(color, 1.0);\n    }\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    mat4 projModelViewMatrix = projectionMatrix * modelViewMatrix;\n    gl_Position = projModelViewMatrix* vec4( position, 1.0);\n\n    if (size > 0.01) {\n        gl_PointSize = size;\n    } else {\n        float pointSize = 1.0;\n        float slope = tan(1.0 / 2.0);\n        float projFactor =  -0.5 * resolution.y / (slope * mvPosition.z);\n\n        float z = min(0.5 * -gl_Position.z / gl_Position.w, 1.0);\n        gl_PointSize = max(3.0, min(10.0, 0.05 * projFactor));\n    }\n\n    #include <logdepthbuf_vertex>\n}\n";

var _PointsVS2 = _interopRequireDefault(_PointsVS);

var _PointsFS = "precision highp float;\nprecision highp int;\n\n#include <logdepthbuf_pars_fragment>\n\nvarying vec4 vColor;\nuniform bool pickingMode;\nuniform float opacity;\n\nuniform bool useCustomColor;\nuniform vec3 customColor;\n\nvoid main() {\n    // circular point rendering\n    float u = 2.0 * gl_PointCoord.x - 1.0;\n    float v = 2.0 * gl_PointCoord.y - 1.0;\n    float cc = u*u + v*v;\n    if(cc > 1.0){\n        discard;\n    }\n\n    if (useCustomColor && !pickingMode) {\n        gl_FragColor = mix(vColor, vec4(customColor, 1.0), 0.5);\n    } else {\n        gl_FragColor = vColor;\n    }\n\n    if (!pickingMode) {\n        gl_FragColor.a = opacity;\n    }\n\n    #include <logdepthbuf_fragment>\n}\n";

var _PointsFS2 = _interopRequireDefault(_PointsFS);

var _Capabilities = require('../Core/System/Capabilities');

var _Capabilities2 = _interopRequireDefault(_Capabilities);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PointsMaterial = function (_RawShaderMaterial) {
    (0, _inherits3.default)(PointsMaterial, _RawShaderMaterial);

    function PointsMaterial() {
        var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        (0, _classCallCheck3.default)(this, PointsMaterial);

        var _this = (0, _possibleConstructorReturn3.default)(this, (PointsMaterial.__proto__ || (0, _getPrototypeOf2.default)(PointsMaterial)).call(this));

        _this.vertexShader = _PointsVS2.default;
        _this.fragmentShader = _PointsFS2.default;

        _this.uniforms.size = new _three.Uniform(size);
        _this.uniforms.resolution = new _three.Uniform(new _three.Vector2(window.innerWidth, window.innerHeight));
        _this.uniforms.pickingMode = new _three.Uniform(false);
        _this.uniforms.density = new _three.Uniform(0.01);
        _this.uniforms.opacity = new _three.Uniform(1.0);
        _this.uniforms.useCustomColor = new _three.Uniform(false);
        _this.uniforms.customColor = new _three.Uniform(new _three.Color());

        if (_Capabilities2.default.isLogDepthBufferSupported()) {
            _this.defines = {
                USE_LOGDEPTHBUF: 1,
                USE_LOGDEPTHBUF_EXT: 1
            };
        }

        return _this;
    }

    (0, _createClass3.default)(PointsMaterial, [{
        key: 'enablePicking',
        value: function enablePicking(v) {
            // we don't want pixels to blend over already drawn pixels
            this.blending = v ? _three.NoBlending : _three.NormalBlending;
            this.uniforms.pickingMode.value = v;
        }
    }]);
    return PointsMaterial;
}(_three.RawShaderMaterial);

exports.default = PointsMaterial;