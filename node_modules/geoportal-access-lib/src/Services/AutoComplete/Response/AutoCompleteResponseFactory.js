/**
 * Factory pour générer une reponse JSON à partir d'un XML ou d'un JSON
 * (Factory)
 *
 * @module AutoCompleteResponseFactory
 * @private
 * @alias Gp.Services.AutoComplete.Response.AutoCompleteResponseFactory
 */
import Logger from "../../../Utils/LoggerByDefault";
import MRes from "../../../Utils/MessagesResources";
import ErrorService from "../../../Exceptions/ErrorService";
import AutoCompleteResponse from "./model/AutoCompleteResponse";
import SuggestedLocation from "./model/SuggestedLocation";

var AutoCompleteResponseFactory = {

    /**
     * interface unique
     *
     * @method build
     * @static
     * @param {Object} options - options definies dans le composant Alti
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
        var logger = Logger.getLogger("AutoCompleteResponseFactory");
        logger.trace(["AutoCompleteResponseFactory::build()"]);

        var data = null;

        if (options.response) {
            if (options.rawResponse) {
                logger.trace("analyze response : raw");
                data = options.response;
            } else {
                var JSONResponse;
                if (typeof options.response === "string") {
                    JSONResponse = JSON.parse(options.response);
                } else {
                    JSONResponse = options.response;
                }

                // analyse de la réponse
                if (JSONResponse) {
                    // le service renvoie t il une erreur ?
                    if (JSONResponse.error) {
                        // ex. ?
                        options.onError.call(options.scope, new ErrorService({
                            message : MRes.getMessage("SERVICE_RESPONSE_EXCEPTION", JSONResponse.error.description),
                            status : JSONResponse.error.code,
                            type : ErrorService.TYPE_SRVERR
                        }));
                        return;
                    }

                    // création de l'objet réponse
                    data = new AutoCompleteResponse();

                    // boucle sur les résultats de l'autocomplétion
                    if (JSONResponse.results && Array.isArray(JSONResponse.results)) {
                        var suggestedLocation;

                        for (var i = 0; i < JSONResponse.results.length; i++) {
                            var result = JSONResponse.results[i];
                            suggestedLocation = new SuggestedLocation();

                            if (suggestedLocation) {
                                if (result && result.country === "StreetAddress") {
                                    suggestedLocation.street = result.street;
                                    suggestedLocation.type = "StreetAddress";
                                } else if (result && result.country === "PositionOfInterest") {
                                    suggestedLocation.poi = result.street;
                                    suggestedLocation.kind = result.kind;
                                    suggestedLocation.type = "PositionOfInterest";
                                }

                                if (suggestedLocation.position) {
                                    suggestedLocation.position.x = result.x;
                                    suggestedLocation.position.y = result.y;
                                }

                                suggestedLocation.commune = result.city;
                                suggestedLocation.fullText = result.fulltext;
                                suggestedLocation.postalCode = result.zipcode;
                                suggestedLocation.classification = result.classification;
                            }
                            // Ajout du résultat au tableau reverseGeocodedLocations de geocodedLocation
                            data.suggestedLocations.push(suggestedLocation);
                        }
                    } else {
                        options.onError.call(options.scope, new ErrorService(MRes.getMessage("SERVICE_RESPONSE_FORMAT_3")));
                        return;
                    }

                    if (!data.suggestedLocations.length) {
                        options.onError.call(options.scope, new ErrorService(MRes.getMessage("SERVICE_RESPONSE_FORMAT_3")));
                        return;
                    }
                }

                if (!data) {
                    options.onError.call(options.scope, new ErrorService({
                        message : MRes.getMessage("SERVICE_RESPONSE_ANALYSE_2"),
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
                        status : 200
                    }));
                    return;
                }
            }
        } else {
            // si la réponse (xmlString) est vide, on appelle le callback d'erreur
            options.onError.call(options.scope, new ErrorService(MRes.getMessage("SERVICE_RESPONSE_EMPTY")));
            return;
        }

        // si tout s'est bien passé, on appelle le callback de succès
        options.onSuccess.call(options.scope, data);
    }
};

export default AutoCompleteResponseFactory;
