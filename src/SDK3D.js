import {Map} from "./Map";
import {OL} from "./OpenLayers/OL";
import {IT} from "./Itowns/IT";
import Logger from "./Utils/LoggerByDefault";
import "../res/Itowns/IT.css";
import "../res/OpenLayers/OL.css";

var logger = Logger.getLogger("SDK3D");

export * from "gp";

// on declare les ns dans root global
// auto detection des lib. chargées
if (typeof OL !== "undefined" &&
     typeof IT !== "undefined") {
    logger.log("Lib. ol et itowns détectées !");
    Map.__classOl = OL;
    Map.__classItowns = IT;
    Map._class = Map.__classOl.prototype; // IMap !
} else if (typeof OL !== "undefined") {
    logger.log("Lib. ol détectée !");
    Map.__classOl = OL;
    Map._class = Map.__classOl.prototype; // IMap !
} else if (typeof IT !== "undefined") {
    logger.log("Lib. itowns détectée !");
    Map.__classItowns = IT;
    Map._class = Map.__classItowns.prototype; // IMap !
} else {
    logger.log("Aucune lib. détectée !?");
}

export {Map};

export const sdkVersion = "__GPSDKVERSION__";
export const sdkDate = "__GPDATE__";
