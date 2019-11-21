/**
 * Analyse de la reponse XML
 *
 * @module ProcessIsoCurveResponseReader
 * @alias Gp.Services.ProcessIsoCurve.Formats.ProcessIsoCurveResponseReader
 * @todo not yet implemented !
 * @private
 */

import MessagesResources from "../../../Utils/MessagesResources";
import WKT from "../../../Formats/WKT";
import ErrSrv from "../../../Exceptions/ErrorService";
import ProcessIsoCurveResponse from "../Response/model/ProcessIsoCurveResponse";

/**
 * Objet ProcessIsoCurveResponseReader
 *
 * @member {Object} ProcessIsoCurveResponseReader
 *
 * @property {Object} ProcessIsoCurveResponseReader.READERS - Objet contenant des fonctions de lecture, appelées "readers"
 *      dont chaque clé correspond au nom d'un tag du XML que l'on souhaite lire
 *      et la valeur associée est une fonction (node, data)
 *      où node est un noeud du document DOM
 *      et data est un objet où l'on stocke les informations lues dans le XML.
 *
 * @property {Method} ProcessIsoCurveResponseReader.read -  Méthode permettant de lancer la lecture d'une réponse XML
 *       du service de calcul isochrone/isodistance, à l'aide des readers de la classe.
 *
 */

var ProcessIsoCurveResponseReader = {};

/*
    // INFO
    // Exemple d'erreur du service
    // <?xml version="1.0" encoding="UTF-8" standalone="yes" ?>
    // <isochroneResult>
    //  <message>Location point must have 2 components separated with a ,</message>
    //  <status>ERROR</status>
    // </isochroneResult>

    // <?xml version="1.0" encoding="UTF-8" standalone="yes" ?>
    // <serviceResult>
    //   <message>ServiceException : Error in isochron computation Error in smartrouting null</message>
    //   <status>ERROR</status>
    // </serviceResult>

    // INFO
    // Exemple d'erreur NGinx
    // <ExceptionReport><Exception exceptionCode="MissingParameter">Resource parameter not found</Exception></ExceptionReport>
*/

/*
    // INFO
    // Exemple de réponse du service

     // <IsochroneResult>
     //    <status>OK</status>
     //    <id/>
     //    <location>-1.557189,47.217122</location>
     //    <srs/>
     //    <distance>5000</distance>
     //    <wktGeometry>POLYGON ((-1.545312 47.178178, -1.545312 47.180418, ...))</wktGeometry>
     // </IsochroneResult>

    // <isochronResult>
    //    <status>OK</status>
    //    <id>1</id>
    //    <location>-1.557189,47.217122</location>
    //    <srs/>
    //    <time>50</time>
    //    <wktGeometry>POLYGON ((-1.556864 47.216487, -1.556864 47.216948, ...))</wktGeometry>
    // </isochronResult>
*/

ProcessIsoCurveResponseReader.READERS = {

    /** TODO : jsdoc block */
    isochronResult : function (root) {
        // racine de la réponse XML : on crée l'objet de réponse
        var response = new ProcessIsoCurveResponse();

        if (root.hasChildNodes()) {
            var children = root.childNodes;
            var child;

            for (var i = 0; i < children.length; i++) {
                child = children[i];

                if (ProcessIsoCurveResponseReader.READERS[child.nodeName]) {
                    ProcessIsoCurveResponseReader.READERS[child.nodeName](child, response);
                }
            }
        }

        if (response.status === "error") {
            var message = MessagesResources.getMessage("SERVICE_RESPONSE_EXCEPTION",
                response.message);
            throw new ErrSrv({
                message : message,
                type : ErrSrv.TYPE_SRVERR
            });
        }
        return response;
    },

    /** TODO : jsdoc block */
    message : function (node, response) {
        if (response) {
            response.message = __getChildValue(node);
        }
    },

    /** TODO : jsdoc block */
    status : function (node, response) {
        var status = __getChildValue(node);
        if (status === "ERROR" || status === "error") {
            if (response) {
                response.status = "error";
            }
        }
    },

    /** TODO : jsdoc block */
    id : function (node, response) {
        if (response) {
            response.id = __getChildValue(node);
        }
    },

    /** TODO : jsdoc block */
    location : function (node, response) {
        var coords = __getChildValue(node);
        if (response && response.location) {
            response.location.x = parseFloat(coords.split(",")[0]);
            response.location.y = parseFloat(coords.split(",")[1]);
        }
    },

    /** TODO : jsdoc block */
    srs : function (node, response) {
        if (response) {
            response.srs = __getChildValue(node);
        }
    },

    /** TODO : jsdoc block */
    distance : function (node, response) {
        if (response) {
            response.distance = parseFloat(__getChildValue(node));
        }
    },

    /** TODO : jsdoc block */
    time : function (node, response) {
        if (response) {
            response.time = parseFloat(__getChildValue(node));
        }
    },

    /** TODO : jsdoc block */
    wktGeometry : function (node, response) {
        if (response) {
            var wktGeometry = node.innerHTML;
            /** TODO : jsdoc block */
            var onWKTSuccess = function (json) {
                response.geometry = json;
            };
            /** TODO : jsdoc block */
            var onWKTError = function () {
                var msg = MessagesResources.getMessage("PARAM_FORMAT", ["wktGeometry"]);
                throw new Error(msg);
            };
            if (response.hasOwnProperty("geometry")) {
                WKT.toJson(wktGeometry, onWKTSuccess, onWKTError);
            }
        }
    },

    /** TODO : jsdoc block */
    serviceResult : function (node) {
        // en cas d'exception du service
        var response = {};
        if (node.hasChildNodes()) {
            var children = node.childNodes;
            var child;
            for (var i = 0; i < children.length; i++) {
                child = children[i];
                if (ProcessIsoCurveResponseReader.READERS[child.nodeName]) {
                    ProcessIsoCurveResponseReader.READERS[child.nodeName](child, response);
                }
            }
        }
        return response;
    },

    /** TODO : jsdoc block */
    ExceptionReport : function (node) {
        var response = {};
        if (node.hasChildNodes()) {
            var children = node.childNodes;
            var child;
            for (var i = 0; i < children.length; i++) {
                child = children[i];
                if (child.nodeName === "Exception") {
                    response.exceptionReport = ProcessIsoCurveResponseReader.READERS["Exception"](child);
                }
            }
        }
        return response;
    },

    /** TODO : jsdoc block */
    Exception : function (node) {
        var exceptionReport = {};

        // get exception code
        var exceptionCode = node.getAttribute("exceptionCode");
        if (exceptionCode) {
            exceptionReport.exceptionCode = exceptionCode;
        }

        // get exception message
        var textNode = node.firstChild;
        if (textNode && textNode.nodeType === 3) { // 3 === node.TEXT_NODE
            exceptionReport.exception = textNode.nodeValue;
        }

        return exceptionReport;
    }
};

/** TODO : jsdoc block */
ProcessIsoCurveResponseReader.read = function (root) {
    var response;

    if (root.nodeName === "isochronResult" || root.nodeName === "isochroneResult" || root.nodeName === "IsochroneResult") {
        response = ProcessIsoCurveResponseReader.READERS["isochronResult"](root);
        return response;
    } else if (root.nodeName === "ExceptionReport") {
        response = ProcessIsoCurveResponseReader.READERS[root.nodeName](root);
        return response;
    } else if (ProcessIsoCurveResponseReader.READERS[root.nodeName]) {
        response = ProcessIsoCurveResponseReader.READERS[root.nodeName](root);
        if (response.status === "error") {
            var errMsg = MessagesResources.getMessage("SERVICE_RESPONSE_EXCEPTION",
                response.message);
            throw new ErrSrv({
                message : errMsg,
                type : ErrSrv.TYPE_SRVERR
            });
        }
        return response;
    } else {
        throw new ErrSrv({
            message : MessagesResources.getMessage("SERVICE_RESPONSE_ANALYSE", root.nodeName),
            type : ErrSrv.TYPE_UNKERR
        });
    }
};

/**
 * Lecture de la valeur du premier child d'un noeud, si elle existe.
 *
 * @private
 * @memberof ProcessIsoCurveResponseReader
 * @method __getChildValue
 * @param {DOMElement} node - a DOM node
 * @return {String} value - valeur du firstChild du noeud en entrée, ou chaîne vide.
 */
function __getChildValue (node) {
    var textNode;
    var value = "";

    if (node.hasChildNodes()) {
        textNode = node.firstChild;
        if (textNode && textNode.nodeType === 3) { // 3 === node.TEXT_NODE
            value = textNode.nodeValue;
        }
    }
    return value;
}

export default ProcessIsoCurveResponseReader;
