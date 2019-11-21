// cette classe contient les URLs par defaut des services.
//  DefaultUrlService.Alti.url(key)[elevation-json]
//  DefaultUrlService.Alti.url(key)[elevation-xml]
//  DefaultUrlService.Alti.url(key)[profil-json]
//  DefaultUrlService.Alti.url(key)[profil-xml]
//  DefaultUrlService.Alti.url(key)[wps]
//  DefaultUrlService.ProcessIsoCurve.url(key)
//  DefaultUrlService.AutoComplete.url(key)
//  DefaultUrlService.ReverseGeocode.url(key)
//  DefaultUrlService.AutoConf.url(key)[apiKey]
//  DefaultUrlService.AutoConf.url(key)[apiKeys]
//  DefaultUrlService.AutoConf.url(key)[aggregate]
//  DefaultUrlService.Geocode.url(key)
//  DefaultUrlService.Route.url(key)

// Example :
//
// DefaultUrlService.Alti.url('efe4r54tj4uy5i78o7545eaz7e87a')[elevation-json]
//  output {String} -> http://wxs.ign.fr/efe4r54tj4uy5i78o7545eaz7e87a/alti/rest/elevation.json
//
// DefaultUrlService.Alti.url('efe4r54tj4uy5i78o7545eaz7e87a')
// output {Object|String}
// -> http://wxs.ign.fr/efe4r54tj4uy5i78o7545eaz7e87a/alti/rest/elevation.json
// -> http://wxs.ign.fr/efe4r54tj4uy5i78o7545eaz7e87a/alti/rest/elevation.xml
// -> http://wxs.ign.fr/efe4r54tj4uy5i78o7545eaz7e87a/alti/rest/elevationLine.json
// -> http://wxs.ign.fr/efe4r54tj4uy5i78o7545eaz7e87a/alti/rest/elevationLine.xml
// -> http://wxs.ign.fr/efe4r54tj4uy5i78o7545eaz7e87a/alti/wps
//
// ssl by default.
//
// Force to not do ssl :
// DefaultUrlService.ssl = false;
//
// DefaultUrlService.AutoComplete.url('efe4r54tj4uy5i78o7545eaz7e87a')
// output {Object|String}
// -> https://wxs.ign.fr/efe4r54tj4uy5i78o7545eaz7e87a/ols/apis/completion

// constantes internes
var HOSTNAME = "wxs.ign.fr";

/**
 * Default Geoportal web services URLs access.
 *
 * @namespace
 * @alias Gp.Services.DefaultUrl
 */
var DefaultUrlService = {

    /** if set true, require the use of https protocol */
    ssl : true,

    /**
    * base url of services (ssl protocol management)
    * @param {String} key - key
    * @param {String} path - path
    * @returns {String} url
    */
    url : function (key, path) {
        // comportement par défaut => https
        // sinon, il est fixé par l'option 'ssl' (false => http)
        var _protocol;
        if (DefaultUrlService.ssl === false) {
            _protocol = "http://";
        } else {
            _protocol = "https://";
        }

        return _protocol + HOSTNAME.concat("/", key, path);
    },

    /**
     * Elevation web service access
     *
     * @member {Object}
     * @property {Function} url (key) - Returns elevation service default urls with or without geoportal access key given as a parameter. The result is a javascript object with different urls given used protocols ("elevation-json", "elevation-xml", "profil-json" or "profil-xml").
     */
    Alti : {
        _key : {
            // rest
            "elevation-json" : "/alti/rest/elevation.json",
            "elevation-xml" : "/alti/rest/elevation.xml",
            "profil-json" : "/alti/rest/elevationLine.json",
            "profil-xml" : "/alti/rest/elevationLine.xml",
            // other
            wps : "/alti/wps"
        },
        /**
        * url
        * @param {String} key - key
        * @returns {String} url
        */
        url : function (key) {
            return {
                // rest
                "elevation-json" : DefaultUrlService.url(key, this._key["elevation-json"]),
                "elevation-xml" : DefaultUrlService.url(key, this._key["elevation-xml"]),
                "profil-json" : DefaultUrlService.url(key, this._key["profil-json"]),
                "profil-xml" : DefaultUrlService.url(key, this._key["profil-xml"]),
                // other
                wps : DefaultUrlService.url(key, this._key["wps"])
            };
        }
    },
    /**
     * IsoCurve web service access
     *
     * @member {Object}
     * @property {Function} url (key) - Returns isocurve service default urls with or without geoportal access key given as a parameter. The result is a javascript object with different urls given used protocols ("iso-json" or "iso-xml").
     */
    ProcessIsoCurve : {
        _key : {
            "iso-json" : "/isochrone/isochrone.json", // rest (geoconcept)
            "iso-xml" : "/isochrone/isochrone.xml" // rest (geoconcept)
        },
        /**
        * url
        * @param {String} key - key
        * @returns {String} url
        */
        url : function (key) {
            return {
                "iso-json" : DefaultUrlService.url(key, this._key["iso-json"]),
                "iso-xml" : DefaultUrlService.url(key, this._key["iso-xml"])
            };
        }
    },
    /**
     * Autocompletion web service access
     *
     * @member {Object}
     * @property {Function} url (key) - Returns autocomplete service default urls with or without geoportal access key given as a parameter. The result is a String.
     */
    AutoComplete : {
        _key : "/ols/apis/completion",
        /**
        * url
        * @param {String} key - key
        * @returns {String} url
        */
        url : function (key) {
            return DefaultUrlService.url(key, this._key);
        }
    },
    /**
     * Reverse geocoding web service access
     *
     * @member {Object}
     * @property {Function} url (key) - Returns reverse geocoding service default urls with or without geoportal access key given as a parameter. The result is a String.
     */
    ReverseGeocode : {
        _key : "/geoportail/ols",
        /**
        * url
        * @param {String} key - key
        * @returns {String} url
        */
        url : function (key) {
            return DefaultUrlService.url(key, this._key);
        }
    },
    /**
     * Autoconfiguration web service access
     *
     * @member {Object}
     * @property {Function} url ([key1,...]) - Returns autoconfiguration service default urls with geoportal access key (s) given as a String array parameter. The result is a javascript object with different urls given the access mode ("apiKey", "apiKeys" or "aggregate").
     */
    AutoConf : {
        _key : {
            apiKey : "/autoconf",
            apiKeys : "/autoconf?keys=%KEYS%",
            aggregate : "/autoconf/id/"
        },
        /**
        * url
        * @param {String} key - key
        * @returns {String} url
        */
        url : function (key) {
            var keys = "";
            if (Array.isArray(key) && key.length > 0) {
                keys = key[0];
                for (var i = 1; i < key.length; i++) {
                    keys += "," + key[i];
                }
            }
            return {
                apiKey : DefaultUrlService.url(key, this._key["apiKey"]), // une seule clé
                apiKeys : DefaultUrlService.url(key[0], this._key["apiKeys"]).replace("%KEYS%", keys), // autoconf de plusieurs clés
                aggregate : DefaultUrlService.url(key, this._key["aggregate"])
            };
        }
    },
    /**
     * Geocoding web service access
     *
     * @member {Object}
     * @property {Function} url (key) - Returns geocoding service default urls with or without geoportal access key given as a parameter. The result is a String.
     */
    Geocode : {
        _key : "/geoportail/ols",
        /**
        * url
        * @param {String} key - key
        * @returns {String} url
        */
        url : function (key) {
            return DefaultUrlService.url(key, this._key);
        }
    },
    /**
     * Routing web service access
     *
     * @member {Object}
     * @property {Function} url (key) - Returns routing service default urls with or without geoportal access key given as a parameter. The result is a javascript object with different urls given used protocols ("route-json" or "route-xml").
     */
    Route : {
        _key : {
            ols : "/itineraire/ols", // openLS
            "route-json" : "/itineraire/rest/route.json", // rest (geoconcept)
            "route-xml" : "/itineraire/rest/route.xml" // rest (geoconcept)
        },
        /**
        * url
        * @param {String} key - key
        * @returns {String} url
        */
        url : function (key) {
            return {
                ols : DefaultUrlService.url(key, this._key["ols"]),
                "route-json" : DefaultUrlService.url(key, this._key["route-json"]),
                "route-xml" : DefaultUrlService.url(key, this._key["route-xml"])
            };
        }
    }
};

export default DefaultUrlService;
