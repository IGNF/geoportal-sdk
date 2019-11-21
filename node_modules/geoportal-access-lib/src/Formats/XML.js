/* global require */

import Logger from "../Utils/LoggerByDefault";
// import __xmldom from "xmldom";

/**
 * @classdesc
 *
 * Classe permettant d'écrire ou de lire du XML, sous forme de document DOM,
 * éventuellement selon des clés de lecture (readers) ou d'écriture (writers) spécifiques.
 *
 * @constructor
 * @alias Gp.Formats.XML
 *
 * @param {Object} [options] - options du format XML
 *
 * @param {Object} [options.reader] - Instance d'un Reader de service (AltiResponseReader, GeocodeRequestReader, etc.)
 *      utile pour interpréter le XML lorsque sa structure est connue.
 *      Ce reader doit comporter au moins une fonction statique read (root) permettant d'initialiser la lecture.
 *
 * @param {Object} [options.writers] - writers
 *
 * @param {String} [options.xmlString] - chaîne de caractère contenant du XML à interpréter.
 *
 * @private
 */
function XML (options) {
    if (!(this instanceof XML)) {
        throw new TypeError("XML constructor cannot be called as a function.");
    }

    // FIXME : notion de singleton

    this.logger = Logger.getLogger();
    this.logger.trace("[Constructeur XML ()]");

    /**
     * Chaîne de caractères contenant le texte XML
     * @type {String}
     */
    this.xmlString = null;

    /**
     * DOM Element correspondant à la structure du XML.
     * @type {DOMElement}
     */
    this.xmlDoc = null;

    /**
     * Objet contenant des fonctions de lecture des différentes balises XML.
     * @type {Object}
     */
    this.reader = null;

    // traitement des paramètres d'options s'il y en a
    if (options) {
        if (options.xmlString && typeof options.xmlString === "string") {
            this.xmlString = options.xmlString;
            // Si une chaine de caractère a été passée en entrée : on la transforme aussi en XML document
            this.xmlDoc = __getXMLDOC(options.xmlString);
        }
        if (options.reader) {
            this.setReader(options.reader);
        }
    }
}

XML.prototype = {

    /**
     * @lends module:XML
     */

    /*
     * Constructeur (alias)
     */
    constructor : XML,

    /**
     * Méthode permettant de récupérer la chaîne de caractères associée au format XML
     *
     * @returns {String} xmlString - la chaîne de caractères correspondant au format XML
     */
    getXMLString : function () {
        return this.xmlString;
    },

    /**
     * Méthode permettant d'attribuer une chaîne de caractères au format XML (attribut xmlString).
     * La méthode va aussi transformer cette chaîne de caractères en document XML,
     * afin de remplir l'attribut xmlDoc.
     *
     * @param {String} xmlString - la chaîne de caractères correspondant au format XML
     */
    setXMLString : function (xmlString) {
        if (xmlString && typeof xmlString === "string") {
            this.xmlString = xmlString;
            this.xmlDoc = __getXMLDOC(xmlString);
        }
    },

    /**
     * Méthode permettant de récupérer les readers associés au format XML, s'ils ont été définis
     *
     * @return {Object} readers - les readers associés au format XML, s'ils existent,
     *      sous forme d'une collection de fonctions
     */
    getReader : function () {
        return this.reader;
    },

    /**
     * Méthode permettant d'attribuer des readers, sous la forme d'un objet de fonctions (node, data),
     *      lorsqu'ils n'ont pas été définis lors de l'instanciation par exemple (new XML (options)).
     *
     * @param {Object} reader - Instance d'un Reader de service (AltiResponseReader, GeocodeRequestReader, etc.)
     *      utile pour interpréter le XML lorsque sa structure est connue.
     *      Ce reader doit comporter au moins une fonction statique read (root) permettant d'initialiser la lecture.
     */
    setReader : function (reader) {
        if (reader && reader.read && typeof reader.read === "function") {
            this.reader = reader;
        }
    },

    /**
     * Méthode permettant de récupérer le document XML associé au format, s'il existe.
     *
     * @return {DOMElement} xmlDoc - le document XML (DOM document node) s'il existe
     */
    getXMLDoc : function () {
        return this.xmlDoc;
    },

    /**
     * Setter
     */
    setXMLDoc : function (doc) {
        this.xmlDoc = doc;
    },
    /**
     * Méthode initialisant la lecture du XML, à partir d'un XML Document :
     *      création d'un objet JavaScript contenant les informations du XML,
     *      sauf dans le cas où il n'existe pas de XML Document à interpréter (retourne un objet vide).
     *
     * @return {Object} [parserOutput] - un objet JavaScript contenant les informations du XML :
     * - soit toutes les informations si aucun reader n'a été spécifié à la création du format
     * - soit les informations spécifiées dans le reader.
     */
    parse : function () {
        // build xml document from xmlString
        if (!this.xmlDoc && this.xmlString) {
            this.xmlDoc = __getXMLDOC(this.xmlString);
        }
        if (this.xmlDoc) {
            var root = __getRootNode(this.xmlDoc);
            if (root) {
                var parserOutput;
                // call reader if exists
                if (this.reader && this.reader.read) {
                    parserOutput = this.reader.read(root);
                } else {
                    parserOutput = {};
                    parserOutput[root.nodeName] = __readDefault(root);
                }
                return parserOutput;
            } else {
                return {};
            }
        }
    }

};

/**
 * Méthode de la classe (privée) permettant de créer un XML Document à partir d'une chaîne de caractères XML,
 *      en utilisant DOMParser () lorsque c'est possible.
 *      For more information, see: https://dvcs.w3.org/hg/innerhtml/raw-file/tip/index.html#the-domparser-interface
 *
 * @private
 * @memberof XML
 * @method __getXMLDOC
 * @param {String} xmlString - xml string to be converted into DOM element
 * @return {DOMElement} - the corresponding XML Document
 */
function __getXMLDOC (xmlString) {
    if (typeof window === "undefined") {
        // env. nodejs
        var DOMParser = require("xmldom").DOMParser; // __xmldom.DOMParser;
        return new DOMParser().parseFromString(xmlString, "text/xml");
    } else {
        // env. browser

        var parser;
        var xmlDoc;
        var errorMsg = "Erreur lors du parsing de la réponse du service : XML non conforme";

        if (window.ActiveXObject) {
            // Internet Explorer < 9
            xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = false;
            xmlDoc.loadXML(xmlString);
            var parseError = xmlDoc.parseError;
            if (parseError.errorCode) {
                if (parseError.line && parseError.linepos) {
                    errorMsg += "( ligne " + parseError.line + ", colonne " + parseError.linepos;
                }
                if (parseError.reason) {
                    errorMsg += ":  " + parseError.reason + ")";
                }
                throw new Error(errorMsg);
            }
            return xmlDoc;
        } else if (window.DOMParser) {
            // les autres (Chrome, Mozilla, IE >= 9)
            parser = new window.DOMParser();
            try {
                xmlDoc = parser.parseFromString(xmlString, "text/xml");
            } catch (e) {
                // Internet Explorer browser raises exception if xmlString is not valid XML
                if (e.message === "SyntaxError") {
                    throw new Error(errorMsg);
                } else {
                    throw new Error("Erreur lors du parsing de la réponse du service : " + e.message);
                }
            }
            // look for parsing error in case no exception was raised
            if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
                var parsererror = xmlDoc.getElementsByTagName("parsererror");
                for (var i = 0; i < parsererror.length; i++) {
                    var content = parsererror[i].innerHTML;
                    // except in case parsererror is just because of huge xml, but parsing is done.
                    if (content.indexOf("Huge input lookup") === -1) {
                        errorMsg += "(" + content + ")";
                        throw new Error(errorMsg);
                    }
                }
            } else if (!xmlDoc.documentElement) { // may happen in chrome browser
                throw new Error(errorMsg);
            }
            return xmlDoc;
        } else {
            // FIXME
            throw new Error("Incompatible DOM Parser pour ce navigateur !");
        }
    }
}

/**
 * Méthode de la classe (privée) permettant de récupérer le noeud racine du document,
 *      à partir d'un document node (nodeType=9), puis lecture de ce noeud (readNode)
 *
 * @private
 * @memberof XML
 * @method __getRootNode
 * @param {DOMElement} [xmlDoc] - a Document Node
 * @return {DOMElement} root - the document root node
 */
function __getRootNode (xmlDoc) {
    var root;
    if (xmlDoc.nodeType === 9) {
        // INFO : nodeType 9 represents the entire document (the root-node of the DOM tree)
        root = xmlDoc.documentElement;
    } else if (xmlDoc.nodeType === 1) {
        root = xmlDoc;
    }
    return root;
}

/**
 * Méthode de la classe (privée) permettant de lire automatiquement un noeud XML,
 *      lorsqu'aucun reader spécifique n'a été spécifié (parser brut)
 *
 * @private
 * @memberof XML
 * @method readDefault
 * @param {DOMElement} node - a DOM element node
 * @example final data object looks like :
 *          data = {
 *              attributeName: attributeValue,
 *              childName: {
 *                  attributeName: attributeValue,
 *                  attributeName: attributeValue,
 *                  childName: {
 *                      "textContent": textContent
 *                  },
 *                  childName: {
 *                      childName: {
 *                          attributeName:attributeValue
 *                      }
 *                  }
 *              }
 *          }
 */
function __readDefault (node) {
    var data = {};

    // if element node has attributes, set their values to data
    if (node.attributes.length > 0) {
        var dataAttributes = __getAttributes(node);
        data["attributes"] = dataAttributes;
    }

    // if element node has childNodes, read them and set them to data
    if (node.hasChildNodes()) {
        var childData = {};
        var child;
        var children = node.childNodes;

        for (var i = 0; i < children.length; i++) {
            child = children[i];

            if (child.nodeType === 3) { // TEXT_NODE
                data["textContent"] = child.nodeValue;
            } else if (child.nodeType === 1) {
                childData = __readDefault(child);

                if (!data[child.nodeName]) {
                    // store childData in an object
                    data[child.nodeName] = childData;
                } else {
                    // in case several childNodes has the same name : store them in an array.
                    // if data[nodeName] already exists but is not an array
                    if (!Array.isArray(data[child.nodeName])) {
                        var old = data[child.nodeName];
                        data[child.nodeName] = [];
                        data[child.nodeName].push(old);
                    }
                    data[child.nodeName].push(childData);
                }
            }
            // TODO : manage other node types (4=CDATA, etc)
        }
    }

    return data;
}

/**
 * Méthode de la classe (privée) permettant de récupérer les attributs d'un noeud élément
 *
 * @private
 * @memberof XML
 * @method __getAttributes
 * @param {DOMElement} node - noeud contenant l'attribut recherché
 * @return {Object} nodeAttributes - objet contenant les noms et valeurs des différents attributs
 */
function __getAttributes (node) {
    if (node.attributes.length > 0) {
        var nodeAttributes = {};
        var attributes = node.attributes;
        for (var i = 0; i < attributes.length; i++) {
            var attribute = attributes[i];
            nodeAttributes[attribute.nodeName] = attribute.nodeValue;
        }
        return nodeAttributes;
    }
}

export default XML;
