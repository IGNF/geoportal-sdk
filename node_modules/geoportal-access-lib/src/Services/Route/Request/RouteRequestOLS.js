/**
 * Creation d'une requête OpenLS en mode POST ou GET
 * (Factory)
 *
 * @module RouteRequestOLS
 * @alias Gp.Services.Route.Request.RouteRequestOLS
 * @private
 */
import Logger from "../../../Utils/LoggerByDefault";
import XLS from "../../../Formats/XLS";
import RouteService from "../../../Formats/XLS/RouteService";

var RouteRequestOLS = {

    /**
     * interface unique
     *
     * @method build
     * @static
     * @param {Object} options - options definies dans le composant Route
     *
     * @example
     *   var options = {
     *      (...)
     *   };
     *
     * @returns {String} request
     */
    build : function (options) {
        // logger
        var logger = Logger.getLogger("RouteRequestOLS");
        logger.trace(["RouteRequestOLS::build()"]);

        var request = null;

        // spécifique au service
        var settings = {
            startPoint : options.startPoint,
            endPoint : options.endPoint,
            viaPoint : options.viaPoints, // mapping OLS et options
            provideBoundingBox : options.provideBbox, // mapping OLS et options
            avoidFeature : options.exclusions, // mapping OLS et options
            expectedStartTime : options.expectedStartTime, // TODO format ?
            distanceUnit : options.distanceUnit,
            graph : options.graph,
            provideGeometry : options.geometryInInstructions, // mapping OLS et options
            routePreference : options.routePreference
        };

        // objet RouteService
        var oRS = new RouteService(settings);

        // Format XLS
        var oXLS = new XLS({
            srsName : options.srs,
            maximumResponses : options.maximumResponses
        });
        oXLS.namespace = true;
        oXLS.setService(oRS);

        // request brute !
        request = oXLS.build();

        // en mode GET, la requête est encodée
        // et le param. 'qxml' est ajouté
        if (options.httpMethod === "GET") {
            var myRequest = "qxml=" +
                encodeURIComponent(request)
                    .replace(/-/g, "%2D")
                    .replace(/_/g, "%5F")
                    .replace(/\./g, "%2E")
                    .replace(/!/g, "%21")
                    .replace(/~/g, "%7E")
                    .replace(/\*/g, "%2A")
                    .replace(/'/g, "%27")
                    .replace(/\(/g, "%28")
                    .replace(/\)/g, "%29");
            request = myRequest;
        }

        return request;
    }
};

export default RouteRequestOLS;
