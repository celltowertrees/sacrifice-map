var d3 = require('d3'),
    animals = require('./animals.json'),
    geo = require('./nycboroughboundaries.geojson'),
    topo = require('topojson');

    
var animalTypes = animals.map(function (animal) {
        return animal.animal;
    }),
    topology = topo.topology({collection: geo});

console.log(topology);