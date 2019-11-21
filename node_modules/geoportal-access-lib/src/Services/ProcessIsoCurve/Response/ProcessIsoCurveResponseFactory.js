/**
 * Factory pour générer une reponse JSON à partir d'un XML ou d'un JSON
 * (Factory)
 *
 * @module ProcessIsoCurveResponseFactory
 * @alias Gp.Services.ProcessIsoCurve.Response.ProcessIsoCurveResponseFactory
 * @private
 */
import Logger from "../../../Utils/LoggerByDefault";
import MRes from "../../../Utils/MessagesResources";
import ErrorService from "../../../Exceptions/ErrorService";
import XML from "../../../Formats/XML";
import WKT from "../../../Formats/WKT";
import ProcessIsoCurveResponseReader from "../Formats/ProcessIsoCurveResponseReader";
import ProcessIsoCurveResponse from "./model/ProcessIsoCurveResponse";

var ProcessIsoCurveResponseFactory = {

    /**
     * interface unique
     *
     * @method build
     * @static
     * @param {Object} options - options definies dans le composant ProcessIsoCurve
     *
     * @example
     *   var options = {
     *      response :
     *      outputFormat :
     *      rawResponse :
     *      scope :
     *      onSuccess :
     *      onError :
     *   };
     *
     */
    build : function (options) {
        // logger
        var logger = Logger.getLogger("ProcessIsoCurveResponseFactory");
        logger.trace(["ProcessIsoCurveResponseFactory::build()"]);

        var data = null;

        if (options.response) {
            if (options.rawResponse) {
                logger.trace("analyze response : raw");
                data = options.response;
            } else {
                switch (options.outputFormat) {
                    case "xml":
                        logger.trace("analyze response : xml");

                        try {
                            var p = new XML({
                                reader : ProcessIsoCurveResponseReader
                            });

                            // FIXME : mode XHR ne retourne que des string ? JSONP aussi à ce niveau ?
                            if (typeof options.response === "string") {
                                p.setXMLString(options.response);
                            } else {
                                p.setXMLDoc(options.response);
                            }

                            data = p.parse();

                            if (!data) {
                                throw new Error(MRes.getMessage("SERVICE_RESPONSE_EXCEPTION_2"));
                            }
                        } catch (e) {
                            var message = e.message;
                            message += "\n (raw response service : '" + options.response + "')";
                            options.onError.call(options.scope, new ErrorService({
                                message : MRes.getMessage("SERVICE_RESPONSE_EXCEPTION", message),
                                status : 200,
                                type : ErrorService.TYPE_SRVERR
                            }));
                            return;
                        }

                        break;

                    case "json":
                        logger.trace("analyze response : json");

                        var JSONResponse;
                        if (typeof options.response === "string") {
                            JSONResponse = JSON.parse(options.response);
                        } else {
                            JSONResponse = options.response;
                        }

                        // analyse de la reponse
                        if (JSONResponse.status === "OK" || JSONResponse.status === "ok") {
                            // création de l'objet de réponse
                            data = new ProcessIsoCurveResponse();

                            // remplissage de l'objet créé avec les attribtuts de la réponse du service
                            if (data) {
                                data.time = JSONResponse.time;
                                data.distance = JSONResponse.distance;
                                data.message = JSONResponse.message;
                                data.id = JSONResponse.id;
                                data.srs = JSONResponse.srs;
                                // callback de la reponse
                                var onWKTSuccess = function (json) {
                                    data.geometry = json;
                                };
                                // callback d'erreur
                                var onWKTError = function () {
                                    options.onError.call(options.scope, new ErrorService({
                                        message : MRes.getMessage("PARAM_FORMAT", "wktGeometry")
                                    }));
                                };
                                if (data.hasOwnProperty("geometry")) {
                                    WKT.toJson(JSONResponse.wktGeometry, onWKTSuccess, onWKTError);
                                    if (!data.geometry) {
                                        return;
                                    }
                                }
                                var coords = JSONResponse.location.split(",");
                                if (data.location) {
                                    data.location.x = coords[0];
                                    data.location.y = coords[1];
                                }
                            } else {
                                options.onError.call(options.scope, new ErrorService(MRes.getMessage("SERVICE_RESPONSE_ANALYSE", options.response)));
                                return;
                            }
                        } else if (JSONResponse.status === "ERROR" || JSONResponse.status === "error") {
                            // JSHint bug if var message is used !?
                            var mess = JSONResponse.message;
                            mess += "\n (raw response service : '" + JSONResponse + "')";
                            options.onError.call(options.scope, new ErrorService(MRes.getMessage("SERVICE_RESPONSE_EXCEPTION", mess)));
                            return;
                        }
                        break;

                    default:
                        options.onError.call(options.scope, new ErrorService(MRes.getMessage("SERVICE_RESPONSE_FORMAT", "json", "xml")));
                        return;
                }

                // info : en cas de problèmes de droits (clé invalide ou autre), la réponse est au format XML !!
                // ex. <ExceptionReport><Exception exceptionCode="MissingParameter">Key does not exist or has expired</Exception></ExceptionReport>
                // mais le statut est 403, l'erreur est donc remontée plus tôt.
                if (data && data.exceptionReport) {
                    options.onError.call(options.scope, new ErrorService({
                        message : MRes.getMessage("SERVICE_RESPONSE_EXCEPTION", data.exceptionReport),
                        type : ErrorService.TYPE_SRVERR,
                        status : 200
                    }));
                    return;
                }
            }
        } else {
            // si la réponse est vide, on appelle le callback d'erreur
            options.onError.call(options.scope, new ErrorService(MRes.getMessage("SERVICE_RESPONSE_EMPTY")));
            return;
        }

        // si tout s'est bien passé, on appelle le callback de succès
        options.onSuccess.call(options.scope, data);
    }
};

export default ProcessIsoCurveResponseFactory;
