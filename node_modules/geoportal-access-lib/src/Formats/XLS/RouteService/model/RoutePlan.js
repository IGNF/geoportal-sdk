import Logger from "../../../../Utils/LoggerByDefault";

/**
 * @classdesc
 *  * Élément regroupant l'ensemble des données et paramètres pour le calcul d'itinéraire : points de navigation, configuration.
 *
 * ----
 * XSD :
 * ----
 * [] => non implementé !
 *
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
 * element name="RoutePreference"
 *  => value = fastest | shortest | pedestrian
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
 *
 * --------
 * Requête :
 * --------
 * ```
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
 *       <AvoidList>
 *          <AvoidFeature>highway</AvoidFeature>
 *          <AvoidFeature>tollway</AvoidFeature>
 *          <AvoidFeature>tunnel</AvoidFeature>
 *       </AvoidList>
 *     </RoutePlan>
 * ```
 * @constructor
 * @alias Gp.Formats.XLS.RouteService.RoutePlan
 * @param {Object} options - options
 *
 * @private
 */
function RoutePlan (options) {
    this.logger = Logger.getLogger("RoutePlan");
    this.logger.trace("[Constructeur RoutePlan ()]");

    if (!(this instanceof RoutePlan)) {
        throw new TypeError("RoutePlan constructor cannot be called as a function.");
    }

    // param par defaut
    this.options = options || {};

    // param obligatoire
    if (!options.startPoint) {
        throw new Error("l'option 'startPoint' n'est pas renseignée !");
    }

    if (!options.endPoint) {
        throw new Error("l'option 'endPoint' n'est pas renseignée !");
    }

    // et on ajoute les options en paramètre aux options par défaut
    for (var opt in options) {
        if (options.hasOwnProperty(opt)) {
            this.options[opt] = options[opt];
        }
    }
}

RoutePlan.prototype = {

    /**
     * Constructeur (alias)
     */
    constructor : RoutePlan,

    /**
     * request (out)
     * @type {String}
     */
    requestString : null,

    /**
     * Template de la requête.
     * substitution des valeurs suivantes :
     * - __ROUTEPREFERENCE__, __VALUEROUTEPREFERENCE__
     * - __GRAPH__, __VALUEGRAPH__
     * - __WAYPOINTLIST__ (lst?), __STARTPOINT__, __VIAPOINT__, __ENDPOINT__, __POINT__, __X__, __Y__
     * - __AVOIDLIST__ (lst!), __AVOIDFEATURE__, __VALUEAVOIDFEATURE__
     */
    template : {
        routePlan : "<RoutePlan>" +
            "__ROUTEPREFERENCE__" +
            "__GRAPH__" +
            "__WAYPOINTLIST__" +
            "__AVOIDLIST__" +
            "</RoutePlan>",
        routePreference : "<RoutePreference>__VALUEROUTEPREFERENCE__</RoutePreference>",
        graph : "<xlsext:graphName xmlns:xlsext=\"http://www.opengis.net/xlsext\" name=\"__VALUEGRAPH__\"/>",
        wayPointList : {
            container : "<WayPointList>" +
                "__STARTPOINT__" +
                "__VIAPOINT__" +
                "__ENDPOINT__" +
                "</WayPointList>",
            point : "<Position><gml:Point xmlns:gml=\"http://www.opengis.net/gml\"><gml:pos>__X__ __Y__</gml:pos></gml:Point></Position>",
            startPoint : "<StartPoint>" +
                "__POINT__" +
                "</StartPoint>",
            endPoint : "<EndPoint>" +
                "__POINT__" +
                "</EndPoint>",
            viaPoint : "<ViaPoint>" +
                "__POINT__" +
                "</ViaPoint>" // implémentation de plusieurs étapes...
        },
        avoidList : {
            container : "<AvoidList>" +
                "__AVOIDFEATURE__" +
                "</AvoidList>",
            avoidFeature : "<AvoidFeature>__VALUEAVOIDFEATURE__</AvoidFeature>"
        }
    },

    /**
     * toString
     *
     * @returns {String} requête
     */
    toString : function () {
        var template = "";
        template = this.template.routePlan;

        // preference
        if (this.options.routePreference) {
            var tmplPreference = this.template.routePreference;
            tmplPreference = tmplPreference.replace(/__VALUEROUTEPREFERENCE__/, this.options.routePreference);
            template = template.replace(/__ROUTEPREFERENCE__/g, tmplPreference);
        }
        // clean preference
        template = template.replace(/__ROUTEPREFERENCE__/g, "");

        // exclusions
        if (this.options.avoidFeature) {
            var tmplAvoidList = this.template.avoidList.container;
            var avoidFeatures = [];
            for (var i = 0; i < this.options.avoidFeature.length; i++) {
                var tmplAvoidFeature = this.template.avoidList.avoidFeature;
                tmplAvoidFeature = tmplAvoidFeature.replace(/__VALUEAVOIDFEATURE__/, this.options.avoidFeature[i]);
                avoidFeatures.push(tmplAvoidFeature);
            }
            tmplAvoidList = tmplAvoidList.replace(/__AVOIDFEATURE__/, avoidFeatures.join("\n"));
            template = template.replace(/__AVOIDLIST__/g, tmplAvoidList);
        }
        // clean exclusions
        template = template.replace(/__AVOIDLIST__/g, "");

        // graph
        if (this.options.graph) {
            var tmplVehicle = this.template.graph;
            tmplVehicle = tmplVehicle.replace(/__VALUEGRAPH__/, this.options.graph);
            template = template.replace(/__GRAPH__/g, tmplVehicle);
        }
        // clean vehicle
        template = template.replace(/__GRAPH__/g, "");

        // points
        var tmplWayPointList = this.template.wayPointList.container;
        var tmplPoint = "";
        // start
        tmplPoint = this.template.wayPointList.point;
        tmplPoint = tmplPoint.replace(/__X__/, this.options.startPoint.x);
        tmplPoint = tmplPoint.replace(/__Y__/, this.options.startPoint.y);
        tmplWayPointList = tmplWayPointList.replace(/__STARTPOINT__/,
            this.template.wayPointList.startPoint.replace(/__POINT__/, tmplPoint));
        // end
        tmplPoint = this.template.wayPointList.point;
        tmplPoint = tmplPoint.replace(/__X__/, this.options.endPoint.x);
        tmplPoint = tmplPoint.replace(/__Y__/, this.options.endPoint.y);
        tmplWayPointList = tmplWayPointList.replace(/__ENDPOINT__/,
            this.template.wayPointList.endPoint.replace(/__POINT__/, tmplPoint));
        // via
        if (this.options.viaPoint) {
            var points = [];
            for (var j = 0; j < this.options.viaPoint.length; j++) {
                var p = this.options.viaPoint[j];
                tmplPoint = this.template.wayPointList.point;
                tmplPoint = tmplPoint.replace(/__X__/, p.x);
                tmplPoint = tmplPoint.replace(/__Y__/, p.y);
                points.push(tmplPoint);
            }

            tmplWayPointList = tmplWayPointList.replace(/__VIAPOINT__/,
                this.template.wayPointList.viaPoint.replace(/__POINT__/, points.join("\n")));
        } else {
            // clean viaPoint
            tmplWayPointList = tmplWayPointList.replace(/__VIAPOINT__/, "");
        }

        template = template.replace(/__WAYPOINTLIST__/g, tmplWayPointList);

        this.requestString = template;
        return this.requestString;
    }
};

export default RoutePlan;
