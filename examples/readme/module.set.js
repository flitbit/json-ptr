'use strict';

const assert = require('assert');
const { JsonPointer: ptr } = require('../../dist'); // json-ptr
const { data } = require('./data');

const before = ptr.get(data, '/legumes/1/instock');
// fragmentId: #/legumes/1/instock

const prior = ptr.set(data, '/legumes/1/instock', before + 50);

assert.equal(before, prior);
assert.equal(before + 50, ptr.get(data, '/legumes/1/instock'));
