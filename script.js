var http = require('http'),
    
    // packages
    d3 = require('d3'),
    topo = require('topojson'),
    
    // data
    animals = require('./animals.json'),
    geo = require('./nycboroughboundaries.geojson');

// Does It Work?
var animalTypes = animals.map(function (animal) {
        return animal.animal;
    }),
    topology = topo.topology({collection: geo});

// server stuff

var PORT = 8080;

var handleRequest = function (request, response) {
        response.end('<h1>Animals</h1>' + animalTypes);
    },
    server = http.createServer(handleRequest);

server.listen(PORT, function () {
    console.log('Server listening on: http://localhost:%s', PORT);
});