'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _log = require('babel-runtime/core-js/math/log2');

var _log2 = _interopRequireDefault(_log);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _three = require('three');

var THREE = _interopRequireWildcard(_three);

var _Coordinates = require('../Core/Geographic/Coordinates');

var _Coordinates2 = _interopRequireDefault(_Coordinates);

var _LayeredMaterialConstants = require('../Renderer/LayeredMaterialConstants');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FAST_READ_Z = 0;
var PRECISE_READ_Z = 1;

/**
 * Utility module to retrieve elevation at a given coordinates.
 * The returned value is read in the elevation textures used by the graphics card
 * to render the tiles (globe or plane).
 * This implies that the return value may change depending on the current tile resolution.
 */
exports.default = {
    /**
     * Return current displayed elevation at coord in meters.
     * @param {GeometryLayer} layer The tile layer owning the elevation textures we're going to query.
     * This is typically the globeLayer or a planeLayer.
     * @param {Coordinates} coord The coordinates that we're interested in
     * @param {Number} method 2 available method: FAST_READ_Z (default) or PRECISE_READ_Z. Chosing between
     * the 2 is a compromise between performance and visual quality
     * @param {Array} tileHint Optional array of tiles to speed up the process. You can give candidates tiles
     * likely to contain 'coord'. Otherwise the lookup process starts from the root.
     * @return {object}  undefined if no result or z: displayed elevation in meters, texture: where the z value comes from, tile: owner of the texture
     */
    getElevationValueAt: function getElevationValueAt(layer, coord) {
        var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : FAST_READ_Z;
        var tileHint = arguments[3];

        var result = _readZ(layer, method, coord, tileHint || layer.level0Nodes);
        if (result) {
            return { z: result.coord._values[2], texture: result.texture, tile: result.tile };
        }
    },


    /**
     * Helper method that will position an object directly on the ground.
     * @param {GeometryLayer} layer The tile layer owning the elevation textures we're going to query.
     * This is typically the globeLayer or a planeLayer.
     * @param {string} objectCRS the CRS used by the object coordinates. You probably want to use view.referenceCRS here.
     * @param {Object3D} obj the object we want to modify.
     * @param {object} options
     * @param {number} options.method see getElevationValueAt documentation
     * @param {boolean} options.modifyGeometry if unset/false, this function will modify object.position. If true, it will
     * modify obj.geometry.vertices or obj.geometry.attributes.position
     * @param {Array} tileHint see getElevationValueAt documentation
     * @return {boolean} true if successful, false if we couldn't lookup the elevation at the given coords
     */
    placeObjectOnGround: function placeObjectOnGround(layer, objectCRS, obj) {
        var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
        var tileHint = arguments[4];

        var tiles = void 0;
        if (tileHint) {
            tiles = tileHint.concat(layer.level0Nodes);
        } else {
            tiles = layer.level0Nodes;
        }

        if (!options.modifyGeometry) {
            if (options.cache) {
                options.cache.length = 1;
            }
            var matrices = {
                worldFromLocal: obj.parent ? obj.parent.matrixWorld : undefined,
                localFromWorld: obj.parent ? new THREE.Matrix4().getInverse(obj.parent.matrixWorld) : undefined
            };
            var result = _updateVector3(layer, options.method || FAST_READ_Z, tiles, objectCRS, obj.position, options.offset || 0, matrices, undefined, options.cache ? options.cache[0] : undefined);

            if (result) {
                if (options.cache) {
                    options.cache[0] = result;
                }
                obj.updateMatrix();
                obj.updateMatrixWorld();
                return true;
            }
        } else {
            var _matrices = {
                worldFromLocal: obj.matrixWorld,
                localFromWorld: new THREE.Matrix4().getInverse(obj.matrixWorld)
            };

            var geometry = obj.geometry;
            if (geometry.vertices) {
                if (options.cache) {
                    options.cache.length = geometry.vertices.length;
                }

                var success = true;
                var coord = new _Coordinates2.default(objectCRS);
                for (var i = 0; i < geometry.vertices.length; i++) {
                    var cached = options.cache ? options.cache[i] : undefined;

                    var _result = _updateVector3(layer, options.method || FAST_READ_Z, tiles, objectCRS, geometry.vertices[i], options.offset || 0, _matrices, coord, cached);

                    if (options.cache) {
                        options.cache[i] = _result;
                    }
                    if (!_result) {
                        success = false;
                    }
                }
                geometry.verticesNeedUpdate = true;
                return success;
            } else if (geometry instanceof THREE.BufferGeometry) {
                if (options.cache) {
                    options.cache.length = geometry.attributes.position.count;
                }
                var _success = true;

                var tmp = new THREE.Vector3();
                var _coord = new _Coordinates2.default(objectCRS);
                for (var _i = 0; _i < geometry.attributes.position.count; _i++) {
                    var _cached = options.cache ? options.cache[_i] : undefined;

                    tmp.fromBufferAttribute(geometry.attributes.position, _i);
                    var prev = tmp.z;
                    var _result2 = _updateVector3(layer, options.method || FAST_READ_Z, tiles, objectCRS, tmp, options.offset || 0, _matrices, _coord, _cached);
                    if (options.cache) {
                        options.cache[_i] = _result2;
                    }
                    if (!_result2) {
                        _success = false;
                    }
                    if (prev != tmp.z) {
                        geometry.attributes.position.needsUpdate = true;
                    }
                    geometry.attributes.position.setXYZ(_i, tmp.x, tmp.y, tmp.z);
                }
                return _success;
            }
        }
    },

    FAST_READ_Z: FAST_READ_Z,
    PRECISE_READ_Z: PRECISE_READ_Z
};


function tileAt(pt, tile) {
    if (tile.extent) {
        if (!tile.extent.isPointInside(pt)) {
            return undefined;
        }

        for (var i = 0; i < tile.children.length; i++) {
            var t = tileAt(pt, tile.children[i]);
            if (t) {
                return t;
            }
        }
        if (tile.getLayerTextures(_LayeredMaterialConstants.l_ELEVATION)[0].coords.zoom > -1) {
            return tile;
        }
        return undefined;
    }
}

var _canvas = void 0;
function _readTextureValueAt(layer, texture) {
    for (var _len = arguments.length, uv = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        uv[_key - 2] = arguments[_key];
    }

    for (var i = 0; i < uv.length; i += 2) {
        uv[i] = THREE.Math.clamp(uv[i], 0, texture.image.width - 1);
        uv[i + 1] = THREE.Math.clamp(uv[i + 1], 0, texture.image.height - 1);
    }

    if (texture.image.data) {
        // read a single value
        if (uv.length === 2) {
            return texture.image.data[uv[1] * texture.image.width + uv[0]];
        }
        // or read multiple values
        var result = [];
        for (var _i2 = 0; _i2 < uv.length; _i2 += 2) {
            result.push(texture.image.data[uv[_i2 + 1] * texture.image.width + uv[_i2]]);
        }
        return result;
    } else {
        if (!_canvas) {
            _canvas = document.createElement('canvas');
            _canvas.width = 2;
            _canvas.height = 2;
        }
        var minx = Infinity;
        var miny = Infinity;
        var maxx = -Infinity;
        var maxy = -Infinity;
        for (var _i3 = 0; _i3 < uv.length; _i3 += 2) {
            minx = Math.min(uv[_i3], minx);
            miny = Math.min(uv[_i3 + 1], miny);
            maxx = Math.max(uv[_i3], maxx);
            maxy = Math.max(uv[_i3 + 1], maxy);
        }
        var dw = maxx - minx + 1;
        var dh = maxy - miny + 1;
        _canvas.width = Math.max(_canvas.width, dw);
        _canvas.height = Math.max(_canvas.height, dh);

        var ctx = _canvas.getContext('2d');
        ctx.drawImage(texture.image, minx, miny, dw, dh, 0, 0, dw, dh);
        var d = ctx.getImageData(0, 0, dw, dh);

        var _result3 = [];
        for (var _i4 = 0; _i4 < uv.length; _i4 += 2) {
            var ox = uv[_i4] - minx;
            var oy = uv[_i4 + 1] - miny;

            // d is 4 bytes per pixel
            _result3.push(THREE.Math.lerp(layer.materialOptions.colorTextureElevationMinZ, layer.materialOptions.colorTextureElevationMaxZ, d.data[4 * oy * dw + 4 * ox] / 255));
        }
        if (uv.length === 2) {
            return _result3[0];
        } else {
            return _result3;
        }
    }
}

function _convertUVtoTextureCoords(texture, u, v) {
    var width = texture.image.width;
    var height = texture.image.height;

    var up = Math.max(0, u * width - 0.5);
    var vp = Math.max(0, v * height - 0.5);

    var u1 = Math.floor(up);
    var u2 = Math.ceil(up);
    var v1 = Math.floor(vp);
    var v2 = Math.ceil(vp);

    return { u1: u1, u2: u2, v1: v1, v2: v2, wu: up - u1, wv: vp - v1 };
}

function _readTextureValueNearestFiltering(layer, texture, vertexU, vertexV) {
    var coords = _convertUVtoTextureCoords(texture, vertexU, vertexV);

    var u = coords.wu <= 0 ? coords.u1 : coords.u2;
    var v = coords.wv <= 0 ? coords.v1 : coords.v2;

    return _readTextureValueAt(layer, texture, u, v);
}

function _readTextureValueWithBilinearFiltering(layer, texture, vertexU, vertexV) {
    var coords = _convertUVtoTextureCoords(texture, vertexU, vertexV);

    var _readTextureValueAt2 = _readTextureValueAt(layer, texture, coords.u1, coords.v1, coords.u2, coords.v1, coords.u1, coords.v2, coords.u2, coords.v2),
        _readTextureValueAt3 = (0, _slicedToArray3.default)(_readTextureValueAt2, 4),
        z11 = _readTextureValueAt3[0],
        z21 = _readTextureValueAt3[1],
        z12 = _readTextureValueAt3[2],
        z22 = _readTextureValueAt3[3];

    // horizontal filtering


    var zu1 = THREE.Math.lerp(z11, z21, coords.wu);
    var zu2 = THREE.Math.lerp(z12, z22, coords.wu);
    // then vertical filtering
    return THREE.Math.lerp(zu1, zu2, coords.wv);
}

function _readZFast(layer, texture, uv) {
    return _readTextureValueNearestFiltering(layer, texture, uv.x, uv.y);
}

function _readZCorrect(layer, texture, uv, tileDimensions, tileOwnerDimensions) {
    // We need to emulate the vertex shader code that does 2 thing:
    //   - interpolate (u, v) between triangle vertices: u,v will be multiple of 1/nsegments
    //     (for now assume nsegments == 16)
    //   - read elevation texture at (u, v) for

    // Determine u,v based on the vertices count.
    // 'modulo' is the gap (in [0, 1]) between 2 successive vertices in the geometry
    // e.g if you have 5 vertices, the only possible values for u (or v) are: 0, 0.25, 0.5, 0.75, 1
    // so modulo would be 0.25
    // note: currently the number of segments is hard-coded to 16 (see TileProvider) => 17 vertices
    var modulo = tileDimensions.x / tileOwnerDimensions.x / (17 - 1);
    var u = Math.floor(uv.x / modulo) * modulo;
    var v = Math.floor(uv.y / modulo) * modulo;

    if (u == 1) {
        u -= modulo;
    }
    if (v == 1) {
        v -= modulo;
    }

    // Build 4 vertices, 3 of them will be our triangle:
    //    11---21
    //    |   / |
    //    |  /  |
    //    | /   |
    //    21---22
    var u1 = u;
    var u2 = u + modulo;
    var v1 = v;
    var v2 = v + modulo;

    // Our multiple z-value will be weigh-blended, depending on the distance of the real point
    // so lu (resp. lv) are the weight. When lu -> 0 (resp. 1) the final value -> z at u1 (resp. u2)
    var lu = (uv.x - u) / modulo;
    var lv = (uv.y - v) / modulo;

    // Determine if we're going to read the vertices from the top-left or lower-right triangle
    // (low-right = on the line 21-22 or under the diagonal lu = 1 - lv)


    var tri = new THREE.Triangle(new THREE.Vector3(u1, v2), new THREE.Vector3(u2, v1), lv == 1 || lu / (1 - lv) >= 1 ? new THREE.Vector3(u2, v2) : new THREE.Vector3(u1, v1));

    // bary holds the respective weight of each vertices of the triangles
    var bary = tri.barycoordFromPoint(new THREE.Vector3(uv.x, uv.y));

    // read the 3 interesting values
    var z1 = _readTextureValueWithBilinearFiltering(layer, texture, tri.a.x, tri.a.y);
    var z2 = _readTextureValueWithBilinearFiltering(layer, texture, tri.b.x, tri.b.y);
    var z3 = _readTextureValueWithBilinearFiltering(layer, texture, tri.c.x, tri.c.y);

    // Blend with bary
    return z1 * bary.x + z2 * bary.y + z3 * bary.z;
}

var temp = {
    v: new THREE.Vector3(),
    coord1: new _Coordinates2.default('EPSG:4978'),
    coord2: new _Coordinates2.default('EPSG:4978'),
    offset: new THREE.Vector2()
};

function _readZ(layer, method, coord, nodes, cache) {
    var pt = coord.as(layer.extent.crs(), temp.coord1);

    var tileWithValidElevationTexture = null;
    // first check in cache
    if (cache && cache.tile && cache.tile.material) {
        tileWithValidElevationTexture = tileAt(pt, cache.tile);
    }
    for (var i = 0; !tileWithValidElevationTexture && i < nodes.length; i++) {
        tileWithValidElevationTexture = tileAt(pt, nodes[i]);
    }

    if (!tileWithValidElevationTexture) {
        // failed to find a tile, abort
        return;
    }

    var tile = tileWithValidElevationTexture;
    var src = tileWithValidElevationTexture.getLayerTextures(_LayeredMaterialConstants.l_ELEVATION)[0];

    // check cache value if existing
    if (cache) {
        if (cache.id === src.id && cache.version === src.version) {
            return { coord: pt, texture: src, tile: tile };
        }
    }

    // Assuming that tiles are split in 4 children, we lookup the parent that
    // really owns this texture
    var stepsUpInHierarchy = Math.round((0, _log2.default)(1.0 / tileWithValidElevationTexture.material.offsetScale[_LayeredMaterialConstants.l_ELEVATION][0].z));
    for (var _i5 = 0; _i5 < stepsUpInHierarchy; _i5++) {
        tileWithValidElevationTexture = tileWithValidElevationTexture.parent;
    }

    // offset = offset from top-left
    var offset = pt.offsetInExtent(tileWithValidElevationTexture.extent, temp.offset);

    // At this point we have:
    //   - tileWithValidElevationTexture.texture.image which is the current image
    //     used for rendering
    //   - offset which is the offset in this texture for the coordinate we're
    //     interested in
    // We now have 2 options:
    //   - the fast one: read the value of tileWithValidElevationTexture.texture.image
    //     at (offset.x, offset.y) and we're done
    //   - the correct one: emulate the vertex shader code
    if (method == PRECISE_READ_Z) {
        pt._values[2] = _readZCorrect(layer, src, offset, tile.extent.dimensions(), tileWithValidElevationTexture.extent.dimensions());
    } else {
        pt._values[2] = _readZFast(layer, src, offset);
    }
    return { coord: pt, texture: src, tile: tile };
}

function _updateVector3(layer, method, nodes, vecCRS, vec, offset) {
    var matrices = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : {};
    var coords = arguments[7];
    var cache = arguments[8];

    var coord = coords || new _Coordinates2.default(vecCRS);
    if (matrices.worldFromLocal) {
        coord.set(vecCRS, temp.v.copy(vec).applyMatrix4(matrices.worldFromLocal));
    } else {
        coord.set(vecCRS, vec);
    }
    var result = _readZ(layer, method, coord, nodes, cache);
    if (result) {
        result.coord._values[2] += offset;
        result.coord.as(vecCRS, temp.coord2).xyz(vec);
        if (matrices.localFromWorld) {
            vec.applyMatrix4(matrices.localFromWorld);
        }
        return { id: result.texture.id, version: result.texture.version, tile: result.tile };
    }
}