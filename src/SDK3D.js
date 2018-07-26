import {MapLoader} from "./Utils/MapLoader";
import {OlMap} from "./OpenLayers/OlMap";
import {ItMap} from "./Itowns/ItMap";
import Logger from "./Utils/LoggerByDefault";
import "../res/Itowns/ItMap.css";
import "../res/OpenLayers/OlMap.css";

var logger = Logger.getLogger("SDK3D");

export * from "gp";

// on declare les ns dans root global
// auto detection des lib. chargées
if (typeof OlMap !== "undefined" &&
     typeof ItMap !== "undefined") {
    logger.log("Lib. ol et itowns détectées !");
    MapLoader.__class2d = OlMap;
    MapLoader.__class3d = ItMap;
} else if (typeof OlMap !== "undefined") {
    logger.log("Lib. ol détectée !");
    MapLoader.__class2d = OlMap;
} else if (typeof ItMap !== "undefined") {
    logger.log("Lib. itowns détectée !");
    MapLoader.__class3d = ItMap;
} else {
    logger.log("Aucune lib. détectée !?");
}

export {MapLoader as Map};

export const sdkVersion = "__GPSDKVERSION__";
export const sdkDate = "__GPDATE__";
