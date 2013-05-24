var assert = require('assert'),
ptr = require('..'),
elapsed = require('./elapsed')
;

var obj = {
  a: 1,
  b: {
    c: 2
  },
  d: {
    e: [{a:3}, {b:4}, {c:5}]
  }
};

var n = -1
, ub = 10000
, start = process.hrtime()
;

while(++n < ub) {

  assert.equal(ptr.get(obj, "/a"),       1);
  assert.equal(ptr.get(obj, "/b/c"),     2);
  assert.equal(ptr.get(obj, "/d/e/0/a"), 3);
  assert.equal(ptr.get(obj, "/d/e/1/b"), 4);
  assert.equal(ptr.get(obj, "/d/e/2/c"), 5);

}

elapsed(start, function(ms) {
  console.log(''.concat(ms.toFixed(3), ' ms: ', n * 5, ' reads against 5 pointers.'));
});