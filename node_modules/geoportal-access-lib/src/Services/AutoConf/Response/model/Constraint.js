
/**
 *
 * Object used to express a geographical (BBOX, scale) and temporal constraint.
 *
 * @property {String} crs - Coordinates System ID used to express coordinates contraints.
 * @property {Gp.BBox} bbox - Constraint Bounding Box.
 * @property {Number} minScaleDenominator - Minimum scale denominator where constraint applies.
 * @property {Number} maxScaleDenominator - Maximum scale denominator where constraint applies.
 * @property {Array.<String>} temporalExtent - Array expressing the time interval of the constraint [minT, maxT]. Dates are expressed in the [ISO-8601]{@link https://en.wikipedia.org/wiki/ISO_8601} way.
 *
 * @namespace
 * @alias Gp.Services.Config.Constraint
 */

function Constraint () {
    if (!(this instanceof Constraint)) {
        throw new TypeError("Constraint constructor cannot be called as a function.");
    }

    this.crs = null;

    this.bbox = {
        left : null,
        right : null,
        top : null,
        bottom : null
    };

    this.minScaleDenominator = null;

    this.maxScaleDenominator = null;

    this.temporalExtent = [null, null];
}

Constraint.prototype = {

    constructor : Constraint

};

export default Constraint;
