import IT from "../../src/Itowns/IT";
import {enginePath3d, apiKey, mapViewDivId as divId} from "../config";

var ITutils = {

    onMapInitialized : function onMapInitialized(map, callBack) {
        if( map.getLibMap().isInitialized() ) {
            callBack();
        }else{
            map.getLibMap().listen( itowns.GlobeViewExtended.EVENTS.GLOBE_INITIALIZED, function() {
                callBack();
            })
        }
    },

    onRenderingOver : function onRenderingOver(map, callBack) {
        var timer = setTimeout( superCallBack, 500);
        function handler() {
            clearTimeout(timer);
            timer = setTimeout( superCallBack, 500);
        }

        function superCallBack() {
            map.getLibMap().getGlobeView().removeFrameRequester(itowns.MAIN_LOOP_EVENTS.AFTER_RENDER, handler);
            callBack();
        }

        map.getLibMap().getGlobeView().addFrameRequester(itowns.MAIN_LOOP_EVENTS.AFTER_RENDER, handler);
    },

    onRenderingOverPromise : function onRenderingOverPromise(map) {
        return new Promise( function(resolve) {
            this.onRenderingOver(map, resolve);
        }.bind(this));
    },

    createDiv : function createDiv() {
        var div = document.createElement("div");
        //div.style.display = 'none';
        div.id = divId
        div.style.width = "500px";
        div.style.height = "500px";
        document.body.appendChild(div);
        return div;
    },

    initMap : function initMap(mapOptions) {
        const div = this.createDiv();

        if (!mapOptions) mapOptions = {};
        mapOptions.apiKey = apiKey;
        mapOptions.enginePath3d = enginePath3d;

        return new IT({
            div: div,
            mapOptions: mapOptions
        });
    },

    initContext : function initContext(mapOptions) {
        let map = this.initMap(mapOptions);

        return new Promise( function(resolve) {
            map.listen("mapLoaded", function () {
                this.onRenderingOver(map, function () {
                    resolve(map);
                });
            }.bind(this));
        }.bind(this));
    },

    cleanMap : function cleanMap (map) {
        for (var listeners in map._events) {
            var i = 0;
            while (map._events[listeners].length > 0) {
                map.forget(listeners, map._events[listeners][i].action);
            }
        }
        map._controls.forEach( function (control) {
            if( control.obj !== "2D-only-control" ) {
                map.removeControls(control.id);
            }
        });
    },

    cleanConf : function cleanConf() {
        // pour permettre le chargement asynchrone de la configuration
        if (window.Gp && window.Gp.Config) window.Gp.Config = null;
    },

    cleanDOM : function cleanDOM() {
        let div = document.getElementById(divId);
        if (div) {
            document.body.removeChild(div);
        }

        let itownsScript = document.getElementById("engine-itowns");
        if (itownsScript) {
            document.body.removeChild(itownsScript);
        }
    },

    cleanGlobalItowns : function cleanGlobalItowns() {
        var scope = typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};
        scope.itowns = undefined;
        if( scope._babelPolyfill ) scope._babelPolyfill = false;
    },

    cleanContext : function cleanContext(map, callback) {
        this.cleanMap(map);
        this.cleanDOM();
        this.cleanGlobalItowns();

        if(callback) callback();
    },

    cleanContextOnRenderingOver : function cleanContextOnRenderingOver(map, callback) {
        this.onRenderingOver(map, function () {
            this.cleanContext(map, callback);
        }.bind(this));
    },

    cleanContextOnRenderingOverPromise : function cleanContextOnRenderingOverPromise(map) {
        return new Promise( function(resolve) {
            this.onRenderingOver(map, function () {
                this.cleanContext(map, resolve);
            }.bind(this));
        }.bind(this));
    }
};

export default ITutils;
