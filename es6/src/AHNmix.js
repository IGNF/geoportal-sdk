import Map from "./Map";
import OlMap from "./OpenLayers/OL";
import ItMap from "./Itowns/IT";
import Logger from "./Utils/LoggerByDefault";

var logger = Logger.getLogger("AHNmix");

export * from "gp";

// on declare les ns dans root global
// auto detection des lib. chargées
if (typeof OlMap !== "undefined" &&
     typeof ItMap !== "undefined") {
    logger.log("Lib. ol et itowns détectées !");
    Map.__classOl = OlMap;
    Map.__classItowns = ItMap;
    Map._class = Map.__classOl.prototype; // IMap !
} else if (typeof OlMap !== "undefined") {
    logger.log("Lib. ol détectée !");
    Map.__classOl = OlMap;
    Map._class = Map.__classOl.prototype; // IMap !
} else if (typeof ItMap !== "undefined") {
    logger.log("Lib. itowns détectée !");
    Map.__classItowns = ItMap;
    Map._class = Map.__classItowns.prototype; // IMap !
} else {
    logger.log("Aucune lib. détectée !?");
}

export {Map};

export const sdkVersion = "__GPSDKVERSION__";
export const sdkDate = "__GPDATE__";
