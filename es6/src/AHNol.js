import Map from "./Map";
import OlMap from "./OpenLayers/OL";

export * from "gp";

Map.__classOl = OlMap;
Map._class = Map.__classOl.prototype; // IMap !
export {Map};

export const sdkVersion = "__GPSDKVERSION__";
export const sdkDate = "__GPDATE__";
