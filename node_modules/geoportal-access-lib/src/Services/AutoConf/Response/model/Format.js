
/**
 * Object used to describe a format to use with Geoportal resources.
 *
 * @property {Boolean} current - If true, then this format is used by default.
 * @property {String} name - Format mime-type.
 *
 * @namespace
 * @alias Gp.Services.Config.Format
 */

function Format () {
    if (!(this instanceof Format)) {
        throw new TypeError("Format constructor cannot be called as a function.");
    }

    this.current = null;

    this.name = null;
}

Format.prototype = {

    constructor : Format

};

export default Format;
