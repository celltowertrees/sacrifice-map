var http = require('http'),
    express = require('express'),
    jsdom = require('jsdom'),
    
    // packages
    d3 = require('d3'),
    topojson = require('topojson'),
    
    // data
    animals = require('./animals.json'),
    nyc = require('./nyc.json');

// =================================================== create artificial DOM

var htmlStub = '<html><head><title>lol</title></head><body><div id="container"></div></body><script src="/assets/js/d3.min.js"></script></html>',
    result;

jsdom.env({
    features: {
        QuerySelector: true
    },
    html: htmlStub,
    done: function (errors, window) {

        // im sure i decided to run this from the server for good reason.
        // d3 wants the DOM to be available. so we are simulating a client-side env.
        var zone = window.document.querySelector('#container');

        var svg = d3.select(zone).append('svg')
            .attr('width', 960)
            .attr('height', 1160);

        svg.append('path')
            .datum(topojson.feature(nyc, nyc.objects.nycboroughboundaries))
            .attr('d', d3.geo.path().projection(d3.geo.mercator()));

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
