
/**
 * Fonction retournant un objet contenant des clés de lecture (readers)
 *      qui permettent de parser des réponses XML du service de géocodage direct du Géoportail
 *      afin de récupérer les résultats retournés.
 * @module DirectGeocodeResponseReader
 * @alias Gp.Services.Geocode.Formats.DirectGeocodeResponseReader
 * @private
 */

// import Logger from "../../../Utils/LoggerByDefault";
import MR from "../../../Utils/MessagesResources";
import ErrSrv from "../../../Exceptions/ErrorService";
import GeocodeResponse from "../Response/model/GeocodeResponse";
import DirectGeocodedLocation from "../Response/model/DirectGeocodedLocation";

/**
 * @member DirectGeocodeResponseReader
 */
var DirectGeocodeResponseReader = {};

/**
 * @property {String} DirectGeocodeResponseReader.VERSION - version du service de géocodage
 */
DirectGeocodeResponseReader.VERSION = "1.2";

/**
 * Objet stockant les différents namespaces et les URI associées
 */
DirectGeocodeResponseReader.NAMESPACES = {
    xmlns : "http://www.opengis.net/xls",
    gml : "http://www.opengis.net/gml",
    xls : "http://www.opengis.net/xls",
    xlsext : "http://www.opengis.net/xlsext",
    xsi : "http://www.w3.org/2001/XMLSchema-instance"
};

/**
 * Localisation (URL) du schema de définition du XML (XSD)
 */
DirectGeocodeResponseReader.SCHEMALOCATION = "http://wxs.ign.fr/schemas/olsAll.xsd";

/**
 * Namespace par défaut du format
 */
DirectGeocodeResponseReader.DEFAULTPREFIX = "xls";

/**
 * Objet contenant des fonctions de lecture, appelées "READERS"
 *      dont chaque clé correspond au nom d'un tag du XML que l'on souhaite lire
 *      et la valeur associée est une fonction (node, data)
 *      où node est un noeud du document DOM
 *      et data est un objet où l'on stocke les informations lues dans le XML.
 */
DirectGeocodeResponseReader.READERS = {

    xls : {

        /** TODO : jsdoc block */
        XLS : function (root) {
            var geocodeResponse = new GeocodeResponse();

            // vérification de la version du service, et des namespaces de l'en-tête
            __checkServiceAttributes(root);

            // puis lancement de la lecture de l'ensemble des noeuds, en bouclant sur les childNodes
            __getChildNodes(root, geocodeResponse);

            return geocodeResponse;
        },

        /** TODO : jsdoc block */
        GeocodedAddress : function (node, geocodeResponse) {
            var geocodedLocation = new DirectGeocodedLocation();

            __getChildNodes(node, geocodedLocation);

            // Ajout du résultat au tableau geocodedLocations de geocodeReponse
            if (geocodeResponse && Array.isArray(geocodeResponse.locations)) {
                geocodeResponse.locations.push(geocodedLocation);
            }
        },

        /** TODO : jsdoc block */
        GeocodeMatchCode : function (node, geocodedLocation) {
            var acc = node.getAttribute("accuracy");
            if (acc && geocodedLocation) {
                geocodedLocation.accuracy = parseFloat(acc);
            }
            var matchType = node.getAttribute("matchType");
            if (matchType && geocodedLocation) {
                geocodedLocation.matchType = matchType;
            }
        },

        /** TODO : jsdoc block */
        Address : function (node, geocodedLocation) {
            var countrycode = node.getAttribute("countryCode");
            if (geocodedLocation && countrycode) {
                geocodedLocation.type = countrycode;
            }
            // on va récupérer les autres informations (StreetAddress, place, postalCode...)
            __getChildNodes(node, geocodedLocation);
        },

        /** TODO : jsdoc block */
        freeFormAddress : function (node, geocodedLocation) {
            if (geocodedLocation && geocodedLocation.hasOwnProperty("placeAttributes")) {
                geocodedLocation.placeAttributes.freeform = __getChildValue(node);
            }
        },

        /** TODO : jsdoc block */
        Building : function (node, geocodedLocation) {
            var num = node.getAttribute("number");
            if (geocodedLocation && geocodedLocation.hasOwnProperty("placeAttributes")) {
                if (num) {
                    geocodedLocation.placeAttributes.number = num;
                } else if (node.getAttribute("buildingName")) {
                    geocodedLocation.placeAttributes.number = node.getAttribute("buildingName");
                } else if (node.getAttribute("subdivision")) {
                    geocodedLocation.placeAttributes.number = node.getAttribute("subdivision");
                }
            }
        },

        /** TODO : jsdoc block */
        Street : function (node, geocodedLocation) {
            if (geocodedLocation && geocodedLocation.hasOwnProperty("placeAttributes")) {
                // in case of a streetAddress result : street represents the street name
                if (geocodedLocation.type === "StreetAddress") {
                    geocodedLocation.placeAttributes.street = __getChildValue(node);

                    // in case of a cadastral parcel result : street represents the cadastral parcel identifier
                } else if (geocodedLocation.type === "CadastralParcel") {
                    geocodedLocation.placeAttributes.cadastralParcel = __getChildValue(node);
                }
            }
        },

        /** TODO : jsdoc block */
        Place : function (node, geocodedLocation) {
            var placeType = node.getAttribute("type");
            var placeName = __getChildValue(node);

            if (geocodedLocation && geocodedLocation.hasOwnProperty("placeAttributes")) {
                if (placeType === "Municipality") {
                    geocodedLocation.placeAttributes.municipality = placeName;
                } else if (placeType === "Bbox") {
                    var values = placeName.split(";");
                    if (values.length === 4) {
                        geocodedLocation.placeAttributes.bbox = {
                            left : parseFloat(values[0]),
                            right : parseFloat(values[2]),
                            top : parseFloat(values[1]),
                            bottom : parseFloat(values[3])
                        };
                    }
                } else if (placeType === "Commune") {
                    geocodedLocation.placeAttributes.commune = placeName;
                } else if (placeType === "Departement") {
                    geocodedLocation.placeAttributes.department = placeName;
                } else if (placeType === "INSEE") {
                    geocodedLocation.placeAttributes.insee = placeName;
                } else if (placeType === "Qualite") {
                    geocodedLocation.placeAttributes.quality = placeName;
                } else if (placeType === "Territoire") {
                    geocodedLocation.placeAttributes.territory = placeName;
                } else if (placeType === "ID") {
                    geocodedLocation.placeAttributes.ID = placeName;
                } else if (placeType === "ID_TR") {
                    geocodedLocation.placeAttributes.IDTR = placeName;
                } else if (placeType === "Importance") {
                    geocodedLocation.placeAttributes.importance = parseInt(placeName, 10);
                } else if (placeType === "Nature") {
                    geocodedLocation.placeAttributes.nature = placeName;
                } else if (placeType === "Numero") {
                    geocodedLocation.placeAttributes.number = placeName;
                } else if (placeType === "Feuille") {
                    geocodedLocation.placeAttributes.sheet = placeName;
                } else if (placeType === "Section") {
                    geocodedLocation.placeAttributes.section = placeName;
                } else if (placeType === "CommuneAbsorbee") {
                    geocodedLocation.placeAttributes.absorbedCity = placeName;
                } else if (placeType === "Arrondissement") {
                    if (placeName) {
                        geocodedLocation.placeAttributes.arrondissement = placeName;
                    }
                } else if (placeType === "Type") {
                    geocodedLocation.placeAttributes.origin = placeName;
                } else if (placeType === "Prefecture") {
                    geocodedLocation.placeAttributes.prefecture = placeName;
                } else if (placeType === "InseeRegion") {
                    geocodedLocation.placeAttributes.inseeRegion = placeName;
                } else if (placeType === "InseeDepartment") {
                    geocodedLocation.placeAttributes.inseeDepartment = placeName;
                }
            }
        },

        /** TODO : jsdoc block */
        PostalCode : function (node, geocodedLocation) {
            if (geocodedLocation && geocodedLocation.hasOwnProperty("placeAttributes")) {
                geocodedLocation.placeAttributes.postalCode = __getChildValue(node);
            }
        },

        /** TODO : jsdoc block */
        Error : function (node) {
            // on imagine qu'on a une balise ainsi :
            // <Error message="Message..." errorCode="InternalServerError"/>
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
        pos : function (node, geocodedLocation) {
            var pos = __getChildValue(node);
            if (geocodedLocation && pos) {
                geocodedLocation.position = {
                    x : parseFloat(pos.split(" ")[0]),
                    y : parseFloat(pos.split(" ")[1])
                };
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
                    response.exceptionReport = DirectGeocodeResponseReader.READERS["Exception"](child);
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
 * @method DirectGeocodeResponseReader.read
 * @param {DOMElement} root - racine de la réponse XML à lire
 * @return {Object} geocodeResponse|exceptionReport : l'objet contenant les informations de la réponse XML,
 *      sous la forme d'un objet GeocodeResponse, ou un objet littéral exceptionReport si le service a renvoyé une exception.
 * @static
 * @memberof DirectGeocodeResponseReader
 */
DirectGeocodeResponseReader.read = function (root) {
    if (root.nodeName === "XLS") {
        var nsPrefix = root.prefix;
        if (!nsPrefix) {
            nsPrefix = DirectGeocodeResponseReader.DEFAULTPREFIX;
        }
        var geocodeResponse = DirectGeocodeResponseReader.READERS[nsPrefix][root.nodeName](root);
        return geocodeResponse;
    } else if (root.nodeName === "ExceptionReport") {
        var exceptionReport = DirectGeocodeResponseReader.READERS[root.nodeName](root);
        return exceptionReport;
    } else {
        var mess = MR.getMessage("SERVICE_RESPONSE_ANALYSE", root.nodeName);
        throw new ErrSrv({
            message : mess,
            type : ErrSrv.TYPE_UNKERR,
            status : 200
        });
    }
};

/**
 * Récupération des attributs d'un noeud élément
 *
 * @private
 * @memberof DirectGeocodeResponseReader
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
 * @memberof DirectGeocodeResponseReader
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
                childPrefix = child.prefix || DirectGeocodeResponseReader.DEFAULTPREFIX;

                if (DirectGeocodeResponseReader.READERS[childPrefix][childName]) {
                    var reader = DirectGeocodeResponseReader.READERS[childPrefix][childName];
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
 * @memberof DirectGeocodeResponseReader
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
 * @memberof DirectGeocodeResponseReader
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
                    if (xlsAttributes["version"] !== DirectGeocodeResponseReader.VERSION) {
                        console.log("[DirectGeocodeResponseReader] geocode version is not the expected one : there may be errors in parsing");
                        return;
                    }
                }

                // on vérifie que l'uri du namespace par défaut est bien celle que l'on attend
                if (att === "xmlns") {
                    if (xlsAttributes[att] !== DirectGeocodeResponseReader.NAMESPACES[DirectGeocodeResponseReader.DEFAULTPREFIX]) {
                        console.log("[DirectGeocodeResponseReader] geocode response default namespace is not the expected one");
                        return;
                    }
                    continue;
                }

                var prefix = att.split(":")[0];
                var ns = att.split(":")[1];

                // si on a un autre xmlns, on vérifie aussi les URI
                if (prefix === "xmlns" && ns) {
                    // si l'attribut correspond à un namespace défini dans le reader
                    if (DirectGeocodeResponseReader.NAMESPACES[ns]) {
                        // il faut que les URI correspondent aussi.
                        if (DirectGeocodeResponseReader.NAMESPACES[ns] !== xlsAttributes[att]) {
                            console.log("[DirectGeocodeResponseReader] geocode response " + att + " namespace is not the expected one");
                            return;
                        }
                    }
                }

                // pour finir on vérifie la localisation du schema XSD du service
                if (ns === "schemaLocation") {
                    if (DirectGeocodeResponseReader.SCHEMALOCATION !== xlsAttributes[att]) {
                        console.log("[DirectGeocodeResponseReader] geocode response schema location is not the expected one");
                        return;
                    }
                }
            }
        }
    }
}

export default DirectGeocodeResponseReader;
