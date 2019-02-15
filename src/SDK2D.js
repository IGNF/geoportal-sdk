import {MapLoader} from "./Utils/MapLoader";
import {OlMap} from "./OpenLayers/OlMap";
// CSS
import "../res/OpenLayers/OlMap.css";

export * from "geoportal-extensions-openlayers";

MapLoader.__class2d = OlMap;
export {MapLoader as Map};

export const sdkVersion = "__GPSDKVERSION__";
export const sdkDate = "__GPDATE__";
