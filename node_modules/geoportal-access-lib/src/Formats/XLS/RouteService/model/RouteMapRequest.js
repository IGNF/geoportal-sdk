/**
 * not implemented !
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
 * @module RouteMapRequest
 * @private
 * @alias Gp.Formats.XLS.RouteService.RouteMapRequest
 *
 */
