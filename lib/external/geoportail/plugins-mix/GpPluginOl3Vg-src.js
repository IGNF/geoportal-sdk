;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['ol'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('ol'));
  } else {
    root.Gp = factory(root.ol);
  }
}(this, function(ol) {

/* BEGIN CODE */
var request, xmldom;
var CommonUtilsAutoLoadConfig, CommonUtilsRegister, Ol3CRSCRS, CommonUtilsLayerUtils, Ol3Utils, Ol3FormatsKML, CommonUtilsConfig, Ol3LayersSourceWMTS, Ol3LayersSourceWMS, Ol3LayersLayerWMTS, Ol3LayersLayerWMS, CommonUtilsSelectorID, CommonControlsLayerSwitcherDOM, Ol3ControlsLayerSwitcher, Ol3ControlsUtilsMarkers, CommonUtilsCheckRightManagement, CommonControlsSearchEngineDOM, CommonControlsSearchEngineUtils, Ol3ControlsSearchEngine, CommonControlsMousePositionDOM, Ol3ControlsMousePosition, Ol3ControlsUtilsInteractions, CommonControlsDrawingDOM, Ol3ControlsDrawing, CommonControlsLocationSelectorDOM, Ol3ControlsLocationSelector, CommonControlsRouteDOM, Ol3ControlsRoute, CommonControlsIsoDOM, Ol3ControlsIsocurve, CommonControlsReverseGeocodingDOM, Ol3ControlsReverseGeocode, CommonControlsLayerImportDOM, Ol3ControlsLayerImport, Ol3ControlsGeoportalAttribution, Ol3ControlsMeasuresMeasures, CommonControlsMeasureToolBoxDOM, Ol3ControlsMeasureToolBox, CommonControlsElevationPathDOM, Ol3ControlsElevationPath, CommonControlsMeasureLengthDOM, Ol3ControlsMeasuresMeasureLength, CommonControlsMeasureAreaDOM, Ol3ControlsMeasuresMeasureArea, CommonControlsMeasureAzimuthDOM, Ol3ControlsMeasuresMeasureAzimuth, Ol3GpPluginOl3, VgControlsLayerSwitcher, VgControlsUtilsPositionFormater, VgControlsUtils, VgCRSCRS, VgControlsMousePosition, VgGpPluginVg;
CommonUtilsAutoLoadConfig = function (Gp) {
    (function () {
        var scripts = document.getElementsByTagName('script');
        var key = scripts[scripts.length - 1].getAttribute('data-key');
        if (key) {
            var splitKeys = key.split(/;|,|\|/);
            if (key && splitKeys.length > 1) {
                var keys = [];
                for (var i = 0; i < splitKeys.length; i++) {
                    keys.push(splitKeys[i]);
                }
                key = keys;
            }
        }
        var url = scripts[scripts.length - 1].getAttribute('data-url');
        var timeout = scripts[scripts.length - 1].getAttribute('data-timeout');
        var success = function () {
        };
        var error = function (e) {
            throw new Error('Configuration load failed : ' + e.message);
        };
        if (!key && !url) {
            return;
        }
        var options = {
            apiKey: key,
            onSuccess: success,
            onFailure: error
        };
        if (url) {
            options.serverUrl = url;
            options.callbackSuffix = '';
        }
        if (timeout) {
            options.timeOut = timeout;
        }
        if (!Gp.Config) {
            Gp.Services.getConfig(options);
        }
    }());
}(gp);
CommonUtilsRegister = function (proj4) {
    var Register = {
        isLoaded: false,
        get: function (name) {
            if (name === '' || name === null || typeof name === 'undefined') {
                return;
            }
            var s = name.split(':');
            if (s.length !== 2) {
                return;
            }
            var register = s[0];
            var code = s[1];
            if (!this.hasOwnProperty(register)) {
                return;
            }
            if (!this[register].hasOwnProperty(code)) {
                return;
            }
            return this[register][code];
        },
        load: function () {
            if (!this.isLoaded) {
                var registers = [
                    'IGNF',
                    'EPSG',
                    'CRS'
                ];
                for (var i = 0; i < registers.length; i++) {
                    var register = registers[i];
                    var codes = this[register];
                    for (var code in codes) {
                        if (codes.hasOwnProperty(code)) {
                            var name = register + ':' + code;
                            proj4.defs(name, this.get(name));
                        }
                    }
                }
                this.isLoaded = true;
            }
        },
        EPSG: {
            4149: '+title=CH1903 +proj=longlat +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +no_defs ',
            4150: '+title=CH1903plus +proj=longlat +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +no_defs ',
            4151: '+title=CHTRF95 +proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs ',
            4171: '+title=RGF93 +proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs ',
            4230: '+title=ED50 +proj=longlat +ellps=intl +no_defs ',
            4235: '+title=Guyane Francaise +proj=longlat +ellps=intl +no_defs ',
            4258: '+title=ETRS89 +proj=longlat +ellps=GRS80 +no_defs ',
            4275: '+title=NTF +proj=longlat +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +no_defs ',
            4322: '+title=WGS 72 +proj=longlat +ellps=WGS72 +no_defs ',
            4326: '+title=WGS 84 +proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs ',
            4467: '+proj=utm +zone=21 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs ',
            4470: '+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs ',
            4471: '+proj=utm +zone=38 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs ',
            4474: '+proj=utm +zone=38 +south +ellps=intl +towgs84=-382,-59,-262,0,0,0,0 +units=m +no_defs ',
            4558: '+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs ',
            4559: '+proj=utm +zone=20 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs ',
            4621: '+title=Fort Marigot +proj=longlat +ellps=intl +towgs84=137,248,-430,0,0,0,0 +no_defs ',
            4622: '+title=Guadeloupe 1948 +proj=longlat +ellps=intl +no_defs ',
            4623: '+title=CSG67 +proj=longlat +ellps=intl +towgs84=-186,230,110,0,0,0,0 +no_defs ',
            4624: '+title=RGFG95 +proj=longlat +ellps=GRS80 +towgs84=2,2,-2,0,0,0,0 +no_defs ',
            4625: '+title=Martinique 1938 +proj=longlat +ellps=intl +no_defs ',
            4626: '+title=Reunion 1947 +proj=longlat +ellps=intl +no_defs ',
            4627: '+title=RGR92 +proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs ',
            4628: '+title=Tahiti 52 +proj=longlat +ellps=intl +towgs84=162,117,154,0,0,0,0 +no_defs ',
            4629: '+title=Tahaa 54 +proj=longlat +ellps=intl +no_defs ',
            4630: '+title=IGN72 Nuku Hiva +proj=longlat +ellps=intl +no_defs ',
            4632: '+title=Combani 1950 +proj=longlat +ellps=intl +towgs84=-382,-59,-262,0,0,0,0 +no_defs ',
            4633: '+title=IGN56 Lifou +proj=longlat +ellps=intl +no_defs ',
            4634: '+title=IGN72 Grand Terre +proj=longlat +ellps=intl +no_defs ',
            4637: '+title=Perroud 1950 +proj=longlat +ellps=intl +towgs84=325,154,172,0,0,0,0 +no_defs ',
            4638: '+title=Saint Pierre et Miquelon 1950 +proj=longlat +ellps=clrk66 +towgs84=30,430,368,0,0,0,0 +no_defs ',
            4640: '+title=RRAF 1991 +proj=longlat +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +no_defs ',
            4641: '+title=IGN53 Mare +proj=longlat +ellps=intl +no_defs ',
            4645: '+title=RGNC 1991 +proj=longlat +ellps=intl +towgs84=0,0,0,0,0,0,0 +no_defs ',
            4687: '+proj=longlat +ellps=GRS80 +no_defs ',
            4662: '+title=IGN72 Grande Terre +proj=longlat +ellps=intl +no_defs ',
            4689: '+title=IGN63 Hiva Oa +proj=longlat +ellps=intl +no_defs ',
            4690: '+title=Tahiti 79 +proj=longlat +ellps=intl +no_defs ',
            4691: '+title=Moorea 87 +proj=longlat +ellps=intl +towgs84=215.525,149.593,176.229,-3.2624,-1.692,-1.1571,10.4773 +no_defs ',
            4692: '+title=Maupiti 83 +proj=longlat +ellps=intl +towgs84=217.037,86.959,23.956,0,0,0,0 +no_defs ',
            4698: '+title=IGN 1962 Kerguelen +proj=longlat +ellps=intl +towgs84=145,-187,103,0,0,0,0 +no_defs ',
            4749: '+title=RGNC91-93 +proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs ',
            4750: '+title=ST87 Ouvea +proj=longlat +ellps=WGS84 +towgs84=-56.263,16.136,-22.856,0,0,0,0 +no_defs ',
            4807: '+title=NTF (Paris) +proj=longlat +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +no_defs ',
            2056: '+title=CH1903+ / LV95 +proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs ',
            2154: '+title=RGF93 / Lambert-93 +proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs ',
            2213: '+title=ETRS89 / TM 30 NE +proj=tmerc +lat_0=0 +lon_0=30 +k=0.9996 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs ',
            2969: '+title=Fort Marigot / UTM zone 20N +proj=utm +zone=20 +ellps=intl +towgs84=137,248,-430,0,0,0,0 +units=m +no_defs ',
            2970: '+title=Guadeloupe 1948 / UTM zone 20N +proj=utm +zone=20 +ellps=intl +units=m +no_defs ',
            2971: '+title=CSG67 / UTM zone 22N +proj=utm +zone=22 +ellps=intl +towgs84=-186,230,110,0,0,0,0 +units=m +no_defs ',
            2972: '+title=RGFG95 / UTM zone 22N +proj=utm +zone=22 +ellps=GRS80 +towgs84=2,2,-2,0,0,0,0 +units=m +no_defs ',
            2973: '+title=Martinique 1938 / UTM zone 20N +proj=utm +zone=20 +ellps=intl +units=m +no_defs ',
            2975: '+title=RGR92 / UTM zone 40S +proj=utm +zone=40 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs ',
            2976: '+title=Tahiti 52 / UTM zone 6S +proj=utm +zone=6 +south +ellps=intl +towgs84=162,117,154,0,0,0,0 +units=m +no_defs ',
            2977: '+title=Tahaa 54 / UTM zone 5S +proj=utm +zone=5 +south +ellps=intl +units=m +no_defs ',
            2978: '+title=IGN72 Nuku Hiva / UTM zone 7S +proj=utm +zone=7 +south +ellps=intl +units=m +no_defs ',
            2980: '+title=Combani 1950 / UTM zone 38S +proj=utm +zone=38 +south +ellps=intl +towgs84=-382,-59,-262,0,0,0,0 +units=m +no_defs ',
            2981: '+title=IGN56 Lifou / UTM zone 58S +proj=utm +zone=58 +south +ellps=intl +units=m +no_defs ',
            2982: '+title=IGN72 Grand Terre / UTM zone 58S (deprecated) +proj=utm +zone=58 +south +ellps=intl +units=m +no_defs ',
            2984: '+title=RGNC 1991 / Lambert New Caledonia (deprecated) +proj=lcc +lat_1=-20.66666666666667 +lat_2=-22.33333333333333 +lat_0=-21.5 +lon_0=166 +x_0=400000 +y_0=300000 +ellps=intl +towgs84=0,0,0,0,0,0,0 +units=m +no_defs ',
            2986: '+title=Terre Adelie 1950 +proj=stere +towgs84=324.9120,153.2820,172.0260 +a=6378388.0000 +rf=297.0000000000000 +lat_0=-90.000000000 +lon_0=140.000000000 +lat_ts=-67.000000000 +k=0.96027295 +x_0=300000.000 +y_0=-2299363.482 +units=m +no_defs',
            2987: '+title=Saint Pierre et Miquelon 1950 / UTM zone 21N +proj=utm +zone=21 +ellps=clrk66 +towgs84=30,430,368,0,0,0,0 +units=m +no_defs ',
            2989: '+title=RRAF 1991 / UTM zone 20N +proj=utm +zone=20 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs ',
            2990: '+title=Reunion 1947 / TM Reunion (deprecated) +proj=tmerc +lat_0=-21.11666666666667 +lon_0=55.53333333333333 +k=1 +x_0=50000 +y_0=160000 +ellps=intl +units=m +no_defs ',
            2995: '+title=IGN53 Mare / UTM zone 58S +proj=utm +zone=58 +south +ellps=intl +units=m +no_defs ',
            3038: '+proj=utm +zone=26 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs ',
            3039: '+proj=utm +zone=27 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs ',
            3040: '+proj=utm +zone=28 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs ',
            3041: '+proj=utm +zone=29 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs ',
            3045: '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs ',
            3046: '+proj=utm +zone=34 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs ',
            3047: '+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs ',
            3048: '+proj=utm +zone=36 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs ',
            3049: '+proj=utm +zone=37 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs ',
            3050: '+proj=utm +zone=38 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs ',
            3051: '+proj=utm +zone=39 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs ',
            3034: '+title=ETRS89 / ETRS-LCC +proj=lcc +lat_1=35 +lat_2=65 +lat_0=52 +lon_0=10 +x_0=4000000 +y_0=2800000 +ellps=GRS80 +units=m +no_defs ',
            3035: '+title=ETRS89 / ETRS-LAEA +proj=laea +lat_0=52 +lon_0=10 +x_0=4321000 +y_0=3210000 +ellps=GRS80 +units=m +no_defs ',
            3042: '+title=ETRS89 / ETRS-TM30 +proj=utm +zone=30 +ellps=GRS80 +units=m +no_defs ',
            3043: '+title=ETRS89 / ETRS-TM31 +proj=utm +zone=31 +ellps=GRS80 +units=m +no_defs ',
            3044: '+title=ETRS89 / ETRS-TM32 +proj=utm +zone=32 +ellps=GRS80 +units=m +no_defs ',
            25828: '+proj=utm +zone=28 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs ',
            25829: '+proj=utm +zone=29 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs ',
            25833: '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs ',
            25834: '+proj=utm +zone=34 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs ',
            25835: '+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs ',
            25836: '+proj=utm +zone=36 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs ',
            25837: '+proj=utm +zone=37 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs ',
            25838: '+proj=utm +zone=38 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs ',
            3060: '+title=IGN72 Grande Terre / UTM zone 58S +proj=utm +zone=58 +south +ellps=intl +units=m +no_defs ',
            3163: '+title=RGNC91-93 / Lambert New Caledonia +proj=lcc +lat_1=-20.66666666666667 +lat_2=-22.33333333333333 +lat_0=-21.5 +lon_0=166 +x_0=400000 +y_0=300000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs ',
            3164: '+title=ST87 Ouvea / UTM zone 58S +proj=utm +zone=58 +south +ellps=WGS84 +towgs84=-56.263,16.136,-22.856,0,0,0,0 +units=m +no_defs ',
            3165: '+title=NEA74 Noumea / Noumea Lambert +proj=lcc +lat_1=-22.24469175 +lat_2=-22.29469175 +lat_0=-22.26969175 +lon_0=166.44242575 +x_0=0.66 +y_0=1.02 +ellps=intl +units=m +no_defs ',
            3166: '+title=NEA74 Noumea / Noumea Lambert 2 +proj=lcc +lat_1=-22.24472222222222 +lat_2=-22.29472222222222 +lat_0=-22.26972222222222 +lon_0=166.4425 +x_0=8.313000000000001 +y_0=-2.354 +ellps=intl +units=m +no_defs ',
            3169: '+title=RGNC91-93 / UTM zone 57S +proj=utm +zone=57 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs ',
            3170: '+title=RGNC91-93 / UTM zone 58S +proj=utm +zone=58 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs ',
            3171: '+title=RGNC91-93 / UTM zone 59S +proj=utm +zone=59 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs ',
            3172: '+title=IGN53 Mare / UTM zone 59S +proj=utm +zone=59 +south +ellps=intl +units=m +no_defs ',
            3296: '+title=RGPF / UTM zone 5S +proj=utm +zone=5 +south +ellps=GRS80 +units=m +no_defs ',
            3297: '+title=RGPF / UTM zone 6S +proj=utm +zone=6 +south +ellps=GRS80 +units=m +no_defs ',
            3298: '+title=RGPF / UTM zone 7S +proj=utm +zone=7 +south +ellps=GRS80 +units=m +no_defs ',
            3299: '+title=RGPF / UTM zone 8S +proj=utm +zone=8 +south +ellps=GRS80 +units=m +no_defs ',
            3302: '+title=IGN63 Hiva Oa / UTM zone 7S +proj=utm +zone=7 +south +ellps=intl +units=m +no_defs ',
            3303: '+title=Fatu Iva 72 / UTM zone 7S +proj=utm +zone=7 +south +ellps=intl +towgs84=347.103,1078.12,2623.92,-33.8875,70.6773,-9.3943,186.074 +units=m +no_defs ',
            3304: '+title=Tahiti 79 / UTM zone 6S +proj=utm +zone=6 +south +ellps=intl +units=m +no_defs ',
            3305: '+title=Moorea 87 / UTM zone 6S +proj=utm +zone=6 +south +ellps=intl +towgs84=215.525,149.593,176.229,-3.2624,-1.692,-1.1571,10.4773 +units=m +no_defs ',
            3306: '+title=Maupiti 83 / UTM zone 5S +proj=utm +zone=5 +south +ellps=intl +towgs84=217.037,86.959,23.956,0,0,0,0 +units=m +no_defs ',
            3312: '+title=CSG67 / UTM zone 21N +proj=utm +zone=21 +ellps=intl +towgs84=-186,230,110,0,0,0,0 +units=m +no_defs ',
            3313: '+title=RGFG95 / UTM zone 21N +proj=utm +zone=21 +ellps=GRS80 +towgs84=2,2,-2,0,0,0,0 +units=m +no_defs ',
            3336: '+title=IGN 1962 Kerguelen / UTM zone 42S +proj=utm +zone=42 +south +ellps=intl +towgs84=145,-187,103,0,0,0,0 +units=m +no_defs ',
            3395: '+title=WGS 84 / World Mercator +proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            3727: '+title=Reunion 1947 / TM Reunion +proj=tmerc +lat_0=-21.11666666666667 +lon_0=55.53333333333333 +k=1 +x_0=160000 +y_0=50000 +ellps=intl +units=m +no_defs ',
            21781: '+title=CH1903 / LV03 +proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +x_0=600000 +y_0=200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs ',
            25830: '+title=ETRS89 / UTM zone 30N +proj=utm +zone=30 +ellps=GRS80 +units=m +no_defs ',
            25831: '+title=ETRS89 / UTM zone 31N +proj=utm +zone=31 +ellps=GRS80 +units=m +no_defs ',
            25832: '+title=ETRS89 / UTM zone 32N +proj=utm +zone=32 +ellps=GRS80 +units=m +no_defs ',
            27561: '+title=NTF (Paris) / Lambert Nord France +proj=lcc +lat_1=49.50000000000001 +lat_0=49.50000000000001 +lon_0=0 +k_0=0.999877341 +x_0=600000 +y_0=200000 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs ',
            27562: '+title=NTF (Paris) / Lambert Centre France +proj=lcc +lat_1=46.8 +lat_0=46.8 +lon_0=0 +k_0=0.99987742 +x_0=600000 +y_0=200000 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs ',
            27563: '+title=NTF (Paris) / Lambert Sud France +proj=lcc +lat_1=44.10000000000001 +lat_0=44.10000000000001 +lon_0=0 +k_0=0.9998774990000001 +x_0=600000 +y_0=200000 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs ',
            27564: '+title=NTF (Paris) / Lambert Corse +proj=lcc +lat_1=42.16500000000001 +lat_0=42.16500000000001 +lon_0=0 +k_0=0.9999447100000001 +x_0=234.358 +y_0=185861.369 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs ',
            27571: '+title=NTF (Paris) / Lambert zone I +proj=lcc +lat_1=49.50000000000001 +lat_0=49.50000000000001 +lon_0=0 +k_0=0.999877341 +x_0=600000 +y_0=1200000 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs ',
            27572: '+title=NTF (Paris) / Lambert zone II +proj=lcc +lat_1=46.8 +lat_0=46.8 +lon_0=0 +k_0=0.99987742 +x_0=600000 +y_0=2200000 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs ',
            27573: '+title=NTF (Paris) / Lambert zone III +proj=lcc +lat_1=44.10000000000001 +lat_0=44.10000000000001 +lon_0=0 +k_0=0.9998774990000001 +x_0=600000 +y_0=3200000 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs ',
            27574: '+title=NTF (Paris) / Lambert zone IV +proj=lcc +lat_1=42.16500000000001 +lat_0=42.16500000000001 +lon_0=0 +k_0=0.9999447100000001 +x_0=234.358 +y_0=4185861.369 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs ',
            27581: '+title=NTF (Paris) / France I (deprecated) +proj=lcc +lat_1=49.50000000000001 +lat_0=49.50000000000001 +lon_0=0 +k_0=0.999877341 +x_0=600000 +y_0=1200000 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs ',
            27582: '+title=NTF (Paris) / France II (deprecated) +proj=lcc +lat_1=46.8 +lat_0=46.8 +lon_0=0 +k_0=0.99987742 +x_0=600000 +y_0=2200000 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs ',
            27583: '+title=NTF (Paris) / France III (deprecated) +proj=lcc +lat_1=44.10000000000001 +lat_0=44.10000000000001 +lon_0=0 +k_0=0.9998774990000001 +x_0=600000 +y_0=3200000 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs ',
            27584: '+title=NTF (Paris) / France IV (deprecated) +proj=lcc +lat_1=42.16500000000001 +lat_0=42.16500000000001 +lon_0=0 +k_0=0.9999447100000001 +x_0=234.358 +y_0=4185861.369 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs ',
            27591: '+title=NTF (Paris) / Nord France (deprecated) +proj=lcc +lat_1=49.50000000000001 +lat_0=49.50000000000001 +lon_0=0 +k_0=0.999877341 +x_0=600000 +y_0=200000 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs ',
            27592: '+title=NTF (Paris) / Centre France (deprecated) +proj=lcc +lat_1=46.8 +lat_0=46.8 +lon_0=0 +k_0=0.99987742 +x_0=600000 +y_0=200000 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs ',
            27593: '+title=NTF (Paris) / Sud France (deprecated) +proj=lcc +lat_1=44.10000000000001 +lat_0=44.10000000000001 +lon_0=0 +k_0=0.9998774990000001 +x_0=600000 +y_0=200000 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs ',
            27594: '+title=NTF (Paris) / Corse (deprecated) +proj=lcc +lat_1=42.16500000000001 +lat_0=42.16500000000001 +lon_0=0 +k_0=0.9999447100000001 +x_0=234.358 +y_0=185861.369 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs ',
            32601: '+proj=utm +zone=1 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32602: '+proj=utm +zone=2 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32603: '+proj=utm +zone=3 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32604: '+proj=utm +zone=4 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32605: '+proj=utm +zone=5 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32606: '+proj=utm +zone=6 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32607: '+proj=utm +zone=7 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32608: '+proj=utm +zone=8 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32609: '+proj=utm +zone=9 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32610: '+proj=utm +zone=10 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32611: '+proj=utm +zone=11 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32612: '+proj=utm +zone=12 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32613: '+proj=utm +zone=13 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32614: '+proj=utm +zone=14 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32615: '+proj=utm +zone=15 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32616: '+proj=utm +zone=16 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32617: '+proj=utm +zone=17 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32618: '+proj=utm +zone=18 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32619: '+proj=utm +zone=19 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32620: '+proj=utm +zone=20 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32621: '+proj=utm +zone=21 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32622: '+proj=utm +zone=22 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32623: '+proj=utm +zone=23 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32624: '+proj=utm +zone=24 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32625: '+proj=utm +zone=25 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32626: '+proj=utm +zone=26 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32627: '+proj=utm +zone=27 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32628: '+proj=utm +zone=28 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32629: '+proj=utm +zone=29 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32630: '+proj=utm +zone=30 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32631: '+proj=utm +zone=31 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32632: '+proj=utm +zone=32 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32633: '+proj=utm +zone=33 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32634: '+proj=utm +zone=34 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32635: '+proj=utm +zone=35 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32636: '+proj=utm +zone=36 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32637: '+proj=utm +zone=37 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32638: '+proj=utm +zone=38 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32639: '+proj=utm +zone=39 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32640: '+proj=utm +zone=40 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32641: '+proj=utm +zone=41 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32642: '+proj=utm +zone=42 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32643: '+proj=utm +zone=43 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32644: '+proj=utm +zone=44 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32645: '+proj=utm +zone=45 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32646: '+proj=utm +zone=46 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32647: '+proj=utm +zone=47 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32648: '+proj=utm +zone=48 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32649: '+proj=utm +zone=49 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32650: '+proj=utm +zone=50 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32651: '+proj=utm +zone=51 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32652: '+proj=utm +zone=52 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32653: '+proj=utm +zone=53 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32654: '+proj=utm +zone=54 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32655: '+proj=utm +zone=55 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32656: '+proj=utm +zone=56 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32657: '+proj=utm +zone=57 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32658: '+proj=utm +zone=58 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32659: '+proj=utm +zone=59 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32660: '+proj=utm +zone=60 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32661: '+proj=stere +lat_0=90 +lat_ts=90 +lon_0=0 +k=0.994 +x_0=2000000 +y_0=2000000 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32662: '+title=WGS 84 / Plate Carree +proj=eqc +lat_ts=0 +lon_0=0 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32701: '+proj=utm +zone=1 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32702: '+proj=utm +zone=2 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32703: '+proj=utm +zone=3 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32704: '+proj=utm +zone=4 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32705: '+proj=utm +zone=5 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32706: '+proj=utm +zone=6 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32707: '+proj=utm +zone=7 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32708: '+proj=utm +zone=8 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32709: '+proj=utm +zone=9 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32710: '+proj=utm +zone=10 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32711: '+proj=utm +zone=11 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32712: '+proj=utm +zone=12 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32713: '+proj=utm +zone=13 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32714: '+proj=utm +zone=14 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32715: '+proj=utm +zone=15 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32716: '+proj=utm +zone=16 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32717: '+proj=utm +zone=17 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32718: '+proj=utm +zone=18 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32719: '+proj=utm +zone=19 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32720: '+proj=utm +zone=20 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32721: '+proj=utm +zone=21 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32722: '+proj=utm +zone=22 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32723: '+proj=utm +zone=23 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32724: '+proj=utm +zone=24 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32725: '+proj=utm +zone=25 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32726: '+proj=utm +zone=26 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32727: '+proj=utm +zone=27 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32728: '+proj=utm +zone=28 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32729: '+proj=utm +zone=29 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32730: '+proj=utm +zone=30 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32731: '+proj=utm +zone=31 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32732: '+proj=utm +zone=32 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32733: '+proj=utm +zone=33 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32734: '+proj=utm +zone=34 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32735: '+proj=utm +zone=35 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32736: '+proj=utm +zone=36 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32737: '+proj=utm +zone=37 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32738: '+proj=utm +zone=38 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32739: '+proj=utm +zone=39 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32740: '+proj=utm +zone=40 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32741: '+proj=utm +zone=41 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32742: '+proj=utm +zone=42 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32743: '+proj=utm +zone=43 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32744: '+proj=utm +zone=44 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32745: '+proj=utm +zone=45 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32746: '+proj=utm +zone=46 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32747: '+proj=utm +zone=47 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32748: '+proj=utm +zone=48 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32749: '+proj=utm +zone=49 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32750: '+proj=utm +zone=50 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32751: '+proj=utm +zone=51 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32752: '+proj=utm +zone=52 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32753: '+proj=utm +zone=53 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32754: '+proj=utm +zone=54 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32755: '+proj=utm +zone=55 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32756: '+proj=utm +zone=56 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32757: '+proj=utm +zone=57 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32758: '+proj=utm +zone=58 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32759: '+proj=utm +zone=59 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32760: '+proj=utm +zone=60 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            32761: '+proj=stere +lat_0=-90 +lat_ts=-90 +lon_0=0 +k=0.994 +x_0=2000000 +y_0=2000000 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ',
            310024802: '+title=Geoportail - France metropolitaine +proj=eqc +nadgrids=null +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=0.000000000 +lon_0=0.000000000 +lat_ts=46.500000000 +x_0=0.000 +y_0=0.000 +units=m +no_defs',
            310915814: '+title=Geoportail - Antilles francaises +proj=eqc +nadgrids=null +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=0.000000000 +lon_0=0.000000000 +lat_ts=15.000000000 +x_0=0.000 +y_0=0.000 +units=m +no_defs',
            310486805: '+title=Geoportail - Guyane +proj=eqc +nadgrids=null +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=0.000000000 +lon_0=0.000000000 +lat_ts=4.000000000 +x_0=0.000 +y_0=0.000 +units=m +no_defs',
            310700806: '+title=Geoportail - Reunion et dependances +proj=eqc +nadgrids=null +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=0.000000000 +lon_0=0.000000000 +lat_ts=-21.000000000 +x_0=0.000 +y_0=0.000 +units=m +no_defs',
            310702807: '+title=Geoportail - Mayotte +proj=eqc +nadgrids=null +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=0.000000000 +lon_0=0.000000000 +lat_ts=-12.000000000 +x_0=0.000 +y_0=0.000 +units=m +no_defs',
            310706808: '+title=Geoportail - Saint-Pierre et Miquelon +proj=eqc +nadgrids=null +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=0.000000000 +lon_0=0.000000000 +lat_ts=47.000000000 +x_0=0.000 +y_0=0.000 +units=m +no_defs',
            310547809: '+title=Geoportail - Nouvelle-Caledonie +proj=eqc +nadgrids=null +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=0.000000000 +lon_0=0.000000000 +lat_ts=-22.000000000 +x_0=0.000 +y_0=0.000 +units=m +no_defs',
            310642810: '+title=Geoportail - Wallis et Futuna +proj=eqc +nadgrids=null +towgs84=0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.000000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=0.000000000 +lon_0=0.000000000 +lat_ts=-14.000000000 +x_0=0.000 +y_0=0.000 +units=m +no_defs',
            310032811: '+title=Geoportail - Polynesie francaise +proj=eqc +nadgrids=null +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=0.000000000 +lon_0=0.000000000 +lat_ts=-15.000000000 +x_0=0.000 +y_0=0.000 +units=m +no_defs',
            310642812: '+title=Geoportail - Kerguelen +proj=eqc +nadgrids=null +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=0.000000000 +lon_0=0.000000000 +lat_ts=-49.500000000 +x_0=0.000 +y_0=0.000 +units=m +no_defs',
            310642801: '+title=Geoportail - Crozet +proj=eqc +nadgrids=null +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=0.000000000 +lon_0=0.000000000 +lat_ts=-46.000000000 +x_0=0.000 +y_0=0.000 +units=m +no_defs',
            310642813: '+title=Geoportail - Amsterdam et Saint-Paul +proj=eqc +nadgrids=null +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=0.000000000 +lon_0=0.000000000 +lat_ts=-38.000000000 +x_0=0.000 +y_0=0.000 +units=m +no_defs',
            310642901: '+title=Geoportail - Monde +proj=mill +towgs84=0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.000000 +a=6378137.0000 +rf=298.2572221010000 +lon_0=0.000000000 +x_0=0.000 +y_0=0.000 +units=m +no_defs',
            5489: '+title=RGAF09 geographiques (dms) +proj=longlat +nadgrids=@null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137 +rf=298.257222101 +units=m +no_defs',
            5490: '+title=RGAF09 UTM Nord Fuseau 20 +proj=tmerc +nadgrids=@null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137 +rf=298.257222101 +lat_0=0.000000000 +lon_0=-63.000000000 +k_0=0.99960000 +x_0=500000.000 +y_0=0.000 +units=m +no_defs'
        },
        CRS: { 84: '+title=WGS 84 longitude-latitude +proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs ' },
        IGNF: {
            AMST63: '+title=Amsterdam 1963 +proj=geocent +towgs84=109.753,-528.133,-362.244,0,0,0,0 +a=6378388.0000 +rf=297.0000000000000 +units=m +no_defs',
            CROZ63: '+title=Crozet 1963 +proj=geocent +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378388.0000 +rf=297.0000000000000 +units=m +no_defs',
            CSG67: '+title=Guyane CSG67 +proj=geocent +towgs84=-193.0660,236.9930,105.4470,0.4814,-0.8074,0.1276,1.564900 +a=6378388.0000 +rf=297.0000000000000 +units=m +no_defs',
            ED50: '+title=ED50 +proj=geocent +towgs84=-84.0000,-97.0000,-117.0000 +a=6378388.0000 +rf=297.0000000000000 +units=m +no_defs',
            ETRS89: '+title=Systeme de reference terrestre Europeen (1989) +proj=geocent +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +units=m +no_defs',
            GUAD48: '+title=Guadeloupe Ste Anne +proj=geocent +towgs84=-472.2900,-5.6300,-304.1200,0.4362,-0.8374,0.2563,1.898400 +a=6378388.0000 +rf=297.0000000000000 +units=m +no_defs',
            GUADFM49: '+title=Guadeloupe Fort Marigot +proj=geocent +towgs84=136.5960,248.1480,-429.7890 +a=6378388.0000 +rf=297.0000000000000 +units=m +no_defs',
            IGN63: '+title=IGN 1963 (Hiva Oa, Tahuata, Mohotani) +proj=geocent +towgs84=410.7210,55.0490,80.7460,-2.5779,-2.3514,-0.6664,17.331100 +a=6378388.0000 +rf=297.0000000000000 +units=m +no_defs',
            IGN72: '+title=IGN 1972 Grande-Terre / Ile des Pins +proj=geocent +towgs84=-11.6400,-348.6000,291.6800 +a=6378388.0000 +rf=297.0000000000000 +units=m +no_defs',
            KERG62CAR: '+title=Kerguelen - K0 +proj=geocent +towgs84=144.8990,-186.7700,100.9230 +a=6378388.0000 +rf=297.0000000000000 +units=m +no_defs',
            MART38: '+title=Martinique Fort-Desaix +proj=geocent +towgs84=126.9260,547.9390,130.4090,-2.7867,5.1612,-0.8584,13.822650 +a=6378388.0000 +rf=297.0000000000000 +units=m +no_defs',
            MAYO50: '+title=Mayotte Combani +proj=geocent +towgs84=-599.9280,-275.5520,-195.6650,-0.0835,-0.4715,0.0602,49.281400 +a=6378388.0000 +rf=297.0000000000000 +units=m +no_defs',
            MOOREA87: '+title=Moorea 1987 +proj=geocent +towgs84=215.9820,149.5930,176.2290,3.2624,1.6920,1.1571,10.477300 +a=6378388.0000 +rf=297.0000000000000 +units=m +no_defs',
            NTF: '+title=Nouvelle Triangulation Francaise +proj=geocent +nadgrids=ntf_r93.gsb,null +wktext +towgs84=-168.0000,-60.0000,320.0000 +a=6378249.2000 +rf=293.4660210000000 +units=m +no_defs',
            NUKU72: '+title=IGN 1972 Nuku Hiva +proj=geocent +towgs84=165.7320,216.7200,180.5050,-0.6434,-0.4512,-0.0791,7.420400 +a=6378388.0000 +rf=297.0000000000000 +units=m +no_defs',
            REUN47: '+title=Reunion 1947 +proj=geocent +towgs84=789.5240,-626.4860,-89.9040,0.6006,76.7946,-10.5788,-32.324100 +a=6378388.0000 +rf=297.0000000000000 +units=m +no_defs',
            RGF93: '+title=Reseau geodesique francais 1993 +proj=geocent +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +units=m +no_defs',
            RGFG95: '+title=Reseau geodesique francais de Guyane 1995 +proj=geocent +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +units=m +no_defs',
            RGM04: '+title=RGM04 (Reseau Geodesique de Mayotte 2004) +proj=geocent +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +units=m +no_defs',
            RGNC: '+title=Reseau Geodesique de Nouvelle-Caledonie +proj=geocent +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +units=m +no_defs',
            RGPF: '+title=RGPF (Reseau Geodesique de Polynesie Francaise) +proj=geocent +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +units=m +no_defs',
            RGR92: '+title=Reseau geodesique Reunion 1992 +proj=geocent +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +units=m +no_defs',
            RGSPM06: '+title=Reseau Geodesique Saint-Pierre-et-Miquelon (2006) +proj=geocent +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +units=m +no_defs',
            RGTAAF07: '+title=Reseau Geodesique des TAAF (2007) +proj=geocent +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +units=m +no_defs',
            RRAF91: '+title=RRAF 1991 (Reseau de Reference des Antilles Francaises) +proj=geocent +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +units=m +no_defs',
            STPL69: '+title=Saint-Paul 1969 +proj=geocent +towgs84=225.571,-346.608,-46.567,0,0,0,0 +a=6378388.0000 +rf=297.0000000000000 +units=m +no_defs',
            STPM50: '+title=St Pierre et Miquelon 1950 +proj=geocent +towgs84=-95.5930,573.7630,173.4420,-0.9602,1.2510,-1.3918,42.626500 +a=6378206.4000 +rf=294.9786982000000 +units=m +no_defs',
            TAHAA: '+title=Raiatea - Tahaa 51-54 (Tahaa, Base Terme Est) +proj=geocent +towgs84=72.4380,345.9180,79.4860,-1.6045,-0.8823,-0.5565,1.374600 +a=6378388.0000 +rf=297.0000000000000 +units=m +no_defs',
            TAHI79: '+title=IGN79 (Tahiti) Iles de la Societe +proj=geocent +towgs84=221.5250,152.9480,176.7680,2.3847,1.3896,0.8770,11.474100 +a=6378388.0000 +rf=297.0000000000000 +units=m +no_defs',
            TERA50: '+title=Pointe Geologie - Perroud 1950 +proj=geocent +towgs84=324.9120,153.2820,172.0260 +a=6378388.0000 +rf=297.0000000000000 +units=m +no_defs',
            WALL78: '+title=Wallis-Uvea 1978 (MOP78) +proj=geocent +towgs84=253.0000,-133.0000,-127.0000 +a=6378388.0000 +rf=297.0000000000000 +units=m +no_defs',
            WGS72: '+title=World Geodetic System 1972 +proj=geocent +towgs84=0.0000,12.0000,6.0000 +a=6378135.0000 +rf=298.2600000000000 +units=m +no_defs',
            WGS84: '+title=World Geodetic System 1984 +proj=geocent +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +units=m +no_defs',
            AMST63GEO: '+title=Amsterdam 1963 +proj=longlat +towgs84=109.753,-528.133,-362.244,0,0,0,0 +a=6378388.0000 +rf=297.0000000000000 +units=m +no_defs',
            CROZ63GEO: '+title=Crozet 1963 +proj=longlat +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378388.0000 +rf=297.0000000000000 +units=m +no_defs',
            CSG67GEO: '+title=Guyane CSG67 +proj=longlat +towgs84=-193.0660,236.9930,105.4470,0.4814,-0.8074,0.1276,1.564900 +a=6378388.0000 +rf=297.0000000000000 +units=m +no_defs',
            ED50G: '+title=ED50 +proj=longlat +towgs84=-84.0000,-97.0000,-117.0000 +a=6378388.0000 +rf=297.0000000000000 +units=m +no_defs',
            GUAD48GEO: '+title=Guadeloupe Ste Anne +proj=longlat +towgs84=-472.2900,-5.6300,-304.1200,0.4362,-0.8374,0.2563,1.898400 +a=6378388.0000 +rf=297.0000000000000 +units=m +no_defs',
            GUADFM49GEO: '+title=Guadeloupe Fort Marigot +proj=longlat +towgs84=136.5960,248.1480,-429.7890 +a=6378388.0000 +rf=297.0000000000000 +units=m +no_defs',
            IGN63GEO: '+title=IGN 1963 (Hiva Oa, Tahuata, Mohotani) +proj=longlat +towgs84=410.7210,55.0490,80.7460,-2.5779,-2.3514,-0.6664,17.331100 +a=6378388.0000 +rf=297.0000000000000 +units=m +no_defs',
            IGN72GEO: '+title=IGN 1972 Grande-Terre / Ile des Pins +proj=longlat +towgs84=-11.6400,-348.6000,291.6800 +a=6378388.0000 +rf=297.0000000000000 +units=m +no_defs',
            KERG62GEO: '+title=Kerguelen - K0 +proj=longlat +towgs84=144.8990,-186.7700,100.9230 +a=6378388.0000 +rf=297.0000000000000 +units=m +no_defs',
            MART38GEO: '+title=Martinique Fort-Desaix +proj=longlat +towgs84=126.9260,547.9390,130.4090,-2.7867,5.1612,-0.8584,13.822650 +a=6378388.0000 +rf=297.0000000000000 +units=m +no_defs',
            MAYO50GEO: '+title=Mayotte Combani +proj=longlat +towgs84=-599.9280,-275.5520,-195.6650,-0.0835,-0.4715,0.0602,49.281400 +a=6378388.0000 +rf=297.0000000000000 +units=m +no_defs',
            MOOREA87GEO: '+title=Moorea 1987 +proj=longlat +towgs84=215.9820,149.5930,176.2290,3.2624,1.6920,1.1571,10.477300 +a=6378388.0000 +rf=297.0000000000000 +units=m +no_defs',
            NTFG: '+title=Nouvelle Triangulation Francaise Greenwich degres sexagesimaux +proj=longlat +nadgrids=ntf_r93.gsb,null +wktext +towgs84=-168.0000,-60.0000,320.0000 +a=6378249.2000 +rf=293.4660210000000 +units=m +no_defs',
            NTFP: '+title=Nouvelle Triangulation Francaise Paris grades +proj=longlat +nadgrids=ntf_r93.gsb,null +wktext +towgs84=-168.0000,-60.0000,320.0000 +a=6378249.2000 +rf=293.4660210000000 +pm=2.337229167 +units=m +no_defs',
            NUKU72GEO: '+title=IGN 1972 Nuku Hiva +proj=longlat +towgs84=165.7320,216.7200,180.5050,-0.6434,-0.4512,-0.0791,7.420400 +a=6378388.0000 +rf=297.0000000000000 +units=m +no_defs',
            REUN47GEO: '+title=Reunion 1947 +proj=longlat +towgs84=789.5240,-626.4860,-89.9040,0.6006,76.7946,-10.5788,-32.324100 +a=6378388.0000 +rf=297.0000000000000 +units=m +no_defs',
            RGF93G: '+title=Reseau geodesique francais 1993 +proj=longlat +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +units=m +no_defs',
            RGFG95GEO: '+title=Reseau geodesique francais de Guyane 1995 +proj=longlat +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +units=m +no_defs',
            RGM04GEO: '+title=RGM04 (Reseau Geodesique de Mayotte 2004) +proj=longlat +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +units=m +no_defs',
            RGNCGEO: '+title=Reseau Geodesique de Nouvelle-Caledonie +proj=longlat +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +units=m +no_defs',
            RGPFGEO: '+title=RGPF (Reseau Geodesique de Polynesie Francaise) +proj=longlat +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +units=m +no_defs',
            RGR92GEO: '+title=Reseau geodesique de la Reunion 1992 +proj=longlat +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +units=m +no_defs',
            RGSPM06GEO: '+title=Saint-Pierre-et-Miquelon (2006) +proj=longlat +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +units=m +no_defs',
            RGTAAF07G: '+title=Reseau Geodesique des TAAF (2007) (dms) +proj=longlat +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +units=m +no_defs',
            STPL69GEO: '+title=Saint-Paul 1969 +proj=longlat +towgs84=225.571,-346.608,-46.567,0,0,0,0 +a=6378388.0000 +rf=297.0000000000000 +units=m +no_defs',
            STPM50GEO: '+title=St Pierre et Miquelon 1950  +proj=longlat +towgs84=-95.5930,573.7630,173.4420,-0.9602,1.2510,-1.3918,42.626500 +a=6378206.4000 +rf=294.9786982000000 +units=m +no_defs',
            TAHAAGEO: '+title=Raiatea - Tahaa 51-54 (Tahaa, Base Terme Est) +proj=longlat +towgs84=72.4380,345.9180,79.4860,-1.6045,-0.8823,-0.5565,1.374600 +a=6378388.0000 +rf=297.0000000000000 +units=m +no_defs',
            TAHI79GEO: '+title=IGN79 (Tahiti) Iles de la Societe +proj=longlat +towgs84=221.5250,152.9480,176.7680,2.3847,1.3896,0.8770,11.474100 +a=6378388.0000 +rf=297.0000000000000 +units=m +no_defs',
            TERA50G: '+title=Pointe Geologie - Perroud 1950 +proj=longlat +towgs84=324.9120,153.2820,172.0260 +a=6378388.0000 +rf=297.0000000000000 +units=m +no_defs',
            WALL78GEO: '+title=Wallis - Uvea 1978 (MOP78) +proj=longlat +towgs84=253.0000,-133.0000,-127.0000 +a=6378388.0000 +rf=297.0000000000000 +units=m +no_defs',
            WGS72G: '+title=WGS72 +proj=longlat +towgs84=0.0000,12.0000,6.0000 +a=6378135.0000 +rf=298.2600000000000 +units=m +no_defs',
            WGS84G: '+title=World Geodetic System 1984 +proj=longlat +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +units=m +no_defs',
            WGS84RRAFGEO: '+title=Reseau de reference des Antilles francaises (1988-1991) +proj=longlat +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +units=m +no_defs',
            XGEO: '+title=Systeme CIO-BIH +proj=longlat +towgs84=0.0000,0.0000,0.5000,0.0000,0.0000,0.0140,-0.100000 +a=6378137.0000 +rf=298.2572221010000 +units=m +no_defs',
            AMST63UTM43S: '+title=Amsterdam 1963 UTM fuseau 43 Sud +proj=tmerc +towgs84=109.753,-528.133,-362.244,0,0,0,0 +a=6378388.0000 +rf=297.0000000000000 +lat_0=0.000000000 +lon_0=75.000000000 +k_0=0.99960000 +x_0=500000.000 +y_0=10000000.000 +units=m +no_defs',
            CROZ63UTM39S: '+title=Crozet 1963 +proj=tmerc +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378388.0000 +rf=297.0000000000000 +lat_0=0.000000000 +lon_0=51.000000000 +k_0=0.99960000 +x_0=500000.000 +y_0=10000000.000 +units=m +no_defs',
            CSG67UTM21: '+title=Guyane CSG67 UTM fuseau 21 +proj=tmerc +towgs84=-193.0660,236.9930,105.4470,0.4814,-0.8074,0.1276,1.564900 +a=6378388.0000 +rf=297.0000000000000 +lat_0=0.000000000 +lon_0=-57.000000000 +k_0=0.99960000 +x_0=500000.000 +y_0=0.000 +units=m +no_defs',
            CSG67UTM22: '+title=Guyane CSG67 UTM fuseau 22 +proj=tmerc +towgs84=-193.0660,236.9930,105.4470,0.4814,-0.8074,0.1276,1.564900 +a=6378388.0000 +rf=297.0000000000000 +lat_0=0.000000000 +lon_0=-51.000000000 +k_0=0.99960000 +x_0=500000.000 +y_0=0.000 +units=m +no_defs',
            GEOPORTALANF: '+title=Geoportail - Antilles francaises +proj=eqc +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=0.000000000 +lon_0=0.000000000 +lat_ts=15.000000000 +x_0=0.000 +y_0=0.000 +units=m +no_defs',
            GEOPORTALASP: '+title=Geoportail - Amsterdam et Saint-Paul +proj=eqc +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=0.000000000 +lon_0=0.000000000 +lat_ts=-38.000000000 +x_0=0.000 +y_0=0.000 +units=m +no_defs',
            GEOPORTALCRZ: '+title=Geoportail - Crozet +proj=eqc +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=0.000000000 +lon_0=0.000000000 +lat_ts=-46.000000000 +x_0=0.000 +y_0=0.000 +units=m +no_defs',
            GEOPORTALFXX: '+title=Geoportail - France metropolitaine +proj=eqc +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=0.000000000 +lon_0=0.000000000 +lat_ts=46.500000000 +x_0=0.000 +y_0=0.000 +units=m +no_defs',
            GEOPORTALGUF: '+title=Geoportail - Guyane +proj=eqc +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=0.000000000 +lon_0=0.000000000 +lat_ts=4.000000000 +x_0=0.000 +y_0=0.000 +units=m +no_defs',
            GEOPORTALKER: '+title=Geoportail - Kerguelen +proj=eqc +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=0.000000000 +lon_0=0.000000000 +lat_ts=-49.500000000 +x_0=0.000 +y_0=0.000 +units=m +no_defs',
            GEOPORTALMYT: '+title=Geoportail - Mayotte +proj=eqc +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=0.000000000 +lon_0=0.000000000 +lat_ts=-12.000000000 +x_0=0.000 +y_0=0.000 +units=m +no_defs',
            GEOPORTALNCL: '+title=Geoportail - Nouvelle-Caledonie +proj=eqc +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=0.000000000 +lon_0=0.000000000 +lat_ts=-22.000000000 +x_0=0.000 +y_0=0.000 +units=m +no_defs',
            GEOPORTALPYF: '+title=Geoportail - Polynesie francaise +proj=eqc +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=0.000000000 +lon_0=0.000000000 +lat_ts=-15.000000000 +x_0=0.000 +y_0=0.000 +units=m +no_defs',
            GEOPORTALREU: '+title=Geoportail - Reunion et dependances +proj=eqc +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=0.000000000 +lon_0=0.000000000 +lat_ts=-21.000000000 +x_0=0.000 +y_0=0.000 +units=m +no_defs',
            GEOPORTALSPM: '+title=Geoportail - Saint-Pierre et Miquelon +proj=eqc +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=0.000000000 +lon_0=0.000000000 +lat_ts=47.000000000 +x_0=0.000 +y_0=0.000 +units=m +no_defs',
            GEOPORTALWLF: '+title=Geoportail - Wallis et Futuna +proj=eqc +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=0.000000000 +lon_0=0.000000000 +lat_ts=-14.000000000 +x_0=0.000 +y_0=0.000 +units=m +no_defs',
            GUAD48UTM20: '+title=Guadeloupe Ste Anne +proj=tmerc +towgs84=-472.2900,-5.6300,-304.1200,0.4362,-0.8374,0.2563,1.898400 +a=6378388.0000 +rf=297.0000000000000 +lat_0=0.000000000 +lon_0=-63.000000000 +k_0=0.99960000 +x_0=500000.000 +y_0=0.000 +units=m +no_defs',
            GUADFM49U20: '+title=Guadeloupe Fort Marigot  +proj=tmerc +towgs84=136.5960,248.1480,-429.7890 +a=6378388.0000 +rf=297.0000000000000 +lat_0=0.000000000 +lon_0=-63.000000000 +k_0=0.99960000 +x_0=500000.000 +y_0=0.000 +units=m +no_defs',
            IGN63UTM7S: '+title=IGN 1963 - Hiva Oa, Tahuata, Mohotani - UTM fuseau 7 Sud +proj=tmerc +towgs84=410.7210,55.0490,80.7460,-2.5779,-2.3514,-0.6664,17.331100 +a=6378388.0000 +rf=297.0000000000000 +lat_0=0.000000000 +lon_0=-141.000000000 +k_0=0.99960000 +x_0=500000.000 +y_0=10000000.000 +units=m +no_defs',
            IGN72UTM58S: '+title=IGN 1972 - UTM fuseau 58 Sud +proj=tmerc +towgs84=-11.6400,-348.6000,291.6800 +a=6378388.0000 +rf=297.0000000000000 +lat_0=0.000000000 +lon_0=165.000000000 +k_0=0.99960000 +x_0=500000.000 +y_0=10000000.000 +units=m +no_defs',
            KERG62UTM42S: '+title=Kerguelen 1962 +proj=tmerc +towgs84=144.8990,-186.7700,100.9230 +a=6378388.0000 +rf=297.0000000000000 +lat_0=0.000000000 +lon_0=69.000000000 +k_0=0.99960000 +x_0=500000.000 +y_0=10000000.000 +units=m +no_defs',
            LAMB1: '+title=Lambert I +proj=lcc +nadgrids=ntf_r93.gsb,null +wktext +towgs84=-168.0000,-60.0000,320.0000 +a=6378249.2000 +rf=293.4660210000000 +pm=2.337229167 +lat_0=49.500000000 +lon_0=0.000000000 +k_0=0.99987734 +lat_1=49.500000000 +x_0=600000.000 +y_0=200000.000 +units=m +no_defs',
            LAMB1C: '+title=Lambert I Carto +proj=lcc +nadgrids=ntf_r93.gsb,null +wktext +towgs84=-168.0000,-60.0000,320.0000 +a=6378249.2000 +rf=293.4660210000000 +pm=2.337229167 +lat_0=49.500000000 +lon_0=0.000000000 +k_0=0.99987734 +lat_1=49.500000000 +x_0=600000.000 +y_0=1200000.000 +units=m +no_defs',
            LAMB2: '+title=Lambert II +proj=lcc +nadgrids=ntf_r93.gsb,null +wktext +towgs84=-168.0000,-60.0000,320.0000 +a=6378249.2000 +rf=293.4660210000000 +pm=2.337229167 +lat_0=46.800000000 +lon_0=0.000000000 +k_0=0.99987742 +lat_1=46.800000000 +x_0=600000.000 +y_0=200000.000 +units=m +no_defs',
            LAMB2C: '+title=Lambert II Carto +proj=lcc +nadgrids=ntf_r93.gsb,null +wktext +towgs84=-168.0000,-60.0000,320.0000 +a=6378249.2000 +rf=293.4660210000000 +pm=2.337229167 +lat_0=46.800000000 +lon_0=0.000000000 +k_0=0.99987742 +lat_1=46.800000000 +x_0=600000.000 +y_0=2200000.000 +units=m +no_defs',
            LAMB3: '+title=Lambert III +proj=lcc +nadgrids=ntf_r93.gsb,null +wktext +towgs84=-168.0000,-60.0000,320.0000 +a=6378249.2000 +rf=293.4660210000000 +pm=2.337229167 +lat_0=44.100000000 +lon_0=0.000000000 +k_0=0.99987750 +lat_1=44.100000000 +x_0=600000.000 +y_0=200000.000 +units=m +no_defs',
            LAMB3C: '+title=Lambert III Carto +proj=lcc +nadgrids=ntf_r93.gsb,null +wktext +towgs84=-168.0000,-60.0000,320.0000 +a=6378249.2000 +rf=293.4660210000000 +pm=2.337229167 +lat_0=44.100000000 +lon_0=0.000000000 +k_0=0.99987750 +lat_1=44.100000000 +x_0=600000.000 +y_0=3200000.000 +units=m +no_defs',
            LAMB4: '+title=Lambert IV +proj=lcc +nadgrids=ntf_r93.gsb,null +wktext +towgs84=-168.0000,-60.0000,320.0000 +a=6378249.2000 +rf=293.4660210000000 +pm=2.337229167 +lat_0=42.165000000 +lon_0=0.000000000 +k_0=0.99994471 +lat_1=42.165000000 +x_0=234.358 +y_0=185861.369 +units=m +no_defs',
            LAMB4C: '+title=Lambert IV Carto +proj=lcc +nadgrids=ntf_r93.gsb,null +wktext +towgs84=-168.0000,-60.0000,320.0000 +a=6378249.2000 +rf=293.4660210000000 +pm=2.337229167 +lat_0=42.165000000 +lon_0=0.000000000 +k_0=0.99994471 +lat_1=42.165000000 +x_0=234.358 +y_0=4185861.369 +units=m +no_defs',
            LAMB93: '+title=Lambert 93 +proj=lcc +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=46.500000000 +lon_0=3.000000000 +lat_1=44.000000000 +lat_2=49.000000000 +x_0=700000.000 +y_0=6600000.000 +units=m +no_defs',
            RGF93CC42: '+title=Lambert conique conforme Zone 1 +proj=lcc +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=42.000000000 +lon_0=3.000000000 +lat_1=41.200000000 +lat_2=42.800000000 +x_0=1700000.000 +y_0=1200000.000 +units=m +no_defs',
            RGF93CC43: '+title=Lambert conique conforme Zone 2 +proj=lcc +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=43.000000000 +lon_0=3.000000000 +lat_1=42.200000000 +lat_2=43.800000000 +x_0=1700000.000 +y_0=2200000.000 +units=m +no_defs',
            RGF93CC44: '+title=Lambert conique conforme Zone 3 +proj=lcc +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=44.000000000 +lon_0=3.000000000 +lat_1=43.200000000 +lat_2=44.800000000 +x_0=1700000.000 +y_0=3200000.000 +units=m +no_defs',
            RGF93CC45: '+title=Lambert conique conforme Zone 4 +proj=lcc +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=45.000000000 +lon_0=3.000000000 +lat_1=44.200000000 +lat_2=45.800000000 +x_0=1700000.000 +y_0=4200000.000 +units=m +no_defs',
            RGF93CC46: '+title=Lambert conique conforme Zone 5 +proj=lcc +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=46.000000000 +lon_0=3.000000000 +lat_1=45.200000000 +lat_2=46.800000000 +x_0=1700000.000 +y_0=5200000.000 +units=m +no_defs',
            RGF93CC47: '+title=Lambert conique conforme Zone 6 +proj=lcc +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=47.000000000 +lon_0=3.000000000 +lat_1=46.200000000 +lat_2=47.800000000 +x_0=1700000.000 +y_0=6200000.000 +units=m +no_defs',
            RGF93CC48: '+title=Lambert conique conforme Zone 7 +proj=lcc +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=48.000000000 +lon_0=3.000000000 +lat_1=47.200000000 +lat_2=48.800000000 +x_0=1700000.000 +y_0=7200000.000 +units=m +no_defs',
            RGF93CC49: '+title=Lambert conique conforme Zone 8 +proj=lcc +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=49.000000000 +lon_0=3.000000000 +lat_1=48.200000000 +lat_2=49.800000000 +x_0=1700000.000 +y_0=8200000.000 +units=m +no_defs',
            RGF93CC50: '+title=Lambert conique conforme Zone 9 +proj=lcc +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=50.000000000 +lon_0=3.000000000 +lat_1=49.200000000 +lat_2=50.800000000 +x_0=1700000.000 +y_0=9200000.000 +units=m +no_defs',
            LAMBE: '+title=Lambert II etendu +proj=lcc +nadgrids=ntf_r93.gsb,null +wktext +towgs84=-168.0000,-60.0000,320.0000 +a=6378249.2000 +rf=293.4660210000000 +pm=2.337229167 +lat_0=46.800000000 +lon_0=0.000000000 +k_0=0.99987742 +lat_1=46.800000000 +x_0=600000.000 +y_0=2200000.000 +units=m +no_defs',
            MART38UTM20: '+title=Martinique Fort-Desaix +proj=tmerc +towgs84=126.9260,547.9390,130.4090,-2.7867,5.1612,-0.8584,13.822650 +a=6378388.0000 +rf=297.0000000000000 +lat_0=0.000000000 +lon_0=-63.000000000 +k_0=0.99960000 +x_0=500000.000 +y_0=0.000 +units=m +no_defs',
            MAYO50UTM38S: '+title=Mayotte Combani +proj=tmerc +towgs84=-599.9280,-275.5520,-195.6650,-0.0835,-0.4715,0.0602,49.281400 +a=6378388.0000 +rf=297.0000000000000 +lat_0=0.000000000 +lon_0=45.000000000 +k_0=0.99960000 +x_0=500000.000 +y_0=10000000.000 +units=m +no_defs',
            MILLER: '+title=Geoportail - Monde +proj=mill +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lon_0=0.000000000 +x_0=0.000 +y_0=0.000 +units=m +no_defs',
            MOOREA87U6S: '+title=Moorea 1987 - UTM fuseau 6 Sud +proj=tmerc +towgs84=215.9820,149.5930,176.2290,3.2624,1.6920,1.1571,10.477300 +a=6378388.0000 +rf=297.0000000000000 +lat_0=0.000000000 +lon_0=-147.000000000 +k_0=0.99960000 +x_0=500000.000 +y_0=10000000.000 +units=m +no_defs',
            NUKU72U7S: '+title=IGN 1972 Nuku Hiva - UTM fuseau 7 Sud +proj=tmerc +towgs84=165.7320,216.7200,180.5050,-0.6434,-0.4512,-0.0791,7.420400 +a=6378388.0000 +rf=297.0000000000000 +lat_0=0.000000000 +lon_0=-141.000000000 +k_0=0.99960000 +x_0=500000.000 +y_0=10000000.000 +units=m +no_defs',
            REUN47GAUSSL: '+title=Reunion Gauss Laborde +proj=gstmerc +towgs84=789.5240,-626.4860,-89.9040,0.6006,76.7946,-10.5788,-32.324100 +a=6378388.0000 +rf=297.0000000000000 +lat_0=-21.116666667 +lon_0=55.533333333 +k_0=1.00000000 +x_0=160000.000 +y_0=50000.000 +units=m +no_defs',
            RGM04UTM38S: '+title=UTM fuseau 38 Sud (Reseau Geodesique de Mayotte 2004) +proj=tmerc +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=0.000000000 +lon_0=45.000000000 +k_0=0.99960000 +x_0=500000.000 +y_0=10000000.000 +units=m +no_defs',
            RGNCUTM57S: '+title=Reseau Geodesique de Nouvelle-Caledonie - UTM fuseau 57 Sud +proj=tmerc +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=0.000000000 +lon_0=159.000000000 +k_0=0.99960000 +x_0=500000.000 +y_0=10000000.000 +units=m +no_defs',
            RGNCUTM58S: '+title=Reseau Geodesique de Nouvelle-Caledonie - UTM fuseau 58 Sud +proj=tmerc +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=0.000000000 +lon_0=165.000000000 +k_0=0.99960000 +x_0=500000.000 +y_0=10000000.000 +units=m +no_defs',
            RGNCUTM59S: '+title=Reseau Geodesique de Nouvelle-Caledonie - UTM fuseau 59 Sud +proj=tmerc +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=0.000000000 +lon_0=171.000000000 +k_0=0.99960000 +x_0=500000.000 +y_0=10000000.000 +units=m +no_defs',
            RGPFUTM5S: '+title=RGPF - UTM fuseau 5 Sud +proj=tmerc +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=0.000000000 +lon_0=-153.000000000 +k_0=0.99960000 +x_0=500000.000 +y_0=10000000.000 +units=m +no_defs',
            RGPFUTM6S: '+title=RGPF - UTM fuseau 6 Sud +proj=tmerc +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=0.000000000 +lon_0=-147.000000000 +k_0=0.99960000 +x_0=500000.000 +y_0=10000000.000 +units=m +no_defs',
            RGPFUTM7S: '+title=RGPF - UTM fuseau 7 Sud +proj=tmerc +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=0.000000000 +lon_0=-141.000000000 +k_0=0.99960000 +x_0=500000.000 +y_0=10000000.000 +units=m +no_defs',
            RGR92UTM40S: '+title=RGR92 UTM fuseau 40 Sud +proj=tmerc +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=0.000000000 +lon_0=57.000000000 +k_0=0.99960000 +x_0=500000.000 +y_0=10000000.000 +units=m +no_defs',
            RGSPM06U21: '+title=Saint-Pierre-et-Miquelon (2006) UTM Fuseau 21 Nord +proj=tmerc +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=0.000000000 +lon_0=-57.000000000 +k_0=0.99960000 +x_0=500000.000 +y_0=0.000 +units=m +no_defs',
            STPL69UTM43S: '+title=Saint-Paul 1969 UTM fuseau 43 Sud +proj=tmerc +towgs84=225.571,-346.608,-46.567,0,0,0,0 +a=6378388.0000 +rf=297.0000000000000 +lat_0=0.000000000 +lon_0=75.000000000 +k_0=0.99960000 +x_0=500000.000 +y_0=10000000.000 +units=m +no_defs',
            STPM50UTM21: '+title=St Pierre et Miquelon 1950 +proj=tmerc +towgs84=-95.5930,573.7630,173.4420,-0.9602,1.2510,-1.3918,42.626500 +a=6378206.4000 +rf=294.9786982000000 +lat_0=0.000000000 +lon_0=-57.000000000 +k_0=0.99960000 +x_0=500000.000 +y_0=0.000 +units=m +no_defs',
            TAHAAUTM05S: '+title=Tahaa 1951 +proj=tmerc +towgs84=72.4380,345.9180,79.4860,-1.6045,-0.8823,-0.5565,1.374600 +a=6378388.0000 +rf=297.0000000000000 +lat_0=0.000000000 +lon_0=-153.000000000 +k_0=0.99960000 +x_0=500000.000 +y_0=10000000.000 +units=m +no_defs',
            TAHI51UTM06S: '+title=Tahiti-Terme Nord UTM fuseau 6 Sud +proj=tmerc +towgs84=162.0000,117.0000,154.0000 +a=6378388.0000 +rf=297.0000000000000 +lat_0=0.000000000 +lon_0=-147.000000000 +k_0=0.99960000 +x_0=500000.000 +y_0=10000000.000 +units=m +no_defs',
            TAHI79UTM6S: '+title=Tahiti 1979 +proj=tmerc +towgs84=221.5250,152.9480,176.7680,2.3847,1.3896,0.8770,11.474100 +a=6378388.0000 +rf=297.0000000000000 +lat_0=0.000000000 +lon_0=-147.000000000 +k_0=0.99960000 +x_0=500000.000 +y_0=10000000.000 +units=m +no_defs',
            TERA50STEREO: '+title=Terre Adelie 1950 +proj=stere +towgs84=324.9120,153.2820,172.0260 +a=6378388.0000 +rf=297.0000000000000 +lat_0=-90.000000000 +lon_0=140.000000000 +lat_ts=-67 +k=0.96027295 +x_0=300000.000 +y_0=-2299363.482 +units=m +no_defs',
            UTM01SW84: '+title=World Geodetic System 1984 UTM fuseau 01 Sud +proj=tmerc +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=0.000000000 +lon_0=-177.000000000 +k_0=0.99960000 +x_0=500000.000 +y_0=10000000.000 +units=m +no_defs',
            UTM20W84GUAD: '+title=World Geodetic System 1984 UTM fuseau 20 Nord-Guadeloupe +proj=tmerc +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=0.000000000 +lon_0=-63.000000000 +k_0=0.99960000 +x_0=500000.000 +y_0=0.000 +units=m +no_defs',
            UTM20W84MART: '+title=World Geodetic System 1984 UTM fuseau 20 Nord-Martinique +proj=tmerc +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=0.000000000 +lon_0=-63.000000000 +k_0=0.99960000 +x_0=500000.000 +y_0=0.000 +units=m +no_defs',
            UTM22RGFG95: '+title=RGFG95 UTM fuseau 22 Nord-Guyane +proj=tmerc +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=0.000000000 +lon_0=-51.000000000 +k_0=0.99960000 +x_0=500000.000 +y_0=0.000 +units=m +no_defs',
            UTM39SW84: '+title=World Geodetic System 1984 UTM fuseau 39 Sud +proj=tmerc +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=0.000000000 +lon_0=51.000000000 +k_0=0.99960000 +x_0=500000.000 +y_0=10000000.000 +units=m +no_defs',
            UTM42SW84: '+title=World Geodetic System 1984 UTM fuseau 42 Sud +proj=tmerc +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=0.000000000 +lon_0=69.000000000 +k_0=0.99960000 +x_0=500000.000 +y_0=10000000.000 +units=m +no_defs',
            UTM43SW84: '+title=World Geodetic System 1984 UTM fuseau 43 Sud +proj=tmerc +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=0.000000000 +lon_0=75.000000000 +k_0=0.99960000 +x_0=500000.000 +y_0=10000000.000 +units=m +no_defs',
            WALL78UTM1S: '+title=Wallis-Uvea 1978 (MOP78) UTM 1 SUD +proj=tmerc +towgs84=253.0000,-133.0000,-127.0000 +a=6378388.0000 +rf=297.0000000000000 +lat_0=0.000000000 +lon_0=-177.000000000 +k_0=0.99960000 +x_0=500000.000 +y_0=10000000.000 +units=m +no_defs',
            ETRS89GEO: '+title=ETRS89 geographiques (dms) +proj=longlat +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +units=m +no_defs',
            ETRS89LAEA: '+title=ETRS89 Lambert Azimutal Equal Area +proj=laea +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=52.000000000 +lon_0=10.000000000 +x_0=4321000.000 +y_0=3210000.000 +units=m +no_defs',
            ETRS89LCC: '+title=ETRS89 Lambert Conformal Conic +proj=lcc +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=52.000000000 +lon_0=9.999999995 +lat_1=35.000000000 +lat_2=65.000000000 +x_0=4000000.000 +y_0=2800000.000 +units=m +no_defs',
            UTM26ETRS89: '+title=Europe - de 30d a 24d Ouest +proj=tmerc +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=0.000000000 +lon_0=-27.000000000 +k_0=0.99960000 +x_0=500000.000 +y_0=0.000 +units=m +no_defs',
            UTM27ETRS89: '+title=Europe - de 24d a 18d Ouest +proj=tmerc +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=0.000000000 +lon_0=-21.000000000 +k_0=0.99960000 +x_0=500000.000 +y_0=0.000 +units=m +no_defs',
            UTM28ETRS89: '+title=Europe - de 18d a 12d Ouest +proj=tmerc +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=0.000000000 +lon_0=-15.000000000 +k_0=0.99960000 +x_0=500000.000 +y_0=0.000 +units=m +no_defs',
            UTM29ETRS89: '+title=Europe - de 12d a 6d Ouest +proj=tmerc +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=0.000000000 +lon_0=-9.000000000 +k_0=0.99960000 +x_0=500000.000 +y_0=0.000 +units=m +no_defs',
            UTM30ETRS89: '+title=Europe - de -6d a 0d Ouest +proj=tmerc +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=0.000000000 +lon_0=-3.000000000 +k_0=0.99960000 +x_0=500000.000 +y_0=0.000 +units=m +no_defs',
            UTM31ETRS89: '+title=Europe - de 0d a 6d Est +proj=tmerc +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=0.000000000 +lon_0=3.000000000 +k_0=0.99960000 +x_0=500000.000 +y_0=0.000 +units=m +no_defs',
            UTM32ETRS89: '+title=Europe - de 6d a 12d Est +proj=tmerc +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=0.000000000 +lon_0=9.000000000 +k_0=0.99960000 +x_0=500000.000 +y_0=0.000 +units=m +no_defs',
            UTM33ETRS89: '+title=Europe - de 12d a 18d Est +proj=tmerc +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=0.000000000 +lon_0=15.000000000 +k_0=0.99960000 +x_0=500000.000 +y_0=0.000 +units=m +no_defs',
            UTM34ETRS89: '+title=Europe - de 18d a 24d Est +proj=tmerc +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=0.000000000 +lon_0=21.000000000 +k_0=0.99960000 +x_0=500000.000 +y_0=0.000 +units=m +no_defs',
            UTM35ETRS89: '+title=Europe - de 24d a 30d Est +proj=tmerc +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=0.000000000 +lon_0=27.000000000 +k_0=0.99960000 +x_0=500000.000 +y_0=0.000 +units=m +no_defs',
            UTM36ETRS89: '+title=Europe - de 30d a 36d Est +proj=tmerc +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=0.000000000 +lon_0=33.000000000 +k_0=0.99960000 +x_0=500000.000 +y_0=0.000 +units=m +no_defs',
            UTM37ETRS89: '+title=Europe - de 36d a 42d Est +proj=tmerc +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=0.000000000 +lon_0=39.000000000 +k_0=0.99960000 +x_0=500000.000 +y_0=0.000 +units=m +no_defs',
            UTM38ETRS89: '+title=Europe - de 42d a 48d Est +proj=tmerc +nadgrids=null +wktext +towgs84=0.0000,0.0000,0.0000 +a=6378137.0000 +rf=298.2572221010000 +lat_0=0.000000000 +lon_0=45.000000000 +k_0=0.99960000 +x_0=500000.000 +y_0=0.000 +units=m +no_defs'
        }
    };
    return Register;
}(proj4);
Ol3CRSCRS = function (proj4, ol, Register) {
    (function () {
        Register.load();
        if (!ol.proj.proj4_ && ol.proj.setProj4) {
            ol.proj.setProj4(proj4);
        } else {
            console.log('WARNING : OpenLayers library should manage proj4 dependency in order to add custom projections (Lambert 93 for instance)');
        }
    }());
    var CRS = {
        overloadTransformExtent: function () {
            ol.proj.transformExtent = function (extent, source, destination) {
                if (destination === 'EPSG:2154') {
                    if (source === 'EPSG:4326') {
                        if (extent[0] < -9.62) {
                            extent[0] = -9.62;
                        }
                        if (extent[1] < 41.18) {
                            extent[1] = 41.18;
                        }
                        if (extent[2] > 10.3) {
                            extent[2] = 10.3;
                        }
                        if (extent[3] > 51.54) {
                            extent[3] = 51.54;
                        }
                    }
                }
                var transformFn = ol.proj.getTransform(source, destination);
                var transformedExtent = ol.extent.applyTransform(extent, transformFn);
                return transformedExtent;
            };
        },
        overload: function () {
            this.overloadTransformExtent();
        }
    };
    return CRS;
}(proj4, ol, CommonUtilsRegister);
CommonUtilsLayerUtils = function () {
    var LayerUtils = {
        getZoomLevelFromScaleDenominator: function (scaleDenominator, crs) {
            var resolutionsNatives = {};
            switch (crs) {
            case 'EPSG:2154':
                resolutionsNatives = {
                    0: 104579.224549894,
                    1: 52277.5323537905,
                    2: 26135.4870785954,
                    3: 13066.8913818,
                    4: 6533.2286041135,
                    5: 3266.5595244627,
                    6: 1633.2660045974,
                    7: 816.629554986,
                    8: 408.3139146768,
                    9: 204.1567415109,
                    10: 102.0783167832,
                    11: 51.0391448966,
                    12: 25.5195690743,
                    13: 12.7597836936,
                    14: 6.379891636,
                    15: 3.1899457653,
                    16: 1.5949728695,
                    17: 0.7974864315,
                    18: 0.3987432149,
                    19: 0.1993716073,
                    20: 0.0996858037,
                    21: 0.0498429018
                };
                break;
            default:
                resolutionsNatives = {
                    0: 156543.033928041,
                    1: 78271.51696402048,
                    2: 39135.758482010235,
                    3: 19567.87924100512,
                    4: 9783.93962050256,
                    5: 4891.96981025128,
                    6: 2445.98490512564,
                    7: 1222.99245256282,
                    8: 611.49622628141,
                    9: 305.7481131407048,
                    10: 152.8740565703525,
                    11: 76.43702828517624,
                    12: 38.21851414258813,
                    13: 19.10925707129406,
                    14: 9.554628535647032,
                    15: 4.777314267823516,
                    16: 2.388657133911758,
                    17: 1.194328566955879,
                    18: 0.5971642834779395,
                    19: 0.2985821417389697,
                    20: 0.1492910708694849,
                    21: 0.0746455354347424
                };
                break;
            }
            var resolution = scaleDenominator * 0.00028;
            for (var index in resolutionsNatives) {
                if (resolutionsNatives.hasOwnProperty(index)) {
                    if (resolutionsNatives[index] <= resolution) {
                        index = parseInt(index, 10);
                        return index;
                    }
                }
            }
            return 0;
        },
        getAttributions: function (params) {
            var zoom = params.zoom;
            var attributions = [];
            if (params.originators != null && params.visibility) {
                var drawLogo;
                for (var j = 0, jl = params.originators.length; j < jl; j++) {
                    drawLogo = true;
                    var originator = params.originators[j];
                    var constraints = params.originators[j].constraints || [];
                    for (var k = 0, kl = constraints.length; k < kl; k++) {
                        var constraint = constraints[k];
                        drawLogo = true;
                        var minZoomLevel = this.getZoomLevelFromScaleDenominator(constraint.maxScaleDenominator, params.crs);
                        var maxZoomLevel = this.getZoomLevelFromScaleDenominator(constraint.minScaleDenominator, params.crs) || 21;
                        if (minZoomLevel && minZoomLevel > zoom) {
                            drawLogo = false;
                        }
                        if (drawLogo && maxZoomLevel !== null && maxZoomLevel < zoom) {
                            drawLogo = false;
                        }
                        var bbox = constraint.bbox;
                        if (drawLogo && bbox) {
                            drawLogo = false;
                            var viewExtent = params.extent;
                            if (viewExtent) {
                                var bounds = [
                                    bbox.top,
                                    bbox.left,
                                    bbox.bottom,
                                    bbox.right
                                ];
                                if (this.intersects(viewExtent, bounds)) {
                                    drawLogo = true;
                                    break;
                                }
                            }
                        }
                    }
                    if (drawLogo) {
                        var logo = originator.logo;
                        var url = originator.url;
                        var name = originator.name ? originator.name : '';
                        var text = originator.attribution;
                        var container = document.createElement('div');
                        container.className = 'gp-control-attribution';
                        var link = null;
                        link = document.createElement('a');
                        link.className = 'gp-control-attribution-link';
                        link.target = '_blank';
                        container.appendChild(link);
                        if (url) {
                            link.href = url;
                        }
                        var bImage = logo ? true : false;
                        var image = null;
                        if (bImage) {
                            image = document.createElement('img');
                            if (link) {
                                image.className = 'gp-control-attribution-image';
                                link.appendChild(image);
                            } else {
                                image.className = '';
                                container.appendChild(image);
                            }
                            image.src = logo;
                            image.title = text || name;
                            image.style.height = '30px';
                            image.style.width = '30px';
                        } else {
                            if (name) {
                                link.textContent = name;
                            } else if (text) {
                                link.textContent = text;
                            } else if (url) {
                                link.textContent = url;
                            } else {
                                link.textContent = '';
                            }
                        }
                        attributions.push(container.innerHTML + ' ');
                    }
                }
            }
            return attributions;
        },
        intersects: function (extent1, extent2) {
            var intersectsX = extent1[1] <= extent2[3] && extent2[1] <= extent1[3];
            var intersectsY = extent1[2] <= extent2[0] && extent2[2] <= extent1[0];
            return intersectsX && intersectsY;
        }
    };
    return LayerUtils;
}();
Ol3Utils = function (ol, Gp) {
    var Utils = {
        assign: function (dest, source) {
            dest = dest || {};
            for (var prop in source) {
                if (source.hasOwnProperty(prop)) {
                    dest[prop] = source[prop];
                }
            }
            return dest;
        },
        mergeParams: function (dest, source) {
            if (!dest || !source) {
                return;
            }
            for (var param in source) {
                if (source.hasOwnProperty(param)) {
                    if (typeof source[param] === 'object') {
                        if (dest.hasOwnProperty(param)) {
                            this.mergeParams(dest[param], source[param]);
                        } else {
                            dest[param] = source[param];
                        }
                    } else {
                        dest[param] = source[param];
                    }
                }
            }
        },
        detectSupport: function () {
            var isDesktop = true;
            var userAgent = window.navigator.userAgent.toLowerCase();
            if (userAgent.indexOf('iphone') !== -1 || userAgent.indexOf('ipod') !== -1 || userAgent.indexOf('ipad') !== -1 || userAgent.indexOf('android') !== -1 || userAgent.indexOf('mobile') !== -1 || userAgent.indexOf('blackberry') !== -1 || userAgent.indexOf('tablet') !== -1 || userAgent.indexOf('phone') !== -1 || userAgent.indexOf('touch') !== -1) {
                isDesktop = false;
            }
            if (userAgent.indexOf('msie') !== -1 || userAgent.indexOf('trident') !== -1) {
                isDesktop = true;
            }
            return isDesktop;
        },
        getOL3ObjectId: function (ol3obj) {
            var id = null;
            if (!ol3obj) {
                return;
            }
            for (var key in ol3obj) {
                if (typeof key !== 'string' || key.indexOf('closure_uid') < 0) {
                    continue;
                }
                return ol3obj[key];
            }
            return id;
        },
        getGetFeatureInfoUrl: function (source, coordinate, resolution, projection, params) {
            var pixelRatio = source.option && source.options.tilePixelRatio ? source.options.tilePixelRatio : 1;
            var tileGrid = source.tileGrid;
            var tileCoord = source.tileGrid.getTileCoordForCoordAndResolution(coordinate, resolution);
            var getTransformedTileCoord = function (tileCoord, tileGrid, projection) {
                var tmpTileCoord = [
                    0,
                    0,
                    0
                ];
                var tmpExtent = ol.extent.createEmpty();
                var x = tileCoord[1];
                var y = -tileCoord[2] - 1;
                var tileExtent = tileGrid.getTileCoordExtent(tileCoord);
                var projectionExtent = projection.getExtent();
                var extent = projectionExtent;
                if (extent != null && projection.isGlobal() && extent[0] === projectionExtent[0] && extent[2] === projectionExtent[2]) {
                    var numCols = Math.ceil(ol.extent.getWidth(extent) / ol.extent.getWidth(tileExtent));
                    x = x % numCols;
                    tmpTileCoord[0] = tileCoord[0];
                    tmpTileCoord[1] = x;
                    tmpTileCoord[2] = tileCoord[2];
                    tileExtent = tileGrid.getTileCoordExtent(tmpTileCoord, tmpExtent);
                }
                if (!ol.extent.intersects(tileExtent, extent)) {
                    return null;
                }
                return [
                    tileCoord[0],
                    x,
                    y
                ];
            };
            var tileExtent = tileGrid.getTileCoordExtent(tileCoord);
            var transformedTileCoord = getTransformedTileCoord(tileCoord, tileGrid, projection);
            if (tileGrid.getResolutions().length <= tileCoord[0]) {
                return undefined;
            }
            var tileResolution = tileGrid.getResolution(tileCoord[0]);
            var tileMatrix = tileGrid.getMatrixIds()[tileCoord[0]];
            var baseParams = {
                SERVICE: 'WMTS',
                VERSION: '1.0.0',
                REQUEST: 'GetFeatureInfo',
                LAYER: source.getLayer(),
                TILECOL: transformedTileCoord[1],
                TILEROW: transformedTileCoord[2],
                TILEMATRIX: tileMatrix,
                TILEMATRIXSET: source.getMatrixSet(),
                FORMAT: source.getFormat() || 'image/png',
                STYLE: source.getStyle() || 'normal'
            };
            this.assign(baseParams, params);
            var x = Math.floor((coordinate[0] - tileExtent[0]) / (tileResolution / pixelRatio));
            var y = Math.floor((tileExtent[3] - coordinate[1]) / (tileResolution / pixelRatio));
            baseParams['I'] = x;
            baseParams['J'] = y;
            var url = source.urls[0];
            var featureInfoUrl = Gp.Helper.normalyzeUrl(url, baseParams);
            return featureInfoUrl;
        }
    };
    return Utils;
}(ol, gp);
Ol3FormatsKML = function (woodman, ol, Utils) {
    function KML(options) {
        if (!(this instanceof KML)) {
            throw new TypeError('ERROR CLASS_CONSTRUCTOR');
        }
        ol.format.KML.call(this, options);
        this.options = options || {};
    }
    ol.inherits(KML, ol.format.KML);
    KML.prototype = Object.create(ol.format.KML.prototype, {});
    KML.prototype.constructor = KML;
    function _kmlFormattedToString(xml) {
        var reg = /(>)\s*(<)(\/*)/g;
        var wsexp = / *(.*) +\n/g;
        var contexp = /(<.+>)(.+\n)/g;
        xml = xml.replace(reg, '$1\n$2$3').replace(wsexp, '$1\n').replace(contexp, '$1\n$2');
        var formatted = '';
        var lines = xml.split('\n');
        var indent = 0;
        var lastType = 'other';
        var transitions = {
            'single->single': 0,
            'single->closing': -1,
            'single->opening': 0,
            'single->other': 0,
            'closing->single': 0,
            'closing->closing': -1,
            'closing->opening': 0,
            'closing->other': 0,
            'opening->single': 1,
            'opening->closing': 0,
            'opening->opening': 1,
            'opening->other': 1,
            'other->single': 0,
            'other->closing': -1,
            'other->opening': 0,
            'other->other': 0
        };
        for (var i = 0; i < lines.length; i++) {
            var ln = lines[i];
            var single = Boolean(ln.match(/<.+\/>/));
            var closing = Boolean(ln.match(/<\/.+>/));
            var opening = Boolean(ln.match(/<[^!].*>/));
            var type = single ? 'single' : closing ? 'closing' : opening ? 'opening' : 'other';
            var fromTo = lastType + '->' + type;
            lastType = type;
            var padding = '';
            indent += transitions[fromTo];
            for (var j = 0; j < indent; j++) {
                padding += '\t';
            }
            if (fromTo == 'opening->closing') {
                formatted = formatted.substr(0, formatted.length - 1) + ln + '\n';
            } else {
                formatted += padding + ln + '\n';
            }
        }
        return formatted;
    }
    function _kmlParse(kmlString) {
        var kmlDoc = null;
        var parser = null;
        var scope = typeof window !== 'undefined' ? window : null;
        if (typeof exports === 'object' && window === null) {
            var DOMParser = xmldom.DOMParser;
            parser = new DOMParser();
            kmlDoc = parser.parseFromString(kmlString, 'text/xml');
        } else if (scope.DOMParser) {
            parser = new scope.DOMParser();
            kmlDoc = parser.parseFromString(kmlString, 'text/xml');
        } else if (scope.ActiveXObject) {
            kmlDoc = new scope.ActiveXObject('Microsoft.XMLDOM');
            kmlDoc.async = false;
            kmlDoc.loadXML(kmlString);
        } else {
            console.log('Incompatible environment for DOM Parser !');
        }
        return kmlDoc;
    }
    function _kmlToString(kmlDoc) {
        var oSerializer = new XMLSerializer();
        var kmlStringExtended = oSerializer.serializeToString(kmlDoc);
        return kmlStringExtended;
    }
    function _kmlRead(kmlDoc, features, process) {
        var root = kmlDoc.documentElement;
        var firstNodeLevel = root.childNodes;
        var nodes = firstNodeLevel;
        if (firstNodeLevel.length === 1 && firstNodeLevel[0].nodeName === 'Document') {
            nodes = firstNodeLevel[0].childNodes;
        }
        var stylesUrl = {};
        var index = -1;
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            switch (node.nodeName) {
            case 'Style':
                var id = node.attributes[0];
                if (id.nodeName === 'id') {
                    var _k = id.nodeValue;
                    var _v = node;
                    stylesUrl[_k] = _v;
                }
                break;
            case 'Placemark':
                index++;
                var types = node.childNodes;
                var point = false;
                var styles = null;
                var extend = null;
                var name = node;
                for (var j = 0; j < types.length; j++) {
                    switch (types[j].nodeName) {
                    case 'Point':
                        point = true;
                        break;
                    case 'Style':
                        styles = types[j].childNodes;
                        break;
                    case 'styleUrl':
                        var _idStyle = types[j].textContent.slice(1);
                        if (stylesUrl[_idStyle]) {
                            styles = stylesUrl[_idStyle].childNodes;
                        }
                        break;
                    case 'ExtendedData':
                        extend = types[j].childNodes;
                        break;
                    case 'name':
                        name = null;
                        break;
                    default:
                    }
                }
                if (extend) {
                    var fctExtend = process.extendedData;
                    if (fctExtend && typeof fctExtend === 'function') {
                        fctExtend(features[index], extend);
                    }
                }
                if (name) {
                    var fctName = process.nameData;
                    if (fctName && typeof fctName === 'function') {
                        fctName(features[index], name);
                    }
                }
                if (point && styles) {
                    if (styles.length) {
                        var labelStyle = null;
                        var iconStyle = null;
                        for (var k = 0; k < styles.length; k++) {
                            switch (styles[k].nodeName) {
                            case 'LabelStyle':
                                labelStyle = styles[k];
                                break;
                            case 'IconStyle':
                                iconStyle = styles[k];
                                break;
                            default:
                            }
                        }
                        var labelName = features[index].getProperties().name;
                        var labelDescription = features[index].getProperties().description;
                        var value = labelName || labelDescription;
                        if (!iconStyle && labelStyle) {
                            var fctLabel = process.labelStyle;
                            if (fctLabel && typeof fctLabel === 'function') {
                                fctLabel(features[index], labelStyle);
                            }
                        } else if (iconStyle && !labelStyle) {
                            var fctIcon = process.iconStyle;
                            if (fctIcon && typeof fctIcon === 'function') {
                                fctIcon(features[index], iconStyle);
                            }
                        } else if (iconStyle && labelStyle) {
                            var fctIconLabel = process.iconLabelStyle;
                            if (fctIconLabel && typeof fctIconLabel === 'function') {
                                fctIconLabel(features[index], iconStyle, labelStyle);
                            }
                        }
                    }
                }
                break;
            default:
            }
        }
    }
    KML.prototype.writeFeatures = function (features, options) {
        var kmlString = this._writeExtendStylesFeatures(features, options);
        return kmlString;
    };
    KML.prototype._writeExtendStylesFeatures = function (features, options) {
        var kmlString = ol.format.KML.prototype.writeFeatures.call(this, features, options);
        var kmlDoc = _kmlParse(kmlString);
        if (kmlDoc === null) {
            return kmlString;
        }
        var __createExtensionStyleLabel = function (feature, style) {
            if (!feature) {
                return;
            }
            var labelName = feature.getProperties().name;
            if (!labelName) {
                return;
            }
            function __convertRGBColorsToKML(data) {
                var strColor = data.toString(16);
                if (strColor.charAt(0) === '#') {
                    strColor = strColor.slice(1);
                }
                var opacity = 1;
                opacity = parseInt(opacity * 255, 10);
                opacity = opacity.toString(16);
                var color = opacity;
                color = color + strColor.substr(4, 2);
                color = color + strColor.substr(2, 2);
                color = color + strColor.substr(0, 2);
                return color.toLowerCase();
            }
            if (feature.getStyle() instanceof ol.style.Style) {
                var fTextStyle = feature.getStyle().getText().getStroke();
                if (!fTextStyle) {
                    return;
                }
                var _haloColor = __convertRGBColorsToKML(fTextStyle.getColor()) || __convertRGBColorsToKML('#FFFFFF');
                var _haloRadius = fTextStyle.getWidth() || '0';
                var _haloOpacity = '1';
                var _font = 'Sans';
                if (style && style.getElementsByTagName('LabelStyleSimpleExtensionGroup').length === 0) {
                    var labelextend = kmlDoc.createElement('LabelStyleSimpleExtensionGroup');
                    labelextend.setAttribute('fontFamily', _font);
                    labelextend.setAttribute('haloColor', _haloColor);
                    labelextend.setAttribute('haloRadius', _haloRadius);
                    labelextend.setAttribute('haloOpacity', _haloOpacity);
                    style.appendChild(labelextend);
                }
            }
        };
        var __createHotSpotStyleIcon = function (feature, style) {
            if (!feature) {
                return;
            }
            var proxy = feature.getProperties().proxyUrl;
            if (proxy) {
            }
            if (feature.getStyle() instanceof ol.style.Style) {
                var fImageStyle = feature.getStyle().getImage();
                if (!fImageStyle) {
                    return;
                }
                var x = 0;
                var y = 0;
                var xunits = 'pixels';
                var yunits = 'pixels';
                var size = fImageStyle.getSize();
                var anchor = fImageStyle.getAnchor();
                if (anchor.length) {
                    x = anchor[0];
                    y = anchor[1];
                    if (yunits === 'fraction') {
                        y = anchor[1] === 1 ? 0 : 1 - anchor[1];
                    } else {
                        y = yunits === 'pixels' && anchor[1] === size[1] ? 0 : size[1] - anchor[1];
                    }
                }
                if (style && style.getElementsByTagName('hotSpot').length === 0) {
                    var hotspot = kmlDoc.createElement('hotSpot');
                    hotspot.setAttribute('x', x);
                    hotspot.setAttribute('y', y);
                    hotspot.setAttribute('xunits', xunits);
                    hotspot.setAttribute('yunits', yunits);
                    style.appendChild(hotspot);
                }
            }
        };
        var __createStyleToFeatureIconLabel = function (feature, iconStyle, labelStyle) {
            __createHotSpotStyleIcon(feature, iconStyle);
            __createExtensionStyleLabel(feature, labelStyle);
        };
        var __setNameData = function (feature, tags) {
            for (var i = 0; i < tags.length; i++) {
                var tag = tags[i];
                if (tag.nodeName === 'name') {
                    return;
                }
            }
            var labelName = feature.getProperties().name;
            if (labelName) {
                var name = kmlDoc.createElement('name');
                name.innerHTML = labelName;
                tags.appendChild(name);
            }
        };
        _kmlRead(kmlDoc, features, {
            labelStyle: __createExtensionStyleLabel,
            iconStyle: __createHotSpotStyleIcon,
            iconLabelStyle: __createStyleToFeatureIconLabel,
            nameData: __setNameData
        });
        var kmlStringExtended = _kmlToString(kmlDoc);
        if (kmlStringExtended === null) {
            kmlStringExtended = kmlString;
        }
        var kmlStringFormatted = _kmlFormattedToString(kmlStringExtended);
        if (kmlStringFormatted === null) {
            kmlStringFormatted = kmlString;
        }
        return kmlStringFormatted;
    };
    KML.prototype.readFeatures = function (source, options) {
        var features = this._readExtendStylesFeatures(source, options);
        return features;
    };
    KML.prototype._readExtendStylesFeatures = function (source, options) {
        var features = ol.format.KML.prototype.readFeatures.call(this, source, options);
        var kmlDoc = null;
        var kmlString = '';
        if (typeof source === 'string') {
            kmlString = source;
        } else {
            kmlString = source.documentElement.outerHTML;
        }
        kmlString = kmlString.replace(/\n/g, '');
        kmlString = kmlString.replace(/(>)\s*(<)/g, '$1$2');
        kmlDoc = _kmlParse(kmlString);
        if (kmlDoc === null) {
            return features;
        }
        var proxy = this.options.proxyUrl || null;
        var __getExtensionStyleToFeatureLabel = function (feature, style) {
            if (!feature) {
                return;
            }
            function __convertKMLColorsToRGB(data) {
                var color = '';
                color = color + data.substr(6, 2);
                color = color + data.substr(4, 2);
                color = color + data.substr(2, 2);
                var hex = parseInt(color, 16).toString(16);
                var comp = '';
                var len = hex.length || 0;
                for (var i = 0; i < 6 - len; i++) {
                    comp += '0';
                }
                hex = '#' + comp + hex;
                return hex.toString(16);
            }
            var _text = feature.getProperties().name || '---';
            var _color = __convertKMLColorsToRGB('ff000000');
            var _colorHalo = '#FFFFFF';
            var _radiusHalo = 0;
            var _font = 'Sans';
            var _fontSize = '16px';
            var bLabelStyleSimpleExtensionGroup = false;
            var styles = style.childNodes;
            for (var k = 0; k < styles.length; k++) {
                switch (styles[k].nodeName) {
                case 'scale':
                    break;
                case 'colorMode':
                    break;
                case 'color':
                    _color = __convertKMLColorsToRGB(styles[k].textContent);
                    break;
                case 'LabelStyleSimpleExtensionGroup':
                    bLabelStyleSimpleExtensionGroup = true;
                    var attributs = styles[k].attributes;
                    for (var l = 0; l < attributs.length; l++) {
                        switch (attributs[l].nodeName) {
                        case 'fontFamily':
                            break;
                        case 'haloColor':
                            _colorHalo = __convertKMLColorsToRGB(attributs[l].nodeValue);
                            break;
                        case 'haloRadius':
                            _radiusHalo = parseInt(attributs[l].nodeValue, 10);
                            break;
                        case 'haloOpacity':
                            break;
                        default:
                        }
                    }
                    break;
                default:
                }
            }
            if (!bLabelStyleSimpleExtensionGroup) {
                return;
            }
            feature.setStyle(new ol.style.Style({
                image: new ol.style.Icon({
                    src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNiYAAAAAkAAxkR2eQAAAAASUVORK5CYII=',
                    size: [
                        51,
                        38
                    ],
                    anchor: [
                        25.5,
                        38
                    ],
                    anchorOrigin: 'top-left',
                    anchorXUnits: 'pixels',
                    anchorYUnits: 'pixels'
                }),
                text: new ol.style.Text({
                    font: _fontSize + ' ' + _font,
                    textAlign: 'left',
                    text: _text,
                    fill: new ol.style.Fill({ color: _color }),
                    stroke: new ol.style.Stroke({
                        color: _colorHalo,
                        width: _radiusHalo
                    })
                })
            }));
        };
        var __getHotSpotStyleToFeatureIcon = function (feature, style) {
            var _src = null;
            var _scale = null;
            var _bSizeIcon = false;
            var _sizeW = 51;
            var _sizeH = 38;
            var _bHotSpot = false;
            var _anchorX = 25.5;
            var _anchorXUnits = 'pixels';
            var _anchorY = 38;
            var _anchorYUnits = 'pixels';
            var styles = style.childNodes;
            for (var k = 0; k < styles.length; k++) {
                switch (styles[k].nodeName) {
                case 'Icon':
                    var nodes = styles[k].childNodes;
                    for (var i = 0; i < nodes.length; i++) {
                        switch (nodes[i].nodeName) {
                        case 'href':
                            _src = nodes[i].textContent;
                            break;
                        case 'gx:w':
                            _bSizeIcon = true;
                            _sizeW = parseFloat(nodes[i].textContent);
                            break;
                        case 'gx:h':
                            _bSizeIcon = true;
                            _sizeH = parseFloat(nodes[i].textContent);
                            break;
                        default:
                        }
                    }
                    break;
                case 'hotSpot':
                    _bHotSpot = true;
                    var attributs = styles[k].attributes;
                    for (var l = 0; l < attributs.length; l++) {
                        switch (attributs[l].nodeName) {
                        case 'x':
                            _anchorX = parseFloat(attributs[l].nodeValue);
                            break;
                        case 'y':
                            _anchorY = parseFloat(attributs[l].nodeValue);
                            break;
                        case 'yunits':
                            _anchorXUnits = attributs[l].nodeValue;
                            break;
                        case 'xunits':
                            _anchorYUnits = attributs[l].nodeValue;
                            break;
                        default:
                        }
                    }
                    break;
                case 'scale':
                    _scale = parseFloat(styles[k].textContent);
                    break;
                default:
                }
            }
            if (proxy && /^https?:\/\//.test(_src)) {
                if (_src.indexOf(proxy) === -1) {
                    _src = proxy + _src;
                    feature.setProperties({ proxyUrl: proxy });
                }
            }
            var _options = {
                src: _src,
                crossOrigin: 'anonymous',
                scale: _scale || 1
            };
            if (_bSizeIcon) {
                Utils.mergeParams(_options, {
                    size: [
                        _sizeW,
                        _sizeH
                    ]
                });
            }
            if (_bHotSpot) {
                Utils.mergeParams(_options, {
                    anchor: [
                        _anchorX,
                        _anchorY
                    ],
                    anchorOrigin: 'bottom-left',
                    anchorXUnits: _anchorXUnits || 'pixels',
                    anchorYUnits: _anchorYUnits || 'pixels'
                });
            }
            var featureStyleFunction = feature.getStyleFunction();
            if (featureStyleFunction) {
                var _styles = featureStyleFunction.call(feature, 0);
                if (_styles && _styles.length !== 0) {
                    var _style = _styles.length === 1 ? _styles[0] : _styles[_styles.length - 1];
                    feature.setStyle(new ol.style.Style({
                        image: new ol.style.Icon(_options),
                        text: _style.getText()
                    }));
                }
            }
        };
        var __getExtendedData = function (feature, extend) {
            if (!feature) {
                return;
            }
            var _fname = '';
            var _fdescription = feature.getProperties().description || '';
            var _ftitle = null;
            for (var i = 0; i < extend.length; i++) {
                var data = extend[i];
                var name = data.attributes[0];
                if (name.nodeName === 'name') {
                    switch (name.nodeValue) {
                    case 'label':
                        _fname = data.textContent;
                        break;
                    case 'attributetitle':
                        var nodes = data.childNodes;
                        for (var j = 0; j < nodes.length; j++) {
                            if (nodes[j].nodeName === 'value') {
                                _ftitle = nodes[j].textContent;
                            }
                        }
                        break;
                    default:
                    }
                }
            }
            if (_ftitle) {
                _fdescription = _fdescription ? _ftitle + ' : ' + _fdescription : _ftitle;
            }
            feature.setProperties({
                name: _fname,
                description: _fdescription
            });
        };
        var __getStyleToFeatureIconLabel = function (feature, iconStyle, labelStyle) {
            __getExtensionStyleToFeatureLabel(feature, labelStyle);
            __getHotSpotStyleToFeatureIcon(feature, iconStyle);
        };
        _kmlRead(kmlDoc, features, {
            labelStyle: this.options.showPointNames ? __getExtensionStyleToFeatureLabel : null,
            iconStyle: __getHotSpotStyleToFeatureIcon,
            iconLabelStyle: this.options.showPointNames ? __getStyleToFeatureIconLabel : __getHotSpotStyleToFeatureIcon,
            extendedData: __getExtendedData
        });
        return features;
    };
    return KML;
}({}, ol, Ol3Utils);
CommonUtilsConfig = function () {
    var Config = {
        configuration: null,
        isConfigLoaded: function () {
            var scope = typeof window !== 'undefined' ? window : {};
            if (scope.Gp && scope.Gp.Config && Object.keys(scope.Gp.Config).length !== 0) {
                this.configuration = scope.Gp.Config;
                return true;
            }
            return false;
        },
        getLayerId: function (layerName, service) {
            var layerId = null;
            if (this.configuration) {
                var layers = this.configuration['layers'];
                for (var key in layers) {
                    if (layers.hasOwnProperty(key)) {
                        var parts = key.split('$');
                        if (layerName === parts[0]) {
                            if (parts[1]) {
                                var servicePartsLayer = parts[1].split(':');
                                var servicePartsService = parts[1].split(';');
                                if (servicePartsService[1] === service) {
                                    layerId = key;
                                    break;
                                }
                                if (servicePartsLayer[2] === service) {
                                    layerId = key;
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            if (!layerId) {
                console.log('ERROR layer id (' + layerName + ' / ' + service + ') was not found !?');
            }
            return layerId;
        },
        getLayerParams: function (layerName, service, apiKey) {
            var params = {};
            if (this.configuration) {
                var layerId = this.getLayerId(layerName, service);
                if (layerId) {
                    var layerConf = this.configuration.layers[layerId];
                    var key = layerConf.apiKeys[0];
                    if (apiKey) {
                        if (apiKey !== key) {
                            console.log('ERROR different keys (' + apiKey + ' !== ' + key + ') !?');
                            return;
                        }
                    }
                    apiKey = apiKey || key;
                    params.key = apiKey;
                    params.url = layerConf.getServerUrl(apiKey);
                    params.version = layerConf.getServiceParams().version;
                    params.styles = layerConf.getDefaultStyle();
                    params.format = layerConf.getDefaultFormat();
                    params.projection = layerConf.getDefaultProjection();
                    params.minScale = layerConf.getMinScaleDenominator();
                    params.maxScale = layerConf.getMaxScaleDenominator();
                    params.extent = layerConf.getBBOX();
                    params.legends = layerConf.getLegends();
                    params.metadata = layerConf.getMetadata();
                    params.originators = layerConf.getOriginators();
                    params.title = layerConf.getTitle();
                    params.description = layerConf.getDescription();
                    params.quicklookUrl = layerConf.getQuicklookUrl();
                    if (layerConf.wmtsOptions) {
                        params.tileMatrixSetLimits = layerConf.wmtsOptions.tileMatrixSetLimits;
                    }
                    var TMSLink = layerConf.getTMSID();
                    if (TMSLink) {
                        params.TMSLink = TMSLink;
                        var tmsConf = this.configuration.getTMSConf(TMSLink);
                        params.matrixOrigin = tmsConf.getTopLeftCorner();
                        params.nativeResolutions = tmsConf.nativeResolutions;
                        params.matrixIds = tmsConf.matrixIds;
                        params.tileMatrices = tmsConf.tileMatrices;
                    }
                }
            }
            return params;
        },
        getServiceParams: function (resource, service, apiKey) {
            var params = {};
            if (this.configuration) {
                var layerId = this.getLayerId(resource, service);
                if (layerId) {
                    var layerConf = this.configuration.layers[layerId];
                    var key = layerConf.apiKeys[0];
                    if (apiKey) {
                        if (apiKey !== key) {
                            return;
                        }
                    }
                    apiKey = apiKey || key;
                    params.key = apiKey;
                    params.url = layerConf.getServerUrl(apiKey);
                    params.version = layerConf.getServiceParams().version;
                    params.extent = layerConf.getBBOX();
                    params.title = layerConf.getTitle();
                    params.description = layerConf.getDescription();
                }
            }
            return params;
        },
        getResolutions: function () {
            var resolutions = [];
            if (this.configuration) {
                resolutions = this.configuration['generalOptions']['wgs84Resolutions'];
            }
            return resolutions;
        },
        getTileMatrix: function (tmsName) {
            var tms = {};
            if (this.configuration) {
                if (tmsName) {
                    tms = this.configuration['tileMatrixSets'][tmsName.toUpperCase()];
                }
            }
            return tms;
        },
        getGlobalConstraints: function (layerId) {
            var params = {};
            if (layerId) {
                var layerConf = this.configuration.layers[layerId];
                params.projection = layerConf.getDefaultProjection();
                params.minScale = layerConf.getMinScaleDenominator();
                params.maxScale = layerConf.getMaxScaleDenominator();
                params.extent = layerConf.getBBOX();
            }
            return params;
        }
    };
    return Config;
}();
Ol3LayersSourceWMTS = function (ol, Gp, Utils, Config, LayerUtils) {
    function SourceWMTS(options) {
        if (!(this instanceof SourceWMTS)) {
            throw new TypeError('ERROR CLASS_CONSTRUCTOR');
        }
        if (!options.layer) {
            throw new Error('ERROR PARAM_MISSING : layer');
        }
        if (typeof options.layer !== 'string') {
            throw new Error('ERROR WRONG TYPE : layer');
        }
        if (!Config.isConfigLoaded()) {
            throw new Error('ERROR : contract key configuration has to be loaded to load Geoportal layers. See http://ignf.github.io/evolution-apigeoportail/ol3/ol3-autoconf.html');
        }
        var layerId = Config.getLayerId(options.layer, 'WMTS');
        if (layerId && Config.configuration.getLayerConf(layerId)) {
            var wmtsParams = Config.getLayerParams(options.layer, 'WMTS', options.apiKey);
            this._originators = wmtsParams.originators;
            this._legends = wmtsParams.legends;
            this._metadata = wmtsParams.metadata;
            var wmtsSourceOptions = {
                url: Gp.Helper.normalyzeUrl(wmtsParams.url, { 'gp-ol3-ext': '0.12.0-dev' }, false),
                version: wmtsParams.version,
                style: wmtsParams.styles,
                format: wmtsParams.format,
                projection: wmtsParams.projection,
                maxZoom: LayerUtils.getZoomLevelFromScaleDenominator(wmtsParams.minScale),
                layer: options.layer,
                matrixSet: wmtsParams.TMSLink,
                tileGrid: new ol.tilegrid.WMTS({
                    resolutions: wmtsParams.nativeResolutions,
                    matrixIds: wmtsParams.matrixIds,
                    origin: [
                        wmtsParams.matrixOrigin.x,
                        wmtsParams.matrixOrigin.y
                    ]
                })
            };
            Utils.mergeParams(wmtsSourceOptions, options.olParams);
            ol.source.WMTS.call(this, wmtsSourceOptions);
            this._originators = wmtsParams.originators;
            this._legends = wmtsParams.legends;
            this._metadata = wmtsParams.metadata;
            this._description = wmtsParams.description;
            this._title = wmtsParams.title;
            this._quicklookUrl = wmtsParams.quicklookUrl;
        } else {
            console.log('[source WMTS] ERROR : ' + options.layer + ' cannot be found in Geoportal Configuration. Make sure that this resource is included in your contract key.');
            return new ol.source.WMTS({});
        }
    }
    ol.inherits(SourceWMTS, ol.source.WMTS);
    SourceWMTS.prototype = Object.create(ol.source.WMTS.prototype, {});
    SourceWMTS.prototype.constructor = SourceWMTS;
    SourceWMTS.prototype.getGetFeatureInfoUrl = function (coordinate, resolution, projection, params) {
        return Utils.getGetFeatureInfoUrl(this, coordinate, resolution, projection, params);
    };
    return SourceWMTS;
}(ol, gp, Ol3Utils, CommonUtilsConfig, CommonUtilsLayerUtils);
Ol3LayersSourceWMS = function (ol, Gp, Utils, Config) {
    function SourceWMS(options) {
        if (!(this instanceof SourceWMS)) {
            throw new TypeError('ERROR CLASS_CONSTRUCTOR');
        }
        if (!options.layer) {
            throw new Error('ERROR PARAM_MISSING : layer');
        }
        if (typeof options.layer !== 'string') {
            throw new Error('ERROR WRONG TYPE : layer');
        }
        if (!Config.isConfigLoaded()) {
            throw new Error('ERROR : contract key configuration has to be loaded to load Geoportal layers. See http://ignf.github.io/evolution-apigeoportail/ol3/ol3-autoconf.html');
        }
        var layerId = Config.getLayerId(options.layer, 'WMS');
        if (layerId && Config.configuration.getLayerConf(layerId)) {
            var wmsParams = Config.getLayerParams(options.layer, 'WMS', options.apiKey);
            var wmsSourceOptions = {
                url: Gp.Helper.normalyzeUrl(wmsParams.url, { 'gp-ol3-ext': '0.12.0-dev' }, false),
                params: {
                    SERVICE: 'WMS',
                    LAYERS: options.layer,
                    VERSION: wmsParams.version,
                    STYLES: wmsParams.styles,
                    FORMAT: wmsParams.format
                }
            };
            Utils.mergeParams(wmsSourceOptions, options.olParams);
            ol.source.TileWMS.call(this, wmsSourceOptions);
            this._originators = wmsParams.originators;
            this._legends = wmsParams.legends;
            this._metadata = wmsParams.metadata;
            this._title = wmsParams.title;
            this._description = wmsParams.description;
            this._quicklookUrl = wmsParams.quicklookUrl;
        } else {
            console.log('[source WMS] ERROR : ' + options.layer + ' cannot be found in Geoportal Configuration. Make sure that this resource is included in your contract key.');
            return new ol.source.TileWMS({});
        }
    }
    ol.inherits(SourceWMS, ol.source.TileWMS);
    SourceWMS.prototype = Object.create(ol.source.TileWMS.prototype, {});
    SourceWMS.prototype.constructor = SourceWMS;
    return SourceWMS;
}(ol, gp, Ol3Utils, CommonUtilsConfig);
Ol3LayersLayerWMTS = function (ol, Utils, Config, LayerUtils, SourceWMTS) {
    function LayerWMTS(options) {
        if (!(this instanceof LayerWMTS)) {
            throw new TypeError('ERROR CLASS_CONSTRUCTOR');
        }
        if (!options.layer) {
            throw new Error('ERROR PARAM_MISSING : layer');
        }
        if (typeof options.layer !== 'string') {
            throw new Error('ERROR WRONG TYPE : layer');
        }
        if (!Config.isConfigLoaded()) {
            throw new Error('ERROR : contract key configuration has to be loaded to load Geoportal layers. See http://ignf.github.io/evolution-apigeoportail/ol3/ol3-autoconf.html');
        }
        var olSourceParams;
        if (options.olParams && options.olParams.sourceParams) {
            olSourceParams = options.olParams.sourceParams;
        }
        var wmtsSource = new SourceWMTS({
            layer: options.layer,
            apiKey: options.apiKey,
            olParams: olSourceParams
        });
        var layerTileOptions = { source: wmtsSource };
        if (wmtsSource.getLayer() !== undefined) {
            var layerId = Config.getLayerId(options.layer, 'WMTS');
            var globalConstraints = Config.getGlobalConstraints(layerId);
            if (globalConstraints && globalConstraints.projection) {
                var p;
                if (typeof globalConstraints.projection === 'string') {
                    p = ol.proj.get(globalConstraints.projection);
                }
                if (p && p.getUnits()) {
                    if (p.getUnits() === 'm') {
                        layerTileOptions.minResolution = (globalConstraints.minScale - 1) * 0.00028;
                        layerTileOptions.maxResolution = (globalConstraints.maxScale + 1) * 0.00028;
                    } else if (p.getUnits() === 'degrees') {
                        layerTileOptions.minResolution = (globalConstraints.minScale - 1) * 0.00028 * 180 / (Math.PI * 6378137);
                        layerTileOptions.maxResolution = (globalConstraints.maxScale + 1) * 0.00028 * 180 / (Math.PI * 6378137);
                    }
                }
            }
        }
        Utils.mergeParams(layerTileOptions, options.olParams);
        ol.layer.Tile.call(this, layerTileOptions);
    }
    ol.inherits(LayerWMTS, ol.layer.Tile);
    LayerWMTS.prototype = Object.create(ol.layer.Tile.prototype, {});
    LayerWMTS.prototype.constructor = LayerWMTS;
    return LayerWMTS;
}(ol, Ol3Utils, CommonUtilsConfig, CommonUtilsLayerUtils, Ol3LayersSourceWMTS);
Ol3LayersLayerWMS = function (ol, Utils, Config, LayerUtils, SourceWMS) {
    function LayerWMS(options) {
        if (!(this instanceof LayerWMS)) {
            throw new TypeError('ERROR CLASS_CONSTRUCTOR');
        }
        if (!options.layer) {
            throw new Error('ERROR PARAM_MISSING : layer');
        }
        if (typeof options.layer !== 'string') {
            throw new Error('ERROR WRONG TYPE : layer');
        }
        if (!Config.isConfigLoaded()) {
            throw new Error('ERROR : contract key configuration has to be loaded to load Geoportal layers. See http://ignf.github.io/evolution-apigeoportail/ol3/ol3-autoconf.html');
        }
        var olSourceParams;
        if (options.olParams && options.olParams.sourceParams) {
            olSourceParams = options.olParams.sourceParams;
        }
        var wmsSource = new SourceWMS({
            layer: options.layer,
            apiKey: options.apiKey,
            olParams: olSourceParams
        });
        var layerTileOptions = { source: wmsSource };
        if (wmsSource.getParams().LAYERS !== undefined) {
            var layerId = Config.getLayerId(options.layer, 'WMS');
            var globalConstraints = Config.getGlobalConstraints(layerId);
            if (olSourceParams && olSourceParams.projection) {
                var geobbox = [
                    globalConstraints.extent.left,
                    globalConstraints.extent.bottom,
                    globalConstraints.extent.right,
                    globalConstraints.extent.top
                ];
                layerTileOptions.extent = ol.proj.transformExtent(geobbox, 'EPSG:4326', olSourceParams.projection);
                var p;
                if (typeof olSourceParams.projection === 'string') {
                    p = ol.proj.get(olSourceParams.projection);
                } else if (typeof olSourceParams.projection === 'object' && olSourceParams.projection.getCode()) {
                    p = ol.proj.get(olSourceParams.projection.getCode());
                }
                if (p && p.getUnits()) {
                    if (p.getUnits() === 'm') {
                        layerTileOptions.minResolution = (globalConstraints.minScale - 1) * 0.00028;
                        layerTileOptions.maxResolution = (globalConstraints.maxScale + 1) * 0.00028;
                    } else if (p.getUnits() === 'degrees') {
                        layerTileOptions.minResolution = (globalConstraints.minScale - 1) * 0.00028 * 180 / (Math.PI * 6378137);
                        layerTileOptions.maxResolution = (globalConstraints.maxScale + 1) * 0.00028 * 180 / (Math.PI * 6378137);
                    }
                }
            }
        }
        Utils.mergeParams(layerTileOptions, options.olParams);
        ol.layer.Tile.call(this, layerTileOptions);
    }
    ol.inherits(LayerWMS, ol.layer.Tile);
    LayerWMS.prototype = Object.create(ol.layer.Tile.prototype, {});
    LayerWMS.prototype.constructor = LayerWMS;
    return LayerWMS;
}(ol, Ol3Utils, CommonUtilsConfig, CommonUtilsLayerUtils, Ol3LayersSourceWMS);
CommonUtilsSelectorID = function () {
    var SelectorID = {
        generate: function () {
            var timestamp = Math.floor(Date.now());
            return function () {
                return timestamp++;
            };
        }(),
        name: function (id) {
            var name = null;
            var i = id.lastIndexOf('-');
            if (i === -1) {
                name = id;
            } else {
                name = id.substring(0, i);
            }
            return name;
        },
        index: function (id) {
            var index = null;
            var name = this.name(id);
            var i = name.lastIndexOf('_');
            if (i !== -1) {
                index = name.substring(i + 1);
            }
            return index;
        },
        uuid: function (id) {
            var uuid = null;
            var i = id.lastIndexOf('-');
            if (i !== -1) {
                uuid = parseInt(id.substring(i + 1), 10);
            }
            return uuid;
        }
    };
    return SelectorID;
}();
CommonControlsLayerSwitcherDOM = function (Sortable) {
    var LayerSwitcherDOM = {
        _createDraggableElement: function (elementDraggable, context) {
            Sortable.create(elementDraggable, {
                handle: '.GPlayerName',
                draggable: '.draggable-layer',
                ghostClass: 'GPghostLayer',
                animation: 200,
                onEnd: function (e) {
                    context._onDragAndDropLayerClick(e);
                }
            });
        },
        _addUID: function (id) {
            var uid = this._uid ? id + '-' + this._uid : id;
            return uid;
        },
        _createMainContainerElement: function () {
            var container = document.createElement('div');
            container.id = this._addUID('GPlayerSwitcher');
            container.className = 'GPwidget';
            return container;
        },
        _createMainLayersShowElement: function () {
            var input = document.createElement('input');
            input.id = this._addUID('GPshowLayersList');
            input.type = 'checkbox';
            return input;
        },
        _createMainLayersElement: function () {
            var div = document.createElement('div');
            div.id = this._addUID('GPlayersList');
            div.className = 'GPpanel';
            return div;
        },
        _createMainPictoElement: function () {
            var self = this;
            var label = document.createElement('label');
            label.id = this._addUID('GPshowLayersListPicto');
            label.className = 'GPshowAdvancedToolPicto';
            label.htmlFor = this._addUID('GPshowLayersList');
            label.title = 'Afficher/masquer le gestionnaire de couches';
            var spanOpen = document.createElement('span');
            spanOpen.id = this._addUID('GPshowLayersListOpen');
            spanOpen.className = 'GPshowAdvancedToolOpen';
            spanOpen.addEventListener('click', function () {
                if (document.getElementById(self._addUID('GPshowLayersList')).checked) {
                    var layers = document.getElementsByClassName('GPlayerInfoOpened');
                    for (var i = 0; i < layers.length; i++) {
                        layers[i].className = 'GPlayerInfo';
                    }
                    document.getElementById(self._addUID('GPlayerInfoPanel')).className = 'GPlayerInfoPanelClosed';
                }
            });
            label.appendChild(spanOpen);
            var spanClose = document.createElement('span');
            spanClose.addEventListener('click', function () {
                if (document.getElementById(self._addUID('GPshowLayersList')).checked) {
                    var layers = document.getElementsByClassName('GPlayerInfoOpened');
                    for (var i = 0; i < layers.length; i++) {
                        layers[i].className = 'GPlayerInfo';
                    }
                    document.getElementById(self._addUID('GPlayerInfoPanel')).className = 'GPlayerInfoPanelClosed';
                }
            });
            spanClose.id = self._addUID('GPshowLayersListClose');
            label.appendChild(spanClose);
            return label;
        },
        _createMainInfoElement: function () {
            var div = document.createElement('div');
            div.id = this._addUID('GPlayerInfoPanel');
            div.className = 'GPpanel GPlayerInfoPanelClosed';
            return div;
        },
        _createContainerLayerElement: function (obj) {
            var container = document.createElement('div');
            container.id = this._addUID('GPlayerSwitcher_ID_' + obj.id);
            container.className = 'GPlayerSwitcher_layer draggable-layer';
            container.appendChild(this._createBasicToolElement(obj));
            var array = this._createAdvancedToolShowElement(obj);
            for (var i = 0; i < array.length; i++) {
                container.appendChild(array[i]);
            }
            container.appendChild(this._createAdvancedToolElement(obj));
            return container;
        },
        _createBasicToolElement: function (obj) {
            var div = document.createElement('div');
            div.id = this._addUID('GPbasicTools_ID_' + obj.id);
            div.className = 'GPlayerBasicTools';
            div.appendChild(this._createBasicToolNameElement(obj));
            var array = this._createBasicToolVisibilityElement(obj);
            for (var i = 0; i < array.length; i++) {
                div.appendChild(array[i]);
            }
            return div;
        },
        _createBasicToolNameElement: function (obj) {
            var span = document.createElement('span');
            span.id = this._addUID('GPname_ID_' + obj.id);
            span.className = 'GPlayerName';
            span.title = obj.description || obj.title;
            span.innerHTML = obj.title;
            return span;
        },
        _createBasicToolVisibilityElement: function (obj) {
            var list = [];
            var checked = obj.visibility;
            var id = this._addUID('GPvisibility_ID_' + obj.id);
            var input = document.createElement('input');
            input.id = id;
            input.type = 'checkbox';
            input.checked = checked;
            var label = document.createElement('label');
            label.htmlFor = id;
            label.id = this._addUID('GPvisibilityPicto_ID_' + obj.id);
            label.className = 'GPlayerVisibility';
            label.title = 'Afficher/masquer la couche';
            var context = this;
            if (input.addEventListener) {
                input.addEventListener('click', function (e) {
                    context._onVisibilityLayerClick.call(context, e);
                });
            } else if (input.attachEvent) {
                input.attachEvent('onclick', function (e) {
                    context._onVisibilityLayerClick.call(context, e);
                });
            }
            list.push(input);
            list.push(label);
            return list;
        },
        _createAdvancedToolShowElement: function (obj) {
            var list = [];
            var label = document.createElement('label');
            label.id = this._addUID('GPshowAdvancedToolsPicto_ID_' + obj.id);
            label.htmlFor = this._addUID('GPshowAdvancedTools_ID_' + obj.id);
            label.title = 'Plus d\'outils';
            label.className = 'GPshowMoreOptions GPshowLayerAdvancedTools';
            var input = document.createElement('input');
            input.type = 'checkbox';
            input.id = this._addUID('GPshowAdvancedTools_ID_' + obj.id);
            list.push(input);
            list.push(label);
            return list;
        },
        _createAdvancedToolElement: function (obj) {
            var container = document.createElement('div');
            container.id = this._addUID('GPadvancedTools_ID_' + obj.id);
            container.className = 'GPlayerAdvancedTools';
            container.appendChild(this._createAdvancedToolDeleteElement(obj));
            if (obj.title && obj.description) {
                container.appendChild(this._createAdvancedToolInformationElement(obj));
            }
            if (obj.type !== 'feature') {
                var array = this._createAdvancedToolOpacityElement(obj);
                for (var i = 0; i < array.length; i++) {
                    container.appendChild(array[i]);
                }
            }
            return container;
        },
        _createAdvancedToolDeleteElement: function (obj) {
            var div = document.createElement('div');
            div.id = this._addUID('GPremove_ID_' + obj.id);
            div.className = 'GPlayerRemove';
            div.title = 'Supprimer la couche';
            div.layerId = obj.id;
            var context = this;
            if (div.addEventListener) {
                div.addEventListener('click', function (e) {
                    context._onDropLayerClick.call(context, e);
                });
            } else if (div.attachEvent) {
                div.attachEvent('onclick', function (e) {
                    context._onDropLayerClick.call(context, e);
                });
            }
            return div;
        },
        _createAdvancedToolInformationElement: function (obj) {
            var div = document.createElement('div');
            div.id = this._addUID('GPinfo_ID_' + obj.id);
            div.className = 'GPlayerInfo';
            div.title = 'Informations/légende';
            div.layerId = obj.id;
            var context = this;
            if (div.addEventListener) {
                div.addEventListener('click', function (e) {
                    context._onOpenLayerInfoClick.call(context, e);
                });
            } else if (div.attachEvent) {
                div.attachEvent('onclick', function (e) {
                    context._onOpenLayerInfoClick.call(context, e);
                });
            }
            return div;
        },
        _createAdvancedToolOpacityElement: function (obj) {
            var list = [];
            var divO = document.createElement('div');
            divO.id = this._addUID('GPopacity_ID_' + obj.id);
            divO.className = 'GPlayerOpacity';
            divO.title = 'Opacité';
            var opacity = Math.round(obj.opacity * 100);
            var input = document.createElement('input');
            input.id = this._addUID('GPopacityValueDiv_ID_' + obj.id);
            input.type = 'range';
            input.value = opacity;
            var context = this;
            if (input.addEventListener) {
                input.addEventListener('change', function (e) {
                    context._onChangeLayerOpacity.call(context, e);
                });
            } else if (input.attachEvent) {
                input.attachEvent('onchange', function (e) {
                    context._onChangeLayerOpacity.call(context, e);
                });
            }
            if (input.addEventListener) {
                input.addEventListener('input', function (e) {
                    context._onChangeLayerOpacity.call(context, e);
                });
            } else if (input.attachEvent) {
                input.attachEvent('oninput', function (e) {
                    context._onChangeLayerOpacity.call(context, e);
                });
            }
            divO.appendChild(input);
            var divC = document.createElement('div');
            divC.id = this._addUID('GPopacityValueDiv_ID_' + obj.id);
            divC.className = 'GPlayerOpacityValue';
            var span = document.createElement('span');
            span.id = this._addUID('GPopacityValue_ID_' + obj.id);
            span.innerHTML = opacity + '%';
            divC.appendChild(span);
            list.push(divO);
            list.push(divC);
            return list;
        },
        _createContainerLayerInfoElement: function (obj) {
            var container = document.createElement('div');
            container.id = this._addUID('GPlayerInfoContent');
            var title = document.createElement('div');
            title.id = this._addUID('GPlayerInfoTitle');
            title.innerHTML = obj.title;
            container.appendChild(title);
            if (obj.quicklookUrl) {
                var quick = document.createElement('div');
                quick.id = this._addUID('GPlayerInfoQuicklook');
                quick.title = 'Afficher un aperçu de la couche';
                var refquick = document.createElement('a');
                refquick.href = obj.quicklookUrl;
                refquick.appendChild(quick);
                container.appendChild(refquick);
            }
            var close = document.createElement('div');
            close.id = this._addUID('GPlayerInfoClose');
            close.title = 'Fermer la fenêtre';
            var self = this;
            var onCloseClick = function () {
                document.getElementById(self._addUID('GPlayerInfoPanel')).className = 'GPlayerInfoPanelClosed';
                var layers = document.getElementsByClassName('GPlayerInfoOpened');
                for (var i = 0; i < layers.length; i++) {
                    layers[i].className = 'GPlayerInfo';
                }
            };
            if (close.addEventListener) {
                close.addEventListener('click', onCloseClick);
            } else if (close.attachEvent) {
                close.attachEvent('onclick', onCloseClick);
            }
            container.appendChild(close);
            var desc = document.createElement('div');
            desc.id = this._addUID('GPlayerInfoDescription');
            desc.innerHTML = obj.description;
            container.appendChild(desc);
            if (obj.metadata) {
                var mtd = document.createElement('div');
                mtd.id = this._addUID('GPlayerInfoMetadata');
                var mtdtitle = document.createElement('div');
                mtdtitle.className = 'GPlayerInfoSubtitle';
                mtdtitle.innerHTML = 'Métadonnées';
                mtd.appendChild(mtdtitle);
                for (var i = 0; i < obj.metadata.length; i++) {
                    var urlmtd = obj.metadata[i].url;
                    var mtdlink = document.createElement('div');
                    mtdlink.className = 'GPlayerInfoLink';
                    var refmtd = document.createElement('a');
                    refmtd.href = urlmtd;
                    refmtd.innerHTML = urlmtd;
                    mtdlink.appendChild(refmtd);
                    mtd.appendChild(mtdlink);
                }
                if (obj.metadata.length !== 0) {
                    container.appendChild(mtd);
                }
            }
            if (obj.legends) {
                var lgd = document.createElement('div');
                lgd.id = this._addUID('GPlayerInfoLegend');
                var lgdtitle = document.createElement('div');
                lgdtitle.className = 'GPlayerInfoSubtitle';
                lgdtitle.innerHTML = 'Légende';
                lgd.appendChild(lgdtitle);
                var legends = {};
                var maxScale = obj.maxScaleDenominator || 560000000;
                for (var k = 0; k < obj.legends.length; k++) {
                    var minScale = obj.legends[k].minScaleDenominator;
                    if (minScale) {
                        var s = minScale.toString();
                        minScale = Math.round(parseInt(s.substring(0, 3), 10) / 10) * Math.pow(10, s.length - 2);
                    } else {
                        minScale = 270;
                    }
                    legends[minScale] = obj.legends[k];
                }
                for (var scale in legends) {
                    if (legends.hasOwnProperty(scale)) {
                        var urllgd = legends[scale].url;
                        if (typeof urllgd === 'string' && urllgd.toLowerCase().indexOf('nolegend.jpg') == -1) {
                            var lgdlink = document.createElement('div');
                            lgdlink.className = 'GPlayerInfoLink';
                            maxScale = legends[scale].maxScaleDenominator || maxScale;
                            var reflgd = document.createElement('a');
                            reflgd.href = urllgd;
                            reflgd.innerHTML = 'Du 1/' + scale + ' au 1/' + maxScale;
                            lgdlink.appendChild(reflgd);
                            lgd.appendChild(lgdlink);
                        } else {
                            delete legends[scale];
                        }
                    }
                }
                if (Object.keys(legends).length !== 0) {
                    container.appendChild(lgd);
                }
            }
            return container;
        }
    };
    return LayerSwitcherDOM;
}(sortable);
Ol3ControlsLayerSwitcher = function (ol, Utils, SelectorID, LayerSwitcherDOM) {
    function LayerSwitcher(lsOptions) {
        lsOptions = lsOptions || {};
        var options = lsOptions.options || {};
        var layers = lsOptions.layers || [];
        if (!(this instanceof LayerSwitcher)) {
            throw new TypeError('ERROR CLASS_CONSTRUCTOR');
        }
        if (layers && !Array.isArray(layers)) {
            throw new Error('ERROR WRONG_TYPE : layers should be an array');
        }
        if (options && typeof options !== 'object') {
            throw new Error('ERROR WRONG_TYPE : options should be an object');
        }
        this._initialize(options, layers);
        var container = this._initContainer(options);
        ol.control.Control.call(this, {
            element: container,
            target: options.target,
            render: options.render
        });
    }
    ol.inherits(LayerSwitcher, ol.control.Control);
    LayerSwitcher.prototype = Object.create(ol.control.Control.prototype, {});
    Utils.assign(LayerSwitcher.prototype, LayerSwitcherDOM);
    LayerSwitcher.prototype.constructor = LayerSwitcher;
    LayerSwitcher.prototype.setMap = function (map) {
        if (map) {
            this._addMapLayers(map);
            map.on('moveend', function () {
                this._onMapMoveEnd.call(this, map);
            }, this);
            map.getLayers().on('add', function (evt) {
                var layer = evt.element;
                var id;
                if (!layer.hasOwnProperty('gpLayerId')) {
                    id = this._layerId;
                    layer.gpLayerId = id;
                    this._layerId++;
                } else {
                    id = layer.gpLayerId;
                }
                if (!this._layers[id]) {
                    this.addLayer(layer);
                }
            }, this);
            map.getLayers().on('remove', function (evt) {
                var layer = evt.element;
                var id = layer.gpLayerId;
                if (this._layers[id]) {
                    this.removeLayer(layer);
                }
            }, this);
        }
        ol.control.Control.prototype.setMap.call(this, map);
    };
    LayerSwitcher.prototype.addLayer = function (layer, config) {
        var map = this.getMap();
        config = config || {};
        if (!layer) {
            console.log('[ERROR] LayerSwitcher:addLayer - missing layer parameter');
            return;
        }
        var id = layer.gpLayerId;
        if (id === 'undefined') {
            console.log('[ERROR] LayerSwitcher:addLayer - configuration cannot be set for ' + layer + ' layer (layer id not found)');
            return;
        }
        var isLayerInMap = false;
        map.getLayers().forEach(function (lyr) {
            if (lyr.gpLayerId === id) {
                isLayerInMap = true;
            }
        }, this);
        if (!isLayerInMap) {
            console.log('[ERROR] LayerSwitcher:addLayer - configuration cannot be set for ', layer, ' layer (layer is not in map.getLayers() )');
            return;
        }
        if (!this._layers[id]) {
            var layerInfos = this.getLayerInfo(layer) || {};
            var opacity = layer.getOpacity();
            var visibility = layer.getVisible();
            var isInRange = this.isInRange(layer, map);
            var layerOptions = {
                layer: layer,
                id: id,
                opacity: opacity != null ? opacity : 1,
                visibility: visibility != null ? visibility : true,
                inRange: isInRange != null ? isInRange : true,
                title: config.title != null ? config.title : layerInfos._title || id,
                description: config.description || layerInfos._description || null,
                legends: config.legends || layerInfos._legends || [],
                metadata: config.metadata || layerInfos._metadata || [],
                quicklookUrl: config.quicklookUrl || layerInfos._quicklookUrl || null
            };
            this._layers[id] = layerOptions;
            var layerDiv = this._createLayerDiv(layerOptions);
            this._layers[id].div = layerDiv;
            if (layer.getZIndex && layer.getZIndex() !== 0) {
                this._updateLayersOrder(map);
            } else {
                this._layersOrder.unshift(layerOptions);
                this._lastZIndex++;
                layer.setZIndex(this._lastZIndex);
                this._layerListContainer.insertBefore(layerDiv, this._layerListContainer.firstChild);
            }
            layer.on('change:opacity', this._updateLayerOpacity, this);
            layer.on('change:visible', this._updateLayerVisibility, this);
            var context = this;
            var updateLayersOrder = function (e) {
                context._updateLayersOrder.call(context, e);
            };
            if (this._layers[id].onZIndexChangeEvent == null) {
                this._layers[id].onZIndexChangeEvent = layer.on('change:zIndex', updateLayersOrder);
            }
        } else if (this._layers[id] && config) {
            for (var prop in config) {
                if (config.hasOwnProperty(prop)) {
                    this._layers[id][prop] = config[prop];
                }
            }
            if (config.title) {
                var nameDiv = document.getElementById(this._addUID('GPname_ID_' + id));
                if (nameDiv) {
                    nameDiv.innerHTML = config.title;
                    nameDiv.title = config.description || config.title;
                }
            }
            var infodiv = document.getElementById(this._addUID('GPinfo_ID_' + id));
            if (!document.getElementById(this._addUID('GPinfo_ID_' + id)) && config.description) {
                var advancedTools = document.getElementById(this._addUID('GPadvancedTools_ID_' + id));
                if (advancedTools) {
                    advancedTools.appendChild(this._createAdvancedToolInformationElement({ id: id }));
                }
            }
            if (infodiv && infodiv.className === 'GPlayerInfoOpened') {
                document.getElementById(this._addUID('GPlayerInfoPanel')).className = 'GPlayerInfoPanelClosed';
                infodiv.className === 'GPlayerInfo';
            }
        }
    };
    LayerSwitcher.prototype.removeLayer = function (layer) {
        var layerID = layer.gpLayerId;
        var layerList = document.getElementById(this._addUID('GPlayersList'));
        var infodiv = document.getElementById(this._addUID('GPinfo_ID_' + layerID));
        if (infodiv && infodiv.className === 'GPlayerInfoOpened') {
            document.getElementById(this._addUID('GPlayerInfoPanel')).className = 'GPlayerInfoPanelClosed';
            infodiv.className === 'GPlayerInfo';
        }
        var layerDiv = document.getElementById(this._addUID('GPlayerSwitcher_ID_' + layerID));
        layerList.removeChild(layerDiv);
        var layerIndex = Math.abs(layer.getZIndex() - this._lastZIndex);
        this._layersOrder.splice(layerIndex, 1);
        this._lastZIndex--;
        var layerOrderTemp = this._layersOrder;
        for (var i = 0; i < layerOrderTemp.length; i++) {
            layerOrderTemp[i].layer.setZIndex(this._lastZIndex - i);
        }
        delete this._layers[layerID];
    };
    LayerSwitcher.prototype.setCollapsed = function (collapsed) {
        if (collapsed === undefined) {
            console.log('[ERROR] LayerSwitcher:setCollapsed - missing collapsed parameter');
            return;
        }
        var isCollapsed = !document.getElementById(this._addUID('GPshowLayersList')).checked;
        if (collapsed && isCollapsed || !collapsed && !isCollapsed) {
            return;
        }
        if (!isCollapsed) {
            var layers = document.getElementsByClassName('GPlayerInfoOpened');
            for (var i = 0; i < layers.length; i++) {
                layers[i].className = 'GPlayerInfo';
            }
            document.getElementById(this._addUID('GPlayerInfoPanel')).className = 'GPlayerInfoPanelClosed';
        }
        document.getElementById(this._addUID('GPshowLayersList')).checked = !collapsed;
    };
    LayerSwitcher.prototype.getCollapsed = function () {
        return this.collapsed;
    };
    LayerSwitcher.prototype.setRemovable = function (layer, removable) {
        if (!layer) {
            return;
        }
        var layerID = layer.gpLayerId;
        if (layerID == null) {
            console.log('[LayerSwitcher:setRemovable] layer should be added to map before calling setRemovable method');
            return;
        }
        var removalDiv = document.getElementById(this._addUID('GPremove_ID_' + layerID));
        console.log(removalDiv.style.display);
        if (removalDiv) {
            if (removable === false) {
                removalDiv.style.display = 'none';
            } else if (removable === true) {
                removalDiv.style.display = 'block';
            } else {
                return;
            }
        }
    };
    LayerSwitcher.prototype._initialize = function (options, layers) {
        this._uid = SelectorID.generate();
        this._layers = {};
        this._layersOrder = [];
        this._layersIndex = {};
        this._lastZIndex = 0;
        this._layerId = 0;
        this.collapsed = options.collapsed !== undefined ? options.collapsed : true;
        this._layerListContainer = null;
        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i].layer;
            if (layer) {
                var id;
                if (!layer.hasOwnProperty('gpLayerId')) {
                    id = this._layerId;
                    layer.gpLayerId = id;
                    this._layerId++;
                } else {
                    id = layer.gpLayerId;
                }
                var conf = layers[i].config || {};
                var opacity = layer.getOpacity();
                var visibility = layer.getVisible();
                var layerOptions = {
                    layer: layer,
                    id: id,
                    opacity: opacity != null ? opacity : 1,
                    visibility: visibility != null ? visibility : true,
                    title: conf.title != null ? conf.title : id,
                    description: conf.description || null,
                    legends: conf.legends || [],
                    metadata: conf.metadata || [],
                    quicklookUrl: conf.quicklookUrl || null
                };
                this._layers[id] = layerOptions;
            }
        }
    };
    LayerSwitcher.prototype._initContainer = function () {
        var container = this._createMainContainerElement();
        var input = this._createMainLayersShowElement();
        container.appendChild(input);
        if (!this.collapsed) {
            input.checked = 'checked';
            this.collapsed = false;
        } else {
            this.collapsed = true;
        }
        var context = this;
        var changeCollapsed = function (e) {
            this.collapsed = !e.target.checked;
            this.dispatchEvent('change:collapsed');
        };
        input.addEventListener('click', function (e) {
            changeCollapsed.call(context, e);
        });
        var divL = this._layerListContainer = this._createMainLayersElement();
        container.appendChild(divL);
        this._createDraggableElement(divL, this);
        var picto = this._createMainPictoElement();
        container.appendChild(picto);
        var divI = this._createMainInfoElement();
        container.appendChild(divI);
        return container;
    };
    LayerSwitcher.prototype._addMapLayers = function (map) {
        this._layersIndex = {};
        var context = this;
        map.getLayers().forEach(function (layer) {
            var id;
            if (!layer.hasOwnProperty('gpLayerId')) {
                id = this._layerId;
                layer.gpLayerId = id;
                this._layerId++;
            } else {
                id = layer.gpLayerId;
            }
            var layerInfos = this.getLayerInfo(layer) || {};
            if (!this._layers[id]) {
                var opacity = layer.getOpacity();
                var visibility = layer.getVisible();
                var isInRange = this.isInRange(layer, map);
                var layerOptions = {
                    layer: layer,
                    id: id,
                    opacity: opacity != null ? opacity : 1,
                    visibility: visibility != null ? visibility : true,
                    inRange: isInRange != null ? isInRange : true,
                    title: layerInfos._title || id,
                    description: layerInfos._description || null,
                    legends: layerInfos._legends || [],
                    metadata: layerInfos._metadata || [],
                    quicklookUrl: layerInfos._quicklookUrl || null
                };
                this._layers[id] = layerOptions;
            } else {
                this._layers[id].opacity = layer.getOpacity();
                this._layers[id].visibility = layer.getVisible();
                this._layers[id].inRange = this.isInRange(layer, map);
            }
            layer.on('change:opacity', this._updateLayerOpacity, this);
            layer.on('change:visible', this._updateLayerVisibility, this);
            var layerIndex = null;
            if (layer.getZIndex !== undefined) {
                layerIndex = layer.getZIndex();
                if (!this._layersIndex[layerIndex] || !Array.isArray(this._layersIndex[layerIndex])) {
                    this._layersIndex[layerIndex] = [];
                }
                this._layersIndex[layerIndex].push(this._layers[id]);
            }
        }, this);
        var updateLayersOrder = function (e) {
            context._updateLayersOrder.call(context, e);
        };
        for (var zindex in this._layersIndex) {
            if (this._layersIndex.hasOwnProperty(zindex)) {
                var layers = this._layersIndex[zindex];
                for (var l = 0; l < layers.length; l++) {
                    this._layersOrder.unshift(layers[l]);
                    this._lastZIndex++;
                    layers[l].layer.setZIndex(this._lastZIndex);
                    if (this._layers[layers[l].layer.gpLayerId].onZIndexChangeEvent == null) {
                        this._layers[layers[l].layer.gpLayerId].onZIndexChangeEvent = layers[l].layer.on('change:zIndex', updateLayersOrder);
                    }
                }
            }
        }
        for (var j = 0; j < this._layersOrder.length; j++) {
            var layerOptions = this._layersOrder[j];
            var layerDiv = this._createLayerDiv(layerOptions);
            this._layerListContainer.appendChild(layerDiv);
            this._layers[layerOptions.id].div = layerDiv;
        }
    };
    LayerSwitcher.prototype._createLayerDiv = function (layerOptions) {
        var isLegends = layerOptions.legends && layerOptions.legends.length !== 0;
        var isMetadata = layerOptions.metadata && layerOptions.metadata.length !== 0;
        var isQuicklookUrl = layerOptions.quicklookUrl;
        if (isLegends || isMetadata || isQuicklookUrl) {
            layerOptions.displayInformationElement = true;
        }
        var layerDiv = this._createContainerLayerElement(layerOptions);
        if (!layerOptions.inRange) {
            layerDiv.classList.add('outOfRange');
        }
        return layerDiv;
    };
    LayerSwitcher.prototype._onChangeLayerOpacity = function (e) {
        var divId = e.target.id;
        var layerID = SelectorID.index(divId);
        var layer = this._layers[layerID].layer;
        var opacityValue = e.target.value;
        var opacityId = document.getElementById(this._addUID('GPopacityValue_ID_' + layerID));
        opacityId.innerHTML = opacityValue + '%';
        layer.setOpacity(opacityValue / 100);
    };
    LayerSwitcher.prototype._updateLayerOpacity = function (e) {
        var opacity = e.target.getOpacity();
        if (opacity > 1) {
            opacity = 1;
        }
        if (opacity < 0) {
            opacity = 0;
        }
        var id = e.target.gpLayerId;
        var layerOpacityInput = document.getElementById(this._addUID('GPopacityValueDiv_ID_' + id));
        layerOpacityInput.value = Math.round(opacity * 100);
        var layerOpacitySpan = document.getElementById(this._addUID('GPopacityValue_ID_' + id));
        layerOpacitySpan.innerHTML = Math.round(opacity * 100) + '%';
    };
    LayerSwitcher.prototype._onVisibilityLayerClick = function (e) {
        var divId = e.target.id;
        var layerID = SelectorID.index(divId);
        var layer = this._layers[layerID].layer;
        layer.setVisible(e.target.checked);
    };
    LayerSwitcher.prototype._updateLayerVisibility = function (e) {
        var visible = e.target.getVisible();
        var id = e.target.gpLayerId;
        var layerVisibilityInput = document.getElementById(this._addUID('GPvisibility_ID_' + id));
        layerVisibilityInput.checked = visible;
    };
    LayerSwitcher.prototype._updateLayersOrder = function () {
        var map = this.getMap();
        if (!map) {
            return;
        }
        this._layersIndex = {};
        var layerIndex;
        var id;
        map.getLayers().forEach(function (layer) {
            id = layer.gpLayerId;
            ol.Observable.unByKey(this._layers[id].onZIndexChangeEvent);
            this._layers[id].onZIndexChangeEvent = null;
            layerIndex = null;
            if (layer.getZIndex !== undefined) {
                layerIndex = layer.getZIndex();
                if (!this._layersIndex[layerIndex] || !Array.isArray(this._layersIndex[layerIndex])) {
                    this._layersIndex[layerIndex] = [];
                }
                this._layersIndex[layerIndex].push(this._layers[id]);
            }
        }, this);
        this._lastZIndex = 0;
        var context = this;
        var updateLayersOrder = function (e) {
            context._updateLayersOrder.call(context, e);
        };
        this._layersOrder = [];
        for (var zindex in this._layersIndex) {
            if (this._layersIndex.hasOwnProperty(zindex)) {
                var layers = this._layersIndex[zindex];
                for (var l = 0; l < layers.length; l++) {
                    this._layersOrder.unshift(layers[l]);
                    this._lastZIndex++;
                    if (this._layers[layers[l].layer.gpLayerId].onZIndexChangeEvent == null) {
                        this._layers[layers[l].layer.gpLayerId].onZIndexChangeEvent = layers[l].layer.on('change:zIndex', updateLayersOrder);
                    }
                }
            }
        }
        if (this._layerListContainer) {
            while (this._layerListContainer.firstChild) {
                this._layerListContainer.removeChild(this._layerListContainer.firstChild);
            }
            for (var j = 0; j < this._layersOrder.length; j++) {
                var layerOptions = this._layersOrder[j];
                this._layerListContainer.appendChild(layerOptions.div);
            }
        } else {
            console.log('[ol.control.LayerSwitcher] _updateLayersOrder : layer list container not found to update layers order ?!');
        }
    };
    LayerSwitcher.prototype._onOpenLayerInfoClick = function (e) {
        var divId = e.target.id;
        var layerID = SelectorID.index(divId);
        var layerOptions = this._layers[layerID];
        var panel;
        var info;
        divId = document.getElementById(e.target.id);
        if (divId.className === 'GPlayerInfoOpened') {
            if (divId.classList !== undefined) {
                divId.classList.remove('GPlayerInfoOpened');
                divId.classList.add('GPlayerInfo');
            }
            panel = document.getElementById(this._addUID('GPlayerInfoPanel'));
            if (panel.classList !== undefined) {
                panel.classList.remove('GPpanel');
                panel.classList.remove('GPlayerInfoPanelOpened');
                panel.classList.add('GPlayerInfoPanelClosed');
            }
            info = document.getElementById(this._addUID('GPlayerInfoContent'));
            panel.removeChild(info);
            return;
        }
        var layers = document.getElementsByClassName('GPlayerInfoOpened');
        for (var i = 0; i < layers.length; i++) {
            layers[i].className = 'GPlayerInfo';
        }
        if (divId.classList !== undefined) {
            divId.classList.remove('GPlayerInfo');
            divId.classList.add('GPlayerInfoOpened');
        }
        panel = document.getElementById(this._addUID('GPlayerInfoPanel'));
        if (panel.classList !== undefined) {
            panel.classList.add('GPpanel');
            panel.classList.remove('GPlayerInfoPanelClosed');
            panel.classList.add('GPlayerInfoPanelOpened');
        }
        info = document.getElementById(this._addUID('GPlayerInfoContent'));
        if (info) {
            panel.removeChild(info);
        }
        var obj = {
            title: layerOptions.title,
            description: layerOptions.description,
            quicklookUrl: layerOptions.quicklookUrl,
            metadata: layerOptions.metadata,
            legends: layerOptions.legends
        };
        var maxResolution = layerOptions.layer.getMaxResolution();
        if (maxResolution === Infinity) {
            obj._maxScaleDenominator = 560000000;
        } else {
            obj._maxScaleDenominator = Math.round(maxResolution / 0.00028);
        }
        var infoLayer = this._createContainerLayerInfoElement(obj);
        panel.appendChild(infoLayer);
    };
    LayerSwitcher.prototype._onDropLayerClick = function (e) {
        var divId = e.target.id;
        var layerID = SelectorID.index(divId);
        var layer = this._layers[layerID].layer;
        this.getMap().getLayers().remove(layer);
    };
    LayerSwitcher.prototype._onDragAndDropLayerClick = function () {
        var map = this.getMap();
        var context = this;
        var updateLayersOrder = function (e) {
            context._updateLayersOrder.call(context, e);
        };
        var matchesLayers = document.querySelectorAll('div.GPlayerSwitcher_layer');
        var maxZIndex = matchesLayers.length;
        this._layersOrder = [];
        for (var i = 0; i < matchesLayers.length; i++) {
            var tag = matchesLayers[i].id;
            var id = SelectorID.index(tag);
            var layer = this._layers[id].layer;
            ol.Observable.unByKey(this._layers[id].onZIndexChangeEvent);
            this._layers[id].onZIndexChangeEvent = null;
            if (layer.setZIndex) {
                layer.setZIndex(maxZIndex);
                this._layersOrder.push(this._layers[id]);
                maxZIndex--;
            }
            if (this._layers[id].onZIndexChangeEvent == null) {
                this._layers[id].onZIndexChangeEvent = layer.on('change:zIndex', updateLayersOrder);
            }
        }
        map.updateSize();
    };
    LayerSwitcher.prototype._onMapMoveEnd = function (map) {
        map.getLayers().forEach(function (layer) {
            var id = layer.gpLayerId;
            if (this._layers[id]) {
                var layerOptions = this._layers[id];
                var layerDiv;
                if (this.isInRange(layer, map) && !layerOptions.inRange) {
                    layerOptions.inRange = true;
                    layerDiv = document.getElementById(this._addUID('GPlayerSwitcher_ID_' + id));
                    layerDiv.classList.remove('outOfRange');
                } else if (!this.isInRange(layer, map) && layerOptions.inRange) {
                    layerOptions.inRange = false;
                    layerDiv = document.getElementById(this._addUID('GPlayerSwitcher_ID_' + id));
                    layerDiv.classList.add('outOfRange');
                }
            }
        }, this);
    };
    LayerSwitcher.prototype.getLayerDOMId = function (olLayer) {
        var foundId = null;
        this.getMap().getLayers().forEach(function (layer) {
            if (layer == olLayer) {
                foundId = layer.hasOwnProperty('gpLayerId') ? layer.gpLayerId : null;
            }
        }, this);
        return foundId !== null ? this._addUID('GPlayerSwitcher_ID_' + foundId) : null;
    };
    LayerSwitcher.prototype.isInRange = function (layer, map) {
        if (!map) {
            return;
        }
        var mapResolution = map.getView().getResolution();
        if (mapResolution > layer.getMaxResolution() || mapResolution < layer.getMinResolution()) {
            return false;
        }
        var mapExtent = map.getView().calculateExtent(map.getSize());
        var layerExtent = layer.getExtent();
        if (layerExtent && !ol.extent.intersects(mapExtent, layerExtent)) {
            return false;
        }
        return true;
    };
    LayerSwitcher.prototype.getLayerInfo = function (layer) {
        var layerInfo = {};
        if (layer.getSource !== undefined) {
            var src = layer.getSource();
            layerInfo._title = src._title || '';
            layerInfo._description = src._description || '';
            layerInfo._quicklookUrl = src._quicklookUrl || '';
            layerInfo._metadata = src._metadata || [];
            layerInfo._legends = src._legends || [];
        }
        return layerInfo;
    };
    return LayerSwitcher;
}(ol, Ol3Utils, CommonUtilsSelectorID, CommonControlsLayerSwitcherDOM);
Ol3ControlsUtilsMarkers = function () {
    var Marker = {
        lightOrange: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAmCAYAAABpuqMCAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAARDSURBVFiF3ZndaxxVGMZ/Z/YjX00Nadpo1qrFBgu56D9QbAtiLoRC7ywSNK1NURRREBKRFlSwFBW0gnSrJXY1CmISgyjFiyYSFC9ajE3MmpjdjWlMUtNos9lN9mteLzbRuCbZmTMTBB+Yi51znvd5n3nPnjnnjBIR/i/wuh4xpCpI0ojiENAA1AE1wCzwKzCE0EM5l2iShJvSyrXKnFVb8dOK4hmg3AIjifAmaU7ztMy7kYI7Zs6rQwjvka+AXcyiOMZx6XGahuE0AEHVitCFnhGAGoQugqrVaSrOKpNP4FWnSaxCGy1yWpesbyY/tLpwo7p/w0RxWHfI6Zk5q7ZSwhj6Q2sjzJLiXp1JQe+p+mllc4wA1CzHtw37lQmpCha5gbXpVxdJythh9z1kvzJJGrFixPBmOXixl+Z4mONmguZ4mIMXezG8WQsq5cs6tmDfTP7NXiSqN0vTzBD1TQfwbdmDUhX4tuyhvukATTNDlgxZ0SmUtUsgv0TZGPsv9FNSvXfNtpLqvey/0O+KTgF0zNQV7XHP4dsdtVvVKYCOmeqiPbwVOx21W9UpgI6ZWNEe2cSEo3arOgWwb0YYLp5G17Sjdqs6BdCZzYqL9B3dR2puYM221NwAfUf3uaJTAB0zaye5GmbWS6i2gdFQL5mFMCIJMgthRkO9hGobMLPFN4VWdAoptlcAQeUDRoG77YrZwDhQT4tk7JDsV6ZFMggv2+bZwyt2jYDuQnOa94GIFrc4IkzRrkPUM3NKsijatLjF0copsbJ++xec7TTPqw6EI/oB/glT+PC+13Y/aSQNv/Is+tNer09lMn7DMHwAYppp8fvTIpISkVQsFrslqww4M9OuqkgzANzl1MhCyrjZGAycm573pK1yFCyi5FoWvo/FYlPOT2fOqftRXMbB9lkEs+3zbe2f/FD5i3YMj2p3vn8/IV8DZ5yE+Gqkot+JEQCPada5dRhxEriiQ5ya90w+272916F+KpnJDLhjpkUy5HgESNqhZU2Vfr5ne+dSFtOBeso06J6cnEy6d0z0hPwEPGeH8sGVykvfjpfe1NZUci2+mHg7Go2G8z/d/goQVJ9B8S1veMYffujduo/thl+ZwUzDuBqJRGZWt7n/FcDH46lFNVLilar1uiTTxsJTnTssH/QpJVlMNQa5wbGJiWERya3Vz30zzfLb3OveY3dU5j5dp4e80Xdbd3TOu/H/yyAtpjnqgeGS8crRQRks+v5xf5gtY/KM/6NAVebhwvv90bLvHu2o/XId2pJSMmIaxo/RaHRMxN6yZtPM0K5K/7hl/FxVZgZWbs0mPDceeKcuGE95/kpSKUmaImHDNIfHrl+PiIj2zOb+MFvBY7IUOVl2ZG9g6bJH4ckJuRe/2NYZT3myKIkrGM4pNRyLjY+LW09URDb1+uaF0pfm3zJ+7zhRGdq1c9eDuwOBOzdLa/OG2X+APwE8DU64Y/5gfAAAAABJRU5ErkJggg==',
        darkOrange: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAmCAYAAABpuqMCAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAQ+SURBVFiF3ZlLaFxlGIaf/5zJpJNpaoxpYieoCxULEYK7Lqp0IWQhFLooKNKEtNIULxWlQoJgQQWLFMEg0lQMuXgD0dRSkNJFgoy0IrYNSTpj08xMmoxNYhLUyUwyt/O5mFbjmGTOLS58d3O+y/u95/vnvx0lIvxf4HE9Y7PyU0ETwl6gAQgANcA88AswhuIsKc7TJ0k3qZVrnTmqtpGhHeFloMJERArF+3g5Qaf84UYJ7og5rPai+JhCB6xiHuEQp+Ws0zI0pwloU+0oBrAnBKAGxQBtqt1pKc46UyjgHadFrEIHXXLCbrB9MYWhNYAb3f0bBsI+u0POnpijahtpJrA/tDbCPOU8aGdSsPdWM7SzOUIAam7ntwzrnWlWfnzMYW76tYsUy9RaXYesd6aCJswI0Tw5WvuG6EyEOWUk6UyEae0bQvPkTLEUeCzBupjCyl4iqyfHydkxdh3YQ/nWnSjlp3zrTnYd2MPJ2TFTgszwFNNaDaCwRdkYLd1B/NWNa9r81Y20dAdd4SmCHTGBkh6P7bvXkd0sTxHsiKku6eH13+fIbpanCHbExEp6ZJJTjuxmeYpgXYwiVNLnysCMI7tZniLYmc1Kk/Qe3E1ycXhNW3JxmN6Du13hKYIdMWsXuRpGzsOxugYu9Q+RXgojkiS9FOZS/xDH6howcqUPhWZ4imB9B9CmyoBx4AGrZBYwCTxMl2StBFnvTJdkUbxlOc4a3rYqBOxuNHfQC0RsxZZGhAA9dgLtiTkuOYQOW7Gl0c5xMbN/+xecnTQPq89QPGM/wT9hCJ8+MvjQ81pK8yp92ZvxeMpUNuvVNK0MQAwjI15vRkTSIpKOxWK/yyoBzsS0qiq8DAP3OxWylNMWmoL1XTMresZsjIJllIzk4GosFrvl/HbmiHoCYRAHx2cBo2Pknp4v45U3befQVY/z8/sp+Q5410mKC7P+oBMhALphBNy6jHgDxU92Am+t6PFXhrcPOeRPp7LZYXfEdEkWjWeBlJWwnKEyr41s/3rFwHDAnjY0zsTj8ZR710Qfys/Aq1ZCPrlZef7iwpYF25xKRhLLyQ+i0Wi48NPtrwBt6hsofeQNJ7zhp74PfGE1/Z0ZzNC0y5FIZHa1zf2vAFmeS2vqerkuVeu5pPLa0otXa01f9CklOQw1AfnRiampkIjk1/JzX0y3/LrY7Dm0w5f/ah0Pee/GXWeiSc/G/y+NjBjGuA6h8snK8VEZLbn+uD/MbiPe7P283pd9uvh5cMH3Q8uPdd+uE7ailFw3NO1aNBqdELG2rdk0MbSqLb8p7UZVmVF/59F8Wp97Mhg4ncjqfxWplKQMkbBmGKGJ6emIiNie2TZPDHB5v+/xxrtXBnWFnhfyL1yp/ejCXMUMShIKQnmlQrFYbFJcKmJTxQBc3O9789FtmZfOzfjPvT5S068bmWvj09PTm8G16WL+S/wJLybNu1V6htkAAAAASUVORK5CYII=',
        red: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAmCAYAAABpuqMCAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAQxSURBVFiF3ZldaBxVFMd/d2ayTRtjQpo2mlilWBEMshoj+FAERZIHIdA3iw+V1icRREFIQAKNgsUHQfBFwZI2WgWxqYUiVTDBBj9ILC5Nu2tjdjemsR+mSZNNNvsxO8eHTTRuk+zMnQmCf9iHnXvO+Z//nDvn3rmjRIT/C6zAI4ZVFRbtKDpQNCM0AvXANIo/EC4inMbmLBFZDJJaBVaZJ9Sd2HQCrwDbXHikgfewOMKPMh9ECsGIeVx1IHxEsQJeMY3iEMNy2m8aht8AtKpOhH70hADUI/TTqjr9puKvMsUE3vabxCp0MSJHdJ31xRSnVj9BVPcfOCj26U45PTHFh30c/am1EaaxuF+nKejd1WLX2gwhAPXL8T3De2XCqooKbuCu/eoiTZ6dXtch75WxaMeNENOyOXx8kHOpGMPOIudSMQ4fH8S0bBcs25Z5PMF7ZVpVL3BgQxvTsvn6+kVq6sK3jc3NRGhraKZgl9t9HGNEXvCSmvfKKJrL2nQfHVpTCEBNXZjuo0OB8JTAu5jiXmtjPL3vLl/jbnlKoNPN6spaVFbt8jXulqcEOmKSZS0yi5O+xt3ylEBHTLSsxbf913yNu+UpgU4DKE/Sc3AvczORNcfmZiL0HNwbCE8JvItxWDvJ1SjYFm0NzZzpG2RpIYbIIksLMc70Dbpsy+54SqCzzlQAY8B9Xsk8YAJ4gBHJe3HyXpkRyaN407OfN7zlVQjobjTv4BgQ1/ItjzjV9Oo46okZEBuhS8u3PDoZEDf7t9vg903zBLBfP8C/4cAnD87teclIGyFlLoVyllWh8vmQYRgVAOI4OQmFciKSFZFsMpmck1UC/Il5VNViEgHu9StkQYyb7bNNH1wrmDm3PgqWUHLBhl+SyeRV/6czLepJDAbw8fos4HTNb+/9PFv9u3YMU/X6f38/L98B7/gJ8U2uasiPEADTcRqDOozoBn7WcbzqmFOvpnYM+uTPpvP5SDBiimvP8xRPKV3DFpV7fX7HyYyD44M96xicmpqaSgd3TDQsv6J4zYvLx5nqsz/kK29qcyq5kFpafD+RSMSKf4P+CvCY+hJFRzmzmB2KPTvb+JnX8CsdzDGM8/F4/PrqseC/AggvZlGXtyipXc8kLcbCy6mdrg/6lBIbR41DYXR8cjIqIoW17IIXc17+nHnEOnS3VfhiHQt5d7HmVMK2Nn6+DHLiOGMmRLdMVI+NymjZ9Sf4abaMqZbQp01G/rnS60P5rT8duNXw1TpuGaXksmMYlxKJxLiIt23NponhKVV5a874rdZwmlYuTTvmjWdmGj9Mifl3kkpJ2hGJGY4THb9yJS4i2p0t+Gm2ggHJxMNb94eNzIAJZgEKbyxsP5kS00ZJSkG0oFQ0mZyYkKDuqIhs6u/7hyt75luM2RMPVfft3rW7bU9T0z2bxbV50+w/wF8f81R5OpwBhwAAAABJRU5ErkJggg==',
        turquoiseBlue: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAmCAYAAABpuqMCAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAASxSURBVFiF3ZhdbBRVGIafc2Z2210hbeWnpcQVUC8kwBUJXJBIgwkgBEPEC1GMxhgE4gUJJsYERMWI3orYaiqgrYSWH/mvMaQLciE1RAKUkrLbbhMobQ20/LT7N3OOF0CC0O7szGwv9L3c73u/93vnnD3zzYH/EUTBKx6sHUvQWgR6GTAdmASMA26A6AYuofUhQnYTVevuFlK6cGaObC9DGh8i9PtAKA/GEIKvSRZtZfnbA4VooTBmjlWvQFADPOmBfRN4l8Xv7ffbhvTF1lpwrHoTgga8GeE+by9NNRvR2tfDNfyQmVv5MYJP8L/CAqgidtai/sgpP0W84d7WavBV43Eo0CtYvOaAF7K3Rg7sKKU4Hcf71sqFfmz1DEvX9rslevvPFKc/YnSMAJRhyA+8EN2vzMHasQSzveR3/HrFEMV2udv3kOlaJmgtIg8jYcMcqpu1oGXJhMi0oJQVGaV6Dvd1day62DwnaWWd+GHSciGwz01rHraZXuaUETbMoe6qVR3Ly6fMD0oZAYJBKSOvVEyd3z3/jVjIDCSddYSjzqPwYEY875RRN2tBS4kZnDFcrNQMztw144UzjjKa6W4787IylU4ZSyZEpuWKv1w+dWohdB6Fl9NsnFNCUMqKnHGRO34PYnz+Ld2DFzN3nBIySvXkjGt1PQ+d23l3dB9ezPQ6JRzu6+rIFT/Q25lwVNHkfCDDwYuZFqeEVReb5wxYmQvDxfqz6QtvnW+e69yZcNR5jOKWgKbZKSVpZUOV0bpnG3vi0YxWXUAmo1XXnp54tLL5p+dSyi52FlJRt625nwCavxlDyrgKlLjm5o9byPBkFr456IbkfmWq1t1FsMM1zx1q3RoBr4OmpT4F+jxxndGHrbZ4IXozs3RtP0Ks98R1ghDrvYz/4PfD6ti39Qix0leNh6H07siaL9ZJKYuKtA6lhSgKaC0sWwYATENlLSmVECIZTKcHZ167NtAI9gO6PzO/1ZRg6XPAFF91AJnKDES21NaYN26l8uVoLWyhSZhS/345kUj4/+Q9XjMPdBR/9wl6Qn3TjyWnzyW88i3Y5e92BmDx6tPAV35KjDnXftqHEQBhKDXZvxmA4p5NCJzH+mFg3rxzvXzn0ZN+5BUoW8p4YcxUbbZQ4nXyGEIfhrDt7MS6o/tEOm07Z48ArTPCMPYnEomewpgBeGl1HMQGN5SSk381hdsSNzwqag1tRbZdHY/HL8JoXJwfr24AXnVKK7rae/mpz3fs8aCQ1FqfxzTPxuPxf7243V9oOMESa4XOvqgDZtlIKTKVHpz4w6Ej+ZbUWlgIHdNStkYikbZoNGoNl1f4lQGM3V8us0tLfhmhvh6/98Tu0hN/XslVQ2uRlahOIWWrMozLsVgs7aQ7KmYAAnVb67PjSh+bDsKtHX9Ubmv4dQRaEiE6JLQHwuG21tbWjBvNwm+z+8hmU+/Iu8l5akwo8uA34/bg3+W1B088nKdhCK2vmFJemjV7dqyxsdHzyTZqKwMQ2r55bmpK+SktRABb2ZO+2//9E+djvcAthIgZ0P5aZ+eVzaAKoTeqZgCKt238LP10xYaxZy7tq/j5+E5Ms629vb0b0KOt/Z/GP4jqqfL5oxVsAAAAAElFTkSuQmCC',
        defaultOffset: [
            -25.5,
            -38
        ]
    };
    return Marker;
}();
CommonUtilsCheckRightManagement = function (woodman, Config) {
    return {
        check: function (options) {
            if (!options) {
                return;
            }
            var _key = options.key;
            var _resources = options.resources || [];
            var _services = options.services || [];
            if (!_resources || _resources.length === 0) {
                return;
            }
            if (!_services || _services.length === 0) {
                return;
            }
            var _rightManagement = {};
            if (!_key) {
                if (!Config.isConfigLoaded()) {
                    console.log('WARNING : ' + 'parameter \'apiKey\' has not been parametered, ' + 'and the contract key configuration has not been loaded, ' + 'so impossible to check yours rights !');
                    return;
                } else {
                    _key = Object.keys(Config.configuration.generalOptions.apiKeys)[0];
                }
            }
            if (_key) {
                if (!Config.isConfigLoaded()) {
                    console.log('WARNING : ' + 'the contract key configuration has not been loaded, ' + 'so be carefull !');
                    var _noRightManagement = {};
                    for (var i = 0; i < _services.length; i++) {
                        var service = _services[i];
                        _noRightManagement[service] = [];
                        for (var j = 0; j < _resources.length; j++) {
                            var resource = _resources[j];
                            _noRightManagement[service].push(resource);
                        }
                    }
                    _noRightManagement.key = _key;
                    return _noRightManagement;
                } else {
                    for (var k = 0; k < _resources.length; k++) {
                        var _resource = _resources[k];
                        for (var l = 0; l < _services.length; l++) {
                            var _service = _services[l];
                            var params = Config.getServiceParams(_resource, _service, _key);
                            if (!params || Object.keys(params).length === 0) {
                                console.log('WARNING : ' + 'contract key configuration has no rights to load this geoportal ' + 'resource (' + _resource + ') ' + 'for this service (' + _service + ') ');
                                continue;
                            }
                            if (!_rightManagement[_service]) {
                                _rightManagement[_service] = [];
                            }
                            _rightManagement[_service].push(_resource);
                        }
                    }
                    if (!_rightManagement || Object.keys(_rightManagement).length === 0) {
                        console.log('WARNING : ' + 'the contract key configuration has been loaded, ' + 'and the parameter \'apiKey\' has been parametered, ' + 'but, there is a problem on the mapping between the contract and the key !');
                        return;
                    }
                    _rightManagement.key = _key;
                    return _rightManagement;
                }
            }
        }
    };
}({}, CommonUtilsConfig);
CommonControlsSearchEngineDOM = function (ID) {
    var SearchEngineDOM = {
        _addUID: function (id) {
            var uid = this._uid ? id + '-' + this._uid : id;
            return uid;
        },
        _createMainContainerElement: function () {
            var container = document.createElement('div');
            container.id = this._addUID('GPsearchEngine');
            container.className = 'GPwidget';
            return container;
        },
        _createShowSearchEngineElement: function () {
            var input = document.createElement('input');
            input.id = this._addUID('GPshowSearchEngine');
            input.type = 'checkbox';
            return input;
        },
        _createShowSearchEnginePictoElement: function () {
            var self = this;
            var label = document.createElement('label');
            label.id = this._addUID('GPshowSearchEnginePicto');
            label.className = 'GPshowAdvancedToolPicto';
            label.htmlFor = this._addUID('GPshowSearchEngine');
            label.title = 'Afficher/masquer la recherche par lieux';
            label.addEventListener('click', function () {
                document.getElementById(self._addUID('GPautoCompleteList')).style.display = 'none';
                document.getElementById(self._addUID('GPgeocodeResultsList')).style.display = 'none';
                var showAdvancedSearch = document.getElementById(self._addUID('GPshowAdvancedSearch'));
                if (showAdvancedSearch) {
                    showAdvancedSearch.style.display = null;
                    document.getElementById(self._addUID('GPadvancedSearchPanel')).style.display = 'none';
                }
                var id = '#GPsearchInput-' + self._uid;
                document.querySelector(id + ' input').disabled = false;
                self.onShowSearchEngineClick();
            });
            var spanOpen = document.createElement('span');
            spanOpen.id = this._addUID('GPshowSearchEngineOpen');
            spanOpen.className = 'GPshowAdvancedToolOpen';
            label.appendChild(spanOpen);
            return label;
        },
        _createSearchInputElement: function () {
            var self = this;
            var form = document.createElement('form');
            form.id = this._addUID('GPsearchInput');
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                document.getElementById(self._addUID('GPgeocodeResultsList')).style.display = 'block';
                document.getElementById(self._addUID('GPautoCompleteList')).style.display = 'none';
                self.onGeocodingSearchSubmit(e);
                return false;
            });
            var input = document.createElement('input');
            input.id = this._addUID('GPsearchInputText');
            input.type = 'text';
            input.placeholder = 'Rechercher un lieu, une adresse';
            input.autocomplete = 'off';
            input.addEventListener('keyup', function (e) {
                var charCode = e.which || e.keyCode;
                if (charCode === 13 || charCode === 10 || charCode === 38 || charCode === 40) {
                    return;
                }
                document.getElementById(self._addUID('GPgeocodeResultsList')).style.display = 'none';
                if (input.value.length > 2) {
                    document.getElementById(self._addUID('GPautoCompleteList')).style.display = 'block';
                } else {
                    document.getElementById(self._addUID('GPautoCompleteList')).style.display = 'none';
                }
                self.onAutoCompleteSearchText(e);
            });
            input.addEventListener('keydown', function (e) {
                if (true) {
                    return;
                }
                var charCode = e.which || e.keyCode;
                var container = document.getElementById(self._addUID('GPautocompleteResults'));
                if (!container) {
                    return;
                }
                var curr = container.getElementsByClassName('GPautoCompleteProposal current');
                var list = container.getElementsByClassName('GPautoCompleteProposal');
                var length = list.length;
                if (!length) {
                    return;
                }
                var current = null;
                if (!curr.length) {
                    current = list[0];
                    current.className = 'GPautoCompleteProposal current';
                    current.style.color = '#000000';
                    current.style['background-color'] = '#CEDBEF';
                    return;
                } else {
                    current = curr[0];
                }
                var index = parseInt(ID.index(current.id), 10);
                var next = index === length - 1 ? list[0] : list[index + 1];
                var prev = index === 0 ? list[length - 1] : list[index - 1];
                current.style['background-color'] = '';
                current.style.color = '';
                prev.style['background-color'] = '';
                prev.style.color = '';
                next.style['background-color'] = '';
                next.style.color = '';
                switch (charCode) {
                case 38:
                    current.className = 'GPautoCompleteProposal';
                    prev.className = 'GPautoCompleteProposal current';
                    prev.style.color = '#000000';
                    prev.style['background-color'] = '#CEDBEF';
                    break;
                case 40:
                    current.className = 'GPautoCompleteProposal';
                    next.className = 'GPautoCompleteProposal current';
                    next.style.color = '#000000';
                    next.style['background-color'] = '#CEDBEF';
                    break;
                case 13:
                    current.click(e);
                    break;
                }
                current.focus();
            });
            form.appendChild(input);
            var div = document.createElement('div');
            div.id = this._addUID('GPsearchInputReset');
            div.addEventListener('click', function () {
                document.getElementById(self._addUID('GPsearchInputText')).value = '';
                document.getElementById(self._addUID('GPautoCompleteList')).style.display = 'none';
                document.getElementById(self._addUID('GPgeocodeResultsList')).style.display = 'none';
                self.onSearchResetClick();
            });
            form.appendChild(div);
            return form;
        },
        _createShowAdvancedSearchElement: function () {
            var self = this;
            var div = document.createElement('div');
            div.id = this._addUID('GPshowAdvancedSearch');
            div.className = 'GPshowAdvancedToolPicto';
            div.title = 'Ouvrir la recherche avancée';
            div.addEventListener('click', function () {
                var id = '#GPsearchInput-' + self._uid;
                document.querySelector(id + ' input').disabled = true;
                document.getElementById(self._addUID('GPautoCompleteList')).style.display = 'none';
                document.getElementById(self._addUID('GPgeocodeResultsList')).style.display = 'none';
                document.getElementById(self._addUID('GPshowAdvancedSearch')).style.display = 'none';
                document.getElementById(self._addUID('GPadvancedSearchPanel')).style.display = 'inline-block';
            });
            var span = document.createElement('span');
            span.id = this._addUID('GPshowAdvancedSearchOpen');
            span.className = 'GPshowAdvancedToolOpen';
            div.appendChild(span);
            return div;
        },
        _createAdvancedSearchPanelElement: function () {
            var div = document.createElement('div');
            div.id = this._addUID('GPadvancedSearchPanel');
            div.className = 'GPpanel';
            div.style.display = 'none';
            return div;
        },
        _createGeocodeResultsElement: function () {
            var div = document.createElement('div');
            div.id = this._addUID('GPgeocodeResultsList');
            div.className = 'GPpanel';
            div.style.display = 'none';
            div.appendChild(this._createGeocodeResultsHeaderElement());
            return div;
        },
        _createAutoCompleteElement: function () {
            var div = document.createElement('div');
            div.id = this._addUID('GPautoCompleteList');
            div.className = 'GPautoCompleteList';
            div.style.display = 'none';
            return div;
        },
        _createAutoCompleteListElement: function () {
            var self = this;
            var container = document.createElement('div');
            container.id = this._addUID('GPautocompleteResults');
            if (container.addEventListener) {
                container.addEventListener('click', function (e) {
                    self.onAutoCompletedResultsItemClick(e);
                    document.getElementById(self._addUID('GPautoCompleteList')).style.display = 'none';
                }, false);
            } else if (container.attachEvent) {
                container.attachEvent('onclick', function (e) {
                    self.onAutoCompletedResultsItemClick(e);
                    document.getElementById(self._addUID('GPautoCompleteList')).style.display = 'none';
                });
            }
            return container;
        },
        _createAutoCompletedLocationElement: function (location, id) {
            var container = document.getElementById(this._addUID('GPautocompleteResults'));
            var div = document.createElement('div');
            div.id = this._addUID('AutoCompletedLocation_' + id);
            div.className = 'GPautoCompleteProposal';
            div.innerHTML = location.fullText;
            if (div.addEventListener) {
                div.addEventListener('click', function (e) {
                    container.click(e);
                }, false);
            } else if (div.attachEvent) {
                div.attachEvent('onclick', function (e) {
                    container.click(e);
                });
            }
            container.appendChild(div);
        },
        _createAdvancedSearchPanelHeaderElement: function () {
            var self = this;
            var container = document.createElement('div');
            container.className = 'GPpanelHeader';
            var divTitle = document.createElement('div');
            divTitle.className = 'GPpanelTitle';
            divTitle.innerHTML = 'Recherche avancée';
            container.appendChild(divTitle);
            var divClose = document.createElement('div');
            divClose.id = this._addUID('GPadvancedSearchClose');
            divClose.className = 'GPpanelClose';
            divClose.title = 'Fermer la recherche avancée';
            if (divClose.addEventListener) {
                divClose.addEventListener('click', function () {
                    var id = '#GPsearchInput-' + self._uid;
                    document.querySelector(id + ' input').disabled = false;
                    document.getElementById(self._addUID('GPgeocodeResultsList')).style.display = 'none';
                    document.getElementById(self._addUID('GPshowAdvancedSearch')).style.display = 'inline-block';
                    document.getElementById(self._addUID('GPadvancedSearchPanel')).style.display = 'none';
                }, false);
            } else if (divClose.attachEvent) {
                divClose.attachEvent('onclick', function () {
                    var id = '#GPsearchInput-' + self._uid;
                    document.querySelector(id + ' input').disabled = false;
                    document.getElementById(self._addUID('GPgeocodeResultsList')).style.display = 'none';
                    document.getElementById(self._addUID('GPshowAdvancedSearch')).style.display = 'inline-block';
                    document.getElementById(self._addUID('GPadvancedSearchPanel')).style.display = 'none';
                });
            }
            container.appendChild(divClose);
            return container;
        },
        _createAdvancedSearchPanelFormElement: function (advancedSearchCodes) {
            var self = this;
            var form = document.createElement('form');
            form.id = this._addUID('GPadvancedSearchForm');
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                var data = [];
                var id = '#GPadvancedSearchFilters-' + self._uid;
                var matchesFilters = document.querySelectorAll(id + ' > div > div > input');
                for (var i = 0; i < matchesFilters.length; i++) {
                    var element = matchesFilters[i];
                    data.push({
                        key: element.name,
                        value: element.value
                    });
                }
                self.onGeocodingAdvancedSearchSubmit(e, data);
                document.getElementById(self._addUID('GPgeocodeResultsList')).style.display = 'block';
                return false;
            });
            var div = document.createElement('div');
            div.className = 'GPflexInput';
            var label = document.createElement('label');
            label.className = 'GPadvancedSearchCodeLabel';
            label.innerHTML = 'Recherche par';
            div.appendChild(label);
            var select = this._createAdvancedSearchFormCodeElement(advancedSearchCodes);
            div.appendChild(select);
            form.appendChild(div);
            return form;
        },
        _createAdvancedSearchFormCodeElement: function (codes) {
            var self = this;
            var select = document.createElement('select');
            select.id = this._addUID('GPadvancedSearchCode');
            select.className = 'GPadvancedSearchCode';
            select.addEventListener('change', function (e) {
                self.onGeocodingAdvancedSearchCodeChange(e);
            }, false);
            if (!codes) {
                codes = [
                    {
                        id: 'PositionOfInterest',
                        title: 'Lieux/toponymes'
                    },
                    {
                        id: 'StreetAddress',
                        title: 'Adresses'
                    },
                    {
                        id: 'CadastralParcel',
                        title: 'Parcelles cadastrales'
                    },
                    {
                        id: 'Administratif',
                        title: 'Administratif'
                    }
                ];
            }
            for (var i = 0; i < codes.length; i++) {
                var option = document.createElement('option');
                option.value = codes[i].id;
                option.text = codes[i].title;
                select.appendChild(option);
            }
            return select;
        },
        _createAdvancedSearchFormInputElement: function () {
            var input = document.createElement('input');
            input.type = 'submit';
            input.id = this._addUID('GPadvancedSearchSubmit');
            input.className = 'GPinputSubmit';
            input.value = 'Chercher';
            return input;
        },
        _createAdvancedSearchFormFiltersElement: function () {
            var container = document.createElement('div');
            container.id = this._addUID('GPadvancedSearchFilters');
            return container;
        },
        _createAdvancedSearchFiltersTableElement: function (code, display) {
            var container = document.createElement('div');
            container.id = this._addUID(code);
            if (!display) {
                container.style.display = 'none';
            }
            return container;
        },
        _createAdvancedSearchFiltersAttributElement: function (filterAttributes) {
            var container = null;
            var name = filterAttributes.name;
            var title = filterAttributes.title;
            var description = filterAttributes.description;
            var code = filterAttributes.code;
            var value = filterAttributes.value;
            var div = document.createElement('div');
            div.className = 'GPflexInput';
            var label = document.createElement('label');
            label.className = 'GPadvancedSearchFilterLabel';
            label.htmlFor = name;
            label.title = description || title;
            label.innerHTML = title;
            div.appendChild(label);
            var input = document.createElement('input');
            input.id = name;
            input.className = 'GPadvancedSearchFilterInput';
            input.type = 'text';
            input.name = name;
            if (value) {
                input.value = value;
            }
            div.appendChild(input);
            container = document.getElementById(this._addUID(code));
            if (container) {
                container.appendChild(div);
            } else {
                container = div;
            }
            return container;
        },
        _createGeocodeResultsHeaderElement: function () {
            var self = this;
            var container = document.createElement('div');
            container.className = 'GPpanelHeader';
            var divTitle = document.createElement('div');
            divTitle.className = 'GPpanelTitle';
            divTitle.innerHTML = 'Résultats de la recherche';
            container.appendChild(divTitle);
            var divClose = document.createElement('div');
            divClose.id = this._addUID('GPgeocodeResultsClose');
            divClose.className = 'GPpanelClose';
            divClose.title = 'Fermer la fenêtre de résultats';
            if (divClose.addEventListener) {
                divClose.addEventListener('click', function () {
                    document.getElementById(self._addUID('GPgeocodeResultsList')).style.display = 'none';
                }, false);
            } else if (divClose.attachEvent) {
                divClose.attachEvent('onclick', function () {
                    document.getElementById(self._addUID('GPgeocodeResultsList')).style.display = 'none';
                });
            }
            container.appendChild(divClose);
            return container;
        },
        _createGeocodeResultsListElement: function () {
            var self = this;
            var container = document.createElement('div');
            container.id = this._addUID('GPgeocodeResults');
            if (container.addEventListener) {
                container.addEventListener('click', function (e) {
                    if (!e.ctrlKey) {
                        document.getElementById(self._addUID('GPgeocodeResultsList')).style.display = 'none';
                    }
                    self.onGeocodedResultsItemClick(e);
                }, false);
            } else if (container.attachEvent) {
                container.attachEvent('onclick', function (e) {
                    if (!e.ctrlKey) {
                        document.getElementById(self._addUID('GPgeocodeResultsList')).style.display = 'none';
                    }
                    self.onGeocodedResultsItemClick(e);
                });
            }
            return container;
        },
        _createGeocodedLocationElement: function (location, id) {
            var container = document.getElementById(this._addUID('GPgeocodeResults'));
            var div = document.createElement('div');
            div.id = this._addUID('GeocodedLocation_' + id);
            div.className = 'GPautoCompleteProposal';
            if (typeof location === 'string') {
                div.innerHTML = location;
            } else {
                var places = location.placeAttributes;
                if (places.freeform) {
                    div.innerHTML = places.freeform;
                } else if (places.postalCode) {
                    div.innerHTML = places.postalCode + ' ' + places.commune;
                } else if (places.cadastralParcel) {
                    div.innerHTML = places.cadastralParcel;
                } else {
                    div.innerHTML = '...';
                }
            }
            container.appendChild(div);
        }
    };
    return SearchEngineDOM;
}(CommonUtilsSelectorID);
CommonControlsSearchEngineUtils = function () {
    var SearchEngineUtils = {
        advancedSearchFiltersByDefault: {
            PositionOfInterest: [
                {
                    name: 'importance',
                    title: 'Importance'
                },
                {
                    name: 'nature',
                    title: 'Nature'
                },
                {
                    name: 'territory',
                    title: 'Territoire'
                },
                {
                    name: 'insee',
                    title: 'Code INSEE'
                },
                {
                    name: 'municipality',
                    title: 'Ville'
                },
                {
                    name: 'department',
                    title: 'Département'
                }
            ],
            StreetAddress: [
                {
                    name: 'territory',
                    title: 'Territoire'
                },
                {
                    name: 'insee',
                    title: 'Code INSEE'
                },
                {
                    name: 'municipality',
                    title: 'Ville'
                },
                {
                    name: 'department',
                    title: 'Département'
                }
            ],
            CadastralParcel: [
                {
                    name: 'department',
                    title: 'Département',
                    description: 'Numéro du département (ex: 01, 94)'
                },
                {
                    name: 'commune',
                    title: 'Code commune (INSEE)',
                    description: 'Code commune (INSEE) : 3 chiffres (ex: 067)'
                },
                {
                    name: 'absorbedCity',
                    title: 'Commune absorbée',
                    description: 'Commune absorbée : 3 chiffres (ex: 000, 001)'
                },
                {
                    name: 'section',
                    title: 'Section',
                    description: 'Section : 2 caractères (ex: AA, 0D)'
                },
                {
                    name: 'number',
                    title: 'Numéro',
                    description: 'Numéro de la parcelle : 4 chiffres (ex: 0041, 0250)'
                }
            ],
            Administratif: [
                {
                    name: 'prefecture',
                    title: 'Préfecture'
                },
                {
                    name: 'inseeRegion',
                    title: 'Code région (INSEE)'
                },
                {
                    name: 'inseeDepartment',
                    title: 'Code département (INSEE)'
                },
                {
                    name: 'municipality',
                    title: 'Ville'
                }
            ]
        },
        zoomToResultsByDefault: function (info) {
            var zoom = 15;
            var service = info.service;
            var fields = info.fields;
            var type = info.type;
            var importance = {
                1: 11,
                2: 12,
                3: 13,
                4: 14,
                5: 15,
                6: 16,
                7: 17,
                8: 17
            };
            if (service === 'SuggestedLocation') {
                if (type === 'PositionOfInterest') {
                    zoom = importance[fields.classification];
                }
            }
            if (service === 'DirectGeocodedLocation') {
                if (type === 'PositionOfInterest') {
                    zoom = importance[fields.importance] || 14;
                }
            }
            if (type === 'StreetAddress') {
                zoom = 17;
            }
            if (type === 'CadastralParcel') {
                zoom = 17;
            }
            if (type === 'Administratif') {
                zoom = 12;
            }
            return zoom;
        }
    };
    return SearchEngineUtils;
}();
Ol3ControlsSearchEngine = function (ol, Gp, woodman, Utils, Markers, RightManagement, SelectorID, SearchEngineDOM, SearchEngineUtils) {
    function SearchEngine(options) {
        options = options || {};
        if (!(this instanceof SearchEngine)) {
            throw new TypeError('ERROR CLASS_CONSTRUCTOR');
        }
        this.initialize(options);
        this._container = this._initContainer();
        this._containerElement = null;
        if (options.element && options.element.appendChild) {
            options.element.appendChild(this._container);
            this._containerElement = options.element;
        }
        ol.control.Control.call(this, {
            element: this._containerElement || this._container,
            target: options.target,
            render: options.render
        });
    }
    ol.inherits(SearchEngine, ol.control.Control);
    SearchEngine.prototype = Object.create(ol.control.Control.prototype, {});
    Utils.assign(SearchEngine.prototype, SearchEngineDOM);
    SearchEngine.prototype.constructor = SearchEngine;
    SearchEngine.prototype.setMap = function (map) {
        if (!map) {
            this._clearResults();
        }
        ol.control.Control.prototype.setMap.call(this, map);
    };
    SearchEngine.prototype.getCollapsed = function () {
        return this.collapsed;
    };
    SearchEngine.prototype.setCollapsed = function (collapsed) {
        if (collapsed === undefined) {
            console.log('[ERROR] SearchEngine:setCollapsed - missing collapsed parameter');
            return;
        }
        if (collapsed && this.collapsed || !collapsed && !this.collapsed) {
            return;
        }
        if (collapsed) {
            this._showSearchEngineInput.click();
        } else {
            this._showSearchEngineInput.click();
        }
        this.collapsed = collapsed;
    };
    SearchEngine.prototype.initialize = function (options) {
        this._checkInputOptions(options);
        this.options = {
            collapsed: true,
            zoomTo: '',
            resources: {
                geocode: [],
                autocomplete: []
            },
            displayAdvancedSearch: true,
            advancedSearch: {},
            geocodeOptions: {},
            autocompleteOptions: {}
        };
        Utils.mergeParams(this.options, options);
        if (this.options.resources.geocode.length === 0) {
            this.options.resources.geocode = [
                'PositionOfInterest',
                'StreetAddress'
            ];
        }
        if (this.options.resources.autocomplete.length === 0) {
            this.options.resources.autocomplete = [
                'PositionOfInterest',
                'StreetAddress'
            ];
        }
        this.collapsed = this.options.collapsed;
        this._uid = SelectorID.generate();
        this._showSearchEngineInput = null;
        this._inputSearchContainer = null;
        this._autocompleteContainer = null;
        this._suggestedContainer = null;
        this._suggestedLocations = [];
        this._geocodedContainer = null;
        this._geocodedLocations = [];
        this._filterContainer = null;
        this._currentGeocodingCode = null;
        this._currentGeocodingLocation = null;
        this._advancedSearchFilters = {};
        this._initAdvancedSearchFilters();
        this._advancedSearchCodes = [];
        this._initAdvancedSearchCodes();
        this._marker = null;
        this._markerUrl = Markers['lightOrange'];
        this._popupContent = null;
        this._popupDiv = this._initPopupDiv();
        this._popupOverlay = null;
        this._servicesRightManagement = {};
        this._noRightManagement = false;
        this._checkRightsManagement();
    };
    SearchEngine.prototype._checkInputOptions = function (options) {
        var i;
        if (options.resources) {
            if (typeof options.resources === 'object') {
                var geocodeResources = options.resources.geocode;
                if (geocodeResources) {
                    if (!Array.isArray(geocodeResources)) {
                        console.log('[SearchEngine] \'options.resources.geocode\' parameter should be an array');
                        geocodeResources = null;
                    }
                    var geocodeResourcesList = [
                        'StreetAddress',
                        'PositionOfInterest',
                        'CadastralParcel',
                        'Administratif'
                    ];
                    for (i = 0; i < geocodeResources.length; i++) {
                        if (geocodeResourcesList.indexOf(geocodeResources[i]) === -1) {
                            console.log('[SearchEngine] options.resources.geocode : ' + geocodeResources[i] + ' is not a resource for geocode');
                        }
                    }
                }
                var autocompleteResources = options.resources.autocomplete;
                if (autocompleteResources) {
                    if (!Array.isArray(autocompleteResources)) {
                        console.log('[SearchEngine] \'options.resources.autocomplete\' parameter should be an array');
                        autocompleteResources = null;
                    }
                    var autocompleteResourcesList = [
                        'StreetAddress',
                        'PositionOfInterest'
                    ];
                    for (i = 0; i < autocompleteResources.length; i++) {
                        if (autocompleteResourcesList.indexOf(autocompleteResources[i]) === -1) {
                            console.log('[SearchEngine] options.resources.autocomplete : ' + autocompleteResources[i] + ' is not a resource for autocomplete');
                        }
                    }
                }
            } else {
                console.log('[SearchEngine] \'resources\' parameter should be an object');
                options.resources = null;
            }
        }
    };
    SearchEngine.prototype._initAdvancedSearchCodes = function () {
        var geocodeResources = this.options.resources.geocode;
        for (var i = 0; i < geocodeResources.length; i++) {
            switch (geocodeResources[i]) {
            case 'PositionOfInterest':
                this._advancedSearchCodes.push({
                    id: 'PositionOfInterest',
                    title: 'Lieux/toponymes'
                });
                break;
            case 'StreetAddress':
                this._advancedSearchCodes.push({
                    id: 'StreetAddress',
                    title: 'Adresses'
                });
                break;
            case 'CadastralParcel':
                this._advancedSearchCodes.push({
                    id: 'CadastralParcel',
                    title: 'Parcelles cadastrales'
                });
                break;
            case 'Administratif':
                this._advancedSearchCodes.push({
                    id: 'Administratif',
                    title: 'Administratif'
                });
                break;
            default:
                break;
            }
        }
        if (this._advancedSearchCodes.length === 0) {
            this._advancedSearchCodes = [
                {
                    id: 'StreetAddress',
                    title: 'Adresses'
                },
                {
                    id: 'PositionOfInterest',
                    title: 'Lieux/toponymes'
                }
            ];
        }
    };
    SearchEngine.prototype._initAdvancedSearchFilters = function () {
        this._advancedSearchFilters = SearchEngineUtils.advancedSearchFiltersByDefault;
        var advancedSearchFiltersCustom = this.options.advancedSearch;
        Utils.assign(this._advancedSearchFilters, advancedSearchFiltersCustom);
    };
    SearchEngine.prototype._initPopupDiv = function () {
        var context = this;
        var element = document.createElement('div');
        element.className = 'gp-feature-info-div';
        var closer = document.createElement('input');
        closer.type = 'button';
        closer.className = 'gp-styling-button closer';
        closer.onclick = function () {
            if (context._popupOverlay != null) {
                context._popupOverlay.setPosition(undefined);
            }
            return false;
        };
        this._popupContent = document.createElement('div');
        this._popupContent.className = 'gp-features-content-div';
        this._popupContent.style['min-width'] = '200px';
        element.appendChild(this._popupContent);
        element.appendChild(closer);
        return element;
    };
    SearchEngine.prototype._initContainer = function () {
        var container = this._createMainContainerElement();
        var inputShow = this._showSearchEngineInput = this._createShowSearchEngineElement();
        container.appendChild(inputShow);
        if (!this.options.collapsed) {
            inputShow.checked = true;
        }
        var picto = this._createShowSearchEnginePictoElement();
        container.appendChild(picto);
        var search = this._inputSearchContainer = this._createSearchInputElement();
        var context = this;
        if (search.addEventListener) {
            search.addEventListener('click', function () {
                context.onAutoCompleteInputClick();
            });
        } else if (search.attachEvent) {
            search.attachEvent('onclick', function () {
                context.onAutoCompleteInputClick();
            });
        }
        container.appendChild(search);
        if (this.options.displayAdvancedSearch) {
            var advancedShow = this._createShowAdvancedSearchElement();
            container.appendChild(advancedShow);
            var advancedPanel = this._createAdvancedSearchPanelElement();
            var advancedHeader = this._createAdvancedSearchPanelHeaderElement();
            var advancedForm = this._createAdvancedSearchPanelFormElement(this._advancedSearchCodes);
            var advancedFormFilters = this._filterContainer = this._createAdvancedSearchFormFiltersElement();
            this._setFilter(this._advancedSearchCodes[0].id);
            var advancedFormInput = this._createAdvancedSearchFormInputElement();
            advancedForm.appendChild(advancedFormFilters);
            advancedForm.appendChild(advancedFormInput);
            advancedPanel.appendChild(advancedHeader);
            advancedPanel.appendChild(advancedForm);
            container.appendChild(advancedPanel);
        }
        var autocomplete = this._autocompleteContainer = this._createAutoCompleteElement();
        var autocompleteList = this._suggestedContainer = this._createAutoCompleteListElement();
        autocomplete.appendChild(autocompleteList);
        container.appendChild(autocomplete);
        var geocode = this._createGeocodeResultsElement();
        var geocodeList = this._geocodedContainer = this._createGeocodeResultsListElement();
        geocode.appendChild(geocodeList);
        container.appendChild(geocode);
        return container;
    };
    SearchEngine.prototype._setFilter = function (code) {
        var container = this._filterContainer;
        var codeFound = false;
        for (var i = 0; i < this._advancedSearchCodes.length; i++) {
            if (this._advancedSearchCodes[i].id === code) {
                codeFound = true;
                break;
            }
        }
        if (!codeFound) {
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
            return;
        }
        this._currentGeocodingCode = code;
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        var lstAttributs = this._advancedSearchFilters[code];
        if (!lstAttributs || lstAttributs.length === 0) {
            return;
        }
        var divTable = this._createAdvancedSearchFiltersTableElement(code, true);
        for (var j = 0; j < lstAttributs.length; j++) {
            var divFilter = this._createAdvancedSearchFiltersAttributElement(lstAttributs[j]);
            divTable.appendChild(divFilter);
        }
        container.appendChild(divTable);
        return container;
    };
    SearchEngine.prototype._checkRightsManagement = function () {
        var _resources = [];
        var _key;
        var _opts = null;
        _key = this.options.autocompleteOptions.apiKey;
        _opts = this.options.autocompleteOptions.filterOptions;
        _resources = _opts ? _opts.type : [];
        if (!_resources || _resources.length === 0) {
            _resources = this.options.resources.autocomplete;
        }
        if (!_resources || _resources.length === 0) {
            _resources = [
                'StreetAddress',
                'PositionOfInterest'
            ];
        }
        var rightManagementAutoComplete = RightManagement.check({
            key: _key || this.options.apiKey,
            resources: _resources,
            services: ['AutoCompletion']
        });
        _key = this.options.geocodeOptions.apiKey;
        _opts = this.options.geocodeOptions.filterOptions;
        _resources = _opts ? _opts.type : [];
        if (!_resources || _resources.length === 0) {
            _resources = this.options.resources.geocode;
        }
        if (!_resources || _resources.length === 0) {
            _resources = [
                'StreetAddress',
                'PositionOfInterest'
            ];
        }
        var rightManagementGeocode = RightManagement.check({
            key: _key || this.options.apiKey,
            resources: _resources,
            services: ['Geocode']
        });
        if (!rightManagementAutoComplete && !rightManagementGeocode) {
            this._noRightManagement = true;
            return;
        }
        if (!this.options.apiKey) {
            if (rightManagementGeocode) {
                this.options.apiKey = rightManagementGeocode.key;
            } else {
                this.options.apiKey = rightManagementAutoComplete.key;
            }
        }
        if (rightManagementAutoComplete) {
            this._servicesRightManagement['AutoCompletion'] = rightManagementAutoComplete['AutoCompletion'];
        }
        if (rightManagementGeocode) {
            this._servicesRightManagement['Geocode'] = rightManagementGeocode['Geocode'];
        }
    };
    SearchEngine.prototype._requestAutoComplete = function (settings) {
        if (!settings || typeof settings === 'object' && Object.keys(settings).length === 0) {
            return;
        }
        if (!settings.text) {
            return;
        }
        var options = {};
        Utils.assign(options, this.options.autocompleteOptions);
        Utils.assign(options, settings);
        var resources = this.options.resources.autocomplete;
        if (resources && Array.isArray(resources)) {
            if (!options.filterOptions) {
                options.filterOptions = {};
            }
            if (!options.filterOptions.type) {
                options.filterOptions.type = resources;
            }
        }
        options.apiKey = options.apiKey || this.options.apiKey;
        Gp.Services.autoComplete(options);
    };
    SearchEngine.prototype._fillAutoCompletedLocationListContainer = function (locations) {
        if (!locations || locations.length === 0) {
            return;
        }
        var element = this._suggestedContainer;
        if (element.childElementCount) {
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
        }
        this._displaySuggestedLocation();
        for (var i = 0; i < locations.length; i++) {
            this._createAutoCompletedLocationElement(locations[i], i);
        }
    };
    SearchEngine.prototype._requestGeocoding = function (settings) {
        if (!settings || typeof settings === 'object' && Object.keys(settings).length === 0) {
            return;
        }
        if (!settings.location) {
            return;
        }
        var options = {};
        options.returnFreeForm = true;
        Utils.assign(options, this.options.geocodeOptions);
        Utils.assign(options, settings);
        var resources = this.options.resources.geocode;
        if (resources && Array.isArray(resources)) {
            if (!options.filterOptions) {
                options.filterOptions = {};
            }
            if (!options.filterOptions.type) {
                options.filterOptions.type = resources;
            }
        }
        options.apiKey = options.apiKey || this.options.apiKey;
        Gp.Services.geocode(options);
    };
    SearchEngine.prototype._fillGeocodedLocationListContainer = function (locations) {
        if (!locations || locations.length === 0) {
            this._clearGeocodedLocation();
            return;
        }
        var element = this._geocodedContainer;
        if (element.childElementCount) {
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
        }
        for (var i = 0; i < locations.length; i++) {
            this._createGeocodedLocationElement(locations[i], i);
        }
        this._geocodedLocations = locations;
    };
    SearchEngine.prototype._setLabel = function (label) {
        document.getElementById('GPsearchInputText-' + this._uid).value = label;
    };
    SearchEngine.prototype._setPosition = function (position, zoom) {
        var view = this.getMap().getView();
        console.log(position);
        view.setCenter(position);
        view.setZoom(zoom);
    };
    SearchEngine.prototype._setMarker = function (position, info) {
        var map = this.getMap();
        var context = this;
        if (this._marker != null) {
            map.removeOverlay(this._marker);
            this._marker = null;
        }
        if (position) {
            var markerDiv = document.createElement('img');
            markerDiv.src = this._markerUrl;
            if (markerDiv.addEventListener) {
                markerDiv.addEventListener('click', function () {
                    context._onResultMarkerSelect(info);
                });
            } else if (markerDiv.attachEvent) {
                markerDiv.attachEvent('onclick', function () {
                    context._onResultMarkerSelect(info);
                });
            }
            this._marker = new ol.Overlay({
                position: position,
                offset: [
                    -25.5,
                    -38
                ],
                element: markerDiv,
                stopEvent: false
            });
            map.addOverlay(this._marker);
        }
    };
    SearchEngine.prototype._getZoom = function (info) {
        var map = this.getMap();
        var key = this.options.zoomTo;
        var zoom = null;
        if (typeof key === 'function') {
            zoom = key.call(this, info);
        }
        if (typeof key === 'number') {
            zoom = key;
        }
        if (typeof key === 'string') {
            if (key === 'auto') {
                zoom = SearchEngineUtils.zoomToResultsByDefault(info);
            } else {
                var value = parseInt(key, 10);
                if (!isNaN(value)) {
                    zoom = value;
                }
            }
        }
        Number.isInteger = Number.isInteger || function (value) {
            return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
        };
        if (!zoom || zoom === '' || !Number.isInteger(zoom)) {
            zoom = map.getView().getZoom();
        }
        var min = map.minZoom;
        var max = map.maxZoom;
        if (zoom < min) {
            zoom = min;
        }
        if (zoom > max) {
            zoom = max;
        }
        return zoom;
    };
    SearchEngine.prototype._onResultMarkerSelect = function (information) {
        var map = this.getMap();
        var popupContent = '';
        if (information.attributes) {
            popupContent = '<ul>';
            var attributes = information.attributes;
            for (var attr in attributes) {
                if (attributes.hasOwnProperty(attr)) {
                    if (attr !== 'bbox') {
                        popupContent += '<li>';
                        popupContent += '<span class="gp-attname-others-span">' + attr.toUpperCase() + ' : </span>';
                        popupContent += attributes[attr];
                        popupContent += ' </li>';
                    }
                }
            }
            popupContent += ' </ul>';
        } else {
            popupContent = information.label;
        }
        this._popupContent.innerHTML = popupContent;
        if (!this._popupOverlay) {
            this._popupOverlay = new ol.Overlay({
                element: this._popupDiv,
                positioning: 'bottom-center',
                position: this._marker.getPosition(),
                offset: [
                    0,
                    -42
                ]
            });
            map.addOverlay(this._popupOverlay);
        } else {
            this._popupOverlay.setPosition(this._marker.getPosition());
        }
    };
    SearchEngine.prototype.onShowSearchEngineClick = function () {
        this.collapsed = this._showSearchEngineInput.checked;
        this.dispatchEvent('change:collapsed');
    };
    SearchEngine.prototype.onSearchResetClick = function () {
        this._clearResults();
    };
    SearchEngine.prototype.onAutoCompleteInputClick = function () {
        var inputSearchTextContainer = document.getElementById('GPsearchInputText-' + this._uid);
        if (inputSearchTextContainer && !inputSearchTextContainer.disabled && inputSearchTextContainer.value.length > 2) {
            this._displaySuggestedLocation();
        }
    };
    SearchEngine.prototype.onAutoCompleteSearchText = function (e) {
        var value = e.target.value;
        if (!value) {
            return;
        }
        if (this._noRightManagement) {
            console.log('no rights for this service !');
            return;
        }
        this._currentGeocodingLocation = value;
        if (value.length < 3) {
            this._clearSuggestedLocation();
            return;
        }
        var context = this;
        this._requestAutoComplete({
            text: value,
            onSuccess: function (results) {
                if (results) {
                    context._suggestedLocations = results.suggestedLocations;
                    var locationsToBeDisplayed = [];
                    for (var i = 0; i < context._suggestedLocations.length; i++) {
                        var ilocation = context._suggestedLocations[i];
                        if (ilocation.position && ilocation.position.x === 0 && ilocation.position.y === 0 && ilocation.fullText) {
                            context._getGeocodeCoordinatesFromFullText(ilocation, i);
                        } else {
                            locationsToBeDisplayed.push(ilocation);
                        }
                    }
                    context._fillAutoCompletedLocationListContainer(locationsToBeDisplayed);
                }
            },
            onFailure: function (error) {
                context._clearSuggestedLocation();
            }
        });
        var map = this.getMap();
        map.on('click', this._hideSuggestedLocation, this);
        map.on('pointerdrag', this._hideSuggestedLocation, this);
    };
    SearchEngine.prototype._getGeocodeCoordinatesFromFullText = function (suggestedLocation, i) {
        var context = this;
        Gp.Services.geocode({
            apiKey: this.options.apiKey,
            location: suggestedLocation.fullText,
            filterOptions: { type: suggestedLocation.type },
            onSuccess: function (response) {
                if (response.locations && response.locations.length !== 0 && response.locations[0].position) {
                    if (context._suggestedLocations && context._suggestedLocations[i]) {
                        context._suggestedLocations[i].position = {
                            x: response.locations[0].position.y,
                            y: response.locations[0].position.x
                        };
                        context._createAutoCompletedLocationElement(context._suggestedLocations[i], i);
                    }
                }
            },
            onFailure: function () {
                if (context._suggestedLocations && context._suggestedLocations[i]) {
                    context._createAutoCompletedLocationElement(context._suggestedLocations[i], i);
                }
            }
        });
    };
    SearchEngine.prototype.onAutoCompletedResultsItemClick = function (e) {
        var idx = SelectorID.index(e.target.id);
        if (!idx) {
            return;
        }
        var position = [
            this._suggestedLocations[idx].position.x,
            this._suggestedLocations[idx].position.y
        ];
        var info = {
            service: 'SuggestedLocation',
            type: this._suggestedLocations[idx].type,
            fields: this._suggestedLocations[idx]
        };
        var label = this._suggestedLocations[idx].fullText;
        this._setLabel(label);
        info.label = label;
        var view = this.getMap().getView();
        var mapProj = view.getProjection().getCode();
        if (mapProj !== 'EPSG:4326') {
            position = ol.proj.transform(position, 'EPSG:4326', mapProj);
        }
        var zoom = this._getZoom(info);
        this._setPosition(position, zoom);
        this._setMarker(position, info);
    };
    SearchEngine.prototype.onGeocodingSearchSubmit = function (e) {
        var value = e.target[0].value;
        if (!value) {
            return;
        }
        if (this._noRightManagement) {
            console.log('no rights for this service !');
            return;
        }
        this._currentGeocodingLocation = value;
        var context = this;
        this._requestGeocoding({
            location: value,
            onSuccess: function (results) {
                if (results) {
                    var locations = results.locations;
                    context._fillGeocodedLocationListContainer(locations);
                }
            },
            onFailure: function (error) {
                context._clearGeocodedLocation();
            }
        });
    };
    SearchEngine.prototype.onGeocodedResultsItemClick = function (e) {
        var idx = SelectorID.index(e.target.id);
        if (!idx) {
            return;
        }
        var position = [
            this._geocodedLocations[idx].position.y,
            this._geocodedLocations[idx].position.x
        ];
        var attributes = this._geocodedLocations[idx].placeAttributes;
        var info = {
            service: 'DirectGeocodedLocation',
            type: this._geocodedLocations[idx].type,
            fields: this._geocodedLocations[idx]
        };
        var label;
        if (attributes.freeform) {
            label = attributes.freeform;
        } else if (attributes.postalCode) {
            label = attributes.postalCode + ' ' + attributes.commune;
            info.attributes = attributes;
        } else if (attributes.cadastralParcel) {
            label = attributes.cadastralParcel;
            info.attributes = attributes;
        } else {
            label = '...';
        }
        this._setLabel(label);
        info.label = label;
        var view = this.getMap().getView();
        var mapProj = view.getProjection().getCode();
        if (mapProj !== 'EPSG:4326') {
            position = ol.proj.transform(position, 'EPSG:4326', mapProj);
        }
        var zoom = this._getZoom(info);
        this._setPosition(position, zoom);
        this._setMarker(position, info);
    };
    SearchEngine.prototype.onGeocodingAdvancedSearchCodeChange = function (e) {
        var idx = e.target.selectedIndex;
        var value = e.target.options[idx].value;
        if (!value) {
            return;
        }
        this._setFilter(value);
    };
    SearchEngine.prototype.onGeocodingAdvancedSearchSubmit = function (e, data) {
        if (!data || data.length === 0) {
            return;
        }
        var _location;
        var _filterOptions = {};
        var filter;
        _filterOptions.type = [this._currentGeocodingCode];
        for (var i = 0; i < data.length; i++) {
            filter = data[i];
            _filterOptions[filter.key] = filter.value;
        }
        if (this._currentGeocodingCode === 'CadastralParcel') {
            _location = this._getCadastralParcelRequestParams(_filterOptions);
            _filterOptions = { type: [this._currentGeocodingCode] };
        } else {
            _location = this._currentGeocodingLocation;
        }
        var context = this;
        this._requestGeocoding({
            location: _location,
            filterOptions: _filterOptions,
            onSuccess: function (results) {
                if (results) {
                    var locations = results.locations;
                    context._fillGeocodedLocationListContainer(locations);
                }
            },
            onFailure: function (error) {
                context._clearGeocodedLocation();
            }
        });
    };
    SearchEngine.prototype._getCadastralParcelRequestParams = function (filterOptions) {
        var _location = '';
        var l;
        var dep = filterOptions.department;
        if (dep) {
            l = dep.length;
            if (l === 2) {
                _location = dep;
            } else if (l === 1) {
                _location = '0' + dep;
            } else {
                _location = dep.substring(0, 2);
            }
        } else {
            _location = '__';
        }
        var commune = filterOptions.commune;
        if (commune) {
            l = commune.length;
            if (l === 3) {
                _location += commune;
            } else if (l == 2) {
                _location += '_' + commune;
            } else if (l == 1) {
                _location += '__' + commune;
            } else {
                _location += commune.substring(0, 3);
            }
        } else {
            _location += '___';
        }
        var insee = filterOptions.insee;
        if (insee) {
            if (insee.length === 5) {
                _location = insee;
            }
        }
        var absorbedCity = filterOptions.absorbedCity;
        if (absorbedCity) {
            l = absorbedCity.length;
            if (l === 3) {
                _location += absorbedCity;
            } else if (l < 3) {
                if (l === 2) {
                    _location += '_' + absorbedCity;
                } else if (l === 1) {
                    _location += '__' + absorbedCity;
                }
            } else {
                _location += absorbedCity.substring(0, 3);
            }
        } else {
            _location += '___';
        }
        var section = filterOptions.section;
        if (section) {
            l = section.length;
            if (l === 2) {
                _location += section;
            } else if (l === 1) {
                _location += '_' + section;
            } else {
                _location += section.substring(0, 2);
            }
        } else {
            _location += '__';
        }
        var number = filterOptions.number;
        if (number) {
            l = number.length;
            if (l === 4) {
                _location += number;
            } else if (l === 3) {
                _location += '_' + number;
            } else if (l === 2) {
                _location += '__' + number;
            } else if (l === 1) {
                _location += '___' + number;
            } else {
                _location += number.substring(0, 4);
            }
        } else {
            _location += '___';
        }
        return _location;
    };
    SearchEngine.prototype._clearResults = function () {
        var map = this.getMap();
        this._currentGeocodingLocation = null;
        this._clearSuggestedLocation();
        this._clearGeocodedLocation();
        this._setMarker();
        if (this._popupOverlay != null) {
            map.removeOverlay(this._popupOverlay);
            this._popupOverlay = null;
        }
    };
    SearchEngine.prototype._clearSuggestedLocation = function () {
        this._suggestedLocations = [];
        if (this._suggestedContainer) {
            while (this._suggestedContainer.firstChild) {
                this._suggestedContainer.removeChild(this._suggestedContainer.firstChild);
            }
        }
    };
    SearchEngine.prototype._hideSuggestedLocation = function () {
        if (this._autocompleteContainer) {
            this._autocompleteContainer.style.display = 'none';
        }
    };
    SearchEngine.prototype._displaySuggestedLocation = function () {
        if (this._autocompleteContainer) {
            this._autocompleteContainer.style.display = 'block';
        }
    };
    SearchEngine.prototype._clearGeocodedLocation = function () {
        this._geocodedLocations = [];
        if (this._geocodedContainer) {
            while (this._geocodedContainer.firstChild) {
                this._geocodedContainer.removeChild(this._geocodedContainer.firstChild);
            }
        }
    };
    return SearchEngine;
}(ol, gp, {}, Ol3Utils, Ol3ControlsUtilsMarkers, CommonUtilsCheckRightManagement, CommonUtilsSelectorID, CommonControlsSearchEngineDOM, CommonControlsSearchEngineUtils);
CommonControlsMousePositionDOM = function () {
    var MousePositionDOM = {
        _addUID: function (id) {
            var uid = this._uid ? id + '-' + this._uid : id;
            return uid;
        },
        _createMainContainerElement: function () {
            var container = document.createElement('div');
            container.id = this._addUID('GPmousePosition');
            container.className = 'GPwidget';
            return container;
        },
        _createShowMousePositionElement: function () {
            var input = document.createElement('input');
            input.id = this._addUID('GPshowMousePosition');
            input.type = 'checkbox';
            return input;
        },
        _createShowMousePositionPictoElement: function (isDesktop) {
            var self = this;
            var label = document.createElement('label');
            label.id = this._addUID('GPshowMousePositionPicto');
            label.className = 'GPshowAdvancedToolPicto';
            label.htmlFor = this._addUID('GPshowMousePosition');
            label.title = 'Afficher les coordonnées du curseur';
            label.addEventListener('click', function (e) {
                var mapCenterClass = '';
                if (!document.getElementById(self._addUID('GPshowMousePosition')).checked && !isDesktop) {
                    mapCenterClass = 'GPmapCenterVisible';
                }
                document.getElementById('GPmapCenter').className = mapCenterClass;
                self.onShowMousePositionClick(e);
            });
            var spanOpen = document.createElement('span');
            spanOpen.id = this._addUID('GPshowMousePositionOpen');
            spanOpen.className = 'GPshowAdvancedToolOpen';
            label.appendChild(spanOpen);
            return label;
        },
        _createMousePositionPanelElement: function (displayAltitude, displayCoordinates) {
            displayAltitude = displayAltitude ? true : typeof displayAltitude === 'undefined' ? true : false;
            displayCoordinates = displayCoordinates ? true : typeof displayCoordinates === 'undefined' ? true : false;
            var div = document.createElement('div');
            div.id = this._addUID('GPmousePositionPanel');
            div.className = 'GPpanel';
            div.appendChild(this._createMousePositionPanelHeaderElement());
            div.appendChild(this._createMousePositionPanelBasicElement(displayAltitude, displayCoordinates));
            var arraySettings = this._createShowMousePositionSettingsElement(displayCoordinates);
            for (var j = 0; j < arraySettings.length; j++) {
                div.appendChild(arraySettings[j]);
            }
            return div;
        },
        _createMapCenter: function () {
            var div = document.createElement('div');
            div.id = 'GPmapCenter';
            div.className = '';
            return div;
        },
        _createMousePositionPanelHeaderElement: function () {
            var container = document.createElement('div');
            container.className = 'GPpanelHeader';
            var divTitle = document.createElement('div');
            divTitle.className = 'GPpanelTitle';
            divTitle.innerHTML = 'Coordonnées';
            container.appendChild(divTitle);
            var divClose = document.createElement('div');
            divClose.id = 'GPmousePositionPanelClose';
            divClose.className = 'GPpanelClose';
            divClose.title = 'Fermer le panneau';
            var self = this;
            if (divClose.addEventListener) {
                divClose.addEventListener('click', function () {
                    document.getElementById(self._addUID('GPshowMousePositionPicto')).click();
                }, false);
            } else if (divClose.attachEvent) {
                divClose.attachEvent('onclick', function () {
                    document.getElementById(self._addUID('GPshowMousePositionPicto')).click();
                });
            }
            container.appendChild(divClose);
            return container;
        },
        _createMousePositionPanelBasicElement: function (displayAltitude, displayCoordinates) {
            var container = document.createElement('div');
            container.id = this._addUID('GPmousePositionBasicPanel');
            container.appendChild(this._createMousePositionPanelBasicCoordinateElement(displayCoordinates));
            container.appendChild(this._createMousePositionPanelBasicAltitudeElement(displayAltitude));
            return container;
        },
        _createMousePositionPanelBasicCoordinateElement: function (display) {
            var div = document.createElement('div');
            div.id = this._addUID('GPmousePositionCoordinate');
            div.style.display = display ? 'block' : 'none';
            var spanLat = document.createElement('span');
            spanLat.className = 'GPmousePositionLabel';
            spanLat.id = this._addUID('GPmousePositionLatLabel');
            spanLat.innerHTML = 'Latitude : ';
            div.appendChild(spanLat);
            var spanCLat = document.createElement('span');
            spanCLat.className = 'GPmousePositionCoords';
            spanCLat.id = this._addUID('GPmousePositionLat');
            spanCLat.innerHTML = '';
            div.appendChild(spanCLat);
            var spanLon = document.createElement('span');
            spanLon.className = 'GPmousePositionLabel';
            spanLon.id = this._addUID('GPmousePositionLonLabel');
            spanLon.innerHTML = 'Longitude : ';
            div.appendChild(spanLon);
            var spanCLon = document.createElement('span');
            spanCLon.className = 'GPmousePositionCoords';
            spanCLon.id = this._addUID('GPmousePositionLon');
            spanCLon.innerHTML = '';
            div.appendChild(spanCLon);
            return div;
        },
        _createMousePositionPanelBasicAltitudeElement: function (display) {
            var div = document.createElement('div');
            div.id = this._addUID('GPmousePositionAltitude');
            div.style.display = display ? 'block' : 'none';
            var spanLabel = document.createElement('span');
            spanLabel.className = 'GPmousePositionLabel';
            spanLabel.innerHTML = 'Altitude : ';
            div.appendChild(spanLabel);
            var spanAlt = document.createElement('span');
            spanAlt.className = 'GPmousePositionCoords';
            spanAlt.id = this._addUID('GPmousePositionAlt');
            spanAlt.innerHTML = '';
            div.appendChild(spanAlt);
            return div;
        },
        _createShowMousePositionSettingsElement: function (display) {
            var list = [];
            var input = document.createElement('input');
            input.type = 'checkbox';
            input.id = this._addUID('GPshowMousePositionSettings');
            var label = document.createElement('label');
            label.id = this._addUID('GPshowMousePositionSettingsPicto');
            label.htmlFor = this._addUID('GPshowMousePositionSettings');
            label.title = 'Réglages';
            label.className = 'GPshowMoreOptions GPshowMousePositionSettingsPicto';
            label.style.display = display ? 'block' : 'none';
            list.push(input);
            list.push(label);
            return list;
        },
        _createMousePositionSettingsElement: function () {
            var container = document.createElement('div');
            container.id = this._addUID('GPmousePositionSettings');
            var span = document.createElement('span');
            span.className = 'GPmousePositionSettingsLabel';
            span.innerHTML = 'Système de référence';
            container.appendChild(span);
            return container;
        },
        _createMousePositionSettingsSystemsElement: function (systems) {
            var context = this;
            var selectSystem = document.createElement('select');
            selectSystem.id = this._addUID('GPmousePositionProjectionSystem');
            selectSystem.className = 'GPinputSelect GPmousePositionSettingsSelect';
            selectSystem.addEventListener('change', function (e) {
                context.onMousePositionProjectionSystemChange(e);
            });
            selectSystem.addEventListener('mouseover', function (e) {
                context.onMousePositionProjectionSystemMouseOver(e);
            });
            for (var i = 0; i < systems.length; i++) {
                var obj = systems[i];
                var option = document.createElement('option');
                option.value = obj.code;
                option.text = obj.label || i;
                selectSystem.appendChild(option);
            }
            return selectSystem;
        },
        _createMousePositionSettingsUnitsElement: function (units) {
            var context = this;
            var selectUnits = document.createElement('select');
            selectUnits.id = this._addUID('GPmousePositionProjectionUnits');
            selectUnits.className = 'GPinputSelect GPmousePositionSettingsSelect';
            selectUnits.addEventListener('change', function (e) {
                context.onMousePositionProjectionUnitsChange(e);
            });
            for (var j = 0; j < units.length; j++) {
                var obj = units[j];
                var option = document.createElement('option');
                option.value = obj.code ? obj.code : j;
                option.text = obj.label || j;
                selectUnits.appendChild(option);
            }
            return selectUnits;
        },
        GPdisplayCoords: function (coordinate) {
            if (coordinate && coordinate != null) {
                var labelLon = document.getElementById(this._addUID('GPmousePositionLonLabel'));
                var labelLat = document.getElementById(this._addUID('GPmousePositionLatLabel'));
                if (coordinate.x || coordinate.y) {
                    labelLat.innerHTML = 'X : ';
                    labelLon.innerHTML = 'Y : ';
                } else if (coordinate.e || coordinate.n) {
                    labelLat.innerHTML = 'E : ';
                    labelLon.innerHTML = 'N : ';
                } else {
                    labelLat.innerHTML = 'Latitude : ';
                    labelLon.innerHTML = 'Longitude : ';
                }
                var elLat = document.getElementById(this._addUID('GPmousePositionLat'));
                var elLon = document.getElementById(this._addUID('GPmousePositionLon'));
                elLat.innerHTML = coordinate.x || coordinate.lat || coordinate.e || '0';
                if (coordinate.unit) {
                    elLat.innerHTML += ' ';
                    elLat.innerHTML += coordinate.unit;
                }
                elLon.innerHTML = coordinate.y || coordinate.lng || coordinate.lon || coordinate.n || '0';
                if (coordinate.unit) {
                    elLon.innerHTML += ' ';
                    elLon.innerHTML += coordinate.unit;
                }
            }
        },
        GPdisplayElevation: function (coordinate, altitudeTimeoutDelay, noDataValue, noDataValueTolerance) {
            var self = this;
            var altitudeTimeout;
            if (!altitudeTimeoutDelay) {
                altitudeTimeoutDelay = 500;
            }
            clearTimeout(altitudeTimeout);
            document.getElementById(this._addUID('GPmousePositionAlt')).innerHTML = '...';
            if (noDataValue == null) {
                noDataValue = -99999;
            }
            if (noDataValueTolerance == null) {
                noDataValueTolerance = 99980;
            }
            var maxThreshold = noDataValue + noDataValueTolerance;
            var minThreshold = noDataValue - noDataValueTolerance;
            if (coordinate && coordinate != null) {
                if (document.getElementById(this._addUID('GPmousePositionAltitude'))) {
                    altitudeTimeout = setTimeout(function () {
                        self.onRequestAltitude(coordinate, function (z) {
                            if (minThreshold < z && z < maxThreshold) {
                                document.getElementById(self._addUID('GPmousePositionAlt')).innerHTML = '--- m';
                            } else {
                                document.getElementById(self._addUID('GPmousePositionAlt')).innerHTML = z + ' m';
                            }
                        });
                    }, altitudeTimeoutDelay);
                }
            }
        }
    };
    return MousePositionDOM;
}();
Ol3ControlsMousePosition = function (ol, proj4, woodman, Gp, Utils, RightManagement, SelectorID, MousePositionDOM) {
    function MousePosition(options) {
        options = options || {};
        if (!(this instanceof MousePosition)) {
            throw new TypeError('ERROR CLASS_CONSTRUCTOR');
        }
        this._initialize(options);
        var container = this._initContainer(options);
        ol.control.Control.call(this, {
            element: container,
            target: options.target,
            render: options.render
        });
    }
    ol.inherits(MousePosition, ol.control.Control);
    MousePosition.prototype = Object.create(ol.control.Control.prototype, {});
    Utils.assign(MousePosition.prototype, MousePositionDOM);
    MousePosition.prototype.constructor = MousePosition;
    MousePosition.prototype.setMap = function (map) {
        if (map) {
            var center = this._createMapCenter();
            map.getViewport().appendChild(center);
            if (!this.collapsed && !this._isDesktop) {
                center.className = 'GPmapCenterVisible';
            }
            if (!this.collapsed) {
                if (this._isDesktop) {
                    map.on('pointermove', this.onMouseMove, this);
                } else {
                    map.on('moveend', this.onMapMove, this);
                }
            }
        }
        ol.control.Control.prototype.setMap.call(this, map);
        if (map == null) {
            return;
        }
        if (!this.collapsed) {
            var inputShow = document.getElementById('GPshowMousePosition-' + this._uid);
            inputShow.checked = 'checked';
            this._setElevationPanel(this.options.displayAltitude);
            this._setCoordinatesPanel(this.options.displayCoordinates);
            if (!this.options.displayCoordinates) {
                this._setSettingsPanel(false);
            }
        }
    };
    MousePosition.prototype.addSystem = function (system) {
        if (typeof system !== 'object') {
            console.log('[ERROR] MousePosition:addSystem - system parameter should be an object');
            return;
        }
        if (!system.crs) {
            return;
        }
        if (!system.label) {
            system.label = system.crs;
        }
        if (!system.type) {
            system.type = 'Metric';
        }
        var found = false;
        for (var j = 0; j < this._projectionSystems.length; j++) {
            var obj = this._projectionSystems[j];
            if (system.crs === obj.crs) {
                found = true;
            }
        }
        system.code = this._projectionSystems.length;
        this._projectionSystems.push(system);
        var selectSystem = document.getElementById('GPmousePositionProjectionSystem-' + this._uid);
        if (selectSystem) {
            var option = document.createElement('option');
            option.value = system.code;
            option.text = system.label;
            selectSystem.appendChild(option);
        }
    };
    MousePosition.prototype.addSystems = function (systems) {
        if (!systems) {
            return;
        }
        if (!Array.isArray(systems)) {
            console.log('[ERROR] MousePosition:addSystems - systems parameter should be an array');
            return;
        }
        for (var i = 0; i < systems.length; i++) {
            this.addSystem(systems[i]);
        }
    };
    MousePosition.prototype.removeSystem = function (systemCrs) {
        if (!systemCrs || typeof systemCrs !== 'string') {
            console.log('[ERROR] MousePosition:removeSystem - systemCode parameter should be a string');
            return;
        }
        var systemList = document.getElementById('GPmousePositionProjectionSystem-' + this._uid);
        var systemCode = null;
        for (var i = 0; i < this._projectionSystems.length; i++) {
            var proj = this._projectionSystems[i];
            if (systemCrs === proj.crs) {
                systemCode = proj.code;
                this._projectionSystems.splice(i, 1);
                break;
            }
        }
        if (systemCode == null) {
            console.log('[WARN] MousePosition:removeSystem - system not found');
            return;
        }
        var oldNewCodeMap = [];
        for (var j = 0; j < this._projectionSystems.length; j++) {
            oldNewCodeMap[Number(this._projectionSystems[j].code)] = j;
            this._projectionSystems[j].code = j;
        }
        var indexChildToRemove = null;
        for (var k = 0; k < systemList.childNodes.length; k++) {
            if (systemCode == systemList.childNodes[j].value) {
                indexChildToRemove = k;
                continue;
            }
            systemList.childNodes[j].value = oldNewCodeMap[Number(systemList.childNodes[j].value)];
        }
        if (indexChildToRemove != null) {
            systemList.removeChild(systemList.childNodes[indexChildToRemove]);
        }
        if (this._currentProjectionSystems.code == systemCode) {
            systemList.childNodes[0].setAttribute('selected', 'selected');
            this._setCurrentSystem(systemList.childNodes[0].value);
        }
    };
    MousePosition.prototype.setUnits = function (units) {
        if (!units || !Array.isArray(units)) {
            return;
        }
        this.options.units = units;
        this._projectionUnits = [];
        this._initProjectionUnits();
        if (this._currentProjectionType) {
            this._setTypeUnitsPanel(this._currentProjectionType);
        }
    };
    MousePosition.prototype.setAltitudeOptions = function (options) {
        if (!options || typeof options !== 'object') {
            return;
        }
        this.options.altitude.triggerDelay = options.triggerDelay;
        this.options.altitude.responseDelay = options.responseDelay;
        if (options.serviceOptions) {
            for (var opt in options.serviceOptions) {
                if (options.serviceOptions.hasOwnProperty(opt)) {
                    this.options.altitude.serviceOptions[opt] = options.serviceOptions[opt];
                }
            }
        }
    };
    MousePosition.prototype.displayAltitude = function (displayAltitude) {
        if (displayAltitude === undefined) {
            return;
        }
        this.options.displayAltitude = displayAltitude;
        this._setElevationPanel(displayAltitude);
    };
    MousePosition.prototype.displayCoordinates = function (displayCoordinates) {
        if (displayCoordinates === undefined) {
            return;
        }
        this.options.displayCoordinates = displayCoordinates;
        this._setCoordinatesPanel(displayCoordinates);
        this._setSettingsPanel(displayCoordinates);
    };
    MousePosition.prototype.setCollapsed = function (collapsed) {
        if (collapsed === undefined) {
            console.log('[ERROR] MousePosition:setCollapsed - missing collapsed parameter');
            return;
        }
        if (collapsed && this.collapsed || !collapsed && !this.collapsed) {
            return;
        }
        if (!this._isDesktop) {
            document.getElementById('GPmapCenter').className = collapsed ? '' : 'GPmapCenterVisible';
        }
        this.onShowMousePositionClick();
        this._showMousePositionContainer.checked = !collapsed;
    };
    MousePosition.prototype._initialize = function (options) {
        this.options = options || {};
        this.options.collapsed = options.collapsed !== undefined ? options.collapsed : true;
        this.collapsed = this.options.collapsed;
        this.options.units = options.units || [];
        this.options.displayAltitude = options.displayAltitude !== undefined ? options.displayAltitude : true;
        this.options.displayCoordinates = options.displayCoordinates !== undefined ? options.displayCoordinates : true;
        this.options.systems = options.systems || [];
        if (options.altitude) {
            var altitude = options.altitude;
            this.options.altitude = {
                triggerDelay: altitude.triggerDelay !== undefined ? altitude.triggerDelay : 200,
                responseDelay: altitude.responseDelay !== undefined ? altitude.responseDelay : 500,
                serviceOptions: altitude.serviceOptions || {},
                noDataValue: altitude.noDataValue !== undefined ? altitude.noDataValue : -99999,
                noDataValueTolerance: altitude.noDataValueTolerance !== undefined ? altitude.noDataValueTolerance : 90000
            };
        } else {
            this.options.altitude = {
                triggerDelay: 200,
                responseDelay: 500,
                serviceOptions: {}
            };
        }
        this._uid = SelectorID.generate();
        this._projectionSystems = [];
        this._initProjectionSystems();
        this._projectionUnits = {};
        this._initProjectionUnits();
        this._isDesktop = Utils.detectSupport();
        if (this.options.altitude.triggerDelay < 100) {
            this.options.altitude.triggerDelay = 100;
        }
        this._timer = this.options.altitude.triggerDelay;
        this._currentProjectionSystems = this._projectionSystems[0];
        this._currentProjectionType = this._projectionSystems[0].type;
        this._currentProjectionUnits = this._projectionUnits[this._currentProjectionType][0].code;
        this._projectionUnitsContainer = null;
        this._showMousePositionContainer = null;
        if (!this.options.displayAltitude && !this.options.displayCoordinates) {
            this.options.displayCoordinates = true;
        }
        if (this.options.displayAltitude) {
            this._checkRightsManagement();
        }
    };
    MousePosition.prototype._initProjectionSystems = function () {
        var projectionSystemsByDefault = [
            {
                label: 'Géographique',
                crs: ol.proj.get('EPSG:4326').getCode(),
                type: 'Geographical'
            },
            {
                label: 'Web Mercator',
                crs: ol.proj.get('EPSG:3857').getCode(),
                type: 'Metric'
            },
            {
                label: 'Lambert 93',
                crs: ol.proj.get('EPSG:2154').getCode(),
                type: 'Metric',
                geoBBox: {
                    left: -9.86,
                    bottom: 41.15,
                    right: 10.38,
                    top: 51.56
                }
            },
            {
                label: 'Lambert II étendu',
                crs: ol.proj.get('EPSG:27572'),
                type: 'Metric',
                geoBBox: {
                    left: -4.87,
                    bottom: 42.33,
                    right: 8.23,
                    top: 51.14
                }
            }
        ];
        var systems = this.options.systems;
        for (var i = 0; i < systems.length; i++) {
            var sys = systems[i];
            this.addSystem(sys);
        }
        if (this._projectionSystems.length === 0) {
            for (var j = 0; j < projectionSystemsByDefault.length; j++) {
                this.addSystem(projectionSystemsByDefault[j]);
            }
        }
    };
    MousePosition.prototype._initProjectionUnits = function () {
        var projectionUnitsByDefault = {
            Geographical: [
                {
                    code: 'DEC',
                    label: 'degrés décimaux',
                    convert: this._displayDEC
                },
                {
                    code: 'DMS',
                    label: 'degrés sexagésimaux',
                    convert: this._displayDMS
                },
                {
                    code: 'RAD',
                    label: 'radians',
                    convert: this._displayRAD
                },
                {
                    code: 'GON',
                    label: 'grades',
                    convert: this._displayGON
                }
            ],
            Metric: [
                {
                    code: 'M',
                    label: 'mètres',
                    convert: this._displayMeter
                },
                {
                    code: 'KM',
                    label: 'kilomètres',
                    convert: this._displayKMeter
                }
            ]
        };
        var units = this.options.units;
        for (var type in projectionUnitsByDefault) {
            if (projectionUnitsByDefault.hasOwnProperty(type)) {
                var found = false;
                for (var j = 0; j < projectionUnitsByDefault[type].length; j++) {
                    var obj = projectionUnitsByDefault[type][j];
                    for (var i = 0; i < units.length; i++) {
                        var unit = units[i];
                        if (obj.code === unit) {
                            found = true;
                            if (!this._projectionUnits[type]) {
                                this._projectionUnits[type] = [];
                            }
                            this._projectionUnits[type].push(obj);
                        }
                    }
                }
                if (!found) {
                    this._projectionUnits[type] = projectionUnitsByDefault[type];
                }
            }
        }
        if (typeof this._projectionUnits === 'object' && Object.keys(this._projectionUnits).length === 0) {
            this._projectionUnits = projectionUnitsByDefault;
        }
    };
    MousePosition.prototype._checkRightsManagement = function () {
        var rightManagement = RightManagement.check({
            key: this.options.apiKey,
            resources: ['SERVICE_CALCUL_ALTIMETRIQUE_RSC'],
            services: ['Elevation']
        });
        if (!rightManagement) {
            this._noRightManagement = true;
        }
        if (!this.options.apiKey) {
            this.options.apiKey = rightManagement.key;
        }
    };
    MousePosition.prototype._initContainer = function () {
        var container = this._createMainContainerElement();
        var inputShow = this._showMousePositionContainer = this._createShowMousePositionElement();
        container.appendChild(inputShow);
        var picto = this._createShowMousePositionPictoElement(this._isDesktop);
        container.appendChild(picto);
        var panel = this._createMousePositionPanelElement();
        var settings = this._createMousePositionSettingsElement();
        var systems = this._projectionSystemsContainer = this._createMousePositionSettingsSystemsElement(this._projectionSystems);
        var units = this._projectionUnitsContainer = this._createMousePositionSettingsUnitsElement(this._projectionUnits[this._currentProjectionType]);
        settings.appendChild(systems);
        settings.appendChild(units);
        panel.appendChild(settings);
        container.appendChild(panel);
        return container;
    };
    MousePosition.prototype._setElevationPanel = function (active) {
        var div = null;
        if (!active) {
            div = document.getElementById('GPmousePositionAltitude-' + this._uid);
            div.style.display = 'none';
        } else {
            if (this._noRightManagement) {
                div = document.getElementById('GPmousePositionAlt-' + this._uid);
                div.innerHTML = 'No rights!';
            } else {
                div = document.getElementById('GPmousePositionAltitude-' + this._uid);
                div.style.display = '';
            }
        }
    };
    MousePosition.prototype._setCoordinatesPanel = function (active) {
        var div = document.getElementById('GPmousePositionCoordinate-' + this._uid);
        if (!active) {
            div.style.display = 'none';
        } else {
            div.style.display = '';
        }
    };
    MousePosition.prototype._setSettingsPanel = function (active) {
        var divPicto = document.getElementById('GPshowMousePositionSettingsPicto-' + this._uid);
        var divPanel = document.getElementById('GPmousePositionSettings-' + this._uid);
        if (!active) {
            divPicto.style.display = 'none';
            divPanel.style.display = 'none';
        } else {
            divPicto.style.display = '';
            divPanel.style.display = '';
        }
    };
    MousePosition.prototype._setTypeUnitsPanel = function (type) {
        var container = this._projectionUnitsContainer;
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        var units = this._projectionUnits[type];
        for (var j = 0; j < units.length; j++) {
            var obj = units[j];
            var option = document.createElement('option');
            option.value = obj.code ? obj.code : j;
            option.text = obj.label || j;
            container.appendChild(option);
        }
        this._currentProjectionType = type;
        this._currentProjectionUnits = this._projectionUnits[type][0].code;
    };
    MousePosition.prototype._displayDEC = function (olCoordinate) {
        var coordinate = {};
        coordinate.lat = olCoordinate[1].toFixed(6);
        coordinate.lng = olCoordinate[0].toFixed(6);
        return coordinate;
    };
    MousePosition.prototype._displayDMS = function (olCoordinate) {
        var coordinate = {};
        var regex = /(.*)([NS])\s(.*)([EW])/;
        var subst = '$1$2 | $3$4';
        var str = ol.coordinate.toStringHDMS(olCoordinate, 2).replace(regex, subst);
        var coords = str.split('|');
        coordinate.lat = coords[0];
        coordinate.lng = coords[1];
        return coordinate;
    };
    MousePosition.prototype._displayRAD = function (olCoordinate) {
        var coordinate = {};
        var d = 0.017453292519943295;
        coordinate.lng = olCoordinate[0] * d;
        coordinate.lng = coordinate.lng.toFixed(8);
        coordinate.lat = olCoordinate[1] * d;
        coordinate.lat = coordinate.lat.toFixed(8);
        return coordinate;
    };
    MousePosition.prototype._displayGON = function (olCoordinate) {
        var coordinate = {};
        var d = 1.1111111111111112;
        coordinate.lng = olCoordinate[0] * d;
        coordinate.lng = coordinate.lng.toFixed(8);
        coordinate.lat = olCoordinate[1] * d;
        coordinate.lat = coordinate.lat.toFixed(8);
        return coordinate;
    };
    MousePosition.prototype._displayMeter = function (olCoordinate) {
        var coordinate = {};
        coordinate.x = olCoordinate[0].toFixed(2);
        coordinate.y = olCoordinate[1].toFixed(2);
        coordinate.unit = 'm';
        return coordinate;
    };
    MousePosition.prototype._displayKMeter = function (olCoordinate) {
        var coordinate = {};
        coordinate.x = (olCoordinate[0] / 1000).toFixed(2);
        coordinate.y = (olCoordinate[1] / 1000).toFixed(2);
        coordinate.unit = 'km';
        return coordinate;
    };
    MousePosition.prototype._setCoordinate = function (olCoordinate, crs) {
        var coordinate = {};
        var oSrs = this._currentProjectionSystems.crs;
        if (!oSrs) {
            console.log('ERROR : system crs not found');
            return;
        }
        olCoordinate = ol.proj.transform(olCoordinate, crs, oSrs);
        var type = this._currentProjectionSystems.type;
        var convert = null;
        var units = this._projectionUnits[type];
        for (var i = 0; i < units.length; i++) {
            if (units[i].code === this._currentProjectionUnits) {
                convert = units[i].convert;
                break;
            }
        }
        if (!convert || typeof convert !== 'function') {
            console.log('WARNING : coordinates format function not found');
            return;
        } else {
            coordinate = convert(olCoordinate);
        }
        if (!coordinate || Object.keys(coordinate).length === 0) {
            return;
        }
        this.GPdisplayCoords(coordinate);
    };
    MousePosition.prototype._setElevation = function (olCoordinate) {
        var delay = this.options.altitude.responseDelay;
        var noDataValue = this.options.altitude.noDataValue;
        var noDataValueTolerance = this.options.altitude.noDataValueTolerance;
        this.GPdisplayElevation(olCoordinate, delay, noDataValue, noDataValueTolerance);
    };
    MousePosition.prototype.onMoveStopped = function (olCoordinate, crs) {
        var oLatLng = ol.proj.transform(olCoordinate, crs, 'EPSG:4326');
        this._setElevation(oLatLng);
    };
    MousePosition.prototype.onMouseMove = function (e) {
        var self = this;
        var coordinate = e.coordinate;
        if (!e.map || !e.map.getView()) {
            return;
        }
        var crs = e.map.getView().getProjection();
        this._setCoordinate(coordinate, crs);
        clearTimeout(this._timer);
        this._timer = setTimeout(function () {
            self.onMoveStopped(coordinate, crs);
        }, this.options.altitude.triggerDelay);
    };
    MousePosition.prototype.onMapMove = function () {
        var self = this;
        var map = this.getMap();
        if (!map || !map.getView()) {
            return;
        }
        var view = map.getView();
        var coordinate = view.getCenter();
        var crs = view.getProjection();
        this._setCoordinate(coordinate, crs);
        clearTimeout(this._timer);
        this._timer = setTimeout(function () {
            self.onMoveStopped(coordinate, crs);
        }, this.options.altitude.triggerDelay);
    };
    MousePosition.prototype.onRequestAltitude = function (coordinate, callback) {
        if (!coordinate || Object.keys(coordinate).length === 0) {
            return;
        }
        if (!this.options.displayAltitude) {
            return;
        }
        if (this._noRightManagement) {
            console.log('[WARNING] contract key configuration has no rights to load geoportal elevation ');
            document.getElementById('GPmousePositionAlt-' + this._uid).innerHTML = 'No rights!';
            return;
        }
        var options = this.options.altitude.serviceOptions || {};
        options.zonly = true;
        options.positions = [{
                lon: coordinate[0],
                lat: coordinate[1]
            }];
        options.scope = this;
        if (!options.rawResponse) {
            options.onSuccess = function (results) {
                if (results && Object.keys(results)) {
                    callback.call(this, results.elevations[0].z);
                }
            };
        } else {
            options.onSuccess = function (results) {
                console.log('alti service raw response : ', results);
            };
        }
        options.onFailure = function (error) {
            console.log('[getAltitude] ERROR : ' + error.message);
        };
        options.apiKey = options.apiKey || this.options.apiKey;
        Gp.Services.getAltitude(options);
    };
    MousePosition.prototype.onShowMousePositionClick = function () {
        var map = this.getMap();
        this.collapsed = this._showMousePositionContainer.checked;
        this.dispatchEvent('change:collapsed');
        if (this._showMousePositionContainer.checked) {
            if (this._isDesktop) {
                map.un('pointermove', this.onMouseMove, this);
            } else {
                map.un('moveend', this.onMapMove, this);
            }
        } else {
            if (this._isDesktop) {
                map.on('pointermove', this.onMouseMove, this);
            } else {
                map.on('moveend', this.onMapMove, this);
                this.onMapMove();
            }
        }
        this._setElevationPanel(this.options.displayAltitude);
        this._setCoordinatesPanel(this.options.displayCoordinates);
        if (!this.options.displayCoordinates) {
            this._setSettingsPanel(false);
        }
    };
    MousePosition.prototype.onMousePositionProjectionSystemChange = function (e) {
        var idx = e.target.selectedIndex;
        var value = e.target.options[idx].value;
        this._setCurrentSystem(value);
    };
    MousePosition.prototype._setCurrentSystem = function (systemCode) {
        var type = null;
        for (var i = 0; i < this._projectionSystems.length; ++i) {
            if (this._projectionSystems[i].code == systemCode) {
                type = this._projectionSystems[i].type;
                break;
            }
        }
        if (!type) {
            return;
        }
        if (type !== this._currentProjectionType) {
            this._setTypeUnitsPanel(type);
        }
        this._currentProjectionSystems = this._projectionSystems[Number(systemCode)];
        if (!this._isDesktop) {
            this.onMapMove();
        }
    };
    MousePosition.prototype.onMousePositionProjectionSystemMouseOver = function (e) {
        var map = this.getMap();
        if (!map || !map.getView()) {
            return;
        }
        var view = map.getView();
        var crs = view.getProjection();
        var mapExtent = view.calculateExtent(map.getSize());
        mapExtent = ol.proj.transformExtent(mapExtent, crs, 'EPSG:4326');
        var systemList = document.getElementById(this._addUID('GPmousePositionProjectionSystem'));
        systemList.innerHTML = '';
        for (var j = 0; j < this._projectionSystems.length; j++) {
            var proj = this._projectionSystems[j];
            var option = null;
            if (proj.geoBBox) {
                if (mapExtent[0] > proj.geoBBox.right || mapExtent[1] > proj.geoBBox.top || mapExtent[2] < proj.geoBBox.left || mapExtent[3] < proj.geoBBox.bottom) {
                    if (proj === this._currentProjectionSystems) {
                        option = document.createElement('option');
                        option.value = proj.code;
                        option.text = proj.label || j;
                        option.setAttribute('selected', 'selected');
                        option.setAttribute('disabled', 'disabled');
                        systemList.appendChild(option);
                    }
                    continue;
                }
            }
            var optionElement = document.createElement('option');
            optionElement.value = proj.code;
            optionElement.text = proj.label || j;
            if (proj === this._currentProjectionSystems) {
                optionElement.setAttribute('selected', 'selected');
            }
            systemList.appendChild(optionElement);
        }
    };
    MousePosition.prototype.onMousePositionProjectionUnitsChange = function (e) {
        var idx = e.target.selectedIndex;
        var value = e.target.options[idx].value;
        this._currentProjectionUnits = value;
        if (!this._isDesktop) {
            this.onMapMove();
        }
    };
    return MousePosition;
}(ol, proj4, {}, gp, Ol3Utils, CommonUtilsCheckRightManagement, CommonUtilsSelectorID, CommonControlsMousePositionDOM);
Ol3ControlsUtilsInteractions = function (ol, woodman, Utils) {
    var Interactions = {
        _extensions: [
            'Measures',
            'ElevationPath',
            'Drawing'
        ],
        _options: {
            current: null,
            clean: null
        },
        unset: function (map, options) {
            var opts = {};
            Utils.mergeParams(opts, this._options);
            Utils.mergeParams(opts, options);
            var interactions = map.getInteractions().getArray();
            for (var i = 0; i < interactions.length; i++) {
                if (interactions[i].getActive() && interactions[i] instanceof ol.interaction.Draw) {
                    var prop = interactions[i].getProperties();
                    var name = prop.name;
                    if (typeof name !== 'undefined' && this._extensions.indexOf(name) > -1) {
                        if (opts.current && opts.current === name) {
                            continue;
                        }
                        interactions[i].setActive(false);
                        var source = prop.source;
                        if (typeof source !== 'undefined' && source instanceof ol.control.Control) {
                            for (var action in opts) {
                                if (opts.hasOwnProperty(action)) {
                                    if (action === 'current') {
                                        continue;
                                    }
                                    if (typeof source[action] === 'function') {
                                        var args = Array.isArray(opts[action]) ? opts[action] : [opts[action]];
                                        source[action].apply(source, args);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    };
    return Interactions;
}(ol, {}, Ol3Utils);
CommonControlsDrawingDOM = function () {
    var DrawingDOM = {
        _addUID: function (id) {
            var uid = this._uid ? id + '-' + this._uid : id;
            return uid;
        },
        _createMainContainerElement: function () {
            var container = document.createElement('div');
            container.id = this._addUID('GPdrawing');
            container.className = 'GPwidget';
            return container;
        },
        _createShowDrawingElement: function () {
            var input = document.createElement('input');
            input.id = this._addUID('GPshowDrawing');
            input.className = 'GPshowDrawing';
            input.type = 'checkbox';
            return input;
        },
        _createShowDrawingPictoElement: function () {
            var self = this;
            var label = document.createElement('label');
            label.id = this._addUID('GPshowDrawingPicto');
            label.className = 'GPshowAdvancedToolPicto';
            label.htmlFor = this._addUID('GPshowDrawing');
            label.title = this.options.labels.control;
            if (label.addEventListener) {
                label.addEventListener('click', function (e) {
                    self.onShowDrawingClick(e);
                });
            } else if (label.attachEvent) {
                label.attachEvent('onclick', function (e) {
                    self.onShowDrawingClick(e);
                });
            }
            var spanOpen = document.createElement('span');
            spanOpen.id = this._addUID('GPshowDrawingOpen');
            spanOpen.className = 'GPshowAdvancedToolOpen';
            label.appendChild(spanOpen);
            return label;
        },
        _createDrawingPanelElement: function () {
            var div = document.createElement('div');
            div.id = this._addUID('GPdrawingPanel');
            div.className = 'GPpanel';
            div.appendChild(this._createDrawingPanelHeaderElement());
            this.dtOptions = {};
            if (this.options.tools.points) {
                this.dtOptions.points = {
                    label: this.options.labels.points,
                    active: false,
                    panel: 'draw',
                    id: 'point'
                };
            }
            if (this.options.tools.lines) {
                this.dtOptions.lines = {
                    label: this.options.labels.lines,
                    active: false,
                    panel: 'draw',
                    id: 'line'
                };
            }
            if (this.options.tools.polygons) {
                this.dtOptions.polygons = {
                    label: this.options.labels.polygons,
                    active: false,
                    panel: 'draw',
                    id: 'polygon'
                };
            }
            if (this.options.tools.text) {
                this.dtOptions.text = {
                    label: this.options.labels.text,
                    active: false,
                    panel: 'draw',
                    id: 'text'
                };
            }
            if (this.options.tools.edit) {
                this.dtOptions.edit = {
                    label: this.options.labels.edit,
                    active: false,
                    panel: 'edit',
                    id: 'edit'
                };
            }
            if (this.options.tools.display) {
                this.dtOptions.display = {
                    label: this.options.labels.display,
                    active: false,
                    panel: 'edit',
                    id: 'display'
                };
            }
            if (this.options.tools.tooltip) {
                this.dtOptions.tooltip = {
                    label: this.options.labels.tooltip,
                    active: false,
                    panel: 'edit',
                    id: 'tooltip'
                };
            }
            if (this.options.tools.remove) {
                this.dtOptions.remove = {
                    label: this.options.labels.remove,
                    active: false,
                    panel: 'edit',
                    id: 'remove'
                };
            }
            if (this.dtOptions.points || this.dtOptions.lines || this.dtOptions.polygons || this.dtOptions.text) {
                div.appendChild(this._createDrawingToolSection(this.options.labels.creatingTools, 'draw'));
            }
            if (this.dtOptions.edit || this.dtOptions.display || this.dtOptions.tooltip || this.dtOptions.remove) {
                div.appendChild(this._createDrawingToolSection(this.options.labels.editingTools, 'edit'));
            }
            if (this.options.tools.export) {
                div.appendChild(this._createSavingSection(this.options.labels.export, this.options.labels.exportTitle));
            }
            return div;
        },
        _createDrawingPanelHeaderElement: function () {
            var container = document.createElement('div');
            container.className = 'GPpanelHeader';
            var divTitle = document.createElement('div');
            divTitle.className = 'GPpanelTitle';
            divTitle.innerHTML = this.options.controlLabel || 'Annoter la carte';
            container.appendChild(divTitle);
            var divClose = document.createElement('div');
            divClose.id = this._addUID('GPdrawingPanelClose');
            divClose.className = 'GPpanelClose';
            divClose.title = 'Fermer le panneau';
            var dtObj = this;
            if (divClose.addEventListener) {
                divClose.addEventListener('click', function () {
                    document.getElementById(dtObj._addUID('GPshowDrawingPicto')).click();
                }, false);
            } else if (divClose.attachEvent) {
                divClose.attachEvent('onclick', function () {
                    document.getElementById(dtObj._addUID('GPshowDrawingPicto')).click();
                });
            }
            container.appendChild(divClose);
            return container;
        },
        _createDrawingToolSection: function (sectionLabel, panelType) {
            var container = document.createElement('div');
            container.className = 'drawing-tool-section';
            var p = document.createElement('p');
            p.className = 'drawing-tool-section-title';
            p.innerHTML = sectionLabel;
            container.appendChild(p);
            var ul = document.createElement('ul');
            ul.className = 'drawing-tools-flex-display';
            var context = this;
            function liClickHandler(e) {
                context._handleDOMToolClick(e, this.id, context);
                context._handleToolClick(e, this.id, context);
            }
            for (var type in this.dtOptions) {
                if (this.dtOptions[type].panel != panelType) {
                    continue;
                }
                var li = document.createElement('li');
                li.className = 'drawing-tool';
                li.id = this._addUID('drawing-tool-' + this.dtOptions[type].id);
                li.title = this.dtOptions[type].label;
                li.addEventListener('click', liClickHandler);
                ul.appendChild(li);
            }
            container.appendChild(ul);
            return container;
        },
        _createSavingSection: function (buttonLabel, buttonTitle) {
            var container = document.createElement('div');
            container.className = 'drawing-tool-section drawing-tools-flex-display';
            var button = document.createElement('button');
            button.title = buttonTitle;
            button.className = 'tool-form-submit drawing-button';
            button.id = this._addUID('drawing-export');
            button.type = 'button';
            button.textContent = buttonLabel;
            var context = this;
            button.onclick = function () {
                context.onExportFeatureClick();
            };
            container.appendChild(button);
            return container;
        },
        rgbaToHex: function (rgba) {
            function hex(number) {
                if (number > 255) {
                    throw '\'' + number + '\'\' is greater than 255(0xff);';
                }
                var str = Number(number).toString(16);
                return ('0' + str).slice(-2);
            }
            var regex = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(0?.?\d+)\s*)?\)/;
            var parsed = regex.exec(rgba);
            if (!parsed) {
                throw 'Invalid format: ' + rgba;
            }
            var red = parsed[1];
            var green = parsed[2];
            var blue = parsed[3];
            var alpha = parsed[4];
            var elems = [
                hex(red),
                hex(green),
                hex(blue)
            ];
            var result = {};
            result.hex = '#' + elems.join('');
            if (alpha) {
                result.opacity = parseFloat(alpha);
            }
            return result;
        },
        hexToRgba: function (hex, opacity) {
            var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, function (m, r, g, b) {
                return r + r + g + g + b + b;
            });
            var rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            rgb = rgb ? {
                r: parseInt(rgb[1], 16),
                g: parseInt(rgb[2], 16),
                b: parseInt(rgb[3], 16)
            } : null;
            var result = rgb ? 'rgba(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ', ' + opacity + ')' : null;
            return result;
        },
        _createMarkersChooser: function (options) {
            var li = document.createElement('li');
            li.className = options.className;
            for (var i = 0; i < this.options.markersList.length; i++) {
                var inputElem = document.createElement('input');
                inputElem.type = 'radio';
                inputElem.name = 'marker';
                inputElem.id = this._addUID('marker-' + i);
                inputElem.value = this.options.markersList[i].src;
                inputElem.className = 'marker-input-radio';
                if (options.defaultValue == inputElem.value) {
                    inputElem.checked = true;
                }
                li.appendChild(inputElem);
                var labelElem = document.createElement('label');
                labelElem.className = 'marker-label';
                labelElem.setAttribute('for', inputElem.id);
                var imgElem = document.createElement('img');
                imgElem.src = inputElem.value;
                labelElem.appendChild(imgElem);
                li.appendChild(labelElem);
            }
            return li;
        },
        _createStylingElement: function (options) {
            var li = document.createElement('li');
            li.className = options.className;
            var textNode = document.createTextNode(options.label);
            li.appendChild(textNode);
            var inputElem = document.createElement('input');
            try {
                inputElem.type = options.type;
            } catch (e) {
                inputElem.type = 'text';
            }
            inputElem.id = options.id;
            inputElem.value = options.defaultValue;
            if (options.title) {
                inputElem.title = options.title;
            }
            if (options.min !== undefined) {
                inputElem.min = options.min;
            }
            if (options.max !== undefined) {
                inputElem.max = options.max;
            }
            if (options.step !== undefined) {
                inputElem.step = options.step;
            }
            li.appendChild(inputElem);
            return li;
        },
        _createStylingDiv: function (options) {
            var div = document.createElement('div');
            div.className = 'gp-styling-div';
            var ul = document.createElement('ul');
            var li = null;
            switch (options.geomType.toLowerCase()) {
            case 'point':
                li = this._createMarkersChooser({
                    className: 'gp-styling-option',
                    defaultValue: options.initValues.markerSrc
                });
                ul.appendChild(li);
                break;
            case 'text':
                li = this._createStylingElement({
                    type: 'color',
                    className: 'gp-styling-option',
                    label: this.options.labels.fillColor,
                    id: this._addUID('fillColor'),
                    defaultValue: options.initValues.fillColor
                });
                ul.appendChild(li);
                li = this._createStylingElement({
                    type: 'color',
                    className: 'gp-styling-option',
                    label: this.options.labels.strokeColor,
                    id: this._addUID('strokeColor'),
                    defaultValue: options.initValues.strokeColor
                });
                ul.appendChild(li);
                break;
            case 'line':
                li = this._createStylingElement({
                    type: 'color',
                    className: 'gp-styling-option',
                    label: this.options.labels.strokeColor,
                    id: this._addUID('strokeColor'),
                    defaultValue: options.initValues.strokeColor
                });
                ul.appendChild(li);
                li = this._createStylingElement({
                    type: 'range',
                    className: 'gp-styling-option',
                    label: this.options.labels.strokeWidth,
                    title: '1 à 10 pixels',
                    id: this._addUID('strokeWidth'),
                    min: 1,
                    max: 10,
                    step: 1,
                    defaultValue: options.initValues.strokeWidth
                });
                ul.appendChild(li);
                break;
            case 'polygon':
                li = this._createStylingElement({
                    type: 'color',
                    className: 'gp-styling-option',
                    label: this.options.labels.strokeColor,
                    id: this._addUID('strokeColor'),
                    defaultValue: options.initValues.strokeColor
                });
                ul.appendChild(li);
                li = this._createStylingElement({
                    type: 'range',
                    className: 'gp-styling-option',
                    label: this.options.labels.strokeWidth,
                    title: '1 à 10 pixels',
                    id: this._addUID('strokeWidth'),
                    min: 1,
                    max: 10,
                    step: 1,
                    defaultValue: options.initValues.strokeWidth
                });
                ul.appendChild(li);
                li = this._createStylingElement({
                    type: 'color',
                    className: 'gp-styling-option',
                    label: this.options.labels.fillColor,
                    id: this._addUID('fillColor'),
                    defaultValue: options.initValues.fillColor
                });
                ul.appendChild(li);
                li = this._createStylingElement({
                    type: 'range',
                    className: 'gp-styling-option',
                    label: this.options.labels.fillOpacity,
                    title: '0 (transparent) à 100% (opaque)',
                    id: this._addUID('fillOpacity'),
                    min: 0,
                    max: 10,
                    step: 1,
                    defaultValue: options.initValues.fillOpacity * 10
                });
                ul.appendChild(li);
                break;
            default:
                console.log('Unhandled geometry type for styling.');
            }
            div.appendChild(ul);
            var applyButton = document.createElement('input');
            applyButton.type = 'button';
            applyButton.className = 'gp-styling-button';
            applyButton.value = this.options.labels.applyToObject;
            applyButton.onclick = function () {
                options.applyFunc.call(this, 'apply');
            };
            div.appendChild(applyButton);
            var setDefaultButton = document.createElement('input');
            setDefaultButton.type = 'button';
            setDefaultButton.value = this.options.labels.setAsDefault;
            setDefaultButton.className = 'gp-styling-button';
            setDefaultButton.onclick = function () {
                options.applyFunc.call(this, 'default');
            };
            div.appendChild(setDefaultButton);
            var cancelButton = document.createElement('input');
            cancelButton.type = 'button';
            cancelButton.className = 'gp-styling-button closer';
            cancelButton.onclick = function () {
                options.applyFunc.call(this, 'cancel');
            };
            div.appendChild(cancelButton);
            return div;
        },
        _createLabelDiv: function (options) {
            var popup = document.createElement('div');
            popup.className = 'gp-label-div';
            var inputLabel = null;
            if (options.geomType == 'Text') {
                inputLabel = document.createElement('input');
                inputLabel.type = 'text';
                inputLabel.className = 'gp-input-label-style';
            } else {
                inputLabel = document.createElement('textArea');
                inputLabel.rows = 2;
                inputLabel.cols = 40;
                inputLabel.className = 'gp-textarea-att-label-style';
            }
            if (options.text) {
                inputLabel.value = options.text;
            }
            inputLabel.autocomplete = 'off';
            inputLabel.placeholder = options.placeholder;
            inputLabel.id = options.inputId;
            popup.appendChild(inputLabel);
            inputLabel.onblur = function () {
                options.applyFunc.call(this, inputLabel.value, true);
            };
            inputLabel.onkeyup = function (evtk) {
                if (options.geomType == 'Text' && evtk.keyCode == 13) {
                    options.applyFunc.call(this, inputLabel.value, true);
                }
                if (evtk.keyCode == 27) {
                    options.applyFunc.call(this, inputLabel.value, false);
                }
            };
            if (options.geomType != 'Text') {
                var applyButton = document.createElement('input');
                applyButton.type = 'button';
                applyButton.className = 'gp-styling-button';
                applyButton.value = this.options.labels.saveDescription;
                applyButton.onclick = function () {
                    options.applyFunc.call(this, inputLabel.value, true);
                };
                popup.appendChild(applyButton);
                var cancelButton = document.createElement('input');
                cancelButton.type = 'button';
                cancelButton.className = 'gp-styling-button closer';
                cancelButton.onclick = function () {
                    options.applyFunc.call(this, inputLabel.value, false);
                };
                popup.appendChild(cancelButton);
            }
            return popup;
        },
        _handleDOMToolClick: function (e, toolId, context) {
            for (var availType in context.dtOptions) {
                var availToolId = context._addUID('drawing-tool-' + context.dtOptions[availType].id);
                var li = document.getElementById(availToolId);
                if (availToolId != toolId) {
                    li.className = 'drawing-tool';
                    context.dtOptions[availType].active = false;
                    continue;
                }
                if (context.dtOptions[availType].active) {
                    li.className = 'drawing-tool';
                } else {
                    li.className = 'drawing-tool drawing-tool-active';
                }
                context.dtOptions[availType].active = !context.dtOptions[availType].active;
            }
        }
    };
    return DrawingDOM;
}();
Ol3ControlsDrawing = function (woodman, ol, Gp, SelectorID, Interactions, DrawingDOM, Utils, KMLExtended) {
    function Drawing(options) {
        options = options || {};
        if (!(this instanceof Drawing)) {
            throw new TypeError('ERROR CLASS_CONSTRUCTOR');
        }
        this._initialize(options);
        var container = this._initContainer();
        ol.control.Control.call(this, {
            element: container,
            target: options.target,
            render: options.render
        });
    }
    ol.inherits(Drawing, ol.control.Control);
    Drawing.DefaultTools = {
        points: true,
        lines: true,
        polygons: true,
        text: true,
        remove: true,
        display: true,
        tooltip: true,
        edit: true,
        export: true
    };
    Drawing.DefaultLabels = {
        control: 'Annoter la carte',
        creatingTools: 'Outils de création',
        points: 'Placer des points',
        lines: 'Dessiner des lignes',
        polygons: 'Dessiner des polygones',
        text: 'Ecrire sur la carte',
        editingTools: 'Outils d\'édition',
        edit: 'Editer les tracés',
        display: 'Modifier l\'apparence des objets',
        tooltip: 'Modifier les textes / infos-bulles',
        remove: 'Supprimer des objets',
        export: 'Exporter',
        exportTitle: 'Exporter en KML',
        applyToObject: 'Appliquer à l\'objet',
        saveDescription: 'Enregistrer',
        setAsDefault: 'Définir par défaut',
        strokeColor: 'Couleur du trait : ',
        strokeWidth: 'Epaisseur du trait : ',
        fillColor: 'Couleur de remplissage : ',
        fillOpacity: 'Opacité du remplissage : '
    };
    Drawing.DefaultStyles = {
        textFillColor: '#000000',
        textStrokeColor: '#FFFFFF',
        textIcon1x1: {
            src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNiYAAAAAkAAxkR2eQAAAAASUVORK5CYII=',
            anchor: [
                0,
                0
            ]
        },
        polyFillColor: '#ffffff',
        polyFillOpacity: 0.4,
        polyStrokeColor: '#ffcc33',
        polyStrokeWidth: 4,
        strokeColor: '#ffcc33',
        strokeWidth: 4
    };
    Drawing.DefaultCursorStyle = {
        radius: 6,
        strokeColor: '#FFF',
        strokeWidth: 1,
        fillColor: 'rgba(0, 153, 255, 1)'
    };
    Drawing.prototype = Object.create(ol.control.Control.prototype, {});
    Drawing.prototype.assign = function (source) {
        for (var prop in source) {
            if (source.hasOwnProperty(prop)) {
                this[prop] = source[prop];
            }
        }
    };
    Drawing.prototype.assign(DrawingDOM);
    Drawing.prototype.constructor = Drawing;
    Drawing.prototype.setMap = function (map) {
        ol.control.Control.prototype.setMap.call(this, map);
        if (this.getMap() && this.eventKey) {
            ol.Observable.unByKey(this.eventKey);
        }
        if (map == null) {
            return;
        }
        if (!this.collapsed) {
            var inputShow = document.getElementById(this._addUID('GPshowDrawing'));
            inputShow.checked = 'checked';
        }
        if (this.layer) {
            this.setLayer(this.layer);
        }
        this.eventKey = this.getMap().getLayers().on('remove', function (evtRm) {
            if (evtRm.element == this.layer) {
                this.layer = null;
                if (this.interaction) {
                    this.getMap().removeInteraction(this.interaction);
                    this.interaction = null;
                }
            }
        }, this);
    };
    Drawing.prototype.exportFeatures = function () {
        var result = null;
        if (ol.control.Control.prototype.getMap.call(this) == null) {
            console.log('Impossible to export : control isn\'t attached to any map.');
            return result;
        }
        if (!this.layer) {
            console.log('Impossible to export : no layer is hosting features.');
            return result;
        }
        if (!this.layer.getSource() || !this.layer.getSource().getFeatures()) {
            console.log('Impossible to export : no features found.');
            return result;
        }
        var featProj = this.layer.getSource().getProjection();
        featProj = featProj || this.getMap().getView().getProjection();
        var kmlFormat = new KMLExtended({ writeStyles: true });
        result = kmlFormat.writeFeatures(this.layer.getSource().getFeatures(), {
            dataProjection: 'EPSG:4326',
            featureProjection: featProj
        });
        return result;
    };
    Drawing.prototype.setCollapsed = function (collapsed) {
        if (collapsed === undefined) {
            console.log('[ERROR] Drawing:setCollapsed - missing collapsed parameter');
            return;
        }
        if (collapsed && this.collapsed || !collapsed && !this.collapsed) {
            return;
        }
        this.onShowDrawingClick();
        this._showDrawingContainer.checked = !collapsed;
    };
    Drawing.prototype.setExportName = function (name) {
        this._exportName = name;
    };
    Drawing.prototype.getExportName = function () {
        return this._exportName;
    };
    Drawing.prototype._getsMarkersOptionsFromSrc = function (src) {
        var markerOptions = null;
        for (var i = 0; i < this.options.markersList.length; i++) {
            if (this.options.markersList[i].src == src) {
                markerOptions = this.options.markersList[i];
                return markerOptions;
            }
        }
        return markerOptions;
    };
    Drawing.prototype._getIconStyleOptions = function (markerElement) {
        var iconOptions = {};
        Object.keys(markerElement).forEach(function (key) {
            switch (key) {
            case 'src':
            case 'size':
            case 'anchor':
            case 'anchorOrigin':
            case 'anchorXUnits':
            case 'anchorYUnits':
                iconOptions[key] = markerElement[key];
                break;
            }
        }, this);
        return iconOptions;
    };
    Drawing.prototype._initialize = function (options) {
        this._uid = SelectorID.generate();
        this._exportName = 'Croquis';
        this._exportFormat = '.kml';
        this.options = options || {};
        if (!this.options.tools) {
            this.options.tools = {};
        }
        Object.keys(Drawing.DefaultTools).forEach(function (key) {
            if (!this.options.tools.hasOwnProperty(key)) {
                this.options.tools[key] = Drawing.DefaultTools[key];
            }
        }, this);
        if (!this.options.cursorStyle) {
            this.options.cursorStyle = {};
        }
        Object.keys(Drawing.DefaultCursorStyle).forEach(function (key) {
            if (!this.options.cursorStyle.hasOwnProperty(key)) {
                this.options.cursorStyle[key] = Drawing.DefaultCursorStyle[key];
            }
        }, this);
        this.options.collapsed = options.collapsed !== undefined ? options.collapsed : true;
        this.collapsed = this.options.collapsed;
        this.options.markersList = options.markersList || [
            {
                src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAmCAYAAABpuqMCAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAARfSURBVFiF3ZhfbBRVGMV/d2Z3212tbSkCbuNaqzaRiL6QyAMPjSFoYqgx4oOiRmMFUzQG479o2lQ0QXk1EhYFgmlD2mIRkYhRwqLEaA2GiKWV7rZLQ0sLwbZId7t/Zq4PFK1125m5s/vCedz7nXO+M9/N3jsD1xFEvgXlTkrI8hBQBywFbgEqgEvAMHAayZcYHBYbuZJP77yFkdsoR+ct4GXAb4OSQPARXj4QzzGejx7yEkZuZy2CMLBAgf4nkhfEi3S67UNzQ5YSIXfQhKAdtSAACxDsk2EapXT3cF2FYQdNSN7F/YQFsJkw77gVUcL01mp3o5EDJoK1Yj37VchKjcjdlJEmhvrWmg9jGNwhGhhzSlTbZmnepjBBAMrReF2F6Hgy0+fIKPb+flWRIMtip+eQ88lcPRCtg3gCCVZ3RqhPDbJepqlPDbJ6XwSvP2nDJYCXB522prLN6iwrPIEETw33U/VoLZovBPjQfCGqHqtl3XDUZiBrn1lQCXO3ZcUDLV34Su/JueYrW0btnp8tNSRLnTamEiZoWRF6uHre9dseuT0vPrOgEqbCWtW3xNX6VSy02c+/sk4JwF+WFWZ6xGL9vA2fyzb7+QcqYUYtKwYP9s+7PrA/bsNn/geSA87DSLosa44+fT/p8VM511Jjp4g8u8KGk7XPLKhM5qhlRSbppzV4JwMdEcz0WSCNmT5LrC1CS/AujKliSw1BxGljzm8AH3MjHs4BpU65DjCBn0rxDJNOSI4nM33F2O2U58yEnU6DgOpF02AzcEGJa40LZHlfhagUZvp6vkmFawObVK7/4PLFSoZpBZ50ozEThsne6i2hjZqmFRVJ6U8JUeSVUmQNzQvg0c1MVtNMIUTSl0pNLhsaGu8A4xrfbZhS4CRQ5SoFcCWtja/5NBg+N+GZsu0vhSEkcY8mf+iNx+OuX3llmJVABNCVNUA2fl3xWdvJkriqRBb2uPugAYgNHEey1Y3Gt3/ccNxFEAChm2al6zAAjNAEWF/rc1Ev6+ffOLTwmBt7E0xD02J5CSOayQLrsHMJnYGMITJvHrr588mUMKyr54CUaaHrnfF4fCQ/kwHEBmLAa044rb+WHP4xXnxJ0VJK6CkyjO2xWOx3KMSH8zDtwONWdb2jvt41u4JtChZJKeVveDwnYrHYfw5uj4KYFRpSWbGqyCPL5ypIpMTkKwcWfWVXUEqRRcio1LTuUCjUE4lEsrnq8j4ZgKEP9bpgmfHFHPpyy3fle3f9Uto3n4aUIqNhDghN6zZ1vTcajaasfAsSBmBwq7f11tLM/24Hx2L+n+rbF38zBy2JEP0anPEGAj3d3d1pJ56F2GYAGInM82M+bWW53wxd++3ipH7x1QMLj8ysk5BAyj6Ppp2+d/nyaEdHh/I/W8EmA3Ci2b/iviVT3+tCerMmxkudiz450hcYBSYQIqrDmScGBvqawSxkH3lDV2Pxe6ltItnWcFNLTXX1qpqamkoK/BCvC/wNB+l5MdQKNHsAAAAASUVORK5CYII=',
                anchor: [
                    0.5,
                    1
                ]
            },
            {
                src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAmCAYAAABpuqMCAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAS7SURBVFiF3VhNTFxVFP7OfTNvOjMtM9AoJSSYEEVMCv6kJi5NoCa1TRqNxDTaFhcWNSmxaaxNQ0w3mqgLdGeRhKFYXVC7qDU2BhVt/YdqEQRhRgYTKD8VZqAMzM+7xwVCcIR58+6b2fRb3nO+853v3fvuu+8CtxEo1wX5pTu2IpasBfEeSFSCUAygCMAsgEkAQyD6DClXF3VMLeZSO2dmuN7vB+MYiBsAbDEn8BIIZ6BrzdQyF81FDzkxw8/594P5HQCFCvQ5QDRSYO4Tu30IO2QGiA/5XgVzAGpGsMKTZ/mw7wTbfLi2yFzvOwngpJ0aaXidAtG3VcnKZv5dWgE7Nf5fFBJCHqK2hUsqdKVG+EihDwn5K9SXViZEAHqAApGIVaLaO5Pg48iPEQDwg2WjCtHyzKx8RxJBZLP9qoJ5CdJ9t9XvkPWZiSVrkY0R3b2MxnM9aJ2Ooi3iRut0FEc/6IHuiZtyidwQ8RqrrVk3Q7zHNEd3L6N5eAYP7q2BppcB0KHpZXhoXw2aB6eyM8SPW23NuhnGvaY5L7T2w7Nt54Yxj68KDS19WSiZ66RBZQPYYZpRvfuejPH7H8scX0FJlv2sQcVMkWmGpmc2bBbPVicNKsvslmmOkZg0id/IQmkhy47WoLABYNo05/rnIxnjv1wOmtbgLHTSoDIz10xzzhypQiz624axWLQPLQ3V5kLUa7U1la35G9OcRMyFY/cV49qlLhiJMQAJGIkx9FzswsuVO5BccpnryKuWW7NK4IPFXmjLgwAKrHItYB66t5JaJmJWSJZnhjqmFiFxzirPIjqsGgFUD5qC3gRjRolrBsYMQEr/NEpmKBCJgHBKhWteHKdUjv8rVBvgw773QaizU2M9DMb58q98rwghXC5md5zI5WSmlCGcAODQZDIlhCSiJT0eX6waH490AsYq356ZZ4oK4DSuAihT4UuGYIaQILGQ4vknen2BibhYzlqfySBG2CH4ylA4HLb9y8v1BY8A9CkAzVwcZDA0BgkG0+oFBjP49Ij3o48n9b9U20gB7bZuZwCAAvM/gPndTDmSIZKS9CRDNwCHBIv1NzFdfzu/t2EEAEiTstS2GQDA2PwbAHrSh9ebSDewihtxMdn0h/dbO/ISkIYQoZyYoW6kYOD59YdQg8mRYjgleFONpKRk07D34qJBxmY5pmBOkKZdCIfDk7mZGQDUER0FUROwaoQdZpd6H07oXT/OOWYVJZmBQZdhvBcKhfqBfFyc1xcEEpKeNjMytOgYfqp32wUFiSVm7oPD0RsKhf5zsnYoFMsMyccTUtvtFHL7ZimxFC2eGPJezrYkM6VAHGQhBsrKyga7u7tTG+XlfGYAIFxXuLfEzZ288fvCb4U858+Ou0KZajBTUkCOkhADUtOGgsGg6SVIXswAQKiuqK3UbRxIH78yq//8Yr/3i01oSyD6UwDDTo9ncGBgIGFFM29mRh/FFm+J/3qBk+9aHbsZFzf39WwN3DK0tWXCQAzMIw4hfq/etSvY2dmpvLPlzQwA/PTk9od3eowvhWCnZEodHfC2fz3rnAEQBVFQA4YPjI6OnAZkPvvIGb7bX/Ta/LP+SEftne0V5eW1FRUVpcjzQ7wt8A+9at5zXMB2DQAAAABJRU5ErkJggg==',
                anchor: [
                    0.5,
                    1
                ]
            },
            {
                src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAmCAYAAABpuqMCAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAP0SURBVFiF3ZnLbxtVFIe/e8eOPU5DapI2whEWyiILJGDTBQuWSGTTSkVlQRGs2MGSh4RoQWLB4x/gpVIViNokJUV0U4RQXKgQr0ookCYkdjONSJtQJTGltjO2Zw6LJlEbkszLTgQ/6Ww859xzPt97556Zgf+RVKMHFGgD+oADwP3APUAHsABcBS4BXwDnFNxsdP6GSCAt8LZAWUB8WEngLYHdO137HRI4JLDgE2K9LQg8vtMMCCiBowJuSJBVcwWOSBOWfRCY1yJCrLdXdwrkUANmZL05Age3G2R3hD3iZYsC6TB16ZA8rwB3h4z1Uhp4MUxg4A23co7MA2aYhD5VBrqCnkNhZqYPPyCpVJnh4Ry2PYNIFdue4fTpHKZZ8ZEjBTwWorZgEvjEc92nUiUpFn+VjbS0NCqm6edgPbEdMD97FjI8PLIhyKoGB0d8wPy0HTBXPQux7Stbwti25QNmNmhtYW4ANtCytZNUPXxslEp4pKoq8PK5Q2FuAH97elSrcx7Xr/nIc8NnPWsKAzPv6XH27OUtr585Y/nIs/Uf0ggJHPdc76ZZlqWl0Q33y+LiqCSTFR975th2wDzjqy0xzbIMDo6IbVsiYottW3Lq1IhPEBF4ejtgdgkUm9SXrVpRoDVobYH3zEqLcTxoXEAdU1Bqco5bkluPyPNNmpV5Cdk1RwE63CSYw2FrivSYKtBPhOTr5cDJnmz2Oa11IiFi2kol4iKq7ug4QMxwa3WtXaVUpcW2Sw/MzhaHwFmNjwrTDvwC3BeJAripdXF/JvP+H7HYsu/8ohwlWDEt305YlhX5BYLAI0AOMCKMIUc6Oj4eaGuzwg5RhxNhnzTXpOAC8E6UMb5qbb0QAQRAGa7bHRlmRUeBH8IEzhnGtZc6O89HSe6C62hdaAiMgjrwFH6a0NtUU6r28p49n5WUcry9N5FIVRnGsGVZc42aGRQUgBeCxPS3tZ37LplcCJlSBMYTjvNeoVD4baWGxkpgEHjCy2+ipWVifyYzECJFRURGicUuFgqFP2+/0AyYTlupyYTIpqd4WanSwe7udy/HYr5aFhFVR0letB7LZrPjuVyuvpFfU97tzhrGgYzjfL7J+PJmOn3yo/b2qa3GEFE1jTuttB5zDWMin8/bXnmb9qJ6Jh7vv7dW+1d3cN40v3+2q+vLTcIqKHVZw2Q8lRofGxurBsnZNJhpSLZr/XvadbOrv103jOt9mcwHNwxjbZkIlBGZiml96cF9+/JDQ0Oh72xN/YRw0TQffmh5+RtDJF4H5/m9ez/8OpWaB/5CqbwBk09OT0+9Dm4z62iYfkwm37CVqgzsuuvT3p6eR3t7e7vZye8w/xX9A0ynxee2hlfFAAAAAElFTkSuQmCC',
                anchor: [
                    0.5,
                    1
                ]
            },
            {
                src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAmCAYAAABpuqMCAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAASKSURBVFiF3ZhdbBRVHMV/9+5uPwikFExEiCtWbSKCCEsCiU1EJIEXeMIHxZgYPzBUYzB+RUPlwwTl1UhYFIiGhrQVFCMRAoQFidGaEgIuVLrbLgSkhWBb2N3uzs7M3weBILadnZndF87j3P8553/m3ty5c+Eugiq1oDy5dRw5czGKpQjTgPuAicBV4C+E02j5gSFrn4o3pkvpXbIwMmNTLaHAByjeBKqLoGRBfY4V+lSdeGmgFD2UJIzM2bwMUVFgggf634i8qo6/vttvH9oPWRAlkS1NiGrFWxCACSj1rUSiqwXx9XJ9hWH2liaQtfifYQWsIxL9yK+IJ9xYWq1+NIaBjahl6vhr33khe2pEntg+noCRxPvSGg39GNZD6tTKfrdEb8ssaHxIeYIA1FKh3/VCdD0zN74jfRS3/XpFlpx5r9vvUNC1Tc5cTDFBqoJZ1i9opyFcR0hPomD3cvR8N02H55IvOPHHUB1aBOxy05r7ZaZY6lhTFcyy74Vunp46n5AOAxWEdJhnps5n//IElaEhRw0pwucOuA8jPOpYs35BO2Mrpg87NrZiBmvn/+aooWSa29a8bACTHSsawnWjjj/1wIOOGlKEzx3wEmaiY0VIT/I1/i/uKbKfW/AS5rpjRcHudRi/VITPtSL7uQUvYfocK46e7x51PNaTKsJn9BcyDDyEkXbHkqbDc0kbp4Ydu54/xcexec42OPvcAS9b82HHmnyhmkXND3OwJ0bBPgcYFOxzHEjGWLTjEQyryrkzFXPfmkvIY1+MpSp4Aahxy3WBQQrVU9TJFzNuSK5nRsUb0yi2u+W5dNnqNgh4PWjmrXXAZU9cZ1zGMD/xQvQU5sbxfJUXbhFY5eX4Dz5/rCQSbQae96NxOyzsnXVXNjRqrSsrRarzSlWGRJRp6RBAMGAXTK1tpdRQRT6fmXHx4kAbWDf5fsPUACeAqb5SAGkxBpYMfBW9YA/mivYXZSkhFdTyc2cqlfL9yyuRaAMQAwKeNUBWZ376piV3IuVVwoSv/V1oAKpjxTGQjX40Dhh/HvMRBEAFbHuK7zAAjOttApyP9cOg17526b303iN+7G2wLa2TJQmjYmtMYDnFHEJvQwGr8H5m766M5C3n6hEgYqhAYHcqleotzcwAqmNFEuEdN5zm3PF9vxipqx4tReBMpWVtTiaTf0A5Ls4j0VbgWae6TrOvc8ngthYPFkMicpJgsCOZTP7nw+3+QsMZK/NiLqxUwdqRCrJ2PvNWes+PxQqKKBMlCdE6Hg6Hz8RiMXO4upLPDMDFWZ8tnazHfz+CvmzIHNy5Lfd712gaIqqgsXuU1nE7EOhMJBJ5J9+yhAE4P2tj8/265n+ngyNG8tdXrrfuH4E2hFLdGs6Gxow5E4/HDTee5VhmAFj92Zf7J1Q01Krq8M1nV+zMlbfTew7dXieQRaQrqPXpx+fMSbS1tXne2co2MwAds9fMm6kmHQ2gQia29ca13V8eKnT1AYMolQjA2ed6errWgF3OPkqG9pmr1+cjm4ZapjfuqK+rW1hfXz+FMr/EuwL/AGOdsbn1H7gQAAAAAElFTkSuQmCC',
                anchor: [
                    0.5,
                    1
                ]
            },
            {
                src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAmCAYAAABpuqMCAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAATNSURBVFiF3VhZTFxlFP7Of+8Mi12Eot2Sia36IIJCIWmT0lhSK30wfaoaNcampBhrfGhSl5hIW9HE5VFTpWilNpUI0hrTh1YwjJSkthFEcABhBoZ0YekCFGa72/FBSLAF7jY86Pc453znO9/9//nvuT/wPwIlu2DLns1Lo3J8hwDtZHA2gNUAVgC4SYRrzNxFJH6UpNjZ4iOBqWRqJ83MmVdzM7y6520CvQ4gzQIlSoxPJVX/sLi6fTwZPSTFTOMrhbuYuRJApgP6LRDv3V7ZdsptH8INmQH6aW9BOTPXwpkRAMgE0/eNZQXvssuHK7khF5VtOEhEh+F+hQlAcX/hGu1E61CzmyKOML21at3UmAMGM+96qqrttBOyo0aadufdq3mlEJxvrXlBwFhcUh58+vPOMbtcR/8ZzSu/g0UwAgAMZHgN7xtOuLZXpmXP5qUxOT4Ca8evU0RlOb7S7ntItq8S30EWjEje1GhOacWlrNyi9SR5VrGuDo92NPd3HSvfqCsJM366pqaVAKi305vtbSZAO81yJG9qdMsnZ/vvyyveSpLHB8BLkse3Mn/b1i0fnQtK3pSYuRKb6tzdm10QP2KWklNacUlOXZIzV0xOX5KbvfvwRXMdyrbbmm0zzFhjlpOVW7R+ofj9eU+ss6BkqnMnnJxmK8wSSPKschOfRpbljqbhxMykWQLr6rBJfMiCzm3LHU3DiZkRs4TRjub+BeO/+8MWdBZ8IHPBthkiXDLL6TpWvlGLTnXOFVOjk52B6oObzJXYVOdO2D8AQE1mObqSSDv/VslDI62NftbVQQAK6+rgyG8N/vNvljxsqEqqqQ4Lv93ebE8ATfseXaJpqVcALLfLtYEJI6auLTnREbFDsr0y/4wY9LVdnh0w4yu7RgCHg2ZCSrwHYNQJ1wJGFVl53wnRkZnp8Xy/E64F7Hcy/gMuP6waygpOAnjBTY3Z0Bk1ZeeuvyaESElhTksQpXiYSdOFBwBkyVA1IQwiinkTiUju1avjdYA+w3drZjkB7Qw84NIH4hqPV1wYr7wVM+JWOcykEyMsCz7fEw6HXX/yNpQVFAHww819AoNP9kS+abkcDzutoAHHXd3OAMD2o60tTPjYTY3260qLCyMAQJJhrHVtBgA8q5eWAzAf6+fAeNwYqu6c+sWNvgEYuhChpJgpPuTXBPAiLAyhs6Ez1ONdkfqEzrp59jxgVkiSToXD4eGkmAGAbUdbQ0R8wA7Hfzl+tueGctOhJDPQnaLrX4RCoT+BRbg4bywrqGXgGbO8K5NazwcXJr5zIBFj5g7IcmsoFPrXi9v2hYYZJGBfzOAnPYIy5stJaEbky86pM1ZrMpMG4iALEfD5fN1+v1+bKy/pKwMAtS/n78xIET/MU5/r/4rUNA7G+xaqwUyqgDFAQgQMSeoJBoMJM91FMQMANS/ln8xKE3dNB4Ebyq+ftU2em4cWA1G/AHo96endgUBAsaOZ9G02g7g0VhpRMovu8ZJv5rcJxbh+rHPq59l5DETB3CcL0fVYYWGwrq7O8cm2aCsDAFXPbdjkW0bNguDRDehV7ber/rihjgCYAFFQAnqfHxjoOwQYydBbVDMAcOTZxyvWLZMPXBxS6r/tjlRDlrt7e3uvAeDF1v5P42/pFun0pc2xBwAAAABJRU5ErkJggg==',
                anchor: [
                    0.5,
                    1
                ]
            },
            {
                src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAmCAYAAABpuqMCAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAARrSURBVFiF3ZhNbFRVFMd/985H26m1VEoL0zj0Ayqi6IZElpiQ2MSgIeJCDZGFuEEXJH4bG9QN6spoImiMIaExbREEYoIxhgEb1CZNjFg6lHnTacNHW8QW7Mx0pjPvuKDVprR9X1MX/Jfvnv/5n/89N++d++AOgip2QolRQZAWhCeA9cAqYDlwHbiCcB7NcTKcVA8wUUztopmRQarI8wbwMlBmg5IGPkGzTzUwXowaimJGEmxHOADc44L+F7BLNXHEax3aC1kEJQatCB24M8I077DEeUfE2+Z6MkOCVuBdvHdYoXgPg7e9JXGJ6aPV4SXHPDARtqs1HHVDdlWIDLAMEwP3R2sxjOGnSa1mzCnR3TET3mJpjABUkedVN0THnZEYFQQYwd7r1y3STFLr9DvkvDNBWrBjRIfS1B6J0pAdolFyNGSHqD0cRZVlbKiEKOUxp6U5N3Pry26RNZRm9ZUE5ds2o4IRIIgKRih/ajOrr8RtGVI2dObKOiUA91tGrDjUjap8cH7FZRuoOfirZQ5hvdPC3JgJW0aEHm9cfP3JBsscYkNnDtyYWW4ZoYIrPa0DKKptVzQN52YUf1vGSG548YDcVRtKN+0V9B/cvABGLGPSJxKLrqeOJm0oWWzI7XBzzLotI0Z3PII5fm7eNXPsHKM7NxVFZw7cdOaUdUymjMHwGlKdUSQ3COSQ3CCp9iiD4bXIZKllDkXUaWnOJ4Be7qKUS0ClU64D3KCcOrWSlBOS485MjxhfOeU5xJdOjYDbqfnWFTkG1LjhW2AUP+v+t6l5WmiPG64N7HFjBDxerMSgDXjWS47ZKBT4unFLZLfWuqREpCyrVElAROULOgDg95lTea1NpVQmmM2mNly+PN4JhRm+VzOVwG9AvScXwERaj2/dFT5wadg/aVtfVEEJSb+Wn2LJZNLTPwDVxA1gB7N2xw1EkH37q445MQKglPjQ0pSH5+vr6+u9/dAAVBNdwIdecvzQVd7V/l1F0ksZPtOs82wGgCFaAeuxfh4MX/Ndfe2D6tNe5E0wC1obRTGjHiWPyXNgYwidhakpNfX6Ryu+SWWU+2MqklM+35FkMjlcnM4Aai0GwitOOG0nKk6e7Sm97lJSBPpKCoX9hmH8AUvx49ygA3jaKi5mBGNbXwy3u5DIiMjv+P09hmGMzl4ovpkLVGcLqr+kRKoWikmnVWrb7rrPEkN+WyOLiMqjJC5a90Yikb5oNJqfL87vtuiFoO7jz8s/653hmsK3zL9Z8vHBZcesjIioKY05oLTuNf2+WDwezwIkEgtflYremRkMdQXa7l01ddt0cLq77JcX3qz9fgFaBqUSGvoDoVBfb29vzonmkpkZOEVpZaW+UFVpRmaeXRvzXWvZGf785oTv32MikEbkol/r8w9t3Bjv7Ox0/WZbMjMAPcfLNj28bvKMzyeBfIHCS3trvvjxbGgEuIFScR/0PzMwcHEvmEtZR9HQfaz0/WxMZdo/vftQc2Pjlubm5jqWeBPvCPwD/KOH+jnO5aMAAAAASUVORK5CYII=',
                anchor: [
                    0.5,
                    1
                ]
            },
            {
                src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAmCAYAAABpuqMCAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAASxSURBVFiF3ZhdbBRVGIafc2Z2210hbeWnpcQVUC8kwBUJXJBIgwkgBEPEC1GMxhgE4gUJJsYERMWI3orYaiqgrYSWH/mvMaQLciE1RAKUkrLbbhMobQ20/LT7N3OOF0CC0O7szGwv9L3c73u/93vnnD3zzYH/EUTBKx6sHUvQWgR6GTAdmASMA26A6AYuofUhQnYTVevuFlK6cGaObC9DGh8i9PtAKA/GEIKvSRZtZfnbA4VooTBmjlWvQFADPOmBfRN4l8Xv7ffbhvTF1lpwrHoTgga8GeE+by9NNRvR2tfDNfyQmVv5MYJP8L/CAqgidtai/sgpP0W84d7WavBV43Eo0CtYvOaAF7K3Rg7sKKU4Hcf71sqFfmz1DEvX9rslevvPFKc/YnSMAJRhyA+8EN2vzMHasQSzveR3/HrFEMV2udv3kOlaJmgtIg8jYcMcqpu1oGXJhMi0oJQVGaV6Dvd1day62DwnaWWd+GHSciGwz01rHraZXuaUETbMoe6qVR3Ly6fMD0oZAYJBKSOvVEyd3z3/jVjIDCSddYSjzqPwYEY875RRN2tBS4kZnDFcrNQMztw144UzjjKa6W4787IylU4ZSyZEpuWKv1w+dWohdB6Fl9NsnFNCUMqKnHGRO34PYnz+Ld2DFzN3nBIySvXkjGt1PQ+d23l3dB9ezPQ6JRzu6+rIFT/Q25lwVNHkfCDDwYuZFqeEVReb5wxYmQvDxfqz6QtvnW+e69yZcNR5jOKWgKbZKSVpZUOV0bpnG3vi0YxWXUAmo1XXnp54tLL5p+dSyi52FlJRt625nwCavxlDyrgKlLjm5o9byPBkFr456IbkfmWq1t1FsMM1zx1q3RoBr4OmpT4F+jxxndGHrbZ4IXozs3RtP0Ks98R1ghDrvYz/4PfD6ti39Qix0leNh6H07siaL9ZJKYuKtA6lhSgKaC0sWwYATENlLSmVECIZTKcHZ167NtAI9gO6PzO/1ZRg6XPAFF91AJnKDES21NaYN26l8uVoLWyhSZhS/345kUj4/+Q9XjMPdBR/9wl6Qn3TjyWnzyW88i3Y5e92BmDx6tPAV35KjDnXftqHEQBhKDXZvxmA4p5NCJzH+mFg3rxzvXzn0ZN+5BUoW8p4YcxUbbZQ4nXyGEIfhrDt7MS6o/tEOm07Z48ArTPCMPYnEomewpgBeGl1HMQGN5SSk381hdsSNzwqag1tRbZdHY/HL8JoXJwfr24AXnVKK7rae/mpz3fs8aCQ1FqfxzTPxuPxf7243V9oOMESa4XOvqgDZtlIKTKVHpz4w6Ej+ZbUWlgIHdNStkYikbZoNGoNl1f4lQGM3V8us0tLfhmhvh6/98Tu0hN/XslVQ2uRlahOIWWrMozLsVgs7aQ7KmYAAnVb67PjSh+bDsKtHX9Ubmv4dQRaEiE6JLQHwuG21tbWjBvNwm+z+8hmU+/Iu8l5akwo8uA34/bg3+W1B088nKdhCK2vmFJemjV7dqyxsdHzyTZqKwMQ2r55bmpK+SktRABb2ZO+2//9E+djvcAthIgZ0P5aZ+eVzaAKoTeqZgCKt238LP10xYaxZy7tq/j5+E5Ms629vb0b0KOt/Z/GP4jqqfL5oxVsAAAAAElFTkSuQmCC',
                anchor: [
                    0.5,
                    1
                ]
            },
            {
                src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAmCAYAAABpuqMCAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAS8SURBVFiF3VhdTBxVGD3f3Rl2oRAstZXaBGxpoxaxhSVpE0ha0ib0qU/1QX009UHjQ5Oa+BO3pdTEn0QffNDGGH+SprGUqlUTSGtcKfGHBELALYTuwGJsSyEVKLuz87Mzny80sQjMzp3lQc/j3O+c8525N3fuXOB/BCq0YNNoU5lRZBwipsMM3glgM4ANAO4AuMnM14QQl7LZbFeiNpEupHfBwtRN1q1Xc+orBHoJQHEeFB3AB45w3hrcOjhXiB4KEqZxvPEIM58BUCFB/4vBRwdqBi4G7UMEYjMoqkVjzHweckEAoIJAF6LJ6BvgYC83UJiG8YYYgDYEn2EC4VRUi74eTEQSi0vrfBCNZeAy85GB7QNfyZClGtk9sfuBkBvSIL+0VsOspVg1w9XDs36JUstMYeU1rE0QAFhflCt6WYboe2aaRpvKDNW4jfy2X1nohmE85Pc7pPh1MYqMQ2DvIBER0ds3tvc1lzRvU0mttNme6tF7xmPTsT0mm178kuJIcSuATj+9+V5mxHTYqyYiInpXddd4y7qW/SqpVQCKVFKrDqw7sL+7ujsZpnDWS4OJPX2WwncYBj/uVdO+sb2vlEqfWG6sVJTWtW1q+81Lg5h2+u1NZgN42KuguaR522rj+0r2bfXSYGZPn6WQCbPBq0AltTLIOACA8KCPngDIhCEseJXYbE+tOg77Vh5Od/PuaRH+wzBue5X06D3jq43HM/FUHk6rvpDlILPM+rwKYtOxPWk3Pbzc2IK7MHxi+sReLw0Ge/oshczW/KNXjclmcetk6/YrmStxm+1JAJbN9uTlzOV462TrDoutiGdjJOK+e/NLqE3UlkYikT8BlPvl+sC8vc7eMlQ5lPFD8j0zidpEmkCf+uX5xCd+gwCSB01TMU8BmJbh5oFpS7FOyxClwiwez4/JcPPAMZnjPxDwxyqqRc8CeCaIxn1wcG7m4MyLQohwmLnYJAqrzJRzhAoASsi1c0K4RJQtMs1M3Y0bcx2Ac48eNEw5gEEAjwQKAYB1nksfnTvjTrlG3hwmhxgpRfDV0VQqFfiXN6pFmwHEAYSkRRisv5/5wv7eSMkq5IDPg93OAOiv6e8F8E4QDbvX6g0QBAAo5LpbAocBgLI/ymIAPI/1y4Fn3FvZt9M/BfF3AdcRQitImHhLPAcXzwLeh9D7YMPW3810cpYd7+IVwGxRKHQxlUpNFSQMAPTv6NeY+bgfjvmt0ZXrt+5IWjIDI2HH+UjTtN+BNbg4j2rR8wCe8qpztdzowvPzX0pYZJl5CIrSr2nafR9u3xcansjhBXb4IIVp/UolrLuZ9On0d/lKMlMOxEkWIlFVVTUSj8dzy9UVfGYAoP6X+sNik/h6BX02PsycMy8Y11fTYCZbwJ0gIRJuKDSaTCZNL981CQMA9b31Z8Vm8a/Tgd1n/aq/utC9Ai0LonEBjKklJSOJRMLy41n4ZbaIWXv2uYr5imYqp6p7z9xZdyb7ZvqHf9YxoIP5uiLEtScbG5MdHR3SO9uazQwANFxq2EuPUQ9CUOHA0U/e/dj+2b4NYB5EyRAw9vTExPWTgFsIvzUNAwC7vtnVrjyqHLeuWJ3me5nPoCgjY2NjNwHwWnv/p/E3iQfm3w9KV7kAAAAASUVORK5CYII=',
                anchor: [
                    0.5,
                    1
                ]
            },
            {
                src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAmCAYAAABpuqMCAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAATaSURBVFiF3VhbbBRVGP7+M9NddtmyvcYKSbGoAYn4REJNIGmRpMREfMEH5YEYY6ptfCCBxEgEvMR4eeCBtBYa1EIIsbVAFAIIsis0og1GpJbWdrdsiUBLuXQp3e3MzpzfB23Cpe3pzGwf9Huc83/f939z5nLOAf5HoGwL7m4ryjWssdVgWkPEi5npURAKwbgJ4CoYF5n4WyBwrLZy6G42vbMWpv5MOJ9s+TYz3gIQUDtzCkw7DGgfb6gcHs5GD1kJUxcJrSWinWAUuOjgFkt+vXbl3QNe+xBeyMyg+lOhLQRqdhUEABgFRPTN59HQu8zebq7mhVxSEdoKovfgfYYJoMpzCZ91pMk87UHEHeoiobUEavai8RAYkgTWvlkxctAN3VUj2yN5eX6y464fralxG7p4vGZF8rZToqt3xs/2OzMUBADykZGb3BAdz8zutqJcI2MMYjqfX7cgTjEHHnH6H9Kd+hjW2GqAlEF0PZhataixfX5h1QJBvhLJ5kD/jaN9J7url1l2amo+U1BwugpAq5PenD9mTGtUJboeTK0v7+0rK3qhQpCvFIBPkK+0rPjFivXP/hnTtWBaaSPUPg/CzTvzlKpg1aLGdp+e+/REYz49vGTlooZfVBrMWOy0MTdh5qoK5hdWLZhqvKzo+TKVBpHa50E4D0MoVIqSr8TL+L8omnZP47pOCWCMqEokmwOK8WvT8LnjoCsA7mZmUFXSf+No31TjfTeOJKbhNOUNmQiOwxCjXVVzsrt6mWklOyYaMzLDHae63ihXaTCpfR6E4zCSKaKqsexUoOnswifiQ4eiks1+AKZksz82dDDadHbhk7ZMz1I3RlGnvTleAdRFikOEsb8AhJ1yHSA5agbnbaoaHHVCcjwz/ywx+EunPEcg7HYaBHC7OdO190G47oqrAuE6NPGhG6qrMDUrkrchaYMbrhKSNrhZ/gMeN1b10dA+ML3iReNe2JL3f/ZqQa0Qwu9nDhhE/hxmsmyRAwC6JjOWEJKI0j7DGF1y5cpwC2CP8z2F2XkiP2zr1nkAj3mLAZhpMbx3a3hnckiMTZfDTDYxErrgM92JRMLzlrcukrucgCi8nCcw+MSe2Xs6orMSbhUsoMnT6QwA1FaOtIHxqReN2G/+Ng9BAIA0Ked5DgMA12lkCwDlsn4ijNyia8d3zf7Ri78EpC1EPCthtlXC0qRYB6gXofc1YSNz/Is5rYZBtrp6EjCbpGkHEonEQFbCAED1c8k4GBudcM6fmnXscqd+06UlM9Dlt+2GeDz+BzADB+f1kTnNAL+kqhu6rHfv3Rr+2oVFmpkvQNd/jcfj9/24HR9oqKCBawyTVuk+zp+sxhyj0cMNocPT1WQmC8QxFqKztLS0KxqNWhPVZX1mAOCT1rw1uQX2oUn0+fT+4P5z3wd6p9JgpoyAvERCdEpN647FYobKd0bCAMBHzeF9ecXyodVB4kLOzwe2zzk+CS0Noj4B9OQEg12dnZ2mE8+sP2bjMEeTr6UD4eWBkCwdvzZ6Rwwd2TX7h3vrGEiBuVcX4uIzS5fGWlpaXH/ZZmxmAGBzY0H53AXWaRKcI23Y3+0INcZ/9w8CSIIopgE9L1+61LsNkNnwm9EwALB5V8EHJWWZjV0/BVpPNoW+gq539fT0XAXAM+39n8bfE7XcWzV66JYAAAAASUVORK5CYII=',
                anchor: [
                    0.5,
                    1
                ]
            },
            {
                src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAmCAYAAABpuqMCAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAR4SURBVFiF3ZhbbBRVGMd/58x2u7vQbmtvssSNAjaRiE8k8oAPBowkVTAGTVAJJMYXiTGYNFxisHiJ7ZMPQiIxxhRLCG1tjSBRubiAJEhiNDaFSlu6baRQELsI7e7sZY4PlKT2sjNzZvvC/3HO9//+33++M2e+GbiPIAqesYkSLNYgWAssBRYAFcBNYBjFBSTfkuR7GrhTSOnCmfmYcgTbgbeAoAPGOIJP8dPIVhKFKKEwZppYj2If8IAG+x8Eb7CNDq9lGJ7YCkGQXcBeIKSZJQi8zDNYHOMMu/XL8WYmxHvAbrx3WABPc5YsxzntJYke7m6tVk85psNCsZ4ddOqQ9Qr5hDJM+tF7RuwwimIxOxh1S5Racml2MjdGAMqBeh2i+840UYJiBGfHry7GSVHj9j3kvjMWa3BgJOQPjXe82BEz680htU2lzXpzqP2F9ljQF0w6UAlRzLNuS3PfmUa+Al7LW4k/ND68Zfhy2B9+fOpawkx0RfZEliSzSbsbsp/tbHJTms4z85hdQMtzLednMgJQVly2rLmu+RcHOkvdFqZjJmIXULe4blG+9XW16x4phM5U6JipsAvwS/+DXtYnUOm4ognomLltF5C20tds1q860PnXcUUT0DEzYhdwuPfw5XzrnZc647Yqgrw3ZCbomDlvF7DxyMYnE2aia6a10dRo1+bvNq+wVVH2OlOhY+Ynu4BkNhmM7Iksaetpi6Wt9CCQTlvpwUM9h2KRvZFHU9lUwFZFEHNbmPv3TAPzCfAXEHbNdY5bGCyknjE3JPeduTtifOma5w5fuDUCuoOm4n3guhbXHtdRfKhD1DNzdzzfqsW1x1ad8R+8flg1cgB4xVOOybA4GP0sukVKWVysVNAUorhIKZHNySIAn2FlslJaQoik3zTHll25kmiD3D26VzNh4HfgYU95AJmRiWhrZJ/vti/llKOUyAlF3CfVmZ54PO79k7eRlUAMb/8TVNWpiv3hiyVxXX4Wmr390AA4zhCrCCB4SjfF/IF5P1eeK//NQxVCWNYNvQNgKkx2AU7G+mnw3TGu1pysPOVF3gIrJ2V/Ycw0kEXyKg6G0MkQlshUn6r6WmREzj56FiiVFobREY/Hr3nfZvdwjFFWcRPB804pZV2lR8PdJXmH0jxQCnoCuVzrn4ODgzA3P85bUbxkF1b8t7/nofbIIQ2FpFLqD3y+X/v7+//34vZpJMsPgzeFKVYrQ5XPFiIzYqz6ZPURpymVElmE6lNSdkej0YuxWCw7U1zhOwMY7xprc/Nz38ySX1WeLT9Y1hXuzZdDKZGRWANCym7LMHr6+vpMO905MQNQtLPoQKY0M206CA0Fz0WO1vwwCy2JEJclXCoKhS52d3en3WgWfptNIOPPvC5TcqUVsKL3rhnjxo2aE5UnJscpGEepXp+UF55Yvryvra1N+2Sbs84ABN8JrkhVpU4roYqwyC34sfrzefHQCHALIfoMuLRhYKC3Aay5rKNgCLwd+EB8JJKlm0pbahctWl1bW7uQOb6J9wX+A8zucxGCTS9IAAAAAElFTkSuQmCC',
                anchor: [
                    0.5,
                    1
                ]
            },
            {
                src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAmCAYAAABpuqMCAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAARZSURBVFiF3ZhbbFRVFIa/vedSZkTbClJow1irNpGIvpDIAw+NIYghqTHig6JGIoLSGEK8xEhoKpKovBoJg1aCaVNpsYhIRINh1D5oDYaIvUhn2qGhNwi2RabtXM7ZPrQk0Ns5Z5+ZF/7Hs9e//vXvtXP2OgduI4isZ1S1d0JmPVAJrACWAYuAq0A/0A7qWzBOIaquZ1M6e2bU/kLwvAu8AQRsMMZAfAK+jxCbR7JRQnbMqAMbQYSBuzXY/4J6FfFas9sypCu2UgJ1sBpEI3pGmOSJo6jwbpRytbnuzHCwGtT7uO+wAPZAeJfbJHqYPFqNrnLMhAliI2LrMR2yXiHqUAGkYugfrfkwDMb9iO3DTomaxyz1HrkxAlAI8m0dovPOTN4jQ9h7/epiDDJFTu8hjc5k1mPDSBDvWDPrIkm29Cq2ppJs6T3KukgA37gNkSD4nnBamc4xq7SuxDvWzwvdT1Na4UeGAL8fGXqG0op+NkVtGrLUmQ4dMw9ZBdTxeGs+/odnWyvAv/IwFb9by6gVTgvTMVNsFbCBUNl8609x733Z0JkOHTOLrAL8yKVu1qew2HZFU9Ax859VQApz0GJ9wIbONdsVTUHHzJBVwAl6u+dbP0ZP3IbOvBsyGzTMqFariBc589gIqfOzrQ2TPP8ykdU2hCx1pkOnM2esAsZJB4qpf6CJnkgK8yKQSmFePEIsUkzdgxMYC6xlRMRpYRoTwKcLwXsJyHfMtY9RCJQgXko4ITnvzOSIccgxz5lIrVMjoD1oGnuAy3pcS1yGzF4dop6ZyfF8pxbXGjt1xn9w+2GlwvXA865y3AzDbAiVfVglpczLUyqQFCLPp5TIGNIH4PWY6YyUphBi3J9MJlb29Y00gXGD7tZMPnAOKHWVB5DXUyOhJz8Pey+NTtiWV8IQirhXql874/G4+09eFV4DRACPfg7UPbu+/zK/4VxcN0MGDrv8oQGIbS2g9rlJsfDHf1pcGAEQHtMscW8GgMFqwMZYPxPegWsDRW+e/NmNugmmIWUsO2ZETQbYhI0h9BZa2kgveefk1yKRNKyj54BSKeHxNMfj8cEsdQYQ22LAW04o+XV/ngq2xK9qKioFHXmGcSAWi/0NOflxHm4EnrUKy2sf6ly+4YsjGgrjSqm/8HrPxmKxWy5ur0YyK2wXycxalectnCtAJpKJJTuOf2c3oVIig1BRJWVbKBTqiEQimdnist8ZwNP3caVRXPDNHPnV4r2nGwpq/+iaL4dSIi0xe4SUbabH0xmNRpNWujkxA+Dr3VefXp4/YzoIRmK/FW9u/GEO2jhCdEu44AsGO9ra2lJONHNxzABIG2OvyGH/GrMwELrxzHMlcaVox/Gfbo5TMIZSXV4p2x9ZtSra1NSk/WbLWWcAAmdrVk88uvQX5RE+Mqax7PXmz+443TUEjCJE1AMXnuvp6aoBM5d1ZA0LWnd/IJL7x+/6qqquvKxsbXl5eQk53sTbAv8DzFJ5Mvw8/r8AAAAASUVORK5CYII=',
                anchor: [
                    0.5,
                    1
                ]
            },
            {
                src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAmCAYAAABpuqMCAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAQLSURBVFiF3ZnPT1xVHMU/983QYcbqlNZoCmEkqCxMtJsm+gfQ2KaJqaYurDHaZeO2dmH8lZg06qZLtYY0RhqkKFrd1KYJE2VhqiQG5YftDAwEShFpARmGN8y84wIxhQLvx8xA0pPczbzv955z7u97B+4hmLLXKN0PHASeA54A9gJ7gGngBtAPfAdcwpj5svOXBVIN0odIC0jyULJIHyDt2m7pqyEdRZr2aGJtmUZ6YbstgGSQ3kFyAhpZKQ7S20jlH/Y+zLxboom15a3tMnK0DD2ythSRnt9qI7tKmCNu5RZSTRBZVkA7bwK7A+a6oQZ4I0ii/wm3vI9MAtEghB6xADzsdx8K0jMH8WAkBgudkLRhVJC3YfQrSEYh54EjBjwbQJtPSF+4jfuYlJ2Rftc6uC31Rr1trJ9vhZlf3YR0Sl3rGVnBBanLg5lftsLMDTchtjSymRlbyngwM+5XWpAFwAZ2bBoCeZcY20DEhSmPMW4xqxBkAfjHLSAPN12+T3jgmfOs6D8EMTPpFvA9DG32/RvIeODZtEHKA+mc23iPSgu3pd715sstqbdaynmYMy1+pQXpmS63gBxEa+GxDkjmYQTI52GkHZK18PgiVHvgSfoVFmQB2AmMAXHfud4xC9RhTNZPkv+eWT5inPOd5w8tfo0Ex/IVebJCp+bJoKfmUgwdq5CZY0EllXZNlc4DgcnvQrHYlmhsfN2yrEhEitrGRKokUyhaVQDhkLNUsCzHGJPbYdvZJ8fHZzqguJJeqpk48BvQUFI9gDU/P5M4dOjT8NjYond6UzQiE7b002Amkwl6OVuGMbPAK9zROoEgac/p0xf9GFmmVwhLjxbg1YaGhobSzCzX2A18VEoVOy9f7o63tWVKURFynLryPO1IYaAbeNpvanhiYuKRAwdaTDYbuHcdcBw4W3rPABhTAF7GwyF0VdrS0tJDp059XYoRpLwJhTozmczN8pgBMCYNnPSTEm9tvRTr7p4OyCjBQKRY/CSdTv8BlXk4vwC86BYW6e8frD98uD0AQ05SL+FwTzqd/uvOD5Uw86Cx7WuKRDbcxa1sNlt35MjHkVTK05FFMgWMUrKsvkQiMZBMJgvrxYWDat4QxvxtjY+/Vqyt/Zb1G0u7z5y56GZEMksWzrCxrD4nHBpMpVI2wNDQxlelij1UV42Onl+qr7/rdBBLJn+uPX78hw3SchgzZMG1qlhsoK+vL++Hs3Kv7sPD1VY8/qdTU5NY+Sk0NTWVaG4+G5qb+3+YCBaQroctq/+p/ftTHR0dgVe2iv6FEO3peWZx374fFQpVUSgU95448dl9V65MArMYkwrBtZeGh6+/B04ldZQN1Vevvm9sO/fAl+2tTY2NzU1NTXVUuBHvCfwLna16k1MlopgAAAAASUVORK5CYII=',
                anchor: [
                    0.5,
                    1
                ]
            },
            {
                src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAmCAYAAABpuqMCAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAATaSURBVFiF3VhdbBRVFP7Ondlddvqz/aERARtFMUos4YFIH3iAxESICfCABtqkCRiJtjGRBBODivhH1PigEovFGKhJXWktpdgQfDCugEFrCEhbitvdditSKIhtge52d3bu8YE2AWx7d2a2D/o97jnf+c43996Zsxf4H4GyXXD25ta8MSOxiiWvAWERCPeCUQzCNYAGwHyOGIf90I5erX3mZja1s2Ym8EJDYZq0V0D8IgB/BpQ4gN0ez9h7wx9tGs5GD1kxk1sdXM+EOgBFDuh/E9NzN2s3HHTbh3BHZzJqvt7BhEY4MwIARUz8jVEdfB1gVw9Xc0M2qh95gwhvwv0KExFWeh7vTJu/Nh9zXMQpcXxrNbqpMQmkBNYnPt3Y4oTsqJGCl/YVmOasKJxvrekwpEv54MieyiG7REdnxjR92zEzRgCgMC3Ey06Itldm9ubWvIQ/PojMXr9OETdYu8fud0i3qzJmJFaB1UZyvHp8b1V5++qyuQu8mpiTsuTlIx0DvVvqTy6Lm5aKbyRE+kkAzXZ6s73NWPIaVU6OV4+Hd63tXbtk/gqvJkoBeL2aKF23ZP6K8LvrIoZHSyh1AKXO3bB/ZgQ9qkrZW1XeHpjleWyyWIHhKaurKv9FqcO0yHZrdgkAz1VlrC6bu2C6+FOL5z2QgZBS527YN8MoVqV4NTHHTXwcszPuaRxOXs03VAkpS15WxC9loHM9447G4WSbDaoyjnQM9E4X//bMhZhShjDtA5kMDsxQuypjS/3JZcNxs2Oy2HA81fF8Q3u5Uoah1LkbDs4M/aBKiZuW/+FXDz3UcvpCKGXJfgCplCX7m0/1hxa+1rowkbJmZaAUstua7QmgpLoxN07WnwACdrk2MDLqN+fhw6pROyTbK3NrxKB9dnn2wF/YNQI4HDR1ab0F4IoTbga4okt+xwnRkZmRPZVDIGx1wlWCsNXJ+H+L6gI5NcEGABVuatwBtoLFbdtrhBA+H7M/SeTzMFPaEh4A0DVppoWQRJTwJpOjZRcvDjcB1gTdlZnCLY2BlMc6A+B+dy4AkU4Olxz7uE4khsYy5TCTRYyYLvj4+Vgs5vovb171V8slUQhu7hMYHOhs+dL4oz3mtEIaqHd5OwPcqK04AeADNzX8g10nXBgBANKknOfaDACMlszZAUA91k8CbWzkUuBs049u9CUgLSGiWTGDnSvTuqBKgJVD6O0gaZmB35qbyUxa6uwpwJwiTTsYi8UuZ8cMgJHdG6JMYpsdjr//5FHfXz3XHEoyA90+y/osGo12AjNwcZ5TE2wE8LQqz3v90vni458ccCCRYOaz0PVT0Wj0jg+37QsNFYTJ1axZT7DQC6fOSY7mnw62ZVqTmdIgjrAQXaWlpd2hUCg9WV7WVwYA8jbXrpH+wkNT1Of8c23BnL6feqarwUymgOwjIbqkpp2PRCJJle6MmAGA/E21DZZR+K/pwHf195+L2vd/NwUtAaJeAYQ9htHd1dWVsqOZ9W02gevsfzY3NbqcvTmlE7+J5M2rgdMHvr89j4E4mHt0Ic4tXro00tTU5PjNNmMrAwBFle+XpwLzjzEJD6RlFZ1q+Nx3pXsQwAiIIhoQ3tjX17MTkNnQm1EzAFBQsettM3DfNv/FM81FnS37oevd4XB4AADPtPZ/Gv8AkvXQkIP4nXQAAAAASUVORK5CYII=',
                anchor: [
                    0.5,
                    1
                ]
            },
            {
                src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAmCAYAAABpuqMCAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAASpSURBVFiF3ZhbbBRlFMd/3ze7bXdp0yKlQI2NIqZlK8YHjDxgFEIikVhKAibeooH4otFIosFLgvdEn9QQHojxAkoIFChRMWBCXC5GxRgb6sJSWrrlDgXbUrrbndmZ44Mlwdru7MxsH/T/ON/5n//5z5n55swH/yOoomesb6rAMBaDNAExYAYwBbiC4hxwFORrKNlDouVaMaWLZ2bOksk44VeA5xEiBTDSiFpHqbxP267+YpRQHDONS5cjagNwkw/2n2j1DH+07gxahhGQr2hcthZhPRD1mSOC8Ag1DQ69yYNBiglmJtb8BvAWwTusgAVUN+S4nDzgN4l/M41Ll4NaTzHfO8UDVNe3c/l40h/dD+5ursKkC3/viBv6MKzbad/d55WofclZ8hoTYwRgMnb4ZT9E752pb6ogpC8WuP36RRoVnub1O+S9M4axuBAj0bLS9M6P18SzbdtPSaLVzLZtP7X9ozXxSKQkU4BKFKwHvZbmvTOx5i+BJ/JWUlaaPrf/s5OV5dE7R6/1Dw611y5YOSuTMfPfEKU2kWh9yktp3jujmO0W8tUHLx4eywhAVcWkORvfe+EXVx1HYl5L825GqHULWXL/PTPzrS9dOO82Vx3lrjMafnazKW4BJWFjepD1EVQXXNEI/JgZdAswLfuCy/r5AnSuFlzRCPyYuegW8E3815P51lv3/ZQqQCfvDRkLfswcdgt48tUP7+0fHGofa61v4Fr706+vm1cMndHwsQHID24hmYwZqV2wclbL3h/jpmX3AKZp2T1b9xyK1y5cdcfwsFnmrkPca2nevzONK8rBOoNQ6ZlbKBQDGOmbOfL9kBea9878PWJ87pnnBcKnXo2A30FTW28Dl3xx3XEJw3rXD9GfmfbdfShZ7YvrBiWr/Yz/EPTHKta8GXgsUI4bIc6WuqG257TWpaUikaxSpWERlbN1GCBkOFZOa0cplSnJZofmnD3b3wL2dXowMzNXVFJmtQG3BsoDaJz+uuHkhpBjDhfKEVG2ElIhLQeTqVQq+C9v47L5IHEkyHmCyFTrzKZK60rKb4IcbAx6OgO9yVNMbSgD7vObotweOFRtnv89QBVKOU6vvw1gNGr61wLuY/0YCIl5fpp5en8QeQccW+uu4piJx3NoHqeAIfRGKLBqzNM7lNi2e/Q4EDGVYexMpVIXgj9m13Ep2UdNwxXg4UIpVVbvd5W5y3mH0jwQgWSZbW873tPTAxNxcB5r3gascAsrdTLJW4aPb/WhkBGRI4RCv3V1df3jwx3ykSw/cvazKqQWCXryeCFa7KEaq+fbQlOKqBxKOkXrRF1d3bF4PJ4bK674nQGM+iVNthHeNU5+qTbPbqnK9Z7Il0NEWRqnW2mdcAwj2dnZmXXTnRAzAOHYQ5stSv41HURzgz/Xml17x6FlUOqkho5wNHoskUiYXjSL/5iNwEqnV+mInu+oUN31a4bkeqdlU/tuvIUCaUROhLQ+etfcuZ0tLS2+d7YJ6wxAZPaiecO6/IAIYUTsGWb3J5PsqxeBAZTqNKDj0e7uE2+CUwy9CTUDUFa/6J2sEX2pwurfMd0+8wWh0LGOjo5zgEy09n8afwEcs7T5cvn0GwAAAABJRU5ErkJggg==',
                anchor: [
                    0.5,
                    1
                ]
            },
            {
                src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAmCAYAAABpuqMCAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAS2SURBVFiF3VhbTBxVGP7+szPscmkq1FZqE2pvUYvYwpK0SUla0ib0iaf6oD6a+qDxoUlNvMTthZp4ifHBB22M8ZI0jVCqVk0gbeOKxAsJpAG3ENiBxdiWSypQdmd3Znbm9wGaCAKzc2b3Qb/HOf/3ff835+TMmQP8j0D5FjxwYGhdJlN0lIibmbEbwGYAGwDcBXCbmW8KIa6k0+mOWKw6mU/vvIWpqRkvV9XsK0R4CUBxDhQdwAe2Ld66cWPbbD56yEuY+vrRY8x8HkCFBP0vZhzv69tx2W8fwh+dKRzWIszcCrkgAFBBhEvhcPwNgH29XF9h6upGIwDOwP8ME0Bnw2HtdZ8iclhcWq1+NFaAw8zH+vp2fiVDlmpk796xBwIBR4P80loLM6ap7BgY2DrjlSi1zBSFX0NhggBAeVFR9mUZoueZWfiOqJPIbfuVhZ7JZB7y+h1SvLpkMkVHAXYNEgoJvaVlY09DQ8l2VaVKy+KJri59NBKZ2mcYrvyS4uJQE4B2L715XmZE3OxWEwoJvaNj62hjY+khVaUqAEWqSlWHD5ce6uzcGg8GKe2mwUyuPsvhOQwzHneraWnZ2FNWRk+sNFZWJmrOnNn0m5sGEe/22pvMBvCwW0FDQ8n2tcYPHizZ5qbBzK4+yyETZoNbgapSpZ/xBdCDube0AIkwNO9WYVk8sfY47uRgdC/nlhYhEYYn3Sq6uvTRtcaj0VQiB6M1X8hKkFlmPW4FkcjUvmTSGVhpbH7eGTh1amq/mwazu89yyGzNP7jVGAYXNzWN77x2LRW1LB4HYFoWj1+9moo2NY3vMk0OuTYmKOq5N6+E6upYWSgU+hPAeq9cD5izrNIt/f2VKS8kzzMTi1UnifCpV55HfOI1CCB50DQM5SyAKRluDpgyTeWcDFEqzOLx/IQMNweckDn+Az5/rMJh7QKAZ/xoLIV9cXr6yItCiGCQudggCqrMlLWFCgBKwLGyQjhElC4yjFTNrVuzbYB9n+03zHoANwA84isDAGZ9Njl7/LzjTGRy55BNjIQi+KehRCLh+5c3HNYaAEQBBORVmPXU+19Yme8TsgJZ4HOftzNAb++ObgDv+NGwzO5uH0EAgAKOs8V3GABYt+6PCADXY/1KYGf6Tjr59o9+/B3AsYXQ8hImGm3MAs6zAFwPoUthWXrq3XbmtO1euwqYTQoELicSiYm8hAGA3t5dGjOf9MIxMt92ZM3eu5KWzMBg0LY/0jTtd6AAF+fhsNYK4Cm3OierDc3PPf+lhEWamfuhKL2api35cHu+0HBH9gVm+whRsHy1Cnb0VDJ57rtcFZkpC+I4CxGrqqoajEaj2ZXq8j4zAFBb+0uzEJu+XkWfM6kPLxqZSyNraTCTJeCMkRAxJxAYisfjhptvQcIAQG1t9wUhNv/rdGCZPb/q8692rkJLg2hUAMNqSclgLBYzvXgWYJktYGbGeq6iYq6BaH3V/WeOMzOdTr55/Z91DOhgHlGEuPlkfX28ra1Nemcr2MwAQF3dlf1Ej3UBARWwbf3e6Y8t6+dJAHMgigeA4afHxkZOA04+/AoaBgD27PmmRVEePWka19sN/b3PoCiDw8PDtwFwob3/0/gbh/Lm30zcQi4AAAAASUVORK5CYII=',
                anchor: [
                    0.5,
                    1
                ]
            },
            {
                src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAmCAYAAABpuqMCAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAASdSURBVFiF3ZhbbBRVHMZ/58xeSgNCqRegsamt1EhEXwjw4AMmJGpAEhNoVOItxgdFQ1C5qqQiKiVRHtQIGuKDXNItFJGSoFFYpIltExIj9EK7WxbTUi7BFqHbTndm/r60CWDp7MxsX/ge9/y/7/t/55ydOXPgDoLKtWDVQZnkDPGUgiUIs4DpQCFwBTgv0KLhpwE4UlmhrufSO2dhPtstBSrEOhRvAxOyoKSV4stIiC2rnlV9ueghJ2GqYrJUYAcw1Qf9H6V4fe0yVRu0Dx2ELCJqS0w2CsTwFwRgqgj7qqrlQxEJNLmBwmzdx0bgI4KvsBLFpqp9vB9IxC9xeGvFgmiMAkdg6foKdcAP2Vcj2w7IFDNDEv9bayz0Soay9ctVr1eir202lGED4xMEoIAQq/0QPa9M1UGZJCYXye7x6xfpQbjP63so5NVl+IXoGiQSIr14Lk1l0ynVmmmOw4WOHjrrGpln2a78/KjwJLDfS2+et5mCJW41kRDpFYvpnFnEAq0pBiJaU/xQEQveeoZEyGAgFz63wvt/RnjYrWTxXJoiYR4ZbSwaZvaiuTS6+ihmeW3NzwNghltB2XRKxxovn8EDufC5FX7CFLqKaqYFGR/G3Vl3NKLrlQBccytwHC6MOS70ZOHzb9YdDcNPmItuBR09dI413t5Nyk1DMfaEjAY/YZrcCuoamWdmODXa2OAQpw43Md9NQ5S7z63wHkZxzK3Espnw1SEebOsi7jicA4Ych3NtXcS/rmOmZZPnaiPEvbfmEZUxmZgHXcBkr1wPuGoMUrT6JdXvheR5ZSor1HWE773yPGKn1yDg86ApFpuAS364WeCSZNjsh+grzPDxfJUfbhZY5ef4DwE/rLbEZDfwQhCNG+HY9t7ta0tXaK2jUZEJplLRsIiybB0GCBlOxtLaUUoNREyzf3Z3d18N2CP8oGEmA38CJYFSABnzel/tF0/vuNbbNZgtR0TZSkiFtJxoS6VSge4A1lWoq8CL3DA7/iDScPjTg16CACglBlrKLHi5pKSkJFAYgHUVql6ErUE0Uqd/qT/TsDcVQEIZjlMUOAyAeS8bIYtj/Sjo7+vpOV797vEg/g44ttbJnISpfEJZ2mE5WRxCb2rCzmSO16zZnzH7/W9TkSFlGLWpVOpCTsIArHlOJQXe88Jp+WPXkfMd9Vd8WopAa9S2tyeTydMwHhfnMYkJLHOru9LT0nZg26JqHxYDIvIXodDJZDJ504vb84WGGwyLN00xFxrhaMHtaiyzv//onpV12WqKKAslCdG6ubi4uDUej1uj1eV8ZQA++LZ7ycQpM368jb40HNq89/SJnR1jaYiojMY5q7RudgyjLZFImG6+4xIGYMM3f+++q/D+/50Ous7EG47sfPXn29AGUKpTQ3s4P7+1ubl5yItnzrfZCCJ59muD6d7H8/ILikd+S1+7fPnYnpW/3VgnkEakI6R1y6Nz5iRqamp8P9nGbWUA3vn85Px7ih77XWkj7NiWffSHN75Ltfx6EbiKUgkD2p8/e7ajEpzx7CNnWLm16eNP9pgDr6yu3lVeWrqwvLy8iHGexDsC/wHqq7fSQTg4DwAAAABJRU5ErkJggg==',
                anchor: [
                    0.5,
                    1
                ]
            },
            {
                src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAmCAYAAABpuqMCAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAARmSURBVFiF3ZhfbBRVFMZ/d2Z3y1aatoCAbVyxahON6AuJPPDQGIIakhojPihqJCIoxBDinxgJTUUSlVcjYTENYNo0UCiKRKrRdFUetJGEWAuE7rZLA+VPg22Fbdk/M8cHtkmtbWfmzu4L3+Pc833nfPfczD0zcAdBFVqwCSnLwdNAPfAIcA8wH7gODAJnBI5Z0LEZdbOQuQtmZjdSacIHwNtA2AVlTMHnQfh0HWqkEDUUxMweZI2CKDBPg/63wBtvotr91mH4IQui9iINCg6hZwRgnoLDUWS7IL4215eZvdAg8BH+O6yAHVHY5ldEC/mjdciPxjSwFazZgDqqQ9YqZB9SkYEE+kdrNgxb8MAm1LBXotYxy8CHFMcIQKUB7+kQPXcmf49cxd3rVxdjOVjk9R7y3Jn8hehoJFDK2Kp2YuvTDGwQMuvTDKw6TCwYZtxFmtIgPOW1Np1jVu8UEChl7OVB+pY8R50RIgKEjBCRJc9Tt3aQuEtDjnmmQsfMw04BTzbTFSrn0enWQhUsrTvA704acnsU8gQdM1VOAZHV1My2ft+z3F+IPFOhY2a+o2iIxX7W81jguqIJXa8E4IZTgJ3hisP6ZRd5/nFdUR46Zq46BQx8S99s6/1HSbrIM+uGTAfPZgS6nGI6X+GJzAjd062lh+mOvcZyF6kc80yFTmc6nQKy44Rbqniwv42YneECkLEzXEgcJNZcxUPWLeY4aSiIeS3M8wTwBTI3ABeBcq9cDxgNQ/WrqJQXkufO5EeMfV55XqCgyasR0Bw0LdgBXNPhusC1HOzUIWqZyY/nW3W4LrBVZ/wHnx9WUaQFeMmPxmTYWK2fRGo2G4ZRUiISTitVEhRROcsIAgRMO5szDFspNR5Kp1NLL10aaQNrgu/XTDlwGljiywWQMW6O7K96JjoauHjLLUdEWUpIBgz59VwymfT9yRtFVnD7NWrqq4h0zN/2VXdZa1JXIAcHfP3QANiIOimwy49G710/nPRhBECZtl3t2wzAFWgA57F+OtwwL18+seCdn/3kt8G2DCNREDONqBywFhdD6GRYKpv97u73j6RVynKOngEiGWWa7clk8kpBzABsRCWAd71wTpc1dwzMOXldM6UInC2xrD2JROIvKMKP8yhyCHjBKW4odObc/qrVBzVSjIvInwQCpxKJxH8u7oCGmBM25VR6ZUBKKmcKyKhU6puFW467FRRROZTExTB6IpHI2VgslpsuruCdAfjMvFRfYVV9PYO+dFbubP2jvKl3Ng0RlTWw+5Vh9NimeS4ej6ed8hbFDMCu4EBLefbe/00HfeHYb0cWrft+Bto4SvUZcD5YWnq2p6cn4yVnMY4ZAGNZ6/WQMbwibFdGJp6lzKGh4wu2/DQ5TmAMkd6AYZx5bNmyeFtbm/abrWidAWgMn1q++NbjvygxgzY569jCt77sLf3xKjCKUnETzr/Y39/bCHYx6ygYts/p+ni3So9vnnuwubamZmVtbW01Rd7EOwL/Ai1BeTIkgAbWAAAAAElFTkSuQmCC',
                anchor: [
                    0.5,
                    1
                ]
            },
            {
                src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAmCAYAAABpuqMCAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAQMSURBVFiF3ZnLT1xlGIef78zAMFgCeGscLCGoLEy0myb6B9SIMTXW1IU1Rk3cGF16SYy3xMRUN8aVWkMaY0lDUbS6qbcwKjGmSmKwXKQzMBAoINICMgxnLufnoqWhCJzLzEDSX/Ju5rzved/nu39n4BqSKfULhWqAVuAh4E7gFuAGYA44DwwAXwGnDWap1PlLIqF6oXeEloXkwdJCR4Tqdrr2qyR0SGjOI8R6mxN6ZKcZEDJCrws5AUFWzRF6Tajkw94PzBtFQqy3V3cK5FAJemS9FYQObjdIXRFzxM0uCNUHqcsKyPMKcH3AWDfVAy8GCfQ94S7vIzNANEhCj1oGdvvdh4L0TCteQKpZpos4NuOILDbjfEacKBkPOaqB+wPU5k9Cn7qO+2qlNa8/tZEuqk9RTxvrJ9sB87trIV3q3hBkVSfV7QHmt+2AOe9aiK2xLWFspTzATPqtLcgCYAOVLk5ZFx8bQ8QlVdZg3HyuUpAF4F9XjyzTLs+nPORZ9FjPFQWBmXH1+JqRLZ9/QcpDnq0bpBQSOuY63qNa1kX1bThfLqhPVcp4mDNtfmsL0jPdrh4ZosS4nU7iZBkDsmQZo4M4Me5ghSoPeeJ+CwuyAOwCJoBav7E+tAA0GEzaT5Dvnrl8xDjmN86n2vyCBJYuXZFnynRqngl6ai4G6HCZYA4Hramoa6pQOxA4+XoVKJxobmx+zrKsSESK2sZEKiSTL1gVAOGQk8tblmOMyVTadvquycn5TiisxhcLUwv8ATQVRQEsWUvzB2IPfDQRnljxnF+mYEQqbOnnoVQqFfRyBoDBLABPsKZ1gkhIR+rfPuUHBMAYhbB0Wx6ebGpqaioKBsBgeoB3i3nHd9d929NRcyJVTBkhx2koyacdoTDQA9zjN3Y6NDXVeut9bWmTDty7DjgOHC26ZwAMJg88jpdD6BrlTC738k0vfV4MCFLWhEJdqVRquiQwAAaTBF7wE9Nec/z0L1U9cwFTSjAYKRQ+TCaTZy/VUGIJnQQedfMbqhwYOhB7sCNAioykPsLh3mQy+ffaB+WAudE29nBEkU138WWTTh9sePiDkXDC05FFMnmMErKs/sbGxsF4PJ7fyC8ctOjNZDD/TFqTT8UKsS/ZuLH0ft17p9xAJJOzcEaNZfU74dBQIpGwAUZGNr8qle1D9XjFePue3J7/nQ5+jMZ/fWb3099sEpbBmBELhiuqqwf7+/uzfnKWDWaU0apaq/aveqe+cfW32dDsbGts/9HF0OKVYSJYRjoXtqyBu/ftS3R2dgZe2cr6F0JvtPfevSt7fwopVJEnX3j+5mc//qH6+xlgAWMSIRh+bHT03JvglLOOkulM1Zm3bGNnOnZ1HG9pbt7f0tLSQJkb8ZrQf5kyepAtajIBAAAAAElFTkSuQmCC',
                anchor: [
                    0.5,
                    1
                ]
            },
            {
                src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAmCAYAAABpuqMCAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAASoSURBVFiF3VhNbFRVFP7OffMY6EjnvYGMrW2atmijRNyUBJcsTGRFQkJTKwpuXBliSDQxGolVEo0rjAuBhLCRGFuL4AoXTauWaBtNTHHoD/NHImXoOH2vY9+Uzvs5blpSoO37m7rgW777feec794zb867wGMEqnXAYrG4XQhxgIgOAtgNoBHADgAlADMAbjDzD7ZtX00mkwu1zF0zM7quq47jvAfgOIBtHiQVAF8S0Weqquq1qKEmZkql0mEiOgsgEUA+R0Rvqqp6KWwdIoyYmUnTtJNE1IdgRgAgwczfaZr2ITOH2txQZnRdP8nMvQh/wsTMH+u6/kGoIEGFy63VFybGGnCI6LCqqt8HEQcqRNM0hZkzCN5aG4YXQuxSFEXzKwzUZsz8PjbHCACojuO8G0To+2SKxeJ2SZLuwtvrNygqlmU96fd/KOI3ixDiADwYIaJKLBYbk2W5HUADgIJpmlnDMPYxs5u+TpKklwEM+KrND3m5yIMeOJV4PJ6VZXk/gBYAWwC0yLK8Px6Pp4losRZ5HkaQ38xzboRYLDZGRM+vtUZEe2Kx2KhbDGbe7bewIGaeciMst9ZG621uMYjINc/DCGJmhwdOQ8h1ANjpgfMAgpj51wOn4LJ+x0OMsgfOAwhi5q4bwTTNrMt63kMetw15BL7NMPOYG2f59Xt9Hf31SqXyolsMInLN8zB8mxFCDLlxmHnb/Pz806ZpDgO4BaAK4JZpmsPlcvkZx3G2ekg17Lc23xPA7OzsE5FI5G8Acb9aH5ivVqtNDQ0Nhh+R75NJJpMLzHzBr84PiOi8XyNAwKlZ13XVtu1JIkoG0W8EZp6VJOnZ/21qVhRFI6ITQbRuIKITQYwAIT+s5ubmLgJ4NUyM1bBt+5vOzs63hBDRKPO2JaKozEyWLWQAiEiOaQnhENHilqUlY8/t23o/YK/ow5qJA/gTQGsoFwAMw9CPdHefnZmZuedVw0w2MfIRwb9M5vP5UHcAiURiHsDrWLU7QcDM/MXp01f8GAEAIpYgeJcFHGttbW0NZQYAEonECIDPw8T4aWho5PLAQD5ECJIcp6kmlxHMHNE0bQTAPr/au4XCnVe6us4bhhH4dB3AcYBzoU8GAIjIEkIcgbch9D4syzJ7e3sHwhgBc5Uk6VI+ny/UxAwAKIqSAfCOH01/X9/V30dHSwFTMgMTUds+k8lk/gI24eJc07Q+Zu5y401PTU2+1tPzbYAUi8w8jkjkj0wmM7t6oeZmyuXyTsMwpqPRqLpuNZWKcezo0a/y2aynkYWZLBCnWYhUS0vLxPDwsLUWz/ftjBvq6+v/SaVSbzQ2Nl7G2pvF586cueJmhJlMASdHQqSciDSZTqeXACCbXf9TqeYns4Lx8fGLzc3Nj0wHv1679tvbx4//uI5sEURZAUzLdXUTqVSq6ifnppnJ5XJbmXlKUZSWlWelUqnYdejQuYWFhfttwkAFzDcjQtx4Ye/edH9/f+A3W83bbAVtbW33hoaGuuvr638WQsiWZdmfnjo1sGxkHkRpCZjuyeVufgQ4ADCVy21WObXB4ODgJ4VCYfHC+Qtfd7S3v9TR0dGETeyIxwb/Abxf6DIUZxAeAAAAAElFTkSuQmCC',
                anchor: [
                    0.5,
                    1
                ]
            },
            {
                src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAmCAYAAABpuqMCAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAS9SURBVFiF3VhNbFRVFP7Ond9OlBnApihJM1N0EqltQzoJLFxAQiKrruhCjXFh3GhcEGowGomiJEhYUJtUiTFCGEJsBX9CU2pQqzZB6WtLOgw0MNN5TUSggtNp6Tw6fe8dNyWp0Pa9d9/Mhm8593zfOd+9J/educAjBCq34MDAwOPBYHAHM7cQ0UYATwJYC+AOgL+J6LJpmj+EQqGz9fX1d8uZu2xmRkdHV8/Pz7/DzG8BqLJBKQLo8Hg8BzZt2jRVjhrKYmZwcHAnER0BsEaC/i8Rvd7c3HzabR3CDZmZSVGUvUTUBTkjALCGmb9RFOV9Zna1ua7MDA8P7wXwIdyfMAHYNzQ09J5bESkstFaXG40lYBLRzubm5m9lyFKFjIyMRAzDyEK+tVZC3u/3b2hsbMw7JUq1ma7r76IyRgBgdalUeluG6PhkFr4jt2Dv+pVFsaqqqsbpd8jrNEswGNwBG0aEEMVYLHYhHA7XEdE6Zr5ZKBTGc7ncZtM0rfihYrH4AoBTTmpz3GbM3GIpKkSxqalpPBKJbCWiWgB+IqqNRCJbGxoaMkIIzUqDiCzzPJTXKYGInrWKicViF4QQzy215vV6G6LR6J9WGsy80WltMhfAU1YB4XC4bqX1SCQSs9IgIss8D0LGzFobhaxzs76AJ2xXtAAZMzNWAcx802L9ho0807YrWoCMmVtWAYVCYXyl9ampKdVGnhU3ZCnImLlgFZDL5Tbrup5aak3X9ZSqqlusNIjIMs+DkLmaf7GKMU2zKpVKPZ3P5/uZeQJAiZkn8vl8fyqVesY0zaANjX6ntTmeANLp9GOapv0FIOyU6wAFn8+3vqmpadYJyfHJ1NfX32Xmr5zyHOJLp0YAyUEzEAjsAzApw7WBSb/f/7EMUcrMwni+S4ZrA7tkxn/A5R8rRVFOAHjJjcZiGIZxsrW19U0hRCDAXDVHFPAxk24IHwB4Pea8LoRJRJp/bm624fr1qW7AuM93ayYM4CKAqCsXADRNm9qze/eRycnJe3Y5zGQQQ/UK/n1MVVVXbwCJRKIA4BUs2h0ZMDMfP3bseydGAICIPRC8QQdejUajUVdmACCRSAwAOOhGQxkcHPj53DnVhQR5THO9azMAMDMzsxeA5Vi/FO7cvn2js6PjVzf5TcA0hMiWxcy2bdt0AC/DxhC6GLquz3/W2XlK0zT5NmUukcdzWlXVm2UxAwCJRCJLRG1OOD/29Z29NDp6RzIlM3AlYBifZ7PZS0AFHs4VRekC0GoVN6GqY3va2r6WSKEx8yi83qFsNvu/D7fjBw0beKNUKm33+/2rlwu4p2mz7e3tZ+wKMpMO4gwLka6trb3S39+vLxVX9pMBgN7e3pbq6urvltHn40ePnuw5c+baShrMNC9g5kiItOnxjGUymTmrvBUxAwA9PT0nampqHpoOLo6M/HFg//6+ZWgaiMYFcNUXCl1Jp9MlJzkr0WYAgFAo9Nr09PTzq1atqr3/W6FQ+OfTw4d/WhzHQBHM17xCXG5MJDLd3d3SN1vFTgYAksnklng8/psQwqfrunH40KEvFEW5BaAAoowHuPpiLnftA8CsZB1lQzKZ/Oj8+fPawU8OJuN1ddvj8fh6VHgTHwn8B/S71Ufd4vUbAAAAAElFTkSuQmCC',
                anchor: [
                    0.5,
                    1
                ]
            },
            {
                src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAmCAYAAABpuqMCAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAATTSURBVFiF3VhPTBRXHP7e2xmBTYwgDXVdQ6m2hxrsyaweeoCkSXtQExOZ0JLSQ9NLmx5MbGya1P49NCRoQg9UG1MTA5RZEbegsYemVE1gMU1JBRZhF9dkccHGAkUXZmfe/HooJJTCzs6b5dB+yV7m/b7v9/veezvvNw/4H4EVWjASiWzNZrOvAjhCRHsBBACUA3gE4AGAUQDfA7iuadrjQuYumJm2trYyRVE+YIy9B6AkD0qGMfaVoihfHj16dK4QNRTEjK7rxwCcBbBdgv4HY+zturq6y17r4F7IRMR0XT8FQIecEQDYTkSXOjs7PyIiT5Pr80Kurq7+GMCn8L7CjDFWG4vFrHA4fENaRJa4vLV0LxrrwAZwTNO0bhmyVCHd3d2lpmkmIL+1cmHWNM09DQ0Ns26JUv8Z0zQ/xOYYAYAyRVHelyG6XplIJLLVMIwZ5Pf6lUUGwNNuzyHFbZblA9HRiKIomVAoNBgIBHZzznfYtj2dTqcno9HoASGEE99PRK8A6HJTm8w2O+IUoChK5tChQ5PBYLCGc14JYAvnvDIYDNYcPnw47vP5FguRZy1cmyGiF5xiQqHQoKqq1euNqaq6LxQKRZ00GGN73dYmszI7nQICgcDunAI7dz5biDxrIWOm3FGU8x1expfxVN4Vrei6JQBYcAqwbXs61zgRpfPI82feFS1DxsyMU0A6nZ7MNT41NZXMI0/OCVkPMmYGnQKi0egB0zTvrDeWzWbvDA4OHnTSYIw55lkL12YYYz85xQghSnp6ep5LpVJ9tm3fB5C1bft+KpXq6+3tfV4IUeykQUR9bmtzfWgS0WUALQC25YoTQpT09/fXrHr0zPIvH8wvLS25/r5xvTKapj0mom/d8lzifGNj4xO3JKlG07KszwA8lOHmgYemaX4hQ5Qys9yeH5fh5oHjMu0/4PHDStf1NgCve9FYDSFEx8mTJ9/lnBcVEZUYjBWpRMwSXAUAxWebFuc2Y2xxi2E82Tc1NRcGxArfq5ltAIYAVHlyAcAwjLmW06fPzs7OLuXLIWKCEZIKp5tjyWTS04WGpmnzAN7AqtmRBF27ejXixggAMEY+cNpjAW9WVVVVeTIDAJqm3SKiJi8ao8PDt24PDCQ9SDCfbQc9mwGAioqKUwAc2/r1MD83lw53dv7sJb8N2ILzREHM1NbWWrZtNyCPJnQ1hBDmpXC4yzAM+W1KlGU+3+VkMjldEDMAUF9fnwBwwg0n2t9/PTEx8UgyJREQKxLi60QiMQxswsW5rus6gDqnuOl0eqzlzJlOiRSLRPQbFOWXRCLxj4PbdW/mBMuy3iGil1VVLdsoJmsYTzra23vz1SRiFhjFifORysrKWF9fn7VeXMFXBgDOnTt3pLS09MoG+nStp6fj1s2bE7k0iJjJYd9jnI/YPt9YPB43nPJuihkAaG1tbSsvL/9XdzB+9+7AhfPnf9iAtgjGJjkwrvr9sZGRkaybnAXfZisoLi5+K5PJvOT3+ytXni0sLPz+XXv7j6vjCMiAaELhfPTF/fvj4XBY+s22aSsDAM3NzQeDweANzrkqhBAdFy9+Mzo6OgNgHozFfcD4a/fuTXzy94W5Z2yqGQBoamr6fNeuXSeGfh3qutJ16QIUJTY+Pv4AAG127v80/gIGr+iWe+FGsAAAAABJRU5ErkJggg==',
                anchor: [
                    0.5,
                    1
                ]
            },
            {
                src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAmCAYAAABpuqMCAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAToSURBVFiF3VhdbFNlGH7ec05/F6IUE9GLIYgXXYpXJBBZE0xM9EausIl6ObzBGSHRdnEJ1p+RhnBBNF4YY/xJFigNaIwxLpFYB2WwMWCW0bG1W7eEdUBwQ0fb7fy83nQJjK3nnO90F/okvTnf+7zP+/Q75/ve7wP+R6BGJ4xGo+skSXqFmfcAaAHwFIANAO4CmCai64Zh/OT3+3+Nx+PzjdRumJmOjo71zNwB4B0APguUMjN/vri4mDh27NhcI2poiJloNLqXiL4EEBCg/8XMbx05cuS00zpkh3yKxWKHiOgLAH7BHD4iiuzatcvIZDJnnRTjyEw0Gv2QiD6C8xkmInqxtbVVy2QyvcJJRIm1V+ukkxwrwCCivYlE4gcRslAhBw4ceNzj8RQg9o2YYZaInk0kErN2iZKImtvt/gBrYwQA1gN4X4Roe2ai0eg6IroFa8uvKMo+n+9Ju/uQYleltiGaGnG73eVIJNIfDAa3yLK8Udf1mVwuN55MJneoqmrG91er1ZcBnLJVm51gAKjt7HXhdrvLnZ2d46FQaLcsy80A3LIsN4dCod2dnZ15l8tVaYTOcoh8M0GzgEgk0u/xeEIrjXm93m2RSOSiBZ0Wu4WJmHnaLCAYDG6pN97S0rK5ETrLIWJmg1mALMsbnYzX8ITlimoQMfOPWYCu6zMm4yULOn9brqgGETO3zAJyudx4vfFr164VzXIwc90/ZCWImOk3C0gmkzuq1Wp2pbFyuZxNpVI7zXIQkanOcoiY+d0sQFVVX1dX19ZsNpvWdX0SwKKu65NDQ0Ppw4cPP6dpmtcsBzOn7RZme9P0+XynK5XKZwAeqxenqqqvu7t79wOPNtV+VnDPMAzb5xvbM1NrMb6xy7OJr48ePXrfLkmo0SSijwHcFuFawG0i+lSEKGSm1p4fFOFawEGR9h9weLCKxWLdAN5wkuNBMPPxEydOvC1JksfD7Fsg8riYSdMlFwAosqFqkmQQUcW9sHB/282bcylAX+LbXgCWYT+AFwA84zAPVFWdO9PTM+WWpHcBQCeCAoCJICsMAGAQZGaAGZrLhcubNutbGUVF4rMjxWLR8ZE3Fou1AkjDwX0CM/OVwcHvJwqFomgKDfjO6e0MMpnMVDgc9gIIi+YoTU+fyw4NXXFQBpFh3BFaAJbD6/UeAmClrX8ElXK5dOnixT+c6BuAoUtSoSFm4vG4ZhjGm7DQhD5UhGGoAwMDp1RV1c2jVwHzIsny6WKxOOP4NVvC+fPnZ8Ph8F0Ar1rlFPL5X8bHxuo2pXXADIx4df3kjcnJSWANLs5jsdhJAK+Zxd2bmxv5racnKSBRYeY/oSiDhULhoY3b6dL8CDRN209EL8myvH7VGFW9f6Gv72erOZlJA3GeJWm4ubk5l06ntZXiGj4zANDe3r6nqanpx1Xyc/bq1eOjN26M1cvBTKoEY4IkadiQ5ZF8Pr9gprsmZgCgvb29u6mp6ZHuYKZUupDp7e1ZhVYB0bgEjLr8/tzw8PCiHc2Gv2ZLmJ+fb1MUpdXj8TQvPatWq3f6+/rOPBjHQBnMY4okXX9++/Z8KpUSXtnWbGYAYN++fTsDgUAvEbkMw9AvnDv3ValUugXgHojyMjD6+sTEWBwwGqG3pmYAoK2t7ZNAIPDe1OTUqSuXBr6FouRGR0enAfBaa/+n8S8PPeWMetb8+wAAAABJRU5ErkJggg==',
                anchor: [
                    0.5,
                    1
                ]
            },
            {
                src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAmCAYAAABpuqMCAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAATISURBVFiF3VhNbBtFGH0z3vXGbqpSikQBKSIOHKgop0quYtMadSsqVfRCoQo9IjiAuAXJ4lB+D0Q5Ig4VQvxIVZREKQhRRNoiNi2VcBECUaUNjmM7VRPHcdP81HGc/ZmPSyKVNMnuzjoHeEfPe9/73s54dnaA/xFYowsmEont0Wj0iBDiGGNsD4BHAOwCMANgEsB1IvrOcZwfDcOoNtK7YWGOHj260zTNNBG9BSDiQVID8Ilt2x8bhjHXiB4aEubQoUPHGWOnATwoIb8D4LWLFy+eDdpHKKCeHT58+BSATwFEJWtEALzc2toqCoXC5SDNBAqj6/q7AN5H8BlmjLHnYrGYnc/nL0kXkRWuLK2+IDXWgWCMHb9w4cI3MmKpRlKp1AOKooxB7j/ihllN09rOnTs361fIZdwURXkHWxMEAHaapvm2jND3zCQSie2RSKQMb9uvLGq2bT/s9z2k+HWJRqNHiMg1iKZptXQ6fTUej8dUVd1tWdZUJpPJd3V1xev1ups+qijK8wAG/PTme5kJIY65cTRNq/X29uaTyWRKVdUWAGFVVVuSyWSqp6cn19TUtOTBytVnLXyHYYw95cZJp9NXt23b9vR6Y83NzXs7OzszHqz2+O1NZgN41I0Qj8djm423t7e3NsJnLWTC7HIjqKq6O8j4Ch7y3NEKZMLcdSNYljXlMl7y4LPguaMVyIQpuxEymUx+s/ErV64UPfhs+kDWg+8wRHTVjdPV1RWvVqvX1hurVqvXuru793uwcvVZC5nd7Gc3Tr1ej3R0dDwxNDRkWJY1DsC0LGvcMAzjxIkTT5qm2eTBx/Ddm19BKpVqVhTlFoAdfrU+MM85f+z8+fOLfkS+Z2bliPGFX50fMMY+9xsEkDxoapr2AYBpGa0HTIfD4Y9khFIfZ6Ojo/VYLDYJ4EUZvQteHxwc/E1GGOjDStf1MwBeCVJjDXqy2eybnHNNI4osM6apRMx2uAoASkhYNueCMbYUXl5e3DsxMdcPOKvioGF2ENGfjLHHg2UAhBBzpVu3TlumWfeqIWIOIxQVTpdHisVi4E9eXdeTAAwEuE8gIpqpVL6uLiwUZUvYwFdBb2eQz+dvtrW1NQF4VrbGUq32y+zMzB8B2mBMiIrUbrYWlmWdAuDlWH8fbMsqzUxPDwXxF4BwOB9rSBjDMGwhxEl4OITeCyKyKpXKgOM4jjt7wyImC4XOFovFqcDLbBWFQmE2FovNAHjBq+buwsIP1fn5TQ+lm4AIGGlynL6/x8fHgS24ONd1vQ/AS248yzRHJm7e7JWwWCKiv6Aov4+Njf3rxe37QsMNtm2/wTnXOec7N+KQEIvlcvl7rzWJmA1GOeJ8uKWl5YZhGPZ6vIbPDAAcOHDgWDgc/naD+jR7+3bP/Nzc6GY1iJjFIQqM82ERCo3kcrllN98tCQMABw8ePKOq6n2ng6Va7dfy5OTgBrIlMJbnQFaNRm8MDw+bfjwbvsxWwRh71XGcZCgUaln9zXGcynSp9NO9PAJqIBpVOL/+zL59uf7+fumdbctmBgASicT+SCRyCYBKRE6lVPqsVquVAcyDsVwIyHYUCqPvAaIRflsaBgCSyeSHmqZ1Lt5dHLhze/pLKMqNbDY7CYC22vs/jX8A/Nff8x41WYEAAAAASUVORK5CYII=',
                anchor: [
                    0.5,
                    1
                ]
            },
            {
                src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAmCAYAAABpuqMCAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAPjSURBVFiF3ZlNbxtVFIafe2cceyZxEitfqiMs1EUWSLDqggXskOiGSqCyoAj+AH8BChISAv5ABahCBaoGJziISAhWMR8LECBQUNo0cZpJpLQNVWMDTZxre+ayMIGQOp7J2DMFXuls5p57zvver7lzBv5HEBHETAMngVPAA8AxYAi4DVwHLgOfAJ8BdyLI3xVkgDeAHUAHsG3gdWDwXpBth9M0Rz6IiIN2G3gqfsp3QwBnAY9wQvbMA14immUfGC/TmYiD9mK89P/GaTqfkYPmAk/GKQKamzbsHvGzLZqHSWx4MwIR++21uISkCX78hrVtoO+oxGQIMScBy8/Jtu2dQqFQVEqta61rSqn16enpomVZ1QA5bODxENyOjPfxGVnbtrcrlcrPugXK5fK8ZVlBZvZCHGK+9yNSKBTmWgnZQz6fnwsg5rs4xFz3I6KUWmsnRinlBBCzcVRiYd64Cuhp56C1rvn4KCFE0idPDfDz+QfCHAC/+znUarWbPu03AuT5LTCjPxFGzKafw+zs7LV27TMzM06APG0HpFt4F5/1blnWTrlcnm+1X7a2tuZTqVTVLwZwPg4xzwcgoi3L2snn83NKKae555UzOTk5F1CIBp6LQ0wfUAlIKKxVgN6jEguzZ+7QXGpR4jzNK00syNA8CKKYlU1ivjUDnOkC8VZ2JiyhTj9TL3aSvAUu5XK5F6SUyaTWlhIimdBaNFyZADANr96Q0hNCVHuU2n5wY6My1fygAzoXMwD8BNzfYRyklJVcNvuWaZq7QftoLVyhcUypv1p0HKcbBYRHgCJgdBBDjwwNvTeQTjth+zfgQicE9rAOpIBHwwbo6+39ejiT+bEDDkJ43q0wR3MrnAW+DdPRNIwbY8PDX3SS3APPlXKlW2IawLMEuITuhxCiPjoy8pEQwvX3PgRa14RhFBzHudmNZbaHMs2KzRNBOwz29386kE63vZS2gdawmHLd/NW1tTWIpoKYB572c0r29Czel81+GCJ+VWs9j2n+sLKy8sv+hijEDAshlrTWh77FpRDb4+Pj55KmGejKorVoIHRJS7mQy+WuFIvFRiu/SGq7hmGccl3340Pi6+FM5tLgwMByuxhai7rEWxVSLniGsVgqlZRf3sgK1YlE4mK9Xr/rdmBb1jfZsbHPD+lWRYhrEpYStn1lYWGhdpScUVbdU1LKq57n5fYeGIZxK5fNvm0Yxl/LRMMOWi+bUl5+6MSJ0tTUVOiTLdJfCJZlPby7u/ul1joBuMdGR9/pte1N4FeEKBmw9Mzq6vIrzQL8vx+pVOpVIUS1v6//g4njxx+bmJgY5x7/h/lP4A+AJ7grnrOyCgAAAABJRU5ErkJggg==',
                anchor: [
                    0.5,
                    1
                ]
            }
        ];
        if (!this.options.labels) {
            this.options.labels = {};
        }
        Object.keys(Drawing.DefaultLabels).forEach(function (key) {
            if (!this.options.labels.hasOwnProperty(key)) {
                this.options.labels[key] = Drawing.DefaultLabels[key];
            }
        }, this);
        if (!this.options.defaultStyles) {
            this.options.defaultStyles = {};
        }
        Object.keys(Drawing.DefaultStyles).forEach(function (key) {
            if (!options.defaultStyles.hasOwnProperty(key)) {
                this.options.defaultStyles[key] = Drawing.DefaultStyles[key];
                return;
            }
            if (key == 'polyFillOpacity' && (options.defaultStyles[key] < 0 || options.defaultStyles[key] > 1)) {
                console.log('Wrong value (' + options.defaultStyles[key] + ') for defaultStyles.polyFillOpactity. Must be between 0 and 1');
                this.options.defaultStyles[key] = Drawing.DefaultStyles[key];
                return;
            }
            if (key == 'strokeWidth' || key == 'polyStrokeWidth') {
                var intValue = parseInt(options.defaultStyles[key], 10);
                if (isNaN(intValue) || intValue < 0) {
                    console.log('Wrong value (' + options.defaultStyles[key] + ') for defaultStyles.strokeWidth. Must be a positive interger value.');
                    this.options.defaultStyles[key] = Drawing.DefaultStyles[key];
                    return;
                }
                this.options.defaultStyles[key] = intValue;
            }
        }, this);
        this.interaction = null;
        this.stylingOvl = null;
        this.layer = null;
        if (this.options.layer && this.options.layer instanceof ol.layer.Vector) {
            this.layer = this.options.layer;
        }
        this._isDesktop = this._detectSupport();
    };
    Drawing.prototype._createEmptyLayer = function () {
        var features = new ol.Collection();
        var layer = new ol.layer.Vector({ source: new ol.source.Vector({ features: features }) });
        layer.gpResultLayerId = 'drawing';
        this.setLayer(layer);
    };
    Drawing.prototype.setLayer = function (vlayer) {
        if (!vlayer) {
            this.layer = null;
            return;
        }
        if (!(vlayer instanceof ol.layer.Vector)) {
            console.log('no valid layer given for hosting drawn features.');
            return;
        }
        var layers = this.getMap().getLayers();
        if (layers) {
            var found = false;
            layers.forEach(function (mapLayer) {
                if (mapLayer == vlayer) {
                    found = true;
                }
            }, this);
            if (!found) {
                this.getMap().addLayer(vlayer);
            }
            vlayer.getSource().getFeatures().forEach(function (feature) {
                var featureStyleFunction = feature.getStyleFunction();
                if (featureStyleFunction) {
                    var styles = featureStyleFunction.call(feature, 0);
                    if (styles && styles.length !== 0) {
                        feature.setStyle(styles[0]);
                    }
                }
            });
        }
        this.layer = vlayer;
    };
    Drawing.prototype._detectSupport = function () {
        var isDesktop = true;
        var userAgent = window.navigator.userAgent.toLowerCase();
        if (userAgent.indexOf('iphone') !== -1 || userAgent.indexOf('ipod') !== -1 || userAgent.indexOf('ipad') !== -1 || userAgent.indexOf('android') !== -1 || userAgent.indexOf('mobile') !== -1 || userAgent.indexOf('blackberry') !== -1 || userAgent.indexOf('tablet') !== -1 || userAgent.indexOf('phone') !== -1 || userAgent.indexOf('touch') !== -1) {
            isDesktop = false;
        }
        if (userAgent.indexOf('msie') !== -1 || userAgent.indexOf('trident') !== -1) {
            isDesktop = true;
        }
        return isDesktop;
    };
    Drawing.prototype._initContainer = function () {
        var container = this._createMainContainerElement();
        var inputShow = this._showDrawingContainer = this._createShowDrawingElement();
        container.appendChild(inputShow);
        var picto = this._createShowDrawingPictoElement();
        container.appendChild(picto);
        var panel = this._createDrawingPanelElement();
        container.appendChild(panel);
        return container;
    };
    Drawing.prototype._drawEndFeature = function (feature, geomType) {
        var style = null;
        switch (geomType) {
        case 'Point':
            style = new ol.style.Style({ image: new ol.style.Icon(this._getIconStyleOptions(this.options.markersList[0])) });
            break;
        case 'LineString':
            style = new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: this.options.defaultStyles.strokeColor,
                    width: this.options.defaultStyles.strokeWidth
                })
            });
            break;
        case 'Polygon':
            style = new ol.style.Style({
                fill: new ol.style.Fill({ color: this.hexToRgba(this.options.defaultStyles.polyFillColor, this.options.defaultStyles.polyFillOpacity) }),
                stroke: new ol.style.Stroke({
                    color: this.options.defaultStyles.polyStrokeColor,
                    width: this.options.defaultStyles.polyStrokeWidth
                })
            });
            break;
        }
        feature.setStyle(style);
        var popupOvl = null;
        var context = this;
        var setAttValue = function (value, save) {
            context.getMap().removeOverlay(popupOvl);
            if (save && value && value.trim().length > 0) {
                var formated = value.replace(/\n/g, '<br>');
                feature.setProperties({ description: formated });
            }
        };
        var popup = this._createLabelDiv({
            applyFunc: setAttValue,
            inputId: this._addUID('att-input'),
            placeholder: 'Saisir une description...',
            geomType: geomType
        });
        popupOvl = new ol.Overlay({
            element: popup,
            positioning: 'top-center'
        });
        this.getMap().addOverlay(popupOvl);
        var geomExtent = feature.getGeometry().getExtent();
        popupOvl.setPosition([
            (geomExtent[0] + geomExtent[2]) / 2,
            (geomExtent[1] + geomExtent[3]) / 2
        ]);
        document.getElementById(this._addUID('att-input')).focus();
    };
    Drawing.prototype._createRemoveInteraction = function () {
        var interaction = new ol.interaction.Select({ layers: [this.layer] });
        interaction.on('select', function (seEv) {
            if (!seEv || !seEv.selected || seEv.selected.length == 0) {
                return;
            }
            this.layer.getSource().removeFeature(seEv.selected[0]);
            this.getMap().removeInteraction(this.interaction);
            this.interaction = this._createRemoveInteraction();
            this.getMap().addInteraction(this.interaction);
        }, this);
        return interaction;
    };
    Drawing.prototype._createStylingInteraction = function () {
        var interaction = new ol.interaction.Select({ layers: [this.layer] });
        interaction.on('select', function (seEv) {
            if (this.stylingOvl) {
                this.getMap().removeOverlay(this.stylingOvl);
            }
            if (!seEv || !seEv.selected || seEv.selected.length == 0) {
                return;
            }
            var valuesColor = null;
            var hexColor = null;
            var popupOvl = null;
            var geomType = null;
            var initValues = {};
            if (seEv.selected[0].getGeometry() instanceof ol.geom.Point) {
                var _label = seEv.selected[0].getProperties().name;
                if (seEv.selected[0].getStyle().getText() && _label) {
                    geomType = 'Text';
                    if (seEv.selected[0].getStyle().getText().getStroke() && seEv.selected[0].getStyle().getText().getStroke().getColor()) {
                        valuesColor = seEv.selected[0].getStyle().getText().getStroke().getColor();
                        if (Array.isArray(valuesColor)) {
                            valuesColor = 'rgba(' + valuesColor.join() + ')';
                            hexColor = this.rgbaToHex(valuesColor);
                            initValues.strokeColor = hexColor.hex;
                            initValues.strokeOpacity = hexColor.opacity;
                        } else {
                            initValues.strokeColor = valuesColor;
                        }
                    }
                    if (seEv.selected[0].getStyle().getText().getFill() && seEv.selected[0].getStyle().getText().getFill().getColor()) {
                        valuesColor = seEv.selected[0].getStyle().getText().getFill().getColor();
                        if (Array.isArray(valuesColor)) {
                            valuesColor = 'rgba(' + valuesColor.join() + ')';
                            hexColor = this.rgbaToHex(valuesColor);
                            initValues.fillColor = hexColor.hex;
                            initValues.fillOpacity = hexColor.opacity;
                        } else {
                            initValues.fillColor = valuesColor;
                        }
                    }
                    initValues.strokeColor = initValues.hasOwnProperty('strokeColor') ? initValues.strokeColor : this.options.defaultStyles.textStrokeColor;
                    initValues.fillColor = initValues.hasOwnProperty('fillColor') ? initValues.fillColor : this.options.defaultStyles.textFillColor;
                } else if (seEv.selected[0].getStyle() && seEv.selected[0].getStyle().getImage()) {
                    geomType = 'Point';
                    if (seEv.selected[0].getStyle().getImage().getSrc()) {
                        initValues.markerSrc = seEv.selected[0].getStyle().getImage().getSrc();
                    } else {
                        initValues.markerSrc = this.options.markersList[0].src;
                    }
                }
            } else if (seEv.selected[0].getGeometry() instanceof ol.geom.LineString) {
                geomType = 'Line';
                if (seEv.selected[0].getStyle() && seEv.selected[0].getStyle().getStroke()) {
                    if (seEv.selected[0].getStyle().getStroke().getWidth()) {
                        initValues.strokeWidth = seEv.selected[0].getStyle().getStroke().getWidth();
                    }
                    if (seEv.selected[0].getStyle().getStroke().getColor()) {
                        valuesColor = seEv.selected[0].getStyle().getStroke().getColor();
                        if (Array.isArray(valuesColor)) {
                            valuesColor = 'rgba(' + valuesColor.join() + ')';
                            hexColor = this.rgbaToHex(valuesColor);
                            initValues.strokeColor = hexColor.hex;
                            initValues.fillOpacity = hexColor.opacity;
                        } else {
                            initValues.strokeColor = valuesColor;
                        }
                    }
                }
                initValues.strokeWidth = initValues.hasOwnProperty('strokeWidth') ? initValues.strokeWidth : this.options.defaultStyles.strokeWidth;
                initValues.strokeColor = initValues.hasOwnProperty('strokeColor') ? initValues.strokeColor : this.options.defaultStyles.strokeColor;
            } else if (seEv.selected[0].getGeometry() instanceof ol.geom.Polygon) {
                geomType = 'Polygon';
                if (seEv.selected[0].getStyle() && seEv.selected[0].getStyle().getStroke()) {
                    if (seEv.selected[0].getStyle().getStroke().getWidth()) {
                        initValues.strokeWidth = seEv.selected[0].getStyle().getStroke().getWidth();
                    }
                    if (seEv.selected[0].getStyle().getStroke().getColor()) {
                        valuesColor = seEv.selected[0].getStyle().getStroke().getColor();
                        if (Array.isArray(valuesColor)) {
                            valuesColor = 'rgba(' + valuesColor.join() + ')';
                            hexColor = this.rgbaToHex(valuesColor);
                            initValues.strokeColor = hexColor.hex;
                            initValues.strokeOpacity = hexColor.opacity;
                        } else {
                            initValues.strokeColor = valuesColor;
                        }
                    }
                }
                if (seEv.selected[0].getStyle() && seEv.selected[0].getStyle().getFill()) {
                    if (seEv.selected[0].getStyle().getFill().getColor()) {
                        valuesColor = seEv.selected[0].getStyle().getFill().getColor();
                        if (Array.isArray(valuesColor)) {
                            valuesColor = 'rgba(' + valuesColor.join() + ')';
                        }
                        hexColor = this.rgbaToHex(valuesColor);
                        initValues.fillColor = hexColor.hex;
                        initValues.fillOpacity = hexColor.opacity;
                    }
                }
                initValues.strokeWidth = initValues.hasOwnProperty('strokeWidth') ? initValues.strokeWidth : this.options.defaultStyles.polyStrokeWidth;
                initValues.strokeColor = initValues.hasOwnProperty('strokeColor') ? initValues.strokeColor : this.options.defaultStyles.polyStrokeColor;
                initValues.fillColor = initValues.hasOwnProperty('fillColor') ? initValues.fillColor : this.options.defaultStyles.polyFillColor;
                initValues.fillOpacity = initValues.hasOwnProperty('fillOpacity') ? initValues.fillOpacity : this.options.defaultStyles.polyFillOpacity;
            }
            if (!geomType) {
                console.log('Unhandled geometry type for styling.');
                return;
            }
            var dtObj = this;
            var applyStyle = function (action) {
                if (action == 'cancel') {
                    dtObj.getMap().removeOverlay(popupOvl);
                    return;
                }
                var setDefault = action == 'apply' ? false : true;
                var fillColorElem = document.getElementById(dtObj._addUID('fillColor'));
                var fillOpacityElem = document.getElementById(dtObj._addUID('fillOpacity'));
                var strokeColorElem = document.getElementById(dtObj._addUID('strokeColor'));
                var strokeWidthElem = document.getElementById(dtObj._addUID('strokeWidth'));
                switch (geomType.toLowerCase()) {
                case 'text':
                    if (setDefault) {
                        dtObj.options.defaultStyles.textStrokeColor = strokeColorElem.value;
                        dtObj.options.defaultStyles.textFillColor = fillColorElem.value;
                    } else {
                        seEv.selected[0].setStyle(new ol.style.Style({
                            text: new ol.style.Text({
                                font: '16px sans',
                                textAlign: 'left',
                                text: seEv.selected[0].getStyle().getText().getText(),
                                fill: new ol.style.Fill({ color: fillColorElem.value }),
                                stroke: new ol.style.Stroke({
                                    color: strokeColorElem.value,
                                    width: 3
                                })
                            })
                        }));
                    }
                    break;
                case 'point':
                    var markerSelected = dtObj._getsMarkersOptionsFromSrc(document.querySelector('input[name=\'marker\']:checked').value);
                    if (setDefault) {
                        if (dtObj.options.markersList.length > 1) {
                            var idxMarker = dtObj.options.markersList.findIndex(function (mrk) {
                                if (mrk == markerSelected) {
                                    return true;
                                }
                                return false;
                            });
                            if (idxMarker > 0) {
                                dtObj.options.markersList.splice(idxMarker, 1);
                                dtObj.options.markersList.splice(0, 0, markerSelected);
                            }
                        }
                    } else {
                        seEv.selected[0].setStyle(new ol.style.Style({ image: new ol.style.Icon(dtObj._getIconStyleOptions(markerSelected)) }));
                    }
                    break;
                case 'line':
                    if (setDefault) {
                        dtObj.options.defaultStyles.strokeColor = strokeColorElem.value;
                        dtObj.options.defaultStyles.strokeWidth = parseInt(strokeWidthElem.value, 10);
                    } else {
                        seEv.selected[0].setStyle(new ol.style.Style({
                            stroke: new ol.style.Stroke({
                                width: parseInt(strokeWidthElem.value, 10),
                                color: strokeColorElem.value
                            })
                        }));
                    }
                    break;
                case 'polygon':
                    var opacity = parseInt(fillOpacityElem.value, 10) / 10;
                    if (setDefault) {
                        dtObj.options.defaultStyles.polyStrokeColor = strokeColorElem.value;
                        dtObj.options.defaultStyles.polyFillColor = fillColorElem.value;
                        dtObj.options.defaultStyles.polyFillOpacity = opacity;
                        dtObj.options.defaultStyles.polyStrokeWidth = parseInt(strokeWidthElem.value, 10);
                    } else {
                        seEv.selected[0].setStyle(new ol.style.Style({
                            stroke: new ol.style.Stroke({
                                width: parseInt(strokeWidthElem.value, 10),
                                color: strokeColorElem.value
                            }),
                            fill: new ol.style.Fill({ color: dtObj.hexToRgba(fillColorElem.value, opacity) })
                        }));
                    }
                    break;
                }
                if (!setDefault) {
                    dtObj.getMap().removeOverlay(popupOvl);
                }
            };
            var popupDiv = this._createStylingDiv({
                geomType: geomType,
                initValues: initValues,
                applyFunc: applyStyle
            });
            popupOvl = new ol.Overlay({
                element: popupDiv,
                positioning: 'top-center'
            });
            this.getMap().addOverlay(popupOvl);
            popupOvl.setPosition(seEv.mapBrowserEvent.coordinate);
            this.stylingOvl = popupOvl;
            this.getMap().removeInteraction(this.interaction);
            this.interaction = this._createStylingInteraction();
            this.getMap().addInteraction(this.interaction);
        }, this);
        return interaction;
    };
    Drawing.prototype._createLabelInteraction = function () {
        var interaction = new ol.interaction.Select({ layers: [this.layer] });
        interaction.on('select', function (seEv) {
            if (this.labelOvl) {
                this.getMap().removeOverlay(this.labelOvl);
            }
            if (!seEv || !seEv.selected || seEv.selected.length == 0) {
                return;
            }
            var popupOvl = null;
            var geomType = null;
            var textValue = null;
            if (seEv.selected[0].getGeometry() instanceof ol.geom.Point) {
                var _label = seEv.selected[0].getProperties().name;
                if (seEv.selected[0].getStyle() && seEv.selected[0].getStyle().getText() && _label) {
                    geomType = 'Text';
                } else if (seEv.selected[0].getStyle() && seEv.selected[0].getStyle().getImage()) {
                    geomType = 'Point';
                }
            } else if (seEv.selected[0].getGeometry() instanceof ol.geom.LineString) {
                geomType = 'Line';
            } else if (seEv.selected[0].getGeometry() instanceof ol.geom.Polygon) {
                geomType = 'Polygon';
            }
            if (!geomType) {
                console.log('Unhandled geometry type for styling.');
                return;
            }
            if (geomType == 'Text') {
                textValue = seEv.selected[0].getStyle().getText().getText();
            } else {
                var featProps = seEv.selected[0].getProperties();
                if (featProps && featProps.hasOwnProperty('description')) {
                    textValue = featProps['description'];
                }
            }
            var context = this;
            var setTextValue = function (value, save) {
                context.getMap().removeOverlay(popupOvl);
                if (!save) {
                    return;
                }
                var feature = seEv.selected[0];
                if (geomType == 'Text') {
                    var style = feature.getStyle();
                    style.getText().setText(value);
                    feature.setProperties({ name: value });
                    feature.setStyle(style);
                    return;
                }
                var formated = value.replace(/\n/g, '<br>');
                feature.setProperties({ description: formated });
            };
            var popupDiv = this._createLabelDiv({
                applyFunc: setTextValue,
                inputId: this._addUID('label-input'),
                placeholder: geomType == 'Text' ? 'Saisir un label...' : 'Saisir une description...',
                text: textValue,
                geomType: geomType
            });
            popupOvl = new ol.Overlay({
                element: popupDiv,
                positioning: 'top-center'
            });
            this.getMap().addOverlay(popupOvl);
            popupOvl.setPosition(seEv.mapBrowserEvent.coordinate);
            document.getElementById(this._addUID('label-input')).focus();
            this.labelOvl = popupOvl;
            this.getMap().removeInteraction(this.interaction);
            this.interaction = this._createLabelInteraction();
            this.getMap().addInteraction(this.interaction);
        }, this);
        return interaction;
    };
    Drawing.prototype._handleToolClick = function (clickEvent, toolId, context) {
        var map = context.getMap();
        if (!map) {
            return;
        }
        Interactions.unset(map, { current: 'Drawing' });
        if (context.interaction) {
            map.removeInteraction(context.interaction);
            context.interaction = null;
        }
        if (!this.layer) {
            this._createEmptyLayer();
        }
        switch (toolId) {
        case this._addUID('drawing-tool-point'):
            if (context.dtOptions['points'].active) {
                context.interaction = new ol.interaction.Draw({
                    features: context.layer.getSource().getFeaturesCollection(),
                    style: new ol.style.Style({ image: new ol.style.Icon(this._getIconStyleOptions(this.options.markersList[0])) }),
                    type: 'Point'
                });
                context.interaction.on('drawend', function (deEv) {
                    context._drawEndFeature(deEv.feature, 'Point');
                }, context);
            }
            break;
        case this._addUID('drawing-tool-line'):
            if (context.dtOptions['lines'].active) {
                context.interaction = new ol.interaction.Draw({
                    features: context.layer.getSource().getFeaturesCollection(),
                    style: new ol.style.Style({
                        image: new ol.style.Circle({
                            radius: this.options.cursorStyle.radius,
                            stroke: new ol.style.Stroke({
                                color: this.options.cursorStyle.strokeColor,
                                width: this.options.cursorStyle.strokeWidth
                            }),
                            fill: new ol.style.Fill({ color: this.options.cursorStyle.fillColor })
                        }),
                        stroke: new ol.style.Stroke({
                            color: this.options.defaultStyles.strokeColor,
                            width: this.options.defaultStyles.strokeWidth
                        })
                    }),
                    type: 'LineString'
                });
                context.interaction.on('drawend', function (deEv) {
                    context._drawEndFeature(deEv.feature, 'LineString');
                }, context);
            }
            break;
        case this._addUID('drawing-tool-polygon'):
            if (context.dtOptions['polygons'].active) {
                context.interaction = new ol.interaction.Draw({
                    features: context.layer.getSource().getFeaturesCollection(),
                    style: new ol.style.Style({
                        image: new ol.style.Circle({
                            radius: this.options.cursorStyle.radius,
                            stroke: new ol.style.Stroke({
                                color: this.options.cursorStyle.strokeColor,
                                width: this.options.cursorStyle.strokeWidth
                            }),
                            fill: new ol.style.Fill({ color: this.options.cursorStyle.fillColor })
                        }),
                        stroke: new ol.style.Stroke({
                            color: this.options.defaultStyles.polyStrokeColor,
                            width: this.options.defaultStyles.polyStrokeWidth
                        }),
                        fill: new ol.style.Fill({ color: this.hexToRgba(this.options.defaultStyles.polyFillColor, this.options.defaultStyles.polyFillOpacity) })
                    }),
                    type: 'Polygon'
                });
                context.interaction.on('drawend', function (deEv) {
                    context._drawEndFeature(deEv.feature, 'Polygon');
                }, context);
            }
            break;
        case this._addUID('drawing-tool-text'):
            if (context.dtOptions['text'].active) {
                context.interaction = new ol.interaction.Draw({
                    features: context.layer.getSource().getFeaturesCollection(),
                    style: new ol.style.Style({
                        image: new ol.style.Circle({
                            radius: this.options.cursorStyle.radius,
                            stroke: new ol.style.Stroke({
                                color: this.options.cursorStyle.strokeColor,
                                width: this.options.cursorStyle.strokeWidth
                            }),
                            fill: new ol.style.Fill({ color: this.options.cursorStyle.fillColor })
                        })
                    }),
                    type: 'Point'
                });
                context.interaction.on('drawend', function (deEv) {
                    var popupOvl = null;
                    var setTextValue = function (value, save) {
                        context.getMap().removeOverlay(popupOvl);
                        if (!save) {
                            context.layer.getSource().removeFeature(deEv.feature);
                            return;
                        }
                        deEv.feature.setProperties({ name: value });
                        deEv.feature.setStyle(new ol.style.Style({
                            image: new ol.style.Icon(context._getIconStyleOptions(context.options.defaultStyles.textIcon1x1)),
                            text: new ol.style.Text({
                                textAlign: 'left',
                                font: '16px sans',
                                text: value,
                                fill: new ol.style.Fill({ color: context.options.defaultStyles.textFillColor }),
                                stroke: new ol.style.Stroke({
                                    color: context.options.defaultStyles.textStrokeColor,
                                    width: 3
                                })
                            })
                        }));
                    };
                    var popup = this._createLabelDiv({
                        applyFunc: setTextValue,
                        inputId: context._addUID('label-input'),
                        geomType: 'Text',
                        placeholder: 'Saisir un label...'
                    });
                    popupOvl = new ol.Overlay({
                        element: popup,
                        positioning: 'top-center'
                    });
                    context.getMap().addOverlay(popupOvl);
                    popupOvl.setPosition(deEv.feature.getGeometry().getCoordinates());
                    document.getElementById(this._addUID('label-input')).focus();
                }, context);
            }
            break;
        case this._addUID('drawing-tool-edit'):
            if (context.dtOptions['edit'].active) {
                context.interaction = new ol.interaction.Modify({
                    features: context.layer.getSource().getFeaturesCollection(),
                    style: new ol.style.Style({
                        image: new ol.style.Circle({
                            radius: this.options.cursorStyle.radius,
                            stroke: new ol.style.Stroke({
                                color: this.options.cursorStyle.strokeColor,
                                width: this.options.cursorStyle.strokeWidth
                            }),
                            fill: new ol.style.Fill({ color: this.options.cursorStyle.fillColor })
                        })
                    }),
                    deleteCondition: function () {
                        return false;
                    }
                });
            }
            break;
        case this._addUID('drawing-tool-display'):
            if (context.dtOptions['display'].active) {
                context.interaction = this._createStylingInteraction();
            }
            break;
        case this._addUID('drawing-tool-tooltip'):
            if (context.dtOptions['tooltip'].active) {
                context.interaction = this._createLabelInteraction();
            }
            break;
        case this._addUID('drawing-tool-remove'):
            if (context.dtOptions['remove'].active) {
                context.interaction = context._createRemoveInteraction();
            }
            break;
        default:
        }
        if (context.interaction) {
            context.interaction.setProperties({
                name: 'Drawing',
                source: this
            });
            map.addInteraction(context.interaction);
        }
    };
    Drawing.prototype.onShowDrawingClick = function () {
        var map = this.getMap();
        Interactions.unset(map);
        this.collapsed = this._showDrawingContainer.checked;
        this.dispatchEvent('change:collapsed');
    };
    Drawing.prototype.onExportFeatureClick = function () {
        var content = this.exportFeatures();
        if (!content) {
            return;
        }
        var link = document.createElement('a');
        var charset = 'utf-8';
        link.setAttribute('href', 'data:application/vnd.google-earth.kml+xml;charset=' + charset + ',' + encodeURIComponent(content));
        link.setAttribute('download', this.getExportName() + '.kml');
        if (document.createEvent) {
            var event = document.createEvent('MouseEvents');
            event.initEvent('click', true, true);
            link.dispatchEvent(event);
        } else {
            link.click();
        }
    };
    return Drawing;
}({}, ol, gp, CommonUtilsSelectorID, Ol3ControlsUtilsInteractions, CommonControlsDrawingDOM, Ol3Utils, Ol3FormatsKML);
CommonControlsLocationSelectorDOM = function (ID) {
    var LocationSelectorDOM = {
        _addUID: function (id) {
            var uid = this._uid ? id + '-' + this._uid : id;
            return uid;
        },
        _createMainContainerElement: function () {
            var container = document.createElement('div');
            container.className = this._addUID('GPlocationPoint');
            container.className += ' GPwidget';
            return container;
        },
        _createLocationPointElement: function (id, display) {
            var div = document.createElement('div');
            div.id = this._addUID('GPlocationPoint_' + id);
            div.className = display ? 'GPflexInput GPlocationStageFlexInput' : 'GPflexInput GPlocationStageFlexInputHidden';
            div.style.cssText = '';
            return div;
        },
        _createLocationPointLabelElement: function (id, text) {
            var self = this;
            var labelOrigin = document.createElement('label');
            labelOrigin.id = this._addUID('GPlocationOriginLabel_' + id);
            labelOrigin.htmlFor = 'GPlocationOrigin_' + id;
            labelOrigin.innerHTML = text;
            labelOrigin.addEventListener('click', function (e) {
                var i = ID.index(this.id);
                var points = document.getElementsByClassName(self._addUID('GPlocationPoint'));
                for (var j = 0; j < points.length; j++) {
                    var tag = points[j].childNodes[0].id;
                    var id = ID.index(tag);
                    document.getElementById(self._addUID('GPlocationPoint_' + id)).style.cssText = '';
                }
                document.getElementById(self._addUID('GPlocationOriginCoords_' + i)).value = '';
                document.getElementById(self._addUID('GPlocationOrigin_' + i)).value = '';
                document.getElementById(self._addUID('GPlocationPoint_' + i)).style.cssText = '';
                document.getElementById(self._addUID('GPlocationOriginPointer_' + i)).checked = false;
                document.getElementById(self._addUID('GPlocationOrigin_' + i)).className = 'GPlocationOriginVisible';
                document.getElementById(self._addUID('GPlocationOriginCoords_' + i)).className = 'GPlocationOriginHidden';
                if (document.getElementById(self._addUID('GPlocationStageRemove_' + i))) {
                    document.getElementById(self._addUID('GPlocationStageRemove_' + i)).className = 'GPlocationStageRemove';
                }
                if (document.getElementById(self._addUID('GPlocationStageAdd'))) {
                    document.getElementById(self._addUID('GPlocationStageAdd')).className = '';
                }
                self.onLocationClearPointClick(e);
            });
            return labelOrigin;
        },
        _createLocationAutoCompleteteInputElement: function (id) {
            var self = this;
            var inputOrigin = document.createElement('input');
            inputOrigin.id = this._addUID('GPlocationOrigin_' + id);
            inputOrigin.className = 'GPlocationOriginVisible';
            inputOrigin.type = 'text';
            inputOrigin.placeholder = 'Saisir une adresse';
            inputOrigin.autocomplete = 'off';
            inputOrigin.addEventListener('keyup', function (e) {
                var charCode = e.which || e.keyCode;
                if (charCode === 13 || charCode === 10 || charCode === 38 || charCode === 40) {
                    return;
                }
                var i = ID.index(this.id);
                if (document.getElementById(self._addUID('GPlocationOrigin_' + i)).value.length > 2) {
                    document.getElementById(self._addUID('GPlocationAutoCompleteList_' + i)).style.display = 'block';
                } else {
                    document.getElementById(self._addUID('GPlocationAutoCompleteList_' + i)).style.display = 'none';
                }
                self.onAutoCompleteSearchText(e);
            });
            inputOrigin.addEventListener('keydown', function (e) {
                var charCode = e.which || e.keyCode;
                var container = document.getElementById(self._addUID('GPlocationAutoCompleteList_' + id));
                if (!container) {
                    return;
                }
                var curr = container.getElementsByClassName('GPautoCompleteProposal current');
                var list = container.getElementsByClassName('GPautoCompleteProposal');
                var length = list.length;
                if (!length) {
                    return;
                }
                var current = null;
                if (!curr.length) {
                    current = list[0];
                    current.className = 'GPautoCompleteProposal current';
                    current.style.color = '#000000';
                    current.style['background-color'] = '#CEDBEF';
                    return;
                } else {
                    current = curr[0];
                }
                var index = parseInt(ID.index(current.id), 10);
                var next = index === length - 1 ? list[0] : list[index + 1];
                var prev = index === 0 ? list[length - 1] : list[index - 1];
                current.style['background-color'] = '';
                current.style.color = '';
                prev.style['background-color'] = '';
                prev.style.color = '';
                next.style['background-color'] = '';
                next.style.color = '';
                switch (charCode) {
                case 38:
                    console.log('arrow up');
                    current.className = 'GPautoCompleteProposal';
                    prev.className = 'GPautoCompleteProposal current';
                    prev.style.color = '#000000';
                    prev.style['background-color'] = '#CEDBEF';
                    break;
                case 40:
                    console.log('arrow down');
                    current.className = 'GPautoCompleteProposal';
                    next.className = 'GPautoCompleteProposal current';
                    next.style.color = '#000000';
                    next.style['background-color'] = '#CEDBEF';
                    break;
                case 13:
                    console.log('enter');
                    current.click(e);
                    break;
                }
                current.focus();
            });
            return inputOrigin;
        },
        _createLocationCoordinateInputElement: function (id) {
            var self = this;
            var inputOriginCoord = document.createElement('input');
            inputOriginCoord.id = this._addUID('GPlocationOriginCoords_' + id);
            inputOriginCoord.className = 'GPlocationOriginHidden';
            inputOriginCoord.type = 'text';
            inputOriginCoord.disabled = false;
            inputOriginCoord.addEventListener('click', function () {
                var i = ID.index(this.id);
                document.getElementById(self._addUID('GPlocationOriginLabel_' + i)).click();
            });
            return inputOriginCoord;
        },
        _createLocationPointerShowInputElement: function (id) {
            var inputOriginPointer = document.createElement('input');
            inputOriginPointer.id = this._addUID('GPlocationOriginPointer_' + id);
            inputOriginPointer.type = 'checkbox';
            return inputOriginPointer;
        },
        _createLocationPointerInputElement: function (id) {
            var self = this;
            var labelOriginPointer = document.createElement('label');
            labelOriginPointer.id = this._addUID('GPlocationOriginPointerImg_' + id);
            labelOriginPointer.htmlFor = 'GPlocationOriginPointer_' + id;
            labelOriginPointer.className = 'GPlocationOriginPointerImg';
            labelOriginPointer.title = 'Pointer un lieu sur la carte';
            labelOriginPointer.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var i = ID.index(this.id);
                var points = document.getElementsByClassName(self._addUID('GPlocationPoint'));
                var j;
                var tag;
                var id;
                for (j = 0; j < points.length; j++) {
                    tag = points[j].childNodes[0].id;
                    id = ID.index(tag);
                    if (i != id) {
                        document.getElementById(self._addUID('GPlocationOriginPointer_' + id)).checked = false;
                        if (document.getElementById(self._addUID('GPlocationOriginCoords_' + id)).value == 'Pointer un lieu sur la carte') {
                            document.getElementById(self._addUID('GPlocationOriginCoords_' + id)).value = '';
                            document.getElementById(self._addUID('GPlocationOrigin_' + id)).className = 'GPlocationOriginVisible';
                            document.getElementById(self._addUID('GPlocationOriginCoords_' + id)).className = 'GPlocationOriginHidden';
                        }
                    }
                }
                if (document.getElementById(self._addUID('GPlocationOriginPointer_' + i)).checked) {
                    document.getElementById(self._addUID('GPlocationOriginCoords_' + i)).value = '';
                    for (j = 0; j < points.length; j++) {
                        tag = points[j].childNodes[0].id;
                        id = ID.index(tag);
                        document.getElementById(self._addUID('GPlocationPoint_' + id)).style.cssText = '';
                    }
                    if (document.getElementById(self._addUID('GPlocationStageRemove_' + i))) {
                        document.getElementById(self._addUID('GPlocationStageRemove_' + i)).className = 'GPlocationStageRemove';
                    }
                    if (document.getElementById(self._addUID('GPlocationStageAdd'))) {
                        document.getElementById(self._addUID('GPlocationStageAdd')).className = '';
                    }
                    document.getElementById(self._addUID('GPlocationOriginPointer_' + i)).checked = false;
                    document.getElementById(self._addUID('GPlocationOrigin_' + i)).className = 'GPlocationOriginVisible';
                    document.getElementById(self._addUID('GPlocationOriginCoords_' + i)).className = 'GPlocationOriginHidden';
                } else {
                    document.getElementById(self._addUID('GPlocationOriginCoords_' + i)).value = 'Pointer un lieu sur la carte';
                    for (j = 0; j < points.length; j++) {
                        tag = points[j].childNodes[0].id;
                        id = ID.index(tag);
                        if (i == id) {
                            document.getElementById(self._addUID('GPlocationPoint_' + id)).style.cssText = '';
                        } else {
                            document.getElementById(self._addUID('GPlocationPoint_' + id)).style.display = 'none';
                        }
                    }
                    if (document.getElementById(self._addUID('GPlocationStageRemove_' + i))) {
                        document.getElementById(self._addUID('GPlocationStageRemove_' + i)).className = 'GPlocationOriginHidden';
                    }
                    if (document.getElementById(self._addUID('GPlocationStageAdd'))) {
                        document.getElementById(self._addUID('GPlocationStageAdd')).className = 'GPlocationOriginHidden';
                    }
                    document.getElementById(self._addUID('GPlocationOriginPointer_' + i)).checked = true;
                    document.getElementById(self._addUID('GPlocationOrigin_' + i)).className = 'GPlocationOriginHidden';
                    document.getElementById(self._addUID('GPlocationOriginCoords_' + i)).className = 'GPlocationOriginVisible';
                    document.getElementById(self._addUID('GPlocationOriginCoords_' + i)).disabled = true;
                }
                self.onActivateMapPointClick(e);
            });
            return labelOriginPointer;
        },
        _createLocationRemovePointElement: function (id) {
            var self = this;
            var divRm = document.createElement('div');
            divRm.id = this._addUID('GPlocationStageRemove_' + id);
            divRm.className = 'GPlocationStageRemove';
            divRm.title = 'Supprimer l\'étape';
            divRm.addEventListener('click', function (e) {
                var points = document.getElementsByClassName(self._addUID('GPlocationPoint'));
                var last = points.length - 1;
                var start = points[0].childNodes[0].id;
                var end = points[last].childNodes[0].id;
                var startID = ID.index(start);
                var endID = ID.index(end);
                if (id != startID && id != endID) {
                    var i = ID.index(this.id);
                    document.getElementById(self._addUID('GPlocationPoint_' + i)).className = 'GPflexInput GPlocationStageFlexInputHidden';
                    document.getElementById(self._addUID('GPlocationOrigin_' + i)).value = '';
                    document.getElementById(self._addUID('GPlocationOrigin_' + i)).className = 'GPlocationOriginVisible';
                    document.getElementById(self._addUID('GPlocationOriginCoords_' + i)).value = '';
                    document.getElementById(self._addUID('GPlocationOriginCoords_' + i)).className = 'GPlocationOriginHidden';
                    document.getElementById(self._addUID('GPlocationStageAdd')).style.display = '';
                    self.onLocationRemovePointClick(e);
                }
            });
            return divRm;
        },
        _createLocationAddPointElement: function () {
            var self = this;
            var divAdd = document.createElement('div');
            divAdd.id = this._addUID('GPlocationStageAdd');
            divAdd.title = 'Ajouter une étape';
            divAdd.addEventListener('click', function (e) {
                var lastStage = 1;
                var nbStages = 0;
                var points = document.getElementsByClassName(self._addUID('GPlocationPoint'));
                for (var i = 1; i < points.length - 1; i++) {
                    var tag = points[i].childNodes[0].id;
                    var id = ID.index(tag);
                    if (document.getElementById(self._addUID('GPlocationPoint_' + id))) {
                        if (document.getElementById(self._addUID('GPlocationPoint_' + id)).className == 'GPflexInput GPlocationStageFlexInputHidden') {
                            if (lastStage == 1) {
                                lastStage = id;
                            }
                        } else {
                            nbStages++;
                        }
                    }
                }
                if (lastStage < points.length) {
                    document.getElementById(self._addUID('GPlocationPoint_' + lastStage)).className = 'GPflexInput GPlocationStageFlexInput';
                }
                if (nbStages == 4) {
                    document.getElementById(self._addUID('GPlocationStageAdd')).style.display = 'none';
                }
                self.onLocationAddPointClick(e);
            });
            return divAdd;
        },
        _createLocationAutoCompleteResultElement: function (id) {
            var self = this;
            var div = document.createElement('div');
            div.id = this._addUID('GPlocationAutoCompleteList_' + id);
            div.className = 'GPadvancedAutoCompleteList';
            if (div.addEventListener) {
                div.addEventListener('click', function (e) {
                    self.onAutoCompletedResultsItemClick(e);
                    document.getElementById(self._addUID('GPlocationAutoCompleteList_' + id)).style.display = 'none';
                }, false);
            } else if (div.attachEvent) {
                div.attachEvent('onclick', function (e) {
                    self.onAutoCompletedResultsItemClick(e);
                    document.getElementById(self._addUID('GPlocationAutoCompleteList_' + id)).style.display = 'none';
                });
            }
            return div;
        },
        _createLocationAutoCompletedLocationElement: function (id, location, n) {
            var container = document.getElementById(this._addUID('GPlocationAutoCompleteList_' + id));
            var div = document.createElement('div');
            div.id = this._addUID('AutoCompletedLocation_' + n);
            div.className = 'GPautoCompleteProposal';
            div.innerHTML = location.fullText;
            container.appendChild(div);
        },
        GPdisplayCoordinate: function (value) {
            var points = document.getElementsByClassName(this._addUID('GPlocationPoint'));
            for (var i = 0; i < points.length; i++) {
                var tag = points[i].childNodes[0].id;
                var id1 = ID.index(tag);
                if (document.getElementById(this._addUID('GPlocationOriginPointer_' + id1)).checked) {
                    document.getElementById(this._addUID('GPlocationOriginCoords_' + id1)).value = value;
                    document.getElementById(this._addUID('GPlocationOriginCoords_' + id1)).disabled = false;
                    for (var j = 0; j < points.length; j++) {
                        tag = points[j].childNodes[0].id;
                        var id2 = ID.index(tag);
                        document.getElementById(this._addUID('GPlocationPoint_' + id2)).style.cssText = '';
                        if (document.getElementById(this._addUID('GPlocationStageRemove_' + id2))) {
                            document.getElementById(this._addUID('GPlocationStageRemove_' + id2)).className = 'GPlocationStageRemove';
                        }
                    }
                    document.getElementById(this._addUID('GPlocationOriginPointer_' + id1)).checked = false;
                    if (document.getElementById(this._addUID('GPlocationStageAdd'))) {
                        document.getElementById(this._addUID('GPlocationStageAdd')).className = '';
                    }
                    return;
                }
            }
        }
    };
    return LocationSelectorDOM;
}(CommonUtilsSelectorID);
Ol3ControlsLocationSelector = function (ol, Utils, woodman, Gp, RightManagement, SelectorID, LocationSelectorDOM, Markers) {
    function LocationSelector(options) {
        options = options || {};
        if (!(this instanceof LocationSelector)) {
            throw new TypeError('ERROR CLASS_CONSTRUCTOR');
        }
        this.initialize(options);
        this._container = this._initContainer();
        if (options.element && options.element.appendChild) {
            options.element.appendChild(this._container);
            this._container = options.element;
        }
        ol.control.Control.call(this, {
            element: this._container,
            target: options.target,
            render: options.render
        });
    }
    ol.inherits(LocationSelector, ol.control.Control);
    LocationSelector.prototype = Object.create(ol.control.Control.prototype, {});
    Utils.assign(LocationSelector.prototype, LocationSelectorDOM);
    LocationSelector.prototype.constructor = LocationSelector;
    LocationSelector.prototype.initialize = function (options) {
        this.options = {
            tag: {
                id: 1,
                groupId: null,
                label: '>',
                display: true,
                addOption: false,
                removeOption: false
            },
            displayInfo: true,
            autocompleteOptions: {}
        };
        Utils.mergeParams(this.options, options);
        this._uid = this.options.tag.groupId || SelectorID.generate();
        this._map = null;
        this._inputsContainer = null;
        this._inputLabelContainer = null;
        this._inputAutoCompleteContainer = null;
        this._inputShowPointerContainer = null;
        this._inputShowPointer = null;
        this._inputCoordinateContainer = null;
        this._addPointElement = null;
        this._removePointElement = null;
        this._coordinate = null;
        this._suggestedContainer = null;
        this._suggestedLocations = [];
        this._currentLocation = null;
        this._initMarker();
        this._resources = {};
        this._noRightManagement = false;
        this._checkRightsManagement();
    };
    LocationSelector.prototype._initMarker = function () {
        this._marker = null;
        this._markerUrl = '';
        this._markerOffset = [
            0,
            0
        ];
        if (this.options.tag.markerOpts && this.options.tag.markerOpts.url) {
            this._markerUrl = this.options.tag.markerOpts.url;
            var offset = this.options.tag.markerOpts.offset;
            if (offset) {
                if (Array.isArray(offset) && offset.length === 2) {
                    this._markerOffset = offset;
                } else {
                    console.log('markerOpts.offset should be an array. e.g. : [0,0]');
                }
            }
        } else {
            this._markerUrl = Markers['lightOrange'];
            this._markerOffset = Markers.defaultOffset;
        }
    };
    LocationSelector.prototype.getCoordinate = function () {
        return this._coordinate;
    };
    LocationSelector.prototype.clear = function () {
        this._clearResults();
        this._inputLabelContainer.click();
    };
    LocationSelector.prototype._checkRightsManagement = function () {
        var _opts = this.options.autocompleteOptions.filterOptions;
        var _res = _opts ? _opts.type : [];
        if (!_res || _res.length === 0) {
            _res = [
                'PositionOfInterest',
                'StreetAddress'
            ];
        }
        var rightManagement = RightManagement.check({
            key: this.options.apiKey,
            resources: _res,
            services: ['AutoCompletion']
        });
        if (!rightManagement) {
            this._noRightManagement = true;
        }
        if (!this.options.apiKey) {
            this.options.apiKey = rightManagement.key;
        }
        Utils.assign(this._resources, rightManagement);
    };
    LocationSelector.prototype._initContainer = function () {
        var id = this.options.tag.id;
        var container = this._createMainContainerElement();
        var inputs = this._inputsContainer = this._createLocationPointElement(id, this.options.tag.display);
        container.appendChild(inputs);
        var _inputLabel = this._inputLabelContainer = this._createLocationPointLabelElement(id, this.options.tag.label);
        inputs.appendChild(_inputLabel);
        var _inputAutoComplete = this._inputAutoCompleteContainer = this._createLocationAutoCompleteteInputElement(id);
        var context = this;
        if (_inputAutoComplete.addEventListener) {
            _inputAutoComplete.addEventListener('click', function () {
                context.onAutoCompleteInputClick();
            });
        } else if (_inputAutoComplete.attachEvent) {
            _inputAutoComplete.attachEvent('onclick', function () {
                context.onAutoCompleteInputClick();
            });
        }
        inputs.appendChild(_inputAutoComplete);
        var _inputCoordinate = this._inputCoordinateContainer = this._createLocationCoordinateInputElement(id);
        inputs.appendChild(_inputCoordinate);
        var _inputShowPointer = this._inputShowPointerContainer = this._createLocationPointerShowInputElement(id);
        inputs.appendChild(_inputShowPointer);
        var _inputPointer = this._inputShowPointer = this._createLocationPointerInputElement(id);
        inputs.appendChild(_inputPointer);
        if (this.options.tag.addOption) {
            var _inputAddStage = this._addPointElement = this._createLocationAddPointElement();
            inputs.appendChild(_inputAddStage);
        }
        if (this.options.tag.removeOption) {
            var _inputRemoveStage = this._removePointElement = this._createLocationRemovePointElement(id);
            inputs.appendChild(_inputRemoveStage);
        }
        var results = this._suggestedContainer = this._createLocationAutoCompleteResultElement(id);
        container.appendChild(results);
        return container;
    };
    LocationSelector.prototype.onAutoCompleteInputClick = function () {
        if (this._inputAutoCompleteContainer && this._inputAutoCompleteContainer.value.length > 2) {
            this._displaySuggestedLocation();
        }
    };
    LocationSelector.prototype.onAutoCompleteSearchText = function (e) {
        var value = e.target.value;
        if (!value) {
            return;
        }
        if (this._noRightManagement) {
            console.log('no rights for this service !?');
            return;
        }
        this._currentLocation = value;
        if (value.length < 3) {
            this._clearSuggestedLocation();
            return;
        }
        var context = this;
        this._requestAutoComplete({
            text: value,
            maximumResponses: 5,
            onSuccess: function (results) {
                if (results) {
                    var locations = results.suggestedLocations;
                    context._fillAutoCompletedLocationListContainer(locations);
                }
            },
            onFailure: function (error) {
                context._clearSuggestedLocation();
            }
        });
        var map = this.getMap();
        map.on('click', this._hideSuggestedLocation, this);
        map.on('pointerdrag', this._hideSuggestedLocation, this);
    };
    LocationSelector.prototype.onAutoCompletedResultsItemClick = function (e) {
        var idx = SelectorID.index(e.target.id);
        if (!idx) {
            return;
        }
        var position = [
            this._suggestedLocations[idx].position.x,
            this._suggestedLocations[idx].position.y
        ];
        this._coordinate = position;
        var info = {
            type: this._suggestedLocations[idx].type,
            fields: this._suggestedLocations[idx]
        };
        var label = this._suggestedLocations[idx].fullText;
        this._setLabel(label);
        var view = this.getMap().getView();
        var mapProj = view.getProjection().getCode();
        if (mapProj !== 'EPSG:4326') {
            position = ol.proj.transform(position, 'EPSG:4326', mapProj);
        }
        this._setPosition(position);
        this._setMarker(position, info, this.options.displayInfo);
    };
    LocationSelector.prototype.onActivateMapPointClick = function () {
        var map = this.getMap();
        if (this._inputShowPointerContainer.checked) {
            this._clearResults();
            map.on('click', this.onMouseMapClick, this);
            this._setCursor('crosshair');
        } else {
            map.un('click', this.onMouseMapClick, this);
            this._setCursor();
        }
    };
    LocationSelector.prototype.onLocationClearPointClick = function () {
        this._setCursor();
        this._clearResults();
    };
    LocationSelector.prototype.onLocationRemovePointClick = function () {
        this._setCursor();
        this._clearResults();
    };
    LocationSelector.prototype.onLocationAddPointClick = function (e) {
    };
    LocationSelector.prototype.onMouseMapClick = function (e) {
        var coordinate = e.coordinate;
        if (!e.map || !e.map.getView()) {
            return;
        }
        var crs = e.map.getView().getProjection();
        this._setCoordinate(coordinate, crs);
        this._setMarker([
            coordinate[0],
            coordinate[1]
        ], null, false);
        this.onActivateMapPointClick(e);
    };
    LocationSelector.prototype._setLabel = function (label) {
        this._inputAutoCompleteContainer.value = label;
    };
    LocationSelector.prototype._setCursor = function (cursor) {
        var map = this.getMap();
        var div = map.getTargetElement();
        if (cursor) {
            div.style.cursor = cursor;
        } else {
            div.style.cursor = null;
        }
    };
    LocationSelector.prototype._setCoordinate = function (olCoordinate, crs) {
        this._coordinate = ol.proj.transform(olCoordinate, crs, 'EPSG:4326');
        var lat = this._coordinate[0].toFixed(4);
        var lng = this._coordinate[1].toFixed(4);
        var value = lat + ' / ' + lng;
        this.GPdisplayCoordinate(value);
    };
    LocationSelector.prototype._setPosition = function (position) {
        var view = this.getMap().getView();
        view.setCenter(position);
    };
    LocationSelector.prototype._setMarker = function (position, information, display) {
        var map = this.getMap();
        if (this._marker != null) {
            map.removeOverlay(this._marker);
            this._marker = null;
        }
        if (position) {
            var markerDiv = document.createElement('img');
            markerDiv.src = this._markerUrl;
            this._marker = new ol.Overlay({
                position: position,
                offset: this._markerOffset,
                element: markerDiv,
                stopEvent: false
            });
            map.addOverlay(this._marker);
            if (display) {
            }
        }
    };
    LocationSelector.prototype._clearResults = function () {
        var map = this.getMap();
        this._currentLocation = null;
        this._coordinate = null;
        this._hideSuggestedLocation();
        this._clearSuggestedLocation();
        this._setMarker();
        map.un('click', this.onMouseMapClick, this);
    };
    LocationSelector.prototype._clearSuggestedLocation = function () {
        this._suggestedLocations = [];
        if (this._suggestedContainer) {
            while (this._suggestedContainer.firstChild) {
                this._suggestedContainer.removeChild(this._suggestedContainer.firstChild);
            }
        }
    };
    LocationSelector.prototype._hideSuggestedLocation = function () {
        if (this._suggestedContainer) {
            this._suggestedContainer.style.display = 'none';
        }
    };
    LocationSelector.prototype._displaySuggestedLocation = function () {
        if (this._suggestedContainer) {
            this._suggestedContainer.style.display = 'block';
        }
    };
    LocationSelector.prototype._requestAutoComplete = function (settings) {
        if (!settings || Object.keys(settings).length === 0) {
            return;
        }
        if (!settings.text) {
            return;
        }
        var options = {};
        Utils.assign(options, this.options.autocompleteOptions);
        Utils.assign(options, settings);
        var resources = this._resources['AutoCompletion'] || null;
        if (resources && Array.isArray(resources)) {
            if (!options.filterOptions) {
                options.filterOptions = {};
            }
            options.filterOptions.type = resources;
        }
        options.apiKey = options.apiKey || this.options.apiKey;
        Gp.Services.autoComplete(options);
    };
    LocationSelector.prototype._fillAutoCompletedLocationListContainer = function (locations) {
        if (!locations || locations.length === 0) {
            return;
        }
        var element = this._suggestedContainer;
        if (element.childElementCount) {
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
        }
        for (var i = 0; i < locations.length; i++) {
            this._createLocationAutoCompletedLocationElement(this.options.tag.id, locations[i], i);
        }
        this._suggestedLocations = locations;
    };
    return LocationSelector;
}(ol, Ol3Utils, {}, gp, CommonUtilsCheckRightManagement, CommonUtilsSelectorID, CommonControlsLocationSelectorDOM, Ol3ControlsUtilsMarkers);
CommonControlsRouteDOM = function (ID) {
    var RouteDOM = {
        _addUID: function (id) {
            var uid = this._uid ? id + '-' + this._uid : id;
            return uid;
        },
        _createMainContainerElement: function () {
            var container = document.createElement('div');
            container.id = this._addUID('GProute');
            container.className = 'GPwidget';
            return container;
        },
        _createShowRouteElement: function () {
            var input = document.createElement('input');
            input.id = this._addUID('GPshowRoute');
            input.type = 'checkbox';
            return input;
        },
        _createShowRoutePictoElement: function () {
            var context = this;
            var label = document.createElement('label');
            label.id = this._addUID('GPshowRoutePicto');
            label.className = 'GPshowAdvancedToolPicto';
            label.htmlFor = this._addUID('GPshowRoute');
            label.title = 'Ouvrir le calcul d\'itinéraire';
            if (label.addEventListener) {
                label.addEventListener('click', function (e) {
                    context.onShowRoutePanelClick(e);
                });
            } else if (label.attachEvent) {
                label.attachEvent('onclick', function (e) {
                    context.onShowRoutePanelClick(e);
                });
            }
            var spanOpen = document.createElement('span');
            spanOpen.id = this._addUID('GPshowRouteOpen');
            spanOpen.className = 'GPshowAdvancedToolOpen';
            label.appendChild(spanOpen);
            return label;
        },
        _createRoutePanelElement: function () {
            var div = document.createElement('div');
            div.id = this._addUID('GProutePanel');
            div.className = 'GPpanel';
            return div;
        },
        _createRoutePanelHeaderElement: function () {
            var self = this;
            var container = document.createElement('div');
            container.className = 'GPpanelHeader';
            var div = document.createElement('div');
            div.className = 'GPpanelTitle';
            div.innerHTML = 'Calcul d\'itinéraire';
            container.appendChild(div);
            var divClose = document.createElement('div');
            divClose.id = this._addUID('GProutePanelClose');
            divClose.className = 'GPpanelClose';
            divClose.title = 'Masquer le panneau';
            if (divClose.addEventListener) {
                divClose.addEventListener('click', function () {
                    document.getElementById(self._addUID('GPshowRoutePicto')).click();
                }, false);
            } else if (divClose.attachEvent) {
                divClose.attachEvent('onclick', function () {
                    document.getElementById(self._addUID('GPshowRoutePicto')).click();
                });
            }
            container.appendChild(divClose);
            return container;
        },
        _createRoutePanelFormElement: function () {
            var self = this;
            var form = document.createElement('form');
            form.id = this._addUID('GProuteForm');
            form.setAttribute('onkeypress', 'return event.keyCode != 13;');
            form.addEventListener('submit', function (e) {
                console.log(e);
                e.preventDefault();
                var points = document.getElementsByClassName(self._addUID('GPlocationPoint'));
                var start = points[0].childNodes[0].id;
                var end = points[points.length - 1].childNodes[0].id;
                var startID = ID.index(start);
                var endID = ID.index(end);
                if (document.getElementById(self._addUID('GPlocationOrigin_' + startID)).value == '' && document.getElementById(self._addUID('GPlocationOriginCoords_' + startID)).value == '' || document.getElementById(self._addUID('GPlocationOrigin_' + endID)).value == '' && document.getElementById(self._addUID('GPlocationOriginCoords_' + endID)).value == '') {
                    return false;
                }
                var id;
                document.getElementById(self._addUID('GProuteResultsStages')).innerHTML = '';
                for (var i = 0; i < points.length; i++) {
                    var tag = points[i].childNodes[0].id;
                    id = ID.index(tag);
                    if (document.getElementById(self._addUID('GPlocationPoint_' + id)).className == 'GPflexInput GPlocationStageFlexInput') {
                        var resultStage = document.createElement('div');
                        resultStage.className = 'GProuteResultsStages';
                        var resultStageLabel = document.createElement('div');
                        resultStageLabel.className = 'GProuteResultStageLabel';
                        resultStageLabel.innerHTML = document.getElementById(self._addUID('GPlocationOriginLabel_' + id)).innerHTML + ' :';
                        resultStage.appendChild(resultStageLabel);
                        var resultStageValue = document.createElement('div');
                        resultStageValue.className = 'GProuteResultStageValue';
                        var elementCoords = document.getElementById(self._addUID('GPlocationOriginCoords_' + id));
                        var stageCoords = elementCoords.value;
                        var visible = elementCoords.className === 'GPlocationOriginVisible' ? true : false;
                        if (stageCoords != null && stageCoords != '' && visible) {
                            resultStageValue.innerHTML = stageCoords;
                        } else {
                            resultStageValue.innerHTML = document.getElementById(self._addUID('GPlocationOrigin_' + id)).value;
                        }
                        resultStage.appendChild(resultStageValue);
                        if (resultStageValue.innerHTML != '') {
                            document.getElementById(self._addUID('GProuteResultsStages')).appendChild(resultStage);
                        }
                    }
                }
                var modeComputation = null;
                if (document.getElementById(self._addUID('GProuteComputationSelect'))) {
                    var select = document.getElementById(self._addUID('GProuteResultsComputationSelect'));
                    select.selectedIndex = document.getElementById(self._addUID('GProuteComputationSelect')).selectedIndex;
                    modeComputation = select.options[select.selectedIndex].value;
                }
                var modeTransport = null;
                if (document.getElementById(self._addUID('GProuteTransportCar'))) {
                    if (document.getElementById(self._addUID('GProuteTransportCar')).checked) {
                        modeTransport = document.getElementById(self._addUID('GProuteTransportCar')).value;
                    }
                }
                if (document.getElementById(self._addUID('GProuteTransportPedestrian'))) {
                    if (document.getElementById(self._addUID('GProuteTransportPedestrian')).checked) {
                        modeTransport = document.getElementById(self._addUID('GProuteTransportPedestrian')).value;
                    }
                }
                var exclusions = [];
                var exclusionsElement = document.getElementsByClassName('GProuteExclusionsOption');
                for (var j = 0; j < exclusionsElement.length; j++) {
                    id = exclusionsElement[j].htmlFor;
                    var el = document.getElementById(id);
                    if (!el.checked) {
                        exclusions.push(el.value);
                    }
                }
                self.onRouteComputationSubmit({
                    computation: modeComputation,
                    transport: modeTransport,
                    exclusions: exclusions
                });
                return false;
            });
            return form;
        },
        _createRoutePanelResultsElement: function () {
            var container = document.createElement('div');
            container.id = this._addUID('GProuteResultsPanel');
            container.className = 'GProuteComponentHidden';
            container.appendChild(this._createRouteResultsStagesElement());
            container.appendChild(this._createRouteResultsElement());
            var divBorderUp = document.createElement('div');
            divBorderUp.className = 'GPfakeBorder GPfakeBorderLeft';
            container.appendChild(divBorderUp);
            container.appendChild(this._createRouteShowResultsDetailsElement());
            var labelShow = document.createElement('label');
            labelShow.htmlFor = this._addUID('GProuteResultsShowDetails');
            labelShow.innerHTML = 'Afficher le détail';
            container.appendChild(labelShow);
            var labelHide = document.createElement('label');
            labelHide.htmlFor = this._addUID('GProuteResultsShowDetails');
            labelHide.innerHTML = 'Masquer le détail';
            container.appendChild(labelHide);
            var divBorderDown = document.createElement('div');
            divBorderDown.className = 'GPfakeBorder';
            container.appendChild(divBorderDown);
            container.appendChild(this._createRouteResultsDetailsElement());
            return container;
        },
        _createRouteWaitingElement: function () {
            var div = document.createElement('div');
            div.id = this._addUID('GProuteCalcWaitingContainer');
            div.className = 'GProuteCalcWaitingContainerHidden';
            var p = document.createElement('p');
            p.className = 'GProuteCalcWaiting';
            p.innerHTML = 'Calcul en cours...';
            div.appendChild(p);
            return div;
        },
        _createRouteResultsStagesElement: function () {
            var div = document.createElement('div');
            div.id = this._addUID('GProuteResultsStages');
            return div;
        },
        _createRouteResultsElement: function () {
            var self = this;
            var container = document.createElement('div');
            container.id = this._addUID('GProuteResults');
            var divValue = document.createElement('div');
            divValue.id = this._addUID('GProuteResultsValues');
            container.appendChild(divValue);
            var divMode = document.createElement('div');
            divMode.id = this._addUID('GProuteResultsMode');
            var select = document.createElement('select');
            select.id = this._addUID('GProuteResultsComputationSelect');
            select.className = 'GPinputSelect';
            select.addEventListener('change', function (e) {
                self.onRouteModeComputationChangeAndRun(e);
            });
            var computes = [
                {
                    code: 'fastest',
                    label: 'Plus rapide'
                },
                {
                    code: 'shortest',
                    label: 'Plus court'
                }
            ];
            for (var i = 0; i < computes.length; i++) {
                var option = document.createElement('option');
                option.value = computes[i].code;
                option.text = computes[i].label;
                select.appendChild(option);
            }
            divMode.appendChild(select);
            container.appendChild(divMode);
            var divNew = document.createElement('div');
            divNew.id = this._addUID('GProuteResultsNew');
            divNew.title = 'Modifier le calcul';
            divNew.addEventListener('click', function (e) {
                document.getElementById(self._addUID('GProuteResultsPanel')).className = 'GProuteComponentHidden';
                document.getElementById(self._addUID('GProuteForm')).className = '';
                self.onShowRouteResultsNewClick(e);
            });
            container.appendChild(divNew);
            return container;
        },
        _addRouteResultsValuesElement: function (distance, duration, fconvert) {
            var div = document.getElementById(this._addUID('GProuteResultsValues'));
            if (div.childElementCount) {
                while (div.firstChild) {
                    div.removeChild(div.firstChild);
                }
            }
            var containerDistance = document.createElement('div');
            containerDistance.className = 'GProuteResultsValue';
            var labelDistance = document.createElement('label');
            labelDistance.className = 'GProuteResultsValueLabel';
            labelDistance.innerHTML = 'Distance :';
            containerDistance.appendChild(labelDistance);
            var distanceLabel = 0;
            var isKm = parseInt(distance / 1000, 10);
            if (!isKm) {
                distanceLabel = Math.round(distance) + ' m';
            } else {
                var distanceArrondi = Math.round(distance);
                distanceArrondi = distanceArrondi / 1000;
                distanceLabel = distanceArrondi + ' km';
            }
            var divDistance = document.createElement('div');
            divDistance.id = this._addUID('GProuteResultsValueDist');
            divDistance.innerHTML = distanceLabel;
            containerDistance.appendChild(divDistance);
            div.appendChild(containerDistance);
            var containerDuration = document.createElement('div');
            containerDuration.className = 'GProuteResultsValue';
            var labelDuration = document.createElement('label');
            labelDuration.className = 'GProuteResultsValueLabel';
            labelDuration.innerHTML = 'Durée :';
            containerDuration.appendChild(labelDuration);
            var divDuration = document.createElement('div');
            divDuration.id = this._addUID('GProuteResultsValueDist');
            divDuration.innerHTML = fconvert(duration);
            containerDuration.appendChild(divDuration);
            div.appendChild(containerDuration);
            return div;
        },
        _createRouteShowResultsDetailsElement: function () {
            var input = document.createElement('input');
            input.id = this._addUID('GProuteResultsShowDetails');
            input.type = 'checkbox';
            return input;
        },
        _createRouteResultsDetailsElement: function () {
            var div = document.createElement('div');
            div.id = this._addUID('GProuteResultsDetails');
            return div;
        },
        _addRouteResultsDetailsElement: function (instructions, fconvert) {
            var context = this;
            var div = document.getElementById(this._addUID('GProuteResultsDetails'));
            if (div.childElementCount) {
                while (div.firstChild) {
                    div.removeChild(div.firstChild);
                }
            }
            var distanceCumul = 0;
            var durationCumul = 0;
            for (var i = 0; i < instructions.length; i++) {
                var id = i + 1;
                var o = instructions[i];
                var divNum = document.createElement('div');
                divNum.className = 'GProuteResultsDetailsNumber';
                divNum.innerHTML = id + '.';
                div.appendChild(divNum);
                durationCumul += parseFloat(o.duration);
                distanceCumul += parseFloat(o.distance);
                var distance = 0;
                var isCumulKm = parseInt(distanceCumul / 1000, 10);
                if (!isCumulKm) {
                    distance = Math.round(distanceCumul) + ' m';
                } else {
                    var distanceArrondi = Math.round(distanceCumul);
                    distanceArrondi = distanceArrondi / 1000;
                    distance = distanceArrondi + ' km';
                }
                var divIns = document.createElement('div');
                divIns.className = 'GProuteResultsDetailsInstruction';
                divIns.id = this._addUID('GProuteResultsDetailsInstruction_' + id);
                divIns.title = 'distance : ' + distance + ' / ' + 'temps : ' + fconvert(durationCumul);
                divIns.innerHTML = o.instruction;
                divIns.addEventListener('mouseover', function (e) {
                    context.onRouteResultsDetailsMouseOver(e);
                });
                divIns.addEventListener('mouseout', function (e) {
                    context.onRouteResultsDetailsMouseOut(e);
                });
                divIns.addEventListener('click', function (e) {
                    if (typeof context.onRouteResultsDetailsClick === 'function') {
                        context.onRouteResultsDetailsClick(e);
                    }
                });
                div.appendChild(divIns);
            }
            return div;
        },
        _createRoutePanelFormPointElement: function (n, text, visibility) {
            var context = this;
            var div = document.createElement('div');
            div.id = 'GProutePoint' + n;
            div.className = visibility ? 'GPflexInput GProuteStageFlexInput' : 'GPflexInput GProuteStageFlexInputHidden';
            var labelOrigin = document.createElement('label');
            labelOrigin.id = 'GProuteOriginLabel' + n;
            labelOrigin.htmlFor = 'GProuteOrigin' + n;
            labelOrigin.innerHTML = text;
            labelOrigin.addEventListener('click', function () {
                var i = this.id.charAt(this.id.length - 1);
                document.getElementById('GProuteOriginCoords' + i).value = '';
                for (var j = 1; j < 8; j++) {
                    document.getElementById('GProutePoint' + j).style.display = 'flex';
                }
                document.getElementById('GProuteForm').className = '';
                document.getElementById('GProuteOriginPointer' + i).checked = false;
                document.getElementById('GProuteOrigin' + i).className = 'GProuteOriginVisible';
                document.getElementById('GProuteOriginCoords' + i).className = 'GProuteOriginHidden';
            });
            div.appendChild(labelOrigin);
            var inputOrigin = document.createElement('input');
            inputOrigin.id = 'GProuteOrigin' + n;
            inputOrigin.className = 'GProuteOriginVisible';
            inputOrigin.type = 'text';
            inputOrigin.placeholder = 'Saisir une adresse';
            inputOrigin.addEventListener('keyup', function (e) {
                var charCode = e.which || e.keyCode;
                if (charCode === 13 || charCode === 10) {
                    return;
                }
                var i = this.id.charAt(this.id.length - 1);
                if (document.getElementById('GProuteOrigin' + i).value.length > 2) {
                    document.getElementById('GProuteAutoCompleteList' + i).style.display = 'block';
                } else {
                    document.getElementById('GProuteAutoCompleteList' + i).style.display = 'none';
                }
                context.onAutoCompleteSearchText(e);
            });
            inputOrigin.addEventListener('blur', function () {
                var i = this.id.charAt(this.id.length - 1);
                document.getElementById('GProuteAutoCompleteList' + i).style.display = 'none';
            });
            div.appendChild(inputOrigin);
            var inputOriginCoord = document.createElement('input');
            inputOriginCoord.id = 'GProuteOriginCoords' + n;
            inputOriginCoord.className = 'GProuteOriginHidden';
            inputOriginCoord.type = 'text';
            inputOriginCoord.disabled = true;
            div.appendChild(inputOriginCoord);
            var inputOriginPointer = document.createElement('input');
            inputOriginPointer.id = 'GProuteOriginPointer' + n;
            inputOriginPointer.type = 'checkbox';
            div.appendChild(inputOriginPointer);
            var labelOriginPointer = document.createElement('label');
            labelOriginPointer.id = 'GProuteOriginPointerImg' + n;
            labelOriginPointer.htmlFor = 'GProuteOriginPointer' + n;
            labelOriginPointer.className = 'GProuteOriginPointerImg';
            labelOriginPointer.title = 'Pointer un lieu sur la carte';
            labelOriginPointer.addEventListener('click', function (evt) {
                evt.preventDefault();
                evt.stopPropagation();
                var i = this.id.charAt(this.id.length - 1);
                var j;
                for (j = 1; j < 8; j++) {
                    if (i != j) {
                        document.getElementById('GProuteOriginPointer' + j).checked = false;
                        if (document.getElementById('GProuteOriginCoords' + j).value == 'Pointer un lieu sur la carte') {
                            document.getElementById('GProuteOriginCoords' + j).value = '';
                            document.getElementById('GProuteOrigin' + j).className = 'GProuteOriginVisible';
                            document.getElementById('GProuteOriginCoords' + j).className = 'GProuteOriginHidden';
                        }
                    }
                }
                if (document.getElementById('GProuteOriginPointer' + i).checked) {
                    document.getElementById('GProuteOriginCoords' + i).value = '';
                    for (j = 1; j < 8; j++) {
                        document.getElementById('GProutePoint' + j).style.display = 'flex';
                    }
                    document.getElementById('GProuteForm').className = '';
                    document.getElementById('GProuteOriginPointer' + i).checked = false;
                    document.getElementById('GProuteOrigin' + i).className = 'GProuteOriginVisible';
                    document.getElementById('GProuteOriginCoords' + i).className = 'GProuteOriginHidden';
                } else {
                    document.getElementById('GProuteOriginCoords' + i).value = 'Pointer un lieu sur la carte';
                    for (j = 1; j < 8; j++) {
                        if (i == j) {
                            document.getElementById('GProutePoint' + j).style.display = 'flex';
                        } else {
                            document.getElementById('GProutePoint' + j).style.display = 'none';
                        }
                    }
                    document.getElementById('GProuteForm').className = 'GProuteFormMini';
                    document.getElementById('GProuteOriginPointer' + i).checked = true;
                    document.getElementById('GProuteOrigin' + i).className = 'GProuteOriginHidden';
                    document.getElementById('GProuteOriginCoords' + i).className = 'GProuteOriginVisible';
                }
                context.onRouteMapPointClick(evt);
            });
            div.appendChild(labelOriginPointer);
            return div;
        },
        _createRoutePanelFormRemoveStageElement: function (n) {
            var context = this;
            var divRm = document.createElement('div');
            divRm.id = 'GProuteStageRemove' + n;
            divRm.className = 'GProuteStageRemove';
            divRm.title = 'Supprimer l\'étape';
            if (n != 1 && n != 7) {
                divRm.addEventListener('click', function (e) {
                    var i = this.id.charAt(this.id.length - 1);
                    document.getElementById('GProutePoint' + i).className = 'GPflexInput GProuteStageFlexInputHidden';
                    document.getElementById('GProuteOrigin' + i).value = '';
                    document.getElementById('GProuteOrigin' + i).className = 'GProuteOriginVisible';
                    document.getElementById('GProuteOriginCoords' + i).value = '';
                    document.getElementById('GProuteOriginCoords' + i).className = 'GProuteOriginHidden';
                    document.getElementById('GProuteStageAdd').style.display = '';
                    var exclusionsPictoTop = document.getElementById('GPshowRouteExclusionsPicto').style.top;
                    document.getElementById('GPshowRouteExclusionsPicto').style.top = (parseInt(exclusionsPictoTop, 10) - 33).toString() + 'px';
                    context.onRouteRemovePointClick(e);
                });
            }
            return divRm;
        },
        _createRoutePanelFormAddStageElement: function () {
            var context = this;
            var divAdd = document.createElement('div');
            divAdd.id = 'GProuteStageAdd';
            divAdd.title = 'Ajouter une étape';
            divAdd.addEventListener('click', function (e) {
                var lastStage = 1;
                var nbStages = 0;
                for (var i = 2; i < 7; i++) {
                    if (document.getElementById('GProutePoint' + i).className == 'GPflexInput GProuteStageFlexInputHidden') {
                        if (lastStage == 1) {
                            lastStage = i;
                        }
                    } else {
                        nbStages++;
                    }
                }
                if (lastStage < 7) {
                    document.getElementById('GProutePoint' + lastStage).className = 'GPflexInput GProuteStageFlexInput';
                    var exclusionsPictoTop = document.getElementById('GPshowRouteExclusionsPicto').style.top;
                    document.getElementById('GPshowRouteExclusionsPicto').style.top = (parseInt(exclusionsPictoTop, 10) + 33).toString() + 'px';
                }
                if (nbStages == 4) {
                    document.getElementById('GProuteStageAdd').style.display = 'none';
                }
                context.onRouteAddPointClick(e);
            });
            return divAdd;
        },
        _createRoutePanelFormAutoCompleteListElement: function (n) {
            var context = this;
            var div = document.createElement('div');
            div.id = 'GProuteAutoCompleteList' + n;
            div.className = 'GPadvancedAutoCompleteList';
            if (div.addEventListener) {
                div.addEventListener('click', function (e) {
                    context.onAutoCompletedResultsItemClick(e);
                    document.getElementById('GProuteAutoCompleteList' + n).style.display = 'none';
                }, false);
            } else if (div.attachEvent) {
                div.attachEvent('onclick', function (e) {
                    context.onAutoCompletedResultsItemClick(e);
                    document.getElementById('GProuteAutoCompleteList' + n).style.display = 'none';
                });
            }
            return div;
        },
        _createRouteAutoCompletedLocationElement: function (location, n, id) {
            var container = document.getElementById('GProuteAutoCompleteList' + n);
            var div = document.createElement('div');
            div.id = 'AutoCompletedLocation' + id;
            div.className = 'GPautoCompleteProposal';
            div.innerHTML = location.fullText;
            container.appendChild(div);
        },
        _createRoutePanelFormModeChoiceElement: function () {
            var div = document.createElement('div');
            div.id = this._addUID('GProuteModeChoice');
            return div;
        },
        _createRoutePanelFormModeChoiceTransportElement: function (transports) {
            var context = this;
            var div = document.createElement('div');
            div.id = this._addUID('GProuteTransportChoice');
            var span = document.createElement('span');
            span.className = 'GProuteModeLabel';
            span.innerHTML = 'Mode de transport';
            div.appendChild(span);
            for (var i = 0; i < transports.length; i++) {
                var transport = transports[i];
                if (transport === 'Voiture') {
                    var inputCar = document.createElement('input');
                    inputCar.id = this._addUID('GProuteTransportCar');
                    inputCar.type = 'radio';
                    inputCar.name = 'GProuteTransport';
                    inputCar.value = 'Voiture';
                    if (i === 0) {
                        inputCar.checked = true;
                    }
                    if (inputCar.addEventListener) {
                        inputCar.addEventListener('change', function (e) {
                            context.onRouteModeTransportChange(e);
                        });
                    } else if (inputCar.attachEvent) {
                        inputCar.attachEvent('onchange', function (e) {
                            context.onRouteModeTransportChange(e);
                        });
                    }
                    div.appendChild(inputCar);
                    var labelCar = document.createElement('label');
                    labelCar.className = 'GProuteTransportImg';
                    labelCar.htmlFor = this._addUID('GProuteTransportCar');
                    labelCar.title = 'Voiture';
                    div.appendChild(labelCar);
                }
                if (transport === 'Pieton') {
                    var inputPedestrian = document.createElement('input');
                    inputPedestrian.id = this._addUID('GProuteTransportPedestrian');
                    inputPedestrian.type = 'radio';
                    inputPedestrian.name = 'GProuteTransport';
                    inputPedestrian.value = 'Pieton';
                    if (i === 0) {
                        inputPedestrian.checked = true;
                    }
                    if (inputPedestrian.addEventListener) {
                        inputPedestrian.addEventListener('change', function (e) {
                            context.onRouteModeTransportChange(e);
                        });
                    } else if (inputPedestrian.attachEvent) {
                        inputPedestrian.attachEvent('onchange', function (e) {
                            context.onRouteModeTransportChange(e);
                        });
                    }
                    div.appendChild(inputPedestrian);
                    var labelPedestrian = document.createElement('label');
                    labelPedestrian.className = 'GProuteTransportImg';
                    labelPedestrian.htmlFor = this._addUID('GProuteTransportPedestrian');
                    labelPedestrian.title = 'Piéton';
                    div.appendChild(labelPedestrian);
                }
            }
            return div;
        },
        _createRoutePanelFormModeChoiceComputeElement: function () {
            var context = this;
            var div = document.createElement('div');
            div.id = this._addUID('GProuteComputationChoice');
            var span = document.createElement('span');
            span.className = 'GProuteModeLabel';
            span.innerHTML = 'Mode de calcul';
            div.appendChild(span);
            var select = document.createElement('select');
            select.id = this._addUID('GProuteComputationSelect');
            select.className = 'GPinputSelect';
            select.addEventListener('change', function (e) {
                context.onRouteModeComputationChange(e);
            });
            var computes = [
                {
                    code: 'fastest',
                    label: 'Plus rapide'
                },
                {
                    code: 'shortest',
                    label: 'Plus court'
                }
            ];
            for (var i = 0; i < computes.length; i++) {
                var option = document.createElement('option');
                option.value = computes[i].code;
                option.text = computes[i].label;
                select.appendChild(option);
            }
            div.appendChild(select);
            return div;
        },
        _createShowRouteExclusionsElement: function () {
            var input = document.createElement('input');
            input.id = this._addUID('GPshowRouteExclusions');
            input.type = 'checkbox';
            return input;
        },
        _createShowRouteExclusionsPictoElement: function () {
            var context = this;
            var label = document.createElement('label');
            label.id = this._addUID('GPshowRouteExclusionsPicto');
            label.className = 'GPshowMoreOptions GPshowRouteExclusionsPicto';
            label.htmlFor = this._addUID('GPshowRouteExclusions');
            label.title = 'Exclusions';
            label.style.top = '185px';
            if (label.addEventListener) {
                label.addEventListener('click', function (e) {
                    context.onShowRouteExclusionsClick(e);
                });
            } else if (label.attachEvent) {
                label.attachEvent('onclick', function (e) {
                    context.onShowRouteExclusionsClick(e);
                });
            }
            return label;
        },
        _createRoutePanelFormExclusionsElement: function () {
            var div = document.createElement('div');
            div.id = this._addUID('GProuteExclusions');
            var span = document.createElement('span');
            span.className = 'GProuteExclusionsLabel';
            span.innerHTML = 'Passages autorisés';
            div.appendChild(span);
            return div;
        },
        _createRoutePanelFormExclusionOptionsElement: function (exclusions) {
            var context = this;
            var div = document.createElement('div');
            div.className = 'GProuteExclusionsOptions';
            for (var value in exclusions) {
                if (exclusions.hasOwnProperty(value)) {
                    var status = exclusions[value];
                    switch (value) {
                    case 'toll':
                        var inputToll = document.createElement('input');
                        inputToll.id = this._addUID('GProuteExclusionsToll');
                        inputToll.type = 'checkbox';
                        inputToll.value = 'Toll';
                        inputToll.checked = !status;
                        if (inputToll.addEventListener) {
                            inputToll.addEventListener('change', function (e) {
                                context.onRouteExclusionsChange(e);
                            });
                        } else if (inputToll.attachEvent) {
                            inputToll.attachEvent('onchange', function (e) {
                                context.onRouteExclusionsChange(e);
                            });
                        }
                        div.appendChild(inputToll);
                        var labelToll = document.createElement('label');
                        labelToll.className = 'GProuteExclusionsOption';
                        labelToll.htmlFor = this._addUID('GProuteExclusionsToll');
                        labelToll.innerHTML = 'Péages';
                        div.appendChild(labelToll);
                        break;
                    case 'tunnel':
                        var inputTunnel = document.createElement('input');
                        inputTunnel.id = this._addUID('GProuteExclusionsTunnel');
                        inputTunnel.type = 'checkbox';
                        inputTunnel.value = 'Tunnel';
                        inputTunnel.checked = !status;
                        if (inputTunnel.addEventListener) {
                            inputTunnel.addEventListener('change', function (e) {
                                context.onRouteExclusionsChange(e);
                            });
                        } else if (inputTunnel.attachEvent) {
                            inputTunnel.attachEvent('onchange', function (e) {
                                context.onRouteExclusionsChange(e);
                            });
                        }
                        div.appendChild(inputTunnel);
                        var labelTunnel = document.createElement('label');
                        labelTunnel.className = 'GProuteExclusionsOption';
                        labelTunnel.htmlFor = this._addUID('GProuteExclusionsTunnel');
                        labelTunnel.innerHTML = 'Tunnels';
                        div.appendChild(labelTunnel);
                        break;
                    case 'bridge':
                        var inputBridge = document.createElement('input');
                        inputBridge.id = this._addUID('GProuteExclusionsBridge');
                        inputBridge.type = 'checkbox';
                        inputBridge.value = 'Bridge';
                        inputBridge.checked = !status;
                        if (inputBridge.addEventListener) {
                            inputBridge.addEventListener('change', function (e) {
                                context.onRouteExclusionsChange(e);
                            });
                        } else if (inputBridge.attachEvent) {
                            inputBridge.attachEvent('onchange', function (e) {
                                context.onRouteExclusionsChange(e);
                            });
                        }
                        div.appendChild(inputBridge);
                        var labelBridge = document.createElement('label');
                        labelBridge.className = 'GProuteExclusionsOption';
                        labelBridge.htmlFor = this._addUID('GProuteExclusionsBridge');
                        labelBridge.innerHTML = 'Ponts';
                        div.appendChild(labelBridge);
                        break;
                    }
                }
            }
            return div;
        },
        _createRouteSubmitFormElement: function () {
            var input = document.createElement('input');
            input.id = this._addUID('GProuteSubmit');
            input.className = 'GPinputSubmit';
            input.type = 'submit';
            input.value = 'Calculer';
            return input;
        },
        _createRouteFormResetElement: function () {
            var self = this;
            var divReset = document.createElement('div');
            divReset.id = this._addUID('GProuteReset');
            divReset.title = 'Réinitialiser les paramètres';
            divReset.addEventListener('click', function (e) {
                self.onRouteResetClick(e);
            });
            return divReset;
        }
    };
    return RouteDOM;
}(CommonUtilsSelectorID);
Ol3ControlsRoute = function (ol, Gp, Utils, woodman, RightManagement, SelectorID, LocationSelector, LayerSwitcher, Markers, RouteDOM) {
    function Route(options) {
        options = options || {};
        if (!(this instanceof Route)) {
            throw new TypeError('ERROR CLASS_CONSTRUCTOR');
        }
        this.initialize(options);
        this._container = this._createMainContainerElement();
        this._containerElement = null;
        if (options.element && options.element.appendChild) {
            options.element.appendChild(this._container);
            this._containerElement = options.element;
        }
        ol.control.Control.call(this, {
            element: this._containerElement || this._container,
            target: options.target,
            render: options.render
        });
    }
    ol.inherits(Route, ol.control.Control);
    Route.prototype = Object.create(ol.control.Control.prototype, {});
    Utils.assign(Route.prototype, RouteDOM);
    Route.prototype.constructor = Route;
    Route.prototype.getCollapsed = function () {
        return this.collapsed;
    };
    Route.prototype.setCollapsed = function (collapsed) {
        if (collapsed === undefined) {
            console.log('[ERROR] Route:setCollapsed - missing collapsed parameter');
            return;
        }
        if (collapsed && this.collapsed || !collapsed && !this.collapsed) {
            return;
        }
        if (collapsed) {
            document.getElementById('GProutePanelClose-' + this._uid).click();
        } else {
            document.getElementById('GPshowRoute-' + this._uid).click();
        }
        this.collapsed = collapsed;
    };
    Route.prototype.getLayer = function () {
        return this._geojsonSections;
    };
    Route.prototype.setMap = function (map) {
        if (map) {
            this._container = this._initContainer(map);
        }
        ol.control.Control.prototype.setMap.call(this, map);
    };
    Route.prototype.initialize = function (options) {
        this._checkInputOptions(options);
        this.options = {
            collapsed: true,
            graphs: [
                'Voiture',
                'Pieton'
            ],
            exclusions: {
                toll: false,
                tunnel: false,
                bridge: false
            },
            routeOptions: {},
            autocompleteOptions: {}
        };
        Utils.assign(this.options, options);
        var defaultMarkersOpts = {
            departure: {
                url: Markers['red'],
                offset: Markers.defaultOffset
            },
            stages: {
                url: Markers['lightOrange'],
                offset: Markers.defaultOffset
            },
            arrival: {
                url: Markers['darkOrange'],
                offset: Markers.defaultOffset
            }
        };
        this.options.markersOpts = Utils.assign(defaultMarkersOpts, options.markersOpts);
        this.collapsed = this.options.collapsed;
        this._uid = SelectorID.generate();
        this._waitingContainer = null;
        this._formRouteContainer = null;
        this._resultsRouteContainer = null;
        this._showRouteExclusionsElement = null;
        this._currentPoints = [];
        this._currentTransport = null;
        this._initTransport();
        this._currentComputation = null;
        this._initComputation();
        this._currentExclusions = [];
        this._initExclusions();
        this._waiting = false;
        this._timer = null;
        this._geojsonRoute = null;
        this._geojsonSections = null;
        this._popupContent = null;
        this._popupDiv = this._initPopupDiv();
        this._popupOverlay = null;
        this._resultsSelectInteraction = null;
        this._resultsHoverInteraction = null;
        this._defaultFeatureStyle = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'rgba(0,183,152,0.9)',
                width: 12
            })
        });
        this._selectedFeatureStyle = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'rgba(255,102,0,0.9)',
                width: 12
            })
        });
        this._currentRouteInformations = null;
        this._resources = {};
        this._noRightManagement = false;
        this._checkRightsManagement();
    };
    Route.prototype._checkInputOptions = function (options) {
        if (options.graphs) {
            if (Array.isArray(options.graphs)) {
                if (options.graphs.length === 0) {
                    options.graphs = null;
                } else {
                    for (var i = 0; i < options.graphs.length; i++) {
                        if (typeof options.graphs[i] !== 'string') {
                            console.log('[ol.control.Route] ERROR : parameter \'graphs\' elements should be of type \'string\'');
                            options.graphs = null;
                        } else {
                            if (options.graphs[i].toLowerCase() === 'pieton') {
                                options.graphs[i] = 'Pieton';
                            }
                            if (options.graphs[i].toLowerCase() === 'voiture') {
                                options.graphs[i] = 'Voiture';
                            }
                        }
                    }
                }
            } else {
                options.graphs = null;
            }
        }
        if (options.collapsed === 'true') {
            options.collapsed = true;
        }
        if (options.collapsed === 'false') {
            options.collapsed = false;
        }
    };
    Route.prototype._checkRightsManagement = function () {
        var _opts = null;
        var _res = [];
        var _key = null;
        _key = this.options.routeOptions.apiKey;
        _opts = this.options.routeOptions.filterOptions;
        _res = _opts ? _opts.type : [];
        if (!_res || _res.length === 0) {
            _res = [
                'Voiture',
                'Pieton'
            ];
        }
        var rightManagementRoute = RightManagement.check({
            key: _key || this.options.apiKey,
            resources: _res,
            services: ['Itineraire']
        });
        _key = this.options.autocompleteOptions.apiKey;
        _opts = this.options.autocompleteOptions.filterOptions;
        _res = _opts ? _opts.type : [];
        if (!_res || _res.length === 0) {
            _res = [
                'PositionOfInterest',
                'StreetAddress'
            ];
        }
        var rightManagementAutoComplete = RightManagement.check({
            key: _key || this.options.apiKey,
            resources: _res,
            services: ['AutoCompletion']
        });
        if (!rightManagementRoute && !rightManagementAutoComplete) {
            this._noRightManagement = true;
        }
        if (rightManagementAutoComplete) {
            this._resources['AutoCompletion'] = {};
            this._resources['AutoCompletion']['resources'] = rightManagementAutoComplete['AutoCompletion'];
            this._resources['AutoCompletion']['key'] = rightManagementAutoComplete['key'];
        }
        if (rightManagementRoute) {
            this._resources['Itineraire'] = {};
            this._resources['Itineraire']['resources'] = rightManagementRoute['Itineraire'];
            this._resources['Itineraire']['key'] = rightManagementRoute['key'];
        }
    };
    Route.prototype._initContainer = function (map) {
        var container = this._container;
        var inputShow = this._showRouteContainer = this._createShowRouteElement();
        container.appendChild(inputShow);
        if (!this.collapsed) {
            inputShow.checked = true;
        }
        var picto = this._createShowRoutePictoElement();
        container.appendChild(picto);
        var routePanel = this._createRoutePanelElement();
        var routeHeader = this._createRoutePanelHeaderElement();
        routePanel.appendChild(routeHeader);
        var routeForm = this._formRouteContainer = this._createRoutePanelFormElement();
        var points = this._createRoutePanelFormPointsElement(map);
        for (var i = 0; i < points.length; i++) {
            routeForm.appendChild(points[i]);
        }
        var choice = this._createRoutePanelFormModeChoiceElement();
        choice.appendChild(this._createRoutePanelFormModeChoiceTransportElement(this.options.graphs));
        choice.appendChild(this._createRoutePanelFormModeChoiceComputeElement());
        routeForm.appendChild(choice);
        routeForm.appendChild(this._createShowRouteExclusionsElement());
        this._showRouteExclusionsElement = this._createShowRouteExclusionsPictoElement();
        routeForm.appendChild(this._showRouteExclusionsElement);
        var exclusion = this._createRoutePanelFormExclusionsElement();
        exclusion.appendChild(this._createRoutePanelFormExclusionOptionsElement(this.options.exclusions));
        routeForm.appendChild(exclusion);
        var divReset = this._createRouteFormResetElement();
        routeForm.appendChild(divReset);
        var submit = this._createRouteSubmitFormElement();
        routeForm.appendChild(submit);
        routePanel.appendChild(routeForm);
        var routeResults = this._resultsRouteContainer = this._createRoutePanelResultsElement();
        routePanel.appendChild(routeResults);
        var waiting = this._waitingContainer = this._createRouteWaitingElement();
        routePanel.appendChild(waiting);
        container.appendChild(routePanel);
        var context = this;
        if (container.addEventListener) {
            container.addEventListener('click', function (e) {
                context._hideRouteSuggestedLocations.call(context, e);
            });
        }
        return container;
    };
    Route.prototype._initTransport = function () {
        this._currentTransport = 'Voiture';
        var transport = this.options.graphs;
        if (!transport || transport.length === 0) {
            this.options.graphs = [
                'Voiture',
                'Pieton'
            ];
        }
        if (Array.isArray(transport) && transport.length) {
            if (transport[0] === 'Voiture' || transport[0] === 'Pieton') {
                this._currentTransport = transport[0];
            }
        }
        var serviceOptions = this.options.routeOptions;
        if (serviceOptions.graph) {
            this._currentTransport = serviceOptions.graph;
        }
    };
    Route.prototype._initComputation = function () {
        this._currentComputation = 'fastest';
        var serviceOptions = this.options.routeOptions;
        if (serviceOptions.routePreference) {
            this._currentComputation = serviceOptions.routePreference;
        }
    };
    Route.prototype._initExclusions = function () {
        this._currentExclusions = [];
        var exclusion = this.options.exclusions;
        if (!exclusion || typeof exclusion === 'object' && Object.keys(exclusion).length === 0) {
            this.options.exclusions = {
                toll: false,
                tunnel: false,
                bridge: false
            };
        }
        if (exclusion && typeof exclusion === 'object' && Object.keys(exclusion).length) {
            for (var k in exclusion) {
                if (exclusion.hasOwnProperty(k)) {
                    if (exclusion[k]) {
                        this._currentExclusions.push(k);
                    }
                }
            }
        }
        var serviceOptions = this.options.routeOptions;
        if (Array.isArray(serviceOptions.exclusions)) {
            this._currentExclusions = serviceOptions.exclusions;
        }
    };
    Route.prototype._initPopupDiv = function () {
        var context = this;
        var element = document.createElement('div');
        element.className = 'gp-feature-info-div';
        var closer = document.createElement('input');
        closer.type = 'button';
        closer.className = 'gp-styling-button closer';
        closer.onclick = function () {
            if (context._popupOverlay != null) {
                context._popupOverlay.setPosition(undefined);
            }
            return false;
        };
        this._popupContent = document.createElement('div');
        this._popupContent.className = 'gp-features-content-div';
        element.appendChild(this._popupContent);
        element.appendChild(closer);
        return element;
    };
    Route.prototype._createRoutePanelFormPointsElement = function (map) {
        var points = [];
        var count = 1;
        var start = new LocationSelector({
            apiKey: this.options.apiKey || null,
            tag: {
                id: count,
                groupId: this._uid,
                markerOpts: this.options.markersOpts['departure'],
                label: 'Départ',
                display: true
            },
            autocompleteOptions: this.options.autocompleteOptions || null
        });
        start.setMap(map);
        this._addFormPointsEventListeners(start);
        points.push(start._container);
        this._currentPoints.push(start);
        for (count = 2; count < 7; count++) {
            var step = new LocationSelector({
                apiKey: this.options.apiKey || null,
                tag: {
                    id: count,
                    groupId: this._uid,
                    label: 'Etape',
                    markerOpts: this.options.markersOpts['stages'],
                    display: false,
                    removeOption: true
                },
                autocompleteOptions: this.options.autocompleteOptions || null
            });
            step.setMap(map);
            this._addFormPointsEventListeners(step);
            points.push(step._container);
            this._currentPoints.push(step);
        }
        var end = new LocationSelector({
            apiKey: this.options.apiKey || null,
            tag: {
                id: count,
                groupId: this._uid,
                markerOpts: this.options.markersOpts['arrival'],
                label: 'Arrivée',
                display: true,
                addOption: true
            },
            autocompleteOptions: this.options.autocompleteOptions || null
        });
        end.setMap(map);
        this._addFormPointsEventListeners(end);
        points.push(end._container);
        this._currentPoints.push(end);
        return points;
    };
    Route.prototype._addFormPointsEventListeners = function (formPoint) {
        if (!formPoint) {
            return;
        }
        var context = this;
        if (formPoint._inputLabelContainer.addEventListener) {
            formPoint._inputLabelContainer.addEventListener('click', function () {
                context.onRouteOriginLabelClick.call(this, context);
            });
            formPoint._inputShowPointer.addEventListener('click', function () {
                context.onRouteOriginPointerClick.call(this, context, formPoint);
            });
            if (formPoint._removePointElement) {
                formPoint._removePointElement.addEventListener('click', function () {
                    var exclusionsPictoTop = context._showRouteExclusionsElement.style.top;
                    context._showRouteExclusionsElement.style.top = (parseInt(exclusionsPictoTop, 10) - 33).toString() + 'px';
                });
            }
            if (formPoint._addPointElement) {
                formPoint._addPointElement.addEventListener('click', function () {
                    var exclusionsPictoTop = context._showRouteExclusionsElement.style.top;
                    context._showRouteExclusionsElement.style.top = (parseInt(exclusionsPictoTop, 10) + 33).toString() + 'px';
                });
            }
        } else if (formPoint._inputLabelContainer.attachEvent) {
            formPoint._inputLabelContainer.attachEvent('onclick', function () {
                context.onRouteOriginLabelClick.call(this, context);
            });
            formPoint._inputShowPointer.attachEvent('onclick', function () {
                context.onRouteOriginPointerClick.call(this, context, formPoint);
            });
            if (formPoint._removePointElement) {
                formPoint._removePointElement.attachEvent('onclick', function () {
                    var exclusionsPictoTop = context._showRouteExclusionsElement.style.top;
                    context._showRouteExclusionsElement.style.top = (parseInt(exclusionsPictoTop, 10) - 33).toString() + 'px';
                });
            }
            if (formPoint._addPointElement) {
                formPoint._addPointElement.attachEvent('onclick', function () {
                    var exclusionsPictoTop = context._showRouteExclusionsElement.style.top;
                    context._showRouteExclusionsElement.style.top = (parseInt(exclusionsPictoTop, 10) + 33).toString() + 'px';
                });
            }
        }
    };
    Route.prototype.onRouteComputationSubmit = function (options) {
        var points = this._currentPoints;
        var start;
        if (points[0] && points[0].getCoordinate) {
            var startCoordinate = points[0].getCoordinate();
            start = {
                x: startCoordinate[0],
                y: startCoordinate[1]
            };
        }
        var end;
        var endPoint = points[points.length - 1];
        if (endPoint && endPoint.getCoordinate) {
            var endCoordinate = endPoint.getCoordinate();
            end = {
                x: endCoordinate[0],
                y: endCoordinate[1]
            };
        }
        var step = [];
        for (var i = 1; i < points.length - 1; i++) {
            if (points[i] && points[i].getCoordinate) {
                var iCoordinate = points[i].getCoordinate();
                if (iCoordinate) {
                    var coordinate = {
                        x: iCoordinate[0],
                        y: iCoordinate[1]
                    };
                    step.push(coordinate);
                }
            }
        }
        if (this._noRightManagement) {
            return;
        }
        this._currentTransport = options.transport;
        this._currentComputation = options.computation;
        this._currentExclusions = options.exclusions;
        var routeOptions = this.options.routeOptions;
        var _protocol = routeOptions.protocol || 'XHR';
        var _timeout = routeOptions.timeOut || 0;
        if (_protocol === 'JSONP' && _timeout === 0) {
            _timeout = 15000;
        }
        var context = this;
        this._requestRouting({
            startPoint: start,
            endPoint: end,
            viaPoints: step,
            graph: routeOptions.graph || this._currentTransport,
            routePreference: routeOptions.routePreference || this._currentComputation,
            exclusions: routeOptions.exclusions || this._currentExclusions,
            geometryInInstructions: true,
            distanceUnit: 'm',
            timeOut: _timeout,
            protocol: _protocol,
            onSuccess: function (results) {
                if (results) {
                    context._fillRouteResultsDetails(results);
                }
            },
            onFailure: function (error) {
                context._hideWaitingContainer();
                context._clearRouteResultsDetails();
            }
        });
    };
    Route.prototype.onRouteOriginLabelClick = function (routeControl) {
        var map = routeControl.getMap();
        routeControl._formRouteContainer.className = '';
        map.un('click', function () {
            if (routeControl._formRouteContainer.className === 'GProuteFormMini') {
                routeControl._formRouteContainer.className = '';
            }
        });
    };
    Route.prototype.onRouteOriginPointerClick = function (routeControl, locationSelector) {
        var map = routeControl.getMap();
        if (locationSelector._inputShowPointerContainer.checked) {
            routeControl._formRouteContainer.className = 'GProuteFormMini';
            map.on('click', function () {
                if (routeControl._formRouteContainer.className === 'GProuteFormMini') {
                    routeControl._formRouteContainer.className = '';
                }
            });
        } else {
            routeControl._formRouteContainer.className = '';
            map.un('click', function () {
                if (routeControl._formRouteContainer.className === 'GProuteFormMini') {
                    routeControl._formRouteContainer.className = '';
                }
            });
        }
    };
    Route.prototype.onShowRoutePanelClick = function () {
        if (!this._geojsonSections && !this._waiting) {
            this._clear();
        }
        this.collapsed = document.getElementById('GPshowRoute-' + this._uid).checked;
        this.dispatchEvent('change:collapsed');
    };
    Route.prototype.onRouteModeComputationChange = function (e) {
        var idx = e.target.selectedIndex;
        var value = e.target.options[idx].value;
        if (!value) {
            return;
        }
        this._currentComputation = value;
    };
    Route.prototype.onRouteModeComputationChangeAndRun = function (e) {
        this.onRouteModeComputationChange(e);
        this._clearRouteResultsDetails();
        this._clearRouteResultsGeometry();
        this._clearRouteResultsFeatureGeometry();
        this.onRouteComputationSubmit({
            computation: this._currentComputation,
            transport: this._currentTransport,
            exclusions: this._currentExclusions
        });
    };
    Route.prototype.onRouteModeTransportChange = function (e) {
        var value = e.target.value;
        if (!value) {
            return;
        }
        this._currentTransport = value;
    };
    Route.prototype.onShowRouteExclusionsClick = function (e) {
    };
    Route.prototype.onRouteExclusionsChange = function (e) {
        var value = e.target.value;
        var checked = e.target.checked;
        if (!value || typeof value !== 'string') {
            return;
        }
        value = value.toLowerCase();
        var bFound = false;
        var iFound = null;
        for (var i = 0; i < this._currentExclusions.length; i++) {
            if (this._currentExclusions[i] === value) {
                iFound = i;
                bFound = true;
            }
        }
        if (!bFound && !checked) {
            this._currentExclusions.push(value);
        }
        if (bFound && checked) {
            this._currentExclusions.splice(iFound, 1);
        }
    };
    Route.prototype.onRouteResetClick = function () {
        var currentPoints = this._currentPoints;
        for (var i = 0; i < currentPoints.length; i++) {
            currentPoints[i].clear();
        }
        this._clear();
        this._clearRouteInputOptions();
    };
    Route.prototype.onShowRouteResultsNewClick = function () {
        this._clearRouteResultsDetails();
        this._clearRouteResultsGeometry();
        this._clearRouteResultsFeatureGeometry();
    };
    Route.prototype.onRouteResultsDetailsMouseOver = function (e) {
        var tagid = e.target.id;
        var idx = tagid.substring(tagid.indexOf('_') + 1);
        if (e.target.classList) {
            e.target.classList.add('GProuteResultsDetailsInstructionHighlight');
        }
        if (!this._geojsonSections) {
            return;
        }
        var f = this._geojsonSections.getSource().getFeatureById(parseInt(idx, 10));
        f.setStyle(this._selectedFeatureStyle);
    };
    Route.prototype.onRouteResultsDetailsMouseOut = function (e) {
        var tagid = e.target.id;
        var idx = tagid.substring(tagid.indexOf('_') + 1);
        if (e.target.classList) {
            e.target.classList.remove('GProuteResultsDetailsInstructionHighlight');
        }
        if (!this._geojsonSections) {
            return;
        }
        var f = this._geojsonSections.getSource().getFeatureById(parseInt(idx, 10));
        f.setStyle(null);
    };
    Route.prototype._requestRouting = function (options) {
        if (!options || typeof options === 'object' && Object.keys(options).length === 0) {
            return;
        }
        if (!options.startPoint) {
            return;
        }
        if (!options.endPoint) {
            return;
        }
        if (this._noRightManagement || !this._resources['Itineraire']) {
            return;
        }
        var resources = this._resources['Itineraire'].resources;
        if (!resources || typeof resources === 'object' && Object.keys(resources).length === 0) {
            return;
        }
        var key = this._resources['Itineraire']['key'];
        var bFound = false;
        for (var i = 0; i < resources.length; i++) {
            if (resources[i] === options.graph) {
                bFound = true;
            }
        }
        if (!bFound) {
            console.log('no rights for this service !?');
            return;
        }
        options.apiKey = this.options.routeOptions.apiKey || this.options.apiKey || key;
        this._displayWaitingContainer();
        Gp.Services.route(options);
    };
    Route.prototype._fillRouteResultsDetails = function (results) {
        var distance = results.totalDistance;
        var duration = results.totalTime;
        var instructions = this._simplifiedInstructions(results.routeInstructions);
        if (instructions) {
            this._fillRouteResultsDetailsContainer(distance, duration, instructions);
        }
        var geometry = results.routeGeometry;
        if (geometry) {
            this._fillRouteResultsDetailsGeometry(geometry, this._defaultFeatureStyle);
        }
        if (instructions && instructions[0].geometry) {
            this._fillRouteResultsDetailsFeatureGeometry(instructions, this._defaultFeatureStyle);
        }
        var bbox = results.bbox;
        if (bbox) {
            var map = this.getMap();
            var bounds = [
                bbox.left,
                bbox.bottom,
                bbox.right,
                bbox.top
            ];
            var mapProj = map.getView().getProjection().getCode();
            if (mapProj !== 'EPSG:4326') {
                bounds = ol.proj.transformExtent(bounds, 'EPSG:4326', mapProj);
            }
            map.getView().fit(bounds, map.getSize());
        }
        this._currentRouteInformations = results;
        this._formRouteContainer.className = 'GProuteComponentHidden';
        this._hideWaitingContainer();
        this._resultsRouteContainer.className = '';
    };
    Route.prototype._fillRouteResultsDetailsContainer = function (distance, duration, instructions) {
        this._resultsRouteValuesContainer = this._addRouteResultsValuesElement(distance, duration, this._convertSecondsToTime);
        this._resultsRouteDetailsContainer = this._addRouteResultsDetailsElement(instructions, this._convertSecondsToTime);
    };
    Route.prototype._fillRouteResultsDetailsGeometry = function (geometry, style) {
        this._clearRouteResultsGeometry();
        var map = this.getMap();
        if (!geometry) {
            return;
        }
        var geojsonObject = {
            type: 'Feature',
            crs: {
                type: 'name',
                properties: { name: 'EPSG:4326' }
            },
            geometry: geometry
        };
        var geojsonformat = new ol.format.GeoJSON({ defaultDataProjection: 'EPSG:4326' });
        var features = geojsonformat.readFeatures(geojsonObject, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
        });
        this._geojsonRoute = new ol.layer.Vector({
            source: new ol.source.Vector({ features: features }),
            style: style
        });
        map.addLayer(this._geojsonRoute);
    };
    Route.prototype._fillRouteResultsDetailsFeatureGeometry = function (instructions, style) {
        this._clearRouteResultsFeatureGeometry();
        var map = this.getMap();
        var geojsonObject = {
            type: 'FeatureCollection',
            crs: {
                type: 'name',
                properties: { name: 'EPSG:4326' }
            },
            features: []
        };
        for (var i = 0; i < instructions.length; i++) {
            var o = instructions[i];
            var id = i + 1;
            var coords = o.geometry.coordinates;
            for (var j = 0; j < coords.length; j++) {
                if (typeof coords[j][0] === 'string') {
                    coords[j][0] = parseFloat(coords[j][0]);
                    coords[j][1] = parseFloat(coords[j][1]);
                }
            }
            geojsonObject.features.push({
                type: 'Feature',
                geometry: o.geometry,
                properties: { popupContent: '(' + id + ') distance : ' + this._convertDistance(o.distance) + ' / temps : ' + this._convertSecondsToTime(o.duration) },
                id: id
            });
        }
        var geojsonformat = new ol.format.GeoJSON({ defaultDataProjection: 'EPSG:4326' });
        var mapProj = this.getMap().getView().getProjection().getCode();
        var features = geojsonformat.readFeatures(geojsonObject, {
            dataProjection: 'EPSG:4326',
            featureProjection: mapProj
        });
        this._geojsonSections = new ol.layer.Vector({
            source: new ol.source.Vector({ features: features }),
            style: style,
            opacity: 0.9
        });
        var graph;
        if (this._currentTransport === 'Pieton') {
            graph = 'piéton';
            this._geojsonSections.gpResultLayerId = 'Pieton$OGC:OPENLS;Itineraire';
        } else {
            graph = 'voiture';
            this._geojsonSections.gpResultLayerId = 'Voiture$OGC:OPENLS;Itineraire';
        }
        map.addLayer(this._geojsonSections);
        map.getControls().forEach(function (control) {
            if (control instanceof LayerSwitcher) {
                var layerId = this._geojsonSections.gpLayerId;
                if (control._layers[layerId].title === layerId) {
                    control.addLayer(this._geojsonSections, {
                        title: ' Itinéraire ' + graph,
                        description: ' Itinéraire basé sur un graphe ' + graph
                    });
                }
            }
        }, this);
        this._resultsHoverInteraction = new ol.interaction.Select({
            condition: ol.events.condition.pointerMove,
            layers: [this._geojsonSections],
            style: this._selectedFeatureStyle
        });
        this._resultsHoverInteraction.on('select', this._onResultsFeatureMouseOver, this);
        map.addInteraction(this._resultsHoverInteraction);
        this._resultsSelectInteraction = new ol.interaction.Select({
            layers: [this._geojsonSections],
            style: this._selectedFeatureStyle
        });
        this._resultsSelectInteraction.on('select', this._onResultsFeatureSelect, this);
        map.addInteraction(this._resultsSelectInteraction);
    };
    Route.prototype._onResultsFeatureMouseOver = function (e) {
        if (e.selected.length !== 0) {
            var f = e.selected[0];
            var selectedInstruction = document.getElementById('GProuteResultsDetailsInstruction_' + f.getId() + '-' + this._uid);
            if (selectedInstruction && selectedInstruction.classList) {
                selectedInstruction.classList.add('GProuteResultsDetailsInstructionHighlight');
            }
        }
        if (e.deselected.length !== 0) {
            var deselectedFeature = e.deselected[0];
            var deSelectedInstruction = document.getElementById('GProuteResultsDetailsInstruction_' + deselectedFeature.getId() + '-' + this._uid);
            if (deSelectedInstruction && deSelectedInstruction.classList) {
                deSelectedInstruction.classList.remove('GProuteResultsDetailsInstructionHighlight');
            }
        }
    };
    Route.prototype._onResultsFeatureSelect = function (e) {
        var map = this.getMap();
        if (e.selected.length !== 0) {
            var f = e.selected[0];
            this._popupContent.innerHTML = f.getProperties().popupContent;
            if (!this._popupOverlay) {
                this._popupOverlay = new ol.Overlay({
                    element: this._popupDiv,
                    positioning: 'bottom-center',
                    position: e.mapBrowserEvent.coordinate
                });
                map.addOverlay(this._popupOverlay);
            } else {
                this._popupOverlay.setPosition(e.mapBrowserEvent.coordinate);
            }
        } else {
            if (this._popupOverlay != null) {
                this._popupOverlay.setPosition(undefined);
            }
        }
    };
    Route.prototype._clear = function () {
        this._currentTransport = null;
        this._currentExclusions = [];
        this._currentComputation = null;
        this._clearRouteResultsDetails();
        this._clearRouteResultsGeometry();
        this._clearRouteResultsFeatureGeometry();
        for (var i = 0; i < this._currentPoints.length; i++) {
            this._currentPoints[i].clear();
        }
        this._removeRouteStepLocations();
    };
    Route.prototype._clearRouteInputOptions = function () {
        this._initTransport();
        this._initComputation();
        this._initExclusions();
        var transportdiv;
        if (this._currentTransport === 'Pieton') {
            transportdiv = document.getElementById('GProuteTransportPedestrian-' + this._uid);
            if (transportdiv) {
                transportdiv.checked = 'true';
            }
        } else {
            transportdiv = document.getElementById('GProuteTransportCar-' + this._uid);
            if (transportdiv) {
                transportdiv.checked = 'true';
            }
        }
        var computationdiv = document.getElementById('GProuteComputationSelect-' + this._uid);
        if (computationdiv) {
            computationdiv.value = this._currentComputation;
        }
        var tollInput = document.getElementById('GProuteExclusionsToll-' + this._uid);
        if (tollInput) {
            if (this._currentExclusions.indexOf('toll') !== -1) {
                tollInput.checked = false;
            } else {
                tollInput.checked = true;
            }
        }
        var tunnelInput = document.getElementById('GProuteExclusionsTunnel-' + this._uid);
        if (tunnelInput) {
            if (this._currentExclusions.indexOf('tunnel') !== -1) {
                tunnelInput.checked = false;
            } else {
                tunnelInput.checked = true;
            }
        }
        var bridgeInput = document.getElementById('GProuteExclusionsBridge-' + this._uid);
        if (bridgeInput) {
            if (this._currentExclusions.indexOf('bridge') !== -1 && bridgeInput) {
                bridgeInput.checked = false;
            } else {
                bridgeInput.checked = true;
            }
        }
    };
    Route.prototype._removeRouteStepLocations = function () {
        var points = document.querySelectorAll('div[id^="GPlocationPoint"]');
        var stepPoints = 0;
        if (points.length !== 0) {
            for (var i = 1; i < points.length - 1; i++) {
                var classList = points[i].classList;
                if (classList.length !== 0) {
                    for (var j = 0; j < classList.length; j++) {
                        if (classList[j] === 'GPlocationStageFlexInput') {
                            document.getElementById(this._addUID('GPlocationStageRemove_' + (i + 1))).click();
                            stepPoints += 1;
                        }
                    }
                }
            }
        }
    };
    Route.prototype._clearRouteResultsDetails = function () {
        this._currentRouteInformations = null;
        if (this._resultsRouteDetailsContainer) {
            var detailsDiv = this._resultsRouteDetailsContainer;
            if (detailsDiv.childElementCount) {
                while (detailsDiv.firstChild) {
                    detailsDiv.removeChild(detailsDiv.firstChild);
                }
            }
        }
        if (this._resultsRouteValuesContainer) {
            var valuesDiv = this._resultsRouteValuesContainer;
            if (valuesDiv.childElementCount) {
                while (valuesDiv.firstChild) {
                    valuesDiv.removeChild(valuesDiv.firstChild);
                }
            }
        }
    };
    Route.prototype._clearRouteResultsGeometry = function () {
        var map = this.getMap();
        if (this._geojsonRoute != null) {
            map.removeLayer(this._geojsonRoute);
            this._geojsonRoute = null;
        }
    };
    Route.prototype._clearRouteResultsFeatureGeometry = function () {
        var map = this.getMap();
        if (this._geojsonSections != null) {
            map.removeLayer(this._geojsonSections);
            this._geojsonSections = null;
        }
        if (this._popupOverlay != null) {
            map.removeOverlay(this._popupOverlay);
            this._popupOverlay = null;
        }
        if (this._resultsSelectInteraction != null) {
            map.removeInteraction(this._resultsSelectInteraction);
            this._resultsSelectInteraction = null;
        }
        if (this._resultsHoverInteraction != null) {
            map.removeInteraction(this._resultsHoverInteraction);
            this._resultsHoverInteraction = null;
        }
    };
    Route.prototype._hideRouteSuggestedLocations = function (e) {
        if (e.target && e.target.id && e.target.id.indexOf('GPlocationOrigin_') !== -1) {
            var pointId = parseInt(e.target.id.split('_')[1][0], 10) - 1;
            for (var j = 0; j < this._currentPoints.length; j++) {
                if (j !== parseInt(pointId, 10)) {
                    this._currentPoints[j]._hideSuggestedLocation();
                }
            }
        } else {
            for (var i = 0; i < this._currentPoints.length; i++) {
                this._currentPoints[i]._hideSuggestedLocation();
            }
        }
    };
    Route.prototype._displayWaitingContainer = function () {
        this._waitingContainer.className = 'GProuteCalcWaitingContainerVisible';
        this._waiting = true;
        var opts = this.options.routeOptions;
        if (opts && opts.timeOut) {
            if (this._timer) {
                clearTimeout(this._timer);
                this._timer = null;
            }
            var context = this;
            this._timer = setTimeout(function () {
                if (context._waiting === true) {
                    context._hideWaitingContainer();
                } else {
                    if (context._timer) {
                        clearTimeout(context._timer);
                    }
                }
            }, 16000);
        }
    };
    Route.prototype._hideWaitingContainer = function () {
        if (this._waiting) {
            this._waitingContainer.className = 'GProuteCalcWaitingContainerHidden';
            this._waiting = false;
            var opts = this.options.routeOptions;
            if (opts && opts.timeOut) {
                clearTimeout(this._timer);
                this._timer = null;
            }
        }
    };
    Route.prototype._simplifiedInstructions = function (instructions) {
        var newInstructions = [];
        var current = instructions[0];
        if (instructions.length === 1) {
            newInstructions.push(current);
        }
        for (var i = 1; i < instructions.length; i++) {
            var o = instructions[i];
            if (o.instruction === current.instruction) {
                current.distance = (parseFloat(o.distance) + parseFloat(current.distance)).toString();
                current.duration = (parseFloat(o.duration) + parseFloat(current.duration)).toString();
                for (var j = 1; j < o.geometry.coordinates.length; j++) {
                    current.geometry.coordinates.push(o.geometry.coordinates[j]);
                }
            } else {
                newInstructions.push(current);
                current = o;
                if (i === instructions.length - 1) {
                    newInstructions.push(o);
                    current = null;
                }
            }
        }
        return newInstructions;
    };
    Route.prototype._convertSecondsToTime = function (duration) {
        var time = '';
        duration = Math.round(duration);
        var hours = Math.floor(duration / (60 * 60));
        var divisor4minutes = duration % (60 * 60);
        var minutes = Math.floor(divisor4minutes / 60);
        if (hours) {
            time = hours + 'h ';
        }
        time += minutes + ' min';
        return time;
    };
    Route.prototype._convertDistance = function (distance) {
        var d = '';
        var distanceKm = parseInt(distance / 1000, 10);
        if (!distanceKm) {
            d = parseInt(distance, 10) + ' m';
        } else {
            d = distanceKm + ' km';
        }
        return d;
    };
    return Route;
}(ol, gp, Ol3Utils, {}, CommonUtilsCheckRightManagement, CommonUtilsSelectorID, Ol3ControlsLocationSelector, Ol3ControlsLayerSwitcher, Ol3ControlsUtilsMarkers, CommonControlsRouteDOM);
CommonControlsIsoDOM = function () {
    var IsoDOM = {
        _addUID: function (id) {
            var uid = this._uid ? id + '-' + this._uid : id;
            return uid;
        },
        _createMainContainerElement: function () {
            var container = document.createElement('div');
            container.id = this._addUID('GPisochron');
            container.className = 'GPwidget';
            return container;
        },
        _createShowIsoElement: function () {
            var input = document.createElement('input');
            input.id = this._addUID('GPshowIsochron');
            input.type = 'checkbox';
            return input;
        },
        _createShowIsoPictoElement: function () {
            var context = this;
            var label = document.createElement('label');
            label.id = this._addUID('GPshowIsochronPicto');
            label.className = 'GPshowAdvancedToolPicto';
            label.htmlFor = this._addUID('GPshowIsochron');
            label.title = 'Calculer une isochrone';
            if (label.addEventListener) {
                label.addEventListener('click', function (e) {
                    context.onShowIsoPanelClick(e);
                });
            } else if (label.attachEvent) {
                label.attachEvent('onclick', function (e) {
                    context.onShowIsoPanelClick(e);
                });
            }
            var spanOpen = document.createElement('span');
            spanOpen.id = this._addUID('GPshowIsochronOpen');
            spanOpen.className = 'GPshowAdvancedToolOpen';
            label.appendChild(spanOpen);
            return label;
        },
        _createIsoPanelElement: function () {
            var div = document.createElement('div');
            div.id = this._addUID('GPisochronPanel');
            div.className = 'GPpanel';
            return div;
        },
        _createIsoPanelHeaderElement: function () {
            var self = this;
            var container = document.createElement('div');
            container.className = 'GPpanelHeader';
            var div = document.createElement('div');
            div.className = 'GPpanelTitle';
            div.innerHTML = 'Calcul d\'isochrone';
            container.appendChild(div);
            var divClose = document.createElement('div');
            divClose.id = this._addUID('GPisochronPanelClose');
            divClose.className = 'GPpanelClose';
            divClose.title = 'Fermer le panneau';
            if (divClose.addEventListener) {
                divClose.addEventListener('click', function () {
                    document.getElementById(self._addUID('GPshowIsochronPicto')).click();
                }, false);
            } else if (divClose.attachEvent) {
                divClose.attachEvent('onclick', function () {
                    document.getElementById(self._addUID('GPshowIsochronPicto')).click();
                });
            }
            container.appendChild(divClose);
            return container;
        },
        _createIsoPanelFormElement: function () {
            var self = this;
            var form = document.createElement('form');
            form.id = this._addUID('GPisochronForm');
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                self.onIsoComputationSubmit(e);
                return false;
            });
            return form;
        },
        _createIsoWaitingElement: function () {
            var div = document.createElement('div');
            div.id = this._addUID('GPisochronCalcWaitingContainer');
            div.className = 'GPisochronCalcWaitingContainerHidden';
            var p = document.createElement('p');
            p.className = 'GPisochronCalcWaiting';
            p.innerHTML = 'Calcul en cours...';
            div.appendChild(p);
            return div;
        },
        _createIsoPanelFormTypeChoiceElement: function () {
            var div = document.createElement('div');
            div.id = this._addUID('GPisochronChoice');
            return div;
        },
        _createIsoPanelFormTypeChoiceChronElement: function (checked) {
            var self = this;
            var div = document.createElement('div');
            div.className = 'GPisochronChoiceAlt';
            var input = document.createElement('input');
            input.id = this._addUID('GPisochronChoiceAltChron');
            input.name = 'GPisochronChoiceMode';
            input.type = 'radio';
            input.checked = checked ? true : false;
            if (input.addEventListener) {
                input.addEventListener('change', function (e) {
                    document.getElementById(self._addUID('GPisochronValueChron')).className = 'GPflexInput';
                    document.getElementById(self._addUID('GPisochronValueDist')).className = 'GPisochronValueHidden';
                    self.onIsoTypeChoiceChange(e);
                }, false);
            } else if (input.attachEvent) {
                input.attachEvent('onchange', function () {
                    document.getElementById(self._addUID('GPisochronValueChron')).className = 'GPflexInput';
                    document.getElementById(self._addUID('GPisochronValueDist')).className = 'GPisochronValueHidden';
                    self.onIsoTypeChoiceChange();
                });
            }
            input.value = 'isochron';
            div.appendChild(input);
            var label = document.createElement('label');
            label.className = 'GPisochronChoiceAltImg';
            label.htmlFor = this._addUID('GPisochronChoiceAltChron');
            div.appendChild(label);
            var span = document.createElement('span');
            span.id = this._addUID('GPisochronChoiceAltChronTxt');
            span.innerHTML = 'isochrone';
            if (span.addEventListener) {
                span.addEventListener('click', function () {
                    document.getElementById(self._addUID('GPisochronChoiceAltChron')).click();
                }, false);
            } else if (span.attachEvent) {
                span.attachEvent('onclick', function () {
                    document.getElementById(self._addUID('GPisochronChoiceAltChron')).click();
                });
            }
            div.appendChild(span);
            return div;
        },
        _createIsoPanelFormTypeChoiceDistElement: function (checked) {
            var self = this;
            var div = document.createElement('div');
            div.className = 'GPisochronChoiceAlt';
            var input = document.createElement('input');
            input.id = this._addUID('GPisochronChoiceAltDist');
            input.name = 'GPisochronChoiceMode';
            input.type = 'radio';
            input.checked = checked ? true : false;
            if (input.addEventListener) {
                input.addEventListener('change', function (e) {
                    document.getElementById(self._addUID('GPisochronValueDist')).className = 'GPflexInput';
                    document.getElementById(self._addUID('GPisochronValueChron')).className = 'GPisochronValueHidden';
                    self.onIsoTypeChoiceChange(e);
                }, false);
            } else if (input.attachEvent) {
                input.attachEvent('onchange', function () {
                    document.getElementById(self._addUID('GPisochronValueDist')).className = 'GPflexInput';
                    document.getElementById(self._addUID('GPisochronValueChron')).className = 'GPisochronValueHidden';
                    self.onIsoTypeChoiceChange();
                });
            }
            input.value = 'isodistance';
            div.appendChild(input);
            var label = document.createElement('label');
            label.className = 'GPisochronChoiceAltImg';
            label.htmlFor = this._addUID('GPisochronChoiceAltDist');
            div.appendChild(label);
            var span = document.createElement('span');
            span.id = this._addUID('GPisochronChoiceAltDistTxt');
            span.innerHTML = 'isodistance';
            if (span.addEventListener) {
                span.addEventListener('click', function () {
                    document.getElementById(self._addUID('GPisochronChoiceAltDist')).click();
                }, false);
            } else if (span.attachEvent) {
                span.attachEvent('onclick', function () {
                    document.getElementById(self._addUID('GPisochronChoiceAltDist')).click();
                });
            }
            div.appendChild(span);
            return div;
        },
        _createIsoPanelFormValueIsochronElement: function (checked) {
            var context = this;
            var div = document.createElement('div');
            div.id = this._addUID('GPisochronValueChron');
            div.className = checked ? 'GPflexInput' : 'GPisochronValueHidden';
            var label = document.createElement('label');
            label.id = this._addUID('GPisochronValueChronLabel');
            label.htmlFor = this._addUID('GPisochronValueChronInput');
            label.innerHTML = 'Temps';
            div.appendChild(label);
            var input1 = document.createElement('input');
            input1.id = this._addUID('GPisochronValueChronInput1');
            input1.min = '0';
            input1.step = '1';
            input1.value = '0';
            input1.type = 'number';
            if (input1.addEventListener) {
                input1.addEventListener('change', function (e) {
                    if (typeof context.onIsoValueChronTimeMinuteChange === 'function') {
                        context.onIsoValueChronTimeHourChange(e);
                    }
                });
            } else if (input1.attachEvent) {
                input1.attachEvent('onchange', function (e) {
                    if (typeof context.onIsoValueChronTimeMinuteChange === 'function') {
                        context.onIsoValueChronTimeHourChange(e);
                    }
                });
            }
            div.appendChild(input1);
            var label1 = document.createElement('label');
            label1.innerHTML = 'h';
            div.appendChild(label1);
            var input2 = document.createElement('input');
            input2.id = this._addUID('GPisochronValueChronInput2');
            input2.min = '0';
            input2.max = '59';
            input2.step = '1';
            input2.value = '0';
            input2.type = 'number';
            if (input2.addEventListener) {
                input2.addEventListener('change', function (e) {
                    if (typeof context.onIsoValueChronTimeMinuteChange === 'function') {
                        context.onIsoValueChronTimeMinuteChange(e);
                    }
                });
            } else if (input2.attachEvent) {
                input2.attachEvent('onchange', function (e) {
                    if (typeof context.onIsoValueChronTimeMinuteChange === 'function') {
                        context.onIsoValueChronTimeMinuteChange(e);
                    }
                });
            }
            div.appendChild(input2);
            var label2 = document.createElement('label');
            label2.innerHTML = 'min';
            div.appendChild(label2);
            return div;
        },
        _createIsoPanelFormValueIsodistanceElement: function (checked) {
            var context = this;
            var div = document.createElement('div');
            div.id = this._addUID('GPisochronValueDist');
            div.className = checked ? 'GPflexInput' : 'GPisochronValueHidden';
            var label = document.createElement('label');
            label.id = this._addUID('GPisochronValueDistLabel');
            label.htmlFor = this._addUID('GPisochronValueDistInput');
            label.innerHTML = 'Distance';
            div.appendChild(label);
            var input1 = document.createElement('input');
            input1.id = this._addUID('GPisochronValueDistInput');
            input1.min = '0';
            input1.step = 'any';
            input1.value = '0';
            input1.type = 'number';
            if (input1.addEventListener) {
                input1.addEventListener('change', function (e) {
                    if (typeof context.onIsoValueDistChange === 'function') {
                        context.onIsoValueDistChange(e);
                    }
                });
            } else if (input1.attachEvent) {
                input1.attachEvent('onchange', function (e) {
                    if (typeof context.onIsoValueDistChange === 'function') {
                        context.onIsoValueDistChange(e);
                    }
                });
            }
            div.appendChild(input1);
            var label1 = document.createElement('label');
            label1.innerHTML = 'km';
            div.appendChild(label1);
            return div;
        },
        _createIsoPanelFormModeChoiceElement: function () {
            var div = document.createElement('div');
            div.id = this._addUID('GPisochronModeChoice');
            return div;
        },
        _createIsoPanelFormModeChoiceTransportElement: function (transports) {
            var context = this;
            var div = document.createElement('div');
            div.id = this._addUID('GPisochronTransportChoice');
            var span = document.createElement('span');
            span.className = 'GPisochronModeLabel';
            span.innerHTML = 'Mode de transport';
            div.appendChild(span);
            for (var i = 0; i < transports.length; i++) {
                var transport = transports[i];
                if (transport === 'Voiture') {
                    var inputCar = document.createElement('input');
                    inputCar.id = this._addUID('GPisochronTransportCar');
                    inputCar.type = 'radio';
                    inputCar.name = 'GPisochronTransport';
                    if (i === 0) {
                        inputCar.checked = true;
                    }
                    if (inputCar.addEventListener) {
                        inputCar.addEventListener('change', function (e) {
                            context.onIsoModeTransportChange(e);
                        });
                    } else if (inputCar.attachEvent) {
                        inputCar.attachEvent('onchange', function (e) {
                            context.onIsoModeTransportChange(e);
                        });
                    }
                    inputCar.value = 'Voiture';
                    div.appendChild(inputCar);
                    var labelCar = document.createElement('label');
                    labelCar.className = 'GPisochronTransportImg';
                    labelCar.htmlFor = this._addUID('GPisochronTransportCar');
                    labelCar.title = 'Voiture';
                    div.appendChild(labelCar);
                }
                if (transport === 'Pieton') {
                    var inputPedestrian = document.createElement('input');
                    inputPedestrian.id = this._addUID('GPisochronTransportPedestrian');
                    inputPedestrian.type = 'radio';
                    inputPedestrian.name = 'GPisochronTransport';
                    if (i === 0) {
                        inputPedestrian.checked = true;
                    }
                    if (inputPedestrian.addEventListener) {
                        inputPedestrian.addEventListener('change', function (e) {
                            context.onIsoModeTransportChange(e);
                        });
                    } else if (inputPedestrian.attachEvent) {
                        inputPedestrian.attachEvent('onchange', function (e) {
                            context.onIsoModeTransportChange(e);
                        });
                    }
                    inputPedestrian.value = 'Pieton';
                    div.appendChild(inputPedestrian);
                    var labelPedestrian = document.createElement('label');
                    labelPedestrian.className = 'GPisochronTransportImg';
                    labelPedestrian.htmlFor = this._addUID('GPisochronTransportPedestrian');
                    labelPedestrian.title = 'Piéton';
                    div.appendChild(labelPedestrian);
                }
            }
            return div;
        },
        _createIsoPanelFormModeChoiceDirectionElement: function (directions) {
            var self = this;
            var div = document.createElement('div');
            div.id = this._addUID('GPisochronDirectionChoice');
            var span = document.createElement('span');
            span.className = 'GPisochronModeLabel';
            span.innerHTML = 'Sens de parcours';
            div.appendChild(span);
            var select = document.createElement('select');
            select.id = this._addUID('GPisochronDirectionSelect');
            select.className = 'GPinputSelect';
            select.addEventListener('change', function (e) {
                self.onIsoModeDirectionChange(e);
            });
            for (var i = 0; i < directions.length; i++) {
                var direction = directions[i];
                if (direction.toLowerCase() === 'departure') {
                    var departureOption = document.createElement('option');
                    if (i === 0) {
                        departureOption.selected = 'selected';
                    }
                    departureOption.value = 'departure';
                    departureOption.text = 'Départ';
                    select.appendChild(departureOption);
                }
                if (direction.toLowerCase() === 'arrival') {
                    var arrivalOption = document.createElement('option');
                    if (i === 0) {
                        arrivalOption.selected = 'selected';
                    }
                    arrivalOption.value = 'arrival';
                    arrivalOption.text = 'Arrivée';
                    select.appendChild(arrivalOption);
                }
            }
            div.appendChild(select);
            return div;
        },
        _createShowIsoExclusionsElement: function () {
            var input = document.createElement('input');
            input.id = this._addUID('GPshowIsoExclusions');
            input.type = 'checkbox';
            return input;
        },
        _createShowIsoExclusionsPictoElement: function () {
            var label = document.createElement('label');
            label.id = this._addUID('GPshowIsoExclusionsPicto');
            label.className = 'GPshowMoreOptions GPshowIsoExclusionsPicto';
            label.htmlFor = this._addUID('GPshowIsoExclusions');
            label.title = 'Exclusions';
            label.style.top = '240px';
            return label;
        },
        _createIsoPanelFormExclusionsElement: function () {
            var div = document.createElement('div');
            div.id = this._addUID('GPisoExclusions');
            var span = document.createElement('span');
            span.className = 'GPisoExclusionsLabel';
            span.innerHTML = 'Passages autorisés';
            div.appendChild(span);
            return div;
        },
        _createIsoPanelFormExclusionOptionsElement: function (exclusions) {
            var context = this;
            var div = document.createElement('div');
            div.className = 'GPisoExclusionsOptions';
            for (var value in exclusions) {
                if (exclusions.hasOwnProperty(value)) {
                    var status = exclusions[value];
                    switch (value) {
                    case 'toll':
                        var inputToll = document.createElement('input');
                        inputToll.id = this._addUID('GPisoExclusionsToll');
                        inputToll.type = 'checkbox';
                        inputToll.checked = !status;
                        if (inputToll.addEventListener) {
                            inputToll.addEventListener('change', function (e) {
                                context.onIsoExclusionsChange(e);
                            });
                        } else if (inputToll.attachEvent) {
                            inputToll.attachEvent('onchange', function (e) {
                                context.onIsoExclusionsChange(e);
                            });
                        }
                        inputToll.value = 'Toll';
                        div.appendChild(inputToll);
                        var labelToll = document.createElement('label');
                        labelToll.className = 'GPisoExclusionsOption';
                        labelToll.htmlFor = this._addUID('GPisoExclusionsToll');
                        labelToll.innerHTML = 'Péages';
                        div.appendChild(labelToll);
                        break;
                    case 'tunnel':
                        var inputTunnel = document.createElement('input');
                        inputTunnel.id = this._addUID('GPisoExclusionsTunnel');
                        inputTunnel.type = 'checkbox';
                        inputTunnel.checked = !status;
                        if (inputTunnel.addEventListener) {
                            inputTunnel.addEventListener('change', function (e) {
                                context.onIsoExclusionsChange(e);
                            });
                        } else if (inputTunnel.attachEvent) {
                            inputTunnel.attachEvent('onchange', function (e) {
                                context.onIsoExclusionsChange(e);
                            });
                        }
                        inputTunnel.value = 'Tunnel';
                        div.appendChild(inputTunnel);
                        var labelTunnel = document.createElement('label');
                        labelTunnel.className = 'GPisoExclusionsOption';
                        labelTunnel.htmlFor = this._addUID('GPisoExclusionsTunnel');
                        labelTunnel.innerHTML = 'Tunnels';
                        div.appendChild(labelTunnel);
                        break;
                    case 'bridge':
                        var inputBridge = document.createElement('input');
                        inputBridge.id = this._addUID('GPisoExclusionsBridge');
                        inputBridge.type = 'checkbox';
                        inputBridge.checked = !status;
                        if (inputBridge.addEventListener) {
                            inputBridge.addEventListener('change', function (e) {
                                context.onIsoExclusionsChange(e);
                            });
                        } else if (inputBridge.attachEvent) {
                            inputBridge.attachEvent('onchange', function (e) {
                                context.onIsoExclusionsChange(e);
                            });
                        }
                        inputBridge.value = 'Bridge';
                        div.appendChild(inputBridge);
                        var labelBridge = document.createElement('label');
                        labelBridge.className = 'GPisoExclusionsOption';
                        labelBridge.htmlFor = this._addUID('GPisoExclusionsBridge');
                        labelBridge.innerHTML = 'Ponts';
                        div.appendChild(labelBridge);
                        break;
                    }
                }
            }
            return div;
        },
        _createIsoSubmitFormElement: function () {
            var input = document.createElement('input');
            input.id = this._addUID('GPisochronSubmit');
            input.className = 'GPinputSubmit';
            input.type = 'submit';
            input.value = 'Calculer';
            return input;
        },
        _createIsoFormResetElement: function () {
            var self = this;
            var divReset = document.createElement('div');
            divReset.id = this._addUID('GPisochronReset');
            divReset.title = 'Réinitialiser les paramètres';
            divReset.addEventListener('click', function (e) {
                self.onIsoResetClick(e);
            });
            return divReset;
        }
    };
    return IsoDOM;
}();
Ol3ControlsIsocurve = function (ol, Gp, Utils, woodman, RightManagement, SelectorID, LocationSelector, LayerSwitcher, Markers, IsoDOM) {
    function Isocurve(options) {
        options = options || {};
        if (!(this instanceof Isocurve)) {
            throw new TypeError('ERROR CLASS_CONSTRUCTOR');
        }
        this.initialize(options);
        this._container = this._createMainContainerElement();
        this._containerElement = null;
        if (options.element && options.element.appendChild) {
            options.element.appendChild(this._container);
            this._containerElement = options.element;
        }
        ol.control.Control.call(this, {
            element: this._containerElement || this._container,
            target: options.target,
            render: options.render
        });
    }
    ol.inherits(Isocurve, ol.control.Control);
    Isocurve.prototype = Object.create(ol.control.Control.prototype, {});
    Utils.assign(Isocurve.prototype, IsoDOM);
    Isocurve.prototype.constructor = Isocurve;
    Isocurve.prototype.getCollapsed = function () {
        return this.collapsed;
    };
    Isocurve.prototype.setCollapsed = function (collapsed) {
        if (collapsed === undefined) {
            console.log('[ERROR] Isocurve:setCollapsed - missing collapsed parameter');
            return;
        }
        if (collapsed && this.collapsed || !collapsed && !this.collapsed) {
            return;
        }
        if (collapsed) {
            document.getElementById('GPisochronPanelClose-' + this._uid).click();
        } else {
            document.getElementById('GPshowIsochronPicto-' + this._uid).click();
        }
        this.collapsed = collapsed;
    };
    Isocurve.prototype.getLayer = function () {
        return this._geojsonLayer;
    };
    Isocurve.prototype.setMap = function (map) {
        if (map) {
            this._container = this._initContainer(map);
        }
        ol.control.Control.prototype.setMap.call(this, map);
    };
    Isocurve.prototype.initialize = function (options) {
        this._checkInputOptions(options);
        this.options = {
            collapsed: true,
            methods: [
                'time',
                'distance'
            ],
            graphs: [
                'Voiture',
                'Pieton'
            ],
            exclusions: {
                toll: false,
                tunnel: false,
                bridge: false
            },
            directions: [
                'departure',
                'arrival'
            ],
            markerOpts: {
                url: Markers['lightOrange'],
                offset: Markers.defaultOffset
            },
            isocurveOptions: {},
            autocompleteOptions: {}
        };
        Utils.assign(this.options, options);
        this.collapsed = this.options.collapsed;
        this._uid = SelectorID.generate();
        this._currentTransport = null;
        this._initTransport();
        this._currentComputation = null;
        this._initComputation();
        this._currentExclusions = [];
        this._initExclusions();
        this._currentDirection = null;
        this._initDirection();
        this._originPoint = null;
        this._showIsoContainer = null;
        this._waitingContainer = null;
        this._formContainer = null;
        this._currentIsoResults = null;
        this._geojsonLayer;
        this._waiting = false;
        this._timer = null;
        this._defaultFeatureStyle = new ol.style.Style({ fill: new ol.style.Fill({ color: 'rgba(0, 183, 152, 0.7)' }) });
        this._resources = {};
        this._noRightManagement = false;
        this._checkRightsManagement();
    };
    Isocurve.prototype._checkInputOptions = function (options) {
        var i;
        if (options.methods) {
            if (Array.isArray(options.methods)) {
                if (options.methods.length === 0) {
                    options.methods = null;
                } else {
                    for (i = 0; i < options.methods.length; i++) {
                        if (typeof options.methods[i] !== 'string') {
                            console.log('[ol.control.Isocurve] ERROR : parameter \'methods\' elements should be of type \'string\'');
                        }
                    }
                }
            } else {
                options.methods = null;
            }
        }
        if (options.graphs) {
            if (Array.isArray(options.graphs)) {
                if (options.graphs.length === 0) {
                    options.graphs = null;
                } else {
                    for (i = 0; i < options.graphs.length; i++) {
                        if (typeof options.graphs[i] !== 'string') {
                            console.log('[ol.control.Isocurve] ERROR : parameter \'graphs\' elements should be of type \'string\'');
                        } else {
                            if (options.graphs[i].toLowerCase() === 'pieton') {
                                options.graphs[i] = 'Pieton';
                            }
                            if (options.graphs[i].toLowerCase() === 'voiture') {
                                options.graphs[i] = 'Voiture';
                            }
                        }
                    }
                }
            } else {
                options.graphs = null;
            }
        }
        if (options.directions) {
            if (Array.isArray(options.directions)) {
                if (options.directions.length === 0) {
                    options.directions = null;
                } else {
                    for (i = 0; i < options.directions.length; i++) {
                        if (typeof options.directions[i] !== 'string') {
                            console.log('[ol.control.Isocurve] ERROR : parameter \'directions\' elements should be of type \'string\'');
                        }
                    }
                }
            } else {
                options.directions = null;
            }
        }
        if (options.collapsed === 'true') {
            options.collapsed = true;
        }
        if (options.collapsed === 'false') {
            options.collapsed = false;
        }
    };
    Isocurve.prototype._initTransport = function () {
        this._currentTransport = 'Voiture';
        var transports = this.options.graphs;
        if (!transports || transports.length === 0) {
            this.options.graphs = [
                'Voiture',
                'Pieton'
            ];
        }
        if (Array.isArray(transports) && transports.length) {
            if (transports[0] === 'Voiture' || transports[0] === 'Pieton') {
                this._currentTransport = transports[0];
            }
        }
        var serviceOptions = this.options.isocurveOptions;
        if (serviceOptions.graph) {
            this._currentTransport = serviceOptions.graph;
        }
    };
    Isocurve.prototype._initComputation = function () {
        this._currentComputation = 'time';
        var methods = this.options.methods;
        if (!methods || methods.length === 0) {
            this.options.methods = [
                'time',
                'distance'
            ];
        }
        if (Array.isArray(methods) && methods.length) {
            if (methods[0] === 'time' || methods[0] === 'distance') {
                this._currentComputation = methods[0];
            }
        }
        var serviceOptions = this.options.isocurveOptions;
        if (serviceOptions.method) {
            this._currentComputation = serviceOptions.method;
        }
        if (serviceOptions.time) {
            this._currentComputation = 'time';
        }
        if (serviceOptions.distance) {
            this._currentComputation = 'distance';
        }
    };
    Isocurve.prototype._initDirection = function () {
        this._currentDirection = 'departure';
        var directions = this.options.directions;
        if (!directions || directions.length === 0) {
            this.options.directions = [
                'departure',
                'arrival'
            ];
        }
        if (Array.isArray(directions) && directions.length) {
            if (directions[0] === 'departure' || directions[0] === 'arrival') {
                this._currentDirection = directions[0];
            }
        }
        var serviceOptions = this.options.isocurveOptions;
        if (!serviceOptions.reverse) {
            this._currentDirection = 'departure';
        }
        if (serviceOptions.reverse === true) {
            this._currentDirection = 'arrival';
            this.options.directions = [
                'arrival',
                'departure'
            ];
        }
    };
    Isocurve.prototype._initExclusions = function () {
        this._currentExclusions = [];
        var exclusion = this.options.exclusions;
        if (!exclusion || typeof exclusion === 'object' && Object.keys(exclusion).length === 0) {
            this.options.exclusions = {
                toll: false,
                tunnel: false,
                bridge: false
            };
        }
        if (exclusion && typeof exclusion === 'object' && Object.keys(exclusion).length) {
            for (var k in exclusion) {
                if (exclusion.hasOwnProperty(k)) {
                    if (exclusion.k) {
                        this._currentExclusions.push(k);
                    }
                }
            }
        }
        var serviceOptions = this.options.isocurveOptions;
        if (Array.isArray(serviceOptions.exclusions)) {
            this._currentExclusions = serviceOptions.exclusions;
        }
    };
    Isocurve.prototype._checkRightsManagement = function () {
        var _opts = null;
        var _res = [];
        var _key = null;
        _key = this.options.isocurveOptions.apiKey;
        _opts = this.options.isocurveOptions.filterOptions;
        _res = _opts ? _opts.type : [];
        if (!_res || _res.length === 0) {
            _res = [
                'Voiture',
                'Pieton'
            ];
        }
        var rightManagementIsocurve = RightManagement.check({
            key: _key || this.options.apiKey,
            resources: _res,
            services: ['Isochrone']
        });
        _key = this.options.autocompleteOptions.apiKey;
        _opts = this.options.autocompleteOptions.filterOptions;
        _res = _opts ? _opts.type : [];
        if (!_res || _res.length === 0) {
            _res = [
                'PositionOfInterest',
                'StreetAddress'
            ];
        }
        var rightManagementAutoComplete = RightManagement.check({
            key: _key || this.options.apiKey,
            resources: _res,
            services: ['AutoCompletion']
        });
        if (!rightManagementIsocurve && !rightManagementAutoComplete) {
            this._noRightManagement = true;
        }
        if (rightManagementAutoComplete) {
            this._resources['AutoCompletion'] = {};
            this._resources['AutoCompletion']['resources'] = rightManagementAutoComplete['AutoCompletion'];
            this._resources['AutoCompletion']['key'] = rightManagementAutoComplete['key'];
        }
        if (rightManagementIsocurve) {
            this._resources['Isocurve'] = {};
            this._resources['Isocurve']['resources'] = rightManagementIsocurve['Isochrone'];
            this._resources['Isocurve']['key'] = rightManagementIsocurve['key'];
        }
    };
    Isocurve.prototype._initContainer = function (map) {
        var container = this._container;
        var inputShow = this._showIsoContainer = this._createShowIsoElement();
        container.appendChild(inputShow);
        if (!this.collapsed) {
            inputShow.checked = true;
        }
        var picto = this._createShowIsoPictoElement();
        container.appendChild(picto);
        var panel = this._createIsoPanelElement();
        var header = this._createIsoPanelHeaderElement();
        panel.appendChild(header);
        var form = this._formContainer = this._createIsoPanelFormElement();
        var point = this._createIsoPanelFormPointElement(map);
        form.appendChild(point);
        var isoChronChecked = false;
        var isoDistChecked = false;
        var typeChoice = this._createIsoPanelFormTypeChoiceElement();
        for (var i = 0; i < this.options.methods.length; i++) {
            if (this.options.methods[i] === 'time') {
                isoChronChecked = i === 0 ? true : false;
                typeChoice.appendChild(this._createIsoPanelFormTypeChoiceChronElement(isoChronChecked));
            }
            if (this.options.methods[i] === 'distance') {
                isoDistChecked = i === 0 ? true : false;
                typeChoice.appendChild(this._createIsoPanelFormTypeChoiceDistElement(isoDistChecked));
            }
        }
        form.appendChild(typeChoice);
        form.appendChild(this._createIsoPanelFormValueIsochronElement(isoChronChecked));
        form.appendChild(this._createIsoPanelFormValueIsodistanceElement(isoDistChecked));
        var modeChoice = this._createIsoPanelFormModeChoiceElement();
        modeChoice.appendChild(this._createIsoPanelFormModeChoiceTransportElement(this.options.graphs));
        modeChoice.appendChild(this._createIsoPanelFormModeChoiceDirectionElement(this.options.directions));
        form.appendChild(modeChoice);
        if (this.options.exclusions && typeof this.options.exclusions === 'object' && Object.keys(this.options.exclusions).length !== 0) {
            form.appendChild(this._createShowIsoExclusionsElement());
            form.appendChild(this._createShowIsoExclusionsPictoElement());
            var exclusion = this._createIsoPanelFormExclusionsElement();
            exclusion.appendChild(this._createIsoPanelFormExclusionOptionsElement(this.options.exclusions));
            form.appendChild(exclusion);
        }
        var divReset = this._createIsoFormResetElement();
        form.appendChild(divReset);
        var submit = this._submitContainer = this._createIsoSubmitFormElement();
        form.appendChild(submit);
        panel.appendChild(form);
        var waiting = this._waitingContainer = this._createIsoWaitingElement();
        panel.appendChild(waiting);
        container.appendChild(panel);
        var context = this;
        if (container.addEventListener) {
            container.addEventListener('click', function (e) {
                context._hideIsoSuggestedLocations.call(context, e);
            });
        }
        return container;
    };
    Isocurve.prototype._createIsoPanelFormPointElement = function (map) {
        this._originPoint = new LocationSelector({
            apiKey: this.options.apiKey || null,
            tag: {
                id: 1,
                groupId: this._uid,
                markerOpts: this.options.markerOpts,
                label: 'Départ',
                display: true
            },
            autocompleteOptions: this.options.autocompleteOptions || null
        });
        this._originPoint.setMap(map);
        var self = this;
        document.getElementById('GPlocationOriginPointerImg_1-' + this._uid).onclick = function () {
            self._clearGeojsonLayer();
            var map = self.getMap();
            if (self._originPoint._inputShowPointerContainer.checked) {
                self._formContainer.className = 'GPisochronFormMini';
                map.on('click', function () {
                    self._formContainer.className = '';
                });
            } else {
                self._formContainer.className = '';
                map.un('click', function () {
                    self._formContainer.className = '';
                });
            }
        };
        document.getElementById('GPlocationOriginLabel_1-' + this._uid).onclick = function () {
            self._clearGeojsonLayer();
            self._formContainer.className = '';
            map.un('click', function () {
                self._formContainer.className = '';
            });
        };
        document.getElementById('GPlocationOrigin_1-' + this._uid).onclick = function () {
            self._clearGeojsonLayer();
        };
        return this._originPoint._container;
    };
    Isocurve.prototype.onIsoComputationSubmit = function () {
        if (!this._originPoint || !this._originPoint.getCoordinate || !this._originPoint.getCoordinate()) {
            console.log('[Isocurve] Missing position parameter to submit isocurve request');
            return;
        }
        var positionCoordinates = this._originPoint.getCoordinate();
        var position = {
            x: positionCoordinates[0],
            y: positionCoordinates[1]
        };
        var time;
        var distance;
        if (this._currentComputation.toLowerCase() === 'time') {
            var timeHourInput = document.getElementById('GPisochronValueChronInput1-' + this._uid);
            var hours = parseInt(timeHourInput.value, 10);
            if (isNaN && isNaN(hours)) {
                hours = 0;
            }
            var timeMinutesInput = document.getElementById('GPisochronValueChronInput2-' + this._uid);
            var minutes = parseInt(timeMinutesInput.value, 10);
            if (isNaN && isNaN(minutes)) {
                minutes = 0;
            }
            time = hours * 3600 + minutes * 60;
        }
        if (this._currentComputation.toLowerCase() === 'distance') {
            var distInput = document.getElementById('GPisochronValueDistInput-' + this._uid);
            distance = parseFloat(distInput.value) * 1000;
        }
        if (!time && !distance) {
            console.log('[Isocurve] Missing time or distance parameter to submit isocurve request');
            return;
        }
        if (this._noRightManagement) {
            console.log('[Isocurve] no rights for this service');
            return;
        }
        var options = this.options.isocurveOptions || {};
        var _protocol = options.protocol || 'XHR';
        var _timeout = options.timeOut || 0;
        if (_protocol === 'JSONP' && _timeout === 0) {
            _timeout = 15000;
        }
        var context = this;
        var isoRequestOptions = {
            position: position,
            graph: options.graph || this._currentTransport,
            exclusions: options.exclusions || this._currentExclusions,
            method: options.method || this._currentComputation,
            smoothing: options.smoothing || true,
            timeOut: _timeout,
            protocol: _protocol,
            onSuccess: function (results) {
                if (results) {
                    context._drawIsoResults(results);
                }
            },
            onFailure: function (error) {
                context._hideWaitingContainer();
            }
        };
        if (this._currentDirection.toLowerCase() === 'arrival' || options.reverse) {
            isoRequestOptions.reverse = true;
        }
        if (time) {
            isoRequestOptions.time = time;
        }
        if (distance) {
            isoRequestOptions.distance = distance;
        }
        this._requestIsoCurve(isoRequestOptions);
    };
    Isocurve.prototype.onShowIsoPanelClick = function () {
        this.collapsed = this._showIsoContainer.checked;
        this.dispatchEvent('change:collapsed');
    };
    Isocurve.prototype.onIsoTypeChoiceChange = function (e) {
        var value = e.target.value;
        if (!value) {
            return;
        }
        if (value === 'isodistance') {
            this._currentComputation = 'distance';
        }
        if (value === 'isochron') {
            this._currentComputation = 'time';
        }
    };
    Isocurve.prototype.onIsoModeTransportChange = function (e) {
        var value = e.target.value;
        if (!value) {
            return;
        }
        this._currentTransport = value;
    };
    Isocurve.prototype.onIsoModeDirectionChange = function (e) {
        var value = e.target.value;
        if (!value) {
            return;
        }
        if (value.toLowerCase() === 'arrival') {
            this._originPoint._inputLabelContainer.innerHTML = 'Arrivée';
        } else {
            this._originPoint._inputLabelContainer.innerHTML = 'Départ';
        }
        this._currentDirection = value;
    };
    Isocurve.prototype.onIsoExclusionsChange = function (e) {
        var value = e.target.value;
        var checked = e.target.checked;
        if (!value) {
            return;
        }
        var bFound = false;
        var iFound = null;
        for (var i = 0; i < this._currentExclusions.length; i++) {
            if (this._currentExclusions[i] === value) {
                iFound = i;
                bFound = true;
            }
        }
        if (!bFound && !checked) {
            this._currentExclusions.push(value);
        }
        if (bFound && checked) {
            this._currentExclusions[iFound] = null;
        }
    };
    Isocurve.prototype.onIsoResetClick = function () {
        this._clear();
    };
    Isocurve.prototype._requestIsoCurve = function (options) {
        if (!options || typeof options === 'object' && Object.keys(options).length === 0) {
            return;
        }
        if (!options.position) {
            return;
        }
        if (this._noRightManagement || !this._resources['Isocurve']) {
            console.log('no rights for this service');
            return;
        }
        var resources = this._resources['Isocurve'].resources;
        if (!resources || typeof resources === 'object' && Object.keys(resources).length === 0) {
            console.log('no rights for this service');
            return;
        }
        var bFound = false;
        for (var i = 0; i < resources.length; i++) {
            if (resources[i] === options.graph) {
                bFound = true;
            }
        }
        if (!bFound) {
            console.log('no rights for this service !?');
            return;
        }
        var key = this._resources['Isocurve']['key'];
        options.apiKey = this.options.isocurveOptions.apiKey || this.options.apiKey || key;
        this._clearGeojsonLayer();
        this._displayWaitingContainer();
        Gp.Services.isoCurve(options);
    };
    Isocurve.prototype._drawIsoResults = function (results) {
        this._currentIsoResults = results;
        this._hideWaitingContainer();
        if (!results.geometry) {
            return;
        }
        var map = this.getMap();
        var geojsonObject = {
            type: 'Feature',
            crs: {
                type: 'name',
                properties: { name: 'EPSG:4326' }
            },
            geometry: results.geometry
        };
        var geojsonformat = new ol.format.GeoJSON({ defaultDataProjection: 'EPSG:4326' });
        var mapProj = map.getView().getProjection().getCode();
        var features = geojsonformat.readFeatures(geojsonObject, {
            dataProjection: 'EPSG:4326',
            featureProjection: mapProj
        });
        this._geojsonLayer = new ol.layer.Vector({
            source: new ol.source.Vector({ features: features }),
            style: this._defaultFeatureStyle,
            opacity: 0.9
        });
        var graph;
        if (this._currentTransport === 'Pieton') {
            graph = 'piéton';
            this._geojsonLayer.gpResultLayerId = 'Pieton$GEOPORTAIL:GPP:Isocurve';
        } else {
            graph = 'voiture';
            this._geojsonLayer.gpResultLayerId = 'Voiture$GEOPORTAIL:GPP:Isocurve';
        }
        map.addLayer(this._geojsonLayer);
        if (features[0] && features[0].getGeometry() && features[0].getGeometry().getExtent()) {
            var extent = features[0].getGeometry().getExtent();
            map.getView().fit(extent, map.getSize());
        }
        var method = this._currentComputation === 'time' ? 'Isochrone' : 'Isodistance';
        map.getControls().forEach(function (control) {
            if (control instanceof LayerSwitcher) {
                var layerId = this._geojsonLayer.gpLayerId;
                if (control._layers[layerId].title === layerId) {
                    control.addLayer(this._geojsonLayer, {
                        title: method + ' ' + graph,
                        description: method + ' basé sur un graphe ' + graph
                    });
                }
            }
        }, this);
    };
    Isocurve.prototype._clear = function () {
        this._clearIsoInputs();
        this._originPoint.clear();
        this._clearGeojsonLayer();
        this._currentIsoResults = null;
    };
    Isocurve.prototype._clearIsoInputs = function () {
        var timeHourInput = document.getElementById('GPisochronValueChronInput1-' + this._uid);
        if (timeHourInput) {
            timeHourInput.value = '0';
        }
        var timeMinutesInput = document.getElementById('GPisochronValueChronInput2-' + this._uid);
        if (timeMinutesInput) {
            timeMinutesInput.value = '0';
        }
        var distInput = document.getElementById('GPisochronValueDistInput-' + this._uid);
        if (distInput) {
            distInput.value = '0';
        }
        this._initTransport();
        this._initComputation();
        this._initDirection();
        this._initExclusions();
        var transportdiv;
        if (this._currentTransport === 'Pieton') {
            transportdiv = document.getElementById('GPisochronTransportPedestrian-' + this._uid);
            if (transportdiv) {
                transportdiv.checked = 'true';
            }
        } else {
            transportdiv = document.getElementById('GPisochronTransportCar-' + this._uid);
            if (transportdiv) {
                transportdiv.checked = 'true';
            }
        }
        var computationdiv;
        if (this._currentComputation.toLowerCase() === 'distance') {
            computationdiv = document.getElementById('GPisochronChoiceAltDist-' + this._uid);
            if (computationdiv) {
                computationdiv.checked = 'true';
            }
            if (document.getElementById('GPisochronValueDist-' + this._uid)) {
                document.getElementById('GPisochronValueDist-' + this._uid).className = 'GPflexInput';
            }
            if (document.getElementById('GPisochronValueChron-' + this._uid)) {
                document.getElementById('GPisochronValueChron-' + this._uid).className = 'GPisochronValueHidden';
            }
        } else {
            computationdiv = document.getElementById('GPisochronChoiceAltChron-' + this._uid);
            if (computationdiv) {
                computationdiv.checked = 'true';
            }
            if (document.getElementById('GPisochronValueChron-' + this._uid)) {
                document.getElementById('GPisochronValueChron-' + this._uid).className = 'GPflexInput';
            }
            if (document.getElementById('GPisochronValueDist-' + this._uid)) {
                document.getElementById('GPisochronValueDist-' + this._uid).className = 'GPisochronValueHidden';
            }
        }
        var directionSelect = document.getElementById('GPisochronDirectionSelect-' + this._uid);
        if (directionSelect) {
            directionSelect.value = this._currentDirection;
        }
        if (this._currentDirection === 'arrival') {
            this._originPoint._inputLabelContainer.innerHTML = 'Arrivée';
        } else {
            this._originPoint._inputLabelContainer.innerHTML = 'Départ';
        }
        var tollInput = document.getElementById('GPisoExclusionsToll-' + this._uid);
        if (tollInput) {
            if (this._currentExclusions.indexOf('toll') !== -1) {
                tollInput.checked = false;
            } else {
                tollInput.checked = true;
            }
        }
        var tunnelInput = document.getElementById('GPisoExclusionsTunnel-' + this._uid);
        if (tunnelInput) {
            if (this._currentExclusions.indexOf('tunnel') !== -1) {
                tunnelInput.checked = false;
            } else {
                tunnelInput.checked = true;
            }
        }
        var bridgeInput = document.getElementById('GPisoExclusionsBridge-' + this._uid);
        if (bridgeInput) {
            if (this._currentExclusions.indexOf('bridge') !== -1 && bridgeInput) {
                bridgeInput.checked = false;
            } else {
                bridgeInput.checked = true;
            }
        }
    };
    Isocurve.prototype._clearGeojsonLayer = function () {
        var map = this.getMap();
        if (this._geojsonLayer) {
            map.removeLayer(this._geojsonLayer);
            this._geojsonLayer = null;
        }
    };
    Isocurve.prototype._hideIsoSuggestedLocations = function (e) {
        if (e.target && e.target.id && e.target.id.indexOf('GPlocationOrigin_') !== -1) {
            return;
        } else {
            this._originPoint._hideSuggestedLocation();
        }
    };
    Isocurve.prototype._displayWaitingContainer = function () {
        this._waitingContainer.className = 'GPisochronCalcWaitingContainerVisible';
        this._waiting = true;
        var opts = this.options.isocurveOptions;
        if (opts && opts.timeOut) {
            if (this._timer) {
                clearTimeout(this._timer);
                this._timer = null;
            }
            var context = this;
            this._timer = setTimeout(function () {
                if (context._waiting === true) {
                    context._hideWaitingContainer();
                } else {
                    if (context._timer) {
                        clearTimeout(context._timer);
                    }
                }
            }, 16000);
        }
    };
    Isocurve.prototype._hideWaitingContainer = function () {
        if (this._waiting) {
            this._waitingContainer.className = 'GPisochronCalcWaitingContainerHidden';
            this._waiting = false;
            var opts = this.options.isocurveOptions;
            if (opts && opts.timeOut) {
                clearTimeout(this._timer);
                this._timer = null;
            }
        }
    };
    return Isocurve;
}(ol, gp, Ol3Utils, {}, CommonUtilsCheckRightManagement, CommonUtilsSelectorID, Ol3ControlsLocationSelector, Ol3ControlsLayerSwitcher, Ol3ControlsUtilsMarkers, CommonControlsIsoDOM);
CommonControlsReverseGeocodingDOM = function () {
    var ReverseGeocodingDOM = {
        _addUID: function (id) {
            var uid = this._uid ? id + '-' + this._uid : id;
            return uid;
        },
        _createMainContainerElement: function () {
            var container = document.createElement('div');
            container.id = this._addUID('GPreverseGeocoding');
            container.className = 'GPwidget';
            return container;
        },
        _createShowReverseGeocodingElement: function () {
            var input = document.createElement('input');
            input.id = this._addUID('GPshowReverseGeocoding');
            input.type = 'checkbox';
            return input;
        },
        _createShowReverseGeocodingPictoElement: function () {
            var self = this;
            var label = document.createElement('label');
            label.id = this._addUID('GPshowReverseGeocodingPicto');
            label.className = 'GPshowAdvancedToolPicto';
            label.htmlFor = this._addUID('GPshowReverseGeocoding');
            label.title = 'Ouvrir la recherche inverse';
            if (label.addEventListener) {
                label.addEventListener('click', function () {
                    self.onShowReverseGeocodingClick();
                });
            } else if (label.attachEvent) {
                label.attachEvent('onclick', function () {
                    self.onShowReverseGeocodingClick();
                });
            }
            var spanOpen = document.createElement('span');
            spanOpen.id = this._addUID('GPshowReverseGeocodingOpen');
            spanOpen.className = 'GPshowAdvancedToolOpen';
            label.appendChild(spanOpen);
            return label;
        },
        _createReverseGeocodingWaitingElement: function () {
            var div = document.createElement('div');
            div.id = this._addUID('GPreverseGeocodingCalcWaitingContainer');
            div.className = 'GPreverseGeocodingCalcWaitingContainerHidden';
            var p = document.createElement('p');
            p.className = 'GPreverseGeocodingCalcWaiting';
            p.innerHTML = 'Recherche en cours...';
            div.appendChild(p);
            return div;
        },
        _createReverseGeocodingResultsPanelElement: function () {
            var resultsPanelDiv = document.createElement('div');
            resultsPanelDiv.id = this._addUID('GPreverseGeocodingResultsPanel');
            resultsPanelDiv.className = 'GPpanel GPreverseGeocodingComponentHidden';
            return resultsPanelDiv;
        },
        _createReverseGeocodingResultsListElement: function () {
            var container = document.createElement('div');
            container.id = this._addUID('GPreverseGeocodingResultsList');
            return container;
        },
        _createReverseGeocodingResultElement: function (locationDescription, id) {
            var context = this;
            var container = document.getElementById(this._addUID('GPreverseGeocodingResultsList'));
            var div = document.createElement('div');
            div.id = this._addUID('ReverseGeocodedLocation_' + id);
            div.className = 'GPautoCompleteProposal';
            div.innerHTML = locationDescription;
            div.title = locationDescription;
            if (div.addEventListener) {
                div.addEventListener('mouseover', function (e) {
                    context.onReverseGeocodingResultMouseOver(e);
                });
                div.addEventListener('mouseout', function (e) {
                    context.onReverseGeocodingResultMouseOut(e);
                });
                div.addEventListener('click', function (e) {
                    if (typeof context.onReverseGeocodingResultClick === 'function') {
                        context.onReverseGeocodingResultClick(e);
                    }
                });
            } else if (div.attachEvent) {
                div.attachEvent('onmouseover', function (e) {
                    context.onReverseGeocodingResultMouseOver(e);
                });
                div.attachEvent('onmouseout', function (e) {
                    context.onReverseGeocodingResultMouseOut(e);
                });
                div.attachEvent('onclick', function (e) {
                    if (typeof context.onReverseGeocodingResultClick === 'function') {
                        context.onReverseGeocodingResultClick(e);
                    }
                });
            }
            container.appendChild(div);
        },
        _createReverseGeocodingPanelElement: function () {
            var div = document.createElement('div');
            div.id = this._addUID('GPreverseGeocodingPanel');
            div.className = 'GPpanel';
            return div;
        },
        _createReverseGeocodingPanelHeaderElement: function () {
            var container = document.createElement('div');
            container.className = 'GPpanelHeader';
            return container;
        },
        _createReverseGeocodingPanelReturnPictoElement: function () {
            var self = this;
            var divNew = document.createElement('div');
            divNew.id = this._addUID('GPreverseGeocodingReturnPicto');
            divNew.title = 'Nouvelle recherche';
            divNew.className = 'GPreverseGeocodingReturnPictoHidden';
            if (divNew.addEventListener) {
                divNew.addEventListener('click', function (e) {
                    document.getElementById(self._addUID('GPreverseGeocodingResultsPanel')).className = 'GProuteComponentHidden';
                    document.getElementById(self._addUID('GPreverseGeocodingForm')).className = '';
                    document.getElementById(self._addUID('GPreverseGeocodingHeaderTitle')).innerHTML = 'Recherche inverse';
                    document.getElementById(self._addUID('GPreverseGeocodingReturnPicto')).className = 'GPreverseGeocodingReturnPictoHidden';
                    self.onGPreverseGeocodingReturnPictoClick(e);
                });
            } else if (divNew.attachEvent) {
                divNew.attachEvent('onclick', function (e) {
                    document.getElementById(self._addUID('GPreverseGeocodingResultsPanel')).className = 'GProuteComponentHidden';
                    document.getElementById(self._addUID('GPreverseGeocodingForm')).className = '';
                    document.getElementById(self._addUID('GPreverseGeocodingHeaderTitle')).innerHTML = 'Recherche inverse';
                    document.getElementById(self._addUID('GPreverseGeocodingReturnPicto')).className = 'GPreverseGeocodingReturnPictoHidden';
                    self.onGPreverseGeocodingReturnPictoClick(e);
                });
            }
            return divNew;
        },
        _createReverseGeocodingPanelTitleElement: function () {
            var div = document.createElement('div');
            div.className = 'GPpanelTitle';
            div.id = this._addUID('GPreverseGeocodingHeaderTitle');
            div.innerHTML = 'Recherche inverse';
            return div;
        },
        _createReverseGeocodingPanelCloseElement: function () {
            var self = this;
            var divClose = document.createElement('div');
            divClose.id = this._addUID('GPreverseGeocodingPanelClose');
            divClose.className = 'GPpanelClose';
            divClose.title = 'Fermer le panneau';
            if (divClose.addEventListener) {
                divClose.addEventListener('click', function () {
                    document.getElementById(self._addUID('GPshowReverseGeocodingPicto')).click();
                }, false);
            } else if (divClose.attachEvent) {
                divClose.attachEvent('onclick', function () {
                    document.getElementById(self._addUID('GPshowReverseGeocodingPicto')).click();
                });
            }
            return divClose;
        },
        _createReverseGeocodingPanelFormElement: function () {
            var self = this;
            var form = document.createElement('form');
            form.id = this._addUID('GPreverseGeocodingForm');
            if (form.addEventListener) {
                form.addEventListener('submit', function (e) {
                    e.preventDefault();
                    self.onReverseGeocodingSubmit();
                });
            } else if (form.attachEvent) {
                form.attachEvent('onsubmit', function (e) {
                    e.preventDefault();
                    self.onReverseGeocodingSubmit();
                });
            }
            return form;
        },
        _createReverseGeocodingFormModeChoiceGeocodingTypeElement: function (resources) {
            var context = this;
            var div = document.createElement('div');
            div.className = 'GPflexInput';
            var label = document.createElement('label');
            label.className = 'GPreverseGeocodingCodeLabel';
            label.innerHTML = 'Recherche par';
            label.title = 'Recherche par';
            div.appendChild(label);
            var select = document.createElement('select');
            select.className = 'GPreverseGeocodingCode';
            if (select.addEventListener) {
                select.addEventListener('change', function (e) {
                    context.onReverseGeocodingTypeChange(e);
                });
            } else if (select.attachEvent) {
                select.attachEvent('onchange', function (e) {
                    context.onReverseGeocodingTypeChange(e);
                });
            }
            if (!resources || !Array.isArray(resources)) {
                resources = [
                    'StreetAddress',
                    'PositionOfInterest',
                    'CadastralParcel'
                ];
            }
            for (var i = 0; i < resources.length; i++) {
                switch (resources[i]) {
                case 'PositionOfInterest':
                    var POIOption = document.createElement('option');
                    POIOption.value = 'PositionOfInterest';
                    POIOption.text = 'Lieux/toponymes';
                    select.appendChild(POIOption);
                    break;
                case 'StreetAddress':
                    var SAOption = document.createElement('option');
                    SAOption.value = 'StreetAddress';
                    SAOption.text = 'Adresses';
                    select.appendChild(SAOption);
                    break;
                case 'CadastralParcel':
                    var CPOption = document.createElement('option');
                    CPOption.value = 'CadastralParcel';
                    CPOption.text = 'Parcelles cadastrales';
                    select.appendChild(CPOption);
                    break;
                case 'Administratif':
                    var adminOption = document.createElement('option');
                    adminOption.value = 'Administratif';
                    adminOption.text = 'Unités administratives';
                    select.appendChild(adminOption);
                    break;
                default:
                    break;
                }
            }
            div.appendChild(select);
            return div;
        },
        _createReverseGeocodingFormModeChoiceGeocodingDelimitationElement: function (delimitations) {
            var context = this;
            var div = document.createElement('div');
            div.className = 'GPflexInput';
            var label = document.createElement('label');
            label.className = 'GPreverseGeocodingCodeLabel';
            label.innerHTML = 'Délimitation';
            label.title = 'Délimitation';
            div.appendChild(label);
            var select = document.createElement('select');
            select.className = 'GPreverseGeocodingCode';
            if (select.addEventListener) {
                select.addEventListener('change', function (e) {
                    context.onReverseGeocodingDelimitationChange(e);
                });
            } else if (select.attachEvent) {
                select.attachEvent('onchange', function (e) {
                    context.onReverseGeocodingDelimitationChange(e);
                });
            }
            if (!delimitations || !Array.isArray(delimitations)) {
                delimitations = [
                    'Point',
                    'Circle',
                    'Extent'
                ];
            }
            for (var i = 0; i < delimitations.length; i++) {
                switch (delimitations[i].toLowerCase()) {
                case 'point':
                    var pointOption = document.createElement('option');
                    pointOption.value = 'point';
                    pointOption.text = 'Pointer un lieu';
                    select.appendChild(pointOption);
                    break;
                case 'circle':
                    var circleOption = document.createElement('option');
                    circleOption.value = 'circle';
                    circleOption.text = 'Dessiner un cercle';
                    select.appendChild(circleOption);
                    break;
                case 'extent':
                    var extentOption = document.createElement('option');
                    extentOption.value = 'extent';
                    extentOption.text = 'Dessiner une emprise';
                    select.appendChild(extentOption);
                    break;
                default:
                    break;
                }
            }
            div.appendChild(select);
            return div;
        },
        _createReverseGeocodingSubmitFormElement: function () {
            var input = document.createElement('input');
            input.id = this._addUID('GPreverseGeocodingSubmit');
            input.className = 'GPinputSubmit';
            input.type = 'submit';
            input.value = 'Rechercher';
            return input;
        }
    };
    return ReverseGeocodingDOM;
}();
Ol3ControlsReverseGeocode = function (woodman, ol, Gp, Utils, Markers, LayerSwitcher, RightManagement, SelectorID, ReverseGeocodingDOM) {
    function ReverseGeocode(options) {
        options = options || {};
        if (!(this instanceof ReverseGeocode)) {
            throw new TypeError('ERROR CLASS_CONSTRUCTOR');
        }
        this.initialize(options);
        this._container = this._initContainer();
        this._containerElement = null;
        if (options.element && options.element.appendChild) {
            options.element.appendChild(this._container);
            this._containerElement = options.element;
        }
        ol.control.Control.call(this, {
            element: this._containerElement || this._container,
            target: options.target,
            render: options.render
        });
    }
    ol.inherits(ReverseGeocode, ol.control.Control);
    ReverseGeocode.prototype = Object.create(ol.control.Control.prototype, {});
    Utils.assign(ReverseGeocode.prototype, ReverseGeocodingDOM);
    ReverseGeocode.prototype.constructor = ReverseGeocode;
    ReverseGeocode.prototype.getCollapsed = function () {
        return this.collapsed;
    };
    ReverseGeocode.prototype.setCollapsed = function (collapsed) {
        if (collapsed === undefined) {
            console.log('[ERROR] ReverseGeocode:setCollapsed - missing collapsed parameter');
            return;
        }
        if (collapsed && this.collapsed || !collapsed && !this.collapsed) {
            return;
        }
        if (collapsed) {
            document.getElementById('GPreverseGeocodingPanelClose-' + this._uid).click();
        } else {
            document.getElementById('GPshowReverseGeocoding-' + this._uid).click();
        }
        this.collapsed = collapsed;
    };
    ReverseGeocode.prototype.setMap = function (map) {
        if (map) {
            this._activateMapInteraction(map);
        } else {
            var _map = this.getMap();
            this._clearResults();
            this._clearInputFeatures();
            this._removeMapInteraction(_map);
            if (this._inputFeaturesLayer != null) {
                _map.removeLayer(this._inputFeaturesLayer);
                this._inputFeaturesLayer = null;
                this._inputFeaturesSources = null;
                this._inputFeatures = null;
            }
        }
        ol.control.Control.prototype.setMap.call(this, map);
    };
    ReverseGeocode.prototype.initialize = function (options) {
        this._checkInputOptions(options);
        this.options = {
            collapsed: true,
            resources: [
                'StreetAddress',
                'PositionOfInterest',
                'CadastralParcel'
            ],
            delimitations: [
                'Point',
                'Circle',
                'Extent'
            ],
            reverseGeocodeOptions: {}
        };
        Utils.assign(this.options, options);
        this.collapsed = this.options.collapsed;
        this._uid = SelectorID.generate();
        this._servicesRightManagement = {};
        this._noRightManagement = false;
        this._checkRightsManagement();
        this._currentGeocodingType = null;
        this._initGeocodingType();
        this._currentGeocodingDelimitation = null;
        this._initGeocodingDelimitation();
        this._showReverseGeocodingInput = null;
        this._panelHeaderContainer = null;
        this._panelTitleContainer = null;
        this._returnPictoContainer = null;
        this._formContainer = null;
        this._resultsContainer = null;
        this._resultsListContainer = null;
        this._waitingContainer = null;
        this._inputFeatures = null;
        this._inputFeaturesSource = null;
        this._inputFeaturesLayer = null;
        this._mapInteraction = null;
        this._requestOptions = null;
        this._requestPosition = null;
        this._requestCircleFilter = null;
        this._requestBboxFilter = null;
        this._waiting = false;
        this._timer = null;
        this._reverseGeocodingLocations = [];
        this._reverseGeocodingLocationsMarkers = [];
        this._resultsDefaultStyle = new ol.style.Style({
            image: new ol.style.Icon({
                src: Markers['lightOrange'],
                anchor: [
                    0.5,
                    1
                ]
            })
        });
        this._resultsSelectedStyle = new ol.style.Style({
            image: new ol.style.Icon({
                src: Markers['red'],
                anchor: [
                    0.5,
                    1
                ]
            })
        });
        this._resultsHoverInteraction = null;
        this._resultsSelectInteraction = null;
        this._popupContent = null;
        this._popupDiv = this._initPopupDiv();
        this._popupOverlay = null;
    };
    ReverseGeocode.prototype._checkInputOptions = function (options) {
        var i;
        var j;
        if (options.resources) {
            var resources = options.resources;
            if (!Array.isArray(resources)) {
                console.log('[ReverseGeocode] \'options.resources\' parameter should be an array');
                resources = null;
            }
            var resourcesList = [
                'StreetAddress',
                'PositionOfInterest',
                'CadastralParcel',
                'Administratif'
            ];
            var wrongResourcesIndexes = [];
            for (i = 0; i < resources.length; i++) {
                if (resourcesList.indexOf(resources[i]) === -1) {
                    wrongResourcesIndexes.push(i);
                    console.log('[ReverseGeocode] options.resources : ' + resources[i] + ' is not a resource for reverse geocode');
                }
            }
            if (wrongResourcesIndexes.length !== 0) {
                for (j = 0; j < wrongResourcesIndexes.length; j++) {
                    resources.splice(wrongResourcesIndexes[j], 1);
                }
            }
        }
        if (options.delimitations) {
            var delimitations = options.delimitations;
            if (!Array.isArray(delimitations)) {
                console.log('[ReverseGeocode] \'options.delimitations\' parameter should be an array');
                delimitations = null;
            }
            var delimitationsList = [
                'Circle',
                'Point',
                'Extent'
            ];
            var wrongDelimitationsIndexes = [];
            for (i = 0; i < delimitations.length; i++) {
                if (delimitationsList.indexOf(delimitations[i]) === -1) {
                    wrongDelimitationsIndexes.push(i);
                    console.log('[ReverseGeocode] options.delimitations : ' + delimitations[i] + ' is not a delimitation for reverse geocode');
                }
            }
            if (wrongDelimitationsIndexes.length !== 0) {
                for (j = 0; j < wrongDelimitationsIndexes.length; j++) {
                    delimitations.splice(wrongDelimitationsIndexes[j], 1);
                }
            }
        }
    };
    ReverseGeocode.prototype._initGeocodingType = function () {
        this._currentGeocodingType = 'StreetAddress';
        var resources = this.options.resources;
        if (!resources || resources.length === 0) {
            this.options.resources = [
                'StreetAddress',
                'PositionOfInterest',
                'CadastralParcel'
            ];
        }
        if (Array.isArray(resources) && resources.length) {
            var noRightsIndexes = [];
            for (var i = 0; i < resources.length; i++) {
                if (this._servicesRightManagement['Geocode'].indexOf(resources[i]) < 0) {
                    noRightsIndexes.push(i);
                    console.log('[ReverseGeocode] no rights for options.resources : ' + resources[i]);
                }
            }
            if (noRightsIndexes.length !== 0) {
                for (var j = 0; j < noRightsIndexes.length; j++) {
                    resources.splice(noRightsIndexes[j], 1);
                }
            }
            if (resources[0] === 'StreetAddress' || resources[0] === 'PositionOfInterest' || resources[0] === 'CadastralParcel' || resources[0] === 'Administratif') {
                this._currentGeocodingType = resources[0];
            }
        }
        var serviceOptions = this.options.reverseGeocodeOptions;
        if (serviceOptions.filterOptions && Array.isArray(serviceOptions.filterOptions.type) && serviceOptions.filterOptions.type.length !== 0) {
            this._currentGeocodingType = serviceOptions.filterOptions.type[0];
        }
    };
    ReverseGeocode.prototype._initGeocodingDelimitation = function () {
        this._currentGeocodingDelimitation = 'Point';
        var delimitations = this.options.delimitations;
        if (!delimitations || delimitations.length === 0) {
            this.options.delimitations = [
                'Point',
                'Circle',
                'Extent'
            ];
        }
        if (Array.isArray(delimitations) && delimitations.length) {
            var d = delimitations[0].toLowerCase();
            if (d === 'point' || d === 'circle' || d === 'extent') {
                this._currentGeocodingDelimitation = delimitations[0];
            }
        }
    };
    ReverseGeocode.prototype._initPopupDiv = function () {
        var context = this;
        var element = document.createElement('div');
        element.className = 'gp-feature-info-div';
        var closer = document.createElement('input');
        closer.type = 'button';
        closer.className = 'gp-styling-button closer';
        closer.onclick = function () {
            if (context._popupOverlay != null) {
                context._popupOverlay.setPosition(undefined);
            }
            return false;
        };
        this._popupContent = document.createElement('div');
        this._popupContent.className = 'gp-features-content-div';
        element.appendChild(this._popupContent);
        element.appendChild(closer);
        return element;
    };
    ReverseGeocode.prototype._checkRightsManagement = function () {
        var _resources = [];
        var _key;
        var _opts = null;
        _key = this.options.reverseGeocodeOptions.apiKey;
        _opts = this.options.reverseGeocodeOptions.filterOptions;
        _resources = _opts ? _opts.type : [];
        if (!_resources || _resources.length === 0) {
            _resources = this.options.resources;
        }
        if (!_resources || _resources.length === 0) {
            _resources = [
                'StreetAddress',
                'PositionOfInterest'
            ];
        }
        var rightManagementGeocode = RightManagement.check({
            key: _key || this.options.apiKey,
            resources: _resources,
            services: ['Geocode']
        });
        if (!rightManagementGeocode) {
            this._noRightManagement = true;
            return;
        }
        if (!this.options.apiKey) {
            this.options.apiKey = rightManagementGeocode.key;
        }
        if (rightManagementGeocode) {
            this._servicesRightManagement['Geocode'] = rightManagementGeocode['Geocode'];
        }
    };
    ReverseGeocode.prototype._initContainer = function () {
        var container = this._createMainContainerElement();
        var inputShow = this._showReverseGeocodingInput = this._createShowReverseGeocodingElement();
        container.appendChild(inputShow);
        if (!this.collapsed) {
            inputShow.checked = true;
        }
        var picto = this._createShowReverseGeocodingPictoElement();
        container.appendChild(picto);
        var reverseGeocodingPanel = this._createReverseGeocodingPanelElement();
        var panelHeader = this._panelHeaderContainer = this._createReverseGeocodingPanelHeaderElement();
        var returnPicto = this._returnPictoContainer = this._createReverseGeocodingPanelReturnPictoElement();
        panelHeader.appendChild(returnPicto);
        var panelTitle = this._panelTitleContainer = this._createReverseGeocodingPanelTitleElement();
        panelHeader.appendChild(panelTitle);
        var closeDiv = this._createReverseGeocodingPanelCloseElement();
        panelHeader.appendChild(closeDiv);
        reverseGeocodingPanel.appendChild(panelHeader);
        var reverseGeocodingForm = this._formContainer = this._createReverseGeocodingPanelFormElement();
        reverseGeocodingForm.appendChild(this._createReverseGeocodingFormModeChoiceGeocodingTypeElement(this.options.resources));
        reverseGeocodingForm.appendChild(this._createReverseGeocodingFormModeChoiceGeocodingDelimitationElement(this.options.delimitations));
        var submit = this._createReverseGeocodingSubmitFormElement();
        reverseGeocodingForm.appendChild(submit);
        reverseGeocodingPanel.appendChild(reverseGeocodingForm);
        var waiting = this._waitingContainer = this._createReverseGeocodingWaitingElement();
        reverseGeocodingPanel.appendChild(waiting);
        var resultsPanel = this._resultsContainer = this._createReverseGeocodingResultsPanelElement();
        var reverseGeocodingResultsList = this._resultsListContainer = this._createReverseGeocodingResultsListElement();
        resultsPanel.appendChild(reverseGeocodingResultsList);
        reverseGeocodingPanel.appendChild(resultsPanel);
        container.appendChild(reverseGeocodingPanel);
        return container;
    };
    ReverseGeocode.prototype._activateMapInteraction = function (map) {
        if (!this.collapsed) {
            if (this._inputFeaturesLayer == null) {
                this._inputFeatures = new ol.Collection();
                this._inputFeaturesSource = new ol.source.Vector({ features: this._inputFeatures });
                this._inputFeaturesLayer = new ol.layer.Vector({
                    source: this._inputFeaturesSource,
                    style: new ol.style.Style({
                        fill: new ol.style.Fill({ color: 'rgba(0, 183, 152, 0.3)' }),
                        stroke: new ol.style.Stroke({
                            color: 'rgba(0, 183, 152, 0.8)',
                            width: 3
                        }),
                        image: new ol.style.Icon({
                            src: Markers['turquoiseBlue'],
                            anchor: [
                                0.5,
                                1
                            ]
                        })
                    })
                });
                this._inputFeaturesLayer.gpResultLayerId = 'reverseGeocoding';
                map.addLayer(this._inputFeaturesLayer);
            }
            var delimitation = this._currentGeocodingDelimitation.toLowerCase();
            switch (delimitation) {
            case 'point':
                this._activatePointInteraction(map);
                break;
            case 'circle':
                this._activateCircleInteraction(map);
                break;
            case 'extent':
                this._activateBoxInteraction(map);
                break;
            default:
                break;
            }
            map.getControls().forEach(function (control) {
                if (control instanceof LayerSwitcher) {
                    var layerId = this._inputFeaturesLayer.gpLayerId;
                    if (control._layers[layerId].title === layerId) {
                        control.addLayer(this._inputFeaturesLayer, {
                            title: 'Saisie (recherche inverse)',
                            description: 'Couche de saisie d\'une zone de recherche pour la recherche inverse'
                        });
                        control.setRemovable(this._inputFeaturesLayer, false);
                    }
                }
            }, this);
        }
    };
    ReverseGeocode.prototype._activatePointInteraction = function (map) {
        this._mapInteraction = new ol.interaction.Draw({
            style: new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 0,
                    fill: new ol.style.Fill({ color: 'rgba(0, 183, 152, 0.8)' })
                })
            }),
            type: 'Point',
            source: this._inputFeaturesSource
        });
        this._mapInteraction.on('drawstart', function (e) {
            this._inputFeatures.clear();
            this._onDrawStart(e, 'point');
        }, this);
        map.addInteraction(this._mapInteraction);
        this._setCursor('crosshair', map);
    };
    ReverseGeocode.prototype._activateCircleInteraction = function (map) {
        this._mapInteraction = new ol.interaction.Draw({
            style: new ol.style.Style({
                fill: new ol.style.Fill({ color: 'rgba(0, 183, 152, 0.3)' }),
                stroke: new ol.style.Stroke({
                    color: 'rgba(0, 183, 152, 0.8)',
                    width: 3
                }),
                image: new ol.style.Circle({
                    radius: 4,
                    fill: new ol.style.Fill({ color: 'rgba(0, 183, 152, 0.8)' })
                })
            }),
            type: 'Circle',
            source: this._inputFeaturesSource
        });
        this._mapInteraction.on('drawstart', function (e) {
            this._inputFeatures.clear();
            this._onDrawStart(e, 'circle');
        }, this);
        this._mapInteraction.on('drawend', function (e) {
            if (e.feature && e.feature.getGeometry) {
                var radius = e.feature.getGeometry().getRadius();
                this._requestCircleFilter = {};
                this._requestCircleFilter.radius = radius;
                if (this._requestPosition) {
                    this._requestCircleFilter.x = this._requestPosition.x;
                    this._requestCircleFilter.y = this._requestPosition.y;
                }
            }
        }, this);
        map.addInteraction(this._mapInteraction);
    };
    ReverseGeocode.prototype._activateBoxInteraction = function (map) {
        var geometryFunction = function (coordinates, geometry) {
            if (!geometry) {
                geometry = new ol.geom.Polygon(null);
            }
            var start = coordinates[0];
            var end = coordinates[1];
            geometry.setCoordinates([[
                    start,
                    [
                        start[0],
                        end[1]
                    ],
                    end,
                    [
                        end[0],
                        start[1]
                    ],
                    start
                ]]);
            return geometry;
        };
        this._mapInteraction = new ol.interaction.Draw({
            style: new ol.style.Style({
                fill: new ol.style.Fill({ color: 'rgba(0, 183, 152, 0.3)' }),
                stroke: new ol.style.Stroke({
                    color: 'rgba(0, 183, 152, 0.8)',
                    width: 3
                }),
                image: new ol.style.Circle({
                    radius: 4,
                    fill: new ol.style.Fill({ color: 'rgba(0, 183, 152, 0.8)' })
                })
            }),
            type: 'LineString',
            source: this._inputFeaturesSource,
            maxPoints: 2,
            geometryFunction: geometryFunction
        });
        this._mapInteraction.on('drawstart', function (e) {
            this._inputFeatures.clear();
        }, this);
        this._mapInteraction.on('drawend', function (e) {
            this._onBoxDrawEnd(e);
        }, this);
        map.addInteraction(this._mapInteraction);
    };
    ReverseGeocode.prototype._removeMapInteraction = function (map) {
        if (this._mapInteraction != null) {
            map.removeInteraction(this._mapInteraction);
            this._mapInteraction = null;
        }
        this._setCursor();
    };
    ReverseGeocode.prototype._onDrawStart = function (e, type) {
        var coordinate;
        if (e.feature && e.feature.getGeometry) {
            var geometry = e.feature.getGeometry();
            if (type === 'point') {
                coordinate = geometry.getCoordinates();
            }
            if (type === 'circle') {
                coordinate = geometry.getCenter();
            }
        }
        if (!coordinate) {
            return;
        }
        var crs;
        if (this.options.reverseGeocodeOptions && this.options.reverseGeocodeOptions.srs) {
            crs = this.options.reverseGeocodeOptions.srs;
        } else {
            var map = this.getMap();
            if (!map || !map.getView()) {
                return;
            }
            crs = map.getView().getProjection();
        }
        var geoCoordinate = ol.proj.transform(coordinate, crs, 'EPSG:4326');
        this._requestPosition = {
            x: geoCoordinate[0],
            y: geoCoordinate[1]
        };
    };
    ReverseGeocode.prototype._onBoxDrawEnd = function (e) {
        if (e.feature && e.feature.getGeometry) {
            var coordinates = e.feature.getGeometry().getCoordinates()[0];
            var start = coordinates[0];
            var end = coordinates[2];
            var crs;
            if (this.options.reverseGeocodeOptions && this.options.reverseGeocodeOptions.srs) {
                crs = this.options.reverseGeocodeOptions.srs;
            } else {
                var map = this.getMap();
                if (!map || !map.getView()) {
                    return;
                }
                crs = map.getView().getProjection();
            }
            var startGeoCoordinate = ol.proj.transform(start, crs, 'EPSG:4326');
            var endGeoCoordinate = ol.proj.transform(end, crs, 'EPSG:4326');
            this._requestPosition = {};
            this._requestBboxFilter = {};
            if (startGeoCoordinate[0] < endGeoCoordinate[0]) {
                this._requestBboxFilter.left = startGeoCoordinate[0];
                this._requestBboxFilter.right = endGeoCoordinate[0];
            } else {
                this._requestBboxFilter.left = endGeoCoordinate[0];
                this._requestBboxFilter.right = startGeoCoordinate[0];
            }
            if (startGeoCoordinate[1] < endGeoCoordinate[1]) {
                this._requestBboxFilter.bottom = startGeoCoordinate[1];
                this._requestBboxFilter.top = endGeoCoordinate[1];
            } else {
                this._requestBboxFilter.bottom = endGeoCoordinate[1];
                this._requestBboxFilter.top = startGeoCoordinate[1];
            }
            this._requestPosition.x = (startGeoCoordinate[0] + endGeoCoordinate[0]) / 2;
            this._requestPosition.y = (startGeoCoordinate[1] + endGeoCoordinate[1]) / 2;
        }
    };
    ReverseGeocode.prototype._setCursor = function (cursor, map) {
        map = map || this.getMap();
        if (!map) {
            return;
        }
        var div = map.getTargetElement();
        if (cursor) {
            div.style.cursor = cursor;
        } else {
            div.style.cursor = null;
        }
    };
    ReverseGeocode.prototype._reverseGeocodingRequest = function () {
        var map = this.getMap();
        this._requestOptions = this._getReverseGeocodingRequestOptions();
        this._removeMapInteraction(map);
        this._displayWaitingContainer();
        Gp.Services.reverseGeocode(this._requestOptions);
    };
    ReverseGeocode.prototype._getReverseGeocodingRequestOptions = function () {
        var map = this.getMap();
        var reverseGeocodeOptions = this.options.reverseGeocodeOptions;
        var context = this;
        var requestOptions = {
            apiKey: reverseGeocodeOptions.apiKey || this.options.apiKey,
            position: this._requestPosition,
            filterOptions: { type: [this._currentGeocodingType] },
            srs: 'CRS:84',
            returnFreeForm: false,
            maximumResponses: reverseGeocodeOptions.maximumResponses || 25,
            timeOut: reverseGeocodeOptions.timeOut || 30000,
            protocol: reverseGeocodeOptions.protocol || 'XHR',
            onSuccess: function (response) {
                if (response.locations) {
                    context._displayGeocodedLocations(response.locations);
                }
            },
            onFailure: function (error) {
                context._hideWaitingContainer();
                context._clearResults();
                context._clearInputFeatures();
                context._activateMapInteraction(map);
            }
        };
        if (this._currentGeocodingDelimitation.toLowerCase() === 'circle' && this._requestCircleFilter) {
            if (this._requestCircleFilter.radius > 1000) {
                console.log('INFO : initial circle radius (' + this._requestCircleFilter.radius + ') limited to 1000m.');
                this._requestCircleFilter.radius = 1000;
            }
            requestOptions.filterOptions.circle = this._requestCircleFilter;
        }
        if (this._currentGeocodingDelimitation.toLowerCase() === 'extent' && this._requestBboxFilter) {
            requestOptions.filterOptions.bbox = this._requestBboxFilter;
        }
        return requestOptions;
    };
    ReverseGeocode.prototype._displayGeocodedLocations = function (locations) {
        this._clearResults();
        this._reverseGeocodingLocations = locations;
        this._formContainer.className = 'GPreverseGeocodingComponentHidden';
        this._hideWaitingContainer();
        this._panelTitleContainer.innerHTML = 'Résultats de la recherche';
        this._returnPictoContainer.className = '';
        this._resultsContainer.className = 'GPpanel';
        this._fillGeocodedLocationListContainer(locations);
        this._displayGeocodedLocationsOnMap(locations);
    };
    ReverseGeocode.prototype._fillGeocodedLocationListContainer = function (locations) {
        for (var i = 0; i < locations.length; i++) {
            var location = locations[i];
            var locationDescription = this._fillGeocodedLocationDescription(location);
            if (locationDescription.length !== 0) {
                this._createReverseGeocodingResultElement(locationDescription, i);
            }
        }
    };
    ReverseGeocode.prototype._fillGeocodedLocationDescription = function (location) {
        if (!location || !location.placeAttributes) {
            return;
        }
        var attr = location.placeAttributes;
        var locationDescription = '';
        switch (location.type) {
        case 'StreetAddress':
            if (attr.street) {
                locationDescription += attr.number ? attr.number + ' ' : '';
                locationDescription += attr.street + ', ';
            }
            locationDescription += attr.postalCode + ' ' + attr.commune;
            break;
        case 'PositionOfInterest':
            if (location.matchType === 'City' && attr.commune) {
                locationDescription += attr.commune;
                locationDescription += attr.postalCode ? ', ' + attr.postalCode : '';
            } else if (location.matchType === 'Département' && attr.municipality) {
                locationDescription += attr.municipality;
                locationDescription += attr.postalCode ? ', ' + attr.postalCode : '';
            } else if (location.matchType === 'Toponym' && attr.municipality) {
                locationDescription += attr.municipality;
                locationDescription += attr.postalCode ? ', ' + attr.postalCode : '';
                locationDescription += attr.commune ? ' ' + attr.commune : '';
            } else {
                locationDescription += attr.municipality ? attr.municipality : '';
            }
            locationDescription += attr.nature ? ' (' + attr.nature + ') ' : '';
            break;
        case 'CadastralParcel':
            locationDescription += attr.cadastralParcel ? attr.cadastralParcel : '';
            locationDescription += attr.municipality ? ' (' + attr.municipality + ')' : '';
            break;
        case 'Administratif':
            locationDescription += attr.municipality ? attr.municipality : '';
            if (attr.inseeDepartment) {
                locationDescription += '(Département)';
            } else if (attr.inseeRegion) {
                locationDescription += '(Région)';
            }
            break;
        default:
            locationDescription += attr.municipality ? attr.municipality : '';
            break;
        }
        return locationDescription;
    };
    ReverseGeocode.prototype._displayGeocodedLocationsOnMap = function (locations) {
        if (this._reverseGeocodingLocations.length !== 0) {
            var map = this.getMap();
            this._createResultsLayer();
            for (var i = 0; i < locations.length; i++) {
                this._addResultFeature(locations[i], i);
            }
            if (this._resultsFeatures.getLength() > 1) {
                if (this._resultsFeaturesSource && this._resultsFeaturesSource.getExtent) {
                    var extent = this._resultsFeaturesSource.getExtent();
                    map.getView().fit(extent, map.getSize());
                }
            } else {
                var feature = this._resultsFeatures.item(0);
                var coords = feature.getGeometry().getCoordinates();
                map.getView().setCenter(coords);
                map.getView().setZoom(17);
            }
            this._resultsHoverInteraction = new ol.interaction.Select({
                condition: ol.events.condition.pointerMove,
                layers: [this._resultsFeaturesLayer]
            });
            this._resultsHoverInteraction.on('select', this._onResultsFeatureMouseOver, this);
            map.addInteraction(this._resultsHoverInteraction);
            this._resultsSelectInteraction = new ol.interaction.Select({ layers: [this._resultsFeaturesLayer] });
            this._resultsSelectInteraction.on('select', this._onResultsFeatureSelect, this);
            map.addInteraction(this._resultsSelectInteraction);
            var geocodeType = '';
            switch (this._currentGeocodingType) {
            case 'StreetAddress':
                geocodeType = 'adresses';
                break;
            case 'PositionOfInterest':
                geocodeType = 'toponymes';
                break;
            case 'CadastralParcel':
                geocodeType = 'parcelles cadastrales';
                break;
            case 'Administratif':
                geocodeType = 'unités administratives';
                break;
            default:
                break;
            }
            map.getControls().forEach(function (control) {
                if (control instanceof LayerSwitcher) {
                    var layerId = this._resultsFeaturesLayer.gpLayerId;
                    if (control._layers[layerId].title === layerId) {
                        control.addLayer(this._resultsFeaturesLayer, {
                            title: 'Résultats de la recherche inverse',
                            description: 'Résultats de la recherche inverse sur les ' + geocodeType
                        });
                        control.setRemovable(this._resultsFeaturesLayer, false);
                    }
                }
            }, this);
        }
    };
    ReverseGeocode.prototype._createResultsLayer = function () {
        var map = this.getMap();
        this._resultsFeatures = new ol.Collection();
        this._resultsFeaturesSource = new ol.source.Vector({ features: this._resultsFeatures });
        this._resultsFeaturesLayer = new ol.layer.Vector({ source: this._resultsFeaturesSource });
        this._resultsFeaturesLayer.gpResultLayerId = 'reverseGeocodingResults';
        map.addLayer(this._resultsFeaturesLayer);
    };
    ReverseGeocode.prototype._addResultFeature = function (location, i) {
        var map = this.getMap();
        var position = [
            location.position.x,
            location.position.y
        ];
        if (!position) {
            return;
        }
        var view = map.getView();
        var mapProj = view.getProjection().getCode();
        if (mapProj !== 'EPSG:4326') {
            position = ol.proj.transform(position, 'EPSG:4326', mapProj);
        }
        var feature = new ol.Feature({ geometry: new ol.geom.Point(position) });
        feature.setStyle(this._resultsDefaultStyle);
        feature.setId(i);
        feature.setProperties({ popupContent: this._fillPopupContent(location) });
        this._resultsFeatures.push(feature);
    };
    ReverseGeocode.prototype._fillPopupContent = function (location) {
        var popupContent = '<ul>';
        var attributes = location.placeAttributes;
        for (var attr in attributes) {
            if (attributes.hasOwnProperty(attr)) {
                if (attr !== 'bbox') {
                    popupContent += '<li>';
                    popupContent += '<span class="gp-attname-others-span">' + attr.toUpperCase() + ' : </span>';
                    popupContent += attributes[attr];
                    popupContent += ' </li>';
                }
            }
        }
        popupContent += ' </ul>';
        return popupContent;
    };
    ReverseGeocode.prototype._onResultsFeatureMouseOver = function (e) {
        var f;
        if (e.selected.length !== 0) {
            f = e.selected[0];
            f.setStyle(this._resultsSelectedStyle);
            if (f.getId() != null) {
                var selectedResultDiv = document.getElementById('ReverseGeocodedLocation_' + f.getId() + '-' + this._uid);
                if (selectedResultDiv && selectedResultDiv.classList) {
                    selectedResultDiv.classList.add('GPreverseGeocodedLocationHighlight');
                }
            }
            document.getElementById('ReverseGeocodedLocation_' + f.getId() + '-' + this._uid);
        }
        if (e.deselected.length !== 0) {
            f = e.deselected[0];
            f.setStyle(this._resultsDefaultStyle);
            var deSelectedResultDiv = document.getElementById('ReverseGeocodedLocation_' + f.getId() + '-' + this._uid);
            if (deSelectedResultDiv && deSelectedResultDiv.classList) {
                deSelectedResultDiv.classList.remove('GPreverseGeocodedLocationHighlight');
            }
        }
    };
    ReverseGeocode.prototype._onResultsFeatureSelect = function (e) {
        var map = this.getMap();
        if (e.selected.length !== 0) {
            var f = e.selected[0];
            this._popupContent.innerHTML = f.getProperties().popupContent;
            if (!this._popupOverlay) {
                this._popupOverlay = new ol.Overlay({
                    element: this._popupDiv,
                    positioning: 'bottom-center',
                    position: e.mapBrowserEvent.coordinate
                });
                map.addOverlay(this._popupOverlay);
            } else {
                this._popupOverlay.setPosition(e.mapBrowserEvent.coordinate);
            }
        } else {
            if (this._popupOverlay != null) {
                this._popupOverlay.setPosition(undefined);
            }
        }
    };
    ReverseGeocode.prototype.onShowReverseGeocodingClick = function () {
        this.collapsed = this._showReverseGeocodingInput.checked;
        this.dispatchEvent('change:collapsed');
        var map = this.getMap();
        if (!this._waiting && !this._reverseGeocodingLocations.length) {
            if (this.collapsed) {
                this._clearResults();
                this._clearInputFeatures();
                this._removeMapInteraction(map);
                if (this._inputFeaturesLayer != null) {
                    map.removeLayer(this._inputFeaturesLayer);
                    this._inputFeaturesLayer = null;
                    this._inputFeaturesSources = null;
                    this._inputFeatures = null;
                }
            } else {
                this._activateMapInteraction(map);
            }
        }
    };
    ReverseGeocode.prototype.onReverseGeocodingTypeChange = function (e) {
        var idx = e.target.selectedIndex;
        var value = e.target.options[idx].value;
        if (!value) {
            return;
        }
        this._currentGeocodingType = value;
    };
    ReverseGeocode.prototype.onReverseGeocodingDelimitationChange = function (e) {
        var idx = e.target.selectedIndex;
        var value = e.target.options[idx].value;
        if (!value) {
            return;
        }
        this._currentGeocodingDelimitation = value;
        var map = this.getMap();
        this._clearInputFeatures();
        this._removeMapInteraction(map);
        this._activateMapInteraction(map);
    };
    ReverseGeocode.prototype.onGPreverseGeocodingReturnPictoClick = function () {
        this._clearResults();
        this._clearInputFeatures();
        this._activateMapInteraction(this.getMap());
    };
    ReverseGeocode.prototype.onReverseGeocodingSubmit = function () {
        if (!this._requestPosition) {
            return;
        }
        if (this._noRightManagement) {
            return;
        }
        this._reverseGeocodingRequest();
    };
    ReverseGeocode.prototype.onReverseGeocodingResultClick = function (e) {
    };
    ReverseGeocode.prototype.onReverseGeocodingResultMouseOver = function (e) {
        var tagid = e.target.id;
        var idx = tagid.substring(tagid.indexOf('_') + 1);
        if (e.target.classList) {
            e.target.classList.add('GPreverseGeocodedLocationHighlight');
        }
        if (!this._resultsFeaturesSource) {
            return;
        }
        var f = this._resultsFeaturesSource.getFeatureById(parseInt(idx, 10));
        f.setStyle(this._resultsSelectedStyle);
    };
    ReverseGeocode.prototype.onReverseGeocodingResultMouseOut = function (e) {
        var tagid = e.target.id;
        var idx = tagid.substring(tagid.indexOf('_') + 1);
        if (e.target.classList) {
            e.target.classList.remove('GPreverseGeocodedLocationHighlight');
        }
        if (!this._resultsFeaturesSource) {
            return;
        }
        var f = this._resultsFeaturesSource.getFeatureById(parseInt(idx, 10));
        f.setStyle(this._resultsDefaultStyle);
    };
    ReverseGeocode.prototype._clearResults = function () {
        var map = this.getMap();
        this._reverseGeocodingLocations = [];
        if (this._resultsListContainer) {
            while (this._resultsListContainer.firstChild) {
                this._resultsListContainer.removeChild(this._resultsListContainer.firstChild);
            }
        }
        if (this._resultsFeaturesLayer) {
            map.removeLayer(this._resultsFeaturesLayer);
            this._resultsFeaturesLayer = null;
        }
        if (this._popupOverlay != null) {
            map.removeOverlay(this._popupOverlay);
            this._popupOverlay = null;
        }
        if (this._resultsSelectInteraction != null) {
            map.removeInteraction(this._resultsSelectInteraction);
            this._resultsSelectInteraction = null;
        }
        if (this._resultsHoverInteraction != null) {
            map.removeInteraction(this._resultsHoverInteraction);
            this._resultsHoverInteraction = null;
        }
    };
    ReverseGeocode.prototype._clearInputFeatures = function () {
        if (this._inputFeatures) {
            this._inputFeatures.clear();
        }
        this._requestPosition = null;
        this._requestCircleFilter = null;
        this._requestBboxFilter = null;
    };
    ReverseGeocode.prototype._displayWaitingContainer = function () {
        this._waitingContainer.className = 'GProuteCalcWaitingContainerVisible';
        this._waiting = true;
        if (this._timer) {
            clearTimeout(this._timer);
            this._timer = null;
        }
        var context = this;
        this._timer = setTimeout(function () {
            if (context._waiting === true) {
                context._hideWaitingContainer();
            } else {
                if (context._timer) {
                    clearTimeout(context._timer);
                }
            }
        }, 16000);
    };
    ReverseGeocode.prototype._hideWaitingContainer = function () {
        if (this._waiting) {
            this._waitingContainer.className = 'GProuteCalcWaitingContainerHidden';
            this._waiting = false;
            clearTimeout(this._timer);
            this._timer = null;
        }
    };
    return ReverseGeocode;
}({}, ol, gp, Ol3Utils, Ol3ControlsUtilsMarkers, Ol3ControlsLayerSwitcher, CommonUtilsCheckRightManagement, CommonUtilsSelectorID, CommonControlsReverseGeocodingDOM);
CommonControlsLayerImportDOM = function () {
    var LayerImportDOM = {
        _addUID: function (id) {
            var uid = this._uid ? id + '-' + this._uid : id;
            return uid;
        },
        _createMainContainerElement: function () {
            var container = document.createElement('div');
            container.id = this._addUID('GPimport');
            container.className = 'GPwidget';
            return container;
        },
        _createShowImportElement: function () {
            var input = document.createElement('input');
            input.id = this._addUID('GPshowImport');
            input.type = 'checkbox';
            return input;
        },
        _createShowImportPictoElement: function () {
            var self = this;
            var label = document.createElement('label');
            label.id = this._addUID('GPshowImportPicto');
            label.className = 'GPshowAdvancedToolPicto';
            label.htmlFor = this._addUID('GPshowImport');
            label.title = 'Ouvrir l\'import de couches';
            if (label.addEventListener) {
                label.addEventListener('click', function () {
                    self._onShowImportClick();
                });
            } else if (label.attachEvent) {
                label.attachEvent('onclick', function () {
                    self._onShowImportClick();
                });
            }
            var spanOpen = document.createElement('span');
            spanOpen.id = this._addUID('GPshowImportOpen');
            spanOpen.className = 'GPshowAdvancedToolOpen';
            label.appendChild(spanOpen);
            return label;
        },
        _createImportPanelElement: function () {
            var div = document.createElement('div');
            div.id = this._addUID('GPimportPanel');
            div.className = 'GPpanel';
            return div;
        },
        _createImportPanelHeaderElement: function () {
            var container = document.createElement('div');
            container.className = 'GPpanelHeader';
            var panelTitle = this._createImportPanelTitleElement();
            container.appendChild(panelTitle);
            var closeDiv = this._createImportPanelCloseElement();
            container.appendChild(closeDiv);
            return container;
        },
        _createImportPanelTitleElement: function () {
            var div = document.createElement('div');
            div.className = 'GPpanelTitle';
            div.innerHTML = 'Import de données';
            return div;
        },
        _createImportPanelCloseElement: function () {
            var self = this;
            var divClose = document.createElement('div');
            divClose.id = this._addUID('GPimportPanelClose');
            divClose.className = 'GPpanelClose';
            divClose.title = 'Fermer le panneau';
            if (divClose.addEventListener) {
                divClose.addEventListener('click', function () {
                    document.getElementById(self._addUID('GPshowImportPicto')).click();
                }, false);
            } else if (divClose.attachEvent) {
                divClose.attachEvent('onclick', function () {
                    document.getElementById(self._addUID('GPshowImportPicto')).click();
                });
            }
            return divClose;
        },
        _createImportPanelFormElement: function () {
            var self = this;
            var form = document.createElement('form');
            form.id = this._addUID('GPimportForm');
            form.className = 'map-tool-box';
            if (form.addEventListener) {
                form.addEventListener('submit', function (e) {
                    e.preventDefault();
                    self._onImportSubmit();
                });
            } else if (form.attachEvent) {
                form.attachEvent('onsubmit', function (e) {
                    e.preventDefault();
                    self._onImportSubmit();
                });
            }
            return form;
        },
        _createImportTypeLineElement: function (importTypes) {
            var context = this;
            var div = document.createElement('div');
            div.id = this._addUID('GPimportTypeLine');
            div.className = 'GPimportInputLine';
            var label = document.createElement('label');
            label.htmlFor = this._addUID('GPimportType');
            label.className = 'GPimportLabel';
            label.innerHTML = 'Type de donnée';
            label.title = 'Type de donnée';
            div.appendChild(label);
            var select = document.createElement('select');
            select.className = 'GPimportSelect';
            if (select.addEventListener) {
                select.addEventListener('change', function (e) {
                    if (this.value === 'KML' || this.value === 'GPX' || this.value === 'GeoJSON') {
                        document.getElementById(context._addUID('GPimportStaticParams')).className = 'GPimportVisibleParams';
                        document.getElementById(context._addUID('GPimportServiceParams')).className = 'GPimportHiddenParams';
                    } else if (this.value === 'WMS' || this.value === 'WMTS' || this.value === 'WFS') {
                        document.getElementById(context._addUID('GPimportServiceParams')).className = 'GPimportVisibleParams';
                        document.getElementById(context._addUID('GPimportStaticParams')).className = 'GPimportHiddenParams';
                    }
                    context._onImportTypeChange(e);
                });
            } else if (select.attachEvent) {
                select.attachEvent('onchange', function () {
                    if (this.value === 'KML' || this.value === 'GPX' || this.value === 'GeoJSON') {
                        document.getElementById(context._addUID('GPimportStaticParams')).className = 'GPimportVisibleParams';
                        document.getElementById(context._addUID('GPimportServiceParams')).className = 'GPimportHiddenParams';
                    } else if (this.value === 'WMS' || this.value === 'WMTS' || this.value === 'WFS') {
                        document.getElementById(context._addUID('GPimportServiceParams')).className = 'GPimportVisibleParams';
                        document.getElementById(context._addUID('GPimportStaticParams')).className = 'GPimportHiddenParams';
                    }
                    context._onImportTypeChange();
                });
            }
            select.id = this._addUID('GPimportType');
            if (!importTypes || !Array.isArray(importTypes)) {
                importTypes = [
                    'KML',
                    'GPX',
                    'GeoJSON',
                    'WMS',
                    'WMTS',
                    'WFS'
                ];
            }
            var option;
            for (var i = 0; i < importTypes.length; i++) {
                option = document.createElement('option');
                option.value = importTypes[i];
                option.text = importTypes[i];
                select.appendChild(option);
            }
            div.appendChild(select);
            return div;
        },
        _createImportWaitingElement: function () {
            var div = document.createElement('div');
            div.id = this._addUID('GPimportWaitingContainer');
            div.className = 'GPimportWaitingContainerHidden';
            var p = document.createElement('p');
            p.className = 'GPimportWaiting';
            p.innerHTML = 'Recherche en cours...';
            div.appendChild(p);
            return div;
        },
        _createImportStaticParamsContainer: function (currentType) {
            var div = document.createElement('div');
            div.id = this._addUID('GPimportStaticParams');
            if (currentType === 'KML' || currentType === 'GPX' || currentType === 'GeoJSON') {
                div.className = 'GPimportVisibleParams';
            } else {
                div.className = 'GPimportHiddenParams';
            }
            return div;
        },
        _createStaticNameLabel: function () {
            var div = document.createElement('div');
            div.className = 'GPimportInputLine';
            var label = document.createElement('label');
            label.className = 'GPimportLabel';
            label.htmlFor = this._addUID('GPimportName');
            label.innerHTML = 'Nom';
            label.title = 'Nom';
            div.appendChild(label);
            var input = document.createElement('input');
            input.type = 'text';
            input.id = this._addUID('GPimportName');
            input.className = 'GPimportInput';
            div.appendChild(input);
            return div;
        },
        _createStaticModeChoiceDiv: function () {
            var div = document.createElement('div');
            div.id = this._addUID('GPimportChoice');
            return div;
        },
        _createStaticLocalChoiceDiv: function () {
            var context = this;
            var div = document.createElement('div');
            div.className = 'GPimportChoiceAlt';
            var input = document.createElement('input');
            input.type = 'radio';
            if (input.addEventListener) {
                input.addEventListener('change', function (e) {
                    document.getElementById(context._addUID('GPimportValueLocal')).className = 'GPimportInputLine';
                    document.getElementById(context._addUID('GPimportValueUrl')).className = 'GPimportValueHidden';
                    context._onStaticImportTypeChange(e);
                });
            } else if (input.appendChild) {
                input.appendChild('onchange', function () {
                    document.getElementById(context._addUID('GPimportValueLocal')).className = 'GPimportInputLine';
                    document.getElementById(context._addUID('GPimportValueUrl')).className = 'GPimportValueHidden';
                    context._onStaticImportTypeChange();
                });
            }
            input.name = 'GPimportChoiceMode';
            input.value = 'local';
            input.checked = true;
            input.id = this._addUID('GPimportChoiceAltLocal');
            div.appendChild(input);
            var label = document.createElement('label');
            label.className = 'GPimportChoiceAltTxt';
            label.htmlFor = this._addUID('GPimportChoiceAltLocal');
            label.innerHTML = 'par fichier local';
            label.title = 'par fichier local';
            div.appendChild(label);
            return div;
        },
        _createStaticUrlChoiceDiv: function () {
            var context = this;
            var div = document.createElement('div');
            div.className = 'GPimportChoiceAlt';
            var input = document.createElement('input');
            input.type = 'radio';
            if (input.addEventListener) {
                input.addEventListener('change', function (e) {
                    document.getElementById(context._addUID('GPimportValueUrl')).className = 'GPimportInputLine';
                    document.getElementById(context._addUID('GPimportValueLocal')).className = 'GPimportValueHidden';
                    context._onStaticImportTypeChange(e);
                });
            } else if (input.appendChild) {
                input.appendChild('onchange', function () {
                    document.getElementById(context._addUID('GPimportValueUrl')).className = 'GPimportInputLine';
                    document.getElementById(context._addUID('GPimportValueLocal')).className = 'GPimportValueHidden';
                    context._onStaticImportTypeChange();
                });
            }
            input.id = this._addUID('GPimportChoiceAltUrl');
            input.name = 'GPimportChoiceMode';
            input.value = 'url';
            input.checked = false;
            div.appendChild(input);
            var label = document.createElement('label');
            label.className = 'GPimportChoiceAltTxt';
            label.htmlFor = this._addUID('GPimportChoiceAltUrl');
            label.innerHTML = 'par URL';
            label.title = 'par URL';
            div.appendChild(label);
            return div;
        },
        _createStaticLocalInputDiv: function () {
            var div = document.createElement('div');
            div.id = this._addUID('GPimportValueLocal');
            div.className = 'GPimportInputLine';
            return div;
        },
        _createStaticLocalInputLabel: function () {
            var label = document.createElement('label');
            label.className = 'GPimportLabel';
            label.htmlFor = this._addUID('GPimportFile');
            label.innerHTML = 'Fichier local';
            label.title = 'Fichier local';
            return label;
        },
        _createStaticLocalInput: function () {
            var input = document.createElement('input');
            input.type = 'file';
            input.id = this._addUID('GPimportFile');
            input.className = 'GPimportInputFile';
            return input;
        },
        _createStaticUrlInputDiv: function () {
            var div = document.createElement('div');
            div.id = this._addUID('GPimportValueUrl');
            div.className = 'GPimportValueHidden';
            return div;
        },
        _createStaticUrlInputLabel: function () {
            var label = document.createElement('label');
            label.className = 'GPimportLabel';
            label.htmlFor = this._addUID('GPimportUrl');
            label.innerHTML = 'URL';
            label.title = 'URL';
            return label;
        },
        _createStaticUrlInput: function () {
            var input = document.createElement('input');
            input.type = 'text';
            input.id = this._addUID('GPimportUrl');
            input.className = 'GPimportInput';
            return input;
        },
        _createServiceParamsContainer: function (currentType) {
            var div = document.createElement('div');
            div.id = this._addUID('GPimportServiceParams');
            if (currentType === 'WMS' || currentType === 'WMTS' || currentType === 'WFS') {
                div.className = 'GPimportVisibleParams';
            } else {
                div.className = 'GPimportHiddenParams';
            }
            return div;
        },
        _createServiceUrlDiv: function () {
            var div = document.createElement('div');
            div.className = 'GPimportInputLine';
            return div;
        },
        _createServiceUrlInputLabel: function () {
            var label = document.createElement('label');
            label.className = 'GPimportLabel';
            label.htmlFor = this._addUID('GPimportServiceUrl');
            label.innerHTML = 'URL du service';
            label.title = 'URL du service';
            return label;
        },
        _createServiceUrlInput: function () {
            var input = document.createElement('input');
            input.type = 'text';
            input.id = this._addUID('GPimportServiceUrl');
            input.className = 'GPimportInput';
            return input;
        },
        _createImportSubmitFormElement: function () {
            var input = document.createElement('input');
            input.id = this._addUID('GPimportSubmit');
            input.className = 'GPinputSubmit tool-form-submit';
            input.type = 'submit';
            input.value = 'Importer';
            return input;
        },
        _createImportGetCapPanelElement: function () {
            var div = document.createElement('div');
            div.id = this._addUID('GPimportGetCapPanel');
            div.className = 'GPpanel';
            return div;
        },
        _createImportGetCapPanelHeaderElement: function () {
            var context = this;
            var container = document.createElement('div');
            container.className = 'GPpanelHeader';
            var panelTitle = document.createElement('div');
            panelTitle.className = 'GPpanelTitle';
            panelTitle.innerHTML = 'Couches accessibles';
            panelTitle.title = 'Couches accessibles';
            container.appendChild(panelTitle);
            var closeDiv = document.createElement('div');
            if (closeDiv.addEventListener) {
                closeDiv.addEventListener('click', function () {
                    document.getElementById(context._addUID('GPimportGetCapPanel')).style.display = 'none';
                    document.getElementById(context._addUID('GPimportPanel')).style.display = '';
                    context._onGetCapPanelClose();
                });
            } else if (closeDiv.attachEvent) {
                closeDiv.attachEvent('click', function () {
                    document.getElementById(context._addUID('GPimportGetCapPanel')).style.display = 'none';
                    document.getElementById(context._addUID('GPimportPanel')).style.display = '';
                    context._onGetCapPanelClose();
                });
            }
            closeDiv.className = 'GPpanelClose';
            closeDiv.title = 'Fermer le panneau';
            closeDiv.id = this._addUID('GPimportGetCapPanelClose');
            container.appendChild(closeDiv);
            return container;
        },
        _createImportGetCapResultsListElement: function () {
            var container = document.createElement('div');
            container.id = this._addUID('GPimportGetCapResults');
            return container;
        },
        _createImportGetCapResultElement: function (layerDescription, id) {
            var div = document.createElement('div');
            div.className = 'GPimportGetCapProposal';
            div.innerHTML = layerDescription;
            div.title = layerDescription;
            var context = this;
            if (div.addEventListener) {
                div.addEventListener('click', function (e) {
                    context._onGetCapResponseLayerClick(e);
                });
            } else if (div.attachEvent) {
                div.attachEvent('onclick', function () {
                    context._onGetCapResponseLayerClick();
                });
            }
            div.id = 'GPimportGetCapProposal_' + id;
            return div;
        }
    };
    return LayerImportDOM;
}();
Ol3ControlsLayerImport = function (ol, Gp, woodman, Utils, Markers, LayerImportDOM, SelectorID, KMLExtended) {
    function LayerImport(options) {
        options = options || {};
        if (!(this instanceof LayerImport)) {
            throw new TypeError('ERROR CLASS_CONSTRUCTOR');
        }
        this._initialize(options);
        var container = this._initContainer(options);
        ol.control.Control.call(this, {
            element: container,
            target: options.target,
            render: options.render
        });
    }
    ol.inherits(LayerImport, ol.control.Control);
    LayerImport.DefaultStyles = {
        image: new ol.style.Icon({
            src: Markers['lightOrange'],
            anchor: [
                25.5,
                38
            ],
            anchorOrigin: 'top-left',
            anchorXUnits: 'pixels',
            anchorYUnits: 'pixels'
        }),
        stroke: new ol.style.Stroke({
            color: 'rgba(0,42,80,0.8)',
            width: 4
        }),
        fill: new ol.style.Fill({ color: 'rgba(0, 183, 152, 0.5)' }),
        text: new ol.style.Text({
            font: '16px Sans',
            textAlign: 'left',
            fill: new ol.style.Fill({ color: 'rgba(255, 255, 255, 1)' }),
            stroke: new ol.style.Stroke({
                color: 'rgba(0, 0, 0, 1)',
                width: 2
            })
        })
    };
    LayerImport.prototype = Object.create(ol.control.Control.prototype, {});
    Utils.assign(LayerImport.prototype, LayerImportDOM);
    LayerImport.prototype.constructor = LayerImport;
    LayerImport.prototype.getCollapsed = function () {
        return this.collapsed;
    };
    LayerImport.prototype.setCollapsed = function (collapsed) {
        if (collapsed === undefined) {
            console.log('[ERROR] LayerImport:setCollapsed - missing collapsed parameter');
            return;
        }
        if (collapsed && this.collapsed || !collapsed && !this.collapsed) {
            return;
        }
        if (collapsed) {
            document.getElementById('GPimportPanelClose-' + this._uid).click();
        } else {
            document.getElementById('GPshowImport-' + this._uid).click();
        }
        this.collapsed = collapsed;
    };
    LayerImport.prototype.getStaticImportContent = function () {
        return this.contentStatic;
    };
    LayerImport.prototype.getServiceImportContent = function () {
        return this.contentService;
    };
    LayerImport.prototype._initialize = function (options) {
        this._checkInputOptions(options);
        this.options = {
            collapsed: true,
            layerTypes: [
                'KML',
                'GPX',
                'GeoJSON',
                'WMS',
                'WMTS'
            ],
            webServicesOptions: {},
            vectorStyleOptions: {
                KML: {
                    extractStyles: true,
                    showPointNames: true,
                    defaultStyle: LayerImport.DefaultStyles
                },
                GPX: { defaultStyle: LayerImport.DefaultStyles },
                GeoJSON: { defaultStyle: LayerImport.DefaultStyles }
            }
        };
        var defaultStyle;
        if (options.vectorStyleOptions) {
            for (var format in options.vectorStyleOptions) {
                if (options.vectorStyleOptions[format] && options.vectorStyleOptions[format].defaultStyle) {
                    defaultStyle = this.options.vectorStyleOptions[format].defaultStyle;
                    Utils.mergeParams(defaultStyle, options.vectorStyleOptions[format].defaultStyle);
                    options.vectorStyleOptions[format].defaultStyle = defaultStyle;
                }
            }
        }
        if (Array.isArray(options.layerTypes)) {
            var layerTypes = [];
            for (var i = 0; i < options.layerTypes.length; i++) {
                layerTypes.push(options.layerTypes[i]);
            }
            this.options.layerTypes = layerTypes;
        }
        Utils.mergeParams(this.options, options);
        this.collapsed = this.options.collapsed;
        this._uid = SelectorID.generate();
        this._waiting = false;
        this._timer = null;
        this._initImportTypes();
        this._initDefaultStyles();
        this._showImportInput = null;
        this._importPanel = null;
        this._formContainer = null;
        this._staticLocalImportInput = null;
        this._staticUrlImportInput = null;
        this._serviceUrlImportInput = null;
        this._getCapPanel = null;
        this._getCapResultsListContainer = null;
        this._waitingContainer = null;
        this._getCapRequestUrl = null;
        this._getCapResponseWMS = null;
        this._getCapResponseWMSLayers = [];
        this._getCapResponseWMTS = null;
        this._getCapResponseWMTSLayers = [];
    };
    LayerImport.prototype._checkInputOptions = function (options) {
        if (options.layerTypes) {
            var layerTypes = options.layerTypes;
            if (!Array.isArray(layerTypes)) {
                console.log('[ol.control.LayerImport] \'options.layerTypes\' parameter should be an array. Set default values ["KML", "GPX", "GeoJSON", "WMS", "WMTS"]');
                options.layerTypes = [
                    'KML',
                    'GPX',
                    'GeoJSON',
                    'WMS',
                    'WMTS'
                ];
            } else {
                var typesList = [
                    'KML',
                    'GPX',
                    'GEOJSON',
                    'WMS',
                    'WMTS',
                    'WFS'
                ];
                var wrongTypesIndexes = [];
                for (var i = 0; i < layerTypes.length; i++) {
                    if (typeof layerTypes[i] !== 'string') {
                        wrongTypesIndexes.push(i);
                        console.log('[ol.control.LayerImport] \'options.layerTypes\' elements should be of type string (' + layerTypes[i] + ')');
                    } else {
                        layerTypes[i] = layerTypes[i].toUpperCase();
                        if (typesList.indexOf(layerTypes[i]) === -1) {
                            wrongTypesIndexes.push(i);
                            console.log('[ol.control.LayerImport] options.layerTypes : ' + layerTypes[i] + ' is not a supported type');
                        }
                        if (layerTypes[i] === 'GEOJSON') {
                            layerTypes[i] = 'GeoJSON';
                        }
                    }
                }
                if (wrongTypesIndexes.length !== 0) {
                    for (var j = wrongTypesIndexes.length - 1; j >= 0; j--) {
                        layerTypes.splice(wrongTypesIndexes[j], 1);
                    }
                }
            }
        }
    };
    LayerImport.prototype._initDefaultStyles = function () {
        var kmlDefaultStyles = this.options.vectorStyleOptions.KML.defaultStyle;
        this._defaultKMLStyle = new ol.style.Style({
            image: kmlDefaultStyles.image,
            stroke: kmlDefaultStyles.stroke,
            fill: kmlDefaultStyles.fill,
            text: kmlDefaultStyles.text
        });
        var gpxDefaultStyles = this.options.vectorStyleOptions.GPX.defaultStyle;
        this._defaultGPXStyle = new ol.style.Style({
            image: gpxDefaultStyles.image,
            stroke: gpxDefaultStyles.stroke,
            fill: gpxDefaultStyles.fill
        });
        var geoJSONDefaultStyles = this.options.vectorStyleOptions.GeoJSON.defaultStyle;
        this._defaultGeoJSONStyle = new ol.style.Style({
            image: geoJSONDefaultStyles.image,
            stroke: geoJSONDefaultStyles.stroke,
            fill: geoJSONDefaultStyles.fill
        });
    };
    LayerImport.prototype._initImportTypes = function () {
        this._currentImportType = this.options.layerTypes[0] || 'KML';
        if (this._currentImportType === 'KML' || this._currentImportType === 'GPX' || this._currentImportType === 'GeoJSON') {
            this._isCurrentImportTypeStatic = true;
        } else if (this._currentImportType === 'WMS' || this._currentImportType === 'WMTS' || this._currentImportType === 'WFS') {
            this._isCurrentImportTypeStatic = false;
        }
        this._currentStaticImportType = 'local';
    };
    LayerImport.prototype._initContainer = function () {
        var container = this._createMainContainerElement();
        var inputShow = this._showImportInput = this._createShowImportElement();
        container.appendChild(inputShow);
        if (!this.collapsed) {
            inputShow.checked = true;
        }
        var picto = this._createShowImportPictoElement();
        container.appendChild(picto);
        var importPanel = this._importPanel = this._createImportPanelElement();
        var panelHeader = this._createImportPanelHeaderElement();
        importPanel.appendChild(panelHeader);
        var importForm = this._formContainer = this._initInputFormElement();
        importPanel.appendChild(importForm);
        container.appendChild(importPanel);
        var getCapPanel = this._getCapPanel = this._createImportGetCapPanelElement();
        getCapPanel.appendChild(this._createImportGetCapPanelHeaderElement());
        var importGetCapResultsList = this._getCapResultsListContainer = this._createImportGetCapResultsListElement();
        getCapPanel.appendChild(importGetCapResultsList);
        container.appendChild(getCapPanel);
        var waiting = this._waitingContainer = this._createImportWaitingElement();
        container.appendChild(waiting);
        return container;
    };
    LayerImport.prototype._initInputFormElement = function () {
        var importForm = this._createImportPanelFormElement();
        var importTypeChoiceDiv = this._createImportTypeLineElement(this.options.layerTypes);
        importForm.appendChild(importTypeChoiceDiv);
        var importStaticParamsContainer = this._createImportStaticParamsContainer(this.options.layerTypes[0]);
        var staticNameLabel = this._createStaticNameLabel();
        importStaticParamsContainer.appendChild(staticNameLabel);
        var staticImportChoice = this._createStaticModeChoiceDiv();
        var staticLocalImportChoice = this._createStaticLocalChoiceDiv();
        staticImportChoice.appendChild(staticLocalImportChoice);
        var staticUrlImportChoice = this._createStaticUrlChoiceDiv();
        staticImportChoice.appendChild(staticUrlImportChoice);
        importStaticParamsContainer.appendChild(staticImportChoice);
        var staticLocalInputDiv = this._createStaticLocalInputDiv();
        staticLocalInputDiv.appendChild(this._createStaticLocalInputLabel());
        this._staticLocalImportInput = this._createStaticLocalInput();
        staticLocalInputDiv.appendChild(this._staticLocalImportInput);
        importStaticParamsContainer.appendChild(staticLocalInputDiv);
        var staticUrlInputDiv = this._createStaticUrlInputDiv();
        staticUrlInputDiv.appendChild(this._createStaticUrlInputLabel());
        this._staticUrlImportInput = this._createStaticUrlInput();
        staticUrlInputDiv.appendChild(this._staticUrlImportInput);
        importStaticParamsContainer.appendChild(staticUrlInputDiv);
        importForm.appendChild(importStaticParamsContainer);
        var importServiceParamsContainer = this._createServiceParamsContainer(this.options.layerTypes[0]);
        var importServiceUrlDiv = this._createServiceUrlDiv();
        importServiceUrlDiv.appendChild(this._createServiceUrlInputLabel());
        this._serviceUrlImportInput = this._createServiceUrlInput();
        importServiceUrlDiv.appendChild(this._serviceUrlImportInput);
        importServiceParamsContainer.appendChild(importServiceUrlDiv);
        importForm.appendChild(importServiceParamsContainer);
        var submit = this._createImportSubmitFormElement();
        importForm.appendChild(submit);
        return importForm;
    };
    LayerImport.prototype._onShowImportClick = function () {
        this.collapsed = this._showImportInput.checked;
        this.dispatchEvent('change:collapsed');
    };
    LayerImport.prototype._onImportTypeChange = function (e) {
        this._currentImportType = e.target.value;
        if (this._currentImportType === 'KML' || this._currentImportType === 'GPX' || this._currentImportType === 'GeoJSON') {
            this._isCurrentImportTypeStatic = true;
        } else if (this._currentImportType === 'WMS' || this._currentImportType === 'WMTS' || this._currentImportType === 'WFS') {
            this._isCurrentImportTypeStatic = false;
        }
    };
    LayerImport.prototype._onStaticImportTypeChange = function (e) {
        this._currentStaticImportType = e.target.value;
    };
    LayerImport.prototype._onGetCapPanelClose = function () {
        this._clearGetCapParams();
        this._emptyGetCapResultsList();
    };
    LayerImport.prototype._onImportSubmit = function () {
        this.contentStatic = null;
        this.contentService = null;
        if (this._isCurrentImportTypeStatic) {
            this._importStaticLayer();
        } else {
            this._importServiceLayers();
        }
    };
    LayerImport.prototype._importStaticLayer = function () {
        var layerName;
        var staticImportNameInput = document.getElementById(this._addUID('GPimportName'));
        if (staticImportNameInput) {
            layerName = staticImportNameInput.value;
        }
        if (this._currentStaticImportType === 'local') {
            this._importStaticLayerFromLocalFile(layerName);
        } else if (this._currentStaticImportType === 'url') {
            this._importStaticLayerFromUrl(layerName);
        }
    };
    LayerImport.prototype._importStaticLayerFromUrl = function (layerName) {
        layerName = layerName || '';
        var url = this._staticUrlImportInput.value;
        if (url.length === 0) {
            console.log('[ol.control.LayerImport] url parameter is mandatory');
            return;
        }
        if (url.trim) {
            url = url.trim();
        }
        if (!this.options.webServicesOptions || !this.options.webServicesOptions.proxyUrl && !this.options.webServicesOptions.noProxyDomains) {
            console.log('[ol.control.LayerImport] options.webServicesOptions.proxyUrl parameter is mandatory to request resources on another domain (cross-domain)');
            return;
        }
        var proxyUrl = this.options.webServicesOptions.proxyUrl;
        var noProxyDomains = this.options.webServicesOptions.noProxyDomains;
        var bfound = false;
        if (noProxyDomains && Array.isArray(noProxyDomains) && noProxyDomains.length > 0) {
            for (var i in noProxyDomains) {
                if (url.indexOf(noProxyDomains[i]) !== -1) {
                    bfound = true;
                }
            }
        }
        if (bfound === false) {
            url = proxyUrl + encodeURIComponent(url);
        }
        var context = this;
        Gp.Protocols.XHR.call({
            url: url,
            method: 'GET',
            timeOut: 15000,
            onResponse: function (response) {
                context._hideWaitingContainer();
                context._addFeaturesFromImportStaticLayer(response, layerName);
            },
            onFailure: function (error) {
                context._hideWaitingContainer();
                console.log('[ol.control.LayerImport] KML/GPX/GeoJSON request failed : ', error);
            }
        });
    };
    LayerImport.prototype._importStaticLayerFromLocalFile = function (layerName) {
        var file = this._staticLocalImportInput.files[0];
        if (!file) {
            console.log('[ol.control.LayerImport] missing file');
            return;
        }
        var fReader = new FileReader();
        var context = this;
        fReader.onerror = function (e) {
            context._hideWaitingContainer();
        };
        fReader.onprogress = function () {
        };
        fReader.onloadstart = function () {
            context._displayWaitingContainer();
        };
        fReader.onabort = function () {
            context._hideWaitingContainer();
        };
        fReader.onloadend = function (e) {
        };
        fReader.onload = function (e) {
            context._hideWaitingContainer();
            context._addFeaturesFromImportStaticLayer(e.target.result, layerName);
        };
        fReader.readAsText(file);
    };
    LayerImport.prototype._addFeaturesFromImportStaticLayer = function (fileContent, layerName) {
        var map = this.getMap();
        if (!map || !fileContent) {
            return;
        }
        this.contentStatic = fileContent;
        var format;
        if (this._currentImportType === 'KML') {
            format = new KMLExtended({
                showPointNames: true,
                extractStyles: this.options.vectorStyleOptions.KML.extractStyles,
                defaultStyle: [this._defaultKMLStyle]
            });
        } else if (this._currentImportType === 'GPX') {
            format = new ol.format.GPX();
        } else if (this._currentImportType === 'GeoJSON') {
            format = new ol.format.GeoJSON();
        }
        var fileProj = format.readProjection(fileContent);
        var mapProj = this._getMapProjectionCode();
        var features = null;
        features = format.readFeatures(fileContent, {
            dataProjection: fileProj,
            featureProjection: mapProj
        });
        if (this._currentImportType === 'GPX') {
            for (var i = 0; i < features.length; i++) {
                if (features[i].getStyle() == null) {
                    features[i].setStyle(this._defaultGPXStyle);
                }
            }
        }
        if (this._currentImportType === 'GeoJSON') {
            for (var j = 0; j < features.length; j++) {
                if (features[j].getStyle() == null) {
                    features[j].setStyle(this._defaultGeoJSONStyle);
                }
            }
        }
        var vectorSource = new ol.source.Vector({ features: new ol.Collection() });
        vectorSource.addFeatures(features);
        if (layerName) {
            vectorSource._title = vectorSource._description = layerName;
        } else {
            if (format.readName && format.readName(fileContent)) {
                vectorSource._title = vectorSource._description = format.readName(fileContent);
            } else {
                vectorSource._title = vectorSource._description = 'Import ' + this._currentImportType;
            }
        }
        var vectorLayer = new ol.layer.Vector({ source: vectorSource });
        vectorLayer.gpResultLayerId = 'layerimport:' + this._currentImportType;
        map.addLayer(vectorLayer);
        if (map.getView() && map.getSize() && vectorSource.getExtent) {
            var sourceExtent = vectorSource.getExtent();
            if (sourceExtent && sourceExtent[0] !== Infinity) {
                map.getView().fit(vectorSource.getExtent(), map.getSize());
            }
        }
    };
    LayerImport.prototype._addFeaturesFromImportStaticLayerUrl = function (url, layerName) {
        var map = this.getMap();
        if (!map || !url) {
            return;
        }
        var format;
        if (this._currentImportType === 'KML') {
            format = new KMLExtended({
                showPointNames: true,
                extractStyles: this.options.vectorStyleOptions.KML.extractStyles,
                defaultStyle: [this._defaultKMLStyle]
            });
        } else if (this._currentImportType === 'GPX') {
            format = new ol.format.GPX();
        } else if (this._currentImportType === 'GeoJSON') {
            format = new ol.format.GeoJSON();
        }
        var vectorSource = new ol.source.Vector({
            url: url,
            format: format
        });
        if (this._currentImportType === 'GPX') {
            vectorSource.forEachFeature(function (feature) {
                if (feature.getStyle() == null) {
                    feature.setStyle(this._defaultGPXStyle);
                }
            });
        }
        if (this._currentImportType === 'GeoJSON') {
            vectorSource.forEachFeature(function (feature) {
                if (feature.getStyle() == null) {
                    feature.setStyle(this._defaultGeoJSONStyle);
                }
            });
        }
        if (layerName) {
            vectorSource._title = vectorSource._description = layerName;
        } else {
            vectorSource._title = vectorSource._description = 'Import ' + this._currentImportType;
        }
        var vectorLayer = new ol.layer.Vector({ source: vectorSource });
        vectorLayer.gpResultLayerId = 'layerimport:' + this._currentImportType;
        map.addLayer(vectorLayer);
        if (map.getView() && map.getSize() && vectorSource.getExtent) {
            var sourceExtent = vectorSource.getExtent();
            if (sourceExtent && sourceExtent[0] !== Infinity) {
                map.getView().fit(vectorSource.getExtent(), map.getSize());
            }
        }
    };
    LayerImport.prototype._importServiceLayers = function () {
        if (this._currentImportType === 'WFS') {
            console.log('[ol.control.LayerImport] WFS layer import is not implemented yet');
            return;
        }
        this._emptyGetCapResultsList();
        var url = this._getCapRequestUrl = this._serviceUrlImportInput.value;
        if (!url) {
            console.log('[ol.control.LayerImport] url parameter is mandatory');
            return;
        }
        if (url.trim) {
            url = url.trim();
        }
        var questionMarkIndex = url.indexOf('?');
        if (questionMarkIndex < 0) {
            url += '?SERVICE=' + this._currentImportType + '&REQUEST=GetCapabilities';
        } else if (questionMarkIndex === url.length - 1) {
            url += 'SERVICE=' + this._currentImportType + '&REQUEST=GetCapabilities';
        }
        if (!this.options.webServicesOptions || !this.options.webServicesOptions.proxyUrl && !this.options.webServicesOptions.noProxyDomains) {
            console.log('[ol.control.LayerImport] options.webServicesOptions.proxyUrl parameter is mandatory to request web service layers (getcapabilities request)');
            return;
        }
        var proxyUrl = this.options.webServicesOptions.proxyUrl;
        var noProxyDomains = this.options.webServicesOptions.noProxyDomains;
        var bfound = false;
        if (noProxyDomains && Array.isArray(noProxyDomains) && noProxyDomains.length > 0) {
            for (var i in noProxyDomains) {
                if (url.indexOf(noProxyDomains[i]) !== -1) {
                    bfound = true;
                }
            }
        }
        if (bfound === false) {
            url = proxyUrl + encodeURIComponent(url);
        }
        this._displayWaitingContainer();
        var context = this;
        Gp.Protocols.XHR.call({
            url: url,
            method: 'GET',
            timeOut: 15000,
            onResponse: function (response) {
                context._hideWaitingContainer();
                context._displayGetCapResponseLayers.call(context, response);
            },
            onFailure: function (error) {
                context._hideWaitingContainer();
                console.log('[ol.control.LayerImport] getCapabilities request failed : ', error);
            }
        });
    };
    LayerImport.prototype._displayGetCapResponseLayers = function (xmlResponse) {
        var parser;
        var layers;
        var layerDescription;
        var projection;
        this._getCapResponseWMSLayers = [];
        this.contentService = xmlResponse;
        this._importPanel.style.display = 'none';
        this._getCapPanel.style.display = 'block';
        if (this._currentImportType === 'WMS') {
            parser = new ol.format.WMSCapabilities();
            if (!parser) {
                return;
            }
            var getCapResponseWMS = this._getCapResponseWMS = parser.read(xmlResponse);
            if (getCapResponseWMS && getCapResponseWMS.Capability && getCapResponseWMS.Capability.Layer) {
                var getCapLayer = getCapResponseWMS.Capability.Layer;
                if (Array.isArray(getCapLayer)) {
                    for (var i = 0; i < getCapLayer.length; i++) {
                        this._displayGetCapResponseWMSLayer(getCapLayer[i]);
                    }
                } else {
                    this._displayGetCapResponseWMSLayer(getCapLayer);
                }
            }
        } else if (this._currentImportType === 'WMTS') {
            parser = new ol.format.WMTSCapabilities();
            if (!parser) {
                return;
            }
            var getCapResponseWMTS = this._getCapResponseWMTS = parser.read(xmlResponse);
            if (getCapResponseWMTS && getCapResponseWMTS.Contents && getCapResponseWMTS.Contents.Layer) {
                layers = getCapResponseWMTS.Contents.Layer;
                if (Array.isArray(layers)) {
                    this._getCapResponseWMTSLayers = layers;
                    for (var j = 0; j < layers.length; j++) {
                        projection = this._getWMTSLayerProjection(layers[j], getCapResponseWMTS);
                        if (projection && typeof projection === 'string') {
                            if (ol.proj.get(projection) || ol.proj.get(projection.toUpperCase())) {
                                layerDescription = layers[j].Title;
                                if (this._getCapResultsListContainer) {
                                    this._getCapResultsListContainer.appendChild(this._createImportGetCapResultElement(layerDescription, j));
                                }
                            } else {
                                console.log('[ol.control.LayerImport] wmts layer cannot be added to map : unknown projection', layers[j]);
                                continue;
                            }
                        }
                    }
                }
            }
        }
    };
    LayerImport.prototype._displayGetCapResponseWMSLayer = function (layerObj, parentLayersInfos) {
        if (!layerObj) {
            console.log('[ol.control.LayerImport] _displayGetCapResponseWMSLayer : getCapabilities layer object not found');
        } else {
        }
        var mapProjCode = this._getMapProjectionCode();
        var projection;
        var layerDescription;
        if (parentLayersInfos) {
            var key;
            var i;
            var addKeys = [
                'CRS',
                'Style'
            ];
            for (i = 0; i < addKeys.length; i++) {
                key = addKeys[i];
                if (Array.isArray(parentLayersInfos[key]) && parentLayersInfos[key].length !== 0) {
                    if (Array.isArray(layerObj[key]) && layerObj[key].length !== 0) {
                        for (var n = 0; n < parentLayersInfos[key]; n++) {
                            if (layerObj[key].indexOf(parentLayersInfos[key][n]) === -1) {
                                layerObj[key].push(parentLayersInfos[key][n]);
                            }
                        }
                    } else {
                        layerObj[key] = parentLayersInfos[key];
                    }
                }
            }
            var replaceKeys = [
                'BoundingBox',
                'EX_GeographicBoundingBox',
                'MaxScaleDenominator',
                'MinScaleDenominator',
                'Attribution',
                'Dimension',
                'queryable',
                'cascaded',
                'opaque',
                'noSubsets',
                'fixedWidth',
                'fixedHeight'
            ];
            for (i = 0; i < replaceKeys.length; i++) {
                key = replaceKeys[i];
                if (parentLayersInfos[key] && !layerObj[key]) {
                    layerObj[key] = parentLayersInfos[key];
                }
            }
            if (!parentLayersInfos._isRootLayer && parentLayersInfos.Title) {
                layerObj.Title = parentLayersInfos.Title + ' > ' + layerObj.Title;
            }
        } else {
            layerObj._isRootLayer = true;
        }
        if (layerObj.Layer) {
            if (Array.isArray(layerObj.Layer)) {
                for (var j = 0; j < layerObj.Layer.length; j++) {
                    this._displayGetCapResponseWMSLayer(layerObj.Layer[j], layerObj);
                }
            }
        } else {
            var lastIndex = this._getCapResponseWMSLayers.length;
            projection = this._getWMSLayerProjection(layerObj, mapProjCode);
            if (!projection) {
                console.log('[ol.control.LayerImport] wms layer cannot be added to map : unknown projection', layerObj);
            } else {
                layerObj._projection = projection;
                layerDescription = layerObj.Title;
                if (this._getCapResultsListContainer) {
                    this._getCapResultsListContainer.appendChild(this._createImportGetCapResultElement(layerDescription, lastIndex));
                }
                this._getCapResponseWMSLayers[lastIndex] = layerObj;
            }
        }
    };
    LayerImport.prototype._onGetCapResponseLayerClick = function (e) {
        if (e.target && e.target.id) {
            var proposalId = parseInt(e.target.id.substr(23), 10);
            if (proposalId == null) {
                return;
            }
            var layerInfo;
            if (this._currentImportType === 'WMS') {
                layerInfo = this._getCapResponseWMSLayers[proposalId];
                this._addGetCapWMSLayer(layerInfo);
            } else if (this._currentImportType === 'WMTS') {
                layerInfo = this._getCapResponseWMTSLayers[proposalId];
                this._addGetCapWMTSLayer(layerInfo);
            }
        }
    };
    LayerImport.prototype._addGetCapWMSLayer = function (layerInfo) {
        var map = this.getMap();
        if (!map) {
            console.log('[ol.control.LayerImport] _addGetCapWMSLayer error : map is not defined');
            return;
        }
        if (!layerInfo) {
            console.log('[ol.control.LayerImport] _addGetCapWMSLayer error : layerInfo is not defined');
            return;
        }
        var mapProjCode = this._getMapProjectionCode();
        var wmsSourceOptions = {};
        var getMapUrl = this._getWMSLayerGetMapUrl();
        if (getMapUrl) {
            wmsSourceOptions.url = getMapUrl;
        } else {
            var questionMarkIndex = this._getCapRequestUrl.indexOf('?');
            if (questionMarkIndex !== -1) {
                wmsSourceOptions.url = this._getCapRequestUrl.substring(0, questionMarkIndex);
            } else {
                wmsSourceOptions.url = this._getCapRequestUrl;
            }
        }
        wmsSourceOptions.params = {};
        if (layerInfo.Name) {
            wmsSourceOptions.params['LAYERS'] = layerInfo.Name;
        } else {
            console.log('[ol.control.LayerImport] unable to add wms layer : mandatory layer \'name\' parameter cannot be found', layerInfo);
            return;
        }
        wmsSourceOptions.params['SERVICE'] = 'WMS';
        if (this._getCapResponseWMS.version) {
            wmsSourceOptions.params['VERSION'] = this._getCapResponseWMS.version;
        }
        var projection = layerInfo._projection;
        if (!projection) {
            console.log('[ol.control.LayerImport] wms layer cannot be added to map : unknown projection');
            return;
        } else if (projection !== mapProjCode) {
            wmsSourceOptions.projection = projection;
        }
        var legend;
        if (layerInfo.Style && Array.isArray(layerInfo.Style)) {
            var style = layerInfo.Style[0];
            wmsSourceOptions.params['STYLES'] = style.Name;
            if (style.LegendURL && Array.isArray(style.LegendURL) && style.LegendURL.length !== 0) {
                legend = style.LegendURL[0].OnlineResource;
            }
        }
        var wmsSource = new ol.source.TileWMS(wmsSourceOptions);
        this._getWMSLayerInfoForLayerSwitcher(layerInfo, legend, wmsSource);
        var layerTileOptions = {};
        layerTileOptions['source'] = wmsSource;
        this._getWMSLayerMinMaxResolution(layerInfo, mapProjCode, layerTileOptions);
        this._getWMSLayerExtent(layerInfo, mapProjCode, layerTileOptions);
        var wmsLayer = new ol.layer.Tile(layerTileOptions);
        wmsLayer.gpResultLayerId = 'layerimport:WMS';
        if (layerInfo.queryable) {
            wmsLayer.gpGFIparams = { queryable: true };
            if (this._getCapResponseWMS && this._getCapResponseWMS.Capability && this._getCapResponseWMS.Capability.Request && this._getCapResponseWMS.Capability.Request.GetFeatureInfo && this._getCapResponseWMS.Capability.Request.GetFeatureInfo.Format && Array.isArray(this._getCapResponseWMS.Capability.Request.GetFeatureInfo.Format)) {
                wmsLayer.gpGFIparams.formats = this._getCapResponseWMS.Capability.Request.GetFeatureInfo.Format;
            }
        }
        map.addLayer(wmsLayer);
    };
    LayerImport.prototype._getWMSLayerGetMapUrl = function () {
        var getmapurl;
        if (this._getCapResponseWMS && this._getCapResponseWMS.Capability && this._getCapResponseWMS.Capability.Request && this._getCapResponseWMS.Capability.Request.GetMap) {
            var getmap = this._getCapResponseWMS.Capability.Request.GetMap;
            if (getmap.DCPType && Array.isArray(getmap.DCPType) && getmap.DCPType.length !== 0) {
                var url = getmap.DCPType[0];
                if (url && url.HTTP && url.HTTP.Get) {
                    getmapurl = url.HTTP.Get.OnlineResource;
                }
            }
        }
        return getmapurl;
    };
    LayerImport.prototype._getWMSLayerProjection = function (layerInfo, mapProjCode) {
        var projection;
        if (!layerInfo || typeof layerInfo !== 'object') {
            return;
        }
        var CRSList = layerInfo.CRS;
        if (Array.isArray(CRSList)) {
            for (var i = 0; i < CRSList.length; i++) {
                var layerCRS = CRSList[i];
                if (layerCRS === mapProjCode) {
                    projection = layerCRS;
                    break;
                } else {
                    if (layerCRS && typeof layerCRS === 'string') {
                        if (ol.proj.get(layerCRS) || ol.proj.get(layerCRS.toUpperCase())) {
                            projection = layerCRS;
                            break;
                        }
                    }
                }
            }
        }
        return projection;
    };
    LayerImport.prototype._getWMSLayerMinMaxResolution = function (layerInfo, mapProjCode, layerTileOptions) {
        var mapUnits = ol.proj.get(mapProjCode).getUnits();
        if (mapUnits === 'm') {
            if (layerInfo.MinScaleDenominator) {
                layerTileOptions.minResolution = layerInfo.MinScaleDenominator * 0.00028;
            }
            if (layerInfo.MaxScaleDenominator) {
                layerTileOptions.maxResolution = layerInfo.MaxScaleDenominator * 0.00028;
            }
        } else if (mapUnits === 'degrees') {
            var cste = 0.00028 * 180 / (Math.PI * 6378137);
            if (layerInfo.MinScaleDenominator) {
                layerTileOptions.minResolution = layerInfo.MinScaleDenominator * cste;
            }
            if (layerInfo.MaxScaleDenominator) {
                layerTileOptions.maxResolution = layerInfo.MaxScaleDenominator * cste;
            }
        }
    };
    LayerImport.prototype._getWMSLayerExtent = function (layerInfo, mapProjCode, layerTileOptions) {
        if (!layerInfo) {
            console.log('[ol.control.LayerImport] _getWMSLayerExtent error : layerInfo is not defined');
            return;
        }
        var exGeographicBoundingBox = layerInfo['EX_GeographicBoundingBox'];
        var boundingBox = layerInfo.BoundingBox;
        if (exGeographicBoundingBox && Array.isArray(exGeographicBoundingBox)) {
            if (mapProjCode === 'EPSG:4326') {
                layerTileOptions.extent = exGeographicBoundingBox;
            } else {
                layerTileOptions.extent = ol.proj.transformExtent(exGeographicBoundingBox, 'EPSG:4326', mapProjCode);
            }
        } else if (boundingBox && Array.isArray(boundingBox)) {
            var crs;
            var extent;
            for (var i = 0; i < boundingBox.length; i++) {
                crs = boundingBox[i].crs;
                extent = boundingBox[i].extent;
                if (crs) {
                    if (crs === mapProjCode) {
                        layerTileOptions.extent = extent;
                        break;
                    } else {
                        if (crs && typeof crs === 'string') {
                            var olProj = ol.proj.get(crs) ? ol.proj.get(crs) : ol.proj.get(crs.toUpperCase());
                            if (olProj) {
                                if (olProj.getUnits() === 'degrees' && crs.toUpperCase().indexOf('EPSG') === 0) {
                                    var reversedExtent = [
                                        extent[1],
                                        extent[0],
                                        extent[3],
                                        extent[2]
                                    ];
                                    layerTileOptions.extent = ol.proj.transformExtent(reversedExtent, olProj, mapProjCode);
                                } else {
                                    layerTileOptions.extent = ol.proj.transformExtent(extent, olProj, mapProjCode);
                                }
                                break;
                            }
                        }
                    }
                }
            }
        }
    };
    LayerImport.prototype._getWMSLayerInfoForLayerSwitcher = function (layerInfo, legend, wmsSource) {
        if (layerInfo.Title) {
            wmsSource._title = layerInfo.Title;
            wmsSource._description = layerInfo.Abstract ? layerInfo.Abstract : layerInfo.Title;
        } else {
            wmsSource._title = layerInfo.Name;
            wmsSource._description = layerInfo.Abstract ? layerInfo.Abstract : layerInfo.Name;
        }
        if (legend) {
            wmsSource._legends = [{ url: legend }];
        }
        if (layerInfo.MetadataURL && Array.isArray(layerInfo.MetadataURL)) {
            wmsSource._metadata = [];
            for (var i = 0; i < layerInfo.MetadataURL.length; i++) {
                var metadata = layerInfo.MetadataURL[i].OnlineResource;
                if (metadata) {
                    wmsSource._metadata.push({ url: metadata });
                }
            }
        }
        if (layerInfo.Attribution) {
            var attribution = layerInfo.Attribution;
            wmsSource._originators = {};
            if (attribution.OnlineResource) {
                wmsSource._originators.url = attribution.OnlineResource;
            }
            if (attribution.Title) {
                wmsSource._originators.name = wmsSource._originators.attribution = attribution.Title;
            }
            if (attribution.LogoURL && attribution.LogoURL.OnlineResource) {
                wmsSource._originators.logo = attribution.LogoURL.OnlineResource;
            }
        }
    };
    LayerImport.prototype._addGetCapWMTSLayer = function (layerInfo) {
        if (!layerInfo || !layerInfo.Identifier) {
            console.log('[ol.control.LayerImport] layer information not found in getCapabilities response for layer ');
            return;
        }
        var map = this.getMap();
        if (!map) {
            return;
        }
        var wmtsSourceOptions = {};
        wmtsSourceOptions.layer = layerInfo.Identifier;
        if (this._getCapResponseWMTS.version) {
            wmtsSourceOptions.version = this._getCapResponseWMTS.version;
        }
        var getMapUrl = this._getWMTSLayerGetTileUrl();
        if (getMapUrl) {
            wmtsSourceOptions.url = getMapUrl;
        } else {
            var questionMarkIndex = this._getCapRequestUrl.indexOf('?');
            if (questionMarkIndex !== -1) {
                wmtsSourceOptions.url = this._getCapRequestUrl.substring(0, questionMarkIndex);
            } else {
                wmtsSourceOptions.url = this._getCapRequestUrl;
            }
        }
        var tmsOptions = this._getTMSParams(layerInfo);
        wmtsSourceOptions.matrixSet = tmsOptions.tms;
        wmtsSourceOptions.projection = tmsOptions.projCode;
        wmtsSourceOptions.tileGrid = new ol.tilegrid.WMTS({
            resolutions: tmsOptions.resolutions,
            matrixIds: tmsOptions.matrixIds,
            origin: tmsOptions.origin
        });
        var defaultStyle;
        var legend;
        if (layerInfo.Style && Array.isArray(layerInfo.Style)) {
            var style;
            for (var s = 0; s < layerInfo.Style.length; s++) {
                style = layerInfo.Style[s];
                defaultStyle = style.Identifier;
                if (style.isDefault) {
                    break;
                }
                if (style.LegendURL && Array.isArray(style.LegendURL) && style.LegendURL.length !== 0) {
                    legend = style.LegendURL[0].href;
                }
            }
        }
        if (defaultStyle == null) {
            console.log('[ol.control.LayerImport] style information not found in getCapabilities response for layer ' + layerInfo.Identifier);
        }
        wmtsSourceOptions.style = defaultStyle;
        var format;
        if (layerInfo.Format && Array.isArray(layerInfo.Format)) {
            format = layerInfo.Format[0];
        }
        if (format == null) {
            console.log('[ol.control.LayerImport] format information not found in getCapabilities response for layer ' + layerInfo.Identifier);
        }
        wmtsSourceOptions.format = format;
        var wmtsSource = new ol.source.WMTS(wmtsSourceOptions);
        if (layerInfo.Title) {
            wmtsSource._title = layerInfo.Title;
            wmtsSource._description = layerInfo.Abstract ? layerInfo.Abstract : layerInfo.Title;
        } else {
            wmtsSource._title = layerInfo.Identifier;
            wmtsSource._description = layerInfo.Abstract ? layerInfo.Abstract : layerInfo.Identifier;
        }
        if (legend) {
            wmtsSource._legends = [{ url: legend }];
        }
        var layerTileOptions = {};
        layerTileOptions.source = wmtsSource;
        layerTileOptions.extent = this._getWMTSLayerExtent(layerInfo);
        var wmtsLayer;
        try {
            wmtsLayer = new ol.layer.Tile(layerTileOptions);
        } catch (e) {
            console.log('[ol.control.LayerImport] an error occured while trying to create ol.layer.Tile from getCapabilities information. error : ', e);
            return;
        }
        wmtsLayer.gpResultLayerId = 'layerimport:WMTS';
        map.addLayer(wmtsLayer);
    };
    LayerImport.prototype._getWMTSLayerGetTileUrl = function () {
        var gettileurl;
        if (this._getCapResponseWMTS && this._getCapResponseWMTS.OperationsMetadata && this._getCapResponseWMTS.OperationsMetadata.GetTile) {
            var gettile = this._getCapResponseWMTS.OperationsMetadata.GetTile;
            if (gettile.DCP && gettile.DCP.HTTP && gettile.DCP.HTTP.Get && Array.isArray(gettile.DCP.HTTP.Get) && gettile.DCP.HTTP.Get.length !== 0) {
                gettileurl = gettile.DCP.HTTP.Get[0].href;
            }
        }
        return gettileurl;
    };
    LayerImport.prototype._getWMTSLayerProjection = function (layerInfo, getCapResponseWMTS) {
        var projection;
        if (!layerInfo || typeof layerInfo !== 'object') {
            return;
        }
        if (!getCapResponseWMTS || typeof getCapResponseWMTS !== 'object') {
            return;
        }
        if (layerInfo.TileMatrixSetLink && Array.isArray(layerInfo.TileMatrixSetLink)) {
            var tms = layerInfo.TileMatrixSetLink[0].TileMatrixSet;
            var crs;
            if (getCapResponseWMTS.Contents && Array.isArray(getCapResponseWMTS.Contents.TileMatrixSet)) {
                var tileMatrixSets = getCapResponseWMTS.Contents.TileMatrixSet;
                for (var i = 0; i < tileMatrixSets.length; i++) {
                    if (tileMatrixSets[i].Identifier === tms && tileMatrixSets[i].TileMatrix) {
                        var tileMatrixSet = tileMatrixSets[i];
                        crs = tileMatrixSet.SupportedCRS;
                        if (crs && typeof crs === 'string') {
                            if (ol.proj.get(crs) || ol.proj.get(crs.toUpperCase())) {
                                projection = crs;
                            }
                        }
                        break;
                    }
                }
            }
        }
        return projection;
    };
    LayerImport.prototype._getTMSParams = function (layerInfo) {
        var tmsOptions = {};
        var matrixIds = [];
        var resolutions = [];
        var origin = [];
        var tms;
        var projCode;
        var projection;
        var map = this.getMap();
        if (!map) {
            return;
        }
        if (layerInfo.TileMatrixSetLink && Array.isArray(layerInfo.TileMatrixSetLink)) {
            tms = layerInfo.TileMatrixSetLink[0].TileMatrixSet;
            if (this._getCapResponseWMTS.Contents && Array.isArray(this._getCapResponseWMTS.Contents.TileMatrixSet)) {
                var tileMatrixSets = this._getCapResponseWMTS.Contents.TileMatrixSet;
                for (var i = 0; i < tileMatrixSets.length; i++) {
                    if (tileMatrixSets[i].Identifier === tms && tileMatrixSets[i].TileMatrix) {
                        var tileMatrixSet = tileMatrixSets[i];
                        var tilematrix;
                        var id;
                        var scaledenominator;
                        var resolution;
                        var units;
                        if (tileMatrixSet.SupportedCRS) {
                            projCode = tileMatrixSet.SupportedCRS;
                            projection = ol.proj.get(projCode);
                        }
                        if (projection && projection.getUnits) {
                            units = projection.getUnits();
                        }
                        if (Array.isArray(tileMatrixSet.TileMatrix)) {
                            for (var j = 0; j < tileMatrixSet.TileMatrix.length; j++) {
                                tilematrix = tileMatrixSet.TileMatrix[j];
                                if (tilematrix.Identifier != null) {
                                    id = parseInt(tilematrix.Identifier, 10);
                                    matrixIds.push(id);
                                }
                                scaledenominator = tilematrix.ScaleDenominator;
                                if (units === 'degrees') {
                                    resolution = scaledenominator * 0.00028 * 180 / (Math.PI * 6378137);
                                } else {
                                    resolution = scaledenominator * 0.00028;
                                }
                                resolutions.push(resolution);
                                origin = tilematrix.TopLeftCorner;
                            }
                        }
                        if (Array.isArray(resolutions) && resolutions.sort !== undefined) {
                            resolutions.sort(function (x, y) {
                                return y - x;
                            });
                        }
                        if (Array.isArray(matrixIds) && matrixIds.sort !== undefined) {
                            matrixIds.sort(function (x, y) {
                                return x - y;
                            });
                        }
                    }
                }
            } else {
                console.log('[ol.control.LayerImport] TileMatrixSet data not found in getCapabilities response for layer ' + layerInfo.Identifier);
            }
        } else {
            return;
        }
        tmsOptions.tms = tms;
        tmsOptions.projCode = projCode;
        tmsOptions.matrixIds = matrixIds;
        tmsOptions.resolutions = resolutions;
        tmsOptions.origin = origin;
        return tmsOptions;
    };
    LayerImport.prototype._getWMTSLayerExtent = function (layerInfo) {
        var extent;
        var mapProjCode = this._getMapProjectionCode();
        if (layerInfo.WGS84BoundingBox && Array.isArray(layerInfo.WGS84BoundingBox)) {
            extent = ol.proj.transformExtent(layerInfo.WGS84BoundingBox, 'EPSG:4326', mapProjCode);
        }
        return extent;
    };
    LayerImport.prototype._getMapProjectionCode = function () {
        var map = this.getMap();
        if (!map || !map.getView || !map.getView().getProjection) {
            return;
        }
        var mapProjCode = map.getView().getProjection().getCode();
        return mapProjCode;
    };
    LayerImport.prototype._displayWaitingContainer = function () {
        this._waitingContainer.className = 'GPimportWaitingContainerVisible';
        this._waiting = true;
        if (this._timer) {
            clearTimeout(this._timer);
            this._timer = null;
        }
        var context = this;
        this._timer = setTimeout(function () {
            if (context._waiting === true) {
                context._hideWaitingContainer();
            } else {
                if (context._timer) {
                    clearTimeout(context._timer);
                }
            }
        }, 16000);
    };
    LayerImport.prototype._hideWaitingContainer = function () {
        if (this._waiting) {
            this._waitingContainer.className = 'GPimportWaitingContainerHidden';
            this._waiting = false;
            clearTimeout(this._timer);
            this._timer = null;
        }
    };
    LayerImport.prototype._clearGetCapParams = function () {
        this._getCapRequestUrl = null;
        this._getCapResponseWMS = null;
        this._getCapResponseWMTS = null;
        this._getCapResponseWMSLayers = null;
        this._getCapResponseWMTSLayers = null;
    };
    LayerImport.prototype._emptyGetCapResultsList = function () {
        if (this._getCapResultsListContainer) {
            while (this._getCapResultsListContainer.firstChild) {
                this._getCapResultsListContainer.removeChild(this._getCapResultsListContainer.firstChild);
            }
        }
    };
    return LayerImport;
}(ol, gp, {}, Ol3Utils, Ol3ControlsUtilsMarkers, CommonControlsLayerImportDOM, CommonUtilsSelectorID, Ol3FormatsKML);
Ol3ControlsGeoportalAttribution = function (ol, LayerUtils) {
    function GeoportalAttribution(options) {
        if (!(this instanceof GeoportalAttribution)) {
            throw new TypeError('ERROR CLASS_CONSTRUCTOR');
        }
        ol.control.Attribution.call(this, options);
    }
    ol.inherits(GeoportalAttribution, ol.control.Attribution);
    GeoportalAttribution.prototype = Object.create(ol.control.Attribution.prototype, {});
    GeoportalAttribution.prototype.constructor = GeoportalAttribution;
    GeoportalAttribution.prototype.setMap = function (map) {
        if (map != null) {
            var ctrls = map.getControls();
            ctrls.forEach(function (element) {
                if (element instanceof ol.control.Attribution && !(element instanceof GeoportalAttribution)) {
                    this.remove(element);
                }
            }, ctrls);
            this._updateAttributions(map);
            var context = this;
            map.on('moveend', function () {
                context._updateAttributions(map);
            }, this);
            map.getLayers().on('add', function () {
                context._updateAttributions(map);
            }, this);
            map.getLayers().on('remove', function () {
                context._updateAttributions(map);
            }, this);
        }
        ol.control.Attribution.prototype.setMap.call(this, map);
    };
    GeoportalAttribution.prototype._updateAttributions = function (map) {
        var mapAttributions = {};
        var view = map.getView();
        var extent = view.calculateExtent(map.getSize());
        var mapProjection = view.getProjection().getCode();
        var geoExtent = ol.proj.transformExtent(extent, mapProjection, 'EPSG:4326');
        var standardExtent = [
            geoExtent[3],
            geoExtent[0],
            geoExtent[1],
            geoExtent[2]
        ];
        var zoom = view.getZoom();
        var layers = map.getLayers().getArray();
        for (var i = 0; i < layers.length; i++) {
            if (layers[i].getSource) {
                this._updateLayerAttributions(layers[i], mapAttributions, standardExtent, mapProjection, zoom);
            } else if (layers[i].getLayers) {
                var lyrs = layers[i].getLayers();
                var context = this;
                lyrs.forEach(function (lyr) {
                    if (lyr.getSource) {
                        context._updateLayerAttributions(lyr, mapAttributions, standardExtent, mapProjection, zoom);
                    } else {
                        console.log('cannot find layer source in layergroup ', layers[i]);
                    }
                });
            }
        }
    };
    GeoportalAttribution.prototype._updateLayerAttributions = function (layer, mapAttributions, mapExtent, mapCrs, mapZoom) {
        var src = layer.getSource();
        src.setAttributions();
        var attributions = [];
        var visibility = layer.getVisible();
        var originators = src._originators;
        if (originators && visibility) {
            var layerAttributions = LayerUtils.getAttributions({
                extent: mapExtent,
                crs: mapCrs,
                zoom: mapZoom,
                visibility: visibility,
                originators: originators
            });
            for (var j = 0; j < layerAttributions.length; j++) {
                var attributionj = layerAttributions[j];
                if (!mapAttributions || !mapAttributions[attributionj]) {
                    attributions.push(new ol.Attribution({ html: attributionj }));
                    mapAttributions[attributionj] = true;
                }
            }
            if (attributions.length !== 0) {
                src.setAttributions(attributions);
            }
        }
    };
    return GeoportalAttribution;
}(ol, CommonUtilsLayerUtils);
Ol3ControlsMeasuresMeasures = function (ol, woodman, Interactions) {
    var Measures = {
        DEFAULT_POINTER_STYLE: new ol.style.Circle({
            radius: 5,
            stroke: new ol.style.Stroke({
                color: '#002A50',
                width: 2
            }),
            fill: new ol.style.Fill({ color: 'rgba(255, 155, 0, 0.7)' })
        }),
        DEFAULT_DRAW_START_STYLE: new ol.style.Style({
            fill: new ol.style.Fill({ color: 'rgba(0, 183, 152, 0.2)' }),
            stroke: new ol.style.Stroke({
                color: '#002A50',
                lineDash: [
                    10,
                    10
                ],
                width: 2
            })
        }),
        DEFAULT_DRAW_FINISH_STYLE: new ol.style.Style({
            fill: new ol.style.Fill({ color: 'rgba(0, 183, 152, 0.3)' }),
            stroke: new ol.style.Stroke({
                color: '#002A50',
                width: 3
            })
        }),
        tools: {
            MeasureLength: {
                active: false,
                instance: null
            },
            MeasureArea: {
                active: false,
                instance: null
            },
            MeasureAzimuth: {
                active: false,
                instance: null
            }
        },
        measureDraw: null,
        measureSource: null,
        measureVector: null,
        sketch: null,
        measureTooltipElement: null,
        measureTooltip: null,
        helpTooltipElement: null,
        helpTooltip: null,
        clean: function () {
            var _class = this.CLASSNAME;
            this.clearMeasure();
            this.clearMeasureToolTip();
            this.removeMeasureEvents();
            this._showContainer.checked = false;
        },
        onPointerMoveHandler: function (e) {
            if (e.dragging) {
                return;
            }
            var tooltipCoord = e.coordinate;
            if (this.sketch) {
                var output;
                var geom = this.sketch.getGeometry();
                output = this.format(geom);
                if (geom.getType() === 'LineString') {
                    tooltipCoord = geom.getLastCoordinate();
                } else if (geom.getType() === 'Polygon') {
                    tooltipCoord = geom.getInteriorPoint().getCoordinates();
                } else {
                    return;
                }
                this.measureTooltipElement.innerHTML = output;
                this.measureTooltip.setPosition(tooltipCoord);
            }
        },
        onShowMeasureClick: function (e, type) {
            var self = this.CLASSNAME;
            for (var className in this.tools) {
                if (this.tools.hasOwnProperty(className)) {
                    var o = this.tools[className];
                    if (o.active && className !== self) {
                        o.active = false;
                        if (o.instance !== null) {
                            o.instance.clean();
                        }
                    }
                }
            }
            var map = this.getMap();
            Interactions.unset(map, { current: 'Measures' });
            if (!this._showContainer.checked) {
                this.addMeasureEvents();
                this.initMeasureInteraction();
                this.addMeasureInteraction(type);
                this.tools[self].active = true;
            } else {
                this.clearMeasure();
                this.clearMeasureToolTip();
                this.removeMeasureEvents();
                this.tools[self].active = false;
            }
        },
        clearMeasureToolTip: function () {
            var map = this.getMap();
            if (!map) {
                return;
            }
            var mapContainer = map.getTargetElement();
            var overlays = mapContainer.getElementsByClassName('ol-overlaycontainer-stopevent');
            for (var k = 0; k < overlays.length; k++) {
                var nodes = overlays[k];
                var len = nodes.children.length;
                var nodesToRemove = [];
                for (var i = 0; i < len; i++) {
                    var node = nodes.children[i];
                    var child = node.children[0];
                    if (child.className === 'GPmeasureTooltip GPmeasureTooltip-static' || child.className === 'GPmeasureTooltip GPmeasureTooltip-measure') {
                        nodesToRemove.push(node);
                    }
                }
                for (var j = 0; j < nodesToRemove.length; j++) {
                    nodes.removeChild(nodesToRemove[j]);
                }
            }
        },
        clearMeasure: function () {
            var map = this.getMap();
            if (this.measureVector) {
                map.removeLayer(this.measureVector);
                this.measureVector = null;
            }
            if (this.measureDraw) {
                map.removeInteraction(this.measureDraw);
                this.measureDraw = null;
            }
        },
        createMeasureTooltip: function (map) {
            if (this.measureTooltipElement) {
                this.measureTooltipElement.parentNode.removeChild(this.measureTooltipElement);
            }
            this.measureTooltipElement = document.createElement('div');
            this.measureTooltipElement.className = 'GPmeasureTooltip GPmeasureTooltip-measure';
            this.measureTooltip = new ol.Overlay({
                element: this.measureTooltipElement,
                offset: [
                    0,
                    -15
                ],
                positioning: 'bottom-center'
            });
            map.addOverlay(this.measureTooltip);
        },
        createHelpTooltip: function (map) {
            if (this.helpTooltipElement) {
                this.helpTooltipElement.parentNode.removeChild(this.helpTooltipElement);
            }
            this.helpTooltipElement = document.createElement('div');
            this.helpTooltipElement.className = 'tooltip hidden';
            this.helpTooltip = new ol.Overlay({
                element: this.helpTooltipElement,
                offset: [
                    15,
                    0
                ],
                positioning: 'center-left'
            });
            map.addOverlay(this.helpTooltip);
        },
        createStylingMeasureInteraction: function (styles) {
            this.options.styles = styles || {};
            var startStyleOpts = {
                image: Measures.DEFAULT_POINTER_STYLE,
                fill: Measures.DEFAULT_DRAW_START_STYLE.getFill(),
                stroke: Measures.DEFAULT_DRAW_START_STYLE.getStroke()
            };
            if (this.options.styles.hasOwnProperty('pointer') && this.options.styles.pointer instanceof ol.style.Image) {
                startStyleOpts.image = this.options.styles.pointer;
            }
            if (this.options.styles.hasOwnProperty('start') && this.options.styles.start instanceof ol.style.Style) {
                if (this.options.styles.start.getFill() != null) {
                    startStyleOpts.fill = this.options.styles.start.getFill();
                }
                if (this.options.styles.start.getStroke() != null) {
                    startStyleOpts.stroke = this.options.styles.start.getStroke();
                }
            }
            this.options.styles.start = new ol.style.Style(startStyleOpts);
            var finishStyleOpts = {
                fill: Measures.DEFAULT_DRAW_FINISH_STYLE.getFill(),
                stroke: Measures.DEFAULT_DRAW_FINISH_STYLE.getStroke()
            };
            if (this.options.styles.hasOwnProperty('finish') && this.options.styles.finish instanceof ol.style.Style) {
                if (this.options.styles.finish.getFill() != null) {
                    finishStyleOpts.fill = this.options.styles.finish.getFill();
                }
                if (this.options.styles.finish.getStroke() != null) {
                    finishStyleOpts.stroke = this.options.styles.finish.getStroke();
                }
            }
            this.options.styles.finish = new ol.style.Style(finishStyleOpts);
        },
        addMeasureInteraction: function (type) {
            var map = this.getMap();
            this.measureDraw = new ol.interaction.Draw({
                source: this.measureSource,
                type: type,
                style: this.options.styles.start || Measures.DEFAULT_DRAW_START_STYLE
            });
            this.measureDraw.setProperties({
                name: 'Measures',
                source: this
            });
            map.addInteraction(this.measureDraw);
            this.createMeasureTooltip(map);
            var self = this;
            this.measureDraw.on('drawstart', function (evt) {
                self.sketch = evt.feature;
            }, this);
            this.measureDraw.on('drawend', function () {
                if (self.sketch) {
                    var output;
                    var tooltipCoord;
                    var geom = self.sketch.getGeometry();
                    output = self.format(geom);
                    if (geom.getType() === 'LineString') {
                        tooltipCoord = geom.getLastCoordinate();
                    } else if (geom.getType() === 'Polygon') {
                        tooltipCoord = geom.getInteriorPoint().getCoordinates();
                    } else {
                        return;
                    }
                    self.measureTooltipElement.innerHTML = output;
                    self.measureTooltip.setPosition(tooltipCoord);
                }
                self.measureTooltipElement.className = 'GPmeasureTooltip GPmeasureTooltip-static';
                self.measureTooltip.setOffset([
                    0,
                    -7
                ]);
                self.sketch = null;
                self.measureTooltipElement = null;
                self.createMeasureTooltip(map);
            }, this);
        },
        initMeasureInteraction: function () {
            var map = this.getMap();
            this.measureSource = new ol.source.Vector();
            this.measureVector = new ol.layer.Vector({
                source: this.measureSource,
                style: this.options.styles.finish || Measures.DEFAULT_DRAW_FINISH_STYLE
            });
            map.addLayer(this.measureVector);
        }
    };
    return Measures;
}(ol, {}, Ol3ControlsUtilsInteractions);
CommonControlsMeasureToolBoxDOM = function () {
    var MeasureToolBoxDOM = {
        _toolboxId: 'GPtoolbox-measure-main',
        _buttonId: 'GPtoolbox-measure-button',
        _widgetId: 'GPtoolbox-measure-widget',
        getToolBoxID: function (uid) {
            return uid ? this._toolboxId + '-' + uid : this._toolboxId;
        },
        getButtonID: function (uid) {
            return uid ? this._buttonId + '-' + uid : this._buttonId;
        },
        getWidgetID: function (uid) {
            return uid ? this._widgetId + '-' + uid : this._widgetId;
        },
        _createToolBoxContainerElement: function (uid) {
            var container = document.createElement('div');
            container.id = this.getToolBoxID(uid);
            container.className = 'GPshowAdvancedToolPicto';
            var button = document.createElement('button');
            button.id = this.getButtonID(uid);
            var self = this;
            button.addEventListener('click', function () {
                this.blur();
                var widget = document.getElementById(self.getWidgetID(uid));
                if (widget.style.display === 'block') {
                    widget.style.display = 'none';
                } else {
                    widget.style.display = 'block';
                }
            });
            container.appendChild(button);
            var widget = document.createElement('div');
            widget.id = this.getWidgetID(uid);
            widget.addEventListener('click', function () {
            }, false);
            container.appendChild(widget);
            return container;
        }
    };
    return MeasureToolBoxDOM;
}();
Ol3ControlsMeasureToolBox = function (ol, woodman, Utils, ID, MeasureToolBoxDOM) {
    var MeasureToolBox = {
        _toolbox: {},
        add: function (map, ctrl) {
            if (!map) {
                return;
            }
            var mapContainer = map.getTargetElement();
            var mapDocument = mapContainer.ownerDocument;
            var mapId = mapContainer.id;
            if (!this._toolbox || Object.keys(this._toolbox).length === 0) {
                this._toolbox[mapId] = ID.generate();
            } else {
                if (!this._toolbox[mapId]) {
                    this._toolbox[mapId] = ID.generate();
                }
            }
            var uid = this._toolbox[mapId];
            if (!mapDocument.getElementById(this.getToolBoxID(uid))) {
                var toolboxContainer = this._createToolBoxContainerElement(uid);
                var overlaysContainer = mapContainer.getElementsByClassName('ol-overlaycontainer-stopevent');
                overlaysContainer[0].appendChild(toolboxContainer);
            }
            var widgetContainer = mapDocument.getElementById(this.getWidgetID(uid));
            ctrl.setTarget(widgetContainer);
        }
    };
    Utils.assign(MeasureToolBox, MeasureToolBoxDOM);
    return MeasureToolBox;
}(ol, {}, Ol3Utils, CommonUtilsSelectorID, CommonControlsMeasureToolBoxDOM);
CommonControlsElevationPathDOM = function () {
    var ElevationPathDOM = {
        _addUID: function (id) {
            var uid = this._uid ? id + '-' + this._uid : id;
            return uid;
        },
        _createMainContainerElement: function () {
            var container = document.createElement('div');
            container.id = this._addUID('GPelevationPath');
            container.className = 'GPwidget';
            return container;
        },
        _createShowElevationPathElement: function () {
            var input = document.createElement('input');
            input.id = this._addUID('GPshowElevationPath');
            input.type = 'checkbox';
            return input;
        },
        _createShowElevationPathPictoElement: function () {
            var context = this;
            var label = document.createElement('label');
            label.id = this._addUID('GPshowElevationPathPicto');
            label.className = 'GPshowAdvancedToolPicto';
            label.htmlFor = this._addUID('GPshowElevationPath');
            label.title = 'Calculer un profil';
            if (label.addEventListener) {
                label.addEventListener('click', function (e) {
                    context.onShowElevationPathClick(e);
                });
            } else if (label.attachEvent) {
                label.attachEvent('onclick', function (e) {
                    context.onShowElevationPathClick(e);
                });
            }
            var spanOpen = document.createElement('span');
            spanOpen.id = this._addUID('GPshowElevationPathOpen');
            spanOpen.className = 'GPshowAdvancedToolOpen';
            label.appendChild(spanOpen);
            return label;
        },
        _createElevationPathPanelElement: function () {
            var div = document.createElement('div');
            div.id = this._addUID('GPelevationPathPanel');
            div.className = 'GPpanel';
            return div;
        },
        _createElevationPathPanelHeaderElement: function () {
            var self = this;
            var container = document.createElement('div');
            container.className = 'GPpanelHeader';
            var div = document.createElement('div');
            div.className = 'GPpanelTitle';
            div.innerHTML = 'Profil Altimétrique';
            container.appendChild(div);
            var divReduce = document.createElement('div');
            divReduce.id = this._addUID('GPelevationPathPanelReduce');
            divReduce.className = 'GPpanelReduce';
            divReduce.title = 'Masquer le panneau';
            if (divReduce.addEventListener) {
                divReduce.addEventListener('click', function () {
                    if (typeof self.onReduceElevationPathPanelClick === 'function') {
                        document.getElementById(self._addUID('GPshowElevationPath')).checked = false;
                        self.onReduceElevationPathPanelClick();
                    }
                }, false);
            } else if (divReduce.attachEvent) {
                divReduce.attachEvent('onclick', function () {
                    if (typeof self.onReduceElevationPathPanelClick === 'function') {
                        document.getElementById(self._addUID('GPshowElevationPath')).checked = false;
                        self.onReduceElevationPathPanelClick();
                    }
                });
            }
            container.appendChild(divReduce);
            var divClose = document.createElement('div');
            divClose.id = this._addUID('GPelevationPathPanelClose');
            divClose.className = 'GPpanelClose';
            divClose.title = 'Fermer le panneau';
            if (divClose.addEventListener) {
                divClose.addEventListener('click', function () {
                    document.getElementById(self._addUID('GPshowElevationPathPicto')).click();
                }, false);
            } else if (divClose.attachEvent) {
                divClose.attachEvent('onclick', function () {
                    document.getElementById(self._addUID('GPshowElevationPathPicto')).click();
                });
            }
            container.appendChild(divClose);
            return container;
        },
        _createElevationPathPanelProfilElement: function () {
            var div = document.createElement('div');
            div.id = 'GPelevationPathProfil';
            return div;
        },
        _createElevationPathWaitingElement: function () {
            var div = document.createElement('div');
            div.id = this._addUID('GPelevationPathCalcWaitingContainer');
            div.className = 'GPelevationPathCalcWaitingContainerHidden';
            var p = document.createElement('p');
            p.className = 'GPelevationPathCalcWaiting';
            p.innerHTML = 'Calcul en cours...';
            div.appendChild(p);
            return div;
        }
    };
    return ElevationPathDOM;
}();
Ol3ControlsElevationPath = function (ol, woodman, Gp, Utils, RightManagement, Measures, MeasureToolBox, Interactions, ElevationPathDOM, ID) {
    function ElevationPath(options) {
        options = options || {};
        if (!(this instanceof ElevationPath)) {
            throw new TypeError('ERROR CLASS_CONSTRUCTOR');
        }
        this.CLASSNAME = 'ElevationPath';
        this._uid = ID.generate();
        this._showContainer = null;
        this._pictoContainer = null;
        this._panelContainer = null;
        this._profileContainer = null;
        this._waitingContainer = null;
        this._drawStyleStart = null;
        this._drawStyleFinish = null;
        this._markerStyle = null;
        this._profile = null;
        this._measureSource = null;
        this._measureVector = null;
        this._measureDraw = null;
        this._lastSketch = null;
        this._currentSketch = null;
        this._marker = null;
        this._noRightManagement = false;
        this._initialize(options);
        this._checkRightsManagement();
        var container = options.element ? options.element : this._initializeContainer();
        ol.control.Control.call(this, {
            element: container,
            target: options.target,
            render: options.render
        });
    }
    ol.inherits(ElevationPath, ol.control.Control);
    ElevationPath.prototype = Object.create(ol.control.Control.prototype, {});
    Utils.assign(ElevationPath.prototype, ElevationPathDOM);
    ElevationPath.__removeProfilMarker = function (context) {
        var self = context;
        if (self._marker) {
            self._measureSource.removeFeature(self._marker);
            self._marker = null;
        }
    };
    ElevationPath.__updateProfilMarker = function (d, context) {
        var self = context;
        var map = self.getMap();
        var proj = map.getView().getProjection();
        ElevationPath.__removeProfilMarker(self);
        var _coordinate = ol.proj.transform([
            d.lon,
            d.lat
        ], 'EPSG:4326', proj);
        var _geometry = new ol.geom.Point(_coordinate);
        self._marker = new ol.Feature({ geometry: _geometry });
        self._marker.setStyle(self._markerStyle);
        self._measureSource.addFeature(self._marker);
    };
    ElevationPath.DISPLAY_PROFILE_LIB_AMCHARTS = function (data, container, context) {
        if (typeof AmCharts === 'undefined') {
            console.log('Lib. AmCharts is not loaded !');
            return;
        }
        AmCharts.addInitHandler(function () {
        });
        var self = context;
        var _config = {};
        Utils.mergeParams(_config, self.options.styles.profile);
        Utils.mergeParams(_config, { dataProvider: data });
        self._profile = AmCharts.makeChart(container, _config);
        self._profile.addListener('changed', function (e) {
            var obj = e.chart.dataProvider[e.index];
            ElevationPath.__removeProfilMarker(self);
            ElevationPath.__updateProfilMarker(obj, self);
        });
    };
    ElevationPath.DISPLAY_PROFILE_LIB_D3 = function (data, container, context) {
        if (typeof d3 === 'undefined') {
            console.log('Lib. D3 is not loaded !');
            return;
        }
        if (container) {
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
        }
        var margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 40
        };
        var h = getComputedStyle(container, null).getPropertyValue('height').replace('px', '');
        var w = getComputedStyle(container, null).getPropertyValue('width').replace('px', '');
        var width = w - margin.left - margin.right;
        var height = h - margin.top - margin.bottom;
        var x = d3.scale.linear().range([
            0,
            width
        ]);
        var y = d3.scale.linear().range([
            height,
            0
        ]);
        var xAxis = d3.svg.axis().scale(x).orient('bottom').ticks(5);
        var yAxis = d3.svg.axis().scale(y).orient('left').ticks(5);
        var line = d3.svg.line().interpolate('basis').x(function (d) {
            return x(d.dist);
        }).y(function (d) {
            return y(d.z);
        });
        var area = d3.svg.area().interpolate('basis').x(function (d) {
            return x(d.dist);
        }).y0(height).y1(function (d) {
            return y(d.z);
        });
        var svg = d3.select(container).append('svg').attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom).append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
        var xDomain = d3.extent(data, function (d) {
            return d.dist;
        });
        x.domain(xDomain);
        var yDomain = [
            0,
            d3.max(data, function (d) {
                return d.z;
            })
        ];
        y.domain(yDomain);
        svg.append('path').datum(data).attr('class', 'area-d3').attr('d', area);
        svg.append('g').attr('class', 'x axis-d3').attr('transform', 'translate(0,' + height + ')').call(xAxis).append('text').attr('y', -15).attr('dy', '.71em').attr('x', width).text('Distance (km)');
        svg.append('g').attr('class', 'y axis-d3').call(yAxis).append('text').attr('transform', 'rotate(-90)').attr('y', 6).attr('dy', '.71em').text('Altitude (m)');
        svg.append('g').attr('class', 'grid-d3 vertical').attr('transform', 'translate(0,' + height + ')').call(xAxis.orient('bottom').tickSize(-height, 0, 0).tickFormat(''));
        svg.append('g').attr('class', 'grid-d3 horizontal').call(yAxis.orient('left').tickSize(-width, 0, 0).tickFormat(''));
        svg.append('path').datum(data).attr('class', 'line-d3').attr('d', line);
        svg.selectAll('circle').data(data).enter().append('circle').attr('cx', function (d) {
            return x(d.dist);
        }).attr('cy', function (d) {
            return y(d.z);
        }).attr('r', 0).attr('class', 'circle-d3');
        var focus = svg.append('g').style('display', 'none');
        focus.append('line').attr('id', 'focusLineX').attr('class', 'focusLine-d3');
        focus.append('line').attr('id', 'focusLineY').attr('class', 'focusLine-d3');
        focus.append('circle').attr('id', 'focusCircle').attr('r', 4).attr('class', 'circle-d3 focusCircle-d3');
        var div = d3.select(container).append('div').attr('class', 'tooltip-d3').style('opacity', 0);
        var bisectDist = d3.bisector(function (d) {
            return d.dist;
        }).left;
        var self = context;
        svg.append('rect').attr('class', 'overlay-d3').attr('width', width).attr('height', height).on('mouseover', function () {
            focus.style('display', null);
            ElevationPath.__updateProfilMarker(data[0], self);
        }).on('mouseout', function () {
            focus.style('display', 'none');
            ElevationPath.__removeProfilMarker(self);
            div.transition().duration(500).style('opacity', 0);
        }).on('mousemove', function () {
            var m = d3.mouse(this);
            var distance = x.invert(m[0]);
            var i = bisectDist(data, distance);
            var d0 = i === 0 ? data[0] : data[i - 1];
            var d1 = data[i];
            var d = distance - d0[0] > d1[0] - distance ? d1 : d0;
            var xc = x(d.dist);
            var yc = y(d.z);
            focus.select('#focusCircle').attr('cx', xc).attr('cy', yc);
            focus.select('#focusLineX').attr('x1', xc).attr('y1', y(yDomain[0])).attr('x2', xc).attr('y2', y(yDomain[1]));
            focus.select('#focusLineY').attr('x1', x(xDomain[0])).attr('y1', yc).attr('x2', x(xDomain[1])).attr('y2', yc);
            ElevationPath.__updateProfilMarker(d, self);
            div.transition().duration(200).style('opacity', 0.9);
            div.html('Alt : ' + d.z + ' m <br/>' + 'Lon : ' + d.lon + ' <br/>' + 'Lat : ' + d.lat).style('left', d3.event.pageX + 'px').style('top', d3.event.pageY - 28 + 'px');
        });
        self._profile = d3.selectAll('rect.overlay')[0][0];
    };
    ElevationPath.DISPLAY_PROFILE_RAW = function (data, container, context) {
        if (container) {
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
        }
        var self = context;
        var div = document.createElement('textarea');
        div.id = 'profileElevationRaw';
        div.rows = 10;
        div.cols = 50;
        div.style.width = '100%';
        div.wrap = 'off';
        div.innerHTML = JSON.stringify(data, undefined, 4);
        container.appendChild(div);
        self._profile = container;
        if (self.options.debug) {
            var _proj = self.getMap().getView().getProjection();
            for (var i = 0; i < data.length; i++) {
                var obj = data[i];
                var _coordinate = ol.proj.transform([
                    obj.lon,
                    obj.lat
                ], 'EPSG:4326', _proj);
                var _geometry = new ol.geom.Point(_coordinate);
                self._marker = new ol.Feature({ geometry: _geometry });
                var styles = ElevationPath.DEFAULT_STYLES.RESULTS;
                var _image = new ol.style.Circle({
                    radius: styles.imageRadius,
                    stroke: new ol.style.Stroke({
                        color: styles.imageStrokeColor,
                        width: styles.imageStrokeWidth
                    }),
                    fill: new ol.style.Fill({ color: styles.imageFillColor })
                });
                self._marker.setStyle(new ol.style.Style({ image: _image }));
                self._measureSource.addFeature(self._marker);
            }
        }
    };
    ElevationPath.DISPLAY_PROFILE_BY_DEFAULT = function (data, container, context) {
        if (container) {
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
        }
        if (!data) {
            return;
        }
        var sortedElev = JSON.parse(JSON.stringify(data));
        sortedElev.sort(function (e1, e2) {
            return e1.z - e2.z;
        });
        var minZ = sortedElev[0].z;
        var maxZ = sortedElev[sortedElev.length - 1].z;
        var diff = maxZ - minZ;
        var distMax = data[data.length - 1].dist;
        var barwidth = 100 / data.length;
        var self = context;
        var div = document.createElement('div');
        div.id = 'profileElevationByDefault';
        div.addEventListener('mouseover', function (e) {
            var _lon = parseFloat(e.target.dataset['lon']);
            var _lat = parseFloat(e.target.dataset['lat']);
            if (_lon && _lat) {
                ElevationPath.__updateProfilMarker({
                    lon: _lon,
                    lat: _lat
                }, self);
            }
        });
        div.addEventListener('mousemove', function () {
        });
        div.addEventListener('mouseout', function () {
            ElevationPath.__removeProfilMarker(self);
        });
        container.appendChild(div);
        var divBox = document.createElement('div');
        divBox.className = 'profile-box';
        var divZ = document.createElement('div');
        divZ.className = 'profile-z-vertical';
        var ulZ = document.createElement('ul');
        var liZmin = document.createElement('li');
        liZmin.setAttribute('class', 'profile-min-z');
        liZmin.innerHTML = minZ + ' m';
        var liZmax = document.createElement('li');
        liZmax.setAttribute('class', 'profile-max-z');
        liZmax.innerHTML = maxZ + ' m';
        ulZ.appendChild(liZmax);
        ulZ.appendChild(liZmin);
        divZ.appendChild(ulZ);
        divBox.appendChild(divZ);
        var divData = document.createElement('div');
        divData.className = 'profile-content';
        var ulData = document.createElement('ul');
        ulData.id = 'profile-data';
        ulData.className = 'profile-z-axis profile-x-axis';
        divData.appendChild(ulData);
        for (var i = 0; i < data.length; i++) {
            var d = data[i];
            var li = document.createElement('li');
            li.setAttribute('data-z', d.z);
            li.setAttribute('data-lon', d.lon);
            li.setAttribute('data-lat', d.lat);
            li.setAttribute('data-dist', d.dist);
            var pct = Math.floor((d.z - minZ) * 100 / diff);
            li.setAttribute('class', 'percent v' + pct);
            li.title = 'altitude : ' + d.z + 'm';
            li.setAttribute('style', 'width: ' + barwidth + '%');
            ulData.appendChild(li);
        }
        divBox.appendChild(divData);
        div.appendChild(divBox);
        var divX = document.createElement('div');
        divX.className = 'profile-x-horizontal';
        var ulX = document.createElement('ul');
        var liXmin = document.createElement('li');
        liXmin.setAttribute('class', 'profile-min-x');
        liXmin.innerHTML = '';
        var liXmax = document.createElement('li');
        liXmax.setAttribute('class', 'profile-max-x');
        liXmax.innerHTML = distMax + ' km';
        ulX.appendChild(liXmin);
        ulX.appendChild(liXmax);
        divX.appendChild(ulX);
        div.appendChild(divX);
        self._profile = container;
    };
    ElevationPath.DEFAULT_STYLES = {
        MARKER: new ol.style.Icon({
            src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAsCAYAAAAATWqyAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABTtJREFUeNq8WGtsFUUU/rb3gtdCAykFG9AUDTQUKimhxUewEusrJYoBo4FfEgoqotHERH6oP9TGmJhIrIlWAf9hjAaEiME2pgFfVVpFii8sWqIQLLSx3EJLW7p+Z2Z2b2l7d/b23vZLTmZ2duacb2fmnDk7DlKA67rXs1hJKacsohRQppjXFygnKT9TDlH2O47zFzIFGnco91EOuqnjoBnr2Ow4FhIlLN6m3DykFTh3BGj/Doj/CfSe082xPCDnBmDWTUBeyXDVjZTHOUNHUiZCEs+weI0ySTV0/w0c2wa07gIungn+vOx8YN46oPhpYOp1Xms/5TmSeSMUERKImFnYqBoGuPRNL5LEW8BgX2rrmjWZZLYApS8BUW8r4T0zO5eTEjFr+S6lSjV0HgPqVwNdf6S30abNB+7aDeQWey3bKZtIxvU5DxvyrE/izJfAvuXpkxCIDtElOjWqjK2RM8LZWMbiG0oEnUc5kB7a14WMYvI04H56du5ieZKluZWz8r0/IyQh5TuKRH8cqFuTeRIC0Sm6xYbYok1j21+ahyhLVO3wC8D5VowbRLfY0FhibOulIavDLEoRZyD8sJDeMWBXKG5ZsIobsdDsg+OMq3u1m1u9KQo8zP45EqjRxOUpk6i50IRl4FuGjpZtwUoiMYa314GFj/EzIsN8n8v+C1e4kfvwcm+wnhsZY27xQ8oiWZpKrWRQB6tAElfxpKnjsCdGklDzG9HvpI/0DYLYEpsalVnmAAM6fgR62oMHl70C5N9mn3rpI32DILbEpkZ5ljlFgbPNFtebzij5VPhNKX1lTBASNtXSzPZ3cxCuvVOH7FTCu4yxeZDGbCES0z5+PniQ3uGpwTYmYTOWCPGTpgYP6u9OnYhtzBCbQkSH0NiM4EEdP6VOxDYmYbNLiJxQ1elFwYPaG3XQCn3QHddjgpCweUKI6K2bvzw4YROf//rJob6fZl/H2FRoFiINfqo3qyzYwD8MVIeYLw32J+8j76SP9A2C2BKbGg1CZL+EF/W4YKP9a3/fCeyhkrY9DOOXEu1SlzZ5J31sSNjqURm/OfQkY9qgvkYOvXhbuH0g505Oga7HT9rPF9+t5+pDL0ulwzt46FV5ROax+JUSRRtP0LoHMK64+xNg7iqVEVOKSKRVxRGpsKhRnaRD4SPjR0J0axKCGmP7ilQxm4X8d8xXmfvHJZlPkCR3WfODl9FLMlxCIhevSJ5Nwzo1XdKxYpe3hpmB6BKdmoS43VqPxIgsni+aWOg8biZ3f+nLmSMiuvKWek/P01az7QdLyNVT7lC/l59WAKcb0iMxhzpW1nvmvpDtSiKD1l9OkpnDgv8UyMWFU9wvTP8vdY6NhJwnD1JVtso2OiiLSeL0iJUbNfg6zikVVwRTyOn2HWOfjfLtHgnBhtFIJCViyNDZUatdmnGlaFPqJIoe1WM1aqlz71ivJbLNobgAA9zgu7nZ/vstHAk5WVdzaPRqmGC5lER6kjpV4OWJdq+1kkshSk4VH9izcy/bV66qSPQZV+0J9G7rTY6+XNmqHmYwyJVV24kse1X31dhKHdasygkzy+a64oC4nWr47F4e858nSbLv4V/KAe9JKpVDrx/SImLIXMOiRUKdujESl+49O8xVZxpXzVc/C/I/RxL/hgq8YYkYhev9q6kVO4d9B+sr3vdICNaHJTHWW8Ya/87wqy2uWwstUk/gTYw3aCRGOarMDfS67kfFWqSuIe9imAjQEC272nJHixYNaSvGRIIGN49ywbsZEw1zI11N6TZSHeaGORn+F2AAJtRIMx4t+hUAAAAASUVORK5CYII=',
            anchor: [
                0.5,
                1
            ],
            snapToPixel: true
        }),
        RESULTS: {
            imageRadius: 5,
            imageFillColor: 'rgba(128, 128, 128, 0.2)',
            imageStrokeColor: 'rgba(0, 0, 0, 0.7)',
            imageStrokeWidth: 2
        },
        PROFILE: {
            type: 'serial',
            pathToImages: 'http://cdn.amcharts.com/lib/3/images/',
            categoryField: 'dist',
            autoMarginOffset: 0,
            marginRight: 10,
            marginTop: 10,
            startDuration: 0,
            color: '#5E5E5E',
            fontSize: 10,
            theme: 'light',
            thousandsSeparator: '',
            categoryAxis: {
                color: '#5E5E5E',
                gridPosition: 'start',
                minHorizontalGap: 40,
                tickPosition: 'start',
                title: 'Distance (km)',
                titleColor: '#5E5E5E',
                startOnAxis: true
            },
            chartCursor: {
                animationDuration: 0,
                bulletsEnabled: true,
                bulletSize: 10,
                categoryBalloonEnabled: false,
                cursorColor: '#F90',
                graphBulletAlpha: 1,
                graphBulletSize: 1,
                zoomable: false
            },
            trendLines: [],
            graphs: [{
                    balloonColor: '#CCCCCC',
                    balloonText: '<span class=\'altiPathValue\'>[[title]] : [[value]]m</span><br/><span class=\'altiPathCoords\'>(lat: [[lat]] / lon:[[lon]])</span>',
                    bullet: 'round',
                    bulletAlpha: 0,
                    bulletBorderColor: '#FFF',
                    bulletBorderThickness: 2,
                    bulletColor: '#F90',
                    bulletSize: 6,
                    hidden: false,
                    id: 'AmGraph-1',
                    fillAlphas: 0.4,
                    fillColors: '#C77A04',
                    lineAlpha: 1,
                    lineColor: '#C77A04',
                    lineThickness: 1,
                    title: 'Altitude',
                    valueField: 'z'
                }],
            guides: [],
            valueAxes: [{
                    id: 'ValueAxis-1',
                    minVerticalGap: 20,
                    title: 'Altitude (m)'
                }],
            allLabels: [],
            balloon: {
                borderColor: '#CCCCCC',
                borderThickness: 1,
                fillColor: '#FFFFFF',
                showBullet: true
            },
            titles: []
        }
    };
    ElevationPath.prototype.constructor = ElevationPath;
    ElevationPath.prototype.setMap = function (map) {
        if (map) {
            if (this.options.active) {
                if (this._profile === null) {
                    this._panelContainer.style.display = 'none';
                }
                this._initMeasureInteraction(map);
                this._addMeasureInteraction(map);
            }
            if (!this.options.target) {
                MeasureToolBox.add(map, this);
            }
        }
        ol.control.Control.prototype.setMap.call(this, map);
    };
    ElevationPath.prototype.getActive = function () {
        return this.options.active;
    };
    ElevationPath.prototype.setActive = function (active) {
        this.options.active = active;
    };
    ElevationPath.prototype.clean = function () {
        var map = this.getMap();
        this._panelContainer.style.display = 'none';
        this._showContainer.checked = false;
        this._removeProfile();
        this._removeMeasure();
        this._removeMeasureInteraction(map);
    };
    ElevationPath.prototype._removeMeasure = function () {
        this._lastSketch = null;
        this._currentSketch = null;
        if (this._measureSource) {
            if (this._marker) {
                this._measureSource.removeFeature(this._marker);
                this._marker = null;
            }
            var _features = this._measureSource.getFeatures();
            for (var i = 0; i < _features.length; i++) {
                this._measureSource.removeFeature(_features[i]);
            }
        }
    };
    ElevationPath.prototype._removeProfile = function () {
        this._profile = null;
        if (this._profileContainer) {
            while (this._profileContainer.firstChild) {
                this._profileContainer.removeChild(this._profileContainer.firstChild);
            }
        }
    };
    ElevationPath.prototype._initialize = function (options) {
        this.options = {};
        this.options.target = typeof options.target !== 'undefined' ? options.target : null;
        this.options.render = typeof options.render !== 'undefined' ? options.render : null;
        this.options.apiKey = options.apiKey;
        var debug = options.debug;
        this.options.debug = typeof debug === 'undefined' ? false : debug;
        var active = options.active;
        this.options.active = typeof active === 'undefined' ? false : active;
        var service = options.elevationOptions;
        this.options.service = typeof service === 'undefined' || Object.keys(service).length === 0 ? {} : service;
        var profil = options.displayProfileOptions || {};
        if (typeof profil === 'undefined' || Object.keys(profil).length === 0) {
            this.options.profile = {
                apply: ElevationPath.DISPLAY_PROFILE_BY_DEFAULT,
                target: null
            };
        } else {
            this.options.profile = {};
        }
        var displayFunction = profil.apply || this.options.profile.apply;
        this.options.profile.apply = typeof displayFunction === 'function' ? displayFunction : ElevationPath.DISPLAY_PROFILE_BY_DEFAULT;
        var displayContainer = profil.target || this.options.profile.target;
        this.options.profile.target = typeof displayContainer === 'undefined' ? null : displayContainer;
        var styles = options.stylesOptions || {};
        if (typeof styles === 'undefined' || Object.keys(styles).length === 0) {
            this.options.styles = { profile: ElevationPath.DEFAULT_STYLES.PROFILE };
        } else {
            this.options.styles = {};
        }
        this.options.styles.draw = styles.draw || {};
        this._createStylingDraw();
        this.options.styles.marker = styles.marker || {};
        this._createStylingMarker();
        var profile = styles.profile || this.options.styles.profile;
        this.options.styles.profile = typeof profile === 'undefined' || Object.keys(profile).length === 0 ? ElevationPath.DEFAULT_STYLES.PROFILE : profile;
        this._createStylingProfile();
    };
    ElevationPath.prototype._initializeContainer = function () {
        var container = this._createMainContainerElement();
        var inputShow = this._showContainer = this._createShowElevationPathElement();
        container.appendChild(inputShow);
        var picto = this._pictoContainer = this._createShowElevationPathPictoElement();
        container.appendChild(picto);
        if (this.options.active) {
            this._showContainer.checked = true;
        }
        var panel = this._panelContainer = this._createElevationPathPanelElement();
        var header = this._createElevationPathPanelHeaderElement();
        panel.appendChild(header);
        var profile = this._profileContainer = this._createElevationPathPanelProfilElement();
        panel.appendChild(profile);
        var waiting = this._waitingContainer = this._createElevationPathWaitingElement();
        panel.appendChild(waiting);
        if (this.options.profile.target === null) {
            container.appendChild(panel);
        }
        return container;
    };
    ElevationPath.prototype._checkRightsManagement = function () {
        var rightManagement = RightManagement.check({
            key: this.options.apiKey,
            resources: ['SERVICE_CALCUL_ALTIMETRIQUE_RSC'],
            services: ['Elevation']
        });
        if (!rightManagement) {
            this._noRightManagement = true;
        }
        if (!this.options.apiKey) {
            this.options.apiKey = rightManagement.key;
        }
    };
    ElevationPath.prototype._createStylingMarker = function () {
        var marker = ElevationPath.DEFAULT_STYLES.MARKER;
        if (this.options.styles.marker instanceof ol.style.Image) {
            marker = this.options.styles.marker;
        }
        this._markerStyle = new ol.style.Style({ image: marker });
    };
    ElevationPath.prototype._createStylingDraw = function () {
        var styles = this.options.styles.draw;
        var startStyleOpts = {
            image: Measures.DEFAULT_POINTER_STYLE,
            stroke: Measures.DEFAULT_DRAW_START_STYLE.getStroke()
        };
        if (styles.hasOwnProperty('pointer') && styles.pointer instanceof ol.style.Image) {
            startStyleOpts.image = styles.pointer;
        }
        if (styles.hasOwnProperty('start') && styles.start instanceof ol.style.Stroke) {
            startStyleOpts.stroke = styles.start;
        }
        this._drawStyleStart = new ol.style.Style(startStyleOpts);
        var finishStyleOpts = { stroke: Measures.DEFAULT_DRAW_FINISH_STYLE.getStroke() };
        if (styles.hasOwnProperty('finish') && styles.finish instanceof ol.style.Stroke) {
            finishStyleOpts.stroke = styles.finish;
        }
        this._drawStyleFinish = new ol.style.Style(finishStyleOpts);
    };
    ElevationPath.prototype._createStylingProfile = function () {
        var userStyles = this.options.styles.profile;
        var defaultStyle = ElevationPath.DEFAULT_STYLES.PROFILE;
        Object.keys(defaultStyle).forEach(function (key) {
            if (!userStyles.hasOwnProperty(key)) {
                userStyles[key] = defaultStyle[key];
                return;
            } else {
                var _defaultStyle = defaultStyle[key];
                if (typeof _defaultStyle === 'object') {
                    Utils.mergeParams(_defaultStyle, userStyles[key]);
                    userStyles[key] = _defaultStyle;
                    return;
                }
            }
        }, this);
    };
    ElevationPath.prototype._initMeasureInteraction = function (map) {
        if (!map) {
            return;
        }
        this._measureSource = new ol.source.Vector();
        this._measureVector = new ol.layer.Vector({
            source: this._measureSource,
            style: this._drawStyleFinish
        });
        map.addLayer(this._measureVector);
    };
    ElevationPath.prototype._addMeasureInteraction = function (map) {
        if (!map) {
            return;
        }
        this._measureDraw = new ol.interaction.Draw({
            source: this._measureSource,
            type: 'LineString',
            style: this._drawStyleStart
        });
        this._measureDraw.setProperties({
            name: 'ElevationPath',
            source: this
        });
        map.addInteraction(this._measureDraw);
        var self = this;
        this._measureDraw.on('drawstart', function (evt) {
            if (self._marker !== null) {
                self._measureSource.removeFeature(self._marker);
                self._marker = null;
            }
            if (self._lastSketch !== null) {
                self._measureSource.removeFeature(self._lastSketch);
                self._lastSketch = null;
            }
            self._currentSketch = evt.feature;
            var _features = self._measureSource.getFeatures();
            for (var i = 0; i < _features.length; i++) {
                self._measureSource.removeFeature(_features[i]);
            }
        }, this);
        this._measureDraw.on('drawend', function (evt) {
            self._lastSketch = self._currentSketch;
            if (typeof self.options.service.onSuccess === 'undefined' && self.options.profile.target === null) {
                self._panelContainer.style.display = 'block';
            }
            self._requestService();
        }, this);
    };
    ElevationPath.prototype._removeMeasureInteraction = function (map) {
        if (!map) {
            return;
        }
        if (this._measureVector) {
            map.removeLayer(this._measureVector);
            this._measureVector = null;
        }
        if (this._measureDraw) {
            map.removeInteraction(this._measureDraw);
            this._measureDraw = null;
        }
    };
    ElevationPath.prototype._getGeometry = function () {
        if (this._currentSketch === null) {
            return;
        }
        var geometry = [];
        var map = this.getMap();
        var projSrc = map.getView().getProjection();
        var projDest = 'EPSG:4326';
        var coordinates = this._currentSketch.getGeometry().getCoordinates();
        for (var i = 0; i < coordinates.length; i++) {
            var xy = coordinates[i];
            var ll = xy;
            if (projSrc !== projDest) {
                ll = ol.proj.transform(xy, projSrc, projDest);
            }
            geometry.push({
                lon: ll[0],
                lat: ll[1]
            });
        }
        return geometry;
    };
    ElevationPath.prototype._getLength = function () {
        if (this._currentSketch === null) {
            return;
        }
        var length = 0;
        var wgs84Sphere = new ol.Sphere(6378137);
        var map = this.getMap();
        var projSrc = map.getView().getProjection();
        var projDest = 'EPSG:4326';
        var coordinates = this._currentSketch.getGeometry().getCoordinates();
        for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
            var c1 = ol.proj.transform(coordinates[i], projSrc, projDest);
            var c2 = ol.proj.transform(coordinates[i + 1], projSrc, projDest);
            length += wgs84Sphere.haversineDistance(c1, c2);
        }
        return length;
    };
    ElevationPath.prototype._requestService = function () {
        var geometry = this._getGeometry();
        if (!geometry) {
            return;
        }
        if (this._noRightManagement) {
            return;
        }
        var options = {};
        Utils.mergeParams(options, this.options.service);
        Utils.mergeParams(options, { apiKey: this.options.apiKey });
        var self = this;
        var _requestServiceOnSuccess = function (result) {
            if (result) {
                self._panelContainer.style.display = 'block';
                self._displayProfile(result.elevations);
                self._waitingContainer.className = 'GPelevationPathCalcWaitingContainerHidden';
                self._waiting = false;
            }
        };
        var _requestServiceOnFailure = function (error) {
            self._panelContainer.style.display = 'none';
            self._waitingContainer.className = 'GPelevationPathCalcWaitingContainerHidden';
            self._waiting = false;
        };
        Utils.mergeParams(options, {
            onSuccess: this.options.service.onSuccess || _requestServiceOnSuccess,
            onFailure: this.options.service.onFailure || _requestServiceOnFailure
        });
        var sampling = options.sampling;
        if (!sampling) {
            var _sampling = 50;
            var _length = this._getLength();
            var p = Math.floor(_length) / 5;
            if (p >= 200) {
                _sampling = 200;
            } else {
                _sampling = Math.floor(p);
            }
            Utils.mergeParams(options, { sampling: _sampling || 50 });
        }
        Utils.mergeParams(options, { positions: geometry });
        this._waitingContainer.className = 'GPelevationPathCalcWaitingContainerVisible';
        Gp.Services.getAltitude(options);
    };
    ElevationPath.prototype._computeElevationMeasure = function (elevations) {
        var wgs84Sphere = new ol.Sphere(6378137);
        elevations[0].dist = 0;
        var distance = 0;
        for (var i = 1; i < elevations.length; i++) {
            distance += wgs84Sphere.haversineDistance([
                elevations[i].lon,
                elevations[i].lat
            ], [
                elevations[i - 1].lon,
                elevations[i - 1].lat
            ]) / 1000;
            elevations[i].dist = distance;
            elevations[i].lat = Math.round(elevations[i].lat * 10000) / 10000;
            elevations[i].lon = Math.round(elevations[i].lon * 10000) / 10000;
        }
        var coeffArrond = 100;
        if (distance > 100) {
            coeffArrond = 1;
        } else if (distance > 10) {
            coeffArrond = 10;
        }
        for (var j = 0; j < elevations.length; j++) {
            var data = elevations[j];
            if (data.z < 0) {
                data.z = 0;
            }
            data.dist = Math.round(data.dist * coeffArrond) / coeffArrond;
        }
        return elevations;
    };
    ElevationPath.prototype._displayProfile = function (elevations) {
        var data = this._computeElevationMeasure(elevations);
        var container = this.options.profile.target;
        if (container) {
            container.appendChild(this._panelContainer);
        }
        container = this._profileContainer;
        var context = this;
        var displayFunction = this.options.profile.apply;
        displayFunction.call(this, data, container, context);
    };
    ElevationPath.prototype.onShowElevationPathClick = function () {
        var map = this.getMap();
        Interactions.unset(map, { current: 'ElevationPath' });
        if (!this._showContainer.checked) {
            if (this._profile === null) {
                this._panelContainer.style.display = 'none';
            }
            this._initMeasureInteraction(map);
            this._addMeasureInteraction(map);
        } else {
            this._panelContainer.style.display = 'none';
            this._removeMeasure();
            this._removeProfile();
            this._removeMeasureInteraction(map);
        }
    };
    return ElevationPath;
}(ol, {}, gp, Ol3Utils, CommonUtilsCheckRightManagement, Ol3ControlsMeasuresMeasures, Ol3ControlsMeasureToolBox, Ol3ControlsUtilsInteractions, CommonControlsElevationPathDOM, CommonUtilsSelectorID);
CommonControlsMeasureLengthDOM = function () {
    var MeasureLengthDOM = {
        _addUID: function (id) {
            var uid = this._uid ? id + '-' + this._uid : id;
            return uid;
        },
        _createMainContainerElement: function () {
            var container = document.createElement('div');
            container.id = this._addUID('GPmeasureLength');
            container.className = 'GPwidget';
            return container;
        },
        _createShowMeasureLengthElement: function () {
            var input = document.createElement('input');
            input.id = this._addUID('GPshowMeasureLength');
            input.type = 'checkbox';
            return input;
        },
        _createShowMeasureLengthPictoElement: function () {
            var context = this;
            var label = document.createElement('label');
            label.id = this._addUID('GPshowMeasureLengthPicto');
            label.className = 'GPshowAdvancedToolPicto';
            label.htmlFor = this._addUID('GPshowMeasureLength');
            label.title = 'Mesurer une distance';
            if (label.addEventListener) {
                label.addEventListener('click', function (e) {
                    context.onShowMeasureLengthClick(e);
                });
            } else if (label.attachEvent) {
                label.attachEvent('onclick', function (e) {
                    context.onShowMeasureLengthClick(e);
                });
            }
            var spanOpen = document.createElement('span');
            spanOpen.id = this._addUID('GPshowMeasureLengthOpen');
            spanOpen.className = 'GPshowAdvancedToolOpen';
            label.appendChild(spanOpen);
            return label;
        }
    };
    return MeasureLengthDOM;
}();
Ol3ControlsMeasuresMeasureLength = function (ol, woodman, Utils, MeasureToolBox, Measures, MeasureLengthDOM, ID) {
    function MeasureLength(options) {
        options = options || {};
        if (!(this instanceof MeasureLength)) {
            throw new TypeError('ERROR CLASS_CONSTRUCTOR');
        }
        this.CLASSNAME = 'MeasureLength';
        this._uid = ID.generate();
        this._showContainer = null;
        this._pictoContainer = null;
        this._initialize(options);
        var container = options.element ? options.element : this._initializeContainer();
        ol.control.Control.call(this, {
            element: container,
            target: options.target,
            render: options.render
        });
    }
    ol.inherits(MeasureLength, ol.control.Control);
    MeasureLength.prototype = Object.create(ol.control.Control.prototype, {});
    Utils.assign(MeasureLength.prototype, Measures);
    Utils.assign(MeasureLength.prototype, MeasureLengthDOM);
    MeasureLength.prototype.constructor = MeasureLength;
    MeasureLength.prototype.setMap = function (map) {
        var className = this.CLASSNAME;
        if (map) {
            if (!this.options.target) {
                MeasureToolBox.add(map, this);
            }
        } else {
            this.clean();
        }
        this.tools[className].instance = map ? this : null;
        ol.control.Control.prototype.setMap.call(this, map);
    };
    MeasureLength.prototype._initialize = function (options) {
        this.options = {};
        this.options.geodesic = typeof options.geodesic !== 'undefined' ? options.geodesic : true;
        this.options.target = typeof options.target !== 'undefined' ? options.target : null;
        this.options.render = typeof options.render !== 'undefined' ? options.render : null;
        this.createStylingMeasureInteraction(options.styles);
    };
    MeasureLength.prototype._initializeContainer = function () {
        var container = this._createMainContainerElement();
        var show = this._showContainer = this._createShowMeasureLengthElement();
        container.appendChild(show);
        this._showContainer.checked = false;
        var picto = this._pictoContainer = this._createShowMeasureLengthPictoElement();
        container.appendChild(picto);
        return container;
    };
    MeasureLength.prototype.addMeasureEvents = function () {
        var map = this.getMap();
        map.on('singleclick', this.onPointerMoveHandler, this);
        map.on('pointermove', this.onPointerMoveHandler, this);
    };
    MeasureLength.prototype.removeMeasureEvents = function () {
        var map = this.getMap();
        map.un('singleclick', this.onPointerMoveHandler, this);
        map.un('pointermove', this.onPointerMoveHandler, this);
    };
    MeasureLength.prototype.format = function (line) {
        var map = this.getMap();
        var measure;
        if (this.options.geodesic) {
            var wgs84Sphere = new ol.Sphere(6378137);
            var coordinates = line.getCoordinates();
            measure = 0;
            var sourceProj = map.getView().getProjection();
            for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
                var c1 = ol.proj.transform(coordinates[i], sourceProj, 'EPSG:4326');
                var c2 = ol.proj.transform(coordinates[i + 1], sourceProj, 'EPSG:4326');
                measure += wgs84Sphere.haversineDistance(c1, c2);
            }
        } else {
            measure = Math.round(line.getLength() * 100) / 100;
        }
        var output;
        if (measure > 1000) {
            output = Math.round(measure / 1000 * 100) / 100 + ' ' + 'km';
        } else {
            output = Math.round(measure * 100) / 100 + ' ' + 'm';
        }
        return output;
    };
    MeasureLength.prototype.onShowMeasureLengthClick = function (e) {
        this.onShowMeasureClick(e, 'LineString');
    };
    return MeasureLength;
}(ol, {}, Ol3Utils, Ol3ControlsMeasureToolBox, Ol3ControlsMeasuresMeasures, CommonControlsMeasureLengthDOM, CommonUtilsSelectorID);
CommonControlsMeasureAreaDOM = function () {
    var MeasureAreaDOM = {
        _addUID: function (id) {
            var uid = this._uid ? id + '-' + this._uid : id;
            return uid;
        },
        _createMainContainerElement: function () {
            var container = document.createElement('div');
            container.id = this._addUID('GPmeasureArea');
            container.className = 'GPwidget';
            return container;
        },
        _createShowMeasureAreaElement: function () {
            var input = document.createElement('input');
            input.id = this._addUID('GPshowMeasureArea');
            input.type = 'checkbox';
            return input;
        },
        _createShowMeasureAreaPictoElement: function () {
            var context = this;
            var label = document.createElement('label');
            label.id = this._addUID('GPshowMeasureAreaPicto');
            label.className = 'GPshowAdvancedToolPicto';
            label.htmlFor = this._addUID('GPshowMeasureArea');
            label.title = 'Mesurer une surface';
            if (label.addEventListener) {
                label.addEventListener('click', function (e) {
                    context.onShowMeasureAreaClick(e);
                });
            } else if (label.attachEvent) {
                label.attachEvent('onclick', function (e) {
                    context.onShowMeasureAreaClick(e);
                });
            }
            var spanOpen = document.createElement('span');
            spanOpen.id = this._addUID('GPshowMeasureAreaOpen');
            spanOpen.className = 'GPshowAdvancedToolOpen';
            label.appendChild(spanOpen);
            return label;
        }
    };
    return MeasureAreaDOM;
}();
Ol3ControlsMeasuresMeasureArea = function (ol, woodman, Utils, MeasureToolBox, Measures, MeasureAreaDOM, ID) {
    function MeasureArea(options) {
        options = options || {};
        if (!(this instanceof MeasureArea)) {
            throw new TypeError('ERROR CLASS_CONSTRUCTOR');
        }
        this.CLASSNAME = 'MeasureArea';
        this._uid = ID.generate();
        this._showContainer = null;
        this._pictoContainer = null;
        this._initialize(options);
        var container = options.element ? options.element : this._initializeContainer();
        ol.control.Control.call(this, {
            element: container,
            target: options.target,
            render: options.render
        });
    }
    ol.inherits(MeasureArea, ol.control.Control);
    MeasureArea.prototype = Object.create(ol.control.Control.prototype, {});
    Utils.assign(MeasureArea.prototype, Measures);
    Utils.assign(MeasureArea.prototype, MeasureAreaDOM);
    MeasureArea.prototype.constructor = MeasureArea;
    MeasureArea.prototype.setMap = function (map) {
        var className = this.CLASSNAME;
        if (map) {
            if (!this.options.target) {
                MeasureToolBox.add(map, this);
            }
        } else {
            this.clean();
        }
        this.tools[className].instance = map ? this : null;
        ol.control.Control.prototype.setMap.call(this, map);
    };
    MeasureArea.prototype._initialize = function (options) {
        this.options = {};
        this.options.geodesic = typeof options.geodesic !== 'undefined' ? options.geodesic : true;
        this.options.target = typeof options.target !== 'undefined' ? options.target : null;
        this.options.render = typeof options.render !== 'undefined' ? options.render : null;
        this.createStylingMeasureInteraction(options.styles);
    };
    MeasureArea.prototype._initializeContainer = function () {
        var container = this._createMainContainerElement();
        var show = this._showContainer = this._createShowMeasureAreaElement();
        container.appendChild(show);
        this._showContainer.checked = false;
        var picto = this._pictoContainer = this._createShowMeasureAreaPictoElement();
        container.appendChild(picto);
        return container;
    };
    MeasureArea.prototype.addMeasureEvents = function () {
        var map = this.getMap();
        map.on('singleclick', this.onPointerMoveHandler, this);
        map.on('pointermove', this.onPointerMoveHandler, this);
    };
    MeasureArea.prototype.removeMeasureEvents = function () {
        var map = this.getMap();
        map.un('singleclick', this.onPointerMoveHandler, this);
        map.un('pointermove', this.onPointerMoveHandler, this);
    };
    MeasureArea.prototype.format = function (polygon) {
        var map = this.getMap();
        var measure;
        if (this.options.geodesic) {
            var wgs84Sphere = new ol.Sphere(6378137);
            var sourceProj = map.getView().getProjection();
            var geom = polygon.clone().transform(sourceProj, 'EPSG:4326');
            var coordinates = geom.getLinearRing(0).getCoordinates();
            measure = Math.abs(wgs84Sphere.geodesicArea(coordinates));
        } else {
            measure = polygon.getArea();
        }
        var output;
        if (measure > 1000000) {
            output = Math.round(measure / 1000000 * 100) / 100 + ' ' + 'km<sup>2</sup>';
        } else if (measure > 100000) {
            output = Math.round(measure / 1000000 * 1000) / 1000 + ' ' + 'km<sup>2</sup>';
        } else if (measure > 1000) {
            output = Math.round(measure / 10) * 10 + ' ' + 'm<sup>2</sup>';
        } else {
            output = Math.round(measure * 100) / 100 + ' ' + 'm<sup>2</sup>';
        }
        return output;
    };
    MeasureArea.prototype.onShowMeasureAreaClick = function (e) {
        this.onShowMeasureClick(e, 'Polygon');
    };
    return MeasureArea;
}(ol, {}, Ol3Utils, Ol3ControlsMeasureToolBox, Ol3ControlsMeasuresMeasures, CommonControlsMeasureAreaDOM, CommonUtilsSelectorID);
CommonControlsMeasureAzimuthDOM = function () {
    var MeasureAzimuthDOM = {
        _addUID: function (id) {
            var uid = this._uid ? id + '-' + this._uid : id;
            return uid;
        },
        _createMainContainerElement: function () {
            var container = document.createElement('div');
            container.id = this._addUID('GPmeasureAzimuth');
            container.className = 'GPwidget';
            return container;
        },
        _createShowMeasureAzimuthElement: function () {
            var input = document.createElement('input');
            input.id = this._addUID('GPshowMeasureAzimuth');
            input.type = 'checkbox';
            return input;
        },
        _createShowMeasureAzimuthPictoElement: function () {
            var context = this;
            var label = document.createElement('label');
            label.id = this._addUID('GPshowMeasureAzimuthPicto');
            label.className = 'GPshowAdvancedToolPicto';
            label.htmlFor = this._addUID('GPshowMeasureAzimuth');
            label.title = 'Mesurer un azimut';
            if (label.addEventListener) {
                label.addEventListener('click', function (e) {
                    context.onShowMeasureAzimuthClick(e);
                });
            } else if (label.attachEvent) {
                label.attachEvent('onclick', function (e) {
                    context.onShowMeasureAzimuthClick(e);
                });
            }
            var spanOpen = document.createElement('span');
            spanOpen.id = this._addUID('GPshowMeasureAzimuthOpen');
            spanOpen.className = 'GPshowAdvancedToolOpen';
            label.appendChild(spanOpen);
            return label;
        }
    };
    return MeasureAzimuthDOM;
}();
Ol3ControlsMeasuresMeasureAzimuth = function (ol, woodman, Utils, MeasureToolBox, Measures, MeasureAzimuthDOM, ID) {
    function MeasureAzimuth(options) {
        options = options || {};
        if (!(this instanceof MeasureAzimuth)) {
            throw new TypeError('ERROR CLASS_CONSTRUCTOR');
        }
        this.CLASSNAME = 'MeasureAzimuth';
        this._uid = ID.generate();
        this._showContainer = null;
        this._pictoContainer = null;
        this._initialize(options);
        var container = options.element ? options.element : this._initializeContainer();
        ol.control.Control.call(this, {
            element: container,
            target: options.target,
            render: options.render
        });
    }
    ol.inherits(MeasureAzimuth, ol.control.Control);
    MeasureAzimuth.prototype = Object.create(ol.control.Control.prototype, {});
    Utils.assign(MeasureAzimuth.prototype, Measures);
    Utils.assign(MeasureAzimuth.prototype, MeasureAzimuthDOM);
    MeasureAzimuth.prototype.constructor = MeasureAzimuth;
    MeasureAzimuth.prototype.setMap = function (map) {
        var className = this.CLASSNAME;
        if (map) {
            if (!this.options.target) {
                MeasureToolBox.add(map, this);
            }
        } else {
            this.clean();
        }
        this.tools[className].instance = map ? this : null;
        ol.control.Control.prototype.setMap.call(this, map);
    };
    MeasureAzimuth.prototype._initialize = function (options) {
        this.options = {};
        this.options.target = typeof options.target !== 'undefined' ? options.target : null;
        this.options.render = typeof options.render !== 'undefined' ? options.render : null;
        this.createStylingMeasureInteraction(options.styles);
    };
    MeasureAzimuth.prototype._initializeContainer = function () {
        var container = this._createMainContainerElement();
        var show = this._showContainer = this._createShowMeasureAzimuthElement();
        container.appendChild(show);
        this._showContainer.checked = false;
        var picto = this._pictoContainer = this._createShowMeasureAzimuthPictoElement();
        container.appendChild(picto);
        return container;
    };
    MeasureAzimuth.prototype.addMeasureEvents = function () {
        var map = this.getMap();
        map.on('singleclick', this.onPointerMoveAzimutHandler, this);
        map.on('pointermove', this.onPointerMoveAzimutHandler, this);
    };
    MeasureAzimuth.prototype.removeMeasureEvents = function () {
        var map = this.getMap();
        map.un('singleclick', this.onPointerMoveAzimutHandler, this);
        map.un('pointermove', this.onPointerMoveAzimutHandler, this);
    };
    MeasureAzimuth.prototype.format = function (line) {
        var map = this.getMap();
        var sourceProj = map.getView().getProjection();
        var c1 = ol.proj.transform(line.getFirstCoordinate(), sourceProj, 'EPSG:4326');
        var c2 = ol.proj.transform(line.getCoordinateAt(0.001), sourceProj, 'EPSG:4326');
        var degrees2radians = Math.PI / 180;
        var radians2degrees = 180 / Math.PI;
        var lon1 = degrees2radians * c1[0];
        var lon2 = degrees2radians * c2[0];
        var lat1 = degrees2radians * c1[1];
        var lat2 = degrees2radians * c2[1];
        var a = Math.sin(lon2 - lon1) * Math.cos(lat2);
        var b = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
        var atan = Math.atan2(a, b);
        var azimut = radians2degrees * atan;
        if (azimut < 0) {
            azimut += 360;
        }
        var output = Math.round(azimut * 100) / 100 + ' \xB0';
        return output;
    };
    MeasureAzimuth.prototype.onShowMeasureAzimuthClick = function (e) {
        this.onShowMeasureClick(e, 'LineString');
    };
    MeasureAzimuth.prototype.onPointerMoveAzimutHandler = function (e) {
        this.onPointerMoveHandler(e);
        if (this.sketch) {
            var geom = this.sketch.getGeometry();
            if (geom.getCoordinates().length > 2) {
                this.measureDraw.finishDrawing();
            }
        }
    };
    return MeasureAzimuth;
}(ol, {}, Ol3Utils, Ol3ControlsMeasureToolBox, Ol3ControlsMeasuresMeasures, CommonControlsMeasureAzimuthDOM, CommonUtilsSelectorID);
Ol3GpPluginOl3 = function (ol, Gp, LayerUtils, Register, Utils, KML, CRS, SourceWMTS, SourceWMS, LayerWMTS, LayerWMS, LayerSwitcher, SearchEngine, MousePosition, Drawing, Route, Isocurve, ReverseGeocode, LayerImport, GeoportalAttribution, Markers, ElevationPath, MeasureLength, MeasureArea, MeasureAzimuth) {
    Gp.ol3extVersion = '0.12.0-dev';
    Gp.ol3extDate = '2017-04-06';
    Gp.olUtils = Utils;
    Gp.LayerUtils = LayerUtils;
    ol.format.KMLExtended = KML;
    CRS.overload();
    ol.source.GeoportalWMTS = SourceWMTS;
    ol.source.GeoportalWMS = SourceWMS;
    ol.layer.GeoportalWMTS = LayerWMTS;
    ol.layer.GeoportalWMS = LayerWMS;
    ol.control.GeoportalAttribution = GeoportalAttribution;
    ol.control.LayerSwitcher = LayerSwitcher;
    ol.control.SearchEngine = SearchEngine;
    ol.control.Route = Route;
    ol.control.Isocurve = Isocurve;
    ol.control.GeoportalMousePosition = MousePosition;
    ol.control.Drawing = Drawing;
    ol.control.ReverseGeocode = ReverseGeocode;
    ol.control.LayerImport = LayerImport;
    ol.control.MeasureLength = MeasureLength;
    ol.control.MeasureArea = MeasureArea;
    ol.control.MeasureAzimuth = MeasureAzimuth;
    ol.control.DefaultMarkers = Markers;
    ol.control.ElevationPath = ElevationPath;
    return Gp;
}(ol, gp, CommonUtilsLayerUtils, CommonUtilsRegister, Ol3Utils, Ol3FormatsKML, Ol3CRSCRS, Ol3LayersSourceWMTS, Ol3LayersSourceWMS, Ol3LayersLayerWMTS, Ol3LayersLayerWMS, Ol3ControlsLayerSwitcher, Ol3ControlsSearchEngine, Ol3ControlsMousePosition, Ol3ControlsDrawing, Ol3ControlsRoute, Ol3ControlsIsocurve, Ol3ControlsReverseGeocode, Ol3ControlsLayerImport, Ol3ControlsGeoportalAttribution, Ol3ControlsUtilsMarkers, Ol3ControlsElevationPath, Ol3ControlsMeasuresMeasureLength, Ol3ControlsMeasuresMeasureArea, Ol3ControlsMeasuresMeasureAzimuth);
VgControlsLayerSwitcher = function (LayerSwitcherDOM, LayerUtils, SelectorID) {
    function LayerSwitcher(lsOptions) {
        lsOptions = lsOptions || {};
        var options = lsOptions.options || {};
        var layers = lsOptions.layers || [];
        if (!(this instanceof LayerSwitcher)) {
            throw new TypeError('ERROR CLASS_CONSTRUCTOR');
        }
        if (layers && !Array.isArray(layers)) {
            throw new Error('ERROR WRONG_TYPE : layers should be an object');
        }
        if (options && typeof options !== 'object') {
            throw new Error('ERROR WRONG_TYPE : options should be an object');
        }
        this._uid = SelectorID.generate();
        var container = this._initContainer(options);
        this._layers = {};
        this._layersOrder = [];
        this._lastZIndexRaster = -1;
        this._lastZIndexFeature = -1;
        this._layerId = 0;
        this._container = container;
        this._initLayers = layers;
        this._addedLayerConf = {};
        this._callbacks = {};
        this._options = options;
        var LStarget = document.getElementById(options.div);
        VirtualGeo.Control.call(this, container, LStarget);
        this.setOptions({ name: 'LayerSwitcher' });
        var VGsetMap = this._setMap;
        this._setMap = function (map, mapDiv, f) {
            if (map) {
                if (!map.mapDiv) {
                    map.mapDiv = mapDiv;
                }
                for (var i = 0; i < this._initLayers.length; i++) {
                    var layer;
                    if (layers[i].layer) {
                        layer = map.getLayer(layers[i].layer.id);
                    }
                    if (layer !== undefined) {
                        var conf = layers[i].config || {};
                        var layerOptions = {
                            id: layer.id,
                            ipr: layer.ipr || null,
                            type: layer.type || null,
                            opacity: layer.opacity || 1,
                            visibility: layer.visible || true,
                            title: conf.title || layer.title,
                            description: conf.description || null,
                            legends: conf.legends || [],
                            metadata: conf.metadata || [],
                            quicklookUrl: conf.quicklookUrl || null
                        };
                        this._layers[layer.id] = layerOptions;
                    }
                }
                var self = this;
                this._addMapLayers(map);
                this._callbacks.onChangedCenterCallBack = function (center) {
                    self._onMapMoveEnd.call(self, map);
                };
                map.addEventListener('centerchanged', self._callbacks.onChangedCenterCallBack, self);
                this._callbacks.onAddedLayerCallBack = function (addedLayer) {
                    if (addedLayer.type !== 'elevation') {
                        var layer = addedLayer;
                        var id = layer.id;
                        if (self) {
                            if (self._addedLayerConf[id]) {
                                var conf = self._addedLayerConf[id];
                                self.addLayer(layer, conf);
                            } else {
                                self.addLayer(layer);
                            }
                        }
                    }
                };
                map.addEventListener('layeradded', this._callbacks.onAddedLayerCallBack, self);
                this._callbacks.onRemovedLayerCallBack = function (removedLayer) {
                    if (removedLayer.type !== 'elevation') {
                        var layer = removedLayer;
                        var id = layer.id;
                        for (var i = 0; i < self._layersOrder.length; i++) {
                            if (self._layersOrder[i].id == removedLayer.id) {
                                self._layersOrder.splice(i, 1);
                            }
                        }
                        if (self && self._layers[id]) {
                            self.removeLayer(layer);
                            if (layer.type === 'feature') {
                                self._lastZIndexFeature--;
                            } else if (layer.type === 'raster') {
                                self._lastZIndexRaster--;
                            }
                        }
                    }
                };
                map.addEventListener('layerremoved', this._callbacks.onRemovedLayerCallBack, self);
                this._callbacks.onOpacityLayerCallBack = function (changedLayer) {
                    if (changedLayer.type !== 'elevation') {
                        self._updateLayerOpacity(changedLayer);
                    }
                };
                map.addEventListener('layerchanged:opacity', this._callbacks.onOpacityLayerCallBack, self);
                this._callbacks.onVisibilityLayerCallBack = function (changedLayer) {
                    if (changedLayer.type !== 'elevation') {
                        self._updateLayerVisibility(changedLayer);
                    }
                };
                map.addEventListener('layerchanged:visible', this._callbacks.onVisibilityLayerCallBack, self);
                this._callbacks.onIndexLayerCallBack = function () {
                    if (self._layerListContainer) {
                        while (self._layerListContainer.firstChild) {
                            self._layerListContainer.removeChild(self._layerListContainer.firstChild);
                        }
                        self._layersOrder = getOrderedLayers(map);
                        for (var j = 0; j < self._layersOrder.length; j++) {
                            var layerDiv = self._layers[self._layersOrder[j].id].div;
                            self._layerListContainer.appendChild(layerDiv);
                        }
                    } else {
                        console.log('[VG.control.LayerSwitcher] _updateLayersOrder : layer list container not found to update layers order ?!');
                    }
                };
                map.addEventListener('layerchanged:index', this._callbacks.onIndexLayerCallBack, self);
                this._map = map;
            }
            VGsetMap.call(this, map, mapDiv, f);
            if (map == null) {
                this._map.removeEventListener('centerchanged', this._callbacks.onChangedCenterCallBack);
                this._map.removeEventListener('layeradded', this._callbacks.onAddedLayerCallBack);
                this._map.removeEventListener('layerremoved', this._callbacks.onRemovedLayerCallBack);
                this._map.removeEventListener('layerchanged:opacity', this._callbacks.onOpacityLayerCallBack);
                this._map.removeEventListener('layerchanged:visible', this._callbacks.onVisibilityLayerCallBack);
                this._map.removeEventListener('layerchanged:index', this._callbacks.onIndexLayerCallBack);
                return;
            }
            this._onMapMoveEnd(map);
            this._updateLayersIndex();
        };
    }
    VirtualGeo.Utils.inherits(LayerSwitcher, VirtualGeo.Control);
    LayerSwitcher.prototype = Object.create(VirtualGeo.Control.prototype, {});
    LayerSwitcher.prototype.assign = function (source) {
        for (var prop in source) {
            if (source.hasOwnProperty(prop)) {
                this[prop] = source[prop];
            }
        }
    };
    LayerSwitcher.prototype.assign(LayerSwitcherDOM);
    LayerSwitcher.prototype.constructor = LayerSwitcher;
    LayerSwitcher.prototype.addLayer = function (layer, config) {
        config = config || {};
        var map = this.getMap();
        if (!layer) {
            console.log('[ERROR] LayerSwitcher:addLayer - missing layer parameter');
            return;
        }
        var id = layer.id;
        if (id === 'undefined') {
            console.log('[ERROR] LayerSwitcher:addLayer - configuration cannot be set for ' + layer + ' layer (layer id not found)');
            return;
        }
        var isLayerInMap = false;
        if (map.getLayer(id)) {
            isLayerInMap = true;
        }
        if (!isLayerInMap) {
            console.log('[ERROR] LayerSwitcher:addLayer - configuration cannot be set for ', layer, ' layer (layer is not in map.getLayers() )');
            return;
        }
        if (!this._layers[id]) {
            var layerInfos = getLayerInfo(layer) || {};
            var layerOptions = {
                id: id,
                ipr: layer.ipr || null,
                type: layer.type || null,
                inRange: isInRange(layer, map) || true,
                opacity: layer.opacity || 1,
                visibility: layer.visible || true,
                title: config.title || layerInfos._title || id,
                description: config.description || layerInfos._description || null,
                legends: config.legends || layerInfos._legends || [],
                metadata: config.metadata || layerInfos._metadata || [],
                quicklookUrl: config.quicklookUrl || layerInfos._quicklookUrl || null
            };
            this._layers[id] = layerOptions;
            var layerDiv = this._createLayerDiv(layerOptions);
            this._layers[id].div = layerDiv;
            this._callbacks.onIndexLayerCallBack();
            if (layer.type === 'feature') {
                this._lastZIndexFeature++;
                map.moveLayerToIndex({
                    id: layer.id,
                    index: this._lastZIndexFeature
                });
            } else if (layer.type === 'raster') {
                this._lastZIndexRaster++;
                map.moveLayerToIndex({
                    id: layer.id,
                    index: this._lastZIndexRaster
                });
            }
        } else if (this._layers[id] && config) {
            for (var prop in config) {
                if (config.hasOwnProperty(prop)) {
                    this._layers[id][prop] = config[prop];
                }
            }
            if (config.title) {
                var nameDiv = document.getElementById(this._addUID('GPname_ID_' + id));
                if (nameDiv) {
                    nameDiv.innerHTML = config.title;
                }
            }
            var infodiv = document.getElementById(this._addUID('GPinfo_ID_' + id));
            if (!document.getElementById(this._addUID('GPinfo_ID_' + id)) && config.description && (config.legends || config.metadata || config.quicklookUrl)) {
                var advancedTools = document.getElementById(this._addUID('GPadvancedTools_ID_' + id));
                if (advancedTools) {
                    advancedTools.appendChild(this._createAdvancedToolInformationElement({ id: id }));
                }
            }
            if (infodiv && infodiv.className === 'GPlayerInfoOpened') {
                document.getElementById(this._addUID('GPlayerInfoPanel')).className = 'GPlayerInfoPanelClosed';
                infodiv.className === 'GPlayerInfo';
            }
        }
    };
    LayerSwitcher.prototype.removeLayer = function (layer) {
        var layerID = layer.id;
        var layerList = document.getElementById(this._addUID('GPlayersList'));
        var infodiv = document.getElementById(this._addUID('GPinfo_ID_' + layerID));
        if (infodiv && infodiv.className === 'GPlayerInfoOpened') {
            document.getElementById(this._addUID('GPlayerInfoPanel')).className = 'GPlayerInfoPanelClosed';
            infodiv.className === 'GPlayerInfo';
        }
        var layerDiv = document.getElementById(this._addUID('GPlayerSwitcher_ID_' + layerID));
        layerList.removeChild(layerDiv);
        delete this._layers[layerID];
    };
    LayerSwitcher.prototype._initContainer = function (options) {
        var container = this._createMainContainerElement();
        var input = this._createMainLayersShowElement();
        container.appendChild(input);
        if (!options.collapsed) {
            input.checked = 'checked';
        }
        var divL = this._layerListContainer = this._createMainLayersElement();
        container.appendChild(divL);
        this._createDraggableElement(divL, this);
        var picto = this._createMainPictoElement();
        container.appendChild(picto);
        var divI = this._createMainInfoElement();
        container.appendChild(divI);
        return container;
    };
    LayerSwitcher.prototype._addMapLayers = function (map) {
        var elementLayersList;
        var childNodes = this._container.childNodes;
        for (var i = 0; i < childNodes.length; i++) {
            if (childNodes[i].id === this._addUID('GPlayersList')) {
                elementLayersList = childNodes[i];
            }
        }
        this._layersOrder = getOrderedLayers(map);
        this._layersOrder.forEach(function (layer) {
            if (layer.type !== 'elevation') {
                var id;
                id = layer.id;
                var layerInfos = getLayerInfo(layer) || {};
                if (!this._layers[id]) {
                    var layerOptions = {
                        id: layer.id,
                        ipr: layer.ipr || null,
                        opacity: layer.opacity || 1,
                        visibility: layer.visible || true,
                        type: layer.type || null,
                        inRange: isInRange(layer, map) || true,
                        title: layerInfos._title || id,
                        description: layerInfos._description || null,
                        legends: layerInfos._legends || [],
                        metadata: layerInfos._metadata || [],
                        quicklookUrl: layerInfos._quicklookUrl || null
                    };
                    this._layers[id] = layerOptions;
                } else {
                    this._layers[id].opacity = layer.opacity;
                    this._layers[id].visibility = layer.visible;
                    this._layers[id].inRange = isInRange(layer, map);
                }
                if (layer.type === 'feature') {
                    this._lastZIndexFeature++;
                } else if (layer.type === 'raster') {
                    this._lastZIndexRaster++;
                }
            }
        }, this);
        for (var i = 0; i < this._layersOrder.length; i++) {
            if (this._layersOrder[i].type !== 'elevation') {
                var layerDiv = this._createLayerDiv(this._layers[this._layersOrder[i].id]);
                this._layers[this._layersOrder[i].id].div = layerDiv;
                elementLayersList.appendChild(layerDiv);
            }
        }
    };
    LayerSwitcher.prototype._createLayerDiv = function (layerOptions) {
        var isLegends = layerOptions.legends && layerOptions.legends.length !== 0;
        var isMetadata = layerOptions.metadata && layerOptions.metadata.length !== 0;
        var isQuicklookUrl = layerOptions.quicklookUrl;
        if (isLegends || isMetadata || isQuicklookUrl) {
            layerOptions.displayInformationElement = true;
        }
        var layerDiv = this._createContainerLayerElement(layerOptions);
        if (!layerOptions.inRange) {
            layerDiv.classList.add('outOfRange');
        }
        return layerDiv;
    };
    LayerSwitcher.prototype._onChangeLayerOpacity = function (e) {
        var map = this.getMap();
        var divId = e.target.id;
        var divName = SelectorID.name(divId);
        var layerID = divName.substring(divName.indexOf('_ID_') + 4);
        var opacityValue = e.target.value;
        var opacityId = document.getElementById(this._addUID('GPopacityValue_ID_' + layerID));
        opacityId.innerHTML = opacityValue + '%';
        map.setLayerOpacity({
            id: layerID,
            opacity: opacityValue / 100
        });
    };
    LayerSwitcher.prototype._updateLayerOpacity = function (changedLayer) {
        var opacity = changedLayer.opacity;
        if (opacity > 1) {
            opacity = 1;
        }
        if (opacity < 0) {
            opacity = 0;
        }
        var id = changedLayer.id;
        var layerOpacityInput = document.getElementById(this._addUID('GPopacityValueDiv_ID_' + id));
        layerOpacityInput.value = Math.round(opacity * 100);
        var layerOpacitySpan = document.getElementById(this._addUID('GPopacityValue_ID_' + id));
        layerOpacitySpan.innerHTML = Math.round(opacity * 100) + '%';
    };
    LayerSwitcher.prototype._onVisibilityLayerClick = function (e) {
        var map = this.getMap();
        var divId = e.target.id;
        var divName = SelectorID.name(divId);
        var layerID = divName.substring(divName.indexOf('_ID_') + 4);
        map.setLayerVisible({
            id: layerID,
            visible: e.target.checked
        });
    };
    LayerSwitcher.prototype._updateLayerVisibility = function (changedLayer) {
        var id = changedLayer.id;
        var visible = changedLayer.visible;
        var layerVisibilityInput = document.getElementById(this._addUID('GPvisibility_ID_' + id));
        layerVisibilityInput.checked = visible;
    };
    LayerSwitcher.prototype._onOpenLayerInfoClick = function (e) {
        var divId = e.target.id;
        var divName = SelectorID.name(divId);
        var layerID = divName.substring(divName.indexOf('_ID_') + 4);
        var layerOptions = this._layers[layerID];
        var panel;
        var info;
        divId = document.getElementById(e.target.id);
        if (divId.className === 'GPlayerInfoOpened') {
            if (divId.classList !== undefined) {
                divId.classList.remove('GPlayerInfoOpened');
                divId.classList.add('GPlayerInfo');
            }
            panel = document.getElementById(this._addUID('GPlayerInfoPanel'));
            if (panel.classList !== undefined) {
                panel.classList.remove('GPpanel');
                panel.classList.remove('GPlayerInfoPanelOpened');
                panel.classList.add('GPlayerInfoPanelClosed');
            }
            info = document.getElementById(this._addUID('GPlayerInfoContent'));
            panel.removeChild(info);
            return;
        }
        var layers = document.getElementsByClassName('GPlayerInfoOpened');
        for (var i = 0; i < layers.length; i++) {
            layers[i].className = 'GPlayerInfo';
        }
        if (divId.classList !== undefined) {
            divId.classList.remove('GPlayerInfo');
            divId.classList.add('GPlayerInfoOpened');
        }
        panel = document.getElementById(this._addUID('GPlayerInfoPanel'));
        if (panel.classList !== undefined) {
            panel.classList.add('GPpanel');
            panel.classList.remove('GPlayerInfoPanelClosed');
            panel.classList.add('GPlayerInfoPanelOpened');
        }
        info = document.getElementById(this._addUID('GPlayerInfoContent'));
        if (info) {
            panel.removeChild(info);
        }
        var obj = {
            title: layerOptions.title,
            description: layerOptions.description,
            quicklookUrl: layerOptions.quicklookUrl,
            metadata: layerOptions.metadata,
            legends: layerOptions.legends
        };
        var infoLayer = this._createContainerLayerInfoElement(obj);
        panel.appendChild(infoLayer);
    };
    LayerSwitcher.prototype._onDropLayerClick = function (e) {
        var map = this.getMap();
        var divId = e.target.id;
        var divName = SelectorID.name(divId);
        var layerID = divName.substring(divName.indexOf('_ID_') + 4);
        map.removeLayer({ id: layerID });
        this._updateLayersIndex();
    };
    LayerSwitcher.prototype._onDragAndDropLayerClick = function () {
        this._updateLayersIndex();
        var map = this.getMap();
        this._layersOrder = getOrderedLayers(map);
        this._callbacks.onIndexLayerCallBack();
    };
    LayerSwitcher.prototype._updateLayersIndex = function () {
        var map = this.getMap();
        var rasterLayerCount = map.getLayers({ type: 'raster' }).length;
        var featureLayerCount = map.getLayers({ type: 'feature' }).length;
        var matchesLayers = document.querySelectorAll('div.GPlayerSwitcher_layer');
        var newIndex;
        for (var i = 0; i < matchesLayers.length; i++) {
            var tag = matchesLayers[i].id;
            var name = SelectorID.name(tag);
            var id = name.substring(name.indexOf('_ID_') + 4);
            var layer = map.getLayer(id);
            if (layer.type === 'raster') {
                rasterLayerCount = rasterLayerCount - 1;
                newIndex = rasterLayerCount;
            }
            if (layer.type === 'feature') {
                featureLayerCount = featureLayerCount - 1;
                newIndex = featureLayerCount;
            }
            map.moveLayerToIndex({
                id: id,
                index: newIndex
            });
        }
    };
    LayerSwitcher.prototype._onMapMoveEnd = function (map) {
        map.getLayers().forEach(function (layer) {
            var id = layer.id;
            if (this._layers[id]) {
                var layerOptions = this._layers[id];
                var layerDiv;
                if (isInRange(layer, map) && !layerOptions.inRange) {
                    layerOptions.inRange = true;
                    layerDiv = document.getElementById(this._addUID('GPlayerSwitcher_ID_' + id));
                    layerDiv.classList.remove('outOfRange');
                } else if (!isInRange(layer, map) && layerOptions.inRange) {
                    layerOptions.inRange = false;
                    layerDiv = document.getElementById(this._addUID('GPlayerSwitcher_ID_' + id));
                    layerDiv.classList.add('outOfRange');
                }
            }
        }, this);
    };
    function isInRange(layer, map) {
        if (!map) {
            return;
        }
        var mapResolution = map.getZoomScale();
        if ((layer.maxScaleDenominator !== 0 || layer.minScaleDenominator !== 0) && (mapResolution > layer.maxScaleDenominator || mapResolution < layer.minScaleDenominator)) {
            return false;
        }
        var viewExtent = getViewExtent(map);
        var layerExtent = [
            layer.bbox[3],
            layer.bbox[0],
            layer.bbox[1],
            layer.bbox[2]
        ];
        if (!LayerUtils.intersects(viewExtent, layerExtent)) {
            return false;
        }
        return true;
    }
    function getViewExtent(map) {
        var topLeft = {};
        var bottomRight = {};
        var mapDiv = map.mapDiv;
        for (var x = 0; x <= mapDiv.offsetHeight; x = x + mapDiv.offsetHeight / 10) {
            topLeft = map.pickPosition(0, x);
            if (topLeft.lon !== 0 || topLeft.lat !== 0) {
                break;
            }
        }
        bottomRight = map.pickPosition(mapDiv.offsetWidth, mapDiv.offsetHeight);
        if (topLeft.lon === 0 && topLeft.lat === 0 || bottomRight.lon === 0 && bottomRight.lat === 0) {
            topLeft.lat = 90;
            topLeft.lon = -180;
            bottomRight.lat = -90;
            bottomRight.lon = 180;
        }
        var extent = [
            topLeft.lat,
            topLeft.lon,
            bottomRight.lat,
            bottomRight.lon
        ];
        return extent;
    }
    function getLayerInfo(layer) {
        var layerInfo = {};
        if (layer) {
            layerInfo._title = layer.title || '';
            layerInfo._description = layer.description || '';
            layerInfo._quicklookUrl = layer.quicklookUrl || '';
            layerInfo._metadata = layer.metadata || [];
            layerInfo._legends = layer.legends || [];
        }
        return layerInfo;
    }
    function getOrderedLayers(map) {
        var orderedLayers = [];
        var featureLayers = map.getLayers({ type: 'feature' }).reverse();
        for (var i = 0; i < featureLayers.length; i++) {
            orderedLayers.push(featureLayers[i]);
        }
        var rasterLayers = map.getLayers({ type: 'raster' }).reverse();
        for (var i = 0; i < rasterLayers.length; i++) {
            orderedLayers.push(rasterLayers[i]);
        }
        return orderedLayers;
    }
    return LayerSwitcher;
}(CommonControlsLayerSwitcherDOM, CommonUtilsLayerUtils, CommonUtilsSelectorID);
VgControlsUtilsPositionFormater = function () {
    var PositionFormater = {
        NORTH: 'N',
        SOUTH: 'S',
        EAST: 'E',
        WEST: 'W',
        digitSecond: 2,
        digitDecimal: 5,
        digitRadian: 8,
        roundToDecimal: function (inputNum, numPoints) {
            var multiplier = Math.pow(10, numPoints);
            return Math.round(inputNum * multiplier) / multiplier;
        },
        decimalToRadian: function (location) {
            var d = 0.017453292519943295;
            return this.roundToDecimal(location * d, this.digitRadian);
        },
        decimalToGrade: function (location) {
            var d = 1.1111111111111112;
            return this.roundToDecimal(location * d, this.digitRadian);
        },
        decimalToDMS: function (location, hemisphere) {
            if (location < 0) {
                location *= -1;
            }
            var degrees = Math.floor(location);
            var minutesFromRemainder = (location - degrees) * 60;
            var minutes = Math.floor(minutesFromRemainder);
            var secondsFromRemainder = (minutesFromRemainder - minutes) * 60;
            var seconds = this.roundToDecimal(secondsFromRemainder, this.digitSecond);
            var dms = degrees + '\xB0 ' + minutes + '\' ' + seconds + '" ';
            if (hemisphere) {
                dms += hemisphere;
            }
            return dms;
        },
        decimalLatToDMS: function (location) {
            var hemisphere = location < 0 ? this.SOUTH : this.NORTH;
            return this.decimalToDMS(location, hemisphere);
        },
        decimalLongToDMS: function (location) {
            var hemisphere = location < 0 ? this.WEST : this.EAST;
            return this.decimalToDMS(location, hemisphere);
        },
        DMSToDecimal: function (degrees, minutes, seconds, hemisphere) {
            var ddVal = degrees + minutes / 60 + seconds / 3600;
            ddVal = hemisphere == this.SOUTH || hemisphere == this.WEST ? ddVal * -1 : ddVal;
            var decimal = this.roundToDecimal(ddVal, this.digitDecimal);
            return decimal;
        }
    };
    return PositionFormater;
}();
VgControlsUtils = function () {
    var Utils = {
        getMapExtent: function (map) {
            var mapDiv = map.mapDiv;
            var topLeft = {};
            var bottomRight = {};
            for (var x = 0; x <= mapDiv.offsetHeight; x = x + mapDiv.offsetHeight / 10) {
                topLeft = map.pickPosition(0, x);
                if (topLeft.lon !== 0 || topLeft.lat !== 0) {
                    break;
                }
            }
            bottomRight = map.pickPosition(mapDiv.offsetWidth, mapDiv.offsetHeight);
            if (topLeft.lon === 0 && topLeft.lat === 0 || bottomRight.lon === 0 && bottomRight.lat === 0) {
                topLeft.lat = 90;
                topLeft.lon = -180;
                bottomRight.lat = -90;
                bottomRight.lon = 180;
            }
            var extent = [
                topLeft.lat,
                topLeft.lon,
                bottomRight.lat,
                bottomRight.lon
            ];
            return extent;
        }
    };
    return Utils;
}();
VgCRSCRS = function (proj4) {
    var CRS = {
        'EPSG:4326': '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs +units=degrees',
        'EPSG:3857': '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs',
        'EPSG:2154': '+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
        'EPSG:27572': '+proj=lcc +lat_1=46.8 +lat_0=46.8 +lon_0=0 +k_0=0.99987742 +x_0=600000 +y_0=2200000 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs',
        'EPSG:32620': '+proj=utm +zone=20 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
        'EPSG:4467': '+proj=utm +zone=21 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
        'EPSG:2972': '+proj=utm +zone=22 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
        'EPSG:32630': '+proj=utm +zone=30 +datum=WGS84 +units=m +no_defs',
        'EPSG:32631': '+proj=utm +zone=31 +datum=WGS84 +units=m +no_defs',
        'EPSG:32632': '+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs',
        'EPSG:4471': '+proj=utm +zone=38 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
        'EPSG:2975': '+proj=utm +zone=40 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
        'EPSG:3296': '+proj=utm +zone=5 +south +ellps=GRS80 +towgs84=0.072,-0.507,-0.245,-0.0183,0.0003,-0.007,-0.0093 +units=m +no_defs',
        'EPSG:3297': '+proj=utm +zone=6 +south +ellps=GRS80 +towgs84=0.072,-0.507,-0.245,-0.0183,0.0003,-0.007,-0.0093 +units=m +no_defs',
        'EPSG:32707': '+proj=utm +zone=7 +south +datum=WGS84 +units=m +no_defs',
        'EPSG:32708': '+proj=utm +zone=8 +south +datum=WGS84 +units=m +no_defs',
        'EPSG:26912': '+proj=utm +zone=12 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
        'EPSG:32742': '+proj=utm +zone=42 +south +datum=WGS84 +units=m +no_defs',
        'EPSG:32739': '+proj=utm +zone=39 +south +datum=WGS84 +units=m +no_defs',
        'EPSG:32743': '+proj=utm +zone=43 +south +datum=WGS84 +units=m +no_defs',
        'EPSG:2986': '',
        'EPSG:32737': '+proj=utm +zone=37 +south +datum=WGS84 +units=m +no_defs',
        'EPSG:32738': '+proj=utm +zone=38 +south +datum=WGS84 +units=m +no_defs',
        'EPSG:2988': '+proj=utm +zone=1 +south +ellps=intl +towgs84=253,-132,-127,0,0,0,0 +units=m +no_defs',
        'EPSG:3163': '+proj=lcc +lat_1=-20.66666666666667 +lat_2=-22.33333333333333 +lat_0=-21.5 +lon_0=166 +x_0=400000 +y_0=300000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
    };
    return CRS;
}(proj4);
VgControlsMousePosition = function (proj4, woodman, Gp, Config, RightManagement, SelectorID, MousePositionDOM, PositionFormater, Utils, CRS) {
    function MousePosition(options) {
        options = options || {};
        var MPoptions = options.options || {};
        if (!(this instanceof MousePosition)) {
            throw new TypeError('ERROR CLASS_CONSTRUCTOR');
        }
        this._initialize(options);
        var container = this._initContainer(options);
        this._callbacks = {};
        var MPtarget = document.getElementById(MPoptions.div);
        VirtualGeo.Control.call(this, container, MPtarget);
        this.setOptions({ name: 'MousePosition' });
        var VGsetMap = this._setMap;
        this._setMap = function (map, mapDiv, f) {
            if (map) {
                if (!map.mapDiv) {
                    map.mapDiv = mapDiv;
                }
                var center = this._createMapCenter();
                mapDiv.appendChild(center);
                if (!this.options.target) {
                    this.options.target = mapDiv.id;
                }
                this._callbacks.callbackMouseMove = this.onMouseMove.bind(this);
                if (!this.collapsed) {
                    if (this._isDesktop) {
                        mapDiv.addEventListener('mousemove', this._callbacks.callbackMouseMove);
                    } else {
                        map.addEventListener('centerchanged', this.onMapMove());
                    }
                }
                this._map = map;
            }
            VGsetMap.call(this, map, mapDiv, f);
            if (map == null) {
                if (this._callbacks.callbackMouseMove) {
                    mapDiv = document.getElementById(this.options.target);
                    mapDiv.removeEventListener('mousemove', this._callbacks.callbackMouseMove);
                }
                return;
            }
            if (!this.collapsed) {
                var inputShow = document.getElementById(this._addUID('GPshowMousePosition'));
                inputShow.checked = 'checked';
                this._setElevationPanel(this.options.displayAltitude);
                this._setCoordinatesPanel(this.options.displayCoordinates);
                if (!this.options.displayCoordinates) {
                    this._setSettingsPanel(false);
                }
            }
        };
    }
    VirtualGeo.Utils.inherits(MousePosition, VirtualGeo.Control);
    MousePosition.prototype = Object.create(VirtualGeo.Control.prototype, {});
    MousePosition.prototype.assign = function (source) {
        for (var prop in source) {
            if (source.hasOwnProperty(prop)) {
                this[prop] = source[prop];
            }
        }
    };
    MousePosition.prototype.assign(MousePositionDOM);
    MousePosition.prototype.constructor = MousePosition;
    MousePosition.prototype.addSystem = function (system) {
        if (typeof system !== 'object') {
            console.log('[ERROR] MousePosition:addSystem - system parameter should be an object');
            return;
        }
        if (!system.crs) {
            return;
        }
        if (!system.label) {
            system.label = system.crs;
        }
        if (!system.type) {
            system.type = 'Metric';
        }
        for (var j = 0; j < this._projectionSystems.length; j++) {
            var obj = this._projectionSystems[j];
            if (system.crs === obj.crs) {
                console.log('crs \'{}\' already configured', obj.crs);
            }
        }
        system.code = this._projectionSystems.length;
        this._projectionSystems.push(system);
        var selectSystem = document.getElementById(this._addUID('GPmousePositionProjectionSystem'));
        if (selectSystem) {
            var option = document.createElement('option');
            option.value = system.code;
            option.text = system.label;
            selectSystem.appendChild(option);
        }
    };
    MousePosition.prototype.addSystems = function (systems) {
        if (!systems) {
            return;
        }
        if (!Array.isArray(systems)) {
            console.log('[ERROR] MousePosition:addSystems - systems parameter should be an array');
            return;
        }
        for (var i = 0; i < systems.length; i++) {
            this.addSystem(systems[i]);
        }
    };
    MousePosition.prototype.removeSystem = function (systemCrs) {
        if (!systemCrs || typeof systemCrs !== 'string') {
            console.log('[ERROR] MousePosition:removeSystem - systemCode parameter should be a string');
            return;
        }
        var systemCode = null;
        for (var i = 0; i < this._projectionSystems.length; i++) {
            var proj = this._projectionSystems[i];
            if (systemCrs === proj.crs) {
                systemCode = proj.code;
                this._projectionSystems.splice(i, 1);
                break;
            }
        }
        if (systemCode == null) {
            console.log('[WARN] MousePosition:removeSystem - system not found');
            return;
        }
        var oldNewCodeMap = [];
        for (var i = 0; i < this._projectionSystems.length; i++) {
            oldNewCodeMap[Number(this._projectionSystems[i].code)] = i;
            this._projectionSystems[i].code = i;
        }
        var indexChildToRemove = null;
        var systemList = document.getElementById(this._addUID('GPmousePositionProjectionSystem'));
        for (var j = 0; j < systemList.childNodes.length; j++) {
            if (systemCode == systemList.childNodes[j].value) {
                indexChildToRemove = j;
                continue;
            }
            systemList.childNodes[j].value = oldNewCodeMap[Number(systemList.childNodes[j].value)];
        }
        if (indexChildToRemove != null) {
            systemList.removeChild(systemList.childNodes[indexChildToRemove]);
        }
        if (this._currentProjectionSystems.code == systemCode) {
            systemList.childNodes[0].setAttribute('selected', 'selected');
            this._setCurrentSystem(systemList.childNodes[0].value);
        }
    };
    MousePosition.prototype.setUnits = function (units) {
        if (!units || !Array.isArray(units)) {
            return;
        }
        this.options.units = units;
        this._projectionUnits = [];
        this._initProjectionUnits();
        if (this._currentProjectionType) {
            this._setTypeUnitsPanel(this._currentProjectionType);
        }
    };
    MousePosition.prototype.setAltitudeOptions = function (options) {
        if (!options || typeof options !== 'object') {
            return;
        }
        this.options.altitude.triggerDelay = options.triggerDelay;
        this.options.altitude.responseDelay = options.responseDelay;
        if (options.serviceOptions) {
            for (var opt in options.serviceOptions) {
                if (options.serviceOptions.hasOwnProperty(opt)) {
                    this.options.altitude.serviceOptions[opt] = options.serviceOptions[opt];
                }
            }
        }
    };
    MousePosition.prototype.displayAltitude = function (displayAltitude) {
        if (displayAltitude === undefined) {
            return;
        }
        this.options.displayAltitude = displayAltitude;
        this._setElevationPanel(displayAltitude);
    };
    MousePosition.prototype.displayCoordinates = function (displayCoordinates) {
        if (displayCoordinates === undefined) {
            return;
        }
        this.options.displayCoordinates = displayCoordinates;
        this._setCoordinatesPanel(displayCoordinates);
        this._setSettingsPanel(displayCoordinates);
    };
    MousePosition.prototype.setCollapsed = function (collapsed) {
        if (collapsed === undefined) {
            console.log('[ERROR] MousePosition:setCollapsed - missing collapsed parameter');
            return;
        }
        if (collapsed && this.collapsed || !collapsed && !this.collapsed) {
            return;
        }
        if (!this._isDesktop) {
            document.getElementById(this._addUID('GPmapCenter')).className = collapsed ? '' : 'GPmapCenterVisible';
        }
        this.onShowMousePositionClick();
        this._showMousePositionContainer.checked = !collapsed;
    };
    MousePosition.prototype._initialize = function (options) {
        this.options = options || {};
        this.options.collapsed = options.collapsed !== undefined ? options.collapsed : true;
        this.collapsed = this.options.collapsed;
        this.options.units = options.units || [];
        this.options.displayAltitude = options.displayAltitude !== undefined ? options.displayAltitude : true;
        this.options.displayCoordinates = options.displayCoordinates !== undefined ? options.displayCoordinates : true;
        this.options.systems = options.systems || [];
        if (options.altitude) {
            var altitude = options.altitude;
            this.options.altitude = {
                triggerDelay: altitude.triggerDelay !== undefined ? altitude.triggerDelay : 200,
                responseDelay: altitude.responseDelay !== undefined ? altitude.responseDelay : 500,
                serviceOptions: altitude.serviceOptions || {}
            };
        } else {
            this.options.altitude = {
                triggerDelay: 200,
                responseDelay: 500,
                serviceOptions: {}
            };
        }
        this._uid = SelectorID.generate();
        this._projectionSystems = [];
        this._initProjectionSystems();
        this._projectionUnits = {};
        this._initProjectionUnits();
        this._isDesktop = this._detectSupport();
        if (this.options.altitude.triggerDelay < 100) {
            this.options.altitude.triggerDelay = 100;
        }
        this._timer = this.options.altitude.triggerDelay;
        this._currentProjectionSystems = this._projectionSystems[0];
        this._currentProjectionType = this._projectionSystems[0].type;
        this._currentProjectionUnits = this._projectionUnits[this._currentProjectionType][0].code;
        this._projectionUnitsContainer = null;
        this._showMousePositionContainer = null;
        if (!this.options.displayAltitude && !this.options.displayCoordinates) {
            this.options.displayCoordinates = true;
        }
        if (this.options.displayAltitude) {
            this._checkRightsManagement();
        }
    };
    MousePosition.prototype._initProjectionSystems = function () {
        var projectionSystemsByDefault = [
            {
                label: 'Géographique',
                crs: 'EPSG:4326',
                type: 'Geographical'
            },
            {
                label: 'Mercator',
                crs: 'EPSG:3857',
                type: 'Metric'
            },
            {
                label: 'Lambert 93',
                crs: 'EPSG:2154',
                type: 'Metric',
                geoBBox: {
                    left: -9.86,
                    bottom: 41.15,
                    right: 10.38,
                    top: 51.56
                }
            },
            {
                label: 'Lambert II étendu',
                crs: 'EPSG:27572',
                type: 'Metric',
                geoBBox: {
                    left: -4.87,
                    bottom: 42.33,
                    right: 8.23,
                    top: 51.14
                }
            }
        ];
        var systems = this.options.systems;
        for (var i = 0; i < systems.length; i++) {
            var sys = systems[i];
            this.addSystem(sys);
        }
        if (this._projectionSystems.length === 0) {
            for (var i = 0; i < projectionSystemsByDefault.length; i++) {
                this.addSystem(projectionSystemsByDefault[i]);
            }
        }
    };
    MousePosition.prototype._initProjectionUnits = function () {
        var projectionUnitsByDefault = {
            Geographical: [
                {
                    code: 'DEC',
                    label: 'degrés décimaux',
                    convert: this._displayDEC
                },
                {
                    code: 'DMS',
                    label: 'degrés sexagésimaux',
                    convert: this._displayDMS
                },
                {
                    code: 'RAD',
                    label: 'radians',
                    convert: this._displayRAD
                },
                {
                    code: 'GON',
                    label: 'grades',
                    convert: this._displayGON
                }
            ],
            Metric: [
                {
                    code: 'M',
                    label: 'mètres',
                    convert: this._displayMeter
                },
                {
                    code: 'KM',
                    label: 'kilomètres',
                    convert: this._displayKMeter
                }
            ]
        };
        var units = this.options.units;
        for (var type in projectionUnitsByDefault) {
            if (projectionUnitsByDefault.hasOwnProperty(type)) {
                var found = false;
                for (var j = 0; j < projectionUnitsByDefault[type].length; j++) {
                    var obj = projectionUnitsByDefault[type][j];
                    for (var i = 0; i < units.length; i++) {
                        var unit = units[i];
                        unit = unit.toUpperCase();
                        if (obj.code === unit) {
                            found = true;
                            if (!this._projectionUnits[type]) {
                                this._projectionUnits[type] = [];
                            }
                            this._projectionUnits[type].push(obj);
                        }
                    }
                }
                if (!found) {
                    this._projectionUnits[type] = projectionUnitsByDefault[type];
                }
            }
        }
        if (typeof this._projectionUnits === 'object' && Object.keys(this._projectionUnits).length === 0) {
            this._projectionUnits = projectionUnitsByDefault;
        }
    };
    MousePosition.prototype._detectSupport = function () {
        var isDesktop = true;
        var userAgent = window.navigator.userAgent.toLowerCase();
        if (userAgent.indexOf('iphone') !== -1 || userAgent.indexOf('ipod') !== -1 || userAgent.indexOf('ipad') !== -1 || userAgent.indexOf('android') !== -1 || userAgent.indexOf('mobile') !== -1 || userAgent.indexOf('blackberry') !== -1 || userAgent.indexOf('tablet') !== -1 || userAgent.indexOf('phone') !== -1 || userAgent.indexOf('touch') !== -1) {
            isDesktop = false;
        }
        if (userAgent.indexOf('msie') !== -1 || userAgent.indexOf('trident') !== -1) {
            isDesktop = true;
        }
        return isDesktop;
    };
    MousePosition.prototype._checkRightsManagement = function () {
        var rightManagement = RightManagement.check({
            key: this.options.apiKey,
            resources: ['SERVICE_CALCUL_ALTIMETRIQUE_RSC'],
            services: ['Elevation']
        });
        if (!rightManagement) {
            this._noRightManagement = true;
        }
        if (!this.options.apiKey) {
            this.options.apiKey = rightManagement.key;
        }
    };
    MousePosition.prototype._initContainer = function () {
        var container = this._createMainContainerElement();
        var inputShow = this._showMousePositionContainer = this._createShowMousePositionElement();
        container.appendChild(inputShow);
        var picto = this._createShowMousePositionPictoElement(this._isDesktop);
        container.appendChild(picto);
        var panel = this._createMousePositionPanelElement();
        var settings = this._createMousePositionSettingsElement();
        var systems = this._projectionSystemsContainer = this._createMousePositionSettingsSystemsElement(this._projectionSystems);
        var units = this._projectionUnitsContainer = this._createMousePositionSettingsUnitsElement(this._projectionUnits[this._currentProjectionType]);
        settings.appendChild(systems);
        settings.appendChild(units);
        panel.appendChild(settings);
        container.appendChild(panel);
        return container;
    };
    MousePosition.prototype._setElevationPanel = function (active) {
        var div = null;
        if (!active) {
            div = document.getElementById(this._addUID('GPmousePositionAltitude'));
            div.style.display = 'none';
        } else {
            if (this._noRightManagement) {
                div = document.getElementById(this._addUID('GPmousePositionAlt'));
                div.innerHTML = 'No rights!';
            } else {
                div = document.getElementById(this._addUID('GPmousePositionAltitude'));
                div.style.display = '';
            }
        }
    };
    MousePosition.prototype._setCoordinatesPanel = function (active) {
        var div = document.getElementById(this._addUID('GPmousePositionCoordinate'));
        if (!active) {
            div.style.display = 'none';
        } else {
            div.style.display = '';
        }
    };
    MousePosition.prototype._setSettingsPanel = function (active) {
        var divPicto = document.getElementById(this._addUID('GPshowMousePositionSettingsPicto'));
        var divPanel = document.getElementById(this._addUID('GPmousePositionSettings'));
        if (!active) {
            divPicto.style.display = 'none';
            divPanel.style.display = 'none';
        } else {
            divPicto.style.display = '';
            divPanel.style.display = '';
        }
    };
    MousePosition.prototype._setTypeUnitsPanel = function (type) {
        var container = this._projectionUnitsContainer;
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        var units = this._projectionUnits[type];
        for (var j = 0; j < units.length; j++) {
            var obj = units[j];
            var option = document.createElement('option');
            option.value = obj.code ? obj.code : j;
            option.text = obj.label || j;
            container.appendChild(option);
        }
        this._currentProjectionType = type;
        this._currentProjectionUnits = this._projectionUnits[type][0].code;
    };
    MousePosition.prototype._displayDEC = function (coords) {
        var coordinate = {};
        coordinate.lat = PositionFormater.roundToDecimal(coords.lat, 6);
        coordinate.lng = PositionFormater.roundToDecimal(coords.lon, 6);
        return coordinate;
    };
    MousePosition.prototype._displayDMS = function (coords) {
        var coordinate = {};
        coordinate.lat = PositionFormater.decimalLatToDMS(coords.lat);
        coordinate.lng = PositionFormater.decimalLongToDMS(coords.lon);
        return coordinate;
    };
    MousePosition.prototype._displayRAD = function (coords) {
        var coordinate = {};
        coordinate.lat = PositionFormater.decimalToRadian(coords.lat);
        coordinate.lng = PositionFormater.decimalToRadian(coords.lon);
        return coordinate;
    };
    MousePosition.prototype._displayGON = function (coords) {
        var coordinate = {};
        coordinate.lat = PositionFormater.decimalToGrade(coords.lat);
        coordinate.lng = PositionFormater.decimalToGrade(coords.lon);
        return coordinate;
    };
    MousePosition.prototype._displayMeter = function (coords) {
        var coordinate = {};
        coordinate.x = coords.lon.toFixed(2);
        coordinate.y = coords.lat.toFixed(2);
        coordinate.unit = 'm';
        return coordinate;
    };
    MousePosition.prototype._displayKMeter = function (coords) {
        var coordinate = {};
        coordinate.x = (coords.lon / 1000).toFixed(2);
        coordinate.y = (coords.lat / 1000).toFixed(2);
        coordinate.unit = 'km';
        return coordinate;
    };
    MousePosition.prototype._setCoordinate = function (coords) {
        var coord = [];
        var coordinates = {};
        var oSrs = this._currentProjectionSystems;
        var crsProp = oSrs.crs;
        if (!oSrs || !crsProp) {
            console.log('ERROR : system crs not found');
            return;
        }
        if (crsProp !== 'EPSG:4326') {
            coord = proj4(CRS[crsProp], [
                coords.lon,
                coords.lat
            ]);
            coordinates.lon = coord[0];
            coordinates.lat = coord[1];
        } else {
            coordinates = coords;
        }
        var type = this._currentProjectionSystems.type;
        var convert = null;
        var units = this._projectionUnits[type];
        for (var i = 0; i < units.length; i++) {
            if (units[i].code === this._currentProjectionUnits) {
                convert = units[i].convert;
                break;
            }
        }
        if (!convert || typeof convert !== 'function') {
            console.log('WARNING : coordinates format function not found');
            return;
        } else {
            coord = convert(coordinates);
        }
        if (!coord || Object.keys(coord).length === 0) {
            return;
        }
        this.GPdisplayCoords(coord);
    };
    MousePosition.prototype._setElevation = function (coords) {
        var delay = this.options.altitude.responseDelay;
        this.GPdisplayElevation(coords, delay);
    };
    MousePosition.prototype.onMoveStopped = function (coords) {
        this._setElevation(coords);
    };
    MousePosition.prototype.onMouseMove = function (e) {
        var self = this;
        var map = this.getMap();
        var mapDiv = document.getElementById(this.options.target);
        var posX = e.pageX - mapDiv.offsetLeft;
        var posY = e.pageY - mapDiv.offsetTop;
        var coordinate = map.pickPosition(posX, posY);
        var crs = 'EPSG:4326';
        this._setCoordinate(coordinate, crs);
        clearTimeout(this._timer);
        this._timer = setTimeout(function () {
            self.onMoveStopped(coordinate, self._currentProjectionSystems.crs);
        }, this.options.altitude.triggerDelay);
    };
    MousePosition.prototype.onMapMove = function (e) {
    };
    MousePosition.prototype.onRequestAltitude = function (coordinate, callback) {
        if (!coordinate || Object.keys(coordinate).length === 0) {
            return;
        }
        if (!this.options.displayAltitude) {
            return;
        }
        if (this._noRightManagement) {
            console.log('[WARNING] contract key configuration has no rights to load geoportal elevation ');
            document.getElementById(this._addUID('GPmousePositionAlt')).innerHTML = 'No rights!';
            return;
        }
        var options = this.options.altitude.serviceOptions || {};
        options.zonly = true;
        options.positions = [{
                lon: coordinate.lon,
                lat: coordinate.lat
            }];
        options.scope = this;
        if (!options.rawResponse) {
            options.onSuccess = function (results) {
                if (results && Object.keys(results)) {
                    callback.call(this, results.elevations[0].z);
                }
            };
        } else {
            options.onSuccess = function (results) {
                console.log('alti service raw response : ', results);
            };
        }
        options.onFailure = function (error) {
            console.log('[getAltitude] ERROR : ' + error.message);
        };
        options.apiKey = options.apiKey || this.options.apiKey;
        Gp.Services.getAltitude(options);
    };
    MousePosition.prototype.onShowMousePositionClick = function () {
        var map = this.getMap();
        var mapDiv = document.getElementById(this.options.target);
        this.collapsed = this._showMousePositionContainer.checked;
        if (this._showMousePositionContainer.checked) {
            if (this._isDesktop) {
                mapDiv.removeEventListener('mousemove', this._callbacks.callbackMouseMove);
            } else {
                map.removeEventListener('centerchanged');
            }
        } else {
            if (this._isDesktop) {
                mapDiv.addEventListener('mousemove', this._callbacks.callbackMouseMove);
            } else {
                map.addEventListener('centerchanged', this.onMapMove());
            }
        }
        this._setElevationPanel(this.options.displayAltitude);
        this._setCoordinatesPanel(this.options.displayCoordinates);
        if (!this.options.displayCoordinates) {
            this._setSettingsPanel(false);
        }
    };
    MousePosition.prototype.onMousePositionProjectionSystemChange = function (e) {
        var idx = e.target.selectedIndex;
        var value = e.target.options[idx].value;
        this._setCurrentSystem(value);
    };
    MousePosition.prototype._setCurrentSystem = function (systemCode) {
        var type = null;
        for (var i = 0; i < this._projectionSystems.length; ++i) {
            if (this._projectionSystems[i].code == systemCode) {
                type = this._projectionSystems[i].type;
                break;
            }
        }
        if (!type) {
            return;
        }
        if (type !== this._currentProjectionType) {
            this._setTypeUnitsPanel(type);
        }
        this._currentProjectionSystems = this._projectionSystems[Number(systemCode)];
        if (!this._isDesktop) {
            this.onMapMove();
        }
    };
    MousePosition.prototype.onMousePositionProjectionSystemMouseOver = function (e) {
        var map = this.getMap();
        if (!map) {
            return;
        }
        var mapExtent = Utils.getMapExtent(map);
        var systemList = document.getElementById(this._addUID('GPmousePositionProjectionSystem'));
        systemList.innerHTML = '';
        for (var j = 0; j < this._projectionSystems.length; j++) {
            var proj = this._projectionSystems[j];
            if (proj.geoBBox) {
                if (mapExtent[1] > proj.geoBBox.right || mapExtent[2] > proj.geoBBox.top || mapExtent[3] < proj.geoBBox.left || mapExtent[0] < proj.geoBBox.bottom) {
                    if (proj === this._currentProjectionSystems) {
                        var option = document.createElement('option');
                        option.value = proj.code;
                        option.text = proj.label || j;
                        option.setAttribute('selected', 'selected');
                        option.setAttribute('disabled', 'disabled');
                        systemList.appendChild(option);
                    }
                    continue;
                }
            }
            var option = document.createElement('option');
            option.value = proj.code;
            option.text = proj.label || j;
            if (proj === this._currentProjectionSystems) {
                option.setAttribute('selected', 'selected');
            }
            systemList.appendChild(option);
        }
    };
    MousePosition.prototype.onMousePositionProjectionUnitsChange = function (e) {
        var idx = e.target.selectedIndex;
        var value = e.target.options[idx].value;
        this._currentProjectionUnits = value;
        if (!this._isDesktop) {
            this.onMapMove();
        }
    };
    return MousePosition;
}(proj4, {}, gp, CommonUtilsConfig, CommonUtilsCheckRightManagement, CommonUtilsSelectorID, CommonControlsMousePositionDOM, VgControlsUtilsPositionFormater, VgControlsUtils, VgCRSCRS);
VgGpPluginVg = function (Gp, LayerUtils, LayerSwitcher, MousePosition) {
    Gp.LayerUtils = LayerUtils;
    VirtualGeo.LayerSwitcher = LayerSwitcher;
    VirtualGeo.MousePosition = MousePosition;
    return Gp;
}(gp, CommonUtilsLayerUtils, VgControlsLayerSwitcher, VgControlsMousePosition);
window.proj4 = proj4;
/* END CODE   */

return Gp;
}));
