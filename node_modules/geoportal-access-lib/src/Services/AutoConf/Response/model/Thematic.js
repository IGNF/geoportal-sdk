
/**
 * Object used to describe a thematic
 *
 * @property {String} name - Thematic name
 * @property {Boolean} inspire - true if the thematic name is an [INSPIRE one]{@link http://inspire.ec.europa.eu/index.cfm/pageid/2/list/7}.
 *
 * @namespace
 * @alias Gp.Services.Config.Thematic
 */

function Thematic () {
    if (!(this instanceof Thematic)) {
        throw new TypeError("Thematic constructor cannot be called as a function.");
    }

    this.inspire = null;

    this.name = null;
}

Thematic.prototype = {

    constructor : Thematic

};

export default Thematic;
