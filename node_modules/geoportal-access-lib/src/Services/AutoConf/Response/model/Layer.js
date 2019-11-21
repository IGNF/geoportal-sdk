
/**
 * Object used to describe geoportal resource (WMTS, WMS, WFS layers, geocoding resources or elevation service) parameters. Properties may be used or not depending on the resource type.
 *
 * @property {String} name - name of the resource to use with the webservice that serves it (eg : "GEOGRAPHICALGRIDSYSTEMS.MAPS").
 * @property {String} title - Human readable name for the resource.
 * @property {String} description - Resource description.
 * @property {String} layerId - Unique resource Identifier (eg : "GEOGRAPHICALGRIDSYSTEMS.MAPS$GEOPORTAIL:OGC:WMTS")
 * @property {String} quicklookUrl - Image URL for the resource.
 * @property {Object} serviceParams - Informations about the webservice that serves the resource (OpenLS, WFS, WMTS)
 * @property {String} serviceParams.id - Web Service identifier ("OGC:WMTS", "OGC:OPENLS;ReverseGeocode", etc...)
 * @property {Object} serviceParams.serverUrl - Associative array mapping geoportal access key (keys) with their properties (URLs of the web service, with the geoportal access key).
 * @property {String} serviceParams.version - webservice version.
 * @property {String} defaultProjection - coordinates system ID used by default for the resource (WMS or WFS layer) or of the TileMatrixSet used by the WMTS layer.
 * @property {Array.<String>} additionalProjections - additional coordinates systems IDs availables for the resource, others than the default one (see defaultProjection) (WMS and WFS layers only).
 * @property {Array.<Gp.Services.Config.Format>} formats - Formats availables for the resource.
 * @property {Array.<Gp.Services.Config.Legend>} legends - Informations about legends associated to the resource.
 * @property {Array.<Gp.Services.Config.Metadata>} metadata - Informations about metadata associated to the resource.
 * @property {Array.<Gp.Services.Config.Style>} styles - Informations about styles availables for the resources (WMS, WFS and WMTS only).
 * @property {Array.<Gp.Services.Config.Thematic>} thematics - Informations about thematics associated to the resource.
 * @property {Gp.Services.Config.Constraint} globalConstraint - geographical constraint for the resource.
 * @property {Array.<Gp.Services.Config.Constraint>} constraints - additionnal geographical constraints for the resource.
 * @property {Array.<Gp.Services.Config.Originator>} originators - Informations about originator of the resource.
 * @property {Object} wmtsOptions - Informations associated to WMTS resources.
 * @property {String} wmtsOptions.tileMatrixSetLink - TileMatrixSet identifier used by the resource (see {@link Gp.Services.Config.TileMatrixSet})
 * @property {Gp.Services.Config.TileMatrixLimit} wmtsOptions.tileMatrixSetLimits - limits of the resource for that TileMAtrixSet.
 * @property {Boolean} queryable - true if a getFeatureInfo request may be done for the resource (WMS or WMTS only).
 * @property {Boolean} hidden - true if the resource is not visible.
 * @property {Boolean} isAggregate - true if the resource is an aggregate of other resources (@see aggregatedLayers).
 * @property {Array.<String>} aggregatedLayers - Layers IDs composing the being described aggregated layer.
 * @property {Array.<String>} apiKeys - Array of access keys that grant access to that resource.
 * @property {Object} dimensions - Dimensions informations associated with the resource.
 * @property {String} dimensions.type
 * @property {String} dimensions.visibilityRange
 * @property {String} dimensions.visibilityMode
 * @property {String} dimensions.noDataValue
 * @property {String} dimensions.geometricType
 *
 * @namespace
 * @alias Gp.Services.Config.Layer
 */
function Layer () {
    if (!(this instanceof Layer)) {
        throw new TypeError("Layer constructor cannot be called as a function.");
    }

    // info : une instance de la classe Layer n'a aucune propriété au départ,.
    // les attributs possibles sont documentés ci-dessus,
    // et seront implémentés au fur et à mesure de la lecture de la réponse de l'autoconf, lorsque l'information est rencontrée.
}

Layer.prototype = {

    constructor : Layer,

    /**
     * Returns the layer name
     *
     * @returns {String} name - name of the resource to use with the webservice that serves it (eg : "GEOGRAPHICALGRIDSYSTEMS.MAPS").
     */
    getName : function () {
        return this.name;
    },

    /**
     * Returns the layer title
     *
     * @returns {String} title - Human readable name for the resource.
     */
    getTitle : function () {
        return this.title;
    },

    /**
     * Returns the layer description
     *
     * @returns {String} description - Resource description.
     */
    getDescription : function () {
        return this.description;
    },

    /**
     * Returns the layer identifier
     *
     * @returns {String} layerId - Unique resource Identifier (eg : "GEOGRAPHICALGRIDSYSTEMS.MAPS$GEOPORTAIL:OGC:WMTS")
     */
    getLayerId : function () {
        return this.layerId;
    },

    /**
     * Returns the layer quicklookUrl
     *
     * @returns {String} quicklookUrl - Image URL for the resource.
     */
    getQuicklookUrl : function () {
        return this.quicklookUrl;
    },

    /**
     * Returns the layer default projection
     *
     * @returns {String} defaultProjection - coordinates system ID used by default for the resource (WMS or WFS layer) or of the TileMatrixSet used by the WMTS layer.
     */
    getDefaultProjection : function () {
        return this.defaultProjection;
    },

    /**
     * Returns the layer projections
     *
     * @returns {Array.<String>} projections - coordinates systems IDs availables for the resource, including the default one.
     */
    getProjections : function () {
        var projections = [];
        projections.push(this.defaultProjection);
        var proj = projections.concat(this.additionalProjections);
        return proj;
    },

    /**
     * Returns the global BBOX
     *
     * @returns {Gp.BBox} bbox - the layer global bounding box, expressed in CRS system.
     */
    getBBOX : function () {
        if (!this.globalConstraint) {
            return;
        }
        return this.globalConstraint.bbox;
    },

    /**
     * Returns the layer minimum scale denominator
     *
     * @returns {Number} minScaleDenominator - minimum scale denominator for this layer
     */
    getMinScaleDenominator : function () {
        if (!this.globalConstraint) {
            return;
        }
        return this.globalConstraint.minScaleDenominator;
    },

    /**
     * Returns the layer maximum scale denominator
     *
     * @returns {Number} maxScaleDenominator - maximum scale denominator for this layer
     */
    getMaxScaleDenominator : function () {
        if (!this.globalConstraint) {
            return;
        }
        return this.globalConstraint.maxScaleDenominator;
    },

    /**
     * Returns layer Tile Matrix Set identifier if exists
     *
     * @returns {String} tileMatrixSetLink - Tile Matrix Set identifier (for instance : "PM")
     */
    getTMSID : function () {
        if (this.wmtsOptions) {
            return this.wmtsOptions.tileMatrixSetLink;
        }
    },

    /**
     * Returns information about the webservice that serves the resource
     *
     * @returns {Object} serviceParams - Information about the webservice that serves the resource (OpenLS, WFS, WMTS)
     */
    getServiceParams : function () {
        return this.serviceParams;
    },

    /**
     * Returns Geoportal server url for a given key
     *
     * @param {String} apiKey - Access key to Geoportal platform
     * @returns {String} serverUrl - general URL of the web service (with the geoportal access key)
     */
    getServerUrl : function (apiKey) {
        if (!apiKey || !this.serviceParams || !this.serviceParams.serverUrl) {
            return;
        }
        return this.serviceParams.serverUrl[apiKey];
    },

    /**
     * Returns information about legends associated to the resource.
     *
     * @returns {Array.<Gp.Services.Config.Legend>} legends - Informations about legends associated to the resource.
     */
    getLegends : function () {
        return this.legends;
    },

    /**
     * Returns information about metadata associated to the resource.
     *
     * @returns {Array.<Gp.Services.Config.Metadata>} metadata - Informations about metadata associated to the resource.
     */
    getMetadata : function () {
        return this.metadata;
    },

    /**
     * Returns information about styles availables for the resources (WMS, WFS and WMTS only).
     *
     * @returns {Array.<Gp.Services.Config.Style>} styles - Informations about styles availables for the resources (WMS, WFS and WMTS only).
     */
    getStyles : function () {
        return this.styles;
    },

    /**
     * Returns layer default style
     *
     * @returns {String} styleName - style identifier (eg : "normal", "bdparcellaire", ...)
     */
    getDefaultStyle : function () {
        if (!this.styles) {
            return;
        }
        var style;
        var s = this.styles;
        for (var i = 0; i < s.length; i++) {
            if (s[i].current === true) {
                style = s[i].name;
                break;
            }
        }
        return style;
    },

    /**
     * Returns information about thematics associated to the resource.
     *
     * @returns {Array.<Gp.Services.Config.Thematic>} thematics - Informations about thematics associated to the resource.
     */
    getThematics : function () {
        return this.thematics;
    },

    /**
     * Returns layer default format
     *
     * @returns {String} formatName - Format mime-type. (eg. "image/jpeg")
     */
    getDefaultFormat : function () {
        if (!this.formats) {
            return;
        }
        var format;
        var f = this.formats;
        for (var i = 0; i < f.length; i++) {
            if (f[i].current === true) {
                format = f[i].name;
                break;
            }
        }
        return format;
    },

    /**
     * Returns information about geographical or temporal constraints for the resource
     *
     * @returns {Array.<Gp.Services.Config.Constraint>} constraints - Informations about geographical or temporal constraints for the resource
     */
    getConstraints : function () {
        return this.constraints;
    },

    /**
     * Returns information about originators of this resource
     *
     * @returns {Array.<Gp.Services.Config.Originator>} originators - Informations about originators of this resource
     */
    getOriginators : function () {
        return this.originators;
    },

    /**
     * Returns information about dimensions associated with this resource
     *
     * @returns {Object} dimensions - Dimensions informations associated with the resource.
     */
    getDimensions : function () {
        return this.dimensions;
    },

    /**
     * Returns information about aggregated layers composing the being described layer, in case the resource is an aggregate of other resources.
     *
     * @returns {Object} aggregatedLayers - Layers IDs composing the being described aggregated layer.
     */
    getAggregatedLayers : function () {
        if (this.isAggregate) {
            return this.aggregatedLayers;
        } else {

        }
    }

};

export default Layer;
