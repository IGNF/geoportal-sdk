define([
    "Map",
    "require"
],
function (
    Map,
    require
) {

    "use strict";

    // on determine l'environnement d'execution : browser ou non ?
    var scope = typeof window !== "undefined" ? window : {};

    // on voit s'il existe déjà cette variable, sinon on la met en place
    var Gp = scope.Gp || {};

    // on declare les ns dans root global
    Gp.Map = Map;

    // auto detection des lib. chargées
    if ( typeof require("ol3/OL3") !== "undefined" &&
         typeof require("it2/IT") !== "undefined") {
        console.log("Lib. ol3 et itowns détectées !");
        Gp.Map.__classOl = require("ol3/OL3");
        Gp.Map.__classItowns = require("it2/IT");
        Gp.Map._class = Gp.Map.__classOl.prototype; // IMap !

    } else if ( typeof require("ol3/OL3") !== "undefined") {
        console.log("Lib. ol3 détectée !");
        Gp.Map.__classOl = require("ol3/OL3");
        Gp.Map._class = Gp.Map.__classOl.prototype; // IMap !

    } else if ( typeof require("it2/IT") !== "undefined") {
        console.log("Lib. itowns détectée !");
        Gp.Map.__classItowns = require("it2/IT");
        Gp.Map._class = Gp.Map.__classItowns.prototype; // IMap !

    } else {
        console.log("Aucune lib. détectée !?");
    }

    Gp.sdkVersion = "__GPSDKVERSION__";
    Gp.sdkDate = "__GPDATE__";

    // on sauvegarde la variable dans l'env.
    scope.Gp = Gp;

    return scope.Gp;
}
);
