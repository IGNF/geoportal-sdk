import Logger from "../../Utils/LoggerByDefault";
import AbstractService from "./AbstractService";
import GeocodeRequest from "./LocationUtilityService/GeocodeRequest";
import ReverseGeocodeRequest from "./LocationUtilityService/ReverseGeocodeRequest";
import GeocodeFilterExtension from "./LocationUtilityService/GeocodeFilterExtension";

/**
 * @classdesc
 *
 * Requête de type LocationUtilityService (LUS)
 * (Factory)
 *
 * @example
 * // encapsule un objet dans une coquille XSL, Factory sur les objets Geocode/ReverseGeocode
 * lus = new LocationUtilityService ();
 * lus.addRequest (req);
 * lus.toString();
 *  ou
 * lus = new LocationUtilityService ({
 *      location : "saint mandé",
 *      returnFreeForm : true,
 *      filterOptions : {
 *          type :  ['PositionOfInterest']
 *      }
 * });
 * lus.toString();
 *
 * // out ->
 * // <GeocodeRequest>
 * //   <Address countryCode="PositionOfInterest">
 * //     <freeFormAddress>saint mandé</freeFormAddress>
 * //   </Address>
 * // </GeocodeRequest>
 *
 * // creation de l'objet Geocode
 * req = new GeocodeRequest ();
 * req.addAddress (new Address (/*todo/*));
 * req.toString();
 * // out ->
 * // <GeocodeRequest>
 * //   <Address countryCode="PositionOfInterest">
 * //     <freeFormAddress>saint mandé</freeFormAddress>
 * //   </Address>
 * // </GeocodeRequest>
 *
 * // creation de l'objet ReverseGeocode
 * req = new ReverseGeocodeRequest ();
 * req.addPosition (new Position (position:{x: , y: }));
 * req.addPreference (['StreetAddress']);
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
 *
 * @constructor
 * @alias Gp.Formats.XLS.LocationUtilityService
 * @param {Object} options - options
 * @param {Object}   options.location - location
 * @param {String}   options.position - position : {x : "", y : ""}
 * @param {String}   options.returnFreeForm - true|false
 * @param {Object}   options.filterOptions - filtres
 * @param {Function} options.onsuccess - function callback success (TODO)
 * @param {Function} options.onerror   - function callback error   (TODO)
 *
 * @private
 */
function LocationUtilityService (options) {
    this.logger = Logger.getLogger();
    this.logger.trace("[Constructeur LocationUtilityService ()]");

    if (!(this instanceof LocationUtilityService)) {
        throw new TypeError("LocationUtilityService constructor cannot be called as a function.");
    }

    /**
     * Nom de la classe
     */
    this.CLASSNAME = "LocationUtilityService";

    /**
     * Type de classe de geocodage
     * ex. GeocodeRequest ou ReverseGeocodeRequest
     */
    this.CLASSTYPE = null;

    // appel du constructeur par heritage
    AbstractService.apply(this, arguments);

    // on determine le type de geocodage si les options sont renseignées
    if (this.options) {
        this.CLASSTYPE = (this.options.location) ? "GeocodeRequest" : (this.options.position) ? "ReverseGeocodeRequest" : null;
    }
}

/**
 * @lends module:LocationUtilityService#
 */
LocationUtilityService.prototype = Object.create(AbstractService.prototype, {
    // todo
    // getter/setter
});

/**
 * Constructeur (alias)
 */
LocationUtilityService.prototype.constructor = LocationUtilityService;

/**
 * (overwrite) Ajout d'un objet de type LUS : GeocodeRequest ou ReverseGeocodeRequest
 *
 * @param {Object} oLUSRequest - objet de type LUS
 */
LocationUtilityService.prototype.addRequest = function (oLUSRequest) {
    // on determine le type de geocodage
    this.CLASSTYPE = oLUSRequest.CLASSNAME;

    // on controle les types acceptés
    switch (this.CLASSTYPE) {
        case "GeocodeRequest":
        case "ReverseGeocodeRequest":
            this.oRequest = oLUSRequest;
            break;
        default:
            throw new Error("Ce n'est pas un objet de type 'LUS Request' !?");
    }
};

/**
 * (overwrite) Ajout d'un objet de type GeocodeFilterExtension
 *
 * @param {Object} oFilter - objet de type Filtre
 */
LocationUtilityService.prototype.addFilter = function (oFilter) {
    // FIXME gestion des filtres à partir des tables de geocodages
    if (oFilter instanceof GeocodeFilterExtension) {
        this.oFilter = oFilter;
    }
};

/**
 * (overwrite) toString
 *
 * @returns {String} requête
 */
LocationUtilityService.prototype.toString = function () {
    // soit, on a un objet LUS Request déjà instancié
    // sinon, il faut le construire à partir des options à disposition
    if (!this.oRequest) {
        // il nous faut des options
        if (!this.options) {
            throw new Error("Les options ne sont pas renseignées, impossible de construire la requête !");
        }

        // si les options 'location' et 'position' sont renseignées,
        // on prendra par defaut le choix du geocodage direct
        if (this.CLASSTYPE === "GeocodeRequest") {
            var settingsDirect = {
                location : this.options.location,
                returnFreeForm : this.options.returnFreeForm,
                filterOptions : this.options.filterOptions || {}
            };
            this.oRequest = new GeocodeRequest(settingsDirect);
            // ajout des filtres spécifiques au service du geocodage direct de l'IGN
            if (this.oFilter) {
                this.oRequest.addFilter(this.oFilter);
            }
        } else if (this.CLASSTYPE === "ReverseGeocodeRequest") {
            var settingsInv = {
                position : this.options.position,
                returnFreeForm : this.options.returnFreeForm,
                filterOptions : this.options.filterOptions || {}
            };
            this.oRequest = new ReverseGeocodeRequest(settingsInv);
        } else {
            this.logger.error("impossible de determiner le type de geocodage : Direct ou Inverse !?");
        }
    }

    // objet indefini !?
    if (!this.oRequest) {
        throw new Error("Type de Geocodage indefini !");
    }

    this.strRequest = this.oRequest.toString();
    return this.strRequest;
};

export default LocationUtilityService;
