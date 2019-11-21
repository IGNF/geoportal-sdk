import Logger from "../Utils/LoggerByDefault";
import RequestHeader from "./XLS/RequestHeader";
import Request from "./XLS/Request";
import AbstractService from "./XLS/AbstractService";

/**
 * @classdesc
 *
 * standard OpenLS
 * standard XLS
 * (version 1.2)
 *
 * Réfs :
 *     - {@link http://schemas.opengis.net/ols/1.2/}
 *     - {@link http://www.opengeospatial.org/standards/ols}
 *     - {@link http://wxs.ign.fr/schemas/}
 *
 *
 * Création du template XLS (avec gestion des namespaces)
 * ------------------------
 * ```
 *   balise xsd : element name="XLS" attribute name="version" [(attribute ref="lang")]
 * ```
 *
 * Exemple :
 * ```
 * <XLS xmlns="http://www.opengis.net/xls" version="1.2">
 *   < (ref. OLS) />
 * </XLS>
 * ```
 * ```
 * <xls:XLS xmlns:xls="http://www.opengis.net/xls" version="1.2">
 *   <xls: (ref. OLS) />
 * </xls:XLS>
 * ```
 *
 * Création des templates OLS pour LocationUtilityService
 * ------------------------------------------------------
 *
 * Exemple :
 *
 * ```
 * <RequestHeader srsName="epsg:4326"/>
 * <Request maximumResponses="26" methodName="GeocodeRequest" requestID="uid1349081498314_388" version="1.2">
 *      <GeocodeRequest>
 *          <Address countryCode="PositionOfInterest">
 *              <freeFormAddress>saint mandé</freeFormAddress>
 *          </Address>
 *      </GeocodeRequest>
 *  </Request>
 * ```
 * ```
 * <RequestHeader sessionID="" />
 * <Request methodName="ReverseGeocodeRequest" version="1.2" requestID="" maximumResponses="10">
 *   <ReverseGeocodeRequest>
 *     <Position>
 *       <gml:Point xmlns:gml="http://www.opengis.net/gml">
 *           <gml:pos>50.347775 3.205098</gml:pos>
 *       </gml:Point>
 *     </Position>
 *     <ReverseGeocodePreference>StreetAddress</ReverseGeocodePreference>
 *  </ReverseGeocodeRequest>
 * </Request>
 * ```
 * ```
 * Geocodage direct (balise xsd) :
 *   element ref="RequestHeader" [ (attribute name="clientName" attribute name="clientPassword" attribute name="sessionID" attribute name="srsName" attribute name="MSID") ]
 *     element name="Request" attribute name="methodName" attribute name="version" attribute name="requestID" [ attribute name="maximumResponses" ]
 *       element name="GeocodeRequest" attribute name="returnFreeForm"
 *         element ref="xls:Address"
 * ```
 * ```
 * Geocodage inverse (balise xsd) :
 *   element ref="RequestHeader" [ (attribute name="clientName" attribute name="clientPassword" attribute name="sessionID" attribute name="srsName" attribute name="MSID") ]
 *     element name="Request" attribute name="methodName" attribute name="version" attribute name="requestID" [ attribute name="maximumResponses" ]
 *       element name="ReverseGeocodeRequest"
 *         element ref="xls:Position"
 *         element name="ReverseGeocodePreference" (enumeration)
 * ```
 *
 * Il existe 3 sous ensembles d'objets :
 *     - RequestHeader
 *     - Request
 *     - ReverseGeocodeRequest, GeocodeRequest
 *
 * GeocodeRequest est composé d'un objet {@link Gp.Services.Geocode.Response.GeocodeLocation}.
 * ReverseGeocodeRequest est composé d'un objet {@link Gp.Services.ReverseGeocode.Response.ReverseGeocodeLocation}.
 *
 * Les locations font appels aux objets suivants qui possèdent des attributs spécifiques
 * en fonction du type de table de geocodage interrogé :
 *     - StreetAddress
 *     - CadastralParcel
 *     - PositionOfInterest
 *     - Administratif
 *
 *
 * et des élements sous jacents tels que :
 *     - ReverseGeocodePreference -> tables de geocodages :
 *         - StreetAddress
 *         - CadastralParcel
 *         - PositionOfInterest
 *         - Administratif (une balise par table)
 *     - Position -> standard GML 3.2.1
 *     - Address  -> cf. ci-dessous
 *
 * ```
 * Position (balise xsd) :
 *   ex. <Position><gml:Point xmlns:gml="http://www.opengis.net/gml"><gml:pos>50.347775 3.205098</gml:pos></gml:Point></Position>
 *   ex. <Position><gml:CircleByCenterPoint xmlns:gml="http://www.opengis.net/gml"><gml:pos>48.85978570614691 2.2913572761128878</gml:pos><gml:radius>1000</gml:radius></gml:CircleByCenterPoint></Position>
 *   (au choix)
 *   element ref="gml:Point"
 *   element ref="gml:CircleByCenterPoint"
 *   element ref="gml:Polygon"
 *   element ref="gml:MultiPolygon"
 *   les autres elemennts ne sont pas implémentés (QoP, Speed, Direction, Time, ...)
 *
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
 *
 * Place  (balise xsd) :
 *  ex. <Place type="Municipality">Metz</Place>
 *  attribute name="type"
 *   enumeration value="CountrySubdivision"
 *   enumeration value="CountrySecondarySubdivision"
 *   enumeration value="Municipality"
 *   enumeration value="MunicipalitySubdivision"
 *   enumeration value="choume-banchi-go"
 *   enumeration value="Qualite"
 *   enumeration value="Departement"
 *   enumeration value="Bbox"
 *   enumeration value="Commune"
 *   enumeration value="Territoire"
 *   enumeration value="Importance"
 *   enumeration value="Nature"
 *   (la liste n'est pas exhaustives...)
 *
 * StreetAddress (balise xsd) :
 *   ex. <StreetAddress><Street>1 rue Marconi</Street></StreetAddress>
 *   attribute name="locator"
 *    element name="xls:Building"
 *    element ref="xls:Street"
 *
 * Street (balise xsd) :
 *   ex. <Street>1 rue Marconi</Street>
 *   attribute name="officialName" (...)
 *
 * Building (balise xsd) :
 *   ex. <Building number="800"/>
 *   attribute name="number" attribute name="subdivision" attribute name="buildingName"
 *
 * PostalCode (balise xsd) :
 *   ex. <PostalCode>77182</PostalCode>
 *
 * ```
 *
 * Requête
 * -------
 *
 * 2 modes de requête sur les services : GET ou POST.
 *
 * Le mode GET n'est que l'encodage du XML en param (qxml) de la requête (donc pas d'implementation particulière ?)
 *
 * Modèle de classes
 * -----------------
 *
 * ```
 *                 ________  XLS ____________
 *               /            |               \
 *   RequestHeader      AbstractService    Request
 *                            ^
 *                      ______|________________________
 *           (extends) /                               \ (extends)
 *          LocationUtilityService                    RouteService
 *                    |                                    |
 *         ___________|___________                       (...)
 *       /                        \
 * GeocodeRequest          ReverseGeocodeRequest
 *      |                          |
 *      |                     _____|______
 *      |                    /            \
 *   Address              Preference  Position
 *      |
 *    /   \
 * Place   StreetAddress
 *               |
 *             /   \
 *       Street   Building
 * ```
 *
 * @example
 * // encapsule un objet 'LocationUtilityService'
 * // dans une coquille XSL (avec/sans namespace)
 * xsl = new XSL ();
 * xsl.namespace = false;
 * xsl.srsName = "epsg:4326";
 * xsl.maximumResponses = 26;
 * //   methodName fournit par l'objet 'lus'
 * //   requestID est calculé
 * xsl.setService (lus);
 * xsl.build ();
 * // out ->
 * // <XLS xmlns="http://www.opengis.net/xls" version="1.2">
 * // <RequestHeader srsName="epsg:4326"/>
 * // <Request maximumResponses="26" methodName="GeocodeRequest" requestID="uid1349081498314_388" version="1.2">
 * //   < (ref. LocationUtilityService ou vide) />
 * //  </Request>
 * // </XLS>
 *
 *
 * @constructor
 * @alias Gp.Formats.XLS
 * @param {Object} options - options du constructeur
 * @param {Object} options.srsName - identifiant du Systeme de Coordonnees
 * @param {String}   options.maximumResponses - nombre de reponses max d'une requete
 * @param {Function} options.onsuccess - function callback success (TODO)
 * @param {Function} options.onerror   - function callback error   (TODO)
 *
 * @private
 */
function XLS (options) {
    this.logger = Logger.getLogger();
    this.logger.trace("[Constructeur XLS()]");

    if (!(this instanceof XLS)) {
        throw new TypeError("XLS constructor cannot be called as a function.");
    }

    // options par defaut
    this.options = {
        srsName : "EPSG:4326",
        maximumResponses : 25
    };

    // et on ajoute les options en paramètre aux options par défaut
    for (var opt in options) {
        if (options.hasOwnProperty(opt)) {
            if (options[opt]) {
                this.options[opt] = options[opt];
            }
        }
    }
}

/**
 * Version
 */
XLS.VERSION = "1.2";

XLS.prototype = {

    /**
     * @lends module:XLS#
     */

    /**
     * request (out)
     * @type {String}
     */
    requestString : null,

    /**
     * namespace
     * Surcharge les balises XLS d'un prefixe.
     * Par defaut, false
     * @type {Boolean}
     */
    namespace : false,

    /**
     * Objet Service
     * LocationUtilityService ou RouteService
     * @type {AbstractService}
     */
    oService : null,

    /**
     * Constructeur (alias)
     */
    constructor : XLS,

    /**
     * Template de la requête.
     * substitution des valeurs suivantes :
     * __VERSION__, __NAMESPACE__, __SCHEMALOCATION__
     * __REQUESTHEADER__, __REQUEST__
     */
    template : "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
        "<XLS version=\"__VERSION__\"\n" +
        "__NAMESPACE__ \n" +
        "__SCHEMALOCATION__>\n" +
        "__REQUESTHEADER__\n" +
        "__REQUEST__\n" +
        "</XLS>\n",

    /**
     * Namespace par defaut.
     *
     * @returns {String} namespace
     */
    namespaceByDefault : function () {
        var ns = [
            "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"",
            "xmlns:xls=\"http://www.opengis.net/xls\"",
            "xmlns:gml=\"http://www.opengis.net/gml\""
        ];

        return ns.join(" ");
    },

    /**
     * Schemalocation par defaut
     *
     * @returns {String} schemaLocation
     */
    schemaLocationByDefault : function () {
        return "xsi:schemaLocation=\"http://www.opengis.net/xls http://schemas.opengis.net/ols/1.2/olsAll.xsd\"";
    },

    /**
     * Setter Service
     * Ajout d'un objet de type LocationUtilityService (LUS) ou RouteService
     *
     * @param {Object} oService - GeoceodeRequest / ReverseGeocodeRequest ou RouteRequest
     */
    setService : function (oService) {
        if (!oService) {
            this.logger.trace("L'objet de type Service XSL n'est pas encore defini !?");
            return;
        }

        if (oService instanceof AbstractService) {
            this.oService = oService;
        } else {
            this.logger.error("L'objet n'est pas du type 'LocationUtilityService' ou 'RouteService' !?");
        }
    },

    /**
     * Getter Service
     * Retourne un objet de type LocationUtilityService (LUS) ou RouteService
     * ex. GeoceodeRequest / ReverseGeocodeRequest ou RouteRequest
     *
     * @returns {Object} service (LocationUtilityService|RouteService)
     */
    getService : function () {
        return this.oService;
    }
};

/**
 * Ajout d'un prefixe de namespace
 *
 * @todo impl. l'ajout de namespace
 * @param {Object} ns - ex. {key:xls, url:http://www.opengis.net/xls}
 * @param {String} request - requête
 * @returns {String} requête
 */
XLS.prototype.addNamespace = function (ns, request) {
    // INFO
    // on recherche la clef dans les namespaces par defaut.
    // si la clef n'existe pas dans les namespaceByDefault (), on l'ajoute.
    // on surcharge toutes les balises, ex. XLS -> xls:XLS
    // sauf celles qui sont déjà prefixées !

    var keyNS = ns.key;
    // var urlNS = ns.url; // TODO not yet implemented !

    // recherche la clef dans les namespaces par defaut
    var bFound = false;
    var allNS = this.namespaceByDefault().split(" ");
    for (var index = 0; index < allNS.length; index++) {
        var element = allNS[index];
        var map = element.split("=");
        var key = map[0];
        // var url = map[1]; // TODO not yet implemented !

        if (key === "xmlns:" + keyNS) {
            bFound = true;
            break;
        }
    }

    // TODO
    // si on a une nouvelle clef, on l'ajoute...
    if (!bFound) {
        this.logger.warn("L'ajout d'un nouvel namespace n'est pas encore implémenté !");
        return request;
    }

    // surcharge toutes les balises
    var regex;
    var subst;

    // regex balise ouvrante
    regex = /<(\w+[\s>])/g;
    subst = "<" + keyNS + ":$1";
    request = request.replace(regex, subst);

    // regex balise fermante
    regex = /<\/(\w+[\s>])/g;
    subst = "</" + keyNS + ":$1";
    request = request.replace(regex, subst);

    this.logger.trace("namespace", request);

    return request;
};

/**
 * Construction de la requête
 * @returns {String} requête
 */
XLS.prototype.build = function () {
    // out ->
    // <XLS xmlns="http://www.opengis.net/xls" version="1.2">
    // <RequestHeader srsName="epsg:4326"/>
    // <Request maximumResponses="26" methodName="GeocodeRequest" requestID="uid1349081498314_388" version="1.2">
    //   < (ref. LocationUtilityService ou vide) />
    //  </Request>
    // </XLS>

    // as t on un objet de type Service XLS à disposition ?
    var bService = !!this.getService();

    var template = "";
    template = this.template;
    template = template.replace(/__VERSION__/g, XLS.VERSION);
    template = template.replace(/__NAMESPACE__/g, this.namespaceByDefault);
    template = template.replace(/__SCHEMALOCATION__/g, this.schemaLocationByDefault);

    // header
    var oHeader = new RequestHeader({
        srsName : this.options.srsName
    });
    template = template.replace(/__REQUESTHEADER__/g, oHeader.toString());

    // request
    var oRequest = new Request({
        maximumResponses : this.options.maximumResponses,
        version : XLS.VERSION, // FIXME même version ?
        methodName : bService ? this.getService().CLASSTYPE : null
    });
    template = template.replace(/__REQUEST__/g, oRequest.toString());

    // objet lus ou route
    if (bService) { // INFO : clef __REQUESTSERVICE__ dispo dans l'objet 'Request'
        template = template.replace(/<!-- __REQUESTSERVICE__ -->/g, this.getService().toString());
    }

    if (!template) {
        this.logger.warn("traduction tmpl : empty request !?");
        return;
    }

    // ajout d'un namespace
    if (this.namespace) {
        // ajout de xls par defaut
        template = this.addNamespace({
            key : "xls",
            url : "http://www.opengis.net/xls"
        }, template);
    }

    this.requestString = template;
    this.logger.trace("traduction tmpl", template);

    // on retourne qqchose !
    return this.requestString;
};

export default XLS;
