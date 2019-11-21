/**
 * implemented into class 'RoutePlan' !
 *
 * Indique le type de calcul d'itinéraire souhaité :
 * - « Fastest » : au plus rapide
 * - « Shortest » : au plus court
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
 *
 * @module RoutePreference
 * @private
 * @alias Gp.Formats.XLS.RouteService.RoutePreference
 *
 */
