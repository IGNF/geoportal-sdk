/**
 * Factory pour générer une reponse JSON à partir d'un XML
 * ou d'un JSON encapsulant du XML
 * (Factory)
 *
 * @module ReverseGeocodeResponseFactory
 * @alias Gp.Services.ReverseGeocode.Response.ReverseGeocodeResponseFactory
 * @todo La reponse JSON peut encapsuler un XML !
 * @private
 */

import MRes from "../../../Utils/MessagesResources";
import ErrorService from "../../../Exceptions/ErrorService";
import XML from "../../../Formats/XML";
import ReverseGeocodeResponseReader from "../Formats/ReverseGeocodeResponseReader";

var ReverseGeocodeReponseFactory = {

    /**
     * interface unique
     *
     * @method build
     * @static
     * @param {Object} options - options definies dans le composant ReverseGeocode
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
        // data de type ReverseGeocodeResponse
        var data = null;

        if (options.response) {
            if (options.rawResponse) {
                data = options.response;
            } else {
                try {
                    var p = new XML({
                        reader : ReverseGeocodeResponseReader
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
                    // on relaye l'erreur reçue
                    e.status = 200;
                    options.onError.call(options.scope, e);
                    return;
                }

                // Si la réponse contenait une exception renvoyée par le service
                // TODO : quand cela arrive-t-il ?
                if (data.exceptionReport) {
                    options.onError.call(options.scope, new ErrorService({
                        message : MRes.getMessage("SERVICE_RESPONSE_EXCEPTION", data.exceptionReport),
                        type : ErrorService.TYPE_SRVERR,
                        status : 200
                    }));
                    return;
                }

                // dans le cas d'un srs non EPSG géographique, il faut réinverser les coordonnées (lat,lon => lon,lat)
                if (options.scope && options.scope.options && options.scope.options.srs && options.scope.options.srs !== "EPSG:4326") {
                    var location;
                    var pos;
                    if (data || data.locations || data.locations.length) {
                        for (var i = 0; i < data.locations.length; i++) {
                            location = data.locations[i];
                            if (location) {
                                pos = location.position;
                                if (pos) {
                                    // on inverse les 2 coordonnées
                                    location.position = {
                                        x : pos.y,
                                        y : pos.x
                                    };
                                }
                            }
                        }
                    }
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

export default ReverseGeocodeReponseFactory;
