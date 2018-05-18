"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.panoramaCulling = panoramaCulling;
exports.panoramaSubdivisionControl = panoramaSubdivisionControl;
function frustumCullingOBB(node, camera) {
    return camera.isBox3Visible(node.OBB().box3D, node.OBB().matrixWorld);
}

function panoramaCulling(node, camera) {
    return !frustumCullingOBB(node, camera);
}

function _isTileBiggerThanTexture(camera, textureSize, quality, node) {
    var obb = node.OBB();

    obb.updateMatrixWorld();
    var onScreen = camera.box3SizeOnScreen(obb.box3D, obb.matrixWorld);

    onScreen.min.z = 0;
    onScreen.max.z = 0;

    // give a small boost to central tiles
    var boost = 1 + Math.max(0, 1 - onScreen.getCenter().length());

    var dim = {
        x: 0.5 * (onScreen.max.x - onScreen.min.x) * camera.width,
        y: 0.5 * (onScreen.max.y - onScreen.min.y) * camera.height
    };

    return boost * dim.x * quality >= textureSize.x && boost * dim.y * quality >= textureSize.y;
}

function panoramaSubdivisionControl(maxLevel, textureSize) {
    return function (context, layer, node) {
        if (maxLevel <= node.level) {
            return false;
        }

        return _isTileBiggerThanTexture(context.camera, textureSize, layer.quality || 1.0, node);
    };
}