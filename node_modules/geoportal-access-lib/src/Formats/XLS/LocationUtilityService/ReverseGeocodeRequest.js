
import Logger from "../../../Utils/LoggerByDefault";
import Position from "./model/Position";
import Preference from "./model/Preference";

/**
 * @classdesc
 *
 * Requête de geocodage inverse
 *
 * XSD
 * ```
 * Geocodage inverse (balise xsd) :
 *   element ref="RequestHeader" [ (attribute name="clientName" attribute name="clientPassword" attribute name="sessionID" attribute name="srsName" attribute name="MSID") ]
 *     element name="Request" attribute name="methodName" attribute name="version" attribute name="requestID" [ attribute name="maximumResponses" ]
 *       element name="ReverseGeocodeRequest"
 *         element ref="xls:Position"
 *         element name="ReverseGeocodePreference" (enumeration)
 * ```
 *
 * @example
 * // creation de l"objet ReverseGeocode
 * req = new ReverseGeocodeRequest ();
 * req.addPosition (new Position (position:{x: , y: }));
 * req.addPreference (["StreetAddress"]);
 * req.toString();
 * // out ->
 * // <ReverseGeocodeRequest>
 * //     <Position>
 * //       <gml:Point xmlns:gml="http://www.opengis.net/gml">
 * //           <gml:pos>50.347775 3.205098</gml:pos>
 * //       </gml:Point>
 * //     </Position>
 * //     <ReverseGeocodePreference>StreetAddress</ReverseGeocodePreference>
 * //  </ReverseGeocodeRequest>
 * @constructor
 * @alias Gp.Formats.XLS.ReverseGeocodeRequest
 * @param {Object} options - options
 * @param {Object}   options.position - position
 * @param {String}   options.returnFreeForm - returnFreeForm
 * @param {String}   options.filterOptions - filtres
 * @param {Function} options.onsuccess - function callback success (TODO)
 * @param {Function} options.onerror   - function callback error   (TODO)
 *
 * @private
 */
function ReverseGeocodeRequest (options) {
    this.logger = Logger.getLogger();
    this.logger.trace("[Constructeur ReverseGeocodeRequest ()]");

    if (!(this instanceof ReverseGeocodeRequest)) {
        throw new TypeError("ReverseGeocodeRequest constructor cannot be called as a function.");
    }

    // options par defaut
    this.options = options || {};

    // et on ajoute les options en paramètre aux options par défaut
    for (var opt in options) {
        if (options.hasOwnProperty(opt)) {
            this.options[opt] = options[opt];
        }
    }

    /**
     * Nom de la classe (heritage)
     */
    this.CLASSNAME = "ReverseGeocodeRequest";
}

ReverseGeocodeRequest.prototype = {

    /**
     * @lends module:ReverseGeocodeRequest#
     */

    /**
     * request (out)
     * @type {String}
     */
    strRequest : null,

    /**
     * Position
     * @type {Position}
     */
    oPosition : null,

    /**
     * Preference
     * @type {Preference}
     */
    oPreference : null,

    /**
     * Constructeur (alias)
     */
    constructor : ReverseGeocodeRequest,

    /**
     * Template de la requête.
     * substitution des valeurs suivantes :
     * __POSITION__, __PREFERENCE__, __RETURNFREEFORM__
     */
    template : "<ReverseGeocodeRequest returnFreeForm=\"__RETURNFREEFORM__\">" +
        "__POSITION__" +
        "__PREFERENCE__" +
        "</ReverseGeocodeRequest>",

    /**
     * Ajout d"un objet de type Position
     *
     * @param {Object} oPosition - Position
     */
    addPosition : function (oPosition) {
        if (oPosition instanceof Position) {
            this.oPosition = oPosition;
        }
    },

    /**
     * Ajout d"une liste de table de référence LUS :
     * [StreetAddress, PointOfInterest, CadastralParcel, Administrativ]
     *
     * @param {Object} oPreference - Preference
     */
    addPreferences : function (oPreference) {
        if (oPreference instanceof Preference) {
            this.oPreference = oPreference;
        }
    },

    /**
     * toString
     * @returns {String} requête
     */
    toString : function () {
        var template = "";
        template = this.template;

        // si on a déjà un objet Preference instancié,
        // sinon, on le fabrique via les options
        if (!this.oPreference) {
            this.oPreference = new Preference(this.options.filterOptions.type || ["StreetAddress"]);
            if (!this.oPreference) {
                throw new Error("Les preferences ne sont pas definies !?");
            }
        }
        template = template.replace(/__PREFERENCE__/g, this.oPreference.toString());

        // si on a déjà un objet Position instancié,
        // sinon, on le fabrique via les options
        if (!this.oPosition) {
            var settings = {
                position : this.options.position,
                filter : {}
            };

            // FIXME gestion des filtres ?
            if (this.options.filterOptions) {
                settings.filter = this.options.filterOptions;
                delete settings.filter.type; // pas besoin ?
            }
            this.oPosition = new Position(settings);
            if (!this.oPosition) {
                throw new Error("La position et ses filtres ne sont pas definis !?");
            }
        }
        template = template.replace(/__POSITION__/g, this.oPosition.toString());
        template = template.replace(/__RETURNFREEFORM__/g, (this.options.returnFreeForm) ? "true" : "false");

        this.strRequest = template;
        return this.strRequest;
    }
};

export default ReverseGeocodeRequest;
