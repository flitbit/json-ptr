'use strict';

const { JsonPointer: ptr } = require('../../dist'); // json-ptr
const data = {};

ptr.set(data, '#/peter/piper', 'man', true);
ptr.set(data, '#/peter/pan', 'boy', true);
ptr.set(data, '#/peter/pickle', 'dunno', true);

console.log(JSON.stringify(data, null, '  '));
