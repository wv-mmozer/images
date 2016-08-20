'use strict';

const express = require('express');
const app = express();
const images = require('./process-865-image-resolutions');

app.get('/', (req, res) => {
    images.parse865Images()
        .then(data => {
            res.status(200).send(data);
        });
});

var server = app.listen(9001, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('API listening at http://%s:%s', host, port);
});


process.on('uncaughtException', function (err) {
    console.log(err);
});
