import Logger from "../../Utils/LoggerByDefault";

/**
 * @classdesc
 * @private
 *
 * @constructor
 * @alias Gp.Formats.XLS.AbstractService
 *
 * @param {Object} [options] - options
 */
function AbstractService (options) {
    this.logger = Logger.getLogger();
    this.logger.trace("[Constructeur AbstractService ()]");

    if (!(this instanceof AbstractService)) {
        throw new TypeError("AbstractService constructor cannot be called as a function.");
    }

    // options par defaut
    this.options = options || {};

    // et on ajoute les options en paramètre aux options par défaut
    for (var opt in options) {
        if (options.hasOwnProperty(opt)) {
            this.options[opt] = options[opt];
        }
    }
}

/**
 * @lends module:AbstractService#
 */
AbstractService.prototype = {

    /**
     * request (out)
     * @type {String}
     */
    strRequest : null,

    /**
     * objet Request
     * @type {Request}
     */
    oRequest : null,

    /**
     * Filter
     * @type {FilterExtension}
     */
    oFilter : null,

    /**
     * Constructeur (alias)
     */
    constructor : AbstractService,

    /**
     * Ajout d'un objet de type Request : GeocodeRequest / ReverseGeocodeRequest / RouteRequest
     *
     * @param {Object} oRequest - GeocodeRequest / ReverseGeocodeRequest / RouteRequest
     */
    addRequest : function (oRequest) {
        this.logger.error("overwritten method !");
    },

    /**
     * Ajout d'un objet de type FilterExtension : GeocodeFilterExtension ou RouteRequestExtension
     *
     * @param {Object} oFilter - GeocodeFilterExtension ou RouteRequestExtension
     */
    addFilter : function (oFilter) {
        this.logger.error("overwritten method !");
    },

    /**
     * toString
     */
    toString : function () {
        this.logger.error("overwritten method !");
    }
};

export default AbstractService;
