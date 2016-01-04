'use strict';

var ptr = require('../../'); // json-ptr
var data = require('./data');

// var list = ptr.list(data);
var list = ptr.list(data, true);

console.log(JSON.stringify(list, null, '  '));
