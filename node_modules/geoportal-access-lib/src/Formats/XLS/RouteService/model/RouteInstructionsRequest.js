/**
 * implemented into class 'DetermineRouteRequest' !
 *
 * Pour pouvoir spécifier les éléments qui doivent apparaître dans la réponse au niveau des instructions :
 * - géométrie de chaque instruction
 * - zone d'encombrement de chaque instruction
 * Par défaut, tous ces paramètres sont à false.
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
 * element name="RouteInstructionsRequest"
 *  [attribute name="format"]           default="text/plain"
 *  attribute name="provideGeometry"    default="false"
 *  attribute name="provideBoundingBox" default="false"
 * ```
 *
 * @module RouteInstructionsRequest
 * @private
 * @alias Gp.Formats.XLS.RouteService.RouteInstructionsRequest
 *
 */
