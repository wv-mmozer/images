'use strict';

const standardImages = require('../process-865-image-resolutions');
const retinaImages = require('../process-2048-image-resolutions');

describe('Get Image Sizes', function() {

    this.timeout(500000000);

    it.skip('process 865 standard size resolutions', function (done) {
        standardImages.parse865Images()
            .then(data => {
                console.log('Total 865 image - 27999');
                console.log('865 x 375 ' + data.results865x375);
                console.log('865 x 389 ' + data.results865x389);
                console.log('865 x 347 ' + data.results865x347);
                console.log('865 x 632 ' + data.results865x632);
                console.log('865 x 533 ' + data.results865x533);
                console.log('unknown image size ' + data.unknown.length);
                console.log('http timeout error ' + data.errors.length);
                console.log(data.unknown);
                done();
            })
            .catch();
    });

    it('process 2048 retina size resolutions', function (done) {
        retinaImages.parse2048Images()
            .then(data => {
                console.log('Total 2048 image - 27629');
                console.log('2048 x 1496 count: ' + data.results2048x1496);
                console.log('unknown image size ' + data.unknown.length);
                console.log('http timeout error ' + data.errors.length);
                console.log(data.unknown);
                done();
            })
            .catch();
    });

});