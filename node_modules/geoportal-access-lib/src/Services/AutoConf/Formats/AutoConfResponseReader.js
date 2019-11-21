
/**
 * Fonction retournant un objet contenant des clés de lecture (readers)
 *      qui permettent de parser des réponses XML du service d'autoconfiguration du Géoportail
 *      afin de récupérer les informations retournées.
 * @module AutoConfResponseReader
 * @private
 * @alias Gp.Services.AutoConf.Formats.AutoConfResponseReader
 */

// import Logger from "../../../Utils/LoggerByDefault";
import AutoConfResponse from "../Response/model/AutoConfResponse";
import Constraint from "../Response/model/Constraint";
import Format from "../Response/model/Format";
import Layer from "../Response/model/Layer";
import Legend from "../Response/model/Legend";
import Metadata from "../Response/model/Metadata";
import Originator from "../Response/model/Originator";
import Service from "../Response/model/Service";
import Style from "../Response/model/Style";
import Territory from "../Response/model/Territory";
import Thematic from "../Response/model/Thematic";
import TileMatrixSet from "../Response/model/TileMatrixSet";
import TileMatrix from "../Response/model/TileMatrix";
import TileMatrixLimit from "../Response/model/TileMatrixLimit";

var AutoConfResponseReader = {};

/**
 * version du service d'autoconf
 */
AutoConfResponseReader.VERSION = "1.1.0";

/**
 * Objet stockant les différents namespaces et les URI associées
 */
AutoConfResponseReader.NAMESPACES = {
    xmlns : "http://www.opengis.net/context",
    gpp : "http://api.ign.fr/geoportail",
    ows : "http://www.opengis.net/ows/1.1",
    sld : "http://www.opengis.net/sld",
    wmts : "http://www.opengis.net/wmts/1.0",
    xlink : "http://www.w3.org/1999/xlink",
    xsi : "http://www.w3.org/2001/XMLSchema-instance"
};

/**
 * Localisation (URL) du schema de définition du XML (XSD)
 */
AutoConfResponseReader.SCHEMALOCATION = [
    "http://www.opengis.net/context http://wxs.ign.fr/schemas/extContext.xsd http://api.ign.fr/geoportail http://wxs.ign.fr/schemas/autoconf/autoconf.xsd",
    "http://www.opengis.net/context http://wxs.ign.fr/schemas/extContext.xsd http://api.ign.fr/geoportail http://wxs.ign.fr/schemas/autoconf.xsd"
];

/**
 * Namespace par défaut du format
 */
AutoConfResponseReader.DEFAULTPREFIX = "context";

/**
 * Objet contenant des fonctions de lecture, appelées "READERS"
 *      dont chaque clé correspond au nom d'un tag du XML que l'on souhaite lire
 *      et la valeur associée est une fonction (node, data)
 *      où node est un noeud du document DOM
 *      et data est un objet où l'on stocke les informations lues dans le XML.
 */
AutoConfResponseReader.READERS = {

    context : {

        /** ViewContext */
        ViewContext : function (viewContextNode) {
            // info : balise "racine" de la réponse de l'autoconf

            // vérification de la version du service, et des namespaces de l'en-tête
            __checkServiceAttributes(viewContextNode);

            // create AutoConfResponse
            var config = new AutoConfResponse();

            __getChildNodes(viewContextNode, config);

            return config;
        },

        // info : /General/Title
        // ou : /LayerList/Layer/Title
        /** Title */
        Title : function (titleNode, data) {
            if (data && data.generalOptions) { // cas de la variable config générale
                data.generalOptions.title = __getChildValue(titleNode);
            } else if (data && data.lyr) { // cas d'une layer
                data.lyr.title = __getChildValue(titleNode);
            }
        },

        // info : /LayerList/Layer/Abstract
        /** Abstract */
        Abstract : function (node, data) {
            if (data && data.lyr) {
                data.lyr.description = __getChildValue(node);
            }
        },

        // info : /General/Extension/gpp:General/gpp:Services/Server
        // ou : /LayerList/Server
        /** Server */
        Server : function (node, data) {
            var serverId = node.getAttribute("service");
            var title = node.getAttribute("title");
            var version = node.getAttribute("version");
            if (serverId) {
                if (data && data.services && typeof data.services === "object" && !data.services[serverId]) {
                    // on est dans la balise Services
                    var s = new Service();
                    s.title = title;
                    s.version = version;
                    // récupération de l'url du service, dans une balise enfant "OnlineResource"
                    __getChildNodes(node, s);
                    // ajout du service à la variable config
                    data.services[serverId] = s;
                } else if (data && data.lyr) {
                    // on est dans la balise Layer
                    if (!data.lyr.serviceParams) {
                        // si l'objet serviceParams n'a pas encore été créé, on le crée.
                        data.lyr.serviceParams = {};
                    }
                    data.lyr.serviceParams.id = serverId;
                    data.lyr.serviceParams.version = version;
                }
            }
        },

        // info : /General/Extension/gpp:General/gpp:Services/Server/OnlineResource
        // ou : /LayerList/Layer/Server/OnlineResource
        // ou : /LayerList/Layer/Extention/gpp:Layer/gpp:QuickLook/OnlineResource
        // ou : /LayerList/Layer/Extension/gpp:Layer/gpp:Legends/gpp:Legend/gpp:LegendURL/OnlineResource
        // ou : /LayerList/Layer/Extension/gpp:Layer/gpp:MetadataURL/OnlineResource
        /** OnlineResource */
        OnlineResource : function (node, service) {
            if (service && service.hasOwnProperty("serverUrl")) {
                service.serverUrl = node.getAttribute("xlink:href");
            }
        },

        // info : /LayerList
        /** LayerList */
        LayerList : function (layerListNode, config) {
            // liste de balises "layer"
            __getChildNodes(layerListNode, config);

            if (config && config.layers && config.generalOptions && config.services) {
                // récupération des clés et des couches associées
                for (var lyr in config.layers) {
                    if (config.layers.hasOwnProperty(lyr)) {
                        var layerConfig = config.layers[lyr];

                        // récupération de la clé associée
                        var apiKeys = layerConfig.apiKeys;
                        if (apiKeys && Array.isArray(apiKeys)) {
                            for (var i = 0; i < apiKeys.length; i++) {
                                // pour chaque clé API, on ajoute la couche
                                var key = apiKeys[i];
                                if (config.generalOptions.apiKeys) {
                                    if (!config.generalOptions.apiKeys[key] || !Array.isArray(config.generalOptions.apiKeys[key])) {
                                        config.generalOptions.apiKeys[key] = [];
                                    }
                                    config.generalOptions.apiKeys[key].push(lyr);
                                }
                            }
                        }

                        // récupération du service associé
                        var serviceParams = layerConfig.serviceParams;
                        if (serviceParams && serviceParams.id) {
                            if (!config.services[serviceParams.id]) {
                                var s = new Service();
                                if (serviceParams.serverUrl) {
                                    s.serverUrl = serviceParams.serverUrl;
                                }
                                if (serviceParams.version) {
                                    s.version = serviceParams.version;
                                }
                                config.services[serviceParams.id] = s;
                            }
                        }

                        // récupération de la projection associée (dans le cas d'une couche WMTS)
                        if (layerConfig.wmtsOptions && layerConfig.wmtsOptions.tileMatrixSetLink && config.tileMatrixSets) {
                            var tmsLink = layerConfig.wmtsOptions.tileMatrixSetLink;
                            var tileMatrixSets = config.tileMatrixSets;
                            for (var tms in tileMatrixSets) {
                                if (tileMatrixSets.hasOwnProperty(tms) && tms === tmsLink) {
                                    layerConfig.defaultProjection = tileMatrixSets[tms].projection;
                                }
                            }
                        }
                    }
                }
            }
        },

        // info : /LayerList/Layer
        /** Layer */
        Layer : function (layerNode, config) {
            if (config && config.layers) {
                var lyrData = {
                    lyr : new Layer(),
                    lyrId : null
                };

                var hidden = layerNode.getAttribute("hidden");
                if (hidden === "1") {
                    lyrData.lyr.hidden = true;
                } else {
                    lyrData.lyr.hidden = false;
                }

                var queryable = layerNode.getAttribute("queryable");
                if (queryable === "1") {
                    lyrData.lyr.queryable = true;
                } else {
                    lyrData.lyr.queryable = false;
                }

                // on peut avoir les balises : Server, Name, Title, Abstract, DataURL, MetadataURL,
                // sld:MinScaleDenominator, sld:MaxScaleDenominator, SRS, FormatList, StyleList
                // DimensionList, Extension
                __getChildNodes(layerNode, lyrData);

                // si on a bien récupéré l'identifiant de la couche, on s'en sert pour l'ajouter au tableau associatif des couches disponibles
                if (lyrData.lyrId) {
                    // Dans le cas des services, on modifie le contexte de l'identifiant.
                    if (lyrData.lyr.serviceParams && lyrData.lyr.serviceParams.id) {
                        var serviceid = lyrData.lyr.serviceParams.id;
                        if (serviceid.toUpperCase().indexOf("OPENLS") !== -1 || serviceid.toUpperCase().indexOf("ELEVATION") !== -1) {
                            // Il faut changer l'identifiant de la ressource.
                            var resourceId = lyrData.lyrId.split("$")[0];
                            lyrData.lyrId = resourceId + "$" + serviceid;
                        }
                    }

                    // on ajoute l'information dans les attributs de la couche
                    lyrData.lyr.layerId = lyrData.lyrId;
                    // et dans le tableau Gp.Config.layers
                    config.layers[lyrData.lyrId] = lyrData.lyr;
                }
            }
        },

        // info : /LayerList/Layer/Name
        /** TODO : jsdoc block */
        Name : function (node, lyrData) {
            if (lyrData && lyrData.lyr) {
                lyrData.lyr.name = __getChildValue(node);
            }
        },

        // info : /LayerList/Layer/SRS (dans le cas des couches WMS ou WFS)
        /** TODO : jsdoc block */
        SRS : function (node, lyrData) {
            // on récupère la projection de la couche (SRS)
            if (lyrData && lyrData.lyr) {
                lyrData.lyr.defaultProjection = __getChildValue(node);
            }
        },

        // info : /LayerList/Layer/FormatList/Format
        /** TODO : jsdoc block */
        Format : function (node, lyrData) {
            if (lyrData && lyrData.lyr) {
                var f = new Format();
                var current = node.getAttribute("current");
                if (current === "1") {
                    f.current = true;
                } else {
                    f.current = false;
                }
                f.name = __getChildValue(node);
                // si on n'a pas encore ajouté de format, on crée le tableau vide
                if (!lyrData.lyr.formats || !Array.isArray(lyrData.lyr.formats)) {
                    lyrData.lyr.formats = [];
                }
                lyrData.lyr.formats.push(f);
            }
        },

        // info : /LayerList/Layer/StyleList/Style
        /** TODO : jsdoc block */
        Style : function (node, lyrData) {
            if (lyrData && lyrData.lyr) {
                var s = new Style();
                var current = node.getAttribute("current");
                if (current === "1" || current === 1) {
                    s.current = true;
                } else {
                    s.current = false;
                }
                if (node.hasChildNodes) {
                    var children = node.childNodes;
                    var child;
                    var childName;
                    for (var i = 0; i < children.length; i++) {
                        child = children[i];
                        if (child.nodeType === 1) { // 1 === node.ELEMENT_NODE
                            childName = child.localName || child.baseName || child.nodeName;
                            if (childName === "Name") {
                                s.name = __getChildValue(child);
                            } else if (childName === "Title") {
                                s.title = __getChildValue(child);
                            } else if (childName === "URL") {
                                s.url = __getChildValue(child);
                            }
                        }
                    }
                }
                // si on n'a pas encore ajouté de style, on crée le tableau vide
                if (!lyrData.lyr.styles || !Array.isArray(lyrData.lyr.styles)) {
                    lyrData.lyr.styles = [];
                }
                lyrData.lyr.styles.push(s);
            }
        },

        // info : /LayerList/Layer/DimensionList/Dimension
        /** TODO : jsdoc block */
        Dimension : function (node, lyrData) {
            // possède des attributs obligatoires : name, units, unitSymbol et userValue
            // et d'autres attributs facultatifs : default, multipleValues, nearestValue, current
            var name = node.getAttribute("name");
            var dim = __getChildValue(node);
            if (lyrData && lyrData.lyr) {
                // si on n'a pas encore ajouté de dimension, on crée l'objet vide
                if (!lyrData.lyr.dimensions) {
                    lyrData.lyr.dimensions = {};
                }
                if (name === "Type") {
                    lyrData.lyr.dimensions.type = dim;
                } else if (name === "VisibilityRange") {
                    lyrData.lyr.dimensions.visibilityRange = dim;
                } else if (name === "VisibilityMode ") {
                    lyrData.lyr.dimensions.visibilityMode = dim;
                } else if (name === "GeometricType") {
                    lyrData.lyr.dimensions.geometricType = dim;
                } else if (name === "NoDataValue") {
                    lyrData.lyr.dimensions.noDataValue = dim;
                }
            }
        }

    },

    gpp : {

        // info : /General/Extension/gpp:General/gpp:Theme
        /** TODO : jsdoc block */
        Theme : function (themeNode, config) {
            if (config && config.generalOptions && config.generalOptions.hasOwnProperty("theme")) {
                config.generalOptions.theme = __getChildValue(themeNode);
            }
        },

        // info : /General/Extension/gpp:General/gpp:defaultGMLGFIStyleUrl
        /** TODO : jsdoc block */
        defaultGMLGFIStyleUrl : function (node, config) {
            if (config && config.generalOptions && config.generalOptions.hasOwnProperty("defaultGMLGFIStyle")) {
                config.generalOptions.defaultGMLGFIStyle = __getChildValue(node);
            }
        },

        // info : /General/Extension/gpp:General/gpp:Territories/gpp:Territory
        /** TODO : jsdoc block */
        Territory : function (territoryNode, config) {
            // info : Information to configure the API for this territory
            var tid = territoryNode.getAttribute("id");
            if (tid) {
                // create a new Territory
                var t = new Territory();

                var isDefault = territoryNode.getAttribute("default");
                if (isDefault === "1") {
                    t.isDefault = true;
                } else {
                    t.isDefault = false;
                }
                // read territory informations
                __getChildNodes(territoryNode, t);
                // add territory to config
                if (config && config.territories && typeof config.territories === "object") {
                    config.territories[tid] = t;
                }
            }
        },

        // info : /General/Extension/gpp:General/gpp:Territories/gpp:Territory/gpp:defaultCRS
        /** TODO : jsdoc block */
        defaultCRS : function (node, territory) {
            // info : Identifier for the default Coordinate Reference System (CRS).
            if (territory && territory.hasOwnProperty("defaultCRS")) {
                territory.defaultCRS = __getChildValue(node);
            }
        },

        // info : /General/Extension/gpp:General/gpp:Territories/gpp:Territory/gpp:AdditionalCRS
        // ou : /LayerList/Extension/gpp:Layer/gpp:AdditionalCRS
        /** TODO : jsdoc block */
        AdditionalCRS : function (node, data) {
            // info : Identifier for additional Coordinate Reference System (CRS).
            // info : data peut être une instance de Territory.js, ou une instance de Layer.js
            var addCRS = __getChildValue(node);
            if (addCRS && data) {
                if (Array.isArray(data.additionalCRS)) { // cas d'un territoire
                    data.additionalCRS.push(addCRS);
                } else { // cas d'une couche
                    // si le tableau n'est pas encore créé
                    if (!data.additionalProjections || !Array.isArray(data.additionalProjections)) {
                        data.additionalProjections = [];
                    }
                    data.additionalProjections.push(addCRS);
                }
            }
        },

        // info : /General/Extension/gpp:General/gpp:Territories/gpp:Territory/gpp:DefaultLayer
        /** TODO : jsdoc block */
        DefaultLayer : function (node, territory) {
            var lyr = node.getAttribute("layerId");
            if (lyr && territory && Array.isArray(territory.defaultLayers)) {
                territory.defaultLayers.push(lyr);
            }
        },

        // info : /General/Extension/gpp:General/gpp:Territories/gpp:Territory/gpp:BoundingBox
        // ou : /LayerList/Extension/gpp:Layer/gpp:BoundingBox
        // ou : /LayerList/Layer/Extension/gpp:Layer/gpp:Constraints/gpp:Constraint/gpp:BoundingBox
        // ou : /LayerList/Extension/gpp:Layer/gpp:Originators/gpp:Originator/gpp:Constraints/gpp:Constraint/gpp:BoundingBox
        /** TODO : jsdoc block */
        BoundingBox : function (node, data) {
            if (data) {
                var values = __getChildValue(node).split(",");
                if (values.length === 4) {
                    // get bbox coordinates (wgs84)
                    var bbox = {
                        left : parseFloat(values[0]),
                        right : parseFloat(values[2]),
                        top : parseFloat(values[3]),
                        bottom : parseFloat(values[1])
                    };
                    // get temporal extent params (constraint or layer)
                    var minT = node.getAttribute("minT");
                    var maxT = node.getAttribute("maxT");

                    if (data.hasOwnProperty("geoBBOX")) { // cas d'un territoire
                        data.geoBBOX = bbox;
                    } else if (data.hasOwnProperty("bbox")) { // cas d'une constraint
                        if (data.bbox.left || data.bbox.right || data.bbox.top || data.bbox.bottom) {
                            // si on a déjà une bbox, il faut stocker d'autres contraintes
                            if (!data.multiConstraints) {
                                data.multiConstraints = [];
                            }
                            var newConstraint = new Constraint();
                            newConstraint.bbox = bbox;
                            newConstraint.temporalExtent = [minT, maxT];
                            data.multiConstraints.push(newConstraint);
                        } else {
                            // contrainte classique
                            data.bbox = bbox;
                            data.temporalExtent = [minT, maxT];
                        }
                    } else { // cas d'une layer
                        if (!data.globalConstraint) {
                            data.globalConstraint = new Constraint();
                        }
                        data.globalConstraint.bbox = bbox;
                        data.globalConstraint.temporalExtent = [minT, maxT];
                    }
                }
            }
        },

        // info : /General/Extension/gpp:General/gpp:Territories/gpp:Territory/gpp:Resolution
        /** TODO : jsdoc block */
        Resolution : function (node, territory) {
            // info : The default resolution to display on this territory, in CRS coordinate system
            var res = __getChildValue(node);
            if (res && territory && territory.defaultOptions && territory.defaultOptions.hasOwnProperty("resolution")) {
                territory.defaultOptions.resolution = parseFloat(res);
            }
        },

        // info : /General/Extension/gpp:General/gpp:Territories/gpp:Territory/gpp:Center/gpp:x
        /** TODO : jsdoc block */
        x : function (node, territory) {
            var lon = __getChildValue(node);
            if (lon && territory && territory.geoCenter && territory.geoCenter.hasOwnProperty("lon")) {
                territory.geoCenter.lon = parseFloat(lon);
            }
        },

        // info : /General/Extension/gpp:General/gpp:Territories/gpp:Territory/gpp:Center/gpp:y
        /** TODO : jsdoc block */
        y : function (node, territory) {
            var lat = __getChildValue(node);
            if (lat && territory && territory.geoCenter && territory.geoCenter.hasOwnProperty("lat")) {
                territory.geoCenter.lat = parseFloat(lat);
            }
        },

        // info : /General/Extension/gpp:General/gpp:Resolutions
        /** TODO : jsdoc block */
        Resolutions : function (resNode, config) {
            // info : List of resolutions in CRS:84 (comma separated values)
            if (config && config.generalOptions && config.generalOptions.hasOwnProperty("wgs84Resolutions")) {
                config.generalOptions.wgs84Resolutions = __getChildValue(resNode).split(",");
            }
        },

        // info : /LayerList/Layer/Extension/gpp:Layer
        /** TODO : jsdoc block */
        Layer : function (node, lyrData) {
            // attributs : id, opacity, order, visibleInCatalog, aggregate, more
            if (lyrData && lyrData.hasOwnProperty("lyrId") && lyrData.lyr) {
                lyrData.lyrId = node.getAttribute("id");
                var aggregate = node.getAttribute("aggregate");
                var more = node.getAttribute("more");
                if (aggregate || more) {
                    lyrData.lyr.isAggregate = true;
                }
                __getChildNodes(node, lyrData.lyr);
            }
        },

        // info : /LayerList/Layer/Extension/gpp:Layer/gpp:Constraints/gpp:Constraint
        // ou : /LayerList/Extension/gpp:Layer/gpp:Originators/gpp:Originator/gpp:Constraints/gpp:Constraint
        /** TODO : jsdoc block */
        Constraint : function (node, data) {
            var c = new Constraint();
            __getChildNodes(node, c);
            if (data) {
                // on peut être dans le cas d'un originator ou d'une layer, tous les deux ont l'attribut constraints
                if (!data.constraints || !Array.isArray(data.constraints)) {
                    data.constraints = [];
                }

                // cas de plusieurs contraintes (par ex différents territoires)
                if (c.multiConstraints && Array.isArray(c.multiConstraints)) {
                    // on récupère la première contrainte, stockée normalement
                    var constraint = new Constraint();
                    constraint.crs = c.crs;
                    constraint.bbox = c.bbox;
                    constraint.minScaleDenominator = c.minScaleDenominator;
                    constraint.maxScaleDenominator = c.maxScaleDenominator;
                    constraint.temporalExtent = c.temporalExtent;
                    data.constraints.push(constraint);

                    // puis on récupère les autres contraintes, à partir de multiConstraints
                    for (var i = 0; i < c.multiConstraints.length; i++) {
                        constraint = new Constraint();
                        constraint.crs = c.crs;
                        constraint.minScaleDenominator = c.minScaleDenominator;
                        constraint.maxScaleDenominator = c.maxScaleDenominator;
                        constraint.bbox = c.multiConstraints[i].bbox;
                        constraint.temporalExtent = c.multiConstraints[i].temporalExtent;
                        data.constraints.push(constraint);
                    }
                } else {
                    // cas d'une contrainte classique
                    data.constraints.push(c);
                }
            }
        },

        // info : /LayerList/Layer/Extension/gpp:Layer/gpp:Originators/gpp:Originator/gpp:Constraints/gpp:Constraint/gpp:CRS
        // ou : /LayerList/Layer/Extension/gpp:Layer/gpp:Constraints/gpp:Constraint/gpp:CRS
        /** TODO : jsdoc block */
        CRS : function (node, data) {
            // nothing to do.
            if (data && data.hasOwnProperty("crs")) {
                data.crs = __getChildValue(node);
            }
        },

        // info : /LayerList/Layer/Extension/gpp:Layer/gpp:Thematics/gpp:Thematic
        /** TODO : jsdoc block */
        Thematic : function (node, lyr) {
            if (lyr) {
                var t = new Thematic();
                t.inspire = false;
                t.name = __getChildValue(node);
                // si aucune thématique n'a été ajoutée, on crée le tableau vide
                if (!lyr.thematics || !Array.isArray(lyr.thematics)) {
                    lyr.thematics = [];
                }
                lyr.thematics.push(t);
            }
        },

        // info : /LayerList/Layer/Extension/gpp:Layer/gpp:Thematics/gpp:InspireThematic
        /** TODO : jsdoc block */
        InspireThematic : function (node, lyr) {
            if (lyr) {
                var t = new Thematic();
                t.inspire = true;
                t.name = __getChildValue(node);
                // si aucune thématique n'a été ajoutée, on crée le tableau vide
                if (!lyr.thematics || !Array.isArray(lyr.thematics)) {
                    lyr.thematics = [];
                }
                lyr.thematics.push(t);
            }
        },

        // info : /LayerList/Layer/Extension/gpp:Layer/gpp:Originators/gpp:Originator
        /** TODO : jsdoc block */
        Originator : function (node, lyr) {
            if (lyr) {
                // info : contient des balises Attribution, Logo, URL, et Constraints
                var o = new Originator();
                o.name = node.getAttribute("name");
                __getChildNodes(node, o);
                // si aucun originator n'a été ajouté, on crée le tableau vide
                if (!lyr.originators || !Array.isArray(lyr.originators)) {
                    lyr.originators = [];
                }
                lyr.originators.push(o);
            }
        },

        // info : /LayerList/Layer/Extension/gpp:Layer/gpp:Originators/gpp:Originator/gpp:Attribution
        /** TODO : jsdoc block */
        Attribution : function (node, originator) {
            if (originator && originator.hasOwnProperty("attribution")) {
                originator.attribution = __getChildValue(node);
            }
        },

        // info : /LayerList/Layer/Extension/gpp:Layer/gpp:Originators/gpp:Originator/gpp:Logo
        /** TODO : jsdoc block */
        Logo : function (node, originator) {
            if (originator && originator.hasOwnProperty("logo")) {
                originator.logo = __getChildValue(node);
            }
        },

        // info : /LayerList/Layer/Extension/gpp:Layer/gpp:Originators/gpp:Originator/gpp:URL
        /** TODO : jsdoc block */
        URL : function (node, originator) {
            if (originator && originator.hasOwnProperty("url")) {
                originator.url = __getChildValue(node);
            }
        },

        // info : /LayerList/Layer/Extension/gpp:Layer/gpp:Legends/gpp:Legend
        /** TODO : jsdoc block */
        Legend : function (node, lyr) {
            // 2 balises : sld:MinScaleDenominator et gpp:LegendURL
            var l = new Legend();
            __getChildNodes(node, l);
            if (lyr) {
                // si aucune légende n'a encore été ajoutée, on crée le tableau vide
                if (!lyr.legends || !Array.isArray(lyr.legends)) {
                    lyr.legends = [];
                }
                lyr.legends.push(l);
            }
        },

        // info : /LayerList/Layer/Extension/gpp:Layer/gpp:Legends/gpp:Legend/gpp:LegendURL
        /** TODO : jsdoc block */
        LegendURL : function (node, legend) {
            if (legend && legend.hasOwnProperty("format")) {
                legend.format = node.getAttribute("format");
                if (node.hasChildNodes) {
                    var child = node.childNodes[0];
                    var childName = child.localName || child.baseName || child.nodeName;
                    if (childName === "OnlineResource" && legend.hasOwnProperty("url")) {
                        legend.url = child.getAttribute("xlink:href");
                    }
                }
            }
        },

        // info : /LayerList/Layer/Extension/gpp:Layer/gpp:QuickLook
        /** TODO : jsdoc block */
        QuickLook : function (node, lyr) {
            // info : contient une balise OnlineResource avec l'url dans l'attribut "xlink:href"
            if (node.hasChildNodes) {
                var child = node.childNodes[0];
                var childName = child.localName || child.baseName || child.nodeName;
                if (childName === "OnlineResource" && lyr) {
                    lyr.quicklookUrl = child.getAttribute("xlink:href");
                }
            }
        },

        // info : /LayerList/Layer/Extension/gpp:Layer/gpp:MetadataURL
        /** TODO : jsdoc block */
        MetadataURL : function (node, lyr) {
            if (lyr) {
                // info : contient une balise OnlineResource avec l'url dans l'attribut "xlink:href"
                var m = new Metadata();
                m.format = node.getAttribute("format");
                if (node.hasChildNodes) {
                    var child = node.childNodes[0];
                    var childName = child.localName || child.baseName || child.nodeName;
                    if (childName === "OnlineResource") {
                        m.url = child.getAttribute("xlink:href");
                    }
                }
                // si aucune metadata n'a été ajoutée, on crée le tableau vide
                if (!lyr.metadata && !Array.isArray(lyr.metadata)) {
                    lyr.metadata = [];
                }
                lyr.metadata.push(m);
            }
        },

        // info : /LayerList/Layer/Extension/gpp:Layer/gpp:Keys/gpp:Key
        /** TODO : jsdoc block */
        Key : function (node, lyr) {
            if (lyr) {
                // récupération de la clé API
                var key = node.getAttribute("id");
                // si on n'a pas encore ajouté de clé, on crée le tableau vide
                if (!lyr.apiKeys || !Array.isArray(lyr.apiKeys)) {
                    lyr.apiKeys = [];
                }
                lyr.apiKeys.push(key);

                // récupération de l'url du service avec la clé API
                var serverUrl = __getChildValue(node);
                if (!lyr.serviceParams) {
                    lyr.serviceParams = {};
                }
                if (!lyr.serviceParams.serverUrl) {
                    lyr.serviceParams.serverUrl = {};
                }
                if (!lyr.serviceParams.serverUrl[key]) {
                    lyr.serviceParams.serverUrl[key] = serverUrl;
                }
            }
        }

    },

    ows : {
        /** TODO : jsdoc block */
        Identifier : function (node, data) {
            if (data && data.hasOwnProperty("TMS")) { // dans le cas d'un TileMatrixSet
                data.identifier = __getChildValue(node);
            } else if (data && data.hasOwnProperty("matrixId")) { // dans le cas d'une TileMatrix
                data.matrixId = __getChildValue(node);
            }
        },

        /** TODO : jsdoc block */
        SupportedCRS : function (node, tmsData) {
            if (tmsData && tmsData.TMS && tmsData.TMS.hasOwnProperty("projection")) {
                tmsData.TMS.projection = __getChildValue(node);
            }
        }
    },

    sld : {
        // info : /General/Extension/gpp:General/gpp:Territories/gpp:Territory/sld:MinScaleDenominator
        // ou : /LayerList/Layer/sld:MinScaleDenominator
        // ou : /LayerList/Layer/Extension/gpp:Layer/gpp:Originators/gpp:Originator/gpp:Constraints/sld:MinScaleDenominator
        // ou : /LayerList/Layer/Extension/gpp:Layer/gpp:Legends/gpp:Legend/sld:MinScaleDenominator
        /** TODO : jsdoc block */
        MinScaleDenominator : function (node, data) {
            var minScale = __getChildValue(node);
            if (minScale && data) {
                if (data.hasOwnProperty("defaultOptions")) { // cas d'un territoire
                    data.defaultOptions.minScaleDenominator = parseFloat(minScale);
                } else if (data.lyr) { // cas d'une layer
                    if (!data.lyr.globalConstraint) {
                        data.lyr.globalConstraint = new Constraint();
                    }
                    data.lyr.globalConstraint.minScaleDenominator = parseFloat(minScale);
                } else if (data.hasOwnProperty("minScaleDenominator")) { // cas d'une contrainte ou d'une légende
                    data.minScaleDenominator = parseFloat(minScale);
                }
            }
        },

        // info : /General/Extension/gpp:General/gpp:Territories/gpp:Territory/sld:MaxScaleDenominator
        // ou : /LayerList/Layer/sld:MaxScaleDenominator
        // ou : /LayerList/Layer/Extension/gpp:Layer/gpp:Originators/gpp:Originator/gpp:Constraints/sld:MaxScaleDenominator
        /** TODO : jsdoc block */
        MaxScaleDenominator : function (node, data) {
            var maxScale = __getChildValue(node);
            if (maxScale && data) {
                if (data.hasOwnProperty("defaultOptions")) { // cas d'un territoire
                    data.defaultOptions.maxScaleDenominator = parseFloat(maxScale);
                } else if (data.lyr) { // cas d'une layer
                    if (!data.lyr.globalConstraint) {
                        data.lyr.globalConstraint = new Constraint();
                    }
                    data.lyr.globalConstraint.maxScaleDenominator = parseFloat(maxScale);
                } else if (data.hasOwnProperty("maxScaleDenominator")) { // cas d'une contrainte
                    data.maxScaleDenominator = parseFloat(maxScale);
                }
            }
        }
    },

    wmts : {

        // info : /LayerList/Layer/Extension/gpp:Layer/wmts:TileMatrixSetLink/wmts:TileMatrixSetLimits
        /** TODO : jsdoc block */
        TileMatrixSetLimits : function (node, lyr) {
            // info : contient des balises wmts:TileMatrixLimits
            if (lyr) {
                var limits = {};
                // on récupère les limites dans les balises TileMatrixLimits
                __getChildNodes(node, limits);

                if (!lyr.wmtsOptions) {
                    lyr.wmtsOptions = {};
                }
                lyr.wmtsOptions.tileMatrixSetLimits = limits;
            }
        },

        // info : /LayerList/Layer/Extension/gpp:Layer/wmts:TileMatrixSetLink/wmts:TileMatrixSetLimits/wmts:TileMatrixLimits
        /** TODO : jsdoc block */
        TileMatrixLimits : function (node, limits) {
            var limit = new TileMatrixLimit();
            var limitId;
            if (node.hasChildNodes) {
                var children = node.childNodes;
                for (var i = 0; i < children.length; i++) {
                    var child = children[i];
                    var childName = child.localName || child.baseName || child.nodeName;
                    if (childName === "TileMatrix") {
                        limitId = __getChildValue(child);
                    } else if (childName === "MinTileRow") {
                        limit.minTileRow = __getChildValue(child);
                    } else if (childName === "MaxTileRow") {
                        limit.maxTileRow = __getChildValue(child);
                    } else if (childName === "MinTileCol") {
                        limit.minTileCol = __getChildValue(child);
                    } else if (childName === "MaxTileCol") {
                        limit.maxTileCol = __getChildValue(child);
                    }
                }
                if (limitId && limits && !limits[limitId]) {
                    limits[limitId] = limit;
                }
            }
        },

        // info : /General/Extension/gpp:General/gpp:TileMatrixSets/wmts:TileMatrixSet
        // ou : // info : /LayerList/Layer/Extension/gpp:Layer/wmts:TileMatrixSetLink/wmts:TileMatrixSet
        /** TODO : jsdoc block */
        TileMatrixSet : function (node, data) {
            // info : Describes a particular set of tile matrices.

            if (data && data.tileMatrixSets) { // les tileMatrixSets de General
                // nouvel objet TileMatrixSet
                var tmsData = {};
                tmsData.TMS = new TileMatrixSet();
                tmsData.resolutions = [];

                // lecture des informations du TMS
                __getChildNodes(node, tmsData);

                // récupération des identifiants des niveaux de matrice (pour faciliter l'accès au WMTS via les API carto)
                var tileMatrices = tmsData.TMS.tileMatrices;
                for (var tm in tileMatrices) {
                    if (tileMatrices.hasOwnProperty(tm)) {
                        tmsData.TMS.matrixIds.push(tm);
                    }
                }

                if (tmsData.TMS.getProjection() === "IGNF:WGS84G" || tmsData.TMS.getProjection() === "EPSG:4326") {
                    if (data.generalOptions && Array.isArray(data.generalOptions.wgs84Resolutions)) {
                        var wgs84Resolutions = data.generalOptions.wgs84Resolutions;
                        for (var i = 0; i < wgs84Resolutions.length; i++) {
                            // info : les résolutions stockées dans wgs84Resolutions, issues de l'autoconf, sont des string
                            tmsData.resolutions[i] = parseFloat(wgs84Resolutions[i]);
                        }
                    }
                }

                // tri des résolutions (par ordre décroissant cette fois)
                if (Array.isArray(tmsData.resolutions) && tmsData.resolutions.sort !== undefined) {
                    tmsData.resolutions.sort(
                        function (x, y) {
                            return y - x;
                        }
                    );
                }
                tmsData.TMS.nativeResolutions = tmsData.resolutions;

                // ajout du TileMatrixSet à la variable config
                data.tileMatrixSets[tmsData.identifier] = tmsData.TMS;
            } else { // le TileMatrixSetLink d'une couche (layer)
                if (data && !data.wmtsOptions) {
                    data.wmtsOptions = {};
                }
                // ajout du lien vers le TMS
                data.wmtsOptions.tileMatrixSetLink = __getChildValue(node);
            }
        },

        // info : /General/Extension/gpp:General/gpp:TileMatrixSets/wmts:TileMatrixSet/wmts:TileMatrix
        /** TODO : jsdoc block */
        TileMatrix : function (node, tmsData) {
            // info : Describes a particular tile matrix.

            if (tmsData) {
                // nouveau niveau de matrice : TileMatrix
                var tileMatrix = new TileMatrix();

                // lecture des information du TileMatrix
                __getChildNodes(node, tileMatrix);

                // calcul de la résolution associée au dénominateur d'échelle du niveau de pyramide, selon la projection.
                if (tmsData.TMS && tmsData.TMS.getProjection()) {
                    var proj = tmsData.TMS.getProjection();
                    if (proj === "EPSG:3857" || proj === "EPSG:2154") {
                        // calcul de la résolution associée, en m/px
                        // en se basant sur une "taille standard de pixel" de 0.28mm*0.28mm (standard WMTS 1.0)
                        var r = tileMatrix.scaleDenominator * 0.00028;
                        if (tmsData.resolutions && Array.isArray(tmsData.resolutions)) {
                            tmsData.resolutions.push(r);
                        }
                    }
                }

                // ajout du TileMatrix au TileMatrixSet
                if (tmsData.TMS && tmsData.TMS.tileMatrices) {
                    tmsData.TMS.tileMatrices[tileMatrix.matrixId] = tileMatrix;
                }
            }
        },

        // info : /General/Extension/gpp:General/gpp:TileMatrixSets/wmts:TileMatrixSet/wmts:TileMatrix/wmts:ScaleDenominator
        /** TODO : jsdoc block */
        ScaleDenominator : function (node, tileMatrix) {
            var scale = __getChildValue(node);
            if (scale && tileMatrix && tileMatrix.hasOwnProperty("scaleDenominator")) {
                tileMatrix.scaleDenominator = parseFloat(scale);
            }
        },

        // info : /General/Extension/gpp:General/gpp:TileMatrixSets/wmts:TileMatrixSet/wmts:TileMatrix/wmts:TopLeftCorner
        /** TODO : jsdoc block */
        TopLeftCorner : function (node, tileMatrix) {
            var values = __getChildValue(node).split(" ");
            if (values && tileMatrix) {
                tileMatrix.topLeftCorner = {};
                tileMatrix.topLeftCorner.x = parseFloat(values[0]);
                tileMatrix.topLeftCorner.y = parseFloat(values[1]);
            }
        },

        // info : /General/Extension/gpp:General/gpp:TileMatrixSets/wmts:TileMatrixSet/wmts:TileMatrix/wmts:TileWidth
        /** TODO : jsdoc block */
        TileWidth : function (node, tileMatrix) {
            var value = __getChildValue(node);
            if (value && tileMatrix && tileMatrix.hasOwnProperty("tileWidth")) {
                tileMatrix.tileWidth = parseInt(value, 10);
            }
        },

        // info : /General/Extension/gpp:General/gpp:TileMatrixSets/wmts:TileMatrixSet/wmts:TileMatrix/wmts:TileHeight
        /** TODO : jsdoc block */
        TileHeight : function (node, tileMatrix) {
            var value = __getChildValue(node);
            if (value && tileMatrix && tileMatrix.hasOwnProperty("tileHeight")) {
                tileMatrix.tileHeight = parseInt(value, 10);
            }
        },

        // info : /General/Extension/gpp:General/gpp:TileMatrixSets/wmts:TileMatrixSet/wmts:TileMatrix/wmts:MatrixWidth
        /** TODO : jsdoc block */
        MatrixWidth : function (node, tileMatrix) {
            var value = __getChildValue(node);
            if (value && tileMatrix && tileMatrix.hasOwnProperty("matrixWidth")) {
                tileMatrix.matrixWidth = parseInt(value, 10);
            }
        },

        // info : /General/Extension/gpp:General/gpp:TileMatrixSets/wmts:TileMatrixSet/wmts:TileMatrix/wmts:MatrixHeight
        /** TODO : jsdoc block */
        MatrixHeight : function (node, tileMatrix) {
            var value = __getChildValue(node);
            if (value && tileMatrix && tileMatrix.hasOwnProperty("matrixHeight")) {
                tileMatrix.matrixHeight = parseInt(value, 10);
            }
        }
    },

    /** TODO : jsdoc block */
    serviceException : function (node) {
        var response = {};
        if (node.hasChildNodes()) {
            var children = node.childNodes;
            var child;
            for (var i = 0; i < children.length; i++) {
                child = children[i];
                if (child.nodeName === "exception") {
                    response.exceptionReport = AutoConfResponseReader.READERS["exception"](child);
                }
            }
        }
        return response;
    },

    /** TODO : jsdoc block */
    exception : function (node) {
        var exceptionReport = {};

        // get exception code
        var exceptionCode = node.getAttribute("code");
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
 * Méthode permettant de lancer la lecture d'une réponse XML du service d'autoconf,
 *      à l'aide des READERS de la classe.
 *
 * @method AutoConfResponseReader.read
 * @param {DOMElement} root - racine de la réponse XML à lire
 * @return {Object} config|exceptionReport : l'objet contenant les informations de la réponse XML,
 *      sous la forme d'un objet AutoConfResponse, ou un objet littéral exceptionReport si le service a renvoyé une exception.
 * @static
 * @memberof AutoConfResponseReader
 */
AutoConfResponseReader.read = function (root) {
    if (root.nodeName === "ViewContext") {
        var nsPrefix = root.prefix || AutoConfResponseReader.DEFAULTPREFIX;
        var config = AutoConfResponseReader.READERS[nsPrefix][root.nodeName](root);
        return config;
    } else if (root.nodeName === "serviceException") {
        var exceptionReport = AutoConfResponseReader.READERS[root.nodeName](root);
        return exceptionReport;
    } else {
        throw new Error("Erreur lors de la lecture de la réponse : elle n'est pas au format attendu.");
    }
};

/**
 * Récupération des attributs d'un noeud élément
 *
 * @private
 * @memberof AutoConfResponseReader
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
 * Récupération des noeuds enfants (seulement de type ELEMENT), à partir d'un noeud donné, pour lecture (readNode).
 *
 * @private
 * @memberof AutoConfResponseReader
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
                childPrefix = child.prefix || AutoConfResponseReader.DEFAULTPREFIX;

                if (AutoConfResponseReader.READERS[childPrefix][childName]) {
                    var reader = AutoConfResponseReader.READERS[childPrefix][childName];
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
 * @memberof AutoConfResponseReader
 * @method __getChildValue
 * @param {DOMElement} node - a DOM node
 * @return {String} value - valeur du firstChild du noeud en entrée, ou chaîne vide.
 */
function __getChildValue (node) {
    var textNode;
    var value = "";

    if (node.hasChildNodes()) {
        textNode = node.firstChild;
        if (textNode.nodeType === 3 || textNode.nodeType === 4) { // 3 === node.TEXT_NODE
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
 * @memberof AutoConfResponseReader
 * @method __checkServiceAttributes
 * @param {DOMElement} viewContextNode - a DOM node, corresponding to XLS first tag.
 */
function __checkServiceAttributes (viewContextNode) {
    if (viewContextNode.attributes.length > 0) {
        // on récupère et parcourt les attributs de la balise XLS de la réponse
        var xlsAttributes = __getAttributes(viewContextNode);
        for (var att in xlsAttributes) {
            if (xlsAttributes.hasOwnProperty(att)) {
                // vérification de la version
                if (att === "version") {
                    if (xlsAttributes["version"] !== AutoConfResponseReader.VERSION) {
                        console.log("[AutoConfResponseReader] autoconf version is not the expected one : there may be errors in parsing");
                        return;
                    }
                }

                // on vérifie que l'uri du namespace par défaut est bien celle que l'on attend
                if (att === "xmlns") {
                    if (xlsAttributes[att] !== AutoConfResponseReader.NAMESPACES.xmlns) {
                        console.log("[AutoConfResponseReader] autoconf response default namespace is not the expected one");
                        return;
                    }
                    continue;
                }

                var prefix = att.split(":")[0];
                var ns = att.split(":")[1];

                // si on a un autre xmlns, on vérifie aussi les URI
                if (prefix === "xmlns" && ns) {
                    // si l'attribut correspond à un namespace défini dans le reader
                    if (AutoConfResponseReader.NAMESPACES[ns]) {
                        // il faut que les URI correspondent aussi.
                        if (AutoConfResponseReader.NAMESPACES[ns] !== xlsAttributes[att]) {
                            console.log("[AutoConfResponseReader] autoconf response " + att + " namespace is not the expected one");
                            return;
                        }
                    }
                }

                // pour finir on vérifie la localisation du schema XSD du service
                if (ns === "schemaLocation") {
                    if (xlsAttributes[att] !== AutoConfResponseReader.SCHEMALOCATION[0] && xlsAttributes[att] !== AutoConfResponseReader.SCHEMALOCATION[1]) {
                        console.log("[AutoConfResponseReader] autoconf response schema location is not the expected one");
                        return;
                    }
                }
            }
        }
    }
}

export default AutoConfResponseReader;
