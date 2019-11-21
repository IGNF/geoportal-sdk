import Logger from "../../Utils/LoggerByDefault";
import AbstractService from "./AbstractService";
import DetermineRouteRequest from "./RouteService/DetermineRouteRequest";
import RouteRequestExtension from "./RouteService/RouteRequestExtension";

/**
 * @classdesc
 *
 * Requête de type RouteService
 * (Factory)
 *
 * XSD :
 * ----
 * [] => non implementé !
 *
 * ```
 * element name="DetermineRouteRequest"
 *  [attribute name="provideRouteHandle" default="false"]
 *  attribute name="distanceUnit"       default="M"
 *      [element ref="xls:RouteHandle" || element ref="xls:RoutePlan"]
 *      element ref="xls:RoutePlan"
 *      element ref="xls:RouteInstructionsRequest"
 *      [element ref="xls:RouteGeometryRequest"]
 *      [element ref="xls:RouteMapRequest"]
 * ```
 * ```
 * element name="RoutePlan"
 *  [attribute name="useRealTimeTraffic" default="false"]
 *  [attribute name="expectedStartTime"  type="dateTime"]
 *  [attribute name="expectedEndTime"    type="dateTime"]
 *      element ref="xls:RoutePreference"
 *      element ref="xls:WayPointList"
 *      element ref="xls:AvoidList"
 * ```
 * ```
 * element name="RoutePreference" => value = Fastest | Shortest | Pedestrian
 * ```
 * ```
 * element name="WayPointList"
 *      element ref="xls:StartPoint"
 *      element ref="xls:ViaPoint" minOccurs="0"
 *      element ref="xls:EndPoint"
 * ```
 * ```
 * element name="StartPoint"
 *    [element name="GeocodeMatchCode"]
 *      [attribute name="accuracy"]
 *      [attribute name="matchType"] => value = City, Street, Street number, Street enhanced, ...
 *    element name="Position"
 *      element ref="gml:Point"
 * ```
 * ```
 * element name="ViaPoint"
 *    [element name="GeocodeMatchCode"]
 *      [attribute name="accuracy"]
 *      [attribute name="matchType"] => value = City, Street, Street number, Street enhanced, ...
 *    element name="Position"
 *      element ref="gml:Point"
 * ```
 * ```
 * element name="EndPoint"
 *    [element name="GeocodeMatchCode"]
 *      [attribute name="accuracy"]
 *      [attribute name="matchType"] => value = City, Street, Street number, Street enhanced, ...
 *    element name="Position"
 *      element ref="gml:Point"
 * ```
 * ```
 * element name="AvoidList"
 *      [element ref="xls:AOI"]
 *      [element ref="xls:_Location"] (cf. element name="Position")
 *      element ref="xls:AvoidFeature"
 * ```
 * ```
 * [element name="AOI"]
 *      [element ref="gml:CircleByCenterPoint" || element ref="gml:Polygon" || element ref="gml:Envelope"]
 * ```
 * ```
 * element name="AvoidFeature" => value = highway | tollway | tunnel | bridge
 * ```
 * ```
 * [element name="RouteMapRequest"]
 *      [element name="Output"]
 *          attribute name="width"
 *          attribute name="height"
 *          attribute name="format"
 *          attribute name="BGcolor"
 *          attribute name="transparent"
 *          attribute name="style" => value = Overview | Maneuver
 *          element name="BBoxContext" type="gml:EnvelopeType"
 * ```
 * ```
 * element name="RouteInstructionsRequest"
 *  [attribute name="format"]           default="text/plain"
 *  attribute name="provideGeometry"    default="false"
 *  attribute name="provideBoundingBox" default="false"
 * ```
 * ```
 * [element name="RouteGeometryRequest"]
 *  [attribute name="scale"]                  default="1"
 *  [attribute name="provideStartingPortion"] default="false"
 *  [attribute name="maxPoints"]              default="100"
 *      [element name="BoundingBox" type="gml:EnvelopeType" ]
 * ```
 *
 * --------
 * Requête :
 * --------
 * ```
 * <?xml version="1.0" encoding="UTF-8"?>
 * <XLS
 * xmlns:xls="http://www.opengis.net/xls"
 * xmlns:sch="http://www.ascc.net/xml/schematron"
 * xmlns:gml="http://www.opengis.net/gml"
 * xmlns:xlsext="http://www.opengis.net/xlsext"
 * xmlns:xlink="http://www.w3.org/1999/xlink"
 * xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
 * xsi:schemaLocation="http://www.opengis.net/xls http://schemas.opengis.net/ols/1.1.0/RouteService.xsd"
 * version="1.1" xls:lang="en">
 * <RequestHeader/>
 * <Request methodName="RouteRequest" requestID="123456789" version="1.1">
 *   <DetermineRouteRequest distanceUnit="KM">
 *     <RoutePlan>
 *       <RoutePreference>Fastest</RoutePreference>
 *       <xlsext:vehicle name="Car" />
 *       <WayPointList>
 *         <StartPoint>
 *           <Position><gml:Point srsName="EPSG:4326"><gml:pos>2.29993 48.87228</gml:pos></gml:Point></Position>
 *         </StartPoint>
 *         <EndPoint>
 *           <Position><gml:Point srsName="EPSG:4326"><gml:pos>-1.53604 47.21548</gml:pos></gml:Point></Position>
 *         </EndPoint>
 *       </WayPointList>
 *     </RoutePlan>
 *     <RouteInstructionsRequest provideGeometry="true"/>
 *     <RouteGeometryRequest/>
 *   </DetermineRouteRequest>
 * </Request>
 * </XLS
 * ```
 * -----------
 * References :
 * -----------
 * - {@link https://geoportail.forge.ign.fr/jira/browse/GPP-CI}
 * - {@link https://geoportail.forge.ign.fr/jira/browse/GPP-CI-1 Specif. ols}
 * - {@link https://geoportail.forge.ign.fr/jira/browse/GPP-CI-9 Extension}
 * - {@link https://github.com/Emergya/openlayers/blob/master/lib/OpenLayers/Format/XLS/v1_2_0.js}
 *
 * @example
 * // encapsule un objet dans une coquille XSL, Factory sur les objets ''
 * rs = new RouteService ();
 * rs.addRequest (req);
 * rs.toString();
 *  ou
 * rs = new RouteService ({
 *      ...
 * });
 * rs.toString();
 *
 * @extends {Gp.Formats.XLS}
 * @constructor
 * @alias Gp.Formats.XLS.RouteService
 * @param {Object} options - options
 * @param {Object}   options.routePreference - « fastest », « shortest » ou « pedestrian »
 * @param {String}   options.startPoint - Point de départ (coordonnées exprimées en WGS84G)
 * @param {String}   options.viaPoint - Liste de points intermédiaires
 * @param {String}   options.endPoint - Point d'arrivée (coordonnées)
 * @param {Object}   options.avoidFeature - « highway », « tollway », « tunnel » ou « bridge »
 * @param {Object}   options.graph - « car »
 * @param {Object}   options.expectedStartTime - Date et heure de départ
 * @param {Object}   options.provideGeometry - true | false
 * @param {Object}   options.provideBoundingBox - true | false
 * @param {Object}   options.distanceUnit - Unité dans lesquelles la distance est exprimée (« m » ou « km »)
 * @param {Function} options.onsuccess - function callback success (TODO)
 * @param {Function} options.onerror   - function callback error   (TODO)
 *
 * @example
 * var options = {
 *      // spécifique au service
 *      startPoint: {
 *          x: 42.1121,
 *          y: 1.5557
 *      },
 *      endPoint: {
 *          x: 42.1121,
 *          y: 1.5557
 *      },
 *      viaPoint : [
 *          {x: 42.1121,y: 1.5557},
 *          {x: 42.1121,y: 1.5557},
 *          {x: 42.1121,y: 1.5557}
 *      ],
 *      provideBoundingBox : false,
 *      avoidFeature : ["bridge", "tunnel", "tollway"],
 *      expectedStartTime : "2015-12-23", // YYYY-MM-DDThh:mm:ssZ
 *      distanceUnit : "km",
 *      vehicle: "car",
 *      provideGeometry : false,
 *      routePreference : "fastest"
 * };
 *
 * @private
 */
function RouteService (options) {
    this.logger = Logger.getLogger();
    this.logger.trace("[Constructeur RouteService ()]");

    if (!(this instanceof RouteService)) {
        throw new TypeError("RouteService constructor cannot be called as a function.");
    }

    /**
     * Nom de la classe
     */
    this.CLASSNAME = "RouteService";

    /**
     * Type de classe
     * RouteRequest par defaut
     */
    this.CLASSTYPE = "RouteRequest";

    // appel du constructeur par heritage
    AbstractService.apply(this, arguments);
}

/**
 * @lends module:RouteService#
 */
RouteService.prototype = Object.create(AbstractService.prototype, {
    // todo
    // getter/setter
});

/**
 * Constructeur (alias)
 */
RouteService.prototype.constructor = RouteService;

/**
 * (overwrite) Ajout d'un objet de type  : RouteRequest
 *
 * @param {Object} oRequest - RouteRequest
 */
RouteService.prototype.addRequest = function (oRequest) {
    // on controle les types acceptés
    if (oRequest.CLASSNAME === "DetermineRouteRequest") {
        this.oRequest = oRequest;
    } else {
        throw new Error("Ce n'est pas un objet de type 'Route Request' !?");
    }
};

/**
 * (overwrite) Ajout d'un objet de type RouteFilterExtension
 *
 * @param {Object} oFilter - RouteFilterExtension
 */
RouteService.prototype.addFilter = function (oFilter) {
    // gestion des extensions (vehicle)
    if (oFilter instanceof RouteRequestExtension) {
        this.oFilter = oFilter;
    }
};

/**
 * (overwrite) toString
 *
 * @returns {String} requête
 */
RouteService.prototype.toString = function () {
    // soit, on a un objet Request déjà instancié
    // sinon, il faut le construire à partir des options à disposition
    if (!this.oRequest) {
        // il nous faut des options
        if (!this.options) {
            throw new Error("Les options ne sont pas renseignées, impossible de construire la requête !");
        }

        if (this.CLASSTYPE === "RouteRequest") {
            var settings = {
                distanceUnit : this.options.distanceUnit || null,
                provideGeometry : this.options.provideGeometry || null,
                provideBoundingBox : this.options.provideBoundingBox || null,
                route : {
                    routePreference : this.options.routePreference || null,
                    startPoint : this.options.startPoint,
                    viaPoint : this.options.viaPoint || null,
                    endPoint : this.options.endPoint,
                    avoidFeature : this.options.avoidFeature || null,
                    graph : this.options.graph || null,
                    expectedStartTime : this.options.expectedStartTime || null
                }
            };
            this.oRequest = new DetermineRouteRequest(settings);
            // ajout des filtres spécifiques au service
            if (this.oFilter) {
                this.oRequest.addFilter(this.oFilter);
            }
        }
    }

    // objet indefini !?
    if (!this.oRequest) {
        throw new Error("Type de requête indefini !");
    }

    this.strRequest = this.oRequest.toString();
    return this.strRequest;
};

export default RouteService;
