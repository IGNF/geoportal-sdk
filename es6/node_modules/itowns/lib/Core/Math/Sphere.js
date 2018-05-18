'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _three = require('three');

var THREE = _interopRequireWildcard(_three);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function Sphere(center, radius) {
    this.center = center || new THREE.Vector3();
    this.radius = radius || 1.0;
}

Sphere.prototype.constructor = Sphere;

Sphere.prototype.setCenter = function (center) {
    this.center.copy(center);
};

Sphere.prototype.setRadius = function (radius) {
    this.radius = radius;
};

var vector = new THREE.Vector3();

Sphere.prototype.intersectWithRayNoMiss = function (ray) {
    var pc = ray.closestPointToPoint(this.center);
    var a = pc.length();
    var d = void 0;
    var b = void 0;

    // TODO: recompute mirror ray
    // If the ray miss sphere, we recompute the new ray with point symetric to tangent sphere
    if (a > this.radius) {
        // mirror point is symetric of pc
        // The mirror ray must pass through the point mirrorPoint
        var mirrorPoint = pc.clone().setLength(this.radius * 2 - a);

        // Compute the new direction
        d = ray.direction.subVectors(mirrorPoint, ray.origin).normalize();

        // Classic intersection with the new ray
        pc = ray.closestPointToPoint(this.center);
        a = pc.length();

        b = Math.sqrt(this.radius * this.radius - a * a);
        d.setLength(b);

        return vector.addVectors(pc, d);
    }

    // TODO: check all intersections : if (ray.origin.length() > this.radius)
    d = ray.direction.clone();
    b = Math.sqrt(this.radius * this.radius - a * a);
    d.setLength(b);

    return vector.subVectors(pc, d);
};

Sphere.prototype.intersectWithRay = function (ray) {
    var pc = ray.closestPointToPoint(this.center);
    var a = pc.length();
    if (a > this.radius) return undefined;
    var d = ray.direction.clone();
    var b = Math.sqrt(this.radius * this.radius - a * a);
    d.setLength(b);
    return vector.subVectors(pc, d);
};

exports.default = Sphere;