import Logger from "../../../Utils/LoggerByDefault";
import RoutePlan from "./model/RoutePlan";

/**
 * @classdesc
 *
 * Requête de calcul d'itinéraire
 *
 * ----
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
 * element name="RouteInstructionsRequest"
 *  [attribute name="format"]           default="text/plain"
 *  attribute name="provideGeometry"    default="false"
 *  attribute name="provideBoundingBox" default="false"
 * ```
 * ```
 * element name="RouteGeometryRequest"
 *  [attribute name="scale"]                  default="1"
 *  [attribute name="provideStartingPortion"] default="false"
 *  [attribute name="maxPoints"]              default="100"
 *      [element name="BoundingBox" type="gml:EnvelopeType" ]
 * ```
 * ```
 * [element name="RouteMapRequest"]
 *      [element name="Output"]
 *          [attribute name="width"]
 *          [attribute name="height"]
 *          [attribute name="format"]
 *          [attribute name="BGcolor"]
 *          [attribute name="transparent"]
 *          [attribute name="style"] => value = Overview | Maneuver
 *          [element name="BBoxContext" type="gml:EnvelopeType"]
 * ```
 *
 * --------
 * Requête :
 * --------
 * ```
 *   <DetermineRouteRequest distanceUnit="KM">
 *     <RoutePlan>
 *              <RoutePreference>Fastest</RoutePreference>
 *              <xlsext:vehicle name="Car" />
 *              <WayPointList>
 *                  <StartPoint>
 *                      <Position><gml:Point srsName="EPSG:4326"><gml:pos>2.29993 48.87228</gml:pos></gml:Point></Position>
 *                  </StartPoint>
 *                  <EndPoint>
 *                      <Position><gml:Point srsName="EPSG:4326"><gml:pos>-1.53604 47.21548</gml:pos></gml:Point></Position>
 *                  </EndPoint>
 *              </WayPointList>
 *     </RoutePlan>
 *     <RouteInstructionsRequest provideGeometry="true"/>
 *     <RouteGeometryRequest/>
 *   </DetermineRouteRequest>
 * ```
 *
 * @constructor
 * @alias Gp.Formats.XLS.RouteService.DetermineRouteRequest
 * @param {Object} options - options
 * @param {Object}   options.route.routePreference - « fastest », « shortest » ou « pedestrian »
 * @param {String}   options.route.startPoint - Point de départ (coordonnées exprimées en WGS84G)
 * @param {String}   options.route.viaPoint - Liste de points intermédiaires
 * @param {String}   options.route.endPoint - Point d'arrivée (coordonnées)
 * @param {Object}   options.route.avoidFeature - « highway », « tollway », « tunnel » ou « bridge »
 * @param {Object}   options.route.vehicle - « car »
 * @param {Object}   options.route.expectedStartTime - Date et heure de départ
 * @param {Object}   options.provideGeometry - true | false
 * @param {Object}   options.provideBoundingBox - true | false
 * @param {Object}   options.distanceUnit - Unité dans lesquelles la distance est exprimée (« m » ou « km »)
 * @param {Function} options.onsuccess - function callback success (TODO)
 * @param {Function} options.onerror   - function callback error   (TODO)
 *
 * @private
 */
function DetermineRouteRequest (options) {
    this.logger = Logger.getLogger();
    this.logger.trace("[Constructeur DetermineRouteRequest ()]");

    if (!(this instanceof DetermineRouteRequest)) {
        throw new TypeError("DetermineRouteRequest constructor cannot be called as a function.");
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
    this.CLASSNAME = "DetermineRouteRequest";
}

DetermineRouteRequest.prototype = {

    /**
     * @lends module:DetermineRouteRequest#
     */

    /**
     * request (out)
     * @type {String}
     */
    strRequest : null,

    /**
     * RoutePlan
     * @type {Address}
     */
    oRoutePlan : null,

    /**
     * Template de la requête.
     * substitution des valeurs suivantes :
     * __DISTANCEUNIT__,
     * __ROUTEPLAN__, __ROUTEINSTRUCTIONREQUEST__, __ROUTEGEOMETRYREQUEST__, __ROUTEMAPREQUEST__
     * __PROVIDEGEOMETRY__, __PROVIDEBBOX__
     */
    template : {
        determineRouteRequest : "<DetermineRouteRequest distanceUnit=\"__DISTANCEUNIT__\">" +
            "__ROUTEPLAN__" +
            "__ROUTEINSTRUCTIONREQUEST__" +
            "__ROUTEGEOMETRYREQUEST__" +
            "__ROUTEMAPREQUEST__" +
            "</DetermineRouteRequest>",
        routeInstructionRequest : "<RouteInstructionsRequest " +
            "provideGeometry=\"__PROVIDEGEOMETRY__\" " +
            "provideBoundingBox=\"__PROVIDEBBOX__\" />",
        routeGeometryRequest : "<RouteGeometryRequest />",
        routeMapRequest : "" // FIXME <RouteMapRequest/> not yet implemented !
    },

    /**
     * Ajout d'un objet de type RoutePlan
     *
     * @param {Object} oRoutePlan - RoutePlan
     */
    addRoute : function (oRoutePlan) {
        if (oRoutePlan instanceof RoutePlan) {
            this.oRoutePlan = oRoutePlan;
        }
    },

    /**
     * Constructeur (alias)
     */
    constructor : DetermineRouteRequest,

    /**
     * toString
     *
     * @returns {String} requête
     */
    toString : function () {
        var template = "";
        template = this.template.determineRouteRequest;
        template = template.replace(/__DISTANCEUNIT__/g, this.options.distanceUnit || "KM");

        // soit on a déjà un objet RoutePlan instancié,
        // sinon, on le fabrique via les options
        if (!this.oRoutePlan) {
            var settings = this.options.route;

            this.oRoutePlan = new RoutePlan(settings);
            if (!this.oRoutePlan) {
                throw new Error("La construction du calcul d'initineraire n'est pas correctement definie !?");
            }
        }

        // routeplan
        template = template.replace(/__ROUTEPLAN__/g, this.oRoutePlan.toString());

        // instruction
        var tmplInstruction = this.template.routeInstructionRequest;
        tmplInstruction = tmplInstruction.replace(/__PROVIDEGEOMETRY__/g, this.options.provideGeometry || false);
        tmplInstruction = tmplInstruction.replace(/__PROVIDEBBOX__/g, this.options.provideBoundingBox || false);
        template = template.replace(/__ROUTEINSTRUCTIONREQUEST__/g, tmplInstruction);

        // geometry
        var tmplGeometry = this.template.routeGeometryRequest;
        template = template.replace(/__ROUTEGEOMETRYREQUEST__/g, tmplGeometry);

        // map
        var tmplMap = this.template.routeMapRequest;
        template = template.replace(/__ROUTEMAPREQUEST__/g, tmplMap);

        this.strRequest = template;
        return this.strRequest;
    }
};

export default DetermineRouteRequest;
