import {MapLoader} from "./Utils/MapLoader";
import {OlMap} from "./OpenLayers/OlMap";
import {ItMap} from "./Itowns/ItMap";
import Logger from "./Utils/LoggerByDefault";
// CSS
import "../res/Itowns/ItMap.css";
import "../res/OpenLayers/OlMap.css";

// import du bundle openlayers
import * as ol from "ol-dist";
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
deepCopy(ol, olExtended);
// Gp.olExtended -> ol
deepCopy(olExtended, ol);

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

export const sdkVersion = "__GPSDKVERSION__";
export const sdkDate = "__GPDATE__";
