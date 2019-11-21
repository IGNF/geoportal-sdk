
import Logger from "../../../../Utils/LoggerByDefault";

/**
 * @classdesc
 *
 * Location type "Address".
 *
 * Modèles de classes :
 * ------------------
 * ```
 *
 *                Address
 *            (est composé de)
 *           ______ | _________ _________________
 *          /       |          \                 \
 *      Place (StreetAddress ou FreeFormAddress) PostalCode
 *       (*)       _|_
 *                /   \
 *           Street   Building
 * ```
 * ```
 * XSD
 * Address (balise xsd) :
 *   ex. <Address countryCode="StreetAddress"><freeFormAddress>1 r de paris saint denis</freeFormAddress></Address>
 *   attribute name="countryCode"
 *     element name="freeFormAddress"
 *     element ref="xls:Place"
 *     element ref="gml:Envelope"
 *  ou
 *   ex. <Address countryCode="StreetAddress"><StreetAddress><Street>1 rue Marconi</Street></StreetAddress><Place type="Municipality">Metz</Place><PostalCode>57000</PostalCode></Address>
 *   attribute name="countryCode"
 *     element ref="xls:StreetAddress"
 *     element ref="xls:PostalCode"
 *     element ref="xls:Place"
 *     element ref="gml:Envelope"
 * ```
 *
 * @example
 * // simple
 * adr = new Address ({
 *    location : "2 av pasteur, Saint-Mandée",
 *    type : ["StreetAddress"],
 *    filter : {}
 * });
 * adr.toString();
 * // -> out
 * // <Address countryCode="StreetAddress">
 * //   <freeFormAddress>2 av pasteur, Saint-Mandée</freeFormAddress>
 * // </Address>
 *
 * // avec filtre
 * adr = new Address ({
 *    location : {
 *      number : 2,
 *      street : "av pasteur",
 *      city : "Saint-Mandée", // FIXME filter Place "commune" ou "municipality" ?
 *      postalCode : "94166"   // FIXME filter Place ou balise PostalCode ?
 *    },
 *    type : ["StreetAddress"],
 *    filter : {
 *      territory : "FR",
 *      department : "94"
 *    }
 * });
 * adr.toString();
 * // -> out
 * // <Address countryCode="StreetAddress">
 * //   <StreetAddress>
 * //   <Building number="2"/>
 * //   <Street>2 av pasteur</Street>
 * // </StreetAddress>
 * // <Place type="municipality">Saint-Mandée</Place>
 * // <Place type="departement">94</Place>
 * // <Place type="territoire">FR</Place>
 * // <PostalCode>94166</PostalCode>
 * // </Address>
 *
 * // avec bbox
 * adr = new Address ({
 *    location : "2 av pasteur, Saint-Mandée",
 *    type : ["StreetAddress"],
 *    filter : {
 *      bbox : {left:1, right:2, top:2, bottom:0}
 *    }
 * });
 * adr.toString();
 * // -> out
 * // <Address countryCode="StreetAddress">
 * //   <freeFormAddress>2 av pasteur, Saint-Mandée</freeFormAddress>
 * //   <gml:Envelope>
 * //     <gml:lowerCorner>1 0</gml:lowerCorner>
 * //     <gml:upperCorner>2 2</gml:upperCorner>
 * //   </gl:Envelope>
 * // </Address>
 *
 * @constructor
 * @alias Gp.Formats.XLS.LocationUtilityService.Address
 * @param {Object} options - options
 * @param {Object} options.location - location
 * @param {String} options.type - type
 * @param {String} options.filter - filtres
 * @param {String} options.filter.* - Filtré en fonction des tables de geocodage interrogées
 *
 * @private
 */
function Address (options) {
    this.logger = Logger.getLogger("Address");
    this.logger.trace("[Constructeur Address ()]");

    if (!(this instanceof Address)) {
        throw new TypeError("Address constructor cannot be called as a function.");
    }

    // param par defaut
    this.options = options || {
        location : {},
        type : ["StreetAddress"],
        filter : {}
    };

    // param obligatoire
    if (!options.location) {
        throw new Error("l'option 'location' n'est pas renseignée !");
    }

    // et on ajoute les options en paramètre aux options par défaut
    for (var opt in options) {
        if (options.hasOwnProperty(opt)) {
            this.options[opt] = options[opt];
        }
    }
}

/**
 * @lends module:Address#
 */
Address.prototype = {

    /**
     * Constructeur (alias)
     */
    constructor : Address,

    /**
     * request (out)
     * @type {String}
     */
    requestString : null,

    /**
     * Template de la requête.
     *
     * substitution des valeurs suivantes :
     * - address :  __COUNTRYCODE__, __LOCATION__, __PLACE__, __POSTALCODE__, __ENVELOPE__
     * - freeFormAddress : __FREEFORMADDRESSVALUE__
     * - streetAddress : __STREET__, __BUILDING__
     * - street : __STREETVALUE__
     * - building : __BUILDINGVALUE__
     * - place : __PLACEATYPE__, __PLACEVALUE__
     * - postalCode : __POSTALCODEVALUE__
     * - gml:envelope : __LEFT__ __BOTTOM__ __RIGHT__ __TOP__
     *
     * @todo gestion de l"indentation
     */
    template : {
        address : "<Address countryCode=\"__COUNTRYCODE__\">" +
            "__LOCATION__" +
            "__PLACE__" +
            "__POSTALCODE__" +
            "__ENVELOPE__" +
            "</Address>",
        location : {
            freeFormAddress : "<freeFormAddress>__FREEFORMADDRESSVALUE__</freeFormAddress>",
            streetAddress : {
                container : "<StreetAddress>" +
                    "__STREET__" +
                    "__BUILDING__" +
                    "</StreetAddress>",
                building : "<Building number=\"__BUILDINGVALUE__\"/>",
                street : "<Street>__STREETVALUE__</Street>"
            }
        },
        place : "<Place type=\"__PLACETYPE__\">__PLACEVALUE__</Place>",
        postalCode : "<PostalCode>__POSTALCODEVALUE__</PostalCode>",
        envelope : "<gml:Envelope>" +
            "<gml:lowerCorner>__LEFT__ __BOTTOM__</gml:lowerCorner>" +
            "<gml:upperCorner>__RIGHT__ __TOP__</gml:upperCorner>" +
            "</gml:Envelope>"
    }

};

/**
 * toString
 *
 * @returns {String} requête
 */
Address.prototype.toString = function () {
    var template = null;
    template = this.template.address;
    template = template.replace(/__COUNTRYCODE__/g, this.options.type);

    // on a une adresse structurée ou libre ?
    if (typeof this.options.location === "string") {
        // balise freeFormeAddress
        var tmplFreeFormAddress = this.template.location.freeFormAddress;
        tmplFreeFormAddress = tmplFreeFormAddress.replace(/__FREEFORMADDRESSVALUE__/g, this.options.location);
        template = template.replace(/__LOCATION__/g, tmplFreeFormAddress);
    } else {
        // balises Street et Building
        var tmplBuilding = "";
        var tmplStreet = "";

        if (this.options.location.number) {
            tmplBuilding = this.template.location.streetAddress.building;
            tmplBuilding = tmplBuilding.replace(/__BUILDINGVALUE__/g, this.options.location.number);
        }

        if (this.options.location.street) {
            tmplStreet = this.template.location.streetAddress.street;
            tmplStreet = tmplStreet.replace(/__STREETVALUE__/g, this.options.location.street);
        }

        // balise streetAddress
        var tmplStreetAddress = this.template.location.streetAddress.container;
        tmplStreetAddress = tmplStreetAddress.replace(/__STREET__/g, tmplStreet);
        tmplStreetAddress = tmplStreetAddress.replace(/__BUILDING__/g, tmplBuilding);
        template = template.replace(/__LOCATION__/g, tmplStreetAddress);
    }

    // a t on un filtre de type PostalCode ?
    var tmplPostalCode = "";
    if (this.options.location.postalCode) {
        tmplPostalCode = this.template.postalCode;
        tmplPostalCode = tmplPostalCode.replace(/__POSTALCODEVALUE__/g, this.options.location.postalCode);
    }

    // a t on un filtre de type GML::Envelope ?
    var tmplEnvelope = "";
    if (this.options.filter) {
        var bbox = this.options.filter.bbox;
        if (bbox) {
            tmplEnvelope = this.template.envelope;
            tmplEnvelope = tmplEnvelope.replace(/__LEFT__/g, bbox.left);
            tmplEnvelope = tmplEnvelope.replace(/__BOTTOM__/g, bbox.bottom);
            tmplEnvelope = tmplEnvelope.replace(/__RIGHT__/g, bbox.right);
            tmplEnvelope = tmplEnvelope.replace(/__TOP__/g, bbox.top);
        }
    }

    // liste des filtres Place
    var Places = [];

    // a t on des filtres de type Place ?
    var tmplPlace = "";
    if (this.options.filter) {
        var filters = this.options.filter;
        for (var filter in filters) {
            if (filter === "bbox") {
                continue;
            }
            // FIXME gestion des filtres spécifiques IGN ?
            tmplPlace = this.template.place;
            tmplPlace = tmplPlace.replace(/__PLACETYPE__/g, filter);
            tmplPlace = tmplPlace.replace(/__PLACEVALUE__/g, filters[filter]);
            Places.push(tmplPlace);
        }
    }

    // a t on un filtre de type Place dans location ?
    var tmplPlaceCity = "";
    if (this.options.location.city) {
        tmplPlaceCity = this.template.place;
        tmplPlaceCity = tmplPlaceCity.replace(/__PLACETYPE__/g, "Municipality");
        tmplPlaceCity = tmplPlaceCity.replace(/__PLACEVALUE__/g, this.options.location.city);
        Places.push(tmplPlaceCity);
    }

    template = template.replace(/__POSTALCODE__/g, tmplPostalCode);
    template = template.replace(/__PLACE__/g, Places.join("\n"));
    template = template.replace(/__ENVELOPE__/g, tmplEnvelope);

    this.requestString = template;
    return this.requestString;
};

export default Address;
