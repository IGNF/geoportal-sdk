/**
 * implemented into class 'DetermineRouteRequest' !
 *
 * ----
 * XSD :
 * ----
 *
 * [] => non implementé !
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
 * element name="RouteGeometryRequest"
 *  [attribute name="scale"]                  default="1"
 *  [attribute name="provideStartingPortion"] default="false"
 *  [attribute name="maxPoints"]              default="100"
 *      [element name="BoundingBox" type="gml:EnvelopeType" ]
 * ```
 *
 * @module RouteGeometryRequest
 * @private
 * @alias Gp.Formats.XLS.RouteService.RouteGeometryRequest
 *
 */
