import Logger from "../Utils/LoggerByDefault";

/**
 * Lecture / Ecriture du format WKT
 *
 * Les besoins sont assez simples :
 * 1. lecture des types suivants :
 *  - LINESTRING
 *  - POLYGON
 *  - (TODO)
 * 2. convertir aux formats suivants :
 *  - json
 *  - (TODO)
 *
 *
 * @example
 *  var strWKT = "LINESTRING (2.416907 48.846577, 2.416916 48.846613)";
 *  WKT.toJson (strWKT,
 *      function onSuccess (json) {
 *          // {
 *          //      type : 'LINESTRING',
 *          //      coordinates : [
 *          //          [2.416907, 48.846577],
 *          //          [2.416916, 48.846613]
 *          //      ]
 *          // }
 *      },
 *      function onError (error) {
 *          console.log(error);
 *      }
 *  );
 *
 * @module WKT
 * @alias Gp.Formats.WKT
 * @private
 */

var WKT = {

    /**
     * Parsing d'une chaine WKT
     *
     * @method toJson
     * @param {String} strWkt - chaine de type WKT
     * @param {Function} success - fonction callback
     * @param {Function} error   - fonction callback
     */
    toJson : function (strWkt, success, error) {
        var logger = Logger.getLogger();

        var json = null;

        try {
            if (!strWkt) {
                throw new Error("La chaine WKT n'est pas renseignée !");
            }

            if (!success) {
                // callback success par defaut
                success = function (json) {
                    console.log(json);
                };
            }

            if (!error) {
                // callback error par defaut
                error = function (e) {
                    console.log(e);
                };
            }

            var regex;
            var subst;

            // regex coordinates
            regex = /(-?\d+\.?[0-9]*)\s(-?\d+\.?[0-9]+)/g;
            subst = "[$1,$2]";
            strWkt = strWkt.replace(regex, subst);

            // regex type
            regex = /^(\w+)/;
            regex.exec(strWkt);
            if (RegExp.$1 === "POLYGON") {
                subst = "{\"type\" : \"Polygon\",";
                strWkt = strWkt.replace(RegExp.$1, subst);
                // clean
                // (( --> coordinates : [[
                regex = /(\({2}?)/;
                subst = "\"coordinates\" : [[";
                strWkt = strWkt.replace(regex, subst);
                // )) --> ]]}
                regex = /(\){2}?)/;
                subst = "]]}";
                strWkt = strWkt.replace(regex, subst);
                // all ( --> [
                regex = /(\()/g;
                subst = "[";
                strWkt = strWkt.replace(regex, subst);
                // all ) --> ]
                regex = /(\))/g;
                subst = "]";
                strWkt = strWkt.replace(regex, subst);
            } else if (RegExp.$1 === "LINESTRING") {
                subst = "{\"type\" : \"LineString\",";
                strWkt = strWkt.replace(RegExp.$1, subst);
                // clean
                regex = /(\(\(?)/;
                subst = "\"coordinates\" : [";
                strWkt = strWkt.replace(regex, subst);
                regex = /(\)\)?)/;
                subst = "]}";
                strWkt = strWkt.replace(regex, subst);
            }

            logger.trace(strWkt);

            json = JSON.parse(strWkt);

            if (!json) {
                throw new Error("Le JSON est vide !");
            }

            if (!json.type) {
                throw new Error("Le type de geometrie n'est pas connu !");
            }

            if (!json.coordinates) {
                throw new Error("La liste des points est vide !");
            }

            success.call(this, json);
        } catch (e) {
            if (e.name === "SyntaxError") {
                error.call(this, "Erreur de parsing JSON !");
                return;
            }
            error.call(this, e);
        }
    }
};

export default WKT;
