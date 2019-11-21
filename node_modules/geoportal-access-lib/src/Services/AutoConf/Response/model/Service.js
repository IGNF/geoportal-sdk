
/**
 * Object used to describe a web service of the geoportal platform.
 *
 * @property {String} title - Web service name
 * @property {Object} serverUrl - Associative array mapping geoportal access key (keys) with their properties (URLs of the web service, with the geoportal access key).
 * @property {String} version - web service version.
 *
 * @namespace
 * @alias Gp.Services.Config.Service
 */
function Service () {
    if (!(this instanceof Service)) {
        throw new TypeError("Service constructor cannot be called as a function.");
    }

    this.title = null;

    this.serverUrl = null;

    this.version = null;
}

Service.prototype = {

    constructor : Service

};

export default Service;
