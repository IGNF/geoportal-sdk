import Pkg from "../package.json";
import { MapLoader } from "./Utils/MapLoader";
import { OlMap } from "./OpenLayers/OlMap";
import Logger from "./Utils/LoggerByDefault";
// CSS
import "./OpenLayers/CSS/OlMap.css";
// import openlayers
import olDist from "./Utils/dist-openlayers/index";
// import des extensions openlayers (et des CRS ?)
import { olExtended } from "geoportal-extensions-openlayers";

var logger = Logger.getLogger("SDK2D");
logger.log("Chargement SDK 2D...");

function deepCopy (source, target) {
    // FIXME Implementing Tail Call Elimination
    function tce (source, target) {
        for (var prop in source) {
            if (source.hasOwnProperty(prop)) {
                if (!target.hasOwnProperty(prop)) {
                    target[prop] = source[prop];
                } else if (typeof source[prop] === "object") {
                    tce(source[prop], target[prop]);
                }
            }
        }
    }
    return tce(source, target);
}

// on fusionne les fonctionnalités openlayers / étendues
// Gp.olExtended -> ol
deepCopy(olExtended, olDist);
// ol -> Gp.olExtended
deepCopy(olDist, olExtended);

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
export { MapLoader as Map };

export const sdkVersion = Pkg.SDK2DVersion;
export const sdkDate = Pkg.date;

// "ol" is exposed into window (for a build bundle) with webpack.
if (window && window.ol) {
    window.ol = olDist;
}
