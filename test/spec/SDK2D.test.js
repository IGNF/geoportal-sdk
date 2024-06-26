import * as SDK from "../../dist/2d/GpSDK2D";

import {assert, expect, should} from "chai";

should();

describe("-- Test SDK 2D --", function () {
    describe("-- Test Integration composants SDK, ol --", function () {

        describe("-- Namespace SDK --", function() {

            it('SDK exists and is integrated', function () {

                expect(SDK).to.exist ;
                console.log(SDK);
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
                scope.ol.default.should.have.property('source');
                scope.ol.default.should.have.property('layer');
                scope.ol.default.should.have.property('control');
                scope.ol.default.should.have.property('format');

                // integration extension géoportail ol
                scope.ol.default.source.should.have.property('GeoportalWMS');
                scope.ol.default.source.should.have.property('GeoportalWMTS');
                scope.ol.default.source.should.have.property('WMTSExtended');

                scope.ol.default.layer.should.have.property('GeoportalWMS');
                scope.ol.default.layer.should.have.property('GeoportalWMTS');

                scope.ol.default.control.should.have.property('GeoportalAttribution');
                scope.ol.default.control.should.have.property('LayerSwitcher');
                scope.ol.default.control.should.have.property('GetFeatureInfo');
                scope.ol.default.control.should.have.property('SearchEngine');
                scope.ol.default.control.should.have.property('Route');
                scope.ol.default.control.should.have.property('Isocurve');
                scope.ol.default.control.should.have.property('MousePosition');
                scope.ol.default.control.should.have.property('Drawing');
                scope.ol.default.control.should.have.property('ReverseGeocode');
                scope.ol.default.control.should.have.property('LayerImport');
                scope.ol.default.control.should.have.property('MeasureLength');
                scope.ol.default.control.should.have.property('MeasureArea');
                scope.ol.default.control.should.have.property('MeasureAzimuth');
                scope.ol.default.control.should.have.property('DefaultMarkers');
                scope.ol.default.control.should.have.property('ElevationPath');

                scope.ol.default.format.should.have.property('KMLExtended');

                scope.ol.default.should.have.property('gp');
                scope.ol.default.gp.should.have.property('GfiUtils');
            });
        });
    });
});
