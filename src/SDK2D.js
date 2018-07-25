import {MapLoader} from "./Utils/MapLoader";
import {OlMap} from "./OpenLayers/OlMap";
import "../res/OpenLayers/OlMap.css";

export * from "gp";

MapLoader.__class2d = OlMap;
export {MapLoader};

export const sdkVersion = "__GPSDKVERSION__";
export const sdkDate = "__GPDATE__";
