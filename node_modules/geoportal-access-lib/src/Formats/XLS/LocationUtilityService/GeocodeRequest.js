import Logger from "../../../Utils/LoggerByDefault";
import Address from "./model/Address";
import GeocodeFilterExtension from "./GeocodeFilterExtension";

/**
 * @classdesc
 * Requête de geocodage direct
 *
 * ```
 * XSD
 * Geocodage direct (balise xsd) :
 *   element ref="RequestHeader" [ (attribute name="clientName" attribute name="clientPassword" attribute name="sessionID" attribute name="srsName" attribute name="MSID") ]
 *     element name="Request" attribute name="methodName" attribute name="version" attribute name="requestID" [ attribute name="maximumResponses" ]
 *       element name="GeocodeRequest" attribute name="returnFreeForm"
 *         element ref="xls:Address"
 * ```
 *
 * @example
 * // creation de l'objet Geocode an ajoutant un objet Address
 * req = new GeocodeRequest ();
 * req.returnFreeForm = true; // TODO !
 * req.addAddress (new Address ({
 *      location : "saint mandé",
 *      type : ['PositionOfInterest'],
 *      filter : {
 *          (...)
 *      }
 * }));
 * req.toString();
 * // out ->
 * // <GeocodeRequest>
 * //   <Address countryCode="PositionOfInterest">
 * //     <freeFormAddress>saint mandé</freeFormAddress>
 * //   </Address>
 * // </GeocodeRequest>
 *
 * // creation de l'objet Geocode avec les options uniquement
 * req = new GeocodeRequest ({
 *      location : "saint mandé",
 *      returnFreeForm : true,
 *      filterOptions : {
 *          type : ['PositionOfInterest'],
 *          (...)
 *      }
 * });
 * req.toString();
 * // out ->
 * // <GeocodeRequest>
 * //   <Address countryCode="PositionOfInterest">
 * //     <freeFormAddress>saint mandé</freeFormAddress>
 * //   </Address>
 * // </GeocodeRequest>
 * @constructor
 *
 * @alias Gp.Formats.XLS.LocationUtilityService.GeocodeRequest
 * @param {Object} options - options
 * @param {Object}   options.location - location
 * @param {String}   options.returnFreeForm - returnFreeForm
 * @param {String}   options.filterOptions - filtres
 * @param {Function} options.onsuccess - function callback success (TODO)
 * @param {Function} options.onerror   - function callback error   (TODO)
 *
 * @private
 */
function GeocodeRequest (options) {
    this.logger = Logger.getLogger();
    this.logger.trace("[Constructeur GeocodeRequest ()]");

    if (!(this instanceof GeocodeRequest)) {
        throw new TypeError("GeocodeRequest constructor cannot be called as a function.");
    }

    // options par defaut
    this.options = options || {};

    // et on ajoute les options en paramètre aux options par défaut
    for (var opt in options) {
        if (options.hasOwnProperty(opt)) {
            this.options[opt] = options[opt];
        }
    }

    // TODO
    // gestion de l'option 'returnFreeForm' si elle n'est pas renseignée dans les options !

    /**
     * Nom de la classe (heritage)
     */
    this.CLASSNAME = "GeocodeRequest";
}

GeocodeRequest.prototype = {

    /**
     * @lends module:GeocodeRequest#
     */

    /**
     * request (out)
     * @type {String}
     */
    strRequest : null,

    /**
     * Addresse
     * @type {Address}
     */
    oAddress : null,

    /**
     * Filter
     * @type {GeocodeFilterExtension}
     */
    oFilter : null,

    /**
     * Template de la requête.
     * substitution des valeurs suivantes :
     * __ADDRESS__, __RETURNFREEFORM__
     */
    template : "<GeocodeRequest returnFreeForm=\"__RETURNFREEFORM__\">" +
        "__ADDRESS__" +
        "</GeocodeRequest>",

    /**
     * Ajout d'un objet de type Adresse
     *
     * @param {Object} oAddress - Adresse
     */
    addAddress : function (oAddress) {
        if (oAddress instanceof Address) {
            this.oAddress = oAddress;
        }
    },

    /**
     * Ajout d'un objet de type GeocodeFilterExtension
     *
     * @param {Object} oFilter - GeocodeFilterExtension
     */
    addFilter : function (oFilter) {
        // FIXME gestion des filtres à partir des tables de geocodages
        if (oFilter instanceof GeocodeFilterExtension) {
            this.oFilter = oFilter;
        }
    },

    /**
     * Constructeur (alias)
     */
    constructor : GeocodeRequest,

    /**
     * toString
     *
     * @returns {String} requête
     */
    toString : function () {
        var template = "";
        template = this.template;

        // soit on a déjà un objet Address instancié,
        // sinon, on le fabrique via les options
        if (!this.oAddress) {
            var settings = {};
            settings.location = this.options.location;
            settings.type = this.options.filterOptions.type || ["StreetAddress"];
            settings.filter = this.options.filterOptions;
            delete settings.filter.type; // on ne met pas le 'type' dans les filtres...

            // gestion des filtres
            if (this.oFilter) {
                // on reconstruit les filtres
                settings.filter = {};

                // on determine la liste des filtres possibles
                // pour chaque table de geocodage en param
                for (var idx in settings.type) {
                    var filter = settings.type[idx];
                    var oFilter = this.oFilter.getFilter(filter);

                    if (!oFilter) {
                        this.logger.warn("Le filtre '" + filter + "' n'existe pas !?");
                        continue;
                    }

                    var mFilter = this.options.filterOptions;

                    // correspondances des attributs de filtres possibles avec ceux qui sont en options
                    var attributs = oFilter.attributesList;
                    for (var idxe = 0; idxe < attributs.length; idxe++) {
                        var key = attributs[idxe];
                        if (mFilter[key]) {
                            var matchingKey = oFilter.serviceAttributes[idxe];
                            oFilter.placeAttributes[matchingKey] = mFilter[key];
                            this.logger.trace("Selection du filtre '" + key + "' sur le type '" + filter + "'.");
                        }
                    }

                    // ajout des valeurs des filtres
                    var places = oFilter.placeAttributes;
                    for (var kplace in places) {
                        if (places.hasOwnProperty(kplace)) {
                            settings.filter[kplace] = places[kplace];
                        }
                    }
                }
            }

            this.oAddress = new Address(settings);
            if (!this.oAddress) {
                throw new Error("La construction de l'adresse n'est pas correctement definie !?");
            }
        }

        // FIXME gestion des filtres pour un objet Address déjà instancié ?

        template = template.replace(/__ADDRESS__/g, this.oAddress.toString());
        template = template.replace(/__RETURNFREEFORM__/g, (this.options.returnFreeForm) ? "true" : "false");

        this.strRequest = template;
        return this.strRequest;
    }
};

export default GeocodeRequest;
