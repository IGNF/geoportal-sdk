/**
 * implemented into class 'RoutePlan' !
 *
 * Element permettant de spécifier des caractéristiques de tronçons à éviter.
 *
 * ----
 * XSD :
 * ----
 * [] => non implementé !
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
 * element name="AvoidList"
 *      [element ref="xls:AOI"]
 *      [element ref="xls:Location"] (cf. element name="Position")
 *      element ref="xls:AvoidFeature"
 * ```
 * ```
 * [element name="AOI"]
 *      [element ref="gml:CircleByCenterPoint" || element ref="gml:Polygon" || element ref="gml:Envelope"]
 * ```
 * ```
 * element name="AvoidFeature"
 *  => value = highway | tollway | tunnel | bridge
 * ```
 *
 * @module AvoidList
 * @private
 * @alias Gp.Formats.XLS.RouteService.AvoidList
 */
