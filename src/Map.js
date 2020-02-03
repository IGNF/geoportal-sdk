/**
 * Map centering information object.
 *
 * * Use x,y and projection properties to center the map with coordinates ;
 * * Use location and locationType properties to center the map thanks to [Geoportal geocoding web service](https://geoservices.ign.fr/documentation/geoservices/geocodage.html).
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
};

/**
 * **Common 2D/3D event**
 *
 * Point object.
 *
 * @namespace
 * @alias Gp.Point
 *
 * @property {Float} x - Point abscissa
 * @property {Float} y - Point ordinate
 */
var point = {
};

/**
 * **Common 2D/3D event**
 *
 * Center Changed Event. Triggered when the map's center has changed.<br/>
 * One can listen to this event with [Gp.Map.listen()](Gp.Map.html#.listen) method
 *
 * @namespace
 * @alias Gp.CenterChangedEvent
 *
 * @property {Gp.Center} oldCenter - old center coordinates
 * @property {Gp.Center} newCenter - new center coordinates
 */
var centerChangedEvent = {
};

/**
 * **Common 2D/3D event**
 *
 * ZoomChanged Event.
 *
 * @namespace
 * @alias Gp.ZoomChangedEvent
 *
 * @property {Float} oldZoom - old map zoom
 * @property {Float} newZoom - new map zoom
 */
var zoomChangedEvent = {
};

/**
 * **Common 2D/3D event**
 *
 * Azimuth Changed Event. Triggered when the map's orientation has changed.<br/>
 * One can listen to this event with [Gp.Map.listen()](Gp.Map.html#.listen) method
 *
 * @namespace
 * @alias Gp.AzimuthChangedEvent
 *
 * @property {Float} oldAzimuth - old map azimuth
 * @property {Float} newAzimuth - new map azimuth
 */
var azimuthChangedEvent = {
};

/**
 * **Specific 3D event**
 *
 * Tilt Changed Event. Triggered when the map's tilt has changed.<br/>
 * One can listen to this event with [Gp.Map.listen()](Gp.Map.html#.listen) method
 *
 * @namespace
 * @alias Gp.TiltChangedEvent
 *
 * @property {Float} oldTilt - old map tilt
 * @property {Float} newTilt - new map tilt
 */
var tiltChangedEvent = {
};

/**
 * **Common 2D/3D event**
 *
 * LayerChanged Event. Triggered when one of the map's layers has changed in some way : <br/>
 * * If a layer has be removed from the map, property **layerRemoved** will host the removed layer definition.
 * * If a layer has be added to the map, property **layerAdded** will host the added layer definition.
 * * If properties (among *visibility*, *opacity*, *position* and *grayScaled*) of a layer has changed, property **layerChanged** will host the modified layer definition and **property**, **oldValue** and **newValues** will host the modified property with its old and new value.
 * <br/>
 * One can listen to this event with [Gp.Map.listen()](Gp.Map.html#.listen) method
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
};

/**
 * **Common 2D/3D object**
 *
 * Geolocated Event. Triggered when the map's center has changed by user geo-localization.<br/>
 * One can listen to this event with [Gp.Map.listen()](Gp.Map.html#.listen) method
 *
 * @namespace
 * @alias Gp.GeolocatedEvent
 *
 * @property {Gp.Point} position - the position returned by geolocalisation
 */
var geolocatedEvent = {
};

/**
 * **Common 2D/3D event**
 *
 * Located Event. Triggered when the map's center has changed by geocoding.<br/>
 * One can listen to this event with [Gp.Map.listen()](Gp.Map.html#.listen) method
 *
 * @namespace
 * @alias Gp.LocatedEvent
 *
 * @property {Gp.Point} position - the position returned by localisation
 */
var locatedEvent = {
};

/**
 * **Common 2D/3D event**
 *
 * Configured Event. Triggered when the map has finished to configure itself with the given apiKey at startup.<br/>
 * One can listen to this event with [Gp.Map.load()](module-Utils_MapLoader.html) function through the **mapEventsOptions** property of {@link Gp.MapOptions} parameter.<br/>
 * *NB* : for a full map availability at startup you'd better listen to {@link Gp.MapLoadedEvent}.
 *
 * @namespace
 * @alias Gp.ConfiguredEvent
 *
 * @property {Gp.Services.GetConfigResponse} config - Geoportal access configuration. See [Gp.Services.GetConfigResponse](https://ignf.github.io/geoportal-access-lib/latest/jsdoc/Gp.Services.GetConfigResponse.html) definition in geoportal-access-lib documentation.
 */
var configuredEvent = {

};
/**
 * **Common 2D/3D event**
 *
 * Map Loaded Event. Triggered at startup when the map has finished to load and is ready to be commanded with {@link Gp.Map} object methods.<br/>
 * One can listen to this event with [Gp.Map.load()](module-Utils_MapLoader.html) function through the **mapEventsOptions** property of {@link Gp.MapOptions} parameter.<br/>
 *
 * @namespace
 * @alias Gp.MapLoadedEvent
 *
 * @property {Gp.Map} map - loaded Map
 */
var mapLoadedEvent = {
};

/**
 * Map options object.
 *
 * Holds options for map creation when using [Gp.Map.load()](module-Utils_MapLoader.html) function.
 *
 * Availables options are described below.
 *
 * * **Common 2D/3D properties**
 *
 * | property | Type | Argument | Default | Description |
 * | - | - | - | - | - |
 * | apiKey | String / Array.<String> | | | access key(s) to Geoportal platform, obtained [here](http://professionnels.ign.fr/ign/contrats) |
 * | viewMode | String | optional | "2d" | Library to load the map with. Values are : <ul> <li> "2d" (default) to load the map with OpenLayers (2D) </li> <li>"3d" to be able to use 2D (OpenLayers) and 3D (iTowns) views. In this case, you have to use GpSDK3D.js file (instead of GpSDK2D.js)</li></ul> |
 * | center | {@link Gp.Center Gp.Center} | optional | | Map Centering information. Either with coordinates, with geoportal geocoding service or with user geo-localization. |
 * | azimuth | Float | optional | 0 | Map orientation in decimal degrees clockwise to the north. |
 * | zoom | Integer / Float | optional | 10 | Zoom level, between 0 (world wide zoom) and 21 (street wide zoom). |
 * | defaultFeaturesStyle | {@link Gp.StyleOptions Gp.StyleOptions} | optional | | Default style options for vector layers features (KML, GPX, GeoJSON). |
 * | layersOptions | Object | optional | | Layers to add to the map and their options. Associative array mapping ids of layers to display and their properties.<br/>For each layer, the id may be either the name of a Geoportal layer (eg : "ORTHOIMAGERY.ORTHOPHOTOS") available with the given apiKey or an id of your choice for external resources. The properties associated to each ID are given as {@link Gp.LayerOptions}.<br/>For Geoportal Layers availables with the given apiKey, values are automaticaly fetched from key configuration. You only need to specify a {@link Gp.LayerOptions} Object with properties you want to overide. |
 * | controlsOptions | Object | optional | | Controls to add to the map and their options. Associative array mapping the control's name (keys) with a Boolean (value) for activating / deactivating or with their properties (values given as {@link Gp.ControlOptions}). See {@link Gp.ControlOptions} for availables controls list and their properties. |
 * | mapEventsOptions | Object | optional | | Map's events to listen for interaction. Associative array mapping an event from the map (keys) with a function triggered by this event (values given as {Function}). See {@link Gp.Map#listen Gp.Map.listen()} for available event Ids and their associated events objects. |
 * | minZoom | Integer | optional | 0 | Zoom level beyond which the user can't zoom out. |
 * | maxZoom | Integer | optional | 21 | Zoom level beyond which the user can't zoom in. |
 * | configUrl or AutoConfUrl | String | optional | | Geoportal config url to use instead of the default dynamic configuration service based on apiKey param. See this [tutorial](http://ignf.github.io/geoportal-access-lib/latest/jsdoc/tutorial-optimize-getconfig.html) to generate a config file suitable with this parameter. |
 * | proxyUrl | String | optional | | Proxy URL to avoid cross-domain problems on external resources. Only use if you know what you're doing. |
 * | noProxyDomains | Array.<String> | optional | | Proxy will not be used for this list of domain names. Only use if you know what you're doing. |
 *
 * * **Specific 2D options**
 *
 * | property | Type | Argument | Default | Description |
 * | - | - | - | - | - |
 * | enableRotation | Boolean | optional | true | Map rotation. Default is true. If false a rotation constraint that always sets the rotation to zero is used. |
 * | markersOptions | Array.<{@link Gp.MarkerOptions Gp.MarkerOptions}> | optional | | Options for displaying markers on the map. |
 * | projection | String | optional | "EPSG:3857" | Projection code (in EPSG or IGNF register) for the map. Not available in 3D as the projection is always "EPSG:4326" |
 *
 * * **Specific 3D options**
 *
 * | property | Type | Argument | Default | Description |
 * | - | - | - | - | - |
 * | tilt | Float | optional | 0 | Camera gradient in decimal degrees. 0 for a vertical view. 90 for an horizontal view. |
 *
 *
 * @namespace
 * @alias Gp.MapOptions
 *
 */
var mapOptions = {
    /*
 * undocumented options - for the moment
 * @property {Boolean} [reloadConfig=false] - If true, the autoconfiguration service is reload for loading the map. If false, the previous autoconfiguration result is used. This option is used if configUrl is not specified. Only use if you know what you're doing.
 */
};

/**
 * **Specific 2D options**
 *
 * Marker options object.
 *
 * Holds options for marker to display on the map at startup. To be used for map creation (See markersOptions property of {@link Gp.MapOptions} object used as a parameter of [Gp.Map.load()](module-Utils_MapLoader.html) function).
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
 * @property {Gp.AutoPanOptions} autoPanOptions - Defines autoPan options for popups.
 */
var markerOptions = {
};

/**
 * **Specific 2D options**
 *
 * AutoPan options object.
 *
 * Holds options to define autopan behaviour for popups displaying when they overlap the borders of the map.
 *
 * @namespace
 * @alias Gp.AutoPanOptions
 *
 * @property {Boolean} [autoPan = true] - If true, then autoPan is activated.
 * @property {Number} [duration = 250] - Duration (in ms) of autoPan animation when autoPan is set to true.
 * @property {Number} [margin = 5] - Size (in px) of the space between the border of the map and the border of the popup when autoPan is set to true and occurs.
 */
var autoPanOptions = {
};

/**
 * Layer options object.
 *
 * Holds options for a specific layer present on the map. May be used at map creation (See **layersOptions** property of {@link Gp.MapOptions} object used as a parameter of [Gp.Map.load()](module-Utils_MapLoader.html) function) or for map modification (See [Gp.Map.addLayers()](Gp.Map.html#.addLayers) or [Gp.Map.modifyLayers()](Gp.Map.html#.modifyLayers)).
 *
 * Given a specific layer type, availables options are the following :
 *
 * ### Common properties
 *
 * **Common 2D/3D properties**
 *
 * | property | Type | Description |
 * | - | - | - |
 * | format | String | The layer's format. Supported values are : 'kml', 'gpx', 'geojson', 'wmts', 'wms', 'wfs', 'mapbox' or 'osm'. This property is optionnal for Geoportal layers but mandatory for others. |
 * | url | String | Mandatory for non Geoportal layers. The url to the file or the Web Service providing the layer. |
 * | title | String | The layer's name displayed in the LayerSwitcher control. |
 * | description | String | The layer's description. |
 * | opacity | Float | The layer's opacity (between 0 and 1). Default value is 1. |
 * | visibility | Boolean |  If true, the layer is visible. Default value is true. |
 * | minZoom | Integer | If the current zoom level is lower than the minZoom of the layer, the layer is not displayed. Default value is given by the autoconfiguration service for Geoportal layers. For others layers, default value is the minZoom of the map. |
 * | maxZoom | Integer | If the current zoom level is upper than the maxZoom of the layer, the layer is not displayed. Default value is given by the autoconfiguration service for Geoportal layers. For others layers, default value is the maxZoom of the map. |
 * | position | Number | The layer's position in map, compared to other layers positions. Allows to organize layers order explicitely. By default the layer will be displayed above other layers. |
 * | legends | Array[[Gp.Services.Config.Legend](https://ignf.github.io/geoportal-access-lib/latest/jsdoc/Gp.Services.Config.Legend.html)] | The layer's legends links. |
 * | metadata | Array[[Gp.Services.Config.Metadata](https://ignf.github.io/geoportal-access-lib/latest/jsdoc/Gp.Services.Config.Metadata.html)] | The layer's metadata links. |
 * | originators | Array[[Gp.Services.Config.Originator](https://ignf.github.io/geoportal-access-lib/latest/jsdoc/Gp.Services.Config.Originator.html)] | Options about the layers's providers. |
 *
 * ### WMTS specific properties
 *
 * **Common 2D/3D properties**
 *
 * | property | Type | Description |
 * | - | - | - |
 * | layer | String | The layer's Identifier to add (found in GetCapabilities response). |
 * | tileMatrixSet | String | The name of the layer's TileMatrixSet (see in GetCapabilities response). |
 * | topLeftCorner | Gp.Point | The layer's origin coordinates (found in GetCapabilities response). |
 * | resolutions | Array[Float] | The layer's resolutions list (found in GetCapabilities response). |
 * | matrixIds | Array[String] | The layer's zoom levels ids (found in GetCapabilities response). |
 * | outputFormat | String | The output image format (Mime-type) |
 * | styleName | String | The layer's style name to apply (found in GetCapabilities response). |
 *
 * **Specific 2D properties**
 *
 * | property | Type | Description |
 * | - | - | - |
 * | grayScaled | Boolean |  If true, the layer is displayed in gray-scale. |
 * | queryable | Boolean | If true, user clicks on map will trigger getFeatureInfo request on the layer. Not yet implemented for WMTS. |
 * | gfiFormat | String | If queryable == true, indicates the format mime-type of the response of GetFeatureInfo requests. default : "text/html". Not yet implemented for WMTS. |
 *
 *
 * **Specific 3D properties**
 *
 * | property | Type | Description |
 * | - | - | - |
 * | tileMatrixSetLimits | Object | Tiles limits of the tileMatrixSet used. |
 * | type | String | If "elevation", the layer is displayed as an elevation layer (DTM). Else, set "color" |
 *
 * ### KML specific properties
 *
 * **Common 2D/3D properties**
 *
 * | property | Type | Description |
 * | - | - | - |
 * | extractStyles | Boolean | If true, the styles of the features are recovered from the kml file. True by default |
 *
 * **Specific 2D properties**
 *
 * | property | Type | Description |
 * | - | - | - |
 * | showPointNames | Boolean | If true, show names as labels for placemarks which contain points. |
 * | zoomToExtent | Boolean | If true, zoom into the extent of features. |
 * | projection | String | coordinate reference system id used for Layer (default is map projection) |
 *
 * ### MapBox specific properties
 *
 * **Common 2D/3D properties**
 *
 * | property | Type | Description |
 * | - | - | - |
 * | url | String | The url to the style file of the layer (style.json) |
 *
 * **Specific 2D properties**
 *
 * | property | Type | Description |
 * | - | - | - |
 * | urlService | String | - |
 * | outputFormat | String | - |
 * | projection | String | - |
 * | defaultStyleName | String | - |
 * | defaultStyleThumbnail | String | - |
 * | defaultStyleDescription | String | - |
 * | stylesSummary | String | - |
 * | styles | {@link Gp.MapboxStylesOptions} | options for layer styles |
 * | filtersSummary | String | - |
 * | filters | {@link Gp.FiltersOptions} | options for layer filters |
 * | queryable | Boolean | If true, user clicks on map will trigger getFeatureInfo request on the layer |
 * | grayScaled | Boolean |  If true, the layer is displayed in gray-scale. |
 * | mapboxOptions | Object | - |
 * | zoomToExtent | Boolean | If true, zoom into the extent of features. |
 *
 * ### KML, GPX, GeoJSON and MapBox specific properties
 *
 * **Common 2D/3D properties**
 *
 * | property | Type | Description |
 * | - | - | - |
 * | styleOptions | {@link Gp.StyleOptions} | options for layer style (points, strokes, polygons) |
 *
 * ### WMS specific properties
 *
 * **Common 2D/3D properties**
 *
 * | property | Type | Description |
 * | - | - | - |
 * | layers | Array[String] layers | List of layer's identifiers to add (found in GetCapabilities response). |
 * | version | String | The version of the Web Service providing the layer. Default : "1.3.0" |
 * | stylesNames | Array[String] | List of the styles names to apply to layers (see in GetCapabilities response). |
 * | outputFormat | String | The output image format (Mime-type) |
 * | projection | String | Coordinate reference system id used for Layer (default is map projection) |
 *
 * **Specific 2D properties**
 *
 * | property | Type | Description |
 * | - | - | - |
 * | grayScaled | Boolean |  If true, the layer is displayed in gray-scale. |
 * | queryable | Boolean | If true, user clicks on map will trigger getFeatureInfo request on the layer. |
 * | gfiFormat | String | If queryable == true, indicates the format mime-type of the response of GetFeatureInfo requests. default : "text/html" |
 * | backgroundColor | String | The layer's background RVB color in hexadecimal. |
 * | tiled | Boolean | If true, map will load WMS layer in a tiled way. Otherwise, layer will be displayed with an unique GetMap request covering the whole map view (default). |
 *
 * **Specific 3D properties**
 *
 * | property | Type | Description |
 * | - | - | - |
 * | bbox | Array[Float] | Bounding box where to display the layer. The array must be "[west, south, east, north]". If the layer is in PM, the bbox needs to be in planar coordinates. World extent by default |
 * | type | String | If "elevation", the layer is displayed as an elevation layer (DTM) |
 *
 * ### Elevation Layers specific properties
 *
 * **To add a Digital Terrain Model Layer (DTM) in WMS or WMTS, the property "type" of the layerOptions must be set to "elevation"**
 *
 * | property | Type | Description |
 * | - | - | - |
 * | type | String | If "elevation", the layer is displayed as an elevation layer (DTM) in 3D, and hidden in 2D (else, set "color") |
 *
 * ### WFS specific properties
 *
 * **Specific 2D properties**
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
 * @todo finish description for tile vector layer (MapBox)
 *
 */
var layerOptions = {
};

/**
 * Control options object.
 *
 * Holds options for a specific control present on the map. May be used for map creation (See **controlsOptions** property of {@link Gp.MapOptions} object used as a parameter of [Gp.Map.load()](module-Utils_MapLoader.html) function) or for map modification (See [Gp.Map.addControls()](Gp.Map.html#.addControls) or [Gp.Map.modifyControls()](Gp.Map.html#.modifyControls)).
 *
 * Given a specific control, availables options are the following :
 *
 * <a id="zoom"></a>
 *
 * ### Options for "zoom" control
 *
 * **Specific 2D options**
 *
 * | property | Type | Description |
 * | - | - | - |
 * | div | String / DOMElement | Target HTML element container or its id. Default is chosen by map implementation. |
 *
 * <a id="overview"></a>
 *
 * ### Options for "overview" control
 *
 * **Common 2D/3D options**
 *
 * | property | Type | Description |
 * | - | - | - |
 * | div | String / DOMElement | Target HTML element container or its id. Default is chosen by map implementation. |
 * | maximised | Boolean | If the control has to be opened or not. |
 *
 * **Specific 2D options**
 *
 * | property | Type | Description |
 * | - | - | - |
 * | layers | Array(String) | List of layers Ids to be displayed on the overview map (may be part of main map layersId or a geoportal WMTS layer ID). If none, all main map layers will be used. |
 * | minZoom | Number | min zoom level for overview map. |
 * | maxZoom | Number | max zoom level for overview map. |
 * | projection | String | projection code for overview map. |
 *
 * **Specific 3D options**
 *
 * | property | Type | Description |
 * | - | - | - |
 * | position | String | The type of positionment of the overview element inside its container. Can be "absolute" or "relative" ("absolute" by default) |
 * | width | Number | The width of the minimap (100px by default) |
 * | heigth | Number | The height of the minimap (100px by default) |
 * | x | Number | The position of the minimap from the left of the container div (20px by default) |
 * | y | Number | The position of the minimap from the bottom of the container div (20px by default) |
 *
 * <a id="orientation"></a>
 *
 * ### Options for "orientation" control
 *
 * **Specific 2D options**
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
 * **Common 2D/3D options**
 *
 * | property | Type | Description |
 * | - | - | - |
 * | div | String / DOMElement | Target HTML element container or its id. Default is chosen by map implementation.
 *
 * **Specific 2D options**
 *
 * | property | Type | Description |
 * | - | - | - |
 * | units | String | Units to display : "deg" (degrees) or "m" (metric values). |
 * | minWidth | Number | Minimum width in pixels. Default is 64. |
 *
 * **Specific 3D options**
 *
 * | property | Type | Description |
 * | - | - | - |
 * | maximised | Boolean | Display or not the control |
 * | x | Number | The position of the minimap from the left of the container div (20px by default) |
 * | y | Number | The position of the minimap from the bottom of the container div (20px by default) |
 *
 * <a id="mouseposition"></a>
 *
 * ### Options for "mouseposition" control
 *
 * **Common 2D/3D options**
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
 * **Specific 2D options**
 *
 * | property | Type | Description |
 * | - | - | - |
 * | editCoordinates | Boolean | Allows users to change map center by giving their coordinates. False by default. |
 * | positionMarker | Object | options for a position marker to use when editingCoordinates. |
 * | positionMarker.url | String | Marker url |
 * | positionMarker.offset | Array(Number) | Offsets in pixels used when positioning the marker towards targeted point. The *first element* in the array is the horizontal offset. A positive value shifts the marker right. The *second element* in the array is the vertical offset. A positive value shifts the marker down. [0,0] value positions the top-left corner of the marker image to the targeted point. Default is offset associated to default marker image. |
 * | positionMarker.hide | Boolean | If true, marker is not displayed, otherwise displayed (False by default.) |
 *
 *
 * <a id="route"></a>
 *
 * ### Options for "route" control
 *
 * **Specific 2D options**
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
 * | routeOptions | Object | route service options. For advanced use only. See {@link https://ignf.github.io/geoportal-access-lib/latest/jsdoc/module-Services.html#~route Gp.Services.route()} to know all route options. |
 * | autocompleteOptions | Object | autocomplete service options. See {@link https://ignf.github.io/geoportal-access-lib/latest/jsdoc/module-Services.html#~autoComplete Gp.Services.autoComplete()} to know all autocomplete options. |
 *
 * <a id="isocurve"></a>
 *
 * ### Options for "isocurve" control
 *
 * **Specific 2D options**
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
 * | markerOpts.offset | Array | Offsets in pixels used when positioning the overlay. The first element in the array is the horizontal offset. A positive value shifts the overlay right. The second element in the array is the vertical offset. A positive value shifts the overlay down. Default is [0, 0]. (see https://openlayers.org/en/latest/apidoc/module-ol_Overlay-Overlay.html) |
 * | isocurveOptions | Object | isocurve service options. For advanced use only. See {@link https://ignf.github.io/geoportal-access-lib/latest/jsdoc/module-Services.html#~isocurve Gp.Services.isocurve()} to know all isocurve options. |
 *
 * <a id="graticule"></a>
 *
 * ### Options for "graticule" control
 *
 * **Specific 2D options**
 *
 * | property | Type | Description |
 * | - | - | - |
 * | div | String / DOMElement | Target HTML element container or its id. Default is chosen by map implementation.
 * | strokeColor | String | stroke color expressed in hex format (default : #000000) |
 * | strokeOpacity | Number | stroke opacity expressed between 0 and 1 (default : 0.2). |
 * | strokeWidth | Number | stroke width expressed in pixels (default : 1). |
 *
 * There are other native options for "Graticule control": see {@link https://openlayers.org/en/latest/apidoc/module-ol_Graticule-Graticule.html ol/Graticule}.
 *
 * <a id="layerswitcher"></a>
 *
 * ### Options for "layerswitcher" control
 *
 * **Common 2D/3D options**
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
 * **Specific 2D options**
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
 * | options.autoPanOptions | {@link Gp.AutoPanOptions} | optional |  | Defines autoPan Options for popup display on click. |
 * | layers | Object | | | List of layers requested by the control and their options (those layers have to be queryable). Associative array mapping ids of layers and their properties : </br><ul><li>event (String, optional) : name of the mouse event triggering the "getfeatureinfo" request.</li><li>infoFormat (String, optional) : indicates the format mime-type of the response of GetFeatureInfo requests.</li></ul> |
 *
 * <a id="layerimport"></a>
 *
 * ### Options for "layerimport" control
 *
 * **Specific 2D options**
 *
 * | property | Type | Description |
 * | - | - | - |
 * | div | String / DOMElement | Target HTML element container or its id. Default is chosen by map implementation.
 * | maximised | Boolean | if the control has to be opened or not. |
 * | layerTypes | Array | data types that could be imported : "KML", "GPX", "GeoJSON", "MapBox", "WMS" and "WMTS". Values will be displayed in the same order in widget list. Default is : ["KML", "GPX", "GeoJSON", "WMS", "WMTS"] |
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
 * | defaultStyles.MapBox | Object | Styles to apply by default to imported MapBox layers |
 *
 * <a id="length"></a>
 *
 * ### Options for "length" control
 *
 * **Specific 2D options**
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
 * **Specific 2D options**
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
 * **Specific 2D options**
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
 * **Specific 2D options**
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
 * | displayProfileOptions.apply | Function | function to display profile if you want to cutomise it. By default, built-in [DISPLAY_PROFILE_BY_DEFAULT()](http://ignf.github.io/geoportal-extensions/openlayers-latest/jsdoc/ol.control.ElevationPath.html#.DISPLAY_PROFILE_BY_DEFAULT) is used. You may also provide your own function using the same signature. |
 * | displayProfileOptions.target | Object | DOM container to use to display the profile. |
 *
 * <a id="searchctrl"></a>
 *
 * ### Options for "search" control
 *
 * **Specific 2D options**
 *
 * | property | Type | Description |
 * | - | - | - |
 * | div | String / DOMElement | Target HTML element container or its id. Default is chosen by map implementation.
 * | maximised | Boolean | if the control has to be opened or not. |
 * | resources | Object | resources to be used by geocode and autocompletion services |
 * | resources.geocode | Array(String) | resources geocoding, by default : ["PositionOfInterest", "StreetAddress"] |
 * | resources.autocomplete | Array(String) | resources autocompletion, by default : ["PositionOfInterest", "StreetAddress"] |
 * | displayAdvancedSearch | Boolean | True to display advanced search tools. Default is false (not displayed) |
 * | advancedSearch | Object | advanced search options for geocoding (filters). Properties can be found among geocode options.filterOptions (see https://ignf.github.io/geoportal-access-lib/latest/jsdoc/module-Services.html#~geocode) |
 * | geocodeOptions | Object | options of geocode service (see https://ignf.github.io/geoportal-access-lib/latest/jsdoc/module-Services.html#~geocode) |
 * | autocompleteOptions | Object | options of autocomplete service (see https://ignf.github.io/geoportal-access-lib/latest/jsdoc/module-Services.html#~autoComplete) |
 *
 * <a id="reversesearch"></a>
 *
 * ### Options for "reversesearch" control
 *
 * **Specific 2D options**
 *
 * | property | Type | Description |
 * | - | - | - |
 * | div | String / DOMElement | Target HTML element container or its id. Default is chosen by map implementation.
 * | maximised | Boolean | if the control has to be opened or not. |
 * | resources | Array(String) | resources geocoding, by default : ["PositionOfInterest", "StreetAddress"] |
 * | displayAdvancedSearch | Boolean | False to disable advanced search tools (it will not be displayed). Default is true (displayed) |
 * | delimitations | Array(String) | delimitations for reverse geocoding, by default : ["Point", "Circle", "Extent"]. Possible values are : "Point", "Circle", "Extent". Delimitations will be displayed in the same order in widget list. |
 * | reverseGeocodeOptions | Object | reverse geocode service options. see https://ignf.github.io/geoportal-access-lib/latest/jsdoc/module-Services.html#~reverseGeocode to know all reverse geocode options. |
 *
 * <a id="drawing"></a>
 *
 * ### Options for "drawing" control
 *
 * **Specific 2D options**
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
 * **Common 2D/3D options**
 *
 * | property | Type | Description |
 * | - | - | - |
 * | div | String / DOMElement | Target HTML element container or its id. Default is chosen by map implementation.
 * | maximised | Boolean | if the control has to be opened or not. |
 *
 *
 * @namespace
 * @alias Gp.ControlOptions
 * @todo finish description for tile vector format (layerimport control)
 *
 */
var controlOptions = {
};

/**
*
* Options for vector layers styling (KML, GPX, GeoJSON)
*
* **Common 2D/3D properties**
*
* | property | Type | Description |
* | - | - | - |
* | strokeColor | String | Stroke color for lines or polygons border styling (RGB hex value). Default is "#002A50".|
* | strokeWidth | Number | Stroke width in pixels for lines or polygons border styling. Default is 4. |
* | strokeOpacity | Number | Stroke opacity for lines or polygons border styling (alpha value between 0:transparent and 1:opaque). Default is 0.8. |
* | polyFillColor | String | Polygons fill color (RGB hex value). Default is "#00B798". |
* | polyFillOpacity | Number | Polygons fill opacity (alpha value between 0:transparent and 1:opaque). Default is 0.5. |
*
* **Specific 2D properties**
*
* | property | Type | Description |
* | - | - | - |
* | markerSrc | String | URL of a marker image (for points styling). Default is an orange marker.|
* | markerXAnchor | Float | Position of marker anchor in X from left of the image expressed in pixels (for points styling). Default is 25.5. |
* | markerYAnchor | Float | Position of marker anchor in Y from top of the image expressed in pixels (for points styling). Default is 38. |
* | textColor | String | Text fill color for labels (RGB hex value). Default is "#FFFFFF". |
* | textStrokeColor | String | Text surrounding color for labels (RGB hex value). Default is "#000000". |
*
*
* @namespace
* @alias Gp.StyleOptions
*
*/
var styleOptions = {
};

/**
*
* Options for MapBox vector layers : Styles
*
* **Common 2D/3D properties**
*
* | property | Type | Description |
* | - | - | - |
* | styles | Array(Object) | - |
* | styles.name | String | - |
* | styles.url | String | - |
* | styles.thumbnail | String | - |
* | styles.description | String | - |
* | styles.selected | Boolean | - |
*
* @namespace
* @alias Gp.MapboxStylesOptions
* @todo finish description
*/
var mapboxStylesOptions = {
};

/**
*
* Options for MapBox vector layers : Filters
*
* **Common 2D/3D properties**
*
* | property | Type | Description |
* | - | - | - |
* | filters | Array(Object) | - |
* | filters.propertyName | String | field name of table or the field name with the table, eg "table.field" |
* | filters.filterName | String | human description |
* | filters.configuration | Object | - |
* | filters.configuration.type | Boolean | configurable |
* | filters.configuration.selected | Array | filters selected |
*
* @namespace
* @alias Gp.FiltersOptions
* @todo finish description
*/
var filtersOptions = {
};
