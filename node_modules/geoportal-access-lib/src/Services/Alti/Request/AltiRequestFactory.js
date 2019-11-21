/**
 * Creation d'une requête en REST ou WPS
 * (Factory)
 *
 * @module AltiRequestFactory
 * @alias Gp.Services.Alti.Request.AltiRequestFactory
 * @private
 */
import Logger from "../../../Utils/LoggerByDefault";
import ErrorService from "../../../Exceptions/ErrorService";
import AltiRequestREST from "./AltiRequestREST";
import AltiRequestWPS from "./AltiRequestWPS";

var AltiRequestFactory = {

    /**
     * interface unique
     *
     * @method build
     * @static
     * @param {Object} options - options definies dans le composant Alti
     *
     * @example
     *   var options = {
     *      httpMethod : 'GET', // GET|POST
     *      onSuccess : function (response) {},
     *      onError : function (error) {},
     *      scope : this,
     *      positions : [{lon:, lat:}, {lon:, lat:}],
     *      outputFormat : 'json' // json|xml
     *      sampling : 3,
     *      api : 'REST', // REST|WPS
     *      zonly : false // false|true
     *   };
     *
     */
    build : function (options) {
        // logger
        var logger = Logger.getLogger("AltiRequestFactory");
        logger.trace(["AltiRequestFactory::build()"]);

        var request = null;

        // on factorise les options par groupe;
        // - global,
        // - param, les params pour les data inputs
        // - wps, les param du service
        // - callback

        var settings = {
            // ajout des valeurs par defaut spécifiques au service
            type : options.sampling ? "Profil" : "Elevation",
            method : options.httpMethod,
            param : {
                positions : null,
                delimiter : null, // FIXME par defaut, on ne le met pas en place car ça fait planter la requête !?
                indent : null, // par defaut
                crs : null, // par defaut
                format : null, // (only to POST)
                sampling : null, // (only use by Profil)
                zonly : null // (only use by Elevation)
            }
        };

        // surcharge des valeurs obligatoires
        settings.param.positions = options.positions;
        settings.param.format = options.outputFormat;
        settings.param.sampling = options.sampling;
        settings.param.zonly = options.zonly;

        // gestion des callback
        var bOnError = !!((options.onError !== null && typeof options.onError === "function"));
        var bOnSuccess = !!((options.onSuccess !== null && typeof options.onSuccess === "function"));

        var message = null;
        switch (options.api) {
            case "REST":
                // FIXME les exceptions ne sont pas 'catchées' sur le constructeur !
                var myReq = new AltiRequestREST(settings);
                if (!myReq.processRequestString()) {
                    message = "Error in process request (rest) !";
                    if (bOnError) {
                        options.onError.call(options.scope, new ErrorService(message));
                        return;
                    }
                    throw new Error(message);
                }
                request = myReq.requestString;
                break;
            case "WPS":
                // ajout des valeurs par defaut spécifiques au service WPS
                settings.wps = {
                    service : null, // par defaut
                    version : null, // par defaut
                    identifier : null, // par defaut
                    rawdataoutput : null, // par defaut
                    request : null // par defaut
                };

                request = AltiRequestWPS.build(settings);
                if (!request) {
                    message = "Error in process request (wps) !";
                    if (bOnError) {
                        options.onError.call(options.scope, new ErrorService(message));
                        return;
                    }
                    throw new Error(message);
                }
                break;
            default:
                message = "Type of API is not supported by service (REST or WPS) !";
                if (bOnError) {
                    options.onError.call(options.scope, new ErrorService(message));
                    return;
                }
                throw new Error(message);
        }

        if (bOnSuccess) {
            options.onSuccess.call(options.scope, request);
        }

        return request;
    }
};

export default AltiRequestFactory;
