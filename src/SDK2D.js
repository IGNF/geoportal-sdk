import {MapLoader} from "./Utils/MapLoader";
import {OlMap} from "./OpenLayers/OlMap";
import Logger from "./Utils/LoggerByDefault";
// CSS
import "../res/OpenLayers/OlMap.css";
// import du bundle openlayers
import * as ol from "ol-dist";
// import des extensions openlayers (et des CRS ?)
import { olExtended } from "geoportal-extensions-openlayers";

var logger = Logger.getLogger("SDK2D");
logger.log("Chargement SDK 2D...");

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

// on fusionne les fonctionnalités openlayers
// (olExtended ne devrait il pas comprendre que les fonctionnalités étendues ?)
// ol -> Gp.olExtended
deepCopy(ol, olExtended);
// Gp.olExtended -> ol
deepCopy(olExtended, ol);

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

MapLoader.__class2d = OlMap;
export {MapLoader as Map};

export const sdkVersion = "__GPSDKVERSION__";
export const sdkDate = "__GPDATE__";
