/**
 * implemented into class 'RoutePlan' !
 *
 * Element permettant de spécifier les points de navigation.
 *  - Point de départ pour le calcul d'itinéraire.
 *  - Etape pour le calcul d'itinéraire. Plusieurs VaiPoint peuvent être spécifiés.
 *  - Point d'arrivée pour le calcul d'itinéraire.
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
 *
 * @module WayPointList
 * @private
 * @alias Gp.Formats.XLS.RouteService.WayPointList
 *
 */
