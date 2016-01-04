'use strict';

var assert = require('assert');
var ptr = require('../../'); // json-ptr
var data = require('./data');

var before = ptr.get(data, '/legumes/1/instock');
// fragmentId: #/legumes/1/instock

var prior = ptr.set(data, '/legumes/1/instock', before + 50);

assert.equal(before, prior);
assert.equal(before + 50, ptr.get(data, '/legumes/1/instock'));
