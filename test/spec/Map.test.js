import Map from "../../src/Map";

import { assert, expect, should } from "chai";
should();

describe("-- Test Map --", function () {

    it('Map.load exists', function () {
        Map.should.have.property('load');
    });
});
