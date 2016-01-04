var util = require('util'),
  JsonPointer = require('..');
var data = {
  a: 1,
  b: {
    c: 2
  },
  d: {
    e: [{
      a: 3
    }, {
      b: 4
    }, {
      c: 5
    }]
  },
  f: null
};

var items = JsonPointer.list(data);

console.log(util.inspect(items, false, 99));

items = [];
JsonPointer.list(data, function(item) {
  var type = typeof item.value;
  if (type === 'object') {
    if (Array.isArray(item.value)) {
      item.value = '$A';
    } else {
      if (item.value !== null) {
        item.value = '$O';
      }
    }
  }
  items.push(item);
});

console.log(util.inspect(items, false, 99));
