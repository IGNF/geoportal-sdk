import ol from "openlayers";
import * as AHN from "../../src/AHNol";

import { assert, expect, should } from "chai";
should();

describe("-- Test Integration composants Gp,ol --", function () {

    describe("-- Namespace Gp --", function() {

        it('Gp exists and is integrated', function () {
            expect(AHN).to.exist ;
            // integration bibliotheque d'acces
            AHN.should.have.property('servicesVersion');
            // integration extension ol3
            AHN.should.have.property('olExtVersion');
            // integration Map
            AHN.should.have.property('Map');
        });
    });

    describe("-- Namespace ol --", function() {

        it('ol exists and is integrated', function () {
            expect(ol).to.exist ;
            // integration ol3
            ol.should.have.property('source');
            // integration extension géoportail ol3
            ol.source.should.have.property('GeoportalWMS');
        });
    });
});
