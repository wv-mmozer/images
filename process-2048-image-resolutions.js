'use strict';

const Q = require('q');
const fs = require('fs');
const probe = require('probe-image-size');

const concurrency = 5;

module.exports.parse2048Images = function() {
    return loadStandardImageUrls()
        .then(processImages)
        .catch(err => console.error(err));
};

function loadStandardImageUrls() {
    return Q.nfcall(fs.readFile, './retina-images.txt', 'utf8')
        .then(data => data.split('\n').map(p => `http:${p}`));
}

function processImages(imageUrls) {
    let ctx = {
        imageUrls,
        results2048x1496: 0,
        unknown: [],
        nextIndex: 0,
        processing: 0,
        errors: [],
        total: 0,
        complete: Q.defer()
    };
    processMore(ctx);
    return ctx.complete.promise;
}

function processMore(ctx) {
    while(ctx.processing < concurrency && ctx.total < ctx.imageUrls.length) {
        processOne(ctx);
    }
}

function processOne(ctx) {
    processImage(ctx.imageUrls[ctx.nextIndex])
        .then(results => {
            if(results.width === 2048 && results.height === 1496) {
                ctx.results2048x1496++;
            } else {
                ctx.unknown.push(results);
            }
        })
        .catch(err => {
            ctx.errors.push(err.stack);
        })
        .then(() => {
            ++ctx.total;
            --ctx.processing;
            if(ctx.total >= ctx.imageUrls.length) {
                ctx.complete.resolve(ctx);
            }
            processMore(ctx);
            //console.log(`total: ${ctx.total}, processing: ${ctx.processing}`);
        })
        .catch(err => ctx.errors.push(err.stack));

    ++ctx.processing;
    ++ctx.nextIndex;
}

function processImage(imageUrl) {
    return probe({url: imageUrl, timeout: 5000})
        .then(response => {
            return {
                width: response.width,
                height: response.height,
                imagePath: imageUrl
            }
        });
}

