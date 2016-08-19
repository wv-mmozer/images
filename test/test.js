'use strict';

const Q = require("q");
const assert = require("assert");
const images = require('../parse-image-dimensions');

describe('Test the messageProcessor component', function() {
    this.timeout(500000000);
    it('should process one trip message with a start record and no mongo documents', function (done) {
        images.parse865Images()
            .then(data => {
                console.dir(data);
                done();
            })
            .catch(function(err){
                done(err);
            });
    });
});