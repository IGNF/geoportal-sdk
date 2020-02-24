// implementation du vecteur tuilé dans ce fichier afin d'isoler
// la complexité du code de la fonction principale : _addVectorLayer().

import { OlMap } from "./OlMapBase";

import { olUtils as Utils } from "geoportal-extensions-openlayers";

import { applyStyle as applyStyleOlms } from "ol-mapbox-style";

import VectorTileLayer from "ol/layer/VectorTile";

import VectorTileSource from "ol/source/VectorTile";
import TileJSONSource from "ol/source/TileJSON";

import RenderFeature from "ol/render/Feature"; // FIXME !?

import MVT from "ol/format/MVT";
import GeoJSON from "ol/format/GeoJSON";

import { createXYZ as olCreateXYZTileGrid } from "ol/tilegrid";

import { unByKey as olObservableUnByKey } from "ol/Observable";
import { transform as olTransformProj } from "ol/proj";

/******************************************************************************
* Internals functions
*******************************************************************************/

/**
 * TODO ...
 * @param {Object} style - ...
 * @returns {Object} style ...
 * @sample
 */
var _transformGrayStyle = function (style) {
    // modifier le style du layer ou des features avec une fonction de conversion des
    // couleurs en N/B
    var strStyle = JSON.stringify(style);

    // fonction de conversion decimal -> hexa
    function hex (number) {
        if (number > 255) {
            throw new Error("'" + number + "'' is greater than 255(0xff);");
        }
        var str = Number(number).toString(16);
        return ("0" + str).slice(-2);
    }
    // fonction de conversion en NB
    function nb (col) {
        var r = col >> 16;
        var g = (col >> 8) & 0xff;
        var b = col & 0xff;
        // https://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale
        // https://www.johndcook.com/blog/2009/08/24/algorithms-convert-color-grayscale/
        // luminosity : 0.21 R + 0.72 G + 0.07 B
        var bnw = (r * 0.2126 + g * 0.7152 + b * 0.0722) & 0xff;
        var num = (bnw << 16) | (bnw << 8) | bnw;
        return num.toString(16);
    }

    // recherche valeurs en rgba pour conversion en hexa
    var regex4rgba = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(0?.?\d+)\s*)?\)/gm;
    var style4hexa = strStyle.replace(regex4rgba, function (corespondance, p1, p2, p3, decalage) {
        var p = hex(p1) + hex(p2) + hex(p3);
        return "#" + p;
    });
    // recherche des valeurs en hexa3 pour conversion en hexa
    var regex4hexa3 = /"#([a-f\d])([a-f\d])([a-f\d])"/igm;
    var style4hexa3 = style4hexa.replace(regex4hexa3, function (corespondance, p1, p2, p3, decalage) {
        var p = p1 + p1 + p2 + p2 + p3 + p3;
        return "\"#" + p + "\"";
    });
    // recherche des valeurs en hexa pour conversion en NB
    var regex4hexa = /#([a-f\d]{2}[a-f\d]{2}[a-f\d]{2})/igm;
    var style4nb = style4hexa3.replace(regex4hexa, function (corespondance, p, decalage) {
        var subst4nb = nb(parseInt(p, 16));
        return "#" + subst4nb;
    });

    // style en NB
    try {
        return JSON.parse(style4nb);
    } catch (err) {
        return null;
    }
};

/**
 * TODO ...
 * @param {String} source - ...
 * @param {Array} urls - ...
 * @param {Object} filter - ...
 * @param {Object} tilejson - tileJson file (metadata.json) ...
 * @param {Object} styles - ...
 * @returns {Array} ...
 * @sample
 */
var _createFilterStyle = function (source, urls, filter, tilejson, styles) {
    // TODO
    // documenter le code pour la comprehension !

    // les fonctions internes :

    var _updateFilterEntryToMainStyles = function (styles, filtername, layersId, layersIdx, selected) {
        // filtre inactif
        var _rgxFilternameInactive = RegExp("__" + filtername + "__");
        // filtre trouvé
        var _bfound = false;
        for (var n = 0; n < layersIdx.length; n++) {
            var _mainlayer = styles.layers[layersIdx[n]];
            if (_mainlayer && _mainlayer.id === layersId[n]) {
                // on recheche la valeur du filtre dans les filtres
                // des "layers" sous la forme :
                // - ["in", key, value, ...]
                // - ["===", key, value]
                // - ["all", expr, expr, ...]

                // FIXME
                // fonction reccursive !
                if (_mainlayer.filter) {
                    for (var k = 0; k < _mainlayer.filter.length; k++) {
                        if (_bfound) {
                            break;
                        }
                        // cas où on a un ensemble de filtres
                        // ["all", expr, expr, ...]
                        if (Array.isArray(_mainlayer.filter[k])) {
                            // à tester...
                            for (var kk = 0; kk < _mainlayer.filter[k].length; kk++) {
                                var _mainfiltername1 = _mainlayer.filter[k][kk];
                                // a t on trouvé quelque chose ?
                                if (_mainfiltername1.indexOf(filtername) !== -1) {
                                    _bfound = true;
                                    // target.checked === true
                                    // > on active le filtre
                                    // target.checked === false
                                    // > on desactive le filtre
                                    if (selected) {
                                        // le filtre est inactif, on le reactive...
                                        if (_rgxFilternameInactive.test(_mainfiltername1)) {
                                            _mainlayer.filter[k][kk] = filtername;
                                        }
                                    } else {
                                        // le filtre est actif, on le desactive...
                                        _mainlayer.filter[k][kk] = "__" + filtername + "__";
                                    }

                                    if (_bfound) {
                                        break;
                                    }
                                }
                            }
                        } else {
                            // la valeur recherché, c'est le nom du filtre,
                            // ["in", key, value, ...] ou ["===", key, value]
                            var _mainfiltername2 = _mainlayer.filter[k];
                            // a t on trouvé quelque chose ?
                            if (_mainfiltername2.indexOf(filtername) !== -1) {
                                _bfound = true;
                                // target.checked === true
                                // > on active le filtre
                                // target.checked === false
                                // > on desactive le filtre
                                if (selected) {
                                    // le filtre est inactif, on le reactive...
                                    if (_rgxFilternameInactive.test(_mainfiltername2)) {
                                        _mainlayer.filter[k] = filtername;
                                    }
                                } else {
                                    // le filtre est actif, on le desactive...
                                    _mainlayer.filter[k] = "__" + filtername + "__";
                                }

                                if (_bfound) {
                                    break;
                                }
                            }
                        }
                    }
                } else {
                    // FIXME il n'existe pas de filtre !?
                }
            }
        }

        // on n'a pas trouvé de filtre !?
        if (!_bfound) {
            // TODO un message ?
        }
    };

    /** fonction pour generer un filtre
     * en fonction du typage postgres (string ou numerique), on le convertit en filtre
     * mapbox :
     *      ex. filter : [ "==", {field}, {value} ] ou [ "in",  {field}, {value} ]
     * @param {String} type - ...
     * @param {String} tjsonfield - ...
     * @param {String} tjsonvalue - ...
     * @param {String} comparaison - ...
     * @returns {Array} filter mapbox
     */
    var _addFilterTagEntry = function (type, tjsonfield, tjsonvalue, comparaison) {
        var result = null;

        var _type = type.toLowerCase();
        switch (_type) {
            case "string":
            case "text":
            case (_type.match(/^character/) || {}).input:
                result = [
                    comparaison || "in", // "=="
                    tjsonfield,
                    tjsonvalue
                ];
                break;
            case "numeric": // evolution
            case "integer":
                result = [
                    comparaison || "<=",
                    tjsonfield,
                    parseInt(tjsonvalue, 10)
                ];
                break;
            default:
                result = [];
        }

        return result;
    };

    /** fonction pour generer une legende auto
     * en fonction du type de geometrie (postgres), on determine une legende mapbox
     *      ex. pour un polygone
     *      paint : {"fill-color" : {color}, "fill-opacity" : 0.5, "fill-width" : 1}
     *      avec {color} en mode random
     * @param {String} tjsongeometry - geometry from tileJSON
     * @returns {Object} paint mapbox
     */
    var _addPaintTagEntry = function (tjsongeometry) {
        var result = null;

        var _color = ("#" + Math.floor(Math.random() * 16777215).toString(16)).padEnd(7, "f");

        var _geometry = tjsongeometry.toUpperCase();
        switch (_geometry) {
            case "MULTIPOLYGON":
            case "POLYGON":
                result = {
                    "fill-color" : _color,
                    "fill-opacity" : 0.5,
                    "fill-width" : 1
                };
                break;
            case "MULTILINE":
            case "LINE":
            case "LINESTRING":
                result = {
                    "line-color" : _color,
                    "line-width" : 1
                };
                break;
            case "MULTIPOINT":
            case "POINT":
                result = {
                    "circle-color" : _color,
                    "circle-radius" : 5,
                    "circle-stroke-color" : "#FFFFFF",
                    "circle-stroke-width" : 2
                };
                break;
            default:
                result = {};
        }

        return result;
    };

    /** fonction pour convertir le type postgres vers un format MapBox
     *      ex. MULTIPOLYGON => fill
     * le type "symbol" ou "icon" est particulier à MapBox...
     * donc par defaut, le type postgres POINT => circle
     * @param {String} tjsongeometry - geometry from tileJSON
     * @returns {String} type mapbox
     */
    var _addTypeGeometryTagEntry = function (tjsongeometry) {
        var result = null;

        // FIXME
        // Comment faire la difference entre symbol et circle ?
        // Sous postgres, le type est toujours un MULTIPOINT / POINT !?
        var _geometry = tjsongeometry.toUpperCase();
        switch (_geometry) {
            case "MULTIPOLYGON":
            case "POLYGON":
                result = "fill";
                break;
            case "MULTILINE":
            case "LINE":
            case "LINESTRING":
                result = "line";
                break;
            case "MULTIPOINT":
            case "POINT":
                result = "circle";
                break;
            default:
                result = "symbol"; // FIXME ?
        }

        return result;
    };

    /* Filtre attributaire (style json) :
    // on construit un objet style pour chaque ensemble de filtres utilisateurs,
    // ils sont actifs (visibility:visible) ou inactifs (visibility:none)
    // par défaut selon la configuration demandée.
    // ex.
    //  "id": {value}, // ex. Collège : valeur du champ "nature" de la table "etablissements"
    //  "source": ...,
    //  "source-layer": ...,
    //  "layout" : {"visibility": "none"},
    //  "paint": {},
    //  "filter" : [
    //      "==",
    //      "{field}", // ex. champ "nature"
    //      "{value}" // ex. valeur "Collège"
    // ]
    */

    // creation du style json pour un filtre attributaire
    var _style = {};
    _style.version = 8;
    _style.name = filter.filterName;
    _style.center = tilejson.center || [];
    _style.bounds = tilejson.bounds || [];
    _style.layers = []; // liste des 'layers'
    _style.sources = {};
    _style.sources[source] = {
        type : "vector",
        tiles : [urls] // l'url des services tuilés
    };

    /* Extrait du "metadata.json" :
    // "vector_layers": [
    // {
    //    "id":"Enseignement",
    //    "geometry":"POINT",
    //    "maxzoom":"16",
    //    "minzoom":"6",
    //    "filedsCount":"2",
    //    "fields":{
    //       "nature":{
    //          "attribute":"nature",
    //          "count":"9",
    //          "type":"character varying(80)",
    //          "values":[
    //             "Collège",
    //             "Autre",
    //             "Science",
    //             "Enseignement primaire",
    //             "Université",
    //             "Lycée",
    //             "Enseignement secondaire",
    //             "Enseignement supérieur"
    //          ]
    //       },
    //       "statut":{
    //          "attribute":"statut",
    //          "count":"2",
    //          "type":"character varying",
    //          "values":["privées", "publiques"]
    //       }
    //    }
    // }
    // ]
    */

    /* Le fichier "metadata.json" (tileJSON) :
    //  il fournit une description des tables
    //  le tag "vector_layers" permet d'obtenir les informations suivantes :
    //  {id}, {type}, {fields}, {values}, {geometry}, ({minzoom} et {maxzoom}).
    //  où
    //      id : nom de la table (postgres)
    //          => ex. "Etablissements"
    //          => "source-layer" du fichier de style !
    //          => nom présent dans la tuile du service
    //      type : typage des valeurs (postgres)
    //      values : les valeurs
    //          => nom des filtres !
    //      fields : liste des champs de la table(postgres)
    //          => ex. "nature"
    //          => options : filter.propertyName
    //      geometry : type de geometrie (postgres)
    */

    var _tjsonlayers = tilejson["vector_layers"];
    if (_tjsonlayers) {
        var bFound = false;
        for (var i = 0; i < _tjsonlayers.length && !bFound; i++) {
            var o = _tjsonlayers[i];
            for (var _tjsonfield in o.fields) {
                if (o.fields.hasOwnProperty(_tjsonfield)) {
                    // on a trouvé le nom du champ...
                    if (_tjsonfield === filter.propertyName) {
                        // informations de la table (postgres)
                        var _tjsonid = o.id; // la table (postgres)
                        var _tjsongeometry = o.geometry; // le type de geometrie (postgres)
                        var _tjsontype = o.fields[_tjsonfield].type; // typage des valeurs (postgres)
                        var _tjsonvalues = o.fields[_tjsonfield].values; // les valeurs !
                        if (_tjsonvalues) {
                            _tjsonvalues.sort(); // triées !
                        }

                        // si on a un nom de table dans le nom du champs,
                        // on recherche ce champ dans la bonne table.
                        if (filter.tableName && _tjsonid !== filter.tableName) {
                            continue;
                        }

                        // on verifie aussi que le nom de la table est bien present
                        // dans le fichier de style, et on enregistre tous les "layers"
                        // liés à cette table.
                        var _mtdLayersId = []; // liste des "layers" (id dans le json)
                        var _mtdLayersIdx = []; // liste des emplacements (ordre dans le json)

                        var _nlayers = styles.layers.length;
                        for (var k = 0; k < _nlayers; k++) {
                            // on prend tous les styles où figurent cette table
                            var l = styles.layers[k];
                            if (l["source-layer"] && l["source-layer"] === _tjsonid) {
                                // attention, nous sommes dans un filtre utilisateur !
                                if (l.metadata && l.metadata["geoportail:entry"] && l.metadata["geoportail:index"]) {
                                    continue;
                                }
                                // FIXME cas particulier :
                                // on ajoute une liste de filtres pour la configuration:0...,
                                // si on a qu'un seul "layers"...
                                if (_nlayers === 1 && filter.type && filter.type === 0) {
                                    if (!l.filter) {
                                        l.filter = [];
                                        l.filter.push("in");
                                        l.filter.push(filter.propertyName);
                                    }
                                    for (var kk = 0; kk < _tjsonvalues.length; kk++) {
                                        var v = _tjsonvalues[kk];
                                        // on evite d'ajouter plusieurs fois le filtre...
                                        if (l.filter.indexOf(v) === -1) {
                                            l.filter.push(v);
                                        }
                                    }
                                }

                                _mtdLayersId.push(l.id);
                                _mtdLayersIdx.push(k);
                            }
                        }

                        if (!_mtdLayersId) {
                            // eslint-disable-next-line no-console
                            console.warn("Filtres utilisateurs : auncune association possible !?");
                            break;
                        }

                        // on a trouvé les informations !
                        bFound = true;

                        // mais, hummm..., il n'y a pas de valeurs pour ce champ...
                        // c'est possible que les valeurs ne soient pas renseignées dans le metadata.json,
                        // car trop de valeurs..., du coup, on ne peut pas gerer ce type d'informations.
                        if (!_tjsonvalues) {
                            // eslint-disable-next-line no-console
                            console.warn("Filtres utilisateurs : auncune valeurs !?");
                            continue;
                        }

                        /* Le param "configurable" :
                        // pour chaque valeur, on va construire un style avec un filtre (styles attributaires),
                        // et on va chercher quelles sont les filtres qui peuvent impacté
                        // quelles layers (association) du style principal differement.
                        // en fonction du param "configurable", l'affichage graphique est differente.
                        // les styles attributaires (filtres) sont ajoutés à la suite dans le style principale.
                        //
                        // - configurable=0 (par defaut)
                        //      ...
                        //      graphiquement, sur la carte, affichage multiple
                        //      des filtres.
                        //
                        // - configurable=1
                        //      ...
                        //      graphiquement, sur la carte, affichage en superposition
                        //      sur les autres données presentes avec une  une legende
                        //      automatique mise en place afin de differencier
                        //      et mettre en avant les objets sélectionnés...
                        //
                        // - configurable=2
                        //      ...
                        //      graphiquement, sur la carte, un affichage uniquement
                        //      du filtre sélectionné.
                        //      la selection du filtre est de type radio-boutton, donc
                        //      une seule selection possible à la fois !
                        */
                        for (var j = 0; j < _tjsonvalues.length; j++) {
                            var _tjsonvalue = _tjsonvalues[j];

                            // tag du style par defaut...
                            var _tagPaint = null;
                            var _tagFilter = _addFilterTagEntry(_tjsontype, _tjsonfield, _tjsonvalue);
                            var _tagVisible = "visible"; // layout
                            // tag "metadata:geoportail" par defaut...
                            var _mtdFilterMode = 0; // configuration : 0, 1 ou 2
                            var _mtdFilterCategory = filter.filterName;

                            if (filter.type === 0) {
                                /* TODO Explication sur la configuration :
                                // ...
                                */

                                // gestion des filtres actifs
                                // on applique le filtre sur le fichier de style afin
                                // d'avoir un affichage correct...
                                if (filter.selected && filter.selected.length) {
                                    _updateFilterEntryToMainStyles(
                                        styles,
                                        _tjsonvalue,
                                        _mtdLayersId,
                                        _mtdLayersIdx,
                                        filter.selected[j]
                                    );
                                }
                            } else if (filter.type === 1) {
                                /* TODO Explication sur la configuration :
                                // ...
                                */
                                _tagVisible = "none";
                                _tagPaint = _addPaintTagEntry(_tjsongeometry);
                                _mtdFilterMode = 1;
                            } else if (filter.type === 2) {
                                /* TODO Explication sur la configuration :
                                // ...
                                */
                                _tagVisible = "none";
                                _mtdFilterMode = 2;
                                // gestion des filtres actifs
                                if (filter.selected && filter.selected.length) {
                                    // TODO...
                                }
                            } else {}

                            // gestion des filtres actifs
                            // on modifie la visibilité sur un filtre actif
                            // (ex. oeil coché/décoché sur l'editeur graphique)
                            if (filter.selected && filter.selected.length) {
                                // 0 -> none, 1 -> visible
                                _tagVisible = (filter.selected[j]) ? "visible" : "none";
                            }

                            // finalisation du style attributaire
                            _style.layers.push({
                                "id" : _tjsonvalue,
                                "type" : _addTypeGeometryTagEntry(_tjsongeometry), // FIXME symbol ou circle ?
                                "source" : source,
                                "source-layer" : _tjsonid,
                                /* tag metadata :
                                // utiliser le tag metadata pour faire passer des informations
                                // sur le layers
                                // ex.
                                //  - la rubrique (category)
                                //  - son groupe (group),
                                //  - liste des layers,
                                //  - l'index des layers,
                                //  - type de configuration (filter): 0, 1 ou 2
                                //  - l'ordre interne des filtres
                                */
                                "metadata" : {
                                    "geoportail:category" : _mtdFilterCategory,
                                    "geoportail:filter" : _mtdFilterMode, // configuration : 0, 1 ou 2
                                    "geoportail:group" : null, // notion de groupe renseignée via l'editeur
                                    "geoportail:entry" : _mtdLayersId,
                                    "geoportail:index" : _mtdLayersIdx,
                                    "geoportail:order" : null // notion d'ordre renseigné via l'editeur
                                },
                                "layout" : {
                                    "visibility" : _tagVisible
                                },
                                "paint" : _tagPaint,
                                "filter" : _tagFilter
                            });
                        }
                        if (bFound) {
                            break;
                        }
                    }
                }
            }
        }
    }

    if (_style.layers.length === 0) {
        // eslint-disable-next-line no-console
        console.warn("Filtres utilisateurs : aucun 'layers' !?");
    }

    /* Exemple de style json pour un filtre attributaire (ex. Nature) :
    // {
    //     "version": 8,
    //     "name": "Nature",
    //     "zoom": 14,
    //     "center": [2.35,48.84],
    //     "bounds": [],
    //     "sources": {
    //         "Enseignement": {
    //             "type": "vector",
    //             "tiles": ["https://vectortiles.ign.fr/rok4server/1.0.0/Enseignement/{z}/{x}/{y}.pbf"]
    //         }
    //     },
    //     "layers": [
    //         {
    //             "id": "Collège",
    //             "type": "circle",
    //             "source": "Enseignement",
    //             "source-layer": "Enseignement",
    //             "layout": {
    //                 "visibility": "visible"
    //             },
    //             "filter" : ["===", "nature", "Collège"],
    //             "paint": null,
    //             "metadata" : {
    //                 "geoportail:category" : "Nature",
    //                 "geoportail:filter" : 0,
    //                 "geoportail:group" : null,
    //                 "geoportail:entry" : "style enseignement",
    //                 "geoportail:index" : 0,
    //                 "geoportail:order" : null
    //             }
    //         }
    //         // (...)
    //         // "Autre", "Science", "Enseignement primaire", "Université",
    //         // "Lycée", "Enseignement secondaire", "Enseignement supérieur",
    //     ]
    // }
    */

    return _style;
};

/******************************************************************************
* Methods Object
*******************************************************************************/

/**
 * Add a vector Layer MapBox to the map
 *
 * @param {Object} layerObj - geoportalLayer to add.
 * @param {Gp.LayerOptions} layerObj.geoportalLayerID - options of the layer
 *
 * @private
 */
OlMap.prototype._addMapBoxLayer = function (layerObj) {
    // carte courante
    var map = this.libMap;

    // "this" pour la closure
    var self = this;

    /* Les properties du vecteurs tuilés :
    // Elles permettent d'avoir une interactions avec le geoportail
    // ex. editeur
    // Liste :
    // - layer.set("mapbox-extension")
    //      objet
    //      enregistrement du tileJSON
    //      lecture seule
    // - layer.set("mapbox-layers")
    //      tableau (string)
    //      enregistrement des ID layers
    //      enregistrement des ID styles attributaires (!?)
    //      lecture seule
    //      interne à openlayers
    // - layer.set("mapbox-filters")
    //      objet
    //      options:filters & options:filtersSummary
    //      enregistrement des styles attributaires (json mapbox)
    //      lecture/ecriture
    //      maj à faire pour toute modification des styles attributaires !
    // - map.set("mapbox-styles")
    //      objet
    //      enregistrement des styles mapbox de toutes les couches
    //      (+ styles attributaires)
    //      accès > map.get("mapbox-styles")[layerID]
    //      lecture/ecriture
    //      maj à faire pour toute modification du fichier de style d'une couche !
    // - layer.set("mapbox-styles")
    //      objet
    //      enregistrement du style mapbox de la couche uniquement
    //      lecture/ecriture
    //      maj à faire pour toute modification du fichier de style de la couche !
    // - layer.set("mapbox-themes")
    //      objet
    //      options:styles & options:stylesSummary
    //      lecture seule
    // - layer.set("mapbox-status")
    //      objet
    //      enregistrement des statuts de la couche
    //      lecture/ecriture
    //      maj à faire si modification des selections du theme ou des filtres !
    */

    // closure avec "layerObj" en param :
    // layerObj = {
    //  couche1 : {options}
    //  couche2 : {options}
    // }
    (function (_layerObj) {
        // options
        var layerId = Object.keys(_layerObj)[0];
        var layerOpts = _layerObj[layerId];

        // doit on utiliser cette méthode pour les options communes ?
        // self._applyCommonLayerParams(layerOpts);

        // url du style par defaut
        // avec proxification en fonction des parametres de proxy...
        var _urlDefaultOrSelected = self.setProxy(layerOpts.url);

        /* Gestion de l'url selectionnée :
        // Les options nous donnent l'url du style par defaut.
        // Mais, il faut aussi gerer le cas où un theme est sélectionné via les options,
        // car c'est bien l'url du style (ou theme) sélectionné qui doit être utilisé par la suite !
        // De plus, on recherche si le style par defaut a été placé dans la liste des themes.
        // Si le style par defaut n'existe pas dans la liste des themes, on l'ajoute pour simplifier
        // les traitements ulterieurs...
        */
        if (Array.isArray(layerOpts.styles)) {
            var foundDefaultStyle = false; // recherche du style par defaut
            var foundSelectedStyle = false; // recherche du theme sélectionné
            for (var i = 0; i < layerOpts.styles.length; i++) {
                var t = layerOpts.styles[i];
                // algo assez simpliste... car on compare juste les urls
                // mais les urls devraient être uniques...
                if (t.url === layerOpts.url) {
                    // le theme par defaut est dans la liste,
                    // on prend donc en compte les valeurs
                    // "name", "thumbnail", "url", "description" de la liste des
                    // themes (à defaut des options "defaultTheme*") !
                    foundDefaultStyle = true;
                }
                if (t.selected) {
                    // l'url selectionnée devient l'url par defaut
                    _urlDefaultOrSelected = t.url;
                    foundSelectedStyle = true;
                }
            }
            // le style par defaut n'est pas dans la liste, alors on l'ajoute dans
            // dans la liste des themes...
            if (!foundDefaultStyle) {
                var _url = layerOpts.url;
                var _thumbnail = layerOpts.defaultStyleThumbnail || null;
                var _name = layerOpts.defaultStyleName || "Style par défaut";
                var _description = layerOpts.defaultStyleDescription || "Style par défaut";
                layerOpts.styles.unshift({
                    thumbnail : _thumbnail,
                    name : _name,
                    url : _url,
                    description : _description,
                    selected : !foundSelectedStyle
                });
            }
        }

        if (Array.isArray(layerOpts.filters)) {
            // cf. impl dans le tileJSON...
        }

        // traitements des styles/couches
        fetch(_urlDefaultOrSelected)
            .then(function (response) {
                if (response.ok) {
                    response.json()
                        .then(function (_glStyle) {
                            // fusion des surcharges de l'option "mapboxOptions"
                            var _overwrite = layerOpts.mapboxOptions;
                            if (_overwrite && Object.keys(_overwrite).length) {
                                var _lyrs = _overwrite.layers;
                                // fusion des layers only !
                                if (_lyrs) {
                                    var _idx = _glStyle.layers.reduce((acc, it) => (acc[it.id] = it, acc), {}); // eslint-disable-line
                                    for (var i = 0; i < _lyrs.length; i++) {
                                        if (_idx[_lyrs[i].id]) {
                                            Utils.mergeParams(_idx[_lyrs[i].id], _lyrs[i]);
                                        }
                                    }
                                }
                            }

                            // les sources
                            var _glSources = _glStyle.sources;

                            // les sources sont elles multiples ?
                            var _multiSources = (Object.keys(_glSources).length > 1) ? 1 : 0;

                            for (var _glSourceId in _glSources) {
                                // format ol (mvt ou geojson)
                                var vectorFormat = null;
                                // source ol
                                var vectorSource = null;
                                // couche ol
                                var vectorLayer = null;

                                if (_glSources.hasOwnProperty(_glSourceId)) {
                                    var _title = "";
                                    var _description = "";
                                    var _quicklookUrl = null;
                                    var _legends = null;
                                    var _metadata = null;
                                    var _originators = null;
                                    var _themes = null;
                                    var _filters = null;
                                    var _position = null;
                                    var _queryable = null;

                                    /* Gestion des metatdonnées du fichier de style (evolution) :
                                    // on recherche si des informations de metatdonnées sont disponibles
                                    // directement dans le fichier de style...
                                    // les informations de metadata ne viennent pas surchargées les options
                                    // déjà renseignées !
                                    // lecture des informations de métadonnées dans le style :
                                    // ex. metadata : {
                                    //    geoportail:[title | description | quicklookUrl | legends | originators | metadata | ...]
                                    // }
                                    */
                                    if (_glStyle.metadata) {
                                        for (var ns in _glStyle.metadata) {
                                            if (_glStyle.metadata.hasOwnProperty(ns)) {
                                                var _keys = ns.split(":");
                                                if (_keys[0] === "geoportail") {
                                                    var key = _keys[1];
                                                    if (key === "title" && !layerOpts.title) {
                                                        _title = layerOpts.title = _glStyle.metadata[ns];
                                                        continue;
                                                    }
                                                    if (key === "description" && !layerOpts.description) {
                                                        _description = layerOpts.description = _glStyle.metadata[ns];
                                                        continue;
                                                    }
                                                    if (key === "quicklookUrl" && !layerOpts.quicklookUrl) {
                                                        _quicklookUrl = layerOpts.quicklookUrl = _glStyle.metadata[ns];
                                                        continue;
                                                    }
                                                    if (key === "legends" && !layerOpts.legends) {
                                                        _legends = layerOpts.legends = _glStyle.metadata[ns];
                                                        continue;
                                                    }
                                                    if (key === "metadata" && !layerOpts.metadata) {
                                                        _metadata = layerOpts.metadata = _glStyle.metadata[ns];
                                                        continue;
                                                    }
                                                    if (key === "originators" && !layerOpts.originators) {
                                                        _originators = layerOpts.originators = _glStyle.metadata[ns];
                                                        continue;
                                                    }
                                                    if (key === "styles" && !layerOpts.styles) {
                                                        _themes = layerOpts.styles = _glStyle.metadata[ns];
                                                        continue;
                                                    }
                                                    if (key === "filters" && !layerOpts.filters) {
                                                        _filters = layerOpts.filters = _glStyle.metadata[ns];
                                                        continue;
                                                    }
                                                }
                                            }
                                        }
                                    }

                                    // ajout des informations issues des options :
                                    // titre et description par defaut
                                    if (!layerOpts.title) {
                                        layerOpts.title = "Couche MapBox";
                                    }
                                    if (!layerOpts.description) {
                                        layerOpts.description = "Couche MapBox";
                                    }
                                    // et le reste des informations issues des options :
                                    _title = (_multiSources) ? layerOpts.title + "(" + _glSourceId + ")" : layerOpts.title;
                                    _description = layerOpts.description;
                                    _quicklookUrl = layerOpts.quicklookUrl;
                                    _metadata = layerOpts.metadata;
                                    _legends = layerOpts.legends;
                                    _originators = layerOpts.originators;
                                    _position = layerOpts.position;
                                    _queryable = (typeof layerOpts.queryable === "undefined") ? true : layerOpts.queryable;

                                    // TODO
                                    // cas où les themes/filtres sont enregistrés sur une url
                                    // vers un fichier json par exemple.

                                    // gestion des themes avec les selections utilisateur.
                                    var _selectedTheme = {};
                                    // options de themes (tableau)
                                    if (Array.isArray(layerOpts.styles)) {
                                        // enregistrement des options sur les themes
                                        _themes = layerOpts.styles;
                                        // selections utilisateurs (options selected)
                                        // > { key: null, index: 0 }
                                        var idxSelectedStyle = null; // index du style sélectionné (par defaut : 0)
                                        var keySelectedStyle = null; // la clef = nom du fichier de style sans l'extension
                                        for (var p = 0; p < layerOpts.styles.length; p++) {
                                            var t = layerOpts.styles[p];
                                            if (t.selected) {
                                                idxSelectedStyle = p;
                                                keySelectedStyle = t.url.match(/([^/]+)(?=\.\w+$)/)[1];
                                                _selectedTheme = {
                                                    index : idxSelectedStyle,
                                                    key : keySelectedStyle
                                                };
                                            }
                                        }
                                    }

                                    // gestion des filtres attributaires avec
                                    // les selections par l'utilisateur.
                                    var _selectedFilters = [];
                                    // options de filtres (tableau)
                                    if (Array.isArray(layerOpts.filters)) {
                                        // enregistrement des options sur les filtres
                                        _filters = layerOpts.filters;
                                        // gestion des statuts des filtres
                                        // > [{k:categorie1, v: [0,1,0,1]},{k:categorie2, v:[0,0,0,0]}]
                                        for (var n = 0; n < layerOpts.filters.length; n++) {
                                            var f = layerOpts.filters[n];
                                            // à cette instant, si aucune selection n'est renseignée, on ne connait
                                            // pas encore le nombre de valeurs pour un filtre.
                                            // seul le fichier metadata.json peut nous fournir cette information !
                                            // donc, il y'a une surcharge au niveau de la lecture du tileJSON...
                                            var selected = [];
                                            // y'a t il une manipulation des selections des filtres ?
                                            if (f.configuration && f.configuration.selected && Array.isArray(f.configuration.selected)) {
                                                if (f.configuration.selected.length) {
                                                    selected = f.configuration.selected;
                                                }
                                            }
                                            _selectedFilters.push({
                                                k : f.filterName,
                                                v : selected
                                            });
                                        }
                                    }

                                    // TODO
                                    // gestion des selections des layers
                                    var _selectedLayers = [];

                                    // source mapbox courante
                                    var _glSource = _glSources[_glSourceId];

                                    // type mapbox
                                    // la construction de la couche est en fonction du type :
                                    // - GeoJSON
                                    // - Vector Tile
                                    // - Vector Tile avec metadata
                                    var _glType = _glSource.type;

                                    if (_glType === "vector") {
                                        // url du tilejson ou flux mapbox
                                        var _glUrl = _glSource.url;
                                        // url du service tuilé
                                        var _glTiles = _glSource.tiles;
                                        // sprites
                                        var _glSprite = _glStyle.sprite;

                                        // remplacement d'un flux mapbox en service tuilé
                                        if (_glUrl && _glUrl.indexOf("mapbox://") === 0) {
                                            _glTiles = ["a", "b", "c", "d"].map(function (host) {
                                                var path = _glUrl.replace("mapbox://", "");
                                                var accessToken = _urlDefaultOrSelected.split("?")[1];
                                                return "https://" +
                                                    host + ".tiles.mapbox.com/v4/" +
                                                    path + "/{z}/{x}/{y}.vector.pbf?" +
                                                    accessToken;
                                            });

                                            // conversion des sprites sur un autre scheme que "mapbox://"
                                            if (_glSprite.indexOf("mapbox://") === 0) {
                                                var s = _urlDefaultOrSelected.split("?");
                                                _glStyle.sprite = s[0] + "/sprite" + "?" + s[1];
                                            }
                                        }

                                        if (_glTiles) {
                                            // service tuilé et/ou mapbox
                                            vectorFormat = new MVT({
                                                // dataProjection
                                                // featureProjection
                                                featureClass : RenderFeature
                                            });
                                            // cf. https://openlayers.org/en/latest/apidoc/module-ol_source_VectorTile-VectorTile.html
                                            vectorSource = new VectorTileSource({
                                                attributions : _glSource.attribution,
                                                // overlaps
                                                // projection
                                                format : vectorFormat,
                                                tileGrid : olCreateXYZTileGrid({ // TODO scheme tms ?
                                                    extent : _glSource.bounds, // [minx, miny, maxx, maxy]
                                                    maxZoom : _glSource.maxzoom || 22,
                                                    minZoom : _glSource.minzoom || 1,
                                                    tileSize : _glSource.tileSize || 256
                                                }),
                                                urls : _glTiles
                                            });
                                            vectorSource._title = _title;
                                            vectorSource._description = _description;
                                            vectorSource._quicklookUrl = _quicklookUrl;
                                            vectorSource._metadata = _metadata;
                                            vectorSource._legends = _legends;
                                            vectorSource._originators = _originators;
                                            vectorLayer = new VectorTileLayer({
                                                source : vectorSource,
                                                visible : false,
                                                zIndex : _position, // FIXME gerer l'ordre sur des multisources ?
                                                declutter : true // utile ? option ?
                                            });
                                            vectorLayer.id = _glSourceId;
                                        } else if (_glUrl) {
                                            // service avec un tilejson
                                            vectorFormat = new MVT({
                                                // dataProjection ?
                                                // featureProjection ?
                                                featureClass : RenderFeature
                                            });
                                            vectorLayer = new VectorTileLayer({
                                                visible : false,
                                                zIndex : _position,
                                                declutter : true // utile ? option ?
                                            });
                                            vectorLayer.id = _glSourceId;
                                            var vectorTileJson = new TileJSONSource({
                                                url : _glUrl
                                            });
                                            // FIXME pb async !
                                            // lecture du tilejson avec extension IGN,
                                            // les extensions sont enregistrées
                                            // dans les propriétés de la couche : layer.set(mapbox-extension)
                                            // pour une utilisation ulterieur (ex. editeur)
                                            var _key = vectorTileJson.on("change", function (e) {
                                                if (vectorTileJson.getState() === "error") {
                                                    // FIXME Exception ou message ?
                                                    // l'exception est trop brutale...,
                                                    // elle bloque l'afffichage des données !
                                                    // throw new Error("HTTP TileJSON error (metadata.json)");
                                                    // eslint-disable-next-line no-console
                                                    console.error("HTTP TileJSON error (metadata.json)");
                                                }
                                                if (vectorTileJson.getState() === "ready") {
                                                    var tileJSONContent = vectorTileJson.getTileJSON();

                                                    // on enregistre les extensions pour une utilisation
                                                    // eventuelle (ex. editeur)
                                                    // > map.set("mapbox-extensions")
                                                    vectorLayer.set("mapbox-extensions", tileJSONContent["vector_layers"]);

                                                    // services de tuiles
                                                    // il est possible qu'il ait plusieurs services de tuiles !
                                                    var tiles = Array.isArray(tileJSONContent.tiles) ? tileJSONContent.tiles : [tileJSONContent.tiles];
                                                    for (var i = 0; i < tiles.length; i++) {
                                                        var tile = tiles[i];
                                                        if (tile.indexOf("http") !== 0) {
                                                            tiles[i] = _glUrl + tile;
                                                        }
                                                    }
                                                    // source
                                                    vectorSource = new VectorTileSource({
                                                        attributions : vectorTileJson.getAttributions() || tileJSONContent.attribution,
                                                        format : vectorFormat,
                                                        // overlaps ?
                                                        // projection ?
                                                        tileGrid : olCreateXYZTileGrid({
                                                            extent : _glSource.bounds, // [minx, miny, maxx, maxy]
                                                            maxZoom : tileJSONContent.maxzoom || _glSource.maxzoom || 22,
                                                            minZoom : tileJSONContent.minzoom || _glSource.minzoom || 0,
                                                            tileSize : tileJSONContent.tileSize || _glSource.tileSize || 256
                                                        }),
                                                        urls : tiles
                                                    });
                                                    vectorSource._title = _title;
                                                    vectorSource._description = _description;
                                                    vectorSource._quicklookUrl = _quicklookUrl;
                                                    vectorSource._metadata = _metadata;
                                                    vectorSource._legends = _legends;
                                                    vectorSource._originators = _originators;
                                                    vectorLayer.setSource(vectorSource);

                                                    // on ajoute les filtres attributaires en fonction de la configuration demandée.
                                                    // les filtres sont ajoutés directement dans l'objet _glStyle.
                                                    // on peut aussi gérer les filtres sélectionnés.
                                                    if (Array.isArray(layerOpts.filters)) {
                                                        // on boucle sur les filtres utilisateurs
                                                        for (var ii = 0; ii < layerOpts.filters.length; ii++) {
                                                            var _filterOptions = layerOpts.filters[ii];

                                                            var _conf = _filterOptions.configuration || {};
                                                            var _selected = (_conf) ? _conf.selected : [];
                                                            var _type = (_conf) ? _conf.type : 0;
                                                            // filtre courant
                                                            var _filter = {
                                                                tableName : null, // recherche sur une table : ex. "table.champ"
                                                                propertyName : _filterOptions.propertyName,
                                                                filterName : _filterOptions.filterName,
                                                                selected : _selected,
                                                                type : _type
                                                            };

                                                            // le champ "propertyName" contient il le nom d'une table ?
                                                            // ex. "table.champ"
                                                            if (_filter.propertyName.indexOf(".") !== -1) {
                                                                var d = _filter.propertyName.split(".");
                                                                _filter.tableName = d[0];
                                                                _filter.propertyName = d[1];
                                                            }

                                                            // l'url du service
                                                            // il est possible qu'il ait plusieurs services de tuiles !
                                                            var _urls = null;
                                                            if (vectorLayer.getSource()) {
                                                                _urls = vectorLayer.getSource().urls;
                                                            }

                                                            // la source courante (id)
                                                            var _source = _glSourceId;

                                                            // les styles (json)
                                                            var _styles = _glStyle;

                                                            // les layers issus du tileJSON
                                                            var _tjson = tileJSONContent;

                                                            // on créé les styles (json) pour le filtre utilisateur courant.
                                                            // cf. fonction _createFilterStyle() pour plus d'informations
                                                            var _filterStyle = _createFilterStyle(
                                                                _source, // id de la source
                                                                _urls, // urls des services
                                                                _filter, // filtre : objet
                                                                _tjson, // "metadata.json"
                                                                _styles // style json complet
                                                            );

                                                            // some entries ?
                                                            var _nlayers = _filterStyle.layers;
                                                            if (!_nlayers) {
                                                                break;
                                                            }

                                                            // les selections des valeurs du filtre sont elles renseignées ?
                                                            // si oui, les valeurs sont donc déjà renseignées
                                                            // si non, il est utile de mettre les valeurs par defaut.
                                                            if (_filter.selected && Array.isArray(_filter.selected) && _filter.selected.length) {
                                                                // nothing to do...
                                                            } else {
                                                                // il n'existe pas d'information sur les valeurs des filtres
                                                                // sélectionnées, on va donc mettre à jour cette information.
                                                                if (_selectedFilters) {
                                                                    // maj des selections par defaut
                                                                    // conf:undef -> (1)
                                                                    // conf:0 -> (1)
                                                                    // conf:1 -> (0)
                                                                    // conf:2 -> (0)
                                                                    for (var jj = 0; jj < _selectedFilters.length; jj++) {
                                                                        if (_selectedFilters[jj].k === _filter.filterName) {
                                                                            // Array.fill() -> pas compatibilité IE 11 !
                                                                            _selectedFilters[jj].v = Array(_nlayers.length).fill((_filter.type) ? 0 : 1);
                                                                            break;
                                                                        }
                                                                    }
                                                                }
                                                            }

                                                            // on ajoute les styles créés à partir du filtre attributaire
                                                            // dans le style principale
                                                            for (var kk = 0; kk < _filterStyle.layers.length; kk++) {
                                                                // FIXME
                                                                // si les filtres et les "layers" portent le même identifiant,
                                                                // l'ajout des filtres va automatiquement doublonner
                                                                // la properties interne : "mapbox-layers"
                                                                _glStyle.layers.push(_filterStyle.layers[kk]);
                                                            }

                                                            // FIXME
                                                            // on se garde sous le coude le style brute pour un filtre attributaire
                                                            // via les options, ce style sera archivé dans la properties "mapbox-filters"...
                                                            _filterOptions.style = _filterStyle;
                                                        }
                                                    }

                                                    olObservableUnByKey(_key);
                                                }
                                            });
                                        }
                                    } else if (_glType === "geojson") {
                                        // FIXME
                                        // - cas avec un objet de type features ?
                                        // - cas avec une url relative ?
                                        var _glData = _glSource.data;

                                        vectorFormat = new GeoJSON(
                                            // dataProjection ?
                                            // featureProjection ?
                                        );
                                        vectorSource = new VectorTileSource({
                                            attributions : _glSource.attribution,
                                            // overlaps ?
                                            // projection ?
                                            format : vectorFormat,
                                            url : _glData
                                        });
                                        vectorSource._title = _title;
                                        vectorSource._description = _description;
                                        vectorSource._quicklookUrl = _quicklookUrl;
                                        vectorSource._metadata = _metadata;
                                        vectorSource._legends = _legends;
                                        vectorSource._originators = _originators;
                                        vectorLayer = new VectorTileLayer({
                                            source : vectorSource,
                                            visible : false,
                                            zIndex : _position, // FIXME gerer l'ordre sur des multisources ?
                                            declutter : true // utile ? option ?
                                        });
                                        vectorLayer.id = _glSourceId;
                                    } else {
                                        self.logger.warn("Type MapBox format unknown !");
                                        return; // FIXME promise ?
                                    }

                                    // FIXME gestion du zIndex (option position) sur du multi-source !?

                                    // parametre à transmettre à la fonction auto-invoquée
                                    var params = {
                                        id : _glSourceId,
                                        styles : _glStyle,
                                        layer : vectorLayer,
                                        selectedTheme : _selectedTheme,
                                        selectedFilters : _selectedFilters,
                                        selectedLayers : _selectedLayers,
                                        // ce n'est pas très dynamique comme manière de faire passer les options !
                                        options : {
                                            visibility : layerOpts.visibility,
                                            queryable : _queryable,
                                            opacity : layerOpts.opacity,
                                            grayScaled : layerOpts.grayScaled,
                                            position : _position,
                                            zoomToExtent : layerOpts.zoomToExtent,
                                            url : layerOpts.url,
                                            defaultStyleName : layerOpts.defaultStyleName,
                                            defaultStyleThumbnail : layerOpts.defaultStyleThumbnail,
                                            defaultStyleDescription : layerOpts.defaultStyleDescription,
                                            format : layerOpts.format,
                                            mapboxOptions : layerOpts.mapboxOptions,
                                            stylesSummary : layerOpts.stylesSummary,
                                            styles : _themes,
                                            filtersSummary : layerOpts.filtersSummary,
                                            filters : _filters,
                                            title : _title,
                                            description : _description,
                                            quicklookUrl : _quicklookUrl,
                                            metadata : _metadata,
                                            legends : _legends,
                                            originators : _originators
                                        }
                                    };
                                    // fonction auto-invoquée
                                    (function (p) {
                                        // FIXME faut il ajouter le style de type background ?
                                        // fonction de style de la couche
                                        var setStyle = function () {
                                            applyStyleOlms(p.layer, p.styles, p.id)
                                                .then(function () {
                                                    // gestion de la visibilité
                                                    var visibility = (typeof layerOpts.visibility === "undefined") ? true : layerOpts.visibility;
                                                    p.layer.setVisible(visibility);
                                                    p.layer.setOpacity(layerOpts.opacity || 1);
                                                })
                                                .then(function () {
                                                    var zoomToExtent = p.options.zoomToExtent || false;
                                                    if (zoomToExtent) {
                                                        // zoom sur l'étendue avec l'option zoomToExtent
                                                        var source = p.layer.getSource();
                                                        if (map.getView() && source && source.getExtent) {
                                                            var key = source.on("change", function () {
                                                                var _sourceExtent = source.getExtent();
                                                                var _stateExtent = source.getState();
                                                                if (_stateExtent === "ready" && _sourceExtent[0] !== Infinity) {
                                                                    olObservableUnByKey(key);
                                                                    map.getView().fit(_sourceExtent, {
                                                                        maxZoom : 18
                                                                    });
                                                                }
                                                            });
                                                            setTimeout(function () {
                                                                source.dispatchEvent("change");
                                                            }, 100);
                                                        } else {
                                                            // gestion du centre de la cate si center renseigné !
                                                            var projCode = map.getView().getProjection().getCode();
                                                            if (map.getView() && p.styles.center && p.styles.center.length) {
                                                                map.getView().setCenter(olTransformProj(p.styles.center, "EPSG:4326", projCode));
                                                            }
                                                            // gestion du zoom sur la carte si zoom renseigné !
                                                            if (map.getView() && (p.styles.zoom || p.styles.zoom === 0)) {
                                                                map.getView().setZoom(p.styles.zoom);
                                                            }
                                                        }
                                                    }
                                                })
                                                .then(function () {
                                                    // gestion du GFI
                                                    // l'option 'queryable' ne fonctionne que si le controle GFI est
                                                    // present sur la carte..., et actif !
                                                    var GfiControl = self.getLibMapControl("GetFeatureInfo");
                                                    if (GfiControl && GfiControl.isActive()) {
                                                        var gfiLayers = GfiControl.getLayers();
                                                        // par defaut, le controle GFI ne devrait pas ajouter pas les couches
                                                        // vecteurs dans sa liste de couches requetables...
                                                        // si on renseigne queryable:true, on doit ajouter cette couche de la liste...
                                                        // mais, on verifie qu'elle n'exsite pas déjà !
                                                        if (p.options.queryable === true) {
                                                            var bfound = false;
                                                            for (var i = 0; i < gfiLayers.length; i++) {
                                                                if (gfiLayers[i].obj === p.layer) {
                                                                    bfound = true;
                                                                }
                                                            }
                                                            if (!bfound) {
                                                                gfiLayers.push({
                                                                    obj : p.layer,
                                                                    event : "singleclick",
                                                                    infoFormat : "" // peu importe !?
                                                                });
                                                            }
                                                        }
                                                        // si on renseigne queryable:false, on doit retirer cette couche de la liste...
                                                        if (p.options.queryable === false) {
                                                            var _layers = [];
                                                            for (var ii = 0; ii < gfiLayers.length; ii++) {
                                                                if (gfiLayers[ii].obj !== p.layer) {
                                                                    _layers.push(gfiLayers[ii]);
                                                                }
                                                            }
                                                            GfiControl.setLayers(_layers);
                                                        }
                                                    }
                                                })
                                                .then(function () {
                                                    // other stuff..
                                                })
                                                .catch(function (e) {
                                                    // TODO styles utilisateurs par defaut !
                                                    // throw new Error("Apply Style error = " + e.message);
                                                    self.logger.warn("Apply Style error = " + e.message);
                                                });
                                        };

                                        // enregistrement du layer
                                        var _id = (_multiSources) ? layerId + "-" + p.id : layerId;
                                        self._layers.push({
                                            id : _id,
                                            obj : p.layer,
                                            options : p.options
                                        });

                                        // ajout du layer sur la carte
                                        map.addLayer(p.layer);

                                        // etat des layers en cours
                                        self.logger.warn(p.layer, self._layers);

                                        // ajout du style complet dans la carte pour une utilisation
                                        // eventuelle (ex. editeur)
                                        // > map.set("mapbox-styles")
                                        var _allStyles = map.get("mapbox-styles") || {};
                                        _allStyles[_id] = p.styles;
                                        map.set("mapbox-styles", _allStyles);

                                        // ajout du style de la couche uniquement
                                        // (multisource === plusieurs couches !)
                                        // pour une utilisation eventuelle (ex. editeur)
                                        // > layer.set("mapbox-styles")
                                        var _stylesClone = JSON.parse(JSON.stringify(p.styles)); // clone
                                        var _glLayers = _stylesClone.layers;
                                        for (var ii = 0; ii < _glLayers.length; ii++) {
                                            var _glLayer = _glLayers[ii];
                                            // on ecarte les sources differentes : 1 source = 1 layer
                                            if (_glLayer.source !== p.id) {
                                                _glLayers.splice(ii, 1);
                                                continue;
                                            }
                                            // et, on ecarte les filtres attributaires
                                            if (_glLayer.metadata &&
                                                _glLayer.metadata.hasOwnProperty("geoportail:category") &&
                                                _glLayer.metadata.hasOwnProperty("geoportail:filter")) {
                                                _glLayers.splice(ii, 1);
                                                continue;
                                            }
                                        }
                                        p.layer.set("mapbox-styles", _stylesClone);

                                        // ajout des differents themes de la couche
                                        // pour une utilisation eventuelle (ex. portail ou editeur)
                                        // > layer.set("mapbox-themes")
                                        p.layer.set("mapbox-themes", {
                                            stylesSummary : p.options.stylesSummary,
                                            styles : p.options.styles
                                        });

                                        // ajout des differents filtres attributaires de la couche
                                        // pour une utilisation eventuelle (ex. portail ou editeur)
                                        // > layer.set("mapbox-filters")
                                        p.layer.set("mapbox-filters", {
                                            filtersSummary : p.options.filtersSummary,
                                            filters : p.options.filters
                                        });

                                        // ajout des statuts
                                        // - themes,
                                        // - filtres,
                                        // - layers.
                                        // pour une utilisation eventuelle (ex. portail ou editeur)
                                        // ces statuts sont aussi transmis au permalien...
                                        // > layer.set("mapbox-status")
                                        p.layer.set("mapbox-status", {
                                            "theme" : p.selectedTheme,
                                            "layers" : p.selectedLayers, // TODO !
                                            "filters" : p.selectedFilters
                                        });

                                        // gestion du style N/B
                                        if (p.options.grayScaled) {
                                            // transformation du json en N/B
                                            // le style "gray" n'est pas enregistré dans
                                            // les properties !
                                            // c'est un style temporaire...
                                            p.styles = _transformGrayStyle(_stylesClone);
                                            if (!p.styles) {
                                                // eslint-disable-next-line no-console
                                                console.error("Erreur de transformation en N/B !?");
                                            }
                                        }

                                        // application du style
                                        if (p.layer.getSource()) {
                                            setStyle();
                                        } else {
                                            p.layer.once("change:source", setStyle);
                                        }

                                        // Maintenant que la couche mapBox a été ajoutée de manière asynchrone,
                                        // on s'assure de bien remettre à jour les indexs des couches et de
                                        // reordonner les couches correctement (désynchro des zIndex dans le cas d'un switch 3D->2D)
                                        // On entre pas dans la condition si les IDs des couches ne correspondent pas entre
                                        // les couches contenues dans_layers et mapOptions.layersOptions
                                        // cf. FIXME couche ORTHO dans afterGetConfig
                                        for (var i = 0; i < self._layers.length; i++) {
                                            var layerName = self._layers[i].id;
                                            if (self.mapOptions.layersOptions && self.mapOptions.layersOptions[layerName] && self.mapOptions.layersOptions[layerName].position !== undefined) {
                                                self._layers[i].options.position = self.mapOptions.layersOptions[layerName].position;
                                                self._layers[i].obj.setZIndex(self._layers[i].options.position);
                                            }
                                        }

                                        // maj du gestionnaire de couche
                                        self._addLayerConfToLayerSwitcher(p.layer, p.options);

                                        // FIXME pb async !
                                        // On est dans un thread async (à cause du fetch),
                                        // et l'abonnement (cf. IMap.prototype.addLayers)
                                        // est executé avant que la couche soit ajouté
                                        // à l'objet this._layers...
                                        // On realise donc un reabonnement à la volée
                                        // dans ce thread afin d'être sûr d'avoir nos
                                        // abonnements corrects !
                                        self._resetLayerChangedEvent();
                                    })(params);
                                }
                            }
                        })
                        .catch(function (e) {
                            throw new Error("Parsing JSON error = " + e.message);
                        });
                } else {
                    throw new Error("HTTP error (" + response.url + ") = " + response.status + " (" + response.statusText + ")");
                }
            })
            .catch(function (e) {
                // FIXME ?
                // console.error(e.message);
            });
    })(layerObj);
};
