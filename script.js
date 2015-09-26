var http = require('http'),
    express = require('express'),
    jsdom = require('jsdom'),
    d3 = require('d3'),
    topojson = require('topojson'),
    
    // data
    animals = require('./animals.json'),
    nyc = require('./districts.json');

// =================================================== create artificial DOM

var result;

jsdom.env({
    features: {
        QuerySelector: true
    },
    file: 'stub.html',
    done: function (errors, window) {
        var width = 1000,
            height = 800,
            data = topojson.feature(nyc, nyc.objects.schooldistricts),
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

        //
        // geographic path
        //
        svg.append('path')
            .datum(data)
            .attr('d', path)
            .attr('class', 'path');

        //
        // add the data points
        //
        for (i in animals) {
            svg.append('circle')
                .data([animals[i]])
                .attr('transform', function (d) {
                    return "translate(" + proj([d.lng, d.lat]) + ")";
                })
                .attr('r', 1)
                .attr('class', 'point');
        }

        //
        // now it's all converted to a string and prepared to be Served
        //
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
