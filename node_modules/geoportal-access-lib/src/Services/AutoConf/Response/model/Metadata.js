
/**
 * Object used to describe a metadata file associated with a geoportal resource.
 *
 * @property {String} format - mime-type of the metadata file.
 * @property {String} url - metadata file URL
 *
 * @namespace
 * @alias Gp.Services.Config.Metadata
 */

function Metadata () {
    if (!(this instanceof Metadata)) {
        throw new TypeError("Metadata constructor cannot be called as a function.");
    }

    this.format = null;

    this.url = null;
}

Metadata.prototype = {

    constructor : Metadata

};

export default Metadata;
