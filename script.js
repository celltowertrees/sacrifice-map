var d3 = require('d3'),
    animals = require('./animals.json'),
    topo = require('topojson');

    
var animalTypes = animals.map(function (animal) {
        return animal.animal;
    });

console.log(animalTypes);