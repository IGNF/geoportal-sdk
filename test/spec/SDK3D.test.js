import * as SDK from "../../dist/3d/GpSDK3D";
import Utils from "../utils/ITutils";
import {enginePath3d, apiKey} from "../config";

import {assert, expect, should} from "chai";


describe("-- Test SDK 3D --", function () {

    before( () => {
        Utils.cleanGlobalItowns();
    });

    after( () => {
        Utils.cleanGlobalItowns();
    });

    describe("-- Test Integration composants SDK, itowns --", () => {

        describe("-- Namespace SDK --", () => {

            it('SDK exists and is integrated', () => {
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

                // integration extension itowns
                SDK.should.have.property('itownsExtVersion');
                SDK.should.have.property('itownsExtDate');
                SDK.should.have.property('itownsExtended');
                expect(SDK.itownsExtended).to.be.an('Object');

                // les éléments de surchage de itowns sont présents...
                SDK.itownsExtended.should.have.property('GlobeViewExtended');
                expect(SDK.itownsExtended.GlobeViewExtended).to.be.an('Function');

                SDK.itownsExtended.should.have.property('control');
                SDK.itownsExtended.control.should.have.property('Attributions');
                SDK.itownsExtended.control.should.have.property('LayerSwitcher');
                SDK.itownsExtended.control.should.have.property('MiniGlobe');
                SDK.itownsExtended.control.should.have.property('MousePosition');
                SDK.itownsExtended.control.should.have.property('Scale');

                SDK.itownsExtended.should.have.property('layer');
                SDK.itownsExtended.layer.should.have.property('GeoportalElevation');
                SDK.itownsExtended.layer.should.have.property('GeoportalWMS');
                SDK.itownsExtended.layer.should.have.property('GeoportalWMTS');

                // ...mais itowns n'est pas encore chargé
                expect(SDK.itownsExtended).should.not.have.property('GlobeView');


                // integration extension mixte ol/itowns
                SDK.should.have.property('olItownsExtVersion');
                SDK.should.have.property('olItownsExtDate');

                // integration bibliotheque d'acces
                SDK.should.have.property('servicesVersion');
                SDK.should.have.property('servicesDate');
                SDK.should.have.property('Services');
                expect(SDK.Services).to.be.an('Object');
                SDK.should.have.property('Protocols');
                expect(SDK.Protocols).to.be.an('Object');
            });
        });

        describe("-- Namespace itowns --", () => {

            it("itowns doesn't exists yet", () => {
                var scope = typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};

                expect(scope.itowns).to.not.exist ;
            });

            it("itowns exists after Map loading", function (done) {
                this.timeout(20000);

                var scope = typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};

                expect(scope.itowns).to.not.exist ;

                var div = Utils.createDiv();
                var map = SDK.Map.load(
                    div,
                    {
                        apiKey : apiKey,
                        viewMode : "3d",
                        enginePath3d : enginePath3d
                    }
                );

                var key = map.listen("mapLoaded", function callback() {
                    map.forget( "mapLoaded", callback);

                    // itowns est chargé
                    expect(scope.itowns).to.exist ;
                    expect(scope.itowns).should.not.have.property('GlobeView');

                    // les éléments de surchage sont présents
                    scope.itowns.should.have.property('GlobeViewExtended');
                    expect(scope.itowns.GlobeViewExtended).to.be.an('Function');

                    scope.itowns.should.have.property('control');
                    scope.itowns.control.should.have.property('Attributions');
                    scope.itowns.control.should.have.property('LayerSwitcher');
                    scope.itowns.control.should.have.property('MiniGlobe');
                    scope.itowns.control.should.have.property('MousePosition');
                    scope.itowns.control.should.have.property('Scale');

                    scope.itowns.should.have.property('layer');
                    scope.itowns.layer.should.have.property('GeoportalElevation');
                    scope.itowns.layer.should.have.property('GeoportalWMS');
                    scope.itowns.layer.should.have.property('GeoportalWMTS');

                    Utils.onRenderingOver(map, () => {
                        document.body.removeChild(div);
                        done();
                    });
                });
            });
        });
    });
});
