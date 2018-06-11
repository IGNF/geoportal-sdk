import ol from "openlayers";
import * as SDK from "../../src/SDK2D";

import { assert, expect, should } from "chai";
should();

describe("-- Test Integration composants Gp,ol --", function () {

    describe("-- Namespace Gp --", function() {

        it('Gp exists and is integrated', function () {
            expect(SDK).to.exist ;
            // integration bibliotheque d'acces
            SDK.should.have.property('servicesVersion');
            // integration extension ol
            SDK.should.have.property('olExtVersion');
            // integration Map
            SDK.should.have.property('Map');
        });
    });

    describe("-- Namespace ol --", function() {

        it('ol exists and is integrated', function () {
            expect(ol).to.exist ;
            // integration ol
            ol.should.have.property('source');
            // integration extension géoportail ol
            ol.source.should.have.property('GeoportalWMS');
        });
    });
});
