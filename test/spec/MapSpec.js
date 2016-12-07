/* global describe, it */

define(['chai'], function (chai) {

    var assert = chai.assert;
    var expect = chai.expect;
    var should = chai.should();

    describe("-- Test Map --", function() {
        describe('Map Interface', function () {

            var Map= null ;

            beforeEach(function(done) {
                require(['Map'], function(_Map) {
                    Map = _Map;
                    done();
                });
            });

            it('Map.load exists', function () {
                Map.should.have.property('load');
            });

        });
    });
});
