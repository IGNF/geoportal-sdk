
/**
 * Object used to describe a legend file associated with a geoportal resource (WMTS, WMS, WFS layers).
 *
 * @property {String} format - mime-type of the legend file.
 * @property {String} url - legend file URL
 * @property {Number} minScaleDenominator - minimum scale denominator where this legend applies.
 *
 * @namespace
 * @alias Gp.Services.Config.Legend
 */

function Legend () {
    if (!(this instanceof Legend)) {
        throw new TypeError("Legend constructor cannot be called as a function.");
    }

    this.format = null;

    this.url = null;

    this.minScaleDenominator = null;
}

Legend.prototype = {

    constructor : Legend

};

export default Legend;
