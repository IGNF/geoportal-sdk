/**
 * Factory pour générer une reponse JSON à partir d'un XML
 * ou d'un JSON encapsulant du XML
 * (Factory)
 *
 * @module GeocodeResponseFactory
 * @alias Gp.Services.Geocode.Response.GeocodeResponseFactory
 * @todo La reponse JSON peut encapsuler un XML !
 * @private
 */
// import Logger from "../../../Utils/LoggerByDefault";
import ErrorService from "../../../Exceptions/ErrorService";
import MRes from "../../../Utils/MessagesResources";
import XML from "../../../Formats/XML";
import DirectGeocodeResponseReader from "../Formats/DirectGeocodeResponseReader";

var DirectGeocodeReponseFactory = {

    /**
     * interface unique
     *
     * @method build
     * @static
     * @param {Object} options - options definies dans le composant Geocode
     *
     * @example
     *   var options = {
     *      response :
     *      rawResponse :
     *      scope :
     *      onSuccess :
     *      onError :
     *   };
     *
     */
    build : function (options) {
        // data de type GeocodeResponse
        var data = null;

        if (options.response) {
            if (options.rawResponse) {
                data = options.response;
            } else {
                try {
                    var p = new XML({
                        reader : DirectGeocodeResponseReader
                    });

                    if (typeof options.response === "string") {
                        p.setXMLString(options.response);
                    } else {
                        p.setXMLDoc(options.response);
                    }

                    data = p.parse();

                    if (!data) {
                        throw new Error("L'analyse de la réponse du service !?");
                    }
                } catch (e) {
                    var message = e.message;
                    if (typeof options.response === "string") {
                        message += "('" + options.response + "')";
                    } else {
                        message += "('" + options.response.documentElement.innerHTML + "')";
                    }
                    options.onError.call(options.scope, new ErrorService({
                        message : MRes.getMessage("SERVICE_RESPONSE_ANALYSE", message),
                        type : ErrorService.TYPE_UNKERR,
                        status : -1
                    }));
                    return;
                }

                // Si la réponse contenait une exception renvoyée par le service
                if (data.exceptionReport) {
                    options.onError.call(options.scope, new ErrorService({
                        message : MRes.getMessage("SERVICE_RESPONSE_EXCEPTION", data.exceptionReport),
                        type : ErrorService.TYPE_SRVERR,
                        status : 200 // FIXME : 200 ?
                    }));
                    return;
                }
            }
        } else {
            options.onError.call(options.scope, new ErrorService({
                message : MRes.getMessage("SERVICE_RESPONSE_EMPTY"),
                type : ErrorService.TYPE_SRVERR,
                status : -1 // FIXME : status response
            }));
            return;
        }

        options.onSuccess.call(options.scope, data);
    }
};

export default DirectGeocodeReponseFactory;
