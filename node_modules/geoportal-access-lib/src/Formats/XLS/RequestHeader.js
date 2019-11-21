import Logger from "../../Utils/LoggerByDefault";

/**
 * @classdesc
 *
 * Entête de la requête XSL
 *
 * @example
 * // header XSL
 * header = new RequestHeader ();
 * header.srsName = "epsg:4326";
 * header.toString();
 * // out ->
 * // <RequestHeader srsName="epsg:4326"/>
 *
 * @constructor
 * @alias Gp.Formats.XLS.RequestHeader
 * @param {Object} options - options
 * @param {Object}   options.srsName - projection
 * @param {Function} options.onsuccess - function callback success (TODO)
 * @param {Function} options.onerror   - function callback error   (TODO)
 *
 * @private
 */
function RequestHeader (options) {
    this.logger = Logger.getLogger();
    this.logger.trace("[Constructeur RequestHeader ()]");

    if (!(this instanceof RequestHeader)) {
        throw new TypeError("RequestHeader constructor cannot be called as a function.");
    }

    // options par defaut
    this.options = options || {
        srsName : "EPSG:4326"
    };

    // et on ajoute les options en paramètre aux options par défaut
    for (var opt in options) {
        if (options.hasOwnProperty(opt)) {
            this.options[opt] = options[opt];
        }
    }
}

RequestHeader.prototype = {

    /**
     * @lends module:RequestHeader#
     */

    /**
     * request (out)
     * @type {String}
     */
    requestString : null,

    /**
     * Template de la requête.
     * substitution des valeurs suivantes :
     * __SRSNAME__
     */
    template : "<RequestHeader srsName=\"__SRSNAME__\"/>",

    /**
     * Constructeur (alias)
     */
    constructor : RequestHeader,

    /**
     * toString
     * @returns {String} requête
     */
    toString : function () {
        var template = null;
        template = this.template;
        template = template.replace(/__SRSNAME__/g, this.options.srsName);
        this.requestString = template;
        return this.requestString;
    }
};

export default RequestHeader;
