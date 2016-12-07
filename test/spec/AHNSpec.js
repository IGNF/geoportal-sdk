/* global describe, it */

define(['chai', 'ol', 'VirtualGeo'], function (chai, ol, VirtualGeo) {

    var assert = chai.assert;
    var expect = chai.expect;
    var should = chai.should();

    describe("-- Test Integration composants Gp,ol --", function() {

        var AHN = null ;

        beforeEach(function(done) {
            require(['AHN'], function(_AHN) {
                AHN = _AHN;
                done();
            });
        });

        describe("-- Namespace Gp --", function() {

            it('Gp exists and is integrated', function () {
                expect(AHN).to.exist ;
                // integration bibliotheque d'acces
                AHN.should.have.property('servicesVersion');
                // integration extension ol3
                AHN.should.have.property('ol3extVersion');
                // integration Map
                AHN.should.have.property('Map');
            });
        }) ;

        describe("-- Namespace ol --", function() {

            it('ol exists and is integrated', function () {
                expect(ol).to.exist ;
                // integration ol3
                ol.should.have.property('source');
                // integration extension géoportail ol3
                ol.source.should.have.property('GeoportalWMS');
            });
        }) ;

        describe("-- Namespace VirtualGeo --", function() {

            it('VirtualGeo exists and is integrated', function () {
                // console.log(VirtualGeo);
                // expect(VirtualGeo).to.exist ;
                // integration VirtualGeo
                // VirtualGeo.should.have.property('source');
                // integration extension géoportail VirtualGeo
                // VirtualGeo.source.should.have.property('GeoportalWMS');
            });
        }) ;
    });
});
