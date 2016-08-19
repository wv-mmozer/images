'use strict';

const _ = require('lodash');
const url = require('url');
const http = require('http');
const Q = require('q');
const fs = require('fs');
const probe = require('probe-image-size');

let imagePaths = [];
let resultBody = [];
let counter = 0;
const max = 1;

function loadStandardImagePaths(){
    var deferred = Q.defer();
    fs.readFile('./standard-images.txt', 'utf8', (err, data) => {
        if (err) {
            throw err;
        }
        deferred.resolve(data.split('\n'));
    });
    return deferred.promise;
}

module.exports.parse865Images = () => {
    resultBody = [];
    return loadStandardImagePaths()
        .then(standardImagesPaths => {
            imagePaths = standardImagesPaths;
            return process()
                .then(results => {
                    return results;
                })
        })
};

function processBatch(batch){
    return Q.all(batch)
        .delay(300)
        .then(results => {
            _.each(results, result => {
                resultBody.push(result);
            });
            return process();
        })
}

function process() {
    let promises = [];
    if(imagePaths.length <= 0){
        return resultBody;
    }
    let batch = imagePaths.splice(0, max);
    _.each(batch, image => {
        promises.push(parseStandardImageData(image));
    });
    return processBatch(promises);
}

function parseStandardImageData(imageUrl){
    return probe('http:' + imageUrl)
            .then(response => {
                counter++;
                console.log(counter);
                return {
                    expected: '865x375',
                    actual: response.width + 'x' + response.height,
                    'imagePath': 'http:' + imageUrl
                }
            });
}
