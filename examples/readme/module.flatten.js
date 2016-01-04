'use strict';

var ptr = require('../../'); // json-ptr
var data = require('./data');

// var obj = ptr.flatten(data);
var obj = ptr.flatten(data, true);

console.log(JSON.stringify(obj, null, '  '));
