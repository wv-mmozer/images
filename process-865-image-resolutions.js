'use strict';

const Q = require('q');
const fs = require('fs');
const probe = require('probe-image-size');

const concurrency = 5;

module.exports.parse865Images = function() {
    return loadStandardImageUrls()
        .then(processImages)
        .catch(err => console.error(err));
};

function loadStandardImageUrls() {
    return Q.nfcall(fs.readFile, './standard-images.txt', 'utf8')
        .then(data => data.split('\n').map(p => `http:${p}`));
}

function processImages(imageUrls) {
    let ctx = {
        imageUrls,
        results865x375: 0,
        results865x389: 0,
        results865x347: 0,
        results865x632: 0,
        results865x533: 0,
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
            if(results.width === 865 && results.height === 375) {
                ctx.results865x375++;
            }
            else if(results.width === 865 && results.height === 389) {
                ctx.results865x389++;
            }
            else if(results.width === 865 && results.height === 347) {
                ctx.results865x347++;
            }
            else if(results.width === 865 && results.height === 632) {
                ctx.results865x632++;
            }
            else if(results.width === 865 && results.height === 533) {
                ctx.results865x533++;
            }
            else {
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

