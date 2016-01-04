'use strict';

var ptr = require('../../'); // json-ptr
var data = {};

ptr.set(data, '#/peter/piper', 'man', true);
ptr.set(data, '#/peter/pan', 'boy', true);
ptr.set(data, '#/peter/pickle', 'dunno', true);

console.log(JSON.stringify(data, null, '  '));
