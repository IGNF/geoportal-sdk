import * as SDK from "../../dist/2d/GpSDK2D";

import {assert, expect, should} from "chai";

describe("-- Test SDK 2D --", function () {
    describe("-- Test Integration composants SDK, ol --", function () {

        describe("-- Namespace SDK --", function() {

            it('SDK exists and is integrated', function () {

                expect(SDK).to.exist ;
                SDK.should.have.property('sdkVersion');
                SDK.should.have.property('sdkDate');

                // integration Map
                SDK.should.have.property('Map');
                expect(SDK.Map).to.be.an('Object');

                // integration extension ol
                SDK.should.have.property('olExtVersion');
                SDK.should.have.property('olExtDate');
                SDK.should.have.property('olExtended');
                expect(SDK.olExtended).to.be.an('Object');

                // integration bibliotheque d'acces
                SDK.should.have.property('servicesVersion');
                SDK.should.have.property('servicesDate');
                SDK.should.have.property('Services');
                expect(SDK.Services).to.be.an('Object');
                SDK.should.have.property('Protocols');
                expect(SDK.Protocols).to.be.an('Object');
            });
        });

        describe("-- Namespace ol --", function() {

            it('ol exists and is integrated', function () {

                var scope = typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};

                expect(scope.ol).to.exist ;

                // integration ol
                scope.ol.should.have.property('source');
                scope.ol.should.have.property('layer');
                scope.ol.should.have.property('control');
                scope.ol.should.have.property('format');

                // integration extension géoportail ol
                scope.ol.source.should.have.property('GeoportalWMS');
                scope.ol.source.should.have.property('GeoportalWMTS');
                scope.ol.source.should.have.property('WMTSExtended');

                scope.ol.layer.should.have.property('GeoportalWMS');
                scope.ol.layer.should.have.property('GeoportalWMTS');

                scope.ol.control.should.have.property('GeoportalAttribution');
                scope.ol.control.should.have.property('LayerSwitcher');
                scope.ol.control.should.have.property('GetFeatureInfo');
                scope.ol.control.should.have.property('SearchEngine');
                scope.ol.control.should.have.property('Route');
                scope.ol.control.should.have.property('Isocurve');
                scope.ol.control.should.have.property('MousePosition');
                scope.ol.control.should.have.property('Drawing');
                scope.ol.control.should.have.property('ReverseGeocode');
                scope.ol.control.should.have.property('LayerImport');
                scope.ol.control.should.have.property('MeasureLength');
                scope.ol.control.should.have.property('MeasureArea');
                scope.ol.control.should.have.property('MeasureAzimuth');
                scope.ol.control.should.have.property('DefaultMarkers');
                scope.ol.control.should.have.property('ElevationPath');

                scope.ol.format.should.have.property('KMLExtended');

                scope.ol.should.have.property('gp');
                scope.ol.gp.should.have.property('GfiUtils');
            });
        });
    });
});
