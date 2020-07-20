'use strict';

const { JsonPointer: ptr } = require('../../'); // json-ptr
const { data } = require('./data');

const list = ptr.listPointers(data, true);
// or: const list = ptr.listFragmentIds(data);

console.log(JSON.stringify(list, null, '  '));
