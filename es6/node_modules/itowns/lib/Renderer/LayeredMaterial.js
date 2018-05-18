'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _create = require('babel-runtime/core-js/object/create');

var _create2 = _interopRequireDefault(_create);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

exports.unpack1K = unpack1K;

var _three = require('three');

var THREE = _interopRequireWildcard(_three);

var _TileVS = "#include <logdepthbuf_pars_vertex>\n#define EPSILON 1e-6\n\nconst float PI          = 3.14159265359;\nconst float INV_TWO_PI  = 1.0 / (2.0*PI);\nconst float PI4         = 0.78539816339;\n\nattribute float     uv_pm;\nattribute vec2      uv_wgs84;\nattribute vec3      position;\nattribute vec3      normal;\n\nuniform sampler2D   dTextures_00[1];\nuniform vec3        offsetScale_L00[1];\nuniform int         loadedTexturesCount[8];\n\nuniform mat4        projectionMatrix;\nuniform mat4        modelViewMatrix;\nuniform mat4        modelMatrix;\n\nvarying vec2        vUv_WGS84;\nvarying float       vUv_PM;\nvarying vec3        vNormal;\nvarying vec4        pos;\n\nhighp float decode32(highp vec4 rgba) {\n    highp float Sign = 1.0 - step(128.0,rgba[0])*2.0;\n    highp float Exponent = 2.0 * mod(rgba[0],128.0) + step(128.0,rgba[1]) - 127.0;\n    highp float Mantissa = mod(rgba[1],128.0)*65536.0 + rgba[2]*256.0 +rgba[3] + float(0x800000);\n    highp float Result =  Sign * exp2(Exponent) * (Mantissa * exp2(-23.0 ));\n    return Result;\n}\n\nvoid main() {\n\n        vUv_WGS84 = uv_wgs84;\n        vUv_PM = uv_pm;\n\n        vec4 vPosition;\n\n        if(loadedTexturesCount[0] > 0) {\n            vec2    vVv = vec2(\n                vUv_WGS84.x * offsetScale_L00[0].z + offsetScale_L00[0].x,\n                (1.0 - vUv_WGS84.y) * offsetScale_L00[0].z + offsetScale_L00[0].y);\n\n            #if defined(RGBA_TEXTURE_ELEVATION)\n                vec4 rgba = texture2D( dTextures_00[0], vVv ) * 255.0;\n\n                rgba.rgba = rgba.abgr;\n\n                float dv = max(decode32(rgba),0.0);\n\n                // TODO In RGBA elevation texture LinearFilter give some errors with nodata value.\n                // need to rewrite sample function in shader\n                // simple solution\n                if(dv>5000.0) {\n                    dv = 0.0;\n                }\n\n            #elif defined(DATA_TEXTURE_ELEVATION)\n                float   dv  = max(texture2D( dTextures_00[0], vVv ).w, 0.);\n            #elif defined(COLOR_TEXTURE_ELEVATION)\n                float   dv  = max(texture2D( dTextures_00[0], vVv ).r, 0.);\n                dv = _minElevation + dv * (_maxElevation - _minElevation);\n            #else\n\n            #error Must define either RGBA_TEXTURE_ELEVATION, DATA_TEXTURE_ELEVATION or COLOR_TEXTURE_ELEVATION\n            #endif\n\n            vPosition = vec4( position +  normal  * dv ,1.0 );\n        } else {\n            vPosition = vec4( position ,1.0 );\n        }\n\n        vNormal = normalize ( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );\n\n        gl_Position = projectionMatrix * modelViewMatrix * vPosition;\n        #include <logdepthbuf_vertex>\n}\n";

var _TileVS2 = _interopRequireDefault(_TileVS);

var _TileFS = "#include <logdepthbuf_pars_fragment>\n\n// BUG CHROME 50 UBUNTU 16.04\n// Lose context on compiling shader with too many IF STATEMENT\n// runconformance/glsl/bugs/conditional-discard-in-loop.html\n// conformance/glsl/bugs/nested-loops-with-break-and-continue.html\n// Resolve CHROME unstable 52\n\nconst vec4 CFog = vec4( 0.76, 0.85, 1.0, 1.0);\nconst vec4 CWhite = vec4(1.0,1.0,1.0,1.0);\nconst vec4 COrange = vec4( 1.0, 0.3, 0.0, 1.0);\nconst vec4 CRed = vec4( 1.0, 0.0, 0.0, 1.0);\n\n\nuniform sampler2D   dTextures_01[TEX_UNITS];\nuniform vec4        offsetScale_L01[TEX_UNITS];\n\n// offset texture | Projection | fx | Opacity\nuniform vec4        paramLayers[8];\nuniform int         loadedTexturesCount[8];\nuniform bool        visibility[8];\n\nuniform float       distanceFog;\nuniform int         colorLayersCount;\nuniform vec3        lightPosition;\n\nuniform vec3        noTextureColor;\n\n// Options global\nuniform bool        selected;\nuniform bool        lightingEnabled;\n\nvarying vec2        vUv_WGS84;\nvarying float       vUv_PM;\nvarying vec3        vNormal;\n\nuniform float opacity;\n\nvec4 applyWhiteToInvisibleEffect(vec4 color, float intensity) {\n    float a = (color.r + color.g + color.b) * 0.333333333;\n    color.a *= 1.0 - pow(abs(a), intensity);\n    return color;\n}\n\nvec4 applyLightColorToInvisibleEffect(vec4 color, float intensity) {\n    float a = max(0.05,1.0 - length(color.xyz - CWhite.xyz));\n    color.a *= 1.0 - pow(abs(a), intensity);\n    color.rgb *= color.rgb * color.rgb;\n    return color;\n}\n\n#if defined(DEBUG)\n    uniform bool showOutline;\n    const float sLine = 0.008;\n#endif\n\n#if defined(MATTE_ID_MODE) || defined(DEPTH_MODE)\n#include <packing>\nuniform int  uuid;\n#endif\n\nvoid main() {\n    #include <logdepthbuf_fragment>\n\n    #if defined(MATTE_ID_MODE)\n        gl_FragColor = packDepthToRGBA(float(uuid) / (256.0 * 256.0 * 256.0));\n    #elif defined(DEPTH_MODE)\n        #if defined(USE_LOGDEPTHBUF) && defined(USE_LOGDEPTHBUF_EXT)\n            float z = gl_FragDepthEXT ;\n        #else\n            float z = gl_FragCoord.z;\n        #endif\n        gl_FragColor = packDepthToRGBA(z);\n    #else\n\n\n    #if defined(DEBUG)\n         if (showOutline && (vUv_WGS84.x < sLine || vUv_WGS84.x > 1.0 - sLine || vUv_WGS84.y < sLine || vUv_WGS84.y > 1.0 - sLine))\n             gl_FragColor = CRed;\n         else\n    #endif\n    {\n        // Reconstruct PM uv and PM subtexture id (see TileGeometry)\n        vec2 uvPM ;\n        uvPM.x             = vUv_WGS84.x;\n        float y            = vUv_PM;\n        int pmSubTextureIndex = int(floor(y));\n        uvPM.y             = y - float(pmSubTextureIndex);\n\n        #if defined(USE_LOGDEPTHBUF) && defined(USE_LOGDEPTHBUF_EXT)\n            float depth = gl_FragDepthEXT / gl_FragCoord.w;\n        #else\n            float depth = gl_FragCoord.z / gl_FragCoord.w;\n        #endif\n\n        float fogIntensity = 1.0/(exp(depth/distanceFog));\n\n        vec4 diffuseColor = vec4(noTextureColor, 1.0);\n        bool validTexture = false;\n\n        // TODO Optimisation des uv1 peuvent copier pas lignes!!\n        for (int layer = 0; layer < 8; layer++) {\n            if(layer == colorLayersCount) {\n                break;\n            }\n\n            if(visibility[layer]) {\n                vec4 paramsA = paramLayers[layer];\n\n                if(paramsA.w > 0.0) {\n                    bool projWGS84 = paramsA.y == 0.0;\n                    int pmTextureCount = int(paramsA.y);\n                    int textureIndex = int(paramsA.x) + (projWGS84 ? 0 : pmSubTextureIndex);\n\n                    if (!projWGS84 && pmTextureCount <= pmSubTextureIndex) {\n                        continue;\n                    }\n\n                    #if defined(DEBUG)\n                    if (showOutline && !projWGS84 && (uvPM.x < sLine || uvPM.x > 1.0 - sLine || uvPM.y < sLine || uvPM.y > 1.0 - sLine)) {\n                        gl_FragColor = COrange;\n                        return;\n                    }\n                    #endif\n\n                    /* if (0 <= textureIndex && textureIndex < loadedTexturesCount[1]) */ {\n\n                        // TODO: Try other OS before delete dead\n                        // get value in array, the index must be constant\n                        // Strangely it's work with function returning a global variable, doesn't work on Chrome Windows\n                        // vec4 layerColor = texture2D(dTextures_01[getTextureIndex()],  pitUV(projWGS84 ? vUv_WGS84 : uvPM,pitScale_L01[getTextureIndex()]));\n                        vec4 layerColor = colorAtIdUv(\n                            dTextures_01,\n                            offsetScale_L01,\n                            textureIndex,\n                            projWGS84 ? vUv_WGS84 : uvPM);\n\n                        if (layerColor.a > 0.0 && paramsA.w > 0.0) {\n                            validTexture = true;\n                            if(paramsA.z > 2.0) {\n                                layerColor.rgb /= layerColor.a;\n                                layerColor = applyLightColorToInvisibleEffect(layerColor, paramsA.z);\n                                layerColor.rgb *= layerColor.a;\n                            } else if(paramsA.z > 0.0) {\n                                layerColor.rgb /= layerColor.a;\n                                layerColor = applyWhiteToInvisibleEffect(layerColor, paramsA.z);\n                                layerColor.rgb *= layerColor.a;\n                            }\n\n                            // Use premultiplied-alpha blending formula because source textures are either:\n                            //     - fully opaque (layer.transparent = false)\n                            //     - or use premultiplied alpha (texture.premultiplyAlpha = true)\n                            // Note: using material.premultipliedAlpha doesn't make sense since we're manually blending\n                            // the multiple colors in the shader.\n                            diffuseColor = diffuseColor * (1.0 - layerColor.a * paramsA.w) + layerColor * paramsA.w;\n                        }\n                    }\n                }\n            }\n        }\n\n        // No texture color\n        if (!validTexture) {\n            diffuseColor.rgb = noTextureColor;\n        }\n\n        // Selected\n        if(selected) {\n            diffuseColor = mix(COrange, diffuseColor, 0.5 );\n        }\n\n        // Fog\n        gl_FragColor = mix(CFog, diffuseColor, fogIntensity);\n        gl_FragColor.a = 1.0;\n\n        if(lightingEnabled) {   // Add lighting\n            float light = min(2. * dot(vNormal, lightPosition),1.);\n            gl_FragColor.rgb *= light;\n        }\n    }\n    gl_FragColor.a = opacity;\n    #endif\n}\n";

var _TileFS2 = _interopRequireDefault(_TileFS);

var _pitUV = "vec2    pitUV(vec2 uvIn, vec4 pit)\n{\n    vec2  uv;\n    uv.x = uvIn.x* pit.z + pit.x;\n    uv.y = 1.0 -( (1.0 - uvIn.y) * pit.w + pit.y);\n\n    return uv;\n}\n\n";

var _pitUV2 = _interopRequireDefault(_pitUV);

var _PrecisionQualifier = "precision highp float;\nprecision highp int;\n";

var _PrecisionQualifier2 = _interopRequireDefault(_PrecisionQualifier);

var _Capabilities = require('../Core/System/Capabilities');

var _Capabilities2 = _interopRequireDefault(_Capabilities);

var _LayeredMaterialConstants = require('./LayeredMaterialConstants');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var emptyTexture = new THREE.Texture(); /*
                                         * To change this license header, choose License Headers in Project Properties.
                                         * To change this template file, choose Tools | Templates
                                         * and open the template in the editor.
                                         */

emptyTexture.coords = { zoom: _LayeredMaterialConstants.EMPTY_TEXTURE_ZOOM };

var layerTypesCount = 2;
var vector4 = new THREE.Vector4(0.0, 0.0, 0.0, 0.0);
var fooTexture;

// from three.js packDepthToRGBA
var UnpackDownscale = 255 / 256; // 0..1 -> fraction (excluding 1)
function unpack1K(color, factor) {
    var bitSh = new THREE.Vector4(UnpackDownscale / (256.0 * 256.0 * 256.0), UnpackDownscale / (256.0 * 256.0), UnpackDownscale / 256.0, UnpackDownscale);
    return factor ? bitSh.dot(color) * factor : bitSh.dot(color);
}

var getColorAtIdUv = function (nbTex) {
    if (!fooTexture) {
        fooTexture = 'vec4 colorAtIdUv(sampler2D dTextures[TEX_UNITS],vec4 offsetScale[TEX_UNITS],int id, vec2 uv){\n';
        fooTexture += ' if (id == 0) return texture2D(dTextures[0],  pitUV(uv,offsetScale[0]));\n';

        for (var l = 1; l < nbTex; l++) {
            var sL = l.toString();
            fooTexture += '    else if (id == ' + sL + ') return texture2D(dTextures[' + sL + '],  pitUV(uv,offsetScale[' + sL + ']));\n';
        }

        fooTexture += 'else return vec4(0.0,0.0,0.0,0.0);}\n';
    }

    return fooTexture;
};

// Array not suported in IE
var fillArray = function (array, remp) {
    for (var i = 0; i < array.length; i++) {
        array[i] = remp;
    }
};

var moveElementArray = function (array, oldIndex, newIndex) {
    array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
};

/* eslint-disable */
var moveElementsArraySafe = function (array, index, howMany, toIndex) {
    index = parseInt(index) || 0;
    index = index < 0 ? array.length + index : index;
    toIndex = parseInt(toIndex) || 0;
    toIndex = toIndex < 0 ? array.length + toIndex : toIndex;
    if (toIndex > index && toIndex <= index + howMany) {
        toIndex = index + howMany;
    }

    var moved;
    array.splice.apply(array, [toIndex, 0].concat(moved = array.splice(index, howMany)));
    return moved;
};
/* eslint-enable */

var LayeredMaterial = function (options) {
    THREE.RawShaderMaterial.call(this);

    var maxTexturesUnits = _Capabilities2.default.getMaxTextureUnitsCount();
    var nbSamplers = Math.min(maxTexturesUnits - 1, 16 - 1);
    this.vertexShader = _TileVS2.default;

    this.fragmentShaderHeader = _PrecisionQualifier2.default + '\nconst int   TEX_UNITS   = ' + nbSamplers.toString() + ';\n';
    this.fragmentShaderHeader += _pitUV2.default;

    options = options || {};
    var vsOptions = '';
    if (options.useRgbaTextureElevation) {
        throw new Error('Restore this feature');
    } else if (options.useColorTextureElevation) {
        vsOptions = '\n#define COLOR_TEXTURE_ELEVATION\n';
        vsOptions += '\nconst float _minElevation = ' + options.colorTextureElevationMinZ.toFixed(1) + ';\n';
        vsOptions += '\nconst float _maxElevation = ' + options.colorTextureElevationMaxZ.toFixed(1) + ';\n';
    } else {
        // default
        vsOptions = '\n#define DATA_TEXTURE_ELEVATION\n';
    }

    // see GLOBE FS
    this.fragmentShaderHeader += getColorAtIdUv(nbSamplers);

    this.fragmentShader = this.fragmentShaderHeader + _TileFS2.default;
    this.vertexShader = _PrecisionQualifier2.default + vsOptions + _TileVS2.default;

    // handle on textures uniforms
    this.textures = [];
    // handle on textures offsetScale uniforms
    this.offsetScale = [];
    // handle Loaded textures count by layer's type uniforms
    this.loadedTexturesCount = [0, 0];

    // Uniform three js needs no empty array
    // WARNING TODO: prevent empty slot, but it's not the solution
    this.offsetScale[_LayeredMaterialConstants.l_COLOR] = Array(nbSamplers);
    this.offsetScale[_LayeredMaterialConstants.l_ELEVATION] = [vector4];
    fillArray(this.offsetScale[_LayeredMaterialConstants.l_COLOR], vector4);

    this.textures[_LayeredMaterialConstants.l_ELEVATION] = [emptyTexture];
    this.textures[_LayeredMaterialConstants.l_COLOR] = Array(nbSamplers);
    var paramLayers = Array(8);
    this.layerTexturesCount = Array(8);

    fillArray(this.textures[_LayeredMaterialConstants.l_COLOR], emptyTexture);
    fillArray(paramLayers, vector4);
    fillArray(this.layerTexturesCount, 0);

    // Elevation texture
    this.uniforms.dTextures_00 = new THREE.Uniform(this.textures[_LayeredMaterialConstants.l_ELEVATION]);

    // Color textures's layer
    this.uniforms.dTextures_01 = new THREE.Uniform(this.textures[_LayeredMaterialConstants.l_COLOR]);

    // Visibility layer
    this.uniforms.visibility = new THREE.Uniform([true, true, true, true, true, true, true, true]);

    // Loaded textures count by layer's type
    this.uniforms.loadedTexturesCount = new THREE.Uniform(this.loadedTexturesCount);

    // Count color layers
    this.uniforms.colorLayersCount = new THREE.Uniform(1);

    // Layer setting
    // Offset color texture slot | Projection | fx | Opacity
    this.uniforms.paramLayers = new THREE.Uniform(paramLayers);

    // Elevation texture cropping
    this.uniforms.offsetScale_L00 = new THREE.Uniform(this.offsetScale[_LayeredMaterialConstants.l_ELEVATION]);

    // Color texture cropping
    this.uniforms.offsetScale_L01 = new THREE.Uniform(this.offsetScale[_LayeredMaterialConstants.l_COLOR]);

    // Light position
    this.uniforms.lightPosition = new THREE.Uniform(new THREE.Vector3(-0.5, 0.0, 1.0));

    this.uniforms.distanceFog = new THREE.Uniform(1000000000.0);

    this.uniforms.uuid = new THREE.Uniform(0);

    this.uniforms.selected = new THREE.Uniform(false);

    this.uniforms.lightingEnabled = new THREE.Uniform(false);

    this.uniforms.noTextureColor = new THREE.Uniform(new THREE.Color(0.04, 0.23, 0.35));

    this.uniforms.opacity = new THREE.Uniform(1.0);

    this.colorLayersId = [];
    this.elevationLayersId = [];

    if (_Capabilities2.default.isLogDepthBufferSupported()) {
        this.defines = {
            USE_LOGDEPTHBUF: 1,
            USE_LOGDEPTHBUF_EXT: 1
        };
    } else {
        this.defines = {};
    }
};

LayeredMaterial.prototype = (0, _create2.default)(THREE.RawShaderMaterial.prototype);
LayeredMaterial.prototype.constructor = LayeredMaterial;

LayeredMaterial.prototype.dispose = function () {
    // TODO: WARNING  verify if textures to dispose aren't attached with ancestor

    this.dispatchEvent({
        type: 'dispose'
    });

    for (var l = 0; l < layerTypesCount; l++) {
        for (var i = 0, max = this.textures[l].length; i < max; i++) {
            if (this.textures[l][i] instanceof THREE.Texture) {
                this.textures[l][i].dispose();
            }
        }
    }
};

LayeredMaterial.prototype.setSequence = function (sequenceLayer) {
    var offsetLayer = 0;
    var offsetTexture = 0;

    var originalOffsets = new (Function.prototype.bind.apply(Array, [null].concat((0, _toConsumableArray3.default)(this.uniforms.offsetScale_L01.value))))();
    var originalTextures = new (Function.prototype.bind.apply(Array, [null].concat((0, _toConsumableArray3.default)(this.uniforms.dTextures_01.value))))();

    for (var l = 0; l < sequenceLayer.length; l++) {
        var layer = sequenceLayer[l];
        var oldIndex = this.indexOfColorLayer(layer);
        if (oldIndex > -1) {
            var newIndex = l - offsetLayer;
            var texturesCount = this.layerTexturesCount[oldIndex];

            // individual values are swapped in place
            if (newIndex !== oldIndex) {
                moveElementArray(this.colorLayersId, oldIndex, newIndex);
                moveElementArray(this.layerTexturesCount, oldIndex, newIndex);
                moveElementArray(this.uniforms.paramLayers.value, oldIndex, newIndex);
                moveElementArray(this.uniforms.visibility.value, oldIndex, newIndex);
            }
            var oldOffset = this.getTextureOffsetByLayerIndex(newIndex);
            // consecutive values are copied from original
            for (var i = 0; i < texturesCount; i++) {
                this.uniforms.offsetScale_L01.value[offsetTexture + i] = originalOffsets[oldOffset + i];
                this.uniforms.dTextures_01.value[offsetTexture + i] = originalTextures[oldOffset + i];
            }

            this.setTextureOffsetByLayerIndex(newIndex, offsetTexture);
            offsetTexture += texturesCount;
        } else {
            offsetLayer++;
        }
    }

    this.uniforms.colorLayersCount.value = this.getColorLayersCount();
};

LayeredMaterial.prototype.removeColorLayer = function (layer) {
    var layerIndex = this.indexOfColorLayer(layer);

    if (layerIndex === -1) {
        return;
    }

    var offset = this.getTextureOffsetByLayerIndex(layerIndex);
    var texturesCount = this.getTextureCountByLayerIndex(layerIndex);

    // remove layer
    this.colorLayersId.splice(layerIndex, 1);
    this.uniforms.colorLayersCount.value = this.getColorLayersCount();

    // remove nb textures
    this.layerTexturesCount.splice(layerIndex, 1);
    this.layerTexturesCount.push(0);

    // Remove Layers Parameters
    this.uniforms.paramLayers.value.splice(layerIndex, 1);
    this.uniforms.paramLayers.value.push(vector4);

    // Remove visibility Parameters
    this.uniforms.visibility.value.splice(layerIndex, 1);
    this.uniforms.visibility.value.push(true);

    // Dispose Layers textures
    for (var i = offset; i < offset + texturesCount; i++) {
        if (this.textures[_LayeredMaterialConstants.l_COLOR][i] instanceof THREE.Texture) {
            this.textures[_LayeredMaterialConstants.l_COLOR][i].dispose();
        }
    }

    var removedTexturesLayer = this.textures[_LayeredMaterialConstants.l_COLOR].splice(offset, texturesCount);
    this.offsetScale[_LayeredMaterialConstants.l_COLOR].splice(offset, texturesCount);

    var loadedTexturesLayerCount = removedTexturesLayer.reduce(function (sum, texture) {
        return sum + (texture.coords.zoom > _LayeredMaterialConstants.EMPTY_TEXTURE_ZOOM);
    }, 0);

    // refill remove textures
    for (var _i = 0; _i < texturesCount; _i++) {
        this.textures[_LayeredMaterialConstants.l_COLOR].push(emptyTexture);
        this.offsetScale[_LayeredMaterialConstants.l_COLOR].push(vector4);
    }

    // Update slot start texture layer
    for (var j = layerIndex, mx = this.getColorLayersCount(); j < mx; j++) {
        this.uniforms.paramLayers.value[j].x -= texturesCount;
    }

    this.loadedTexturesCount[_LayeredMaterialConstants.l_COLOR] -= loadedTexturesLayerCount;

    this.uniforms.offsetScale_L01.value = this.offsetScale[_LayeredMaterialConstants.l_COLOR];
    this.uniforms.dTextures_01.value = this.textures[_LayeredMaterialConstants.l_COLOR];
};

LayeredMaterial.prototype.setTexturesLayer = function (textures, layerType, layer) {
    var index = this.indexOfColorLayer(layer);
    var slotOffset = this.getTextureOffsetByLayerIndex(index);
    for (var i = 0, max = textures.length; i < max; i++) {
        if (textures[i]) {
            if (textures[i].texture !== null) {
                this.setTexture(textures[i].texture, layerType, i + (slotOffset || 0), textures[i].pitch);
            } else {
                this.setLayerVisibility(index, false);
                break;
            }
        }
    }
};

LayeredMaterial.prototype.setTexture = function (texture, layerType, slot, offsetScale) {
    if (this.textures[layerType][slot] === undefined || this.textures[layerType][slot].image === undefined) {
        this.loadedTexturesCount[layerType] += 1;
    }

    // BEWARE: array [] -> size: 0; array [10]="wao" -> size: 11
    this.textures[layerType][slot] = texture || emptyTexture;
    this.offsetScale[layerType][slot] = offsetScale || new THREE.Vector4(0.0, 0.0, 1.0, 1.0);
};

LayeredMaterial.prototype.setColorLayerParameters = function (params) {
    if (this.getColorLayersCount() === 0) {
        for (var l = 0; l < params.length; l++) {
            this.pushLayer(params[l]);
        }
    }
};

LayeredMaterial.prototype.pushLayer = function (param) {
    var newIndex = this.getColorLayersCount();
    var offset = newIndex === 0 ? 0 : this.getTextureOffsetByLayerIndex(newIndex - 1) + this.getTextureCountByLayerIndex(newIndex - 1);

    this.uniforms.paramLayers.value[newIndex] = new THREE.Vector4();

    this.setTextureOffsetByLayerIndex(newIndex, offset);
    this.setLayerUV(newIndex, param.tileMT.includes('PM') ? param.texturesCount : 0);
    this.setLayerFx(newIndex, param.fx);
    this.setLayerOpacity(newIndex, param.opacity);
    this.setLayerVisibility(newIndex, param.visible);
    this.setLayerTexturesCount(newIndex, param.texturesCount);
    this.colorLayersId.push(param.idLayer);

    this.uniforms.colorLayersCount.value = this.getColorLayersCount();
};

LayeredMaterial.prototype.indexOfColorLayer = function (layerId) {
    return this.colorLayersId.indexOf(layerId);
};

LayeredMaterial.prototype.getColorLayersCount = function () {
    return this.colorLayersId.length;
};

LayeredMaterial.prototype.getTextureOffsetByLayerIndex = function (index) {
    return this.uniforms.paramLayers.value[index].x;
};

LayeredMaterial.prototype.getTextureCountByLayerIndex = function (index) {
    return this.layerTexturesCount[index];
};

LayeredMaterial.prototype.getLayerTextureOffset = function (layerId) {
    var index = this.indexOfColorLayer(layerId);
    return index > -1 ? this.getTextureOffsetByLayerIndex(index) : -1;
};

LayeredMaterial.prototype.setLightingOn = function (enable) {
    this.uniforms.lightingEnabled.value = enable;
};

LayeredMaterial.prototype.setLayerFx = function (index, fx) {
    this.uniforms.paramLayers.value[index].z = fx;
};

LayeredMaterial.prototype.setTextureOffsetByLayerIndex = function (index, offset) {
    this.uniforms.paramLayers.value[index].x = offset;
};

LayeredMaterial.prototype.setLayerUV = function (index, idUV) {
    this.uniforms.paramLayers.value[index].y = idUV;
};

LayeredMaterial.prototype.getLayerUV = function (index) {
    return this.uniforms.paramLayers.value[index].y;
};

LayeredMaterial.prototype.setLayerOpacity = function (index, opacity) {
    if (this.uniforms.paramLayers.value[index]) {
        this.uniforms.paramLayers.value[index].w = opacity;
    }
};

LayeredMaterial.prototype.setLayerVisibility = function (index, visible) {
    this.uniforms.visibility.value[index] = visible;
};

LayeredMaterial.prototype.setLayerTexturesCount = function (index, count) {
    this.layerTexturesCount[index] = count;
};

LayeredMaterial.prototype.getLoadedTexturesCount = function () {
    return this.loadedTexturesCount[_LayeredMaterialConstants.l_ELEVATION] + this.loadedTexturesCount[_LayeredMaterialConstants.l_COLOR];
};

LayeredMaterial.prototype.isColorLayerDownscaled = function (layerId, zoom) {
    return this.textures[_LayeredMaterialConstants.l_COLOR][this.getLayerTextureOffset(layerId)] && this.textures[_LayeredMaterialConstants.l_COLOR][this.getLayerTextureOffset(layerId)].coords.zoom < zoom;
};

LayeredMaterial.prototype.getColorLayerLevelById = function (colorLayerId) {
    var index = this.indexOfColorLayer(colorLayerId);
    if (index === -1) {
        return _LayeredMaterialConstants.EMPTY_TEXTURE_ZOOM;
    }
    var slot = this.getTextureOffsetByLayerIndex(index);
    var texture = this.textures[_LayeredMaterialConstants.l_COLOR][slot];

    return texture ? texture.coords.zoom : _LayeredMaterialConstants.EMPTY_TEXTURE_ZOOM;
};

LayeredMaterial.prototype.getElevationLayerLevel = function () {
    return this.textures[_LayeredMaterialConstants.l_ELEVATION][0].coords.zoom;
};

LayeredMaterial.prototype.getLayerTextures = function (layerType, layerId) {
    if (layerType === _LayeredMaterialConstants.l_ELEVATION) {
        return this.textures[_LayeredMaterialConstants.l_ELEVATION];
    }

    var index = this.indexOfColorLayer(layerId);

    if (index !== -1) {
        var count = this.getTextureCountByLayerIndex(index);
        var textureIndex = this.getTextureOffsetByLayerIndex(index);
        return this.textures[_LayeredMaterialConstants.l_COLOR].slice(textureIndex, textureIndex + count);
    } else {
        throw new Error('Invalid layer id "' + layerId + '"');
    }
};

LayeredMaterial.prototype.setUuid = function (uuid) {
    this.uniforms.uuid.value = uuid;
};

LayeredMaterial.prototype.setFogDistance = function (df) {
    this.uniforms.distanceFog.value = df;
};

LayeredMaterial.prototype.setSelected = function (selected) {
    this.uniforms.selected.value = selected;
};

exports.default = LayeredMaterial;