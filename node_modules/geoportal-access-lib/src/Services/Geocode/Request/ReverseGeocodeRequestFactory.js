/**
 * Creation d'une requête OpenLS en mode POST ou GET
 * (Factory)
 *
 * @module ReverseGeocodeRequestFactory
 * @alias Gp.Services.Geocode.Request.ReverseGeocodeRequestFactory
 * @private
 */
import Logger from "../../../Utils/LoggerByDefault";
import XLS from "../../../Formats/XLS";
import LocationUtilityService from "../../../Formats/XLS/LocationUtilityService";

var ReverseGeocodeRequestFactory = {

    /**
     * interface unique
     *
     * @method build
     * @static
     * @param {Object} options - options definies dans le composant Geocode
     *
     * @example
     *   var options = {
     *      httpMethod :
     *      // options specifiques du service
     *      position :
     *      returnFreeForm :
     *      filterOptions :
     *      srs :
     *      maximumResponses :
     *   };
     *   var result = ReverseGeocodeRequestFactory.build(options);
     *   if (!result) {
     *       // error...
     *   }
     * @returns {String} request
     */
    build : function (options) {
        // logger
        var logger = Logger.getLogger("ReverseGeocodeRequestFactory");
        logger.trace(["ReverseGeocodeRequestFactory::build()"]);

        // options non definies
        var settings = options || {};

        var request = null;

        // objet LUS
        var oLUS = new LocationUtilityService({
            position : settings.position,
            returnFreeForm : settings.returnFreeForm,
            filterOptions : settings.filterOptions
        });

        // Format XLS
        var oXLS = new XLS({
            srsName : settings.srs,
            maximumResponses : settings.maximumResponses
        });
        oXLS.namespace = true;
        oXLS.setService(oLUS);

        // request brute !
        request = oXLS.build();

        // en mode GET, la requête est encodée
        // et le param. 'qxml' est ajouté
        if (settings.httpMethod === "GET") {
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

        logger.trace(request);

        return request;
    }
};

export default ReverseGeocodeRequestFactory;
