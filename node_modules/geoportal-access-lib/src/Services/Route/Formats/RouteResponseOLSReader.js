/**
 * Analyse de la reponse OLS
 *
 * @module RouteResponseOLSReader
 * @alias Gp.Services.Route.Formats.RouteResponseOLSReader
 * @todo not yet implemented !
 * @private
 */

import Logger from "../../../Utils/LoggerByDefault";

/**
 * Objet RouteResponseOLSReader
 * @member {Object} RouteResponseOLSReader
 *
 * @property {Object} RouteResponseOLSReader.READERS - Objet contenant des fonctions de lecture, appelées "readers"
 *      dont chaque clé correspond au nom d'un tag du XML que l'on souhaite lire
 *      et la valeur associée est une fonction (node, data)
 *      où node est un noeud du document DOM
 *      et data est un objet où l'on stocke les informations lues dans le XML.
 *
 * @property {Method} RouteResponseOLSReader.read -  Méthode permettant de lancer la lecture d'une réponse
 *      XML du service de calcul d'itineraire, à l'aide des readers de la classe.
 */
var RouteResponseOLSReader = {};

/**
 * Objet contenant des fonctions de lecture, appelées "readers"
 *      dont chaque clé correspond au nom d'un tag du XML que l'on souhaite lire
 *      et la valeur associée est une fonction (node, data)
 *      où node est un noeud du document DOM
 *      et data est un objet où l'on stocke les informations lues dans le XML.
 * @static
 * @memberof RouteResponseOLSReader
 */
RouteResponseOLSReader.READERS = {
    /*
        // INFO
        // pas de reponse en JSON pour l'API OLS, uniquement du XML !

        // INFO
        // Exemple d'erreur du service
        // <?xml version= "1.0" encoding= "UTF-8" standalone= "yes" ?>
        // <XLS version="1.2" xsi : schemaLocation = "http://www.opengis.net/xls http://schemas.opengis.net/ols/1.2/olsAll.xsd" xmlns : xls = "http://www.opengis.net/xls" xmlns= "http://www.opengis.net/xls" xmlns : xlsext = "http://www.opengis.net/xlsext" xmlns : gml = "http://www.opengis.net/gml" // xmlns : xsi = "http://www.w3.org/2001/XMLSchema-instance" >
        // <ResponseHeader>
        //     <ErrorList>
        //         <Error message="Routing error : Error in smartrouting com.geoconcept.smartrouting.SmartRoutingNativeException : failed to connect waypoint { 48.846577, 2.416907, 0.000000 } failed to connect waypoint { 48.846577, 2.416907, 0.000000 } " errorCode="InternalServerError"/>
        //     </ErrorList>
        // </ResponseHeader>
        // <Response version= "1.2" requestID= "f8358c74-8aee-4203-90b9-2c70db5996a1" />
        // </XLS>

        // INFO
        // Exemple d'erreur NGinx
        // <ExceptionReport><Exception exceptionCode="MissingParameter">Resource parameter not found</Exception></ExceptionReport>
    */
};

/**
 * Méthode permettant de lancer la lecture d'une réponse XML du service de calcul d'itineraire,
 * à l'aide des readers de la classe.
 *
 * @method RouteResponseOLSReader.read
 * @param {DOMElement} root - racine de la réponse XML à lire
 * @static
 * @memberof RouteResponseOLSReader
 */
RouteResponseOLSReader.read = function (root) {
    // logger
    var logger = Logger.getLogger("RouteResponseOLSReader");
    logger.error("not yet implemented !");
};

export default RouteResponseOLSReader;
