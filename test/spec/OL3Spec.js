/* global describe, it */

define(["chai"], function (chai) {

    var assert = chai.assert;
    var expect = chai.expect;
    var should = chai.should();

    describe("-- Test OL3 --", function () {
        describe("OL3 Interface", function () {

            var OL3 = null ;

            beforeEach( function (done) {
                require(["ol3/OL3"], function (_OL3) {
                    OL3 = _OL3;
                    done();
                });
            });

            it("OL3 exists", function () {
            expect(OL3).to.exist ;
        });

        });
    });
});
