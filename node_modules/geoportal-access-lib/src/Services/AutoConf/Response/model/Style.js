
/**
 * Object used to describe a style that may be used for a geoportal resource.
 *
 * @property {String} name - Style identifier (eg : "normal", "bdparcellaire", ...)
 * @property {String} title - human readable name of the style.
 * @property {Boolean} current - true if this is the default style.
 * @property {String} url - Url Style (eg: vectortile).
 *
 * @namespace
 * @alias Gp.Services.Config.Style
 */

function Style () {
    if (!(this instanceof Style)) {
        throw new TypeError("Style constructor cannot be called as a function.");
    }

    this.name = null;

    this.title = null;

    this.current = null;

    this.url = null;
}

Style.prototype = {

    constructor : Style

};

export default Style;
