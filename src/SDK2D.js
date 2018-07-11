import {Map} from "./Map";
import {OL} from "./OpenLayers/OL";
import "../res/OpenLayers/OL.css";

export * from "gp";

Map.__classOl = OL;
Map._class = Map.__classOl.prototype; // IMap !
export {Map};

export const sdkVersion = "__GPSDKVERSION__";
export const sdkDate = "__GPDATE__";
