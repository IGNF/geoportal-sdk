import OL from "../../src/OpenLayers/OL.js";
import {apiKey} from "../config.js";

import { assert, expect, should } from "chai";


var map = null;
var div = null;

function initContext() {
    div = document.createElement("div");
    div.style.visibility = 'hidden';
    document.body.appendChild(div);

    map = new OL({
        div: div,
        mapOptions:{
            apiKey: apiKey
        }
    });
}

function cleanContext() {
    // pour permettre le chargement asynchrone de la configuration
    if (window.Gp && window.Gp.Config) window.Gp.Config = null;

    map = null;
    if (div) {
        document.body.removeChild(div);
        div = null;
    }
}

describe("-- Test OL --", function () {
    this.timeout(10000);

    beforeEach(function () {
        initContext();
    });

    afterEach(function () {
        cleanContext();
    });

    it("OL exists", function () {
        expect(OL).to.exist ;
    });

    describe("-- Events --", function() {

        it('Should correctly launch maploaded event', function (done) {
            map.listen("mapLoaded", function callback() {
                assert.ok(true);
                map.forget( "mapLoaded", callback);
                done();
            });
        });

        it('Should correctly launch configured event', function (done) {
            map.listen("configured", function callback() {
                assert.ok(true);
                map.forget( "configured", callback);
                done();
            });
        });

        it('Should correctly launch centerChanged event', function (done) {
            map.listen("centerChanged", function callback() {
                assert.ok(true);
                map.forget( "centerChanged", callback);
                done();
            });

            const centerValue = {
                x: 2,
                y: 48
            };

            map.setXYCenter(centerValue);
        });

        it('Should correctly launch zoomChanged event', function (done) {
            map.listen("zoomChanged", function callback() {
                assert.ok(true);
                map.forget( "zoomChanged", callback);
                done();
            });

            const zoomValue = 5;
            map.setZoom(zoomValue);
        });

        it('Should correctly launch azimuthChanged event', function (done) {
            map.listen("azimuthChanged", function callback() {
                assert.ok(true);
                map.forget( "azimuthChanged", callback);
                done();
            });

            const azimuthChanged = 60;
            map.setAzimuth(azimuthChanged);
        });

        it('Should correctly launch layerChanged event', function (done) {
            map.listen("layerChanged", function callback() {
                assert.ok(true);
                map.forget( "layerChanged", callback);
                done();
            });

            map.addLayers({
                "layerwms" : {
                    title: "mylayerwms",
                    format: "wms",
                    url: "myurl",
                    layers: ["layer"]
                }
            });
        });

    });

    describe("-- Add controls --", function() {

        it('Should correctly add the overview control to the map', function () {
            var control = map.addOverviewControl({});
            var addedControl = map.getLibMapControl("overview");

            expect(control).to.equal(addedControl);
        });

        it('Should correctly add the graphic scale control to the map', function () {
            var control = map.addGraphicScaleControl({
                units: "deg"
            });
            var addedControl = map.getLibMapControl("graphicscale");

            expect(control).to.equal(addedControl);
        });

        it('Should correctly add the graticule control to the map', function () {
            var control = map.addGraticuleControl({});
            var addedControl = map.getLibMapControl("graticule");

            expect(control).to.equal(addedControl);
        });

        it('Should correctly add the mouse position control to the map', function () {
            var control = map.addMousePositionControl({
                displayAltitude:false
            });
            var addedControl = map.getLibMapControl("mouseposition");

            expect(control).to.equal(addedControl);
        });

        it('Should correctly add the route control to the map', function (done) {

            map.listen("mapLoaded", function callback() {
                map.forget( "mapLoaded", callback);

                var control = map.addRouteControl({});
                var addedControl = map.getLibMapControl("route");
                expect(control).to.equal(addedControl);

                done();
            });
        });

        it('Should correctly add the isocurve control to the map', function (done) {

            map.listen("mapLoaded", function callback() {
                map.forget( "mapLoaded", callback);

                var control = map.addIsocurveControl({});
                var addedControl = map.getLibMapControl("isocurve");
                expect(control).to.equal(addedControl);

                done();
            });
        });

        it('Should correctly add the layer import control to the map', function () {
            var control = map.addLayerImportControl({});
            var addedControl = map.getLibMapControl("layerimport");

            expect(control).to.equal(addedControl);
        });

        it('Should correctly add the layer switcher control to the map', function () {
            var control = map.addLayerSwitcherControl({});
            var addedControl = map.getLibMapControl("layerswitcher");

            expect(control).to.equal(addedControl);
        });

        it('Should correctly add the length control to the map', function () {
            var control = map.addLengthControl({});
            var addedControl = map.getLibMapControl("length");

            expect(control).to.equal(addedControl);
        });

        it('Should correctly add the area control to the map', function () {
            var control = map.addAreaControl({});
            var addedControl = map.getLibMapControl("area");

            expect(control).to.equal(addedControl);
        });

        it('Should correctly add the azimuth control to the map', function () {
            var control = map.addAzimuthControl({});
            var addedControl = map.getLibMapControl("azimuth");

            expect(control).to.equal(addedControl);
        });

        it('Should correctly add the elevation path control to the map', function (done) {

            map.listen("mapLoaded", function callback() {
                map.forget( "mapLoaded", callback);

                var control = map.addElevationPathControl({});
                var addedControl = map.getLibMapControl("elevationpath");
                expect(control).to.equal(addedControl);

                done();
            });
        });

        it('Should correctly add the search control to the map', function () {
            var control = map.addSearchControl({});
            var addedControl = map.getLibMapControl("search");

            expect(control).to.equal(addedControl);
        });

        it('Should correctly add the reverse search control to the map', function (done) {

            map.listen("mapLoaded", function callback() {
                map.forget( "mapLoaded", callback);

                var control = map.addReverseSearchControl({});
                var addedControl = map.getLibMapControl("reversesearch");
                expect(control).to.equal(addedControl);

                done();
            });
        });

        it('Should correctly add the get feature info control to the map', function () {
            var control = map.addGetFeatureInfoControl({});
            var addedControl = map.getLibMapControl("getfeatureinfo");

            expect(control).to.equal(addedControl);
        });


    });

    describe("-- Remove controls --", function() {

        it('Graphic scale control is correctly removed from the map', function () {
            map.addGraphicScaleControl({
                units: "deg"
            });
            map.removeControls("graphicscale");
            var addedControl = map.getLibMapControl("graphicscale");

            expect(addedControl).to.be.a("null");
        });

        it('Mouse position control is correctly removed from the map', function () {
            map.addMousePositionControl({
                displayAltitude:false
            });
            map.removeControls("mouseposition");
            var addedControl = map.getLibMapControl("mouseposition");

            expect(addedControl).to.be.a("null");
        });
    });

    describe("-- Layers --", function() {

        it('Layers are correctly added', function () {
            map.addLayers({
                "layerwms" : {
                    title: "mylayerwms",
                    format: "wms",
                    url: "myurl",
                    layers: ["layer"]
                },
                "layerwmts" : {
                    title: "mylayerwmts",
                    format: "wmts",
                    url: "myurl",
                    layer: "layer",
                    tileMatrixSet: "tile",
                    styleName: "style"
                }
            });

            var layerOptions = map.getLayersOptions(["layerwms", "layerwmts"]);

            expect(layerOptions).to.be.an("Object");
            expect(layerOptions).to.have.property("layerwms");
            expect(layerOptions.layerwms).have.property("title");
            expect(layerOptions.layerwms.title).to.equal("mylayerwms");

            expect(layerOptions).have.property("layerwmts");
            expect(layerOptions.layerwmts).have.property("title");
            expect(layerOptions.layerwmts.title).to.equal("mylayerwmts");

            // test de l'ajout des couche dans openlayers
            expect(map.getLibMap().getLayers().getLength()).to.equal(2);
        });

        it('Layers are correctly removed', function () {
            map.addLayers({
                "layerwms" : {
                    title: "mylayerwms",
                    format: "wms",
                    url: "myurl",
                    layers: ["layer"]
                },
                "layerwmts" : {
                    title: "mylayerwmts",
                    format: "wmts",
                    url: "myurl",
                    layer: "layer",
                    tileMatrixSet: "tile",
                    styleName: "style"
                }
            });

            map.removeLayers(["layerwms", "layerwmts"]);

            var layerOptions = map.getLayersOptions(["layerwms", "layerwmts"]);
            expect(layerOptions).to.be.an("Object");
            expect(layerOptions).to.not.have.property("layerwms");
            expect(layerOptions).to.not.have.property("layerwmts");

            // test de la suppression des couche dans openlayers
            expect(map.getLibMap().getLayers().getLength()).to.equal(0);
        });

        it('Layers are correctly modified', function () {
            map.addLayers({
                "layerwms" : {
                    title: "mylayerwms",
                    format: "wms",
                    url: "myurl",
                    layers: ["layer"]
                },
                "layerwmts" : {
                    title: "mylayerwmts",
                    format: "wmts",
                    url: "myurl",
                    layer: "layer",
                    tileMatrixSet: "tile",
                    styleName: "style"
                }
            });

            const opacityValue = 0.5;
            const visibilityValue = false;
            const positionValue = 2;
            const minZoomValue = 5
            const maxZoomValue = 17
            const grayScaledValue = true;

            map.modifyLayers({
                layerwms: {
                    opacity: opacityValue,
                    visibility: visibilityValue,
                    position: positionValue,
                    minZoom: minZoomValue,
                    maxZoom: maxZoomValue,
                    grayScaled: grayScaledValue
                }
            });

            var layerOptions = map.getLayersOptions(["layerwms", "layerwmts"]);
            expect(layerOptions.layerwms.opacity).to.equal(opacityValue);
            expect(layerOptions.layerwms.visibility).to.equal(visibilityValue);
            expect(layerOptions.layerwms.position).to.equal(positionValue);
            expect(layerOptions.layerwms.minZoom).to.equal(minZoomValue);
            expect(layerOptions.layerwms.maxZoom).to.equal(maxZoomValue);
            expect(layerOptions.layerwms.grayScaled).to.equal(grayScaledValue);
        });
    });

    describe("-- Getters --", function() {

        it('Should get projection', function () {
            cleanContext();

            const projectionValue = "EPSG:4326";
            var map = new OL({
                div: document.createElement("div"),
                mapOptions:{
                    projection: projectionValue
                }
            });

            var projection = map.getProjection();
            expect(projection).to.equal(projectionValue);
        });

        it('Should get center', function () {
            cleanContext();

            const centerValue = {
                x: 2,
                y: 48
            };

            var map = new OL({
                div: document.createElement("div"),
                mapOptions:{
                    center: centerValue
                }
            });

            var center = map.getCenter();
            expect(center).to.deep.equal(centerValue);
        });

        it('Should get extent', function () {
            var extent = map.getViewExtent();
            expect(extent).to.be.an("Object");
            expect(extent).to.have.property("left");
            expect(extent.left).to.be.a("Number");
            expect(extent).to.have.property("right");
            expect(extent.right).to.be.a("Number");
            expect(extent).to.have.property("bottom");
            expect(extent.bottom).to.be.a("Number");
            expect(extent).to.have.property("top");
            expect(extent.top).to.be.a("Number");
        });

        it('Should get azimuth', function () {
            var azimuth = map.getAzimuth();
            expect(azimuth).to.be.an("Number");
        });

        it('Should get zoom', function () {
            var zoom = map.getZoom();
            expect(zoom).to.be.an("Number");
        });

        it('Should get resolution', function () {
            var resolution = map.getResolution();
            expect(resolution).to.be.an("Number");
        });

        it('Should get lib', function () {
            var lib = map.getLibMap();
            expect(lib).to.be.an("Object");
        });
    });

    describe("-- Setters --", function() {

        it('Should correctly set projection', function () {
            const projectionValue = "EPSG:2154";
            map.setProjection(projectionValue);

            const projection = map.getProjection();

            expect(projectionValue).to.equal(projection);
        });

        it('Should correctly set center', function () {
            const centerValue = {
                x: 2,
                y: 48
            };

            map.setXYCenter(centerValue);

            var center = map.getCenter();
            expect(center).to.deep.equal(centerValue);
        });

        it('Should correctly set center and zoom', function () {
            const centerValue = {
                x: 2,
                y: 48
            };

            const zoomValue = 11;

            map.setAutoCenter(centerValue, zoomValue);

            var center = map.getCenter();
            expect(center).to.deep.equal(centerValue);

            // var zoom = map.getZoom();
            // expect(zoom).to.equal(zoomValue);
        });

        it('Should correctly set azimuth', function () {
            const azimuthValue = 85;

            map.setAzimuth(azimuthValue);

            var azimuth = map.getAzimuth();
            expect(azimuth).to.equal(azimuthValue);
        });

        it('Should correctly set zoom', function () {
            const zoomValue = 11;

            map.setZoom(zoomValue);

            var zoom = map.getZoom();
            expect(zoom).to.equal(zoomValue);
        });

        it('Should correctly set resolution', function () {
            const resolutionValue = 11;

            map.setResolution(resolutionValue);

            var resolution = map.getResolution();
            expect(resolution).to.equal(resolutionValue);
        });

        it('Should correctly zoom in', function () {
            var zoom = map.getZoom();

            map.zoomIn();

            var newZoom = map.getZoom();
            expect(newZoom).to.equal(zoom+1);
        });

        it('Should correctly zoom out', function () {
            var zoom = map.getZoom();

            map.zoomOut();

            var newZoom = map.getZoom();
            expect(newZoom).to.equal(zoom-1);
        });
    });
});
