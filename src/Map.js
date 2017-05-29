/**
 * Geoportal map loader.
 *
 * Use this function to create a Map (instance of {@link Gp.Map}) and attach it to a HTML element.
 *
 * @module Map
 * @alias Gp.Map.load()
 */

 /* globals Gp: true */
 define([
        "Utils/LoggerByDefault",
        "require"
        // "ol3/OL3",
        // "virtual/VG"
    ],
    function (
        Logger,
        require
        // OL3,
        // VG
    ) {

        "use strict";

        /**
         * classe Map
         */
        var Map = {
            /**
             * Initialize a Geoportal map in an HTML element.
             *
             * @method load
             * @static
             * @param {String | DOMElement} div - The HTML element or its id where the map will be loaded.
             * @param {Gp.MapOptions} [mapOptions] - Options for loading the map.
             * @example
             *      Gp.Map.load(
             *          'geoportalMap',
             *          {
             *              apiKey : "YOUR_API_KEY",
             *              center : {
             *                  location : "rue pasteur, Saint-Mandé"
             *              },
             *              zoom : 16,
             *              layersOptions : {
             *                  'GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN-EXPRESS.STANDARD' : {}
             *              }
             *          }
             *      );
             * @returns {Gp.Map} _ The Geoportal map.
             */
            load : function (div, mapOptions) {

                var logger = Logger.getLogger("Map.load");

                // checking required parameter : div
                if (!div) {
                    throw new Error("missing parameter div !");
                }
                if ( typeof(div) == "string" ) {
                    div = document.getElementById(div) ;
                }
                if (!div) {
                    throw new Error("HTML element with id [" + div + "] not found.") ;
                }

                if (!mapOptions) {
                    mapOptions = {};
                }

                // lib. by default
                if ( ! mapOptions.hasOwnProperty("library") ) {
                    mapOptions.library = "ol3";
                }

                // auto detect lib. loaded
                var OL3 = null;
                var VG  = null;

                if (this.__classOl !== null && typeof this.__classOl === "function") {
                    OL3 = this.__classOl;
                }

                if (this.__classVg !== null && typeof this.__classVg === "function") {
                    VG = this.__classVg;
                }

                // TODO => autres implementations

                // creating the library map instance
                var objMap = null;

                var library = mapOptions.library;
                switch (library) {
                    case "ol3":
                        logger.trace("construction de la carte OpenLayers3");
                        if (OL3 === null || typeof OL3 !== "function") {
                            throw new Error("library ol is not loaded !");
                        }

                        objMap = new OL3({
                            div : div,
                            mapOptions : mapOptions
                        });

                        break;
                    case "vg":
                        logger.trace("construction du globe virtualGeo 3D");
                        if (VG === null || typeof VG !== "function") {
                            throw new Error("library vg is not loaded !");
                        }

                        objMap = new VG({
                            div : div,
                            mapOptions : mapOptions
                        });

                        break;
                    default:
                        throw new Error("not supported library");
                }

                this._prototype = Object.getPrototypeOf(objMap); // IMap !

                return objMap;

            }

        };

        /**
         * Map centering information object.
         *
         * * Use x,y and projection properties to center the map with coordinates ;
         * * Use location and locationType properties to center the map thanks to [Geoportal geocoding web service](http://api.ign.fr/tech-docs-js/fr/developpeur/search.html).
         * * Use geolocate to center the map with user position.
         *
         * @namespace
         * @alias Gp.Center
         *
         * @property {Float} x - x coordinates for center
         * @property {Float} y - y coordinates for center
         * @property {String} projection - center coordinates srs
         * @property {String} location - place or address where to center the map
         * @property {Array.<String>} locationType - location types ("StreetAddress", "PositionOfInterest", "CadastralParcel"). Default is ["StreetAddress", "PositionOfInterest"]
         * @property {Boolean} geolocate - center the map by geolocation
         */
        var center = {
        } ;

        /**
         * Point object.
         *
         * @namespace
         * @alias Gp.Point
         *
         * @property {Float} x - Point abscissa
         * @property {Float} y - Point ordinate
         */
        var point = {
        } ;

        /**
         * Center Changed Event. Triggered when the map's center has changed.<br/>
         * One can listen to this event with [Gp.Map.listen()](Gp.Map.html#listen) method
         *
         * @namespace
         * @alias Gp.CenterChangedEvent
         *
         * @property {Gp.Center} oldCenter - old center coordinates
         * @property {Gp.Center} newCenter - new center coordinates
         */
        var centerChangedEvent = {
        } ;

        /**
         * ZoomChanged Event.
         *
         * @namespace
         * @alias Gp.ZoomChangedEvent
         *
         * @property {Float} oldZoom - old map zoom
         * @property {Float} newZoom - new map zoom
         */
        var zoomChangedEvent = {
        } ;

        /**
         * Azimuth Changed Event. Triggered when the map's orientation has changed.<br/>
         * One can listen to this event with [Gp.Map.listen()](Gp.Map.html#listen) method
         *
         * @namespace
         * @alias Gp.AzimuthChangedEvent
         *
         * @property {Float} oldAzimuth - old map azimuth
         * @property {Float} newAzimuth - new map azimuth
         */
        var azimuthChangedEvent = {
        } ;

        /**
         * LayerChanged Event. Triggered when one of the map's layers has changed in some way : <br/>
         * * If a layer has be removed from the map, property **layerRemoved** will host the removed layer definition.
         * * If a layer has be added to the map, property **layerAdded** will host the added layer definition.
         * * If properties (among *visibility*, *opacity* and *position*) of a layer has changed, property **layerChanged** will host the modified layer definition and **property**, **oldValue** and **newValues** will host the modified property with its old and new value.
         * <br/>
         * One can listen to this event with [Gp.Map.listen()](Gp.Map.html#listen) method
         *
         * @namespace
         * @alias Gp.LayerChangedEvent
         *
         * @property {Object} layerAdded - definition of the layer that has been added : object key is the layer Id and object value is a {@link Gp.LayerOptions} object.
         * @property {Object} layerRemoved - definition of the layer that has been removed : object key is the layer Id and object value is a {@link Gp.LayerOptions} object.
         * @property {Object} layerChanged - definition of the layer that has been modified : object key is the layer Id and object value is a {@link Gp.LayerOptions} object.
         * @property {String} property - layer property name that has changed
         * @property {String} oldValue - old layer property value
         * @property {String} newValue - new layer property value
         */
        var layerChangedEvent = {
        } ;

        /**
         * Geolocated Event. Triggered when the map's center has changed by user geo-localization.<br/>
         * One can listen to this event with [Gp.Map.listen()](Gp.Map.html#listen) method
         *
         * @namespace
         * @alias Gp.GeolocatedEvent
         *
         * @property {Gp.Point} position - the position returned by geolocalisation
         */
        var geolocatedEvent = {
        } ;

        /**
         * Located Event. Triggered when the map's center has changed by geocoding.<br/>
         * One can listen to this event with [Gp.Map.listen()](Gp.Map.html#listen) method
         *
         * @namespace
         * @alias Gp.LocatedEvent
         *
         * @property {Gp.Point} position - the position returned by localisation
         */
        var locatedEvent = {
        } ;

        /**
         * Configured Event. Triggered when the map has finished to configure itself with the given apiKey at startup.<br/>
         * One can listen to this event with [Gp.Map.load()](module-Map.html) function through the **mapEventsOptions** property of {@link Gp.MapOptions} parameter.<br/>
         * *NB* : for a full map availability at startup you'd better listen to {@link Gp.MapLoadedEvent}.
         *
         * @namespace
         * @alias Gp.ConfiguredEvent
         *
         * @property {Gp.Services.GetConfigResponse} config - Geoportal access configuration. See [Gp.Services.GetConfigResponse](https://ignf.github.io/geoportal-access-lib/latest/jsdoc/Gp.Services.GetConfigResponse.html) definition in geoportal-access-lib documentation.
         */
        var configuredEvent = {

        } ;
        /**
         * Map Loaded Event. Triggered at startup when the map has finished to load and is ready to be commanded with {@link Gp.Map} object methods.<br/>
         * One can listen to this event with [Gp.Map.load()](module-Map.html) function through the **mapEventsOptions** property of {@link Gp.MapOptions} parameter.<br/>
         *
         * @namespace
         * @alias Gp.MapLoadedEvent
         *
         * @property {Gp.Map} map - loaded Map
         */
        var mapLoadedEvent = {
        } ;

        /**
         * Map options object.
         *
         * Holds options for map creation when using [Gp.Map.load()](module-Map.html) function.
         *
         * Availables options are described below.
         *
         * @namespace
         * @alias Gp.MapOptions
         *
         * @property {String | Array.<String>} apiKey - access key(s) to Geoportal platform, obtained [here](http://professionnels.ign.fr/ign/contrats)
         * @property {Gp.Center} [center] - Map Centering information. Either with coordinates, with geoportal geocoding service or with user geo-localization.
         * @property {Float} [azimuth=0] - Map orientation in decimal degrees clockwise to the north.
         * @property {Integer | Float} [zoom=10] - Zoom level, between 0 (world wide zoom) and 21 (street wide zoom).
         * @property {Array.<Gp.MarkerOptions>} [markersOptions] - Options for displaying markers on the map.
         * @property {Gp.StyleOptions} [defaultFeaturesStyle] - Default style options for vector layers features (KML, GPX, GeoJSON).
         * @property {Object} [layersOptions] - Layers to add to the map and their options. Associative array mapping ids of layers to display and their properties.<br/>For each layer, the id may be either the name of a Geoportal layer (eg : "ORTHOIMAGERY.ORTHOPHOTOS") available with the given apiKey or an id of your choice for external resources. The properties associated to each ID are given as {@link Gp.LayerOptions}.<br/>For Geoportal Layers availables with the given apiKey, values are automaticaly fetched from key configuration. You only need to specify a {@link Gp.LayerOptions} Object with properties you want to overide.
         * @property {Object} [controlsOptions] - Controls to add to the map and their options. Associative array mapping the control's name (keys) with a Boolean (value) for activating / deactivating or with their properties (values given as {@link Gp.ControlOptions}). See {@link Gp.ControlOptions} for availables controls list and their properties.
         * @property {Object} [mapEventsOptions] - Map's events to listen for interaction. Associative array mapping an event from the map (keys) with a function triggered by this event (values given as {Function}). See {@link Gp.Map#listen Gp.Map.listen()} for available event Ids and their associated events objects.
         * @property {Integer} [minZoom=0] - Zoom level beyond which the user can't zoom out.
         * @property {Integer} [maxZoom=21] - Zoom level beyond which the user can't zoom in.
         * @property {String} [configUrl] - Geoportal config url to use instead of the default dynamic configuration service based on apiKey param. See this [tutorial](http://ignf.github.io/geoportal-access-lib/latest/jsdoc/tutorial-optimize-getconfig.html) to generate a config file suitable with this parameter.
         * @property {String} [projection="EPSG:3857"] - Projection code (in EPSG or IGNF register) for the map.
         * @property {String} [proxyUrl] - Proxy URL to avoid cross-domain problems on external resources. Only use if you know what you're doing.
         * @property {Array.<String>} [noProxyDomains] - Proxy will not be used for this list of domain names. Only use if you know what you're doing.
         */
        var mapOptions = {
        /*
         * undocumented options - for the moment
         * @property {Boolean} [reloadConfig=false] - If true, the autoconfiguration service is reload for loading the map. If false, the previous autoconfiguration result is used. This option is used if configUrl is not specified. Only use if you know what you're doing.
         * @property {Float} [tilt=0] - (3d only) Camera gradient in decimal degrees. 0 for a vertical view. 90 for an horizontal view.
         * @property {String} [library="ol3"] - Cartographic library used with the Geoportal API. Supported values are : 'ol3', '3d'.
         */
        } ;

        /**
         * Marker options object.
         *
         * Holds options for marker to display on the map at startup. To be used for map creation (See markersOptions property of {@link Gp.MapOptions} object used as a parameter of [Gp.Map.load()](module-Map.html) function).
         *
         * Available options to define a marker are described below.
         *
         * @namespace
         * @alias Gp.MarkerOptions
         *
         * @property {Object} [position = map center] - Geographical position of the marker. If none, map center will be used.
         * @property {Float} position.x - x coordinates for position
         * @property {Float} position.y - y coordinates for position
         * @property {String} [position.projection = map projection] - srs center coordinates
         * @property {String} content - Content displayed in the popup when clicking on the marker. HTML is supported.
         * @property {String} [contentType = "text/html"] - MimeType of Content displayed in the popup.
         * @property {String} [url = <default lightOrange marker>] - Icon URL used to materialize the marker.
         * @property {Array.<Number>} [offset = [-25.5, -38]] - Offsets in pixels used when positioning the marker towards targeted point. The first element in the array is the horizontal offset. A positive value shifts the marker right. The second element in the array is the vertical offset. A positive value shifts the marker down. Default is offset associated to default marker image.
         * @property {Array.<Number>} [ppoffset = [0,-15]] - Offsets in pixels used when positioning the popup towards click. The first element in the array is the horizontal offset. A positive value shifts the popup right. The second element in the array is the vertical offset. A positive value shifts the popup down. Default value ([0, -15]) fits with default popup positioning.
         */
        var markerOptions = {
        } ;

        /**
         * Layer options object.
         *
         * Holds options for a specific layer present on the map. May be used at map creation (See **layersOptions** property of {@link Gp.MapOptions} object used as a parameter of [Gp.Map.load()](module-Map.html) function) or for map modification (See [Gp.Map.addLayers()](Gp.Map.html#addLayers) or [Gp.Map.modifyLayers()](Gp.Map.html#modifyLayers)).
         *
         * Given a specific layer type, availables options are the following :
         *
         * ### Common properties
         *
         * | property | Type | Description |
         * | - | - | - |
         * | format | String | The layer's format. Supported values are : 'kml', 'gpx', 'geojson', 'wmts', 'wms', 'wfs', or 'osm'. This property is optionnal for Geoportal layers but mandatory for others. |
         * | url | String | Mandatory for non Geoportal layers. The url to the file or the Web Service providing the layer. |
         * | title | String | The layer's name displayed in the LayerSwitcher control. |
         * | description | String | The layer's description. |
         * | opacity | Float | The layer's opacity (between 0 and 1). Default value is 1. |
         * | visibility | Boolean |  If true, the layer is visible. Default value is true. |
         * | minZoom | Integer | If the current zoom level is lower than the minZoom of the layer, the layer is not displayed. Default value is given by the autoconfiguration service for Geoportal layers. For others layers, default value is the minZoom of the map. |
         * | maxZoom | Integer | If the current zoom level is upper than the maxZoom of the layer, the layer is not displayed. Default value is given by the autoconfiguration service for Geoportal layers. For others layers, default value is the maxZoom of the map. |
         * | position | Number | The layer's position in map, compared to other layers positions. Allows to organize layers order explicitely. By default the layer will be displayed above other layers. |
         * | legends | Array[[Gp.Services.Config.Legend](https://depot.ign.fr/geoportail/bibacces/develop/doc/Gp.Services.Config.Legend.html)] | The layer's legends links. |
         * | metadata | Array[[Gp.Services.Config.Metadata](https://depot.ign.fr/geoportail/bibacces/develop/doc/Gp.Services.Config.Metadata.html)] | The layer's metadata links. |
         * | originators | Array[[Gp.Services.Config.Originator](https://depot.ign.fr/geoportail/bibacces/develop/doc/Gp.Services.Config.Originator.html)] | Options about the layers's providers. |
         *
         * ### WMTS specific properties
         *
         * | property | Type | Description |
         * | - | - | - |
         * | grayScaled | Boolean |  If true, the layer is displayed in gray-scale. |
         * | layer | String | The layer's Identifier to add (found in GetCapabilities response). |
         * | queryable | Boolean | If true, user clicks on map will trigger getFeatureInfo request on the layer. Not yet implemented for WMTS. |
         * | gfiFormat | String | If queryable == true, indicates the format mime-type of the response of GetFeatureInfo requests. default : "text/html". Not yet implemented for WMTS. |
         * | tileMatrixSet | String | The name of the layer's TileMatrixSet (see in GetCapabilities response). |
         * | topLeftCorner | Gp.Point | The layer's origin coordinates (found in GetCapabilities response). |
         * | resolutions | Array[Float] | The layer's resolutions list (found in GetCapabilities response). |
         * | matrixIds | Array[String] | The layer's zoom levels ids (found in GetCapabilities response). |
         * | outputFormat | String | The output image format (Mime-type) |
         * | styleName | String | The layer's style name to apply (found in GetCapabilities response). |
         *
         * ### KML specific properties
         *
         * | property | Type | Description |
         * | - | - | - |
         * | showPointNames | Boolean | If true, show names as labels for placemarks which contain points. |
         * | extractStyles | Boolean | If true, the styles of the features are recovered from the file. |
         * | zoomToExtent | Boolean | If true, zoom into the extent of features. |
         * | projection | String | coordinate reference system id used for Layer (default is map projection) |
         *
         * ### KML, GPX and GeoJSON specific properties
         *
         * | property | Type | Description |
         * | - | - | - |
         * | styleOptions | {@link Gp.StyleOptions} | options for layer style (points, strokes, polygons) |
         *
         * ### WMS specific properties
         *
         * | property | Type | Description |
         * | - | - | - |
         * | grayScaled | Boolean |  If true, the layer is displayed in gray-scale. |
         * | layers | Array[String] layers | List of layer's identifiers to add (found in GetCapabilities response). |
         * | queryable | Boolean | If true, user clicks on map will trigger getFeatureInfo request on the layer. |
         * | gfiFormat | String | If queryable == true, indicates the format mime-type of the response of GetFeatureInfo requests. default : "text/html" |
         * | version | String | The version of the Web Service providing the layer. Default : "1.3.0" |
         * | stylesNames | Array[String] | List of the styles names to apply to layers (see in GetCapabilities response). |
         * | outputFormat | String | The output image format (Mime-type) |
         * | backgroundColor | String | The layer's background RVB color in hexadecimal. |
         * | projection | String | Coordinate reference system id used for Layer (default is map projection) |
         * | tiled | Boolean | If true, map will load WMS layer in a tiled way. Otherwise, layer will be displayed with an unique GetMap request covering the whole map view (default). |
         *
         *
         * ### WFS specific properties
         *
         * | property | Type | Description |
         * | - | - | - |
         * | version | String | The version of the Web Service providing the layer. Default : "2.0.0" |
         * | typeNames | String | List of the features's name to add (see in GetCapabilities response). |
         * | outputFormat | String | The output format (Mime-type) to use for WFS requests (outputFormat parameter) |
         * | maxFeatures | Integer | Maximal number of features in the layer. |
         * | projection | String | Coordinate reference system id used for Layer (default is map projection) |
         *
         * @namespace
         * @alias Gp.LayerOptions
         *
         */
        var layerOptions = {
        } ;

        /**
         * Control options object.
         *
         * Holds options for a specific control present on the map. May be used for map creation (See **controlsOptions** property of {@link Gp.MapOptions} object used as a parameter of [Gp.Map.load()](module-Map.html) function) or for map modification (See [Gp.Map.addControls()](Gp.Map.html#addControls) or [Gp.Map.modifyControls()](Gp.Map.html#modifyControls)).
         *
         * Given a specific control, availables options are the following :
         *
         * <a id="zoom"></a>
         *
         * ### Options for "zoom" control
         *
         * | property | Type | Description |
         * | - | - | - |
         * | div | String / DOMElement | Target HTML element container or its id. Default is chosen by map implementation. |
         *
         * <a id="overview"></a>
         *
         * ### Options for "overview" control
         *
         * | property | Type | Description |
         * | - | - | - |
         * | div | String / DOMElement | Target HTML element container or its id. Default is chosen by map implementation. |
         * | layers | Array(String) | List of layers Ids to be displayed on the overview map (may be part of main map layersId or a geoportal WMTS layer ID). If none, all main map layers will be used. |
         * | minZoom | Number | min zoom level for overview map. |
         * | maxZoom | Number | max zoom level for overview map. |
         * | projection | String | projection code for overview map. |
         *
         * <a id="orientation"></a>
         *
         * ### Options for "orientation" control
         *
         * | property | Type | Description |
         * | - | - | - |
         * | div | String / DOMElement | Target HTML element container or its id. Default is chosen by map implementation.
         * | autoHide | Boolean | If true (default), control is not shown when map is oriented to th north. |
         *
         * <a id="graphicscale"></a>
         *
         * ### Options for "graphicscale" control
         *
         * | property | Type | Description |
         * | - | - | - |
         * | div | String / DOMElement | Target HTML element container or its id. Default is chosen by map implementation.
         * | units | String | Units to display : "deg" (degrees) or "m" (metric values). |
         * | minWidth | Number | Minimum width in pixels. Default is 64. |
         *
         * <a id="mouseposition"></a>
         *
         * ### Options for "mouseposition" control
         *
         * | property | Type | Description |
         * | - | - | - |
         * | div | String / DOMElement | Target HTML element container or its id. Default is chosen by map implementation.
         * | maximised | Boolean | if the control has to be opened or not. |
         * | systems | Array(Object) | List of coordinates systems available for display. |
         * | systems.crs | String | Coordinates system ID. |
         * | systems.label | String | label used to designate the CRS. |
         * | systems.type | String | "Geographical" or "Metric" |
         * | units | Array(String) | units used for coordinates display ("m", "km" for Metric coordinates, "dec", "dms", "rad" or "gon" for geographical coordinates). |
         * | displayAltitude | Boolean | (de)activate altitude display |
         * | displayCoordinates | Boolean | (de)activate planimetric coordinates display. |
         * | altitude | Object | altitude interaction specific configuration. Implementation specific. |
         *
         * <a id="route"></a>
         *
         * ### Options for "route" control
         *
         * | property | Type | Description |
         * | - | - | - |
         * | div | String / DOMElement | Target HTML element container or its id. Default is chosen by map implementation.
         * | maximised | Boolean | if the control has to be opened or not. |
         * | exclusions | Object | exclusions to be proposed for control. Il null all exclusions will be proposed by default. |
         * | exclusions.toll | Boolean | proposing toll exclusion. If true, this exclusion will be checked by default. |
         * | exclusions.bridge | Boolean | proposing bridge exclusion. If true, this exclusion will be checked by default. |
         * | exclusions.tunnel | Boolean | proposing tunnel exclusion. If true, this exclusion will be checked by default. |
         * | graphs | Array(String) | available graphs to be proposed by control among "Pieton" (pedestrian) and "Voiture" (car). The first element of the array will be the default proposition of the control. |
         * | markersOpts | Object | options to use your own markers. Object properties can be "departure", "stages" or "arrival". Corresponding value is an object with following properties : |
         * | markersOpts[property].url | String | marker base64 encoded url (ex "data:image/png;base64,...""). Mandatory for a custom marker |
         * | markersOpts[property].offset | Array | Offsets in pixels used when positioning the overlay. The first element in the array is the horizontal offset. A positive value shifts the overlay right. The second element in the array is the vertical offset. A positive value shifts the overlay down. Default is [0, 0].) |
         * | routeOptions | Object | route service options. For advanced use only. See {@link http://depot.ign.fr/geoportail/bibacces/develop/doc/module-Services.html#~route Gp.Services.route()} to know all route options. |
         * | autocompleteOptions | Object | autocomplete service options. See {@link http://depot.ign.fr/geoportail/bibacces/develop/doc/module-Services.html#~autoComplete Gp.Services.autoComplete()} to know all autocomplete options. |
         *
         * <a id="isocurve"></a>
         *
         * ### Options for "isocurve" control
         *
         * | property | Type | Description |
         * | - | - | - |
         * | div | String / DOMElement | Target HTML element container or its id. Default is chosen by map implementation.
         * | maximised | Boolean | if the control has to be opened or not. |
         * | exclusions | Object | exclusions to be proposed for control. Il null all exclusions will be proposed by default. |
         * | exclusions.toll | Boolean | proposing toll exclusion. If true, this exclusion will be checked by default. |
         * | exclusions.bridge | Boolean | proposing bridge exclusion. If true, this exclusion will be checked by default. |
         * | exclusions.tunnel | Boolean | proposing tunnel exclusion. If true, this exclusion will be checked by default. |
         * | graphs | Array(String) | available graphs to be proposed by control among "Pieton" (pedestrian) and "Voiture" (car). The first element of the array will be the default proposition of the control. |
         * | methods | Array(String) | available methods of computation to be proposed by control among "time" (isochron) and "distance" (isodistance). The first element of the array will be the default proposition of the control. |
         * | directions | Array(String) | available directions to be proposed by control among "arrival" (isocurve to arrival point) and "departure" (isocruve from departure point). The first element of the array will be the default proposition of the control. |
         * | markerOpts | Object | options to use your own marker. Default is a lightOrange marker. |
         * | markerOpts.url | String | marker base64 encoded url (ex "data:image/png;base64,...""). Mandatory for a custom marker |
         * | markerOpts.offset | Array | Offsets in pixels used when positioning the overlay. The first element in the array is the horizontal offset. A positive value shifts the overlay right. The second element in the array is the vertical offset. A positive value shifts the overlay down. Default is [0, 0]. (see http://openlayers.org/en/latest/apidoc/ol.Overlay.html) |
         * | isocurveOptions | Object | isocurve service options. For advanced use only. See {@link http://depot.ign.fr/geoportail/bibacces/develop/doc/module-Services.html#~isocurve Gp.Services.isocurve()} to know all isocurve options. |
         *
         * <a id="graticule"></a>
         *
         * ### Options for "graticule" control
         *
         * | property | Type | Description |
         * | - | - | - |
         * | div | String / DOMElement | Target HTML element container or its id. Default is chosen by map implementation.
         * | strokeColor | String | stroke color expressed in hex format (default : #000000) |
         * | strokeOpacity | Number | stroke opacity expressed between 0 and 1 (default : 0.2). |
         * | strokeWidth | Number | stroke width expressed in pixels (default : 1). |
         *
         * <a id="layerswitcher"></a>
         *
         * ### Options for "layerswitcher" control
         *
         * | property | Type | Description |
         * | - | - | - |
         * | div | String / DOMElement | Target HTML element container or its id. Default is chosen by map implementation.
         * | maximised | Boolean | if the control has to be opened or not. |
         *
         * <a id="getfeatureinfo"></a>
         *
         * ### Options for "getfeatureinfo" control
         *
         * | Property | Type | Argument | Default | Description |
         * | - | - | - | - | - |
         * | div | String / DOMElement | | | Target HTML element container or its id. Default is chosen by map implementation. |
         * | options | Object | | | Defines control options. |
         * | options.hidden | Boolean | optional | false | Specifies if the widget should be hidden. |
         * | options.auto | Boolean | optional | false | Specifies if the control run in automatic mode. In automatic mode all vector layers added on run time or added at map initialization can be requested through the control. The triggering event of those layers is the default event. |
         * | options.active | Boolean | optional | true | Specifies if the control is active or inactive. When inactive no request is fired and no information displayed. |
         * | options.defaultEvent | String | optional | 'singleclick' | Specifies the default triggering event chosen in the list ['singleclick', 'dblclick', 'contextmenu']. This is the triggering event of all layers added to the control without configured triggering event. |
         * | options.defaultInfoFormat | String | optional | 'text/html' | Indicates the default format mime-type of the response of GetFeatureInfo requests. |
         * | options.cursorStyle | String | optional | 'pointer' | Specifies the type of cursor to be displayed when pointing on vector feature of a layer previously added to the control. The value must be choosen in the possible values of the css cursor property. |
         * | layers | Object | | | List of layers requested by the control and their options (those layers have to be queryable). Associative array mapping ids of layers and their properties : </br><ul><li>event (String, optional) : name of the mouse event triggering the "getfeatureinfo" request.</li><li>infoFormat (String, optional) : indicates the format mime-type of the response of GetFeatureInfo requests.</li></ul> |
         *
         * <a id="layerimport"></a>
         *
         * ### Options for "layerimport" control
         *
         * | property | Type | Description |
         * | - | - | - |
         * | div | String / DOMElement | Target HTML element container or its id. Default is chosen by map implementation.
         * | maximised | Boolean | if the control has to be opened or not. |
         * | layerTypes | Array | data types that could be imported : "KML", "GPX", "GeoJSON", "WMS" and "WMTS". Values will be displayed in the same order in widget list. Default is : ["KML", "GPX", "GeoJSON", "WMS", "WMTS"] |
         * | webServicesOptions | Object | Options to import WMS or WMTS layers |
         * | webServicesOptions.proxyUrl | String | Proxy URL to avoid cross-domain problems, if not already set in mapOptions. Mandatory to import WMS and WMTS layer. |
         * | webServicesOptions.noProxyDomains | Array(String) | Proxy will not be used for this list of domain names. Only use if you know what you're doing (if not already set in mapOptions) |
         * | defaultStyles | Object | Styles to apply by default to imported KML or GPX layers |
         * | defaultStyles.KML | Object | Styles to apply by default to imported KML layers |
         * | defaultStyles.KML.markerSrc | String | URL of a marker image (for KML points styling). Default is an orange marker. |
         * | defaultStyles.KML.markerXAnchor | Float | Position of marker anchor in X from left of the image expressed in proportion of 1 (for KML points styling). Default is 25.5 |
         * | defaultStyles.KML.markerYAnchor | Float | Position of marker anchor in Y from top of the image expressed in proportion of 1 (for KML points styling). Default is 38 |
         * | defaultStyles.KML.strokeColor | String | Stroke color for KML lines styling (RGB hex value). Default is "#002A50" |
         * | defaultStyles.KML.strokeWidth | Number | Stroke width in pixels for KML lines styling. Default is 4 |
         * | defaultStyles.KML.strokeOpacity | Number | Stroke opacity for KML lines styling (alpha value between 0:transparent and 1:opaque). Default is 0.8 |
         * | defaultStyles.KML.polyFillColor | String | KML polygons fill color (RGB hex value). Default is "#00B798" |
         * | defaultStyles.KML.polyFillOpacity | Number | KML polygons fill opacity (alpha value between 0:transparent and 1:opaque). Default is 0.5 |
         * | defaultStyles.GPX | Object | Styles to apply by default to imported GPX layers |
         * | defaultStyles.GPX.markerSrc | String | URL of a marker image (for GPX waypoints styling). Default is an orange marker. |
         * | defaultStyles.GPX.markerXAnchor | Float | Position of marker anchor in X from left of the image expressed in proportion of 1 (for GPX waypoints styling). Default is 25.5 |
         * | defaultStyles.GPX.markerYAnchor | Float | Position of marker anchor in Y from top of the image expressed in proportion of 1 (for GPX waypoints styling). Default is 38 |
         * | defaultStyles.GPX.strokeColor | String | Stroke color for GPX routes or tracks styling (RGB hex value). Default is "#002A50" |
         * | defaultStyles.GPX.strokeWidth | Number | Stroke width in pixels for GPX routes or tracks styling. Default is 4 |
         * | defaultStyles.GPX.strokeOpacity | Number | Stroke opacity for GPX routes or tracks styling (alpha value between 0:transparent and 1:opaque). Default is 0.8 |
         * | defaultStyles.GeoJSON | Object | Styles to apply by default to imported GeoJSON layers |
         * | defaultStyles.GeoJSON.markerSrc | String | URL of a marker image (for GeoJSON points styling). Default is an orange marker. |
         * | defaultStyles.GeoJSON.markerXAnchor | Float | Position of marker anchor in X from left of the image expressed in proportion of 1 (for GeoJSON points styling). Default is 25.5 |
         * | defaultStyles.GeoJSON.markerYAnchor | Float | Position of marker anchor in Y from top of the image expressed in proportion of 1 (for GeoJSON points styling). Default is 38 |
         * | defaultStyles.GeoJSON.strokeColor | String | Stroke color for GeoJSON lines styling (RGB hex value). Default is "#002A50" |
         * | defaultStyles.GeoJSON.strokeWidth | Number | Stroke width in pixels for GeoJSON lines styling. Default is 4 |
         * | defaultStyles.GeoJSON.strokeOpacity | Number | Stroke opacity for GeoJSON lines styling (alpha value between 0:transparent and 1:opaque). Default is 0.8 |
         * | defaultStyles.GeoJSON.polyFillColor | String | GeoJSON polygons fill color (RGB hex value). Default is "#00B798" |
         * | defaultStyles.GeoJSON.polyFillOpacity | Number | GeoJSON polygons fill opacity (alpha value between 0:transparent and 1:opaque). Default is 0.5 |
         *
         * <a id="length"></a>
         *
         * ### Options for "length" control
         *
         * | property | Type | Description |
         * | - | - | - |
         * | div | String / DOMElement | Target HTML element container or its id. Default is chosen by map implementation.
         * | styles | Object | Styles to use to display the distance |
         * | styles.pointer | Object | Pointer (circle) style while measuring |
         * | styles.pointer.strokeColor | String | Stroke color |
         * | styles.pointer.strokeWidth | Number | Stroke width in pixels |
         * | styles.pointer.radius | Number | Circle radius in pixels |
         * | styles.pointer.fillColor | String | Circle fill color |
         * | styles.start | Object | Styles to use to display the distance while measuring |
         * | styles.start.strokeColor | String | Stroke color |
         * | styles.start.strokeWidth | Number | Stroke width in pixels |
         * | styles.start.strokeLineDash | Array(Number) | Line dash pattern : line and spaces widths |
         * | styles.finish | Object | Styles to use to display the distance when measure is finished |
         * | styles.finish.strokeColor | String | Stroke color |
         * | styles.finish.strokeWidth | Number | Stroke width in pixels |
         * | styles.finish.strokeLineDash | Array(Number) | Line dash pattern : line and spaces widths |
         * | geodesic | Boolean | If true (default), use geodesic method to compute the distance |
         *
         * <a id="area"></a>
         *
         * ### Options for "area" control
         *
         * | property | Type | Description |
         * | - | - | - |
         * | div | String / DOMElement | Target HTML element container or its id. Default is chosen by map implementation.
         * | styles | Object | Styles to use to display the polygon area |
         * | styles.pointer | Object | Pointer (circle) style while measuring |
         * | styles.pointer.strokeColor | String | Stroke color |
         * | styles.pointer.strokeWidth | Number | Stroke width in pixels |
         * | styles.pointer.radius | Number | Circle radius in pixels |
         * | styles.pointer.fillColor | String | Circle fill color |
         * | styles.start | Object | Styles to use to display the polygon area while measuring |
         * | styles.start.strokeColor | String | Stroke color |
         * | styles.start.strokeWidth | Number | Stroke width in pixels |
         * | styles.start.strokeLineDash | Array(Number) | Line dash pattern : line and spaces widths |
         * | styles.start.fillColor | String | Polygon fill color |
         * | styles.finish | Object | Styles to use to display the polygon area when measure is finished |
         * | styles.finish.strokeColor | String | Stroke color |
         * | styles.finish.strokeWidth | Number | Stroke width in pixels |
         * | styles.finish.strokeLineDash | Array(Number) | Line dash pattern : line and spaces widths |
         * | styles.finish.fillColor | String | Polygon fill color |
         * | geodesic | Boolean | If true (default), use geodesic method to compute the distance |
         *
         * <a id="azimuth"></a>
         *
         * ### Options for "azimuth" control
         *
         * | property | Type | Description |
         * | - | - | - |
         * | div | String / DOMElement | Target HTML element container or its id. Default is chosen by map implementation.
         * | styles | Object | Styles to use to display the azimuth line |
         * | styles.pointer | Object | Pointer (circle) style while measuring |
         * | styles.pointer.strokeColor | String | Stroke color |
         * | styles.pointer.strokeWidth | Number | Stroke width in pixels |
         * | styles.pointer.radius | Number | Circle radius in pixels |
         * | styles.pointer.fillColor | String | Circle fill color |
         * | styles.start | Object | Styles to use to display the azimuth line while measuring |
         * | styles.start.strokeColor | String | Stroke color |
         * | styles.start.strokeWidth | Number | Stroke width in pixels |
         * | styles.start.strokeLineDash | Array(Number) | Line dash pattern : line and spaces widths |
         * | styles.finish | Object | Styles to use to display the azimuth line when measure is finished |
         * | styles.finish.strokeColor | String | Stroke color |
         * | styles.finish.strokeWidth | Number | Stroke width in pixels |
         * | styles.finish.strokeLineDash | Array(Number) | Line dash pattern : line and spaces widths |
         * | geodesic | Boolean | If false (default), not use geodesic method to compute the distance |
         *
         * <a id="elevationpath"></a>
         *
         * ### Options for "elevationpath" control
         *
         * | property | Type | Description |
         * | - | - | - |
         * | div | String / DOMElement | Target HTML element container or its id. Default is chosen by map implementation.
         * | styles | Object | Styles to use to display the polygon area |
         * | styles.pointer | Object | Pointer (circle) style while measuring |
         * | styles.pointer.strokeColor | String | Stroke color |
         * | styles.pointer.strokeWidth | Number | Stroke width in pixels |
         * | styles.pointer.radius | Number | Circle radius in pixels |
         * | styles.pointer.fillColor | String | Circle fill color |
         * | styles.start | Object | Styles to use to display the polygon area while measuring |
         * | styles.start.strokeColor | String | Stroke color |
         * | styles.start.strokeWidth | Number | Stroke width in pixels |
         * | styles.start.strokeLineDash | Array(Number) | Line dash pattern : line and spaces widths |
         * | styles.start.fillColor | String | Polygon fill color |
         * | styles.finish | Object | Styles to use to display the polygon area when measure is finished |
         * | styles.finish.strokeColor | String | Stroke color |
         * | styles.finish.strokeWidth | Number | Stroke width in pixels |
         * | styles.finish.strokeLineDash | Array(Number) | Line dash pattern : line and spaces widths |
         * | styles.finish.fillColor | String | Polygon fill color |
         * | styles.marker | Object | Style for marker displayed on map when the user follows the elevation path.  |
         * | styles.marker.src | String | URL of a marker image. |
         * | styles.marker.xAnchor | Float | position of marker anchor in X from left of the image expressed in proportion of 1. |
         * | styles.marker.yAnchor | Float | position of marker anchor in Y from top of the image expressed in proportion of 1. |
         * | elevationPathOptions | Object | elevation path service options. See [Gp.Services.getAltitude()](http://ignf.github.io/geoportal-access-lib/latest/jsdoc/module-Services.html#~getAltitude) for available options |
         * | displayProfileOptions | Object | Options for displaying the profile |
         * | displayProfileOptions.apply | Function | function to display profile if you want to cutomise it. By default, built-in [DISPLAY_PROFILE_BY_DEFAULT()](http://ignf.github.io/geoportal-extensions/ol3-latest/jsdoc/ol.control.ElevationPath.html#.DISPLAY_PROFILE_BY_DEFAULT) is used. You may also provide your own function using the same signature. |
         * | displayProfileOptions.target | Object | DOM container to use to display the profile. |
         *
         * <a id="searchctrl"></a>
         *
         * ### Options for "search" control
         *
         * | property | Type | Description |
         * | - | - | - |
         * | div | String / DOMElement | Target HTML element container or its id. Default is chosen by map implementation.
         * | maximised | Boolean | if the control has to be opened or not. |
         * | resources | Object | resources to be used by geocode and autocompletion services |
         * | resources.geocode | Array(String) | resources geocoding, by default : ["PositionOfInterest", "StreetAddress"] |
         * | resources.autocomplete | Array(String) | resources autocompletion, by default : ["PositionOfInterest", "StreetAddress"] |
         * | displayAdvancedSearch | Boolean | True to display advanced search tools. Default is false (not displayed) |
         * | advancedSearch | Object | advanced search options for geocoding (filters). Properties can be found among geocode options.filterOptions (see http://depot.ign.fr/geoportail/bibacces/develop/doc/module-Services.html#~geocode) |
         * | geocodeOptions | Object | options of geocode service (see http://depot.ign.fr/geoportail/bibacces/develop/doc/module-Services.html#~geocode) |
         * | autocompleteOptions | Object | options of autocomplete service (see http://depot.ign.fr/geoportail/bibacces/develop/doc/module-Services.html#~autoComplete) |
         *
         * <a id="reversesearch"></a>
         *
         * ### Options for "reversesearch" control
         *
         * | property | Type | Description |
         * | - | - | - |
         * | div | String / DOMElement | Target HTML element container or its id. Default is chosen by map implementation.
         * | maximised | Boolean | if the control has to be opened or not. |
         * | resources | Array(String) | resources geocoding, by default : ["PositionOfInterest", "StreetAddress"] |
         * | displayAdvancedSearch | Boolean | False to disable advanced search tools (it will not be displayed). Default is true (displayed) |
         * | delimitations | Array(String) | delimitations for reverse geocoding, by default : ["Point", "Circle", "Extent"]. Possible values are : "Point", "Circle", "Extent". Delimitations will be displayed in the same order in widget list. |
         * | reverseGeocodeOptions | Object | reverse geocode service options. see http://depot.ign.fr/geoportail/bibacces/develop/doc/module-Services.html#~reverseGeocode to know all reverse geocode options. |
         *
         * <a id="drawing"></a>
         *
         * ### Options for "drawing" control
         *
         * | property | Type | Description |
         * | - | - | - |
         * | div | String / DOMElement | Target HTML element container or its id. Default is chosen by map implementation.
         * | maximised | Boolean | if the control has to be opened or not. |
         * | layer | String | layerId to be used by drawing tool. If none, an empty layer will be created, with id : "drawing-xxx". |
         * | tools | Object | tools to be proposed by drawing tools box. All tools will be proposed by default. |
         * | tools.points | Boolean | Display points drawing tool |
         * | tools.lines | Boolean | Display lines drawing tool |
         * | tools.polygons | Boolean | Display polygons drawing tool |
         * | tools.text | Boolean | Display text drawing tool |
         * | tools.remove | Boolean | Display feature removing tool |
         * | tools.display | Boolean | Display style editing tool |
         * | tools.edit | Boolean | Display editing tool |
         * | tools.export | Boolean | Display exporting tool |
         * | labels | Object | labels to be used instead of defaults for drawing tools. |
         * | labels.control | String | Label for Control |
         * | labels.points | String | Label for points drawing tool |
         * | labels.lines | String | Label for lines drawing tool |
         * | labels.polygons | String | Label for polygons drawing tool |
         * | labels.text | String | Label for text drawing tool |
         * | labels.edit | String | Label for editing tool |
         * | labels.display | String | Label for style editing tool |
         * | labels.remove | String | Label for feature removing tool |
         * | labels.export | String | Label for exporting tool. |
         * | labels.exportTitle | String | Title for exporting tool. |
         * | labels.applyToObject | String | Label for apply to abject button. |
         * | labels.setAsDefault | String | Label for set as default style button. |
         * | labels.strokeColor | String | Label for stroke color. |
         * | labels.strokeWidth | String | Label for stroke width. |
         * | labels.fillColor | String | Label for fill color. |
         * | labels.fillOpacity | String | Label for fillOpacity. |
         * | markersList | Array(Object) | Array of markers urls and offsets to be used for points styling. |
         * | markersList.src | String | URL of a marker image. |
         * | markersList.xAnchor | Float | position of marker anchor in X from left of the image expressed in proportion of 1. |
         * | markersList.yAnchor | Float | position of marker anchor in Y from top of the image expressed in proportion of 1. |
         * | defaultStyles | Object | Styles to apply by default to drawn features. |
         * | defaultStyles.textFillColor | String | Text fill color for labels (RGB hex value). |
         * | defaultStyles.textStrokeColor | String | Text surrounding color for labels (RGB hex value). |
         * | defaultStyles.strokeColor | String | Stroke color (RGB hex value). |
         * | defaultStyles.polyFillColor | String | Polygons fill color (RGB hex value). |
         * | defaultStyles.polyFillOpacity | Number | Polygon fill opacity (alpha value between 0:transparent and 1:opaque). |
         * | defaultStyles.strokeWidth | Number | Stroke width in pixels. |
         * | cursorStyle | Object | cursor (circle) style when drawing or editing. |
         * | cursorStyle.fillColor | String | Cursor fill color. |
         * | cursorStyle.strokeColor | String | Cursor stroke color. |
         * | cursorStyle.strokeWidth | String | Cursor surrounding stroke width. |
         * | cursorStyle.radius | String | Cursor radius. |
         *
         * <a id="attributions"></a>
         *
         * ### Options for "attributions" control
         *
         * | property | Type | Description |
         * | - | - | - |
         * | div | String / DOMElement | Target HTML element container or its id. Default is chosen by map implementation.
         * | maximised | Boolean | if the control has to be opened or not. |
         *
         *
         * @namespace
         * @alias Gp.ControlOptions
         *
         */
        var controlOptions = {
        } ;

        /**
        *
        * Options for vector layers styling (KML, GPX, GeoJSON)
        *
        * @namespace
        * @alias Gp.StyleOptions
        *
        * @property {String} markerSrc - URL of a marker image (for points styling). Default is an orange marker.
        * @property {Float} markerXAnchor - Position of marker anchor in X from left of the image expressed in pixels (for points styling). Default is 25.5.
        * @property {Float} markerYAnchor - Position of marker anchor in Y from top of the image expressed in pixels (for points styling). Default is 38.
        * @property {String} strokeColor - Stroke color for lines or polygons border styling (RGB hex value). Default is "#002A50".
        * @property {Number} strokeWidth - Stroke width in pixels for lines or polygons border styling. Default is 4.
        * @property {Number} strokeOpacity - Stroke opacity for lines or polygons border styling (alpha value between 0:transparent and 1:opaque). Default is 0.8.
        * @property {String} polyFillColor - Polygons fill color (RGB hex value). Default is "#00B798".
        * @property {Number} polyFillOpacity - Polygons fill opacity (alpha value between 0:transparent and 1:opaque). Default is 0.5.
        * @property {String} textColor - Text fill color for labels (RGB hex value). Default is "#FFFFFF".
        * @property {String} textStrokeColor - Text surrounding color for labels (RGB hex value). Default is "#000000".
        */
        var styleOptions = {
        };

        return Map;
    });
