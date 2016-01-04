'use strict';

var ptr = require('../../'); // json-ptr
var data = require('./data');
var format = require('util').format;

var value = ptr.get(data, '/legumes/1');
// fragmentId: #/legumes/1

console.log(
  format('There are %d %s of %s in stock.',
    value.instock, value.unit, value.name));
