'use strict';

var ptr = require('../../'); // json-ptr
var data = require('./data');
var format = require('util').format;

var pointer = ptr.create('/legumes/2');
// fragmentId: #/legumes/2

var value = pointer.get(data);

console.log(
  format('There are %d %s of %s in stock.',
    value.instock, value.unit, value.name));
