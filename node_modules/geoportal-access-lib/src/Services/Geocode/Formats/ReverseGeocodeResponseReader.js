
/**
 * Fonction retournant un objet contenant des clés de lecture (readers)
 *      qui permettent de parser des réponses XML du service de géocodage inverse du Géoportail
 *      afin de récupérer les résultats retournés.
 * @module ReverseGeocodeResponseReader
 * @alias Gp.Services.Geocode.Formats.ReverseGeocodeResponseReader
 * @private
 */

// import Logger from "../../../Utils/LoggerByDefault";
import MR from "../../../Utils/MessagesResources";
import ErrSrv from "../../../Exceptions/ErrorService";
import ReverseGeocodeResponse from "../Response/model/GeocodeResponse";
import ReverseGeocodedLocation from "../Response/model/ReverseGeocodedLocation";

/**
 * Objet ReverseGeocodeResponseReader
 * @member {Object} ReverseGeocodeResponseReader
 *
 * @property {String} ReverseGeocodeResponseReader.VERSION - Version du service de géocodage
 *
 * @property {Object} ReverseGeocodeResponseReader.NAMESPACES - Objet stockant les différents namespaces et les URI associées
 *
 * @property {String} ReverseGeocodeResponseReader.SCHEMALOCATION - Localisation (URL) du schema de définition du XML (XSD)
 *
 * @property {String} ReverseGeocodeResponseReader.DEFAULTPREFIX - Namespace par défaut du format
 *
 * @property {Object} ReverseGeocodeResponseReader.READERS - Objet contenant des fonctions de lecture, appelées "READERS"
 *      dont chaque clé correspond au nom d'un tag du XML que l'on souhaite lire
 *      et la valeur associée est une fonction (node, data)
 *      où node est un noeud du document DOM
 *      et data est un objet où l'on stocke les informations lues dans le XML.
 *
 * @property {Method} ReverseGeocodeResponseReader.read - Méthode permettant de lancer la lecture d'une réponse XML du service de géocodage,
 *      à l'aide des READERS de la classe.
 *
 */

var ReverseGeocodeResponseReader = {};

/**
 * version du service de géocodage
 */
ReverseGeocodeResponseReader.VERSION = "1.2";

/**
 * Objet stockant les différents namespaces et les URI associées
 */
ReverseGeocodeResponseReader.NAMESPACES = {
    xmlns : "http://www.opengis.net/xls",
    gml : "http://www.opengis.net/gml",
    xls : "http://www.opengis.net/xls",
    xlsext : "http://www.opengis.net/xlsext",
    xsi : "http://www.w3.org/2001/XMLSchema-instance"
};

/**
 * Localisation (URL) du schema de définition du XML (XSD)
 */
ReverseGeocodeResponseReader.SCHEMALOCATION = "http://wxs.ign.fr/schemas/olsAll.xsd";

/**
 * Namespace par défaut du format
 */
ReverseGeocodeResponseReader.DEFAULTPREFIX = "xls";

/**
 * Objet contenant des fonctions de lecture, appelées "READERS"
 *      dont chaque clé correspond au nom d'un tag du XML que l'on souhaite lire
 *      et la valeur associée est une fonction (node, data)
 *      où node est un noeud du document DOM
 *      et data est un objet où l'on stocke les informations lues dans le XML.
 */
ReverseGeocodeResponseReader.READERS = {

    xls : {

        /** TODO : jsdoc block */
        XLS : function (root) {
            var reverseGeocodeResponse = new ReverseGeocodeResponse();

            // vérification de la version du service, et des namespaces de l'en-tête
            __checkServiceAttributes(root);

            // puis lancement de la lecture de l'ensemble des noeuds, en bouclant sur les childNodes
            __getChildNodes(root, reverseGeocodeResponse);

            return reverseGeocodeResponse;
        },

        /** TODO : jsdoc block */
        ReverseGeocodedLocation : function (node, reverseGeocodeResponse) {
            var reverseGeocodedLocation = new ReverseGeocodedLocation();

            __getChildNodes(node, reverseGeocodedLocation);

            // Ajout du résultat au tableau locations de reverseGeocodeResponse
            if (reverseGeocodeResponse && Array.isArray(reverseGeocodeResponse.locations)) {
                reverseGeocodeResponse.locations.push(reverseGeocodedLocation);
            }
        },

        /** TODO : jsdoc block */
        Address : function (node, reverseGeocodedLocation) {
            var countrycode = node.getAttribute("countryCode");
            if (reverseGeocodedLocation && countrycode) {
                reverseGeocodedLocation.type = countrycode;
            }
            // on va récupérer les autres informations (StreetAddress, place, postalCode...)
            __getChildNodes(node, reverseGeocodedLocation);
        },

        /** TODO : jsdoc block */
        Building : function (node, reverseGeocodedLocation) {
            var num = node.getAttribute("number");
            if (reverseGeocodedLocation && reverseGeocodedLocation.hasOwnProperty("placeAttributes")) {
                if (num) {
                    reverseGeocodedLocation.placeAttributes.number = num;
                } else if (node.getAttribute("buildingName")) {
                    reverseGeocodedLocation.placeAttributes.number = node.getAttribute("buildingName");
                } else if (node.getAttribute("subdivision")) {
                    reverseGeocodedLocation.placeAttributes.number = node.getAttribute("subdivision");
                }
            }
        },

        /** TODO : jsdoc block */
        Street : function (node, reverseGeocodedLocation) {
            // in case of a streetAddress result : street represents the street name
            if (reverseGeocodedLocation.type === "StreetAddress") {
                reverseGeocodedLocation.placeAttributes.street = __getChildValue(node);

                // in case of a cadastral parcel result : street represents the cadastral parcel identifier
            } else if (reverseGeocodedLocation.type === "CadastralParcel") {
                reverseGeocodedLocation.placeAttributes.cadastralParcel = __getChildValue(node);
            }
        },

        /** TODO : jsdoc block */
        Place : function (node, reverseGeocodedLocation) {
            var placeType = node.getAttribute("type");
            var placeName = __getChildValue(node);

            if (reverseGeocodedLocation && reverseGeocodedLocation.hasOwnProperty("placeAttributes")) {
                if (placeType === "Municipality") {
                    reverseGeocodedLocation.placeAttributes.municipality = placeName;
                } else if (placeType === "Bbox") {
                    var values = placeName.split(";");
                    if (values.length === 4) {
                        reverseGeocodedLocation.placeAttributes.bbox = {
                            left : parseFloat(values[0]),
                            right : parseFloat(values[2]),
                            top : parseFloat(values[1]),
                            bottom : parseFloat(values[3])
                        };
                    }
                } else if (placeType === "Commune") {
                    reverseGeocodedLocation.placeAttributes.commune = placeName;
                } else if (placeType === "Departement") {
                    reverseGeocodedLocation.placeAttributes.department = placeName;
                } else if (placeType === "INSEE") {
                    reverseGeocodedLocation.placeAttributes.insee = placeName;
                } else if (placeType === "Qualite") {
                    reverseGeocodedLocation.placeAttributes.quality = placeName;
                } else if (placeType === "Territoire") {
                    reverseGeocodedLocation.placeAttributes.territory = placeName;
                } else if (placeType === "ID") {
                    reverseGeocodedLocation.placeAttributes.ID = placeName;
                } else if (placeType === "ID_TR") {
                    reverseGeocodedLocation.placeAttributes.IDTR = placeName;
                } else if (placeType === "Importance") {
                    reverseGeocodedLocation.placeAttributes.importance = parseInt(placeName, 10);
                } else if (placeType === "Nature") {
                    reverseGeocodedLocation.placeAttributes.nature = placeName;
                } else if (placeType === "Numero") {
                    reverseGeocodedLocation.placeAttributes.number = placeName;
                } else if (placeType === "Feuille") {
                    reverseGeocodedLocation.placeAttributes.sheet = placeName;
                } else if (placeType === "Section") {
                    reverseGeocodedLocation.placeAttributes.section = placeName;
                } else if (placeType === "CommuneAbsorbee") {
                    reverseGeocodedLocation.placeAttributes.absorbedCity = placeName;
                } else if (placeType === "Arrondissement") {
                    if (placeName) {
                        reverseGeocodedLocation.placeAttributes.arrondissement = placeName;
                    }
                } else if (placeType === "Type") {
                    reverseGeocodedLocation.placeAttributes.origin = placeName;
                } else if (placeType === "Prefecture") {
                    reverseGeocodedLocation.placeAttributes.prefecture = placeName;
                } else if (placeType === "InseeRegion") {
                    reverseGeocodedLocation.placeAttributes.inseeRegion = placeName;
                } else if (placeType === "InseeDepartment") {
                    reverseGeocodedLocation.placeAttributes.inseeDepartment = placeName;
                }
            }
        },

        /** TODO : jsdoc block */
        PostalCode : function (node, reverseGeocodedLocation) {
            if (reverseGeocodedLocation && reverseGeocodedLocation.hasOwnProperty("placeAttributes")) {
                reverseGeocodedLocation.placeAttributes.postalCode = __getChildValue(node);
            }
        },

        /** TODO : jsdoc block */
        SearchCentreDistance : function (node, reverseGeocodedLocation) {
            if (reverseGeocodedLocation) {
                reverseGeocodedLocation.searchCenterDistance = parseFloat(node.getAttribute("value"));
            }
        },

        /** TODO : jsdoc block */
        Error : function (node) {
            // <Error message="For input string : &quot;2,45&quot;" errorCode="InternalServerError"/>
            var srvMess = node.getAttribute("message");
            var errorCode = node.getAttribute("errorCode");
            var message = MR.getMessage("SERVICE_RESPONSE_EXCEPTION",
                "(" + errorCode + ") : " + srvMess);
            throw new ErrSrv({
                message : message,
                type : ErrSrv.TYPE_SRVERR
            });
        }
    },

    gml : {

        /** TODO : jsdoc block */
        pos : function (node, reverseGeocodedLocation) {
            var pos = __getChildValue(node);
            if (reverseGeocodedLocation && pos) {
                reverseGeocodedLocation.position = {
                    x : parseFloat(pos.split(" ")[0]),
                    y : parseFloat(pos.split(" ")[1])
                };
            }
        }
    },

    xlsext : {
        /** TODO : jsdoc block */
        ExtendedGeocodeMatchCode : function (node, reverseGeocodedLocation) {
            if (reverseGeocodedLocation) {
                reverseGeocodedLocation.matchType = __getChildValue(node);
            }
        }
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
                    response.exceptionReport = ReverseGeocodeResponseReader.READERS["Exception"](child);
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

/**
 * Méthode permettant de lancer la lecture d'une réponse XML du service de géocodage,
 *      à l'aide des READERS de la classe.
 *
 * @method ReverseGeocodeResponseReader.read
 * @param {DOMElement} root - racine de la réponse XML à lire
 * @return {Object} geocodeResponse|exceptionReport : l'objet contenant les informations de la réponse XML,
 *      sous la forme d'un objet GeocodeResponse, ou un objet littéral exceptionReport si le service a renvoyé une exception.
 * @static
 * @memberof ReverseGeocodeResponseReader
 */
ReverseGeocodeResponseReader.read = function (root) {
    if (root.nodeName === "XLS") {
        var nsPrefix = root.prefix;
        if (!nsPrefix) {
            nsPrefix = ReverseGeocodeResponseReader.DEFAULTPREFIX;
        }
        var geocodeResponse = ReverseGeocodeResponseReader.READERS[nsPrefix][root.nodeName](root);
        return geocodeResponse;
    } else if (root.nodeName === "ExceptionReport") {
        var exceptionReport = ReverseGeocodeResponseReader.READERS[root.nodeName](root);
        return exceptionReport;
    } else {
        throw new Error("Erreur lors de la lecture de la réponse : elle n'est pas au format attendu.");
    }
};

/**
 * Récupération des attributs d'un noeud élément
 *
 * @private
 * @memberof ReverseGeocodeResponseReader
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

/**
 * Récupération des noeuds enfants à partir d'un noeud donné, pour lecture (readNode).
 *
 * @private
 * @memberof ReverseGeocodeResponseReader
 * @method __getChildNodes
 * @param {DOMElement} node - a DOM node
 * @param {Array|Object} [data] - an object to be filled with node data
 */
function __getChildNodes (node, data) {
    if (node.hasChildNodes()) {
        var children = node.childNodes;
        var child;
        var childName;
        var childPrefix;

        for (var i = 0; i < children.length; i++) {
            child = children[i];

            if (child.nodeType === 1) { // 1 === node.ELEMENT_NODE
                childName = child.localName || child.baseName || child.nodeName;
                childPrefix = child.prefix || ReverseGeocodeResponseReader.DEFAULTPREFIX;

                if (ReverseGeocodeResponseReader.READERS[childPrefix][childName]) {
                    var reader = ReverseGeocodeResponseReader.READERS[childPrefix][childName];
                    reader(child, data);
                } else {
                    __getChildNodes(child, data);
                }
            }
        }
    }
}

/**
 * Lecture de la valeur du premier child d'un noeud, si elle existe.
 *
 * @private
 * @memberof ReverseGeocodeResponseReader
 * @method __getChildValue
 * @param {DOMElement} node - a DOM node
 * @return {String} value - valeur du firstChild du noeud en entrée, ou chaîne vide.
 */
function __getChildValue (node) {
    var textNode;
    var value = "";

    if (node.hasChildNodes()) {
        textNode = node.firstChild;
        if (textNode.nodeType === 3) { // 3 === node.TEXT_NODE
            value = textNode.nodeValue;
        }
    }
    return value;
}

/**
 * Vérification des attributs du service, dans la balise XLS de la réponse :
 *      version, namespaces, et namespace par défaut doivent correspondre à ceux attendus.
 *
 * @private
 * @memberof ReverseGeocodeResponseReader
 * @method __checkServiceAttributes
 * @param {DOMElement} XLSNode - a DOM node, corresponding to XLS first tag.
 */
function __checkServiceAttributes (XLSNode) {
    if (XLSNode.attributes.length > 0) {
        // on récupère et parcourt les attributs de la balise XLS de la réponse
        var xlsAttributes = __getAttributes(XLSNode);
        for (var att in xlsAttributes) {
            if (xlsAttributes.hasOwnProperty(att)) {
                // vérification de la version
                if (att === "version") {
                    if (xlsAttributes["version"] !== ReverseGeocodeResponseReader.VERSION) {
                        console.log("[ReverseGeocodeResponseReader] geocode version is not the expected one : there may be errors in parsing");
                        return;
                    }
                }

                // on vérifie que l'uri du namespace par défaut est bien celle que l'on attend
                if (att === "xmlns") {
                    if (xlsAttributes[att] !== ReverseGeocodeResponseReader.NAMESPACES[ReverseGeocodeResponseReader.DEFAULTPREFIX]) {
                        console.log("[ReverseGeocodeResponseReader] geocode response default namespace is not the expected one");
                        return;
                    }
                    continue;
                }

                var prefix = att.split(":")[0];
                var ns = att.split(":")[1];

                // si on a un autre xmlns, on vérifie aussi les URI
                if (prefix === "xmlns" && ns) {
                    // si l'attribut correspond à un namespace défini dans le reader
                    if (ReverseGeocodeResponseReader.NAMESPACES[ns]) {
                        // il faut que les URI correspondent aussi.
                        if (ReverseGeocodeResponseReader.NAMESPACES[ns] !== xlsAttributes[att]) {
                            console.log("[ReverseGeocodeResponseReader] geocode response " + att + " namespace is not the expected one");
                            return;
                        }
                    }
                }

                // pour finir on vérifie la localisation du schema XSD du service
                if (ns === "schemaLocation") {
                    if (ReverseGeocodeResponseReader.SCHEMALOCATION !== xlsAttributes[att]) {
                        console.log("[ReverseGeocodeResponseReader] geocode response schema location is not the expected one");
                        return;
                    }
                }
            }
        }
    }
}

export default ReverseGeocodeResponseReader;
