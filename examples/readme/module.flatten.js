'use strict';

const { JsonPointer: ptr } = require('../../dist'); // json-ptr
const data = require('./data');

// var obj = ptr.flatten(data);
const obj = ptr.flatten(data, true);

console.log(JSON.stringify(obj, null, '  '));
