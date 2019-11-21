/**
 * Analyse de la reponse REST
 *
 * @module RouteResponseRESTReader
 * @alias Gp.Services.Route.Formats.RouteResponseRESTReader
 * @todo not yet implemented !
 * @private
 */

// import Logger from "../../../Utils/LoggerByDefault";
import MessagesResources from "../../../Utils/MessagesResources";
import WKT from "../../../Formats/WKT";
import ErrSrv from "../../../Exceptions/ErrorService";
import RouteResponse from "../Response/model/RouteResponse";
import RouteInstruction from "../Response/model/RouteInstruction";

/**
 * Objet RouteResponseRestReader
 * @member {Object} RouteResponseRestReader
 *
 * @property {Object} RouteResponseRestReader.READERS - Objet contenant des fonctions de lecture, appelées "readers"
 *      dont chaque clé correspond au nom d'un tag du XML que l'on souhaite lire
 *      et la valeur associée est une fonction (node, data)
 *      où node est un noeud du document DOM
 *      et data est un objet où l'on stocke les informations lues dans le XML.
 *
 * @property {Method} RouteResponseRestReader.read - Méthode permettant de lancer la lecture d'une réponse XML du
 *      service de calcul d'itineraire, à l'aide des readers de la classe.
 *
 */

var RouteResponseRESTReader = {};

RouteResponseRESTReader.READERS = {

    /**
     * Route response
     * @param {Object} node - node
     * @returns {Object} response
     */
    routeResult : function (node) {
        var response = new RouteResponse();

        // on boucle sur les balises "enfant" de la réponse :
        // status, distance, duration, distanceMeters, durationSeconds, bounds, geometryWkt, simplifiedWkt, leg
        __getChildNodes(node, response);

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

    /**
     * Route status
     * @param {Object} node - node
     * @param {Object} response - response
     */
    status : function (node, response) {
        var status = __getChildValue(node);
        if (status === "ERROR" || status === "error") {
            if (response) {
                response.status = "error";
            }
        }
    },

    /**
     * Route message
     * @param {Object} node - node
     * @param {Object} response - response
     */
    message : function (node, response) {
        if (response) {
            response.message = __getChildValue(node);
        }
    },

    /**
     * Route distance
     * @param {Object} node - node
     * @param {Object} response - response
     */
    distance : function (node, response) {
        if (response) {
            response.totalDistance = __getChildValue(node);
        }
    },

    /**
     * Route duration
     * @param {Object} node - node
     * @param {Object} response - response
     */
    durationSeconds : function (node, response) {
        if (response) {
            response.totalTime = parseFloat(__getChildValue(node));
        }
    },

    /**
     * Route bounds
     * @param {Object} node - node
     * @param {Object} response - response
     */
    bounds : function (node, response) {
        // get value et split et parseFloat
        if (response && response.bbox) {
            var coords = __getChildValue(node).split(/[,;]/);
            response.bbox.left = parseFloat(coords[0]);
            response.bbox.bottom = parseFloat(coords[1]);
            response.bbox.right = parseFloat(coords[2]);
            response.bbox.top = parseFloat(coords[3]);
        }
    },

    /**
     * Route geometry
     * @param {Object} node - node
     * @param {Object} response - response
     */
    geometryWkt : function (node, response) {
        if (response) {
            var geomWkt = node.innerHTML;

            var onWKTSuccess = function (json) {
                response.routeGeometry = json;
            };

            var onWKTError = function () {
                var msg = MessagesResources.getMessage("PARAM_FORMAT", ["geometryWkt"]);
                throw new Error(msg);
            };
            // get WKT Geometry from string
            WKT.toJson(geomWkt, onWKTSuccess, onWKTError);
        }
    },

    /**
     * Route step
     * @param {Object} node - node
     * @param {Object} response - response
     */
    step : function (node, response) {
        // création d'une nouvelle instruction
        var routeInstruction = new RouteInstruction();
        var name;

        // lecture des informations de l'instruction (balises enfants)
        if (node.hasChildNodes) {
            var children = node.childNodes;
            var child;
            var childName;

            for (var i = 0; i < children.length; i++) {
                child = children[i];

                if (child.nodeType === 1) { // 1 === node.ELEMENT_NODE
                    childName = child.localName || child.baseName || child.nodeName;

                    if (childName === "durationSeconds") {
                        routeInstruction.duration = __getChildValue(child);
                    } else if (childName === "distance") {
                        routeInstruction.distance = __getChildValue(child);
                    } else if (childName === "navInstruction") {
                        routeInstruction.code = __getChildValue(child);
                    } else if (childName === "name") {
                        name = __getChildValue(child);
                    }
                }
            }
        }

        // on teste le code de l'instruction pour y ajouter la bonne description
        if (routeInstruction.code) {
            switch (routeInstruction.code) {
                case "F":
                    if (name !== "Valeur non renseignée") {
                        routeInstruction.instruction = "Tout droit " + name;
                    } else {
                        routeInstruction.instruction = "Continuer tout droit ";
                    }
                    break;
                case "B":
                    routeInstruction.instruction = "Demi-tour " + name;
                    break;
                case "L":
                    routeInstruction.instruction = "Tourner à gauche " + name;
                    break;
                case "R":
                    routeInstruction.instruction = "Tourner à droite " + name;
                    break;
                case "BL":
                    routeInstruction.instruction = "Tourner très à gauche " + name;
                    break;
                case "BR":
                    routeInstruction.instruction = "Tourner très à droite " + name;
                    break;
                case "FL":
                    routeInstruction.instruction = "Tourner légèrement à gauche " + name;
                    break;
                case "FR":
                    routeInstruction.instruction = "Tourner légèrement à droite " + name;
                    break;
                case "round_about_entry":
                    routeInstruction.instruction = "Entrée rond-point " + name;
                    break;
                case "round_about_exit":
                    routeInstruction.instruction = "Sortie rond-point " + name;
                    break;
                case null:
                    routeInstruction.instruction = "Prendre " + name;
                    break;
                default:
                    routeInstruction.instruction = "?" + routeInstruction.code + "? " + name;
                    break;
            }
        }

        if (Array.isArray(response.routeInstructions)) {
            response.routeInstructions.push(routeInstruction);
        }
    }

};

/**
 * Méthode permettant de lancer la lecture d'une réponse XML du service de calcul d'itineraire,
 * à l'aide des readers de la classe.
 *
 * @method RouteResponseRESTReader.read
 * @param {DOMElement} root - racine de la réponse XML à lire
 * @static
 * @memberof RouteResponseRESTReader
 * @returns {DOMElement} response
 */
RouteResponseRESTReader.read = function (root) {
    var response;

    if (root.nodeName === "routeResult") {
        response = RouteResponseRESTReader.READERS["routeResult"](root);
        return response;
    } else {
        throw new Error("Erreur lors de la lecture de la réponse : elle n'est pas au format attendu.");
    }
};

/**
 * Lecture de la valeur du premier child d'un noeud, si elle existe.
 *
 * @private
 * @memberof RouteResponseRESTReader
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

/**
 * Récupération des noeuds enfants à partir d'un noeud donné, pour lecture (readNode).
 *
 * @private
 * @memberof RouteResponseRESTReader
 * @method __getChildNodes
 * @param {DOMElement} node - a DOM node
 * @param {Array|Object} [data] - an object to be filled with node data
 */
function __getChildNodes (node, data) {
    if (node.hasChildNodes()) {
        var children = node.childNodes;
        var child;
        var childName;

        for (var i = 0; i < children.length; i++) {
            child = children[i];

            if (child.nodeType === 1) { // 1 === node.ELEMENT_NODE
                childName = child.localName || child.baseName || child.nodeName;

                if (RouteResponseRESTReader.READERS[childName]) {
                    var reader = RouteResponseRESTReader.READERS[childName];
                    reader(child, data);
                } else {
                    __getChildNodes(child, data);
                }
            }
        }
    }
}

export default RouteResponseRESTReader;
