
/**
 * Fonction retournant un objet contenant des clés de lecture (readers)
 *      qui permettent de parser des réponses XML du service Altimétrique du Géoportail
 *      (calcul altimétrique simple ou profil altimétrique d'une courbe),
 *      lorsque le paramètre output = xml,
 *      afin de récupérer les élévations retournées.
 *
 * @module AltiResponseReader
 * @alias Gp.Services.Alti.Formats.AltiResponseReader
 * @private
 */

// import Logger from "../../../Utils/LoggerByDefault";
import AltiResponse from "../Response/model/AltiResponse";
import Elevation from "../Response/model/Elevation";

/**
 *
 * Objet AltiResponseReader
 *
 * @member {Object} AltiResponseReader
 *
 * @property {Object} AltiResponseReader.READERS - Objet contenant des fonctions de lecture, appelées "readers"
 *      dont chaque clé correspond au nom d'un tag du XML que l'on souhaite lire
 *      et la valeur associée est une fonction (node, data)
 *      où node est un noeud du document DOM
 *      et data est un objet où l'on stocke les informations lues dans le XML.
 *
 * @property {Method} AltiResponseReader.READERS.elevations -  Lecture d'un noeud "elevations" de la réponse XML
 *      du service alti, correspondant logiquement à la racine du document
 *      (contient un ou plusieurs childNodes correspondant chacun à une élévation retournée)
 *
 * @property {Method} AltiResponseReader.READERS.elevation - ecture d'un noeud "elevation" de la réponse xml du service alti.
 *      (contient un ou 4 childNode (s) correspondant à l'altitude (z) et éventuellement lat, lon, et acc)
 *
 * @property {Method} AltiResponseReader.READERS.lat - Lecture d'un noeud "lat" de la réponse xml du service alti.
 *      (contient une valeur de latitude, qui est un flottant)
 *
 * @property {Method} AltiResponseReader.READERS.lon - Lecture d'un noeud "lon" de la réponse xml du service alti.
 *      (contient une valeur de longitude, qui est un flottant)
 *
 * @property {Method} AltiResponseReader.READERS.z - Lecture d'un noeud "z" de la réponse xml du service alti.
 *      (contient une valeur d'altitude, qui est un flottant)
 *
 * @property {Method} AltiResponseReader.READERS.acc - Lecture d'un noeud "acc" de la réponse xml du service alti.
 *      (contient une valeur de précision, qui est un flottant)
 *
 * @property {Method} AltiResponseReader.READERS.exceptionreport - Lecture d'un noeud "ExceptionReport" de la réponse xml du service alti.
 *
 * @property {Method} AltiResponseReader.READERS.exception - Lecture d'un noeud "Exception" de la réponse xml du service alti.
 *
 * @property {Method} AltiResponseReader.read - Méthode permettant de lancer la lecture d'une réponse XML du service altimétrique,
 *      à l'aide des readers de la classe.
 *
 */
var AltiResponseReader = {};

AltiResponseReader.READERS = {

    /**
     * Lecture d'un noeud "elevations" de la réponse XML du service alti, correspondant logiquement à la racine du document
     *      (contient un ou plusieurs childNodes correspondant chacun à une élévation retournée)
     *
     * @param {DOMElement} root - racine de la réponse XML
     * @static
     * @memberof AltiResponseReader
     * @returns {Object} Retourne un objet de type AltiResponse
     */
    elevations : function (root) {
        // INFO : on passe en paramètre l'objet en entrée elevations, vide, à remplir.
        var altiResponse = new AltiResponse();

        if (root.hasChildNodes()) {
            var children = root.childNodes;
            var child;
            var elevation;

            for (var i = 0; i < children.length; i++) {
                child = children[i];

                if (AltiResponseReader.READERS[child.nodeName]) {
                    elevation = AltiResponseReader.READERS[child.nodeName](child);
                    altiResponse.elevations.push(elevation);
                }
            }
        }

        return altiResponse;
    },

    /**
     * Lecture d'un noeud "elevation" de la réponse xml du service alti.
     *      (contient un ou 4 childNode (s) correspondant à l'altitude (z) et éventuellement lat, lon, et acc)
     *
     * @param {DOMElement} node - noeud elevation à lire pour récupérer les informations de l'élévation retournée (z [, lon, lat, acc])
     * @return {Array} elevationResponse - format de la réponse en sortie, instance de AltiResponse
     * @static
     * @memberof AltiResponseReader
     */
    elevation : function (node) {
        var elevation = new Elevation();

        if (node.hasChildNodes()) {
            var children = node.childNodes;
            var child;
            for (var i = 0; i < children.length; i++) {
                child = children[i];
                if (AltiResponseReader.READERS[child.nodeName]) {
                    // INFO : on passe en paramètre l'objet en entrée elevation, vide, à remplir.
                    AltiResponseReader.READERS[child.nodeName](child, elevation);
                }
            }
        }
        return elevation;
    },

    /**
     * Lecture d'un noeud "lat" de la réponse xml du service alti.
     *      (contient une valeur de latitude, qui est un flottant)
     *
     * @param {DOMElement} node - noeud à lire pour récupérer la latitude
     * @param {Object} elevation - objet dans lequel stocker la latitude retournée
     * @static
     * @memberof AltiResponseReader
     */
    lat : function (node, elevation) {
        var textNode = node.firstChild;
        if (textNode && textNode.nodeType === 3) { // 3 === node.TEXT_NODE
            elevation.lat = parseFloat(textNode.nodeValue);
        } else {
            throw new Error("Erreur dans la lecture de la réponse du service : latitude attendue mais absente");
        }
    },

    /**
     * Lecture d'un noeud "lon" de la réponse xml du service alti.
     *      (contient une valeur de longitude, qui est un flottant)
     *
     * @param {DOMElement} node - noeud à lire pour récupérer la longitude
     * @param {Object} elevation - objet dans lequel stocker la longitude retournée
     * @static
     * @memberof AltiResponseReader
     */
    lon : function (node, elevation) {
        var textNode = node.firstChild;
        if (textNode && textNode.nodeType === 3) { // 3 === node.TEXT_NODE
            elevation.lon = parseFloat(textNode.nodeValue);
        } else {
            throw new Error("Erreur dans la lecture de la réponse du service : longitude attendue mais absente");
        }
    },

    /**
     * Lecture d'un noeud "z" de la réponse xml du service alti.
     *      (contient une valeur d'altitude, qui est un flottant)
     *
     * @param {DOMElement} node - noeud à lire pour récupérer l'altitude
     * @param {Object} elevation - objet dans lequel stocker l'altitude retournée
     * @static
     * @memberof AltiResponseReader
     */
    z : function (node, elevation) {
        var textNode = node.firstChild;
        if (textNode && textNode.nodeType === 3) { // 3 === node.TEXT_NODE
            if (elevation) {
                elevation.z = parseFloat(textNode.nodeValue);
            } else {
                elevation = new Elevation();
                elevation.z = parseFloat(textNode.nodeValue);
                return elevation;
            }
        } else {
            throw new Error("Erreur dans la lecture de la réponse du service : altitude attendue mais absente");
        }
    },

    /**
     * Lecture d'un noeud "acc" de la réponse xml du service alti.
     *      (contient une valeur de précision, qui est un flottant)
     *
     * @param {DOMElement} node - noeud à lire pour récupérer la précision
     * @param {Object} elevation - objet dans lequel stocker la précision retournée
     * @static
     * @memberof AltiResponseReader
     */
    acc : function (node, elevation) {
        var textNode = node.firstChild;
        if (textNode && textNode.nodeType === 3) { // 3 === node.TEXT_NODE
            elevation.acc = parseFloat(textNode.nodeValue);
        } else {
            throw new Error("Erreur dans la lecture de la réponse du service : précision (acc) attendue mais absente");
        }
    },

    /**
     * Lecture d'un noeud "ExceptionReport" de la réponse xml du service alti.
     *
     * @param {DOMElement} node - noeud à lire pour récupérer l'exception
     * @return {Object} exceptionReport - objet contenant l'exception
     * @static
     * @memberof AltiResponseReader
     */
    exceptionreport : function (node) {
        var response = {};

        if (node.hasChildNodes()) {
            var children = node.childNodes;
            var child;
            for (var i = 0; i < children.length; i++) {
                child = children[i];
                if (child.nodeName === "Exception") {
                    response.exceptionReport = AltiResponseReader.READERS.exception(child);
                }
            }
        }

        return response;
    },

    /**
     * Lecture d'un noeud "Exception" de la réponse xml du service alti.
     *
     * @param {DOMElement} node - noeud à lire pour récupérer l'exception
     * @return {Object} exceptionReport - objet contenant l'exception, avec deux attributs :
     *      {String} exceptionReport.exceptionCode - qui contient l'identifiant du code de l'exception
     *      {String} exceptionReport.exception - qui contient le message de l'exception
     * @static
     * @memberof AltiResponseReader
     */
    exception : function (node) {
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
    },

    /**
     * Lecture d'un noeud "Error" de la réponse xml du service alti.
     *
     * @param {DOMElement} node - noeud à lire pour récupérer l'exception
     * @return {Object} error - objet contenant l'exception
     * @static
     */
    error : function (node) {
        var response = {
            error : {}
        };
        // get error code and description
        if (node.hasChildNodes()) {
            var children = node.childNodes;
            var child;
            for (var i = 0; i < children.length; i++) {
                child = children[i];
                var textNode;
                // get error code
                if (child.nodeType === 1 && child.nodeName === "code") { // 1 === node.ELEMENT_NODE
                    textNode = child.firstChild;
                    if (textNode && textNode.nodeType === 3) { // 3 === node.TEXT_NODE
                        response.error.code = textNode.nodeValue;
                    }
                }
                // get error description
                if (child.nodeType === 1 && child.nodeName === "description") { // 1 === node.ELEMENT_NODE
                    textNode = child.firstChild;
                    if (textNode && textNode.nodeType === 3) { // 3 === node.TEXT_NODE
                        response.error.description = textNode.nodeValue;
                    }
                }
            }
        }
        return response;
    }

};

/**
 * Méthode permettant de lancer la lecture d'une réponse XML du service altimétrique,
 *      à l'aide des readers de la classe.
 *
 * @method AltiResponseReader.read
 * @param {DOMElement} root - racine de la réponse XML à lire
 * @static
 * @memberof AltiResponseReader
 */
AltiResponseReader.read = function (root) {
    if (root.nodeName === "elevations") {
        var altiResponse = AltiResponseReader.READERS.elevations(root);
        return altiResponse;
    } else if (root.nodeName === "ExceptionReport") {
        var exceptionReport = AltiResponseReader.READERS.exceptionreport(root);
        return exceptionReport;
    } else if (root.nodeName === "error") {
        var error = AltiResponseReader.READERS.error(root);
        return error;
    } else {
        throw new Error("Erreur lors de la lecture de la réponse : elle n'est pas au format attendu.");
    }
};

export default AltiResponseReader;
