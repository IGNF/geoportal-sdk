/**
* Global variable Gp.
*
* The following variables are aslo global :
*   - proj4 (exposed by geoportal extensions dependance),
*   - ol,
*   - olms,
*   - itowns,
*   - eventbus (exposed by geoportal extensions dependance)
*
* @module Gp
* @alias Gp
* @desc
*
* This is the global variable that is exposed in the browser environment.
* Content is composed of constructor, functions and properties...
*
* > Config:  (...)
*
* > ColorUtils: (...)
* > LayerUtils: (...)
* > MathUtils: (...)
* > ProxyUtils: (...)
*
* > olExtended: (...)
* > olUtils: (...)
* > olExtDate: "YYYY-MM-DD"
* > olExtVersion: "X.X.X"
*
* > Error: (...)
* > Helper: (...)
* > Protocols: (...)
* > Services: (...)
* > servicesDate: "YYYY-MM-DD"
* > servicesVersion: "X.X.X"
*
* > itownsExtended: (...)
* > itownsExtVersion: "X.X.X"
* > itownsExtDate: "YYYY-MM-DD"
*
* > Map: (...)
* > sdkVersion: "X.X.X"
* > sdkDate: "YYYY-MM-DD"
*/

import Pkg from "../package";
import {MapLoader} from "./Utils/MapLoader";
import {OlMap} from "./OpenLayers/OlMap";
import {ItMap} from "./Itowns/ItMap";
import Logger from "./Utils/LoggerByDefault";
// CSS
import "../res/Itowns/ItMap.css";
import "../res/OpenLayers/OlMap.css";

// import openlayers
import { default as olDist } from "ol-dist";
// import des extensions openlayers
import { olExtended } from "geoportal-extensions-openlayers";

var logger = Logger.getLogger("SDK3D");
logger.log("Chargement SDK 3D...");

function deepCopy (source, target) {
    for (var prop in source) {
        if (source.hasOwnProperty(prop)) {
            if (!target.hasOwnProperty(prop)) {
                target[prop] = source[prop];
            } else if (typeof source[prop] === "object") {
                deepCopy(source[prop], target[prop]);
            }
        }
    }
}

// fusion des fonctionnalités openlayers
// ol -> Gp.olExtended
deepCopy(olDist, olExtended);
// Gp.olExtended -> ol
deepCopy(olExtended, olDist);

// ol extended + Services + Outils
export {
    Services,
    Error,
    Helper,
    Protocols,
    servicesDate, servicesVersion,
    LayerUtils,
    ProxyUtils,
    ColorUtils,
    MathUtils,
    olUtils, olExtVersion, olExtDate,
    olExtended
} from "geoportal-extensions-openlayers";

// only itowns extended
export {
    itownsExtVersion, itownsExtDate,
    itownsExtended
} from "geoportal-extensions-itowns";

MapLoader.__class2d = OlMap;
MapLoader.__class3d = ItMap;
export {MapLoader as Map};

export const sdkVersion = Pkg.SDK3DVersion;
export const sdkDate = Pkg.date;

// "ol" is exposed into window (for a build bundle) with webpack.
if (window && window.ol) {
    window.ol = olDist;
}
