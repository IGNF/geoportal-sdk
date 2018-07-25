import {ItMap} from "../../src/Itowns/ItMap";
import Utils from "../utils/ItUtils"

import {assert, expect, should} from "chai";

describe("-- Test ItMap --", function () {
    this.timeout(10000);

    describe("-- Init Events --", function() {

        it('Should correctly launch maploaded event', function (done) {
            Utils.cleanConf();
            let map = Utils.initMap();

            map.listen("mapLoaded", function callback() {
                assert.ok(true);
                map.forget( "mapLoaded", callback);

                Utils.cleanContextOnRenderingOver(map, done);
            });
        });

        it('Should correctly launch configured event', function (done) {
            Utils.cleanConf();

            let map = Utils.initMap();
            map.listen("configured", function callback() {
                assert.ok(true);
                map.forget( "configured", callback);

                Utils.cleanContextOnRenderingOver(map, done);
            });
        });
    });

    describe("-- Events --", function() {

        // it('Should correctly launch centerChanged event', function (done) {
        //     Utils.initContext().then((map) => {
        //         map.listen("centerChanged", function callback() {
        //             assert.ok(true);
        //             map.forget( "centerChanged", callback);
        //             Utils.cleanContext(map, done);
        //         });
        //
        //         const centerValue = {
        //             x: 3,
        //             y: 48
        //         };
        //
        //         map.setXYCenter(centerValue);
        //         map.getLibMap().notifyChange();
        //     });
        // });

        it('Should correctly launch zoomChanged event', function (done) {
            Utils.initContext().then((map) => {
                map.listen("zoomChanged", function callback() {
                    assert.ok(true);
                    map.forget( "zoomChanged", callback);
                    Utils.cleanContext(map, done);
                });

                const zoomValue = 5;
                map.setZoom(zoomValue);
            });
        });

        it('Should correctly launch azimuthChanged event', function (done) {
            Utils.initContext().then((map) => {
                map.listen("azimuthChanged", function callback() {
                    assert.ok(true);
                    map.forget( "azimuthChanged", callback);
                    Utils.cleanContext(map, done);
                });

                const azimuthChanged = 60;
                map.setAzimuth(azimuthChanged);
            });
        });

        it('Should correctly launch layerChanged event', function (done) {
            Utils.initContext().then((map) => {
                map.listen("layerChanged", function callback() {
                    assert.ok(true);
                    map.forget( "layerChanged", callback);
                    Utils.cleanContextOnRenderingOver(map, done);
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
    });

    describe("-- Add controls --", function() {

        it('Should correctly add the overview control to the map', () => {
            return Utils.initContext().then((map) => {
                var control = map.addOverviewControl({});
                var addedControl = map.getLibMapControl("overview");

                expect(control).to.equal(addedControl);
                return Utils.cleanContextOnRenderingOverPromise(map);
            });
        });

        it('Should correctly add the graphic scale control to the map', () => {
            return Utils.initContext().then((map) => {
                var control = map.addGraphicScaleControl({
                    units: "deg"
                });
                var addedControl = map.getLibMapControl("graphicscale");

                expect(control).to.equal(addedControl);
                return Utils.cleanContextOnRenderingOverPromise(map);
            });
        });

        it('Should correctly add the mouse position control to the map', () => {
            return Utils.initContext().then((map) => {
                var control = map.addMousePositionControl({
                    displayAltitude:false
                });
                var addedControl = map.getLibMapControl("mouseposition");

                expect(control).to.equal(addedControl);
                return Utils.cleanContextOnRenderingOverPromise(map);
            });
        });

        it('Should correctly add the attributions control to the map', () => {
            return Utils.initContext().then((map) => {
                var addedControl = map.getLibMapControl("attributions");

                expect(addedControl).to.be.an("Object");
                return Utils.cleanContextOnRenderingOverPromise(map);
            });
        });

        it('Should correctly add the layer switcher control to the map', () => {
            return Utils.initContext().then((map) => {
                var control = map.addLayerSwitcherControl({});
                var addedControl = map.getLibMapControl("layerswitcher");

                expect(control).to.equal(addedControl);
                return Utils.cleanContextOnRenderingOverPromise(map);
            });
        });
    });

    describe("-- Remove controls --", function() {

        it('Graphic scale control is correctly removed from the map', () => {
            return Utils.initContext().then((map) => {
                map.addGraphicScaleControl({
                    units: "deg"
                });
                map.removeControls("graphicscale");
                var addedControl = map.getLibMapControl("graphicscale");

                expect(addedControl).to.be.a("null");
                return Utils.cleanContextOnRenderingOverPromise(map);
            });
        });

        it('Mouse position control is correctly removed from the map', () => {
            return Utils.initContext().then((map) => {
                map.addMousePositionControl({
                    displayAltitude:false
                });
                map.removeControls("mouseposition");
                var addedControl = map.getLibMapControl("mouseposition");

                expect(addedControl).to.be.a("null");
                return Utils.cleanContextOnRenderingOverPromise(map);
            });
        });
    });

    describe("-- Layers --", function() {

        it('Layers are correctly added', () => {
            return Utils.initContext().then((map) => {
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
                        tileMatrixSet: "PM",
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

                // test de l'ajout des couches dans openlayers
                // la couche ortho et ajoutée par défaut
                expect(map.getLibMap().getColorLayers().length).to.equal(3);
                return Utils.cleanContextOnRenderingOverPromise(map);
            });
        });

        it('Layers are correctly removed', () => {
            return Utils.initContext().then((map) => {
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
                        tileMatrixSet: "PM",
                        styleName: "style"
                    }
                });

                map.removeLayers(["layerwms", "layerwmts"]);

                var layerOptions = map.getLayersOptions(["layerwms", "layerwmts"]);
                expect(layerOptions).to.be.an("Object");
                expect(layerOptions).to.not.have.property("layerwms");
                expect(layerOptions).to.not.have.property("layerwmts");

                // test de la suppression des couche dans openlayers
                // la couche ortho et ajoutée par défaut
                expect(map.getLibMap().getColorLayers().length).to.equal(1);
                return Utils.cleanContextOnRenderingOverPromise(map);
            });
        });

        it('Layers are correctly modified', () => {
            return Utils.initContext().then((map) => {
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
                        tileMatrixSet: "PM",
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
                // expect(layerOptions.layerwms.minZoom).to.equal(minZoomValue);
                // expect(layerOptions.layerwms.maxZoom).to.equal(maxZoomValue);
                // expect(layerOptions.layerwms.grayScaled).to.equal(grayScaledValue);
                return Utils.cleanContextOnRenderingOverPromise(map);
            });
        });
    });

    describe("-- Getters --", () => {

        it('Should get projection', () => {
            const projectionValue = "EPSG:4326";

            return Utils.initContext({
                projection: projectionValue
            }).then((map) => {
                let projection = map.getProjection();
                // non implémentée
                expect(projection).to.equal("");
                return Utils.cleanContextOnRenderingOverPromise(map);
            });
        });

        it('Should get center', () => {
            const centerValue = {
                x: 2,
                y: 48
            };

            return Utils.initContext({
                center: centerValue
            }).then((map) => {
                let center = map.getCenter();
                //expect(center).to.deep.equal(centerValue);
                return Utils.cleanContextOnRenderingOverPromise(map);
            });
        });

        it('Should get extent', () => {
            return Utils.initContext().then((map) => {
                var extent = map.getViewExtent();
                expect(extent).to.be.an("Object");
                // non implémentée
                expect(extent).to.be.empty;
                return Utils.cleanContextOnRenderingOverPromise(map);
            });
        });

        it('Should get azimuth', function () {
            return Utils.initContext().then((map) => {
                var azimuth = map.getAzimuth();
                expect(azimuth).to.be.an("Number");
                return Utils.cleanContextOnRenderingOverPromise(map);
            });
        });

        it('Should get zoom', function () {
            return Utils.initContext().then((map) => {
                var zoom = map.getZoom();
                expect(zoom).to.be.an("Number");
                return Utils.cleanContextOnRenderingOverPromise(map);
            });
        });

        it('Should get resolution', function () {
            return Utils.initContext().then((map) => {
                var resolution = map.getResolution();
                expect(resolution).to.be.an("Number");
                return Utils.cleanContextOnRenderingOverPromise(map);
            });
        });

        it('Should get lib', function () {
            return Utils.initContext().then((map) => {
                var lib = map.getLibMap();
                expect(lib).to.be.an("Object");
                return Utils.cleanContextOnRenderingOverPromise(map);
            });
        });
    });

    describe("-- Setters --", function() {

        // it('Should correctly set projection', function () {
        //     return Utils.initContext().then((map) => {
        //         const projectionValue = "EPSG:2154";
        //
        //         // non implémentée
        //         map.setProjection(projectionValue);
        //
        //         // non implémentée
        //         const projection = map.getProjection();
        //
        //         expect(projection).to.equal("");
        //         return Utils.cleanContextOnRenderingOverPromise(map);
        //     });
        // });
        //
        // it('Should correctly set center', function () {
        //     return Utils.initContext().then((map) => {
        //         const centerValue = {
        //             x: 60,
        //             y: 60
        //         };
        //
        //         map.setXYCenter(centerValue);
        //         map.getLibMap().notifyChange();
        //
        //         return Utils.onRenderingOverPromise(map).then(() => {
        //             var center = map.getCenter();
        //             expect(center.lon).should.be.closeTo(centerValue.x, 5);
        //             expect(center.lat).should.be.closeTo(centerValue.y, 5);
        //             Utils.cleanContext(map);
        //         });
        //     });
        // });

        it('Should correctly set azimuth', function () {
            return Utils.initContext().then((map) => {
                const azimuthValue = 10;

                map.setAzimuth(azimuthValue);
                map.getLibMap().notifyChange();

                return Utils.onRenderingOverPromise(map).then(() => {
                    var azimuth = map.getAzimuth();
                    //expect(60).should.be.closeTo(60, 1.0);
                    Utils.cleanContext(map);
                });
            });
        });

        it('Should correctly set zoom', function () {
            return Utils.initContext().then((map) => {
                const zoomValue = 11;

                map.setZoom(zoomValue);
                map.getLibMap().notifyChange();

                return Utils.onRenderingOverPromise(map).then(() => {
                    var zoom = map.getZoom();
                    //expect(zoom).to.equal(zoomValue);
                    Utils.cleanContext(map);
                });
            });
        });

        it('Should correctly set resolution', function () {
            return Utils.initContext().then((map) => {
                const resolutionValue = 0.01;

                var promise = Utils.onRenderingOverPromise(map).then(() => {
                    var resolution = map.getResolution();
                    //expect(resolution).to.equal(resolutionValue);
                    Utils.cleanContext(map);
                });

                //non implémentée
                map.setResolution(resolutionValue);

                return promise;
            });
        });

        it('Should correctly zoom in', function () {
            return Utils.initContext().then((map) => {
                var zoom = map.getZoom();

                var promise = Utils.onRenderingOverPromise(map).then(() => {
                    var newZoom = map.getZoom();
                    expect(newZoom).to.equal(zoom+1);
                    Utils.cleanContext(map);
                });

                map.zoomIn();
                map.getLibMap().notifyChange();

                return promise;
            });
        });

        it('Should correctly zoom out', function () {
            return Utils.initContext().then((map) => {
                var zoom = map.getZoom();

                var promise = Utils.onRenderingOverPromise(map).then(() => {
                    var newZoom = map.getZoom();
                    expect(newZoom).to.equal(zoom-1);
                    Utils.cleanContext(map);
                });

                map.zoomOut();
                map.getLibMap().notifyChange();

                return promise;
            });
        });
    });
});
