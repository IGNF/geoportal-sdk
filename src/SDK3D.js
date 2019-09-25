/**
* Global variable Gp.
*
* The following variables are aslo global :
*   - proj4 (exposed by geoportal extensions dependance),
*   - ol,
*   - olms,
*   - itowns,
*   - eventbus (exposed by geoportal extensions dependance)
*
* @module Gp
* @alias Gp
* @desc
*
* This is the global variable that is exposed in the browser environment.
* Content is composed of constructor, functions and properties...
*
* > Config:  (...)
*
* > ColorUtils: (...)
* > LayerUtils: (...)
* > MathUtils: (...)
* > ProxyUtils: (...)
*
* > olExtended: (...)
* > olUtils: (...)
* > olExtDate: "YYYY-MM-DD"
* > olExtVersion: "X.X.X"
*
* > Error: (...)
* > Helper: (...)
* > Protocols: (...)
* > Services: (...)
* > servicesDate: "YYYY-MM-DD"
* > servicesVersion: "X.X.X"
*
* > itownsExtended: (...)
* > itownsExtVersion: "X.X.X"
* > itownsExtDate: "YYYY-MM-DD"
*
* > Map: (...)
* > sdkVersion: "X.X.X"
* > sdkDate: "YYYY-MM-DD"
*/

import Pkg from "../package.json";
import Logger from "./Utils/LoggerByDefault";

import { MapLoader } from "./Utils/MapLoader";
import { OlMap } from "./OpenLayers/OlMap";
import { ItMap } from "./Itowns/ItMap";

// CSS
import "./Itowns/CSS/ItMap.css";
import "./OpenLayers/CSS/OlMap.css";

// import openlayers
import olDist from "./Utils/dist-openlayers/index";

// import des extensions openlayers
import { olExtended } from "geoportal-extensions-openlayers";

var logger = Logger.getLogger("SDK3D");
logger.log("Chargement SDK 3D...");

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

// ol extended + Services + Outils
export {
    /** Services
    * @see {@link http://ignf.github.io/geoportal-access-lib/current/jsdoc/module-Services.html|geoportal-access-lib}
    */
    Services,
    /** Error
     * @see {@link http://ignf.github.io/geoportal-access-lib/current/jsdoc/Gp.Error.html|geoportal-access-lib}
     */
    Error,
    /** Helper
     * @see {@link http://ignf.github.io/geoportal-access-lib/current/jsdoc/module-Helper.html|geoportal-access-lib}
     */
    Helper,
    /** Protocols
     * @see {@link http://ignf.github.io/geoportal-access-lib/current/jsdoc/module-XHR.html|geoportal-access-lib}
     */
    Protocols,
    /** servicesDate
     * @see {@link http://ignf.github.io/geoportal-access-lib/current/jsdoc/module-Gp.html|geoportal-access-lib}
     */
    servicesDate,
    /** servicesVersion
     * @see {@link http://ignf.github.io/geoportal-access-lib/current/jsdoc/module-Gp.html|geoportal-access-lib}
     */
    servicesVersion,
    /**
     * @see {@link http://ignf.github.io/geoportal-extensions/current/jsdoc/openlayers/module-LayerUtils.html|Layers utils}
     */
    LayerUtils,
    /**
     * @see {@link http://ignf.github.io/geoportal-extensions/current/jsdoc/openlayers/module-ProxyUtils.html|Proxy utils}
     */
    ProxyUtils,
    /**
     * @see {@link http://ignf.github.io/geoportal-extensions/current/jsdoc/openlayers/module-ColorUtils.html|Color utils}
     */
    ColorUtils,
    /**
     * @see {@link http://ignf.github.io/geoportal-extensions/current/jsdoc/openlayers/module-MathUtils.html|Math utils}
     */
    MathUtils,
    /**
     * @see {@link http://ignf.github.io/geoportal-extensions/current/jsdoc/openlayers/module-Utils.html|Openlayers utils}
     */
    olUtils,
    /** Version : geoportal extensions openlayers */
    olExtVersion,
    /** Publication date : geoportal extensions openlayers */
    olExtDate,
    /** Expose extensions openlayers extended */
    olExtended
} from "geoportal-extensions-openlayers";

// itowns extended
export {
    /** Version : geoportal extensions itowns */
    itownsExtVersion,
    /** Publication date : geoportal extensions itowns */
    itownsExtDate,
    /** Expose extensions itowns extended */
    itownsExtended
} from "geoportal-extensions-itowns";

MapLoader.__class2d = OlMap;
MapLoader.__class3d = ItMap;
/** Geoportal Map loader */
export { MapLoader as Map };

/** Version */
export const sdkVersion = Pkg.SDK3DVersion;
/** Publication date */
export const sdkDate = Pkg.date;

// fusion des fonctionnalités openlayers
// Gp.olExtended -> ol
deepCopy(olExtended, olDist);
// ol -> Gp.olExtended
deepCopy(olDist, olExtended);

// "ol" is exposed into window (for a build bundle) with webpack.
if (window && window.ol) {
    window.ol = olDist;
}
