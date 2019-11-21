/* jshint bitwise: false */
import Logger from "../../Utils/LoggerByDefault";

/**
 * @classdesc
 *
 * Requête XLS
 *
 * @example
 * // request XSL
 * request = new Request ();
 * request.maximumResponses = 26;
 * request.methodName = "GeocodeRequest";
 * request.version = "1.2";
 * request.toString();
 * // out ->
 * // <Request maximumResponses="26" methodName="GeocodeRequest" requestID="uid1349081498314_388" version="1.2">
 * //   <!-- __LUS__ -->
 * //  </Request>
 *
 * @constructor
 * @alias Gp.Formats.XLS.Request
 * @param {Object} options - options
 * @param {Object}   options.maximumResponses - 25
 * @param {String}   options.methodName - nom de l'objet LUS, "GeocodeRequest" | "ReverseGeocodeRequest"
 * @param {String}   options.version - '1.2'
 * @param {Function} options.onsuccess - function callback success (TODO)
 * @param {Function} options.onerror   - function callback error   (TODO)
 *
 * @private
 */
function Request (options) {
    this.logger = Logger.getLogger();
    this.logger.trace("[Constructeur Request ()]");

    if (!(this instanceof Request)) {
        throw new TypeError("Request constructor cannot be called as a function.");
    }

    // options par defaut
    this.options = options || {
        maximumResponses : 25,
        methodName : null,
        version : "1.2"
    };

    // et on ajoute les options en paramètre aux options par défaut
    for (var opt in options) {
        if (options.hasOwnProperty(opt)) {
            this.options[opt] = options[opt];
        }
    }
}

Request.prototype = {

    /**
     * @lends module:Request#
     */

    /**
     * request (out)
     * @type {String}
     */
    requestString : null,

    /**
     * Template de la requête.
     * substitution des valeurs suivantes :
     * __MAXRESPONSES__, __METHODNAME__, __UUID__, __VERSION__
     * __REQUESTSERVICE__
     */
    template : "<Request maximumResponses=\"__MAXRESPONSES__\" methodName=\"__METHODNAME__\" requestID=\"__UUID__\" version=\"__VERSION__\">" +
        "<!-- __REQUESTSERVICE__ -->" +
        "</Request>",

    /**
     * Constructeur (alias)
     */
    constructor : Request,

    /**
     * an rfc4122 version 4 compliant guid
     * @returns {String} guid
     */
    guid : function () {
        // INFO
        // cf. http://byronsalau.com/blog/how-to-create-a-guid-uuid-in-javascript/
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0;
            var v = c === "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },

    /**
     * toString
     * @returns {String} requête
     */
    toString : function () {
        var template = null;
        template = this.template;
        template = template.replace(/__MAXRESPONSES__/g, this.options.maximumResponses);
        template = template.replace(/__METHODNAME__/g, this.options.methodName);
        template = template.replace(/__UUID__/g, this.guid());
        template = template.replace(/__VERSION__/g, this.options.version);

        this.requestString = template;
        return this.requestString;
    }
};

export default Request;
