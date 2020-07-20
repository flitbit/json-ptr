'use strict';

const { JsonPointer: ptr } = require('../../dist'); // json-ptr
const { data } = require('./data');
const { format } = require('util');

const value = ptr.get(data, '/legumes/1');
// fragmentId: #/legumes/1

console.log(
  format('There are %d %s of %s in stock.',
    value.instock, value.unit, value.name));
