'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.LIGHTING_POSITION = undefined;

var _create = require('babel-runtime/core-js/object/create');

var _create2 = _interopRequireDefault(_create);

var _three = require('three');

var THREE = _interopRequireWildcard(_three);

var _SkyShader = require('./SkyShader');

var _SkyShader2 = _interopRequireDefault(_SkyShader);

var _skyFS = "uniform vec3 v3LightPos;\nuniform float g;\nuniform float g2;\n\nvarying vec3 v3Direction;\nvarying vec3 c0;\nvarying vec3 c1;\n\n// Calculates the Mie phase function\nfloat getMiePhase(float fCos, float fCos2, float g, float g2) {\n    return 1.5 * ((1.0 - g2) / (2.0 + g2)) * (1.0 + fCos2) / pow(1.0 + g2 - 2.0 * g * fCos, 1.5);\n}\n\n// Calculates the Rayleigh phase function\nfloat getRayleighPhase(float fCos2) {\n    return 0.75 + 0.75 * fCos2;\n}\n\nvoid main (void) {\n    float fCos = dot(v3LightPos, v3Direction) / length(v3Direction);\n    float fCos2 = fCos * fCos;\n\n    vec3 color = getRayleighPhase(fCos2) * c0 + getMiePhase(fCos, fCos2, g, g2) * c1;\n\n    gl_FragColor = vec4(color, 1.0);\n    gl_FragColor.a = gl_FragColor.b;\n}";

var _skyFS2 = _interopRequireDefault(_skyFS);

var _skyVS = "uniform vec3 v3LightPosition;   // The direction vector to the light source\nuniform vec3 v3InvWavelength;   // 1 / pow(wavelength, 4) for the red, green, and blue channels\nuniform float fCameraHeight;    // The camera's current height\nuniform float fCameraHeight2;   // fCameraHeight^2\nuniform float fOuterRadius;     // The outer (atmosphere) radius\nuniform float fOuterRadius2;    // fOuterRadius^2\nuniform float fInnerRadius;     // The inner (planetary) radius\nuniform float fInnerRadius2;    // fInnerRadius^2\nuniform float fKrESun;          // Kr * ESun\nuniform float fKmESun;          // Km * ESun\nuniform float fKr4PI;           // Kr * 4 * PI\nuniform float fKm4PI;           // Km * 4 * PI\nuniform float fScale;           // 1 / (fOuterRadius - fInnerRadius)\nuniform float fScaleDepth;      // The scale depth (i.e. the altitude at which the atmosphere's average density is found)\nuniform float fScaleOverScaleDepth; // fScale / fScaleDepth\n\nconst int nSamples = 3;\nconst float fSamples = 3.0;\n\nvarying vec3 v3Direction;\nvarying vec3 c0;\nvarying vec3 c1;\n\nfloat scale(float fCos) {\n    float x = 1.0 - fCos;\n    return fScaleDepth * exp(-0.00287 + x*(0.459 + x*(3.83 + x*(-6.80 + x*5.25))));\n}\n\nvoid main(void) {\n    float lengthCamera = length(cameraPosition);\n    float cameraHeight2 = lengthCamera * lengthCamera;\n\n    // Get the ray from the camera to the vertex and its length (which is the far point of the ray passing through the atmosphere)\n    vec3 v3Ray = position - cameraPosition;\n    float fFar = length(v3Ray);\n    v3Ray /= fFar;\n\n    // Calculate the closest intersection of the ray with the outer atmosphere (which is the near point of the ray passing through the atmosphere)\n    float B = 2.0 * dot(cameraPosition, v3Ray);\n    float C = cameraHeight2 - fOuterRadius2;\n    float fDet = max(0.0, B*B - 4.0 * C);\n    float fNear = 0.5 * (-B - sqrt(fDet));\n\n    // Calculate the ray's starting position, then calculate its scattering offset\n    vec3 v3Start = cameraPosition + v3Ray * fNear;\n    fFar -= fNear;\n    float fStartAngle = dot(v3Ray, v3Start) / fOuterRadius;\n    float fStartDepth = exp(-1.0 / fScaleDepth);\n    float fStartOffset = fStartDepth * scale(fStartAngle);\n\n    // Initialize the scattering loop variables\n    float fSampleLength = fFar / fSamples;\n    float fScaledLength = fSampleLength * fScale;\n    vec3 v3SampleRay = v3Ray * fSampleLength;\n    vec3 v3SamplePoint = v3Start + v3SampleRay * 0.5;\n\n    // Now loop through the sample rays\n    vec3 v3FrontColor = vec3(0.0, 0.0, 0.0);\n    for(int i=0; i<nSamples; i++)\n    {\n        float fHeight = length(v3SamplePoint);\n        float fDepth = exp(fScaleOverScaleDepth * (fInnerRadius - fHeight));\n        float fLightAngle = dot(v3LightPosition, v3SamplePoint) / fHeight;\n        float fCameraAngle = dot(v3Ray, v3SamplePoint) / fHeight;\n        float fScatter = (fStartOffset + fDepth * (scale(fLightAngle) - scale(fCameraAngle)));\n        vec3 v3Attenuate = exp(-fScatter * (v3InvWavelength * fKr4PI + fKm4PI));\n\n        v3FrontColor += v3Attenuate * (fDepth * fScaledLength);\n        v3SamplePoint += v3SampleRay;\n    }\n\n    // Finally, scale the Mie and Rayleigh colors and set up the varying variables for the pixel shader\n    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n    c0 = v3FrontColor * (v3InvWavelength * fKrESun);\n    c1 = v3FrontColor * fKmESun;\n    v3Direction = cameraPosition - position;\n}";

var _skyVS2 = _interopRequireDefault(_skyVS);

var _groundFS = "varying vec3 c0;\nvarying vec3 c1;\n\nvoid main (void) {\n\tgl_FragColor = vec4(c1, 1.0 - c0/4.);\n}";

var _groundFS2 = _interopRequireDefault(_groundFS);

var _groundVS = "uniform vec3 v3LightPosition;   // The direction vector to the light source\nuniform vec3 v3InvWavelength;   // 1 / pow(wavelength, 4) for the red, green, and blue channels\nuniform float fCameraHeight;    // The camera's current height\nuniform float fCameraHeight2;   // fCameraHeight^2\nuniform float fOuterRadius;     // The outer (atmosphere) radius\nuniform float fOuterRadius2;    // fOuterRadius^2\nuniform float fInnerRadius;     // The inner (planetary) radius\nuniform float fInnerRadius2;    // fInnerRadius^2\nuniform float fKrESun;          // Kr * ESun\nuniform float fKmESun;          // Km * ESun\nuniform float fKr4PI;           // Kr * 4 * PI\nuniform float fKm4PI;           // Km * 4 * PI\nuniform float fScale;           // 1 / (fOuterRadius - fInnerRadius)\nuniform float fScaleDepth;      // The scale depth (i.e. the altitude at which the atmosphere's average density is found)\nuniform float fScaleOverScaleDepth; // fScale / fScaleDepth\n\nvarying vec3 c0;\nvarying vec3 c1;\n\nconst int nSamples = 3;\nconst float fSamples = 3.0;\n\nfloat scale(float fCos)\n{\n    float x = 1.0 - fCos;\n    return fScaleDepth * exp(-0.00287 + x*(0.459 + x*(3.83 + x*(-6.80 + x*5.25))));\n}\n\nvoid main(void) {\n\n     float cameraHeight2 = length(cameraPosition) * length(cameraPosition);\n\n    // Get the ray from the camera to the vertex and its length (which is the far point of the ray passing through the atmosphere)\n    vec3 v3Ray = position - cameraPosition;\n    float fFar = length(v3Ray);\n    v3Ray /= fFar;\n\n    // Calculate the closest intersection of the ray with the outer atmosphere (which is the near point of the ray passing through the atmosphere)\n    float B = 2.0 * dot(cameraPosition, v3Ray);\n    float C = cameraHeight2 - fOuterRadius2;\n    float fDet = max(0.0, B*B - 4.0 * C);\n    float fNear = 0.5 * (-B - sqrt(fDet));\n\n    // Calculate the ray's starting position, then calculate its scattering offset\n    vec3 v3Start = cameraPosition + v3Ray * fNear;\n    fFar -= fNear;\n    float fDepth = exp((fInnerRadius - fOuterRadius) / fScaleDepth);\n    float fCameraAngle = dot(-v3Ray, position) / length(position);\n    float fLightAngle = dot(v3LightPosition, position) / length(position);\n    float fCameraScale = scale(fCameraAngle);\n    float fLightScale = scale(fLightAngle);\n    float fCameraOffset = fDepth*fCameraScale;\n    float fTemp = (fLightScale + fCameraScale);\n\n    // Initialize the scattering loop variables\n    float fSampleLength = fFar / fSamples;\n    float fScaledLength = fSampleLength * fScale;\n    vec3 v3SampleRay = v3Ray * fSampleLength;\n    vec3 v3SamplePoint = v3Start + v3SampleRay * 0.5;\n\n    // Now loop through the sample rays\n    vec3 v3FrontColor = vec3(0.0, 0.0, 0.0);\n    vec3 v3Attenuate = vec3(0.0, 0.0, 0.0);\n    for(int i=0; i<nSamples; i++)\n    {\n        float fHeight = length(v3SamplePoint);\n        float fDepth = exp(fScaleOverScaleDepth * (fInnerRadius - fHeight));\n        float fScatter = fDepth*fTemp - fCameraOffset;\n        v3Attenuate = exp(-fScatter * (v3InvWavelength * fKr4PI + fKm4PI));\n        v3FrontColor += v3Attenuate * (fDepth * fScaledLength);\n        v3SamplePoint += v3SampleRay;\n    }\n\n    // Calculate the attenuation factor for the ground\n    c0 = v3Attenuate;\n    c1 = v3FrontColor * (v3InvWavelength * fKrESun + fKmESun);\n\n    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}";

var _groundVS2 = _interopRequireDefault(_groundVS);

var _GlowFS = "#include <logdepthbuf_pars_fragment>\n\nuniform int atmoIN;\nvarying float intensity;\n\nvec4 glowColor = vec4(0.45, 0.74, 1. ,1.0);\n\nvoid main()\n{\n    #include <logdepthbuf_fragment>\n    gl_FragColor = glowColor * intensity;\n}\n\n";

var _GlowFS2 = _interopRequireDefault(_GlowFS);

var _GlowVS = "#include <logdepthbuf_pars_vertex>\n#define EPSILON 1e-6\n\nuniform int atmoIN;\nvarying float intensity;\n\nvoid main()\n{\n    vec3 normalES    = normalize( normalMatrix * normal );\n    vec3 normalCAMES = normalize( normalMatrix * cameraPosition );\n\n    if(atmoIN == 0) {\n        intensity = pow(0.666 - dot(normalES, normalCAMES), 4. );\n    } else {\n        intensity = pow( 1.  - dot(normalES, normalCAMES), 0.8 );\n    }\n\n    gl_Position = projectionMatrix * modelViewMatrix * vec4( position,  1.0 );\n\n    #include <logdepthbuf_vertex>\n}\n\n\n";

var _GlowVS2 = _interopRequireDefault(_GlowVS);

var _Coordinates = require('../../Geographic/Coordinates');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LIGHTING_POSITION = exports.LIGHTING_POSITION = new THREE.Vector3(1, 0, 0); /*
                                                                                 * To change this license header, choose License Headers in Project Properties.
                                                                                 * To change this template file, choose Tools | Templates
                                                                                 * and open the template in the editor.
                                                                                 */

function Atmosphere() {
    // default to non-realistic lightning
    this.realistic = false;

    this.uniformsOut = {
        atmoIN: {
            type: 'i',
            value: 0
        },
        screenSize: {
            type: 'v2',
            value: new THREE.Vector2(window.innerWidth, window.innerHeight)
        } // Should be updated on screen resize...
    };

    var material = new THREE.ShaderMaterial({
        uniforms: this.uniformsOut,
        vertexShader: _GlowVS2.default,
        fragmentShader: _GlowFS2.default,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        wireframe: false
    });

    var size = (0, _Coordinates.ellipsoidSizes)();
    var geometry = new THREE.SphereGeometry(1.14, 64, 64).scale(size.x, size.y, size.z);

    THREE.Mesh.call(this, geometry, material);

    this.uniformsIn = {
        atmoIN: {
            type: 'i',
            value: 1
        },
        screenSize: {
            type: 'v2',
            value: new THREE.Vector2(window.innerWidth, window.innerHeight)
        } // Should be updated on screen resize...
    };

    var materialAtmoIn = new THREE.ShaderMaterial({
        uniforms: this.uniformsIn,
        vertexShader: _GlowVS2.default,
        fragmentShader: _GlowFS2.default,
        side: THREE.FrontSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false
    });

    this.atmosphereIN = new THREE.Mesh(new THREE.SphereGeometry(1.002, 64, 64).scale(size.x, size.y, size.z), materialAtmoIn);

    this.add(this.atmosphereIN);
}

Atmosphere.prototype = (0, _create2.default)(THREE.Mesh.prototype);
Atmosphere.prototype.constructor = Atmosphere;

Atmosphere.prototype._initRealisticLighning = function () {
    var atmosphere = {
        Kr: 0.0025,
        Km: 0.0010,
        ESun: 20.0,
        g: -0.950,
        innerRadius: 6400000,
        outerRadius: 6700000,
        wavelength: [0.650, 0.570, 0.475],
        scaleDepth: 0.25,
        mieScaleDepth: 0.1
    };

    var uniformsSky = {
        v3LightPosition: { value: LIGHTING_POSITION.clone().normalize() },
        v3InvWavelength: { value: new THREE.Vector3(1 / Math.pow(atmosphere.wavelength[0], 4), 1 / Math.pow(atmosphere.wavelength[1], 4), 1 / Math.pow(atmosphere.wavelength[2], 4)) },
        fCameraHeight: { value: 0.0 },
        fCameraHeight2: { value: 0.0 },
        fInnerRadius: { value: atmosphere.innerRadius },
        fInnerRadius2: { value: atmosphere.innerRadius * atmosphere.innerRadius },
        fOuterRadius: { value: atmosphere.outerRadius },
        fOuterRadius2: { value: atmosphere.outerRadius * atmosphere.outerRadius },
        fKrESun: { value: atmosphere.Kr * atmosphere.ESun },
        fKmESun: { value: atmosphere.Km * atmosphere.ESun },
        fKr4PI: { value: atmosphere.Kr * 4.0 * Math.PI },
        fKm4PI: { value: atmosphere.Km * 4.0 * Math.PI },
        fScale: { value: 1 / (atmosphere.outerRadius - atmosphere.innerRadius) },
        fScaleDepth: { value: atmosphere.scaleDepth },
        fScaleOverScaleDepth: { value: 1 / (atmosphere.outerRadius - atmosphere.innerRadius) / atmosphere.scaleDepth },
        g: { value: atmosphere.g },
        g2: { value: atmosphere.g * atmosphere.g },
        nSamples: { value: 3 },
        fSamples: { value: 3.0 },
        tDisplacement: { value: new THREE.Texture() },
        tSkyboxDiffuse: { value: new THREE.Texture() },
        fNightScale: { value: 1.0 }
    };

    this.ground = {
        geometry: new THREE.SphereGeometry(atmosphere.innerRadius, 50, 50),
        material: new THREE.ShaderMaterial({
            uniforms: uniformsSky,
            vertexShader: _groundVS2.default,
            fragmentShader: _groundFS2.default,
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthTest: false,
            depthWrite: false
        })
    };

    this.ground.mesh = new THREE.Mesh(this.ground.geometry, this.ground.material);

    this.sky = {
        geometry: new THREE.SphereGeometry(atmosphere.outerRadius, 196, 196),
        material: new THREE.ShaderMaterial({
            uniforms: uniformsSky,
            vertexShader: _skyVS2.default,
            fragmentShader: _skyFS2.default
        })
    };

    this.sky.mesh = new THREE.Mesh(this.sky.geometry, this.sky.material);
    this.sky.material.side = THREE.BackSide;
    this.sky.material.transparent = true;

    this.ground.mesh.visible = false;
    this.sky.mesh.visible = false;

    this.skyDome = new _SkyShader2.default();
    this.skyDome.mesh.frustumCulled = false;
    this.skyDome.mesh.material.transparent = true;
    this.skyDome.mesh.visible = false;
    this.skyDome.mesh.material.depthWrite = false;

    this.ground.mesh.layers.mask = this.layers.mask;
    this.sky.mesh.layers.mask = this.layers.mask;
    this.skyDome.mesh.layers.mask = this.layers.mask;
    this.add(this.ground.mesh);
    this.add(this.sky.mesh);
    this.add(this.skyDome.mesh);

    var effectController = {
        turbidity: 10,
        reileigh: 2,
        mieCoefficient: 0.005,
        mieDirectionalG: 0.8,
        luminance: 1,
        inclination: 0.49, // elevation / inclination
        azimuth: 0.25, // Facing front,
        sun: !true
    };

    var uniforms = this.skyDome.uniforms;
    uniforms.turbidity.value = effectController.turbidity;
    uniforms.reileigh.value = effectController.reileigh;
    uniforms.luminance.value = effectController.luminance;
    uniforms.mieCoefficient.value = effectController.mieCoefficient;
    uniforms.mieDirectionalG.value = effectController.mieDirectionalG;
    uniforms.up.value = new THREE.Vector3(); // no more necessary, estimate normal from cam..
};

Atmosphere.prototype.setRealisticOn = function (bool) {
    if (bool && !this.sky) {
        this._initRealisticLighning();
    }
    this.realistic = bool;
    this.material.visible = !this.realistic;
    this.atmosphereIN.visible = !this.realistic;
    this.ground.mesh.visible = this.realistic;
    this.sky.mesh.visible = this.realistic;
    this.skyDome.mesh.visible = this.realistic;
};

Atmosphere.prototype.updateLightingPos = function (pos) {
    if (this.realistic) {
        this.ground.material.uniforms.v3LightPosition.value = pos.clone().normalize();
        this.sky.material.uniforms.v3LightPosition.value = pos.clone().normalize();
        this.skyDome.uniforms.sunPosition.value.copy(pos);
    }
};

exports.default = Atmosphere;