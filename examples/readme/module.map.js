
var ptr = require('../../'); // json-ptr
var data = require('./data');

// var map = ptr.map(data);
var map = ptr.map(data, true);

for (var it of map) {
  console.log(JSON.stringify(it, null, '  '));
}
