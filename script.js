var http = require('http'),
    express = require('express'),
    jsdom = require('jsdom'),
    d3 = require('d3'),
    topojson = require('topojson'),
    fs = require('fs'),
    
    // data
    animals = require('./animals.json'),
    nyc = require('./nyc.json');

// =================================================== create artificial DOM

// TODO: import html stub from another file
var htmlStub = '<html><head><link href="assets/style.css" rel="stylesheet" /><title>lol</title></head><body><div id="container"></div></body><script src="/assets/js/d3.min.js"></script></html>',
    result;

jsdom.env({
    features: {
        QuerySelector: true
    },
    html: htmlStub,
    done: function (errors, window) {
        var width = 1000,
            height = 800,
            data = topojson.feature(nyc, nyc.objects.nycboroughboundaries),
            center = d3.geo.centroid(data),
            offset = [width / 2, height / 2],
            proj = d3.geo.mercator()
                .scale(70000)
                .center(center)
                .translate(offset),
            path = d3.geo.path().projection(proj);

        // im sure i decided to run this from the server for good reason.
        // d3 wants the DOM to be available. so we are simulating a client-side env.
        var zone = window.document.querySelector('#container');

        var svg = d3.select(zone).append('svg')
            .attr('width', width)
            .attr('height', height);

        svg.append('path')
            .datum(data)
            .attr('d', path)
            .attr('class', 'path');

        for (i in animals) {
            // lol nah
            svg.append('circle')
                .data([animals[i]])
                .attr('transform', function (d) {
                    return "translate(" + proj([d.lng, d.lat]) + ")";
                })
                .attr('r', 1)
                .attr('class', 'point');
        }

        // convert to string
        result = window.document.querySelector('html').innerHTML;
    }
});

// =================================================== start server

var PORT = 8080,
    app = express(),
    server = http.createServer(app);


app.use('/assets', express.static('assets'));

server.listen(PORT, function () {
    console.log('Server listening on: http://localhost:%s', PORT);
});

app.get('/', function (request, response) {
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end(result);
});
