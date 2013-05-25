var assert = require('assert'),
ptr = require('./node-jsonpointer/jsonpointer'),
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

  assert.equal(ptr.get(obj, "/a"),       n + 1);
  assert.equal(ptr.get(obj, "/b/c"),     n + 2);
  assert.equal(ptr.get(obj, "/d/e/0/a"), n + 3);
  assert.equal(ptr.get(obj, "/d/e/1/b"), n + 4);
  assert.equal(ptr.get(obj, "/d/e/2/c"), n + 5);

  assert.equal(ptr.set(obj, "/a"      , n + 2), n + 1);
  assert.equal(ptr.set(obj, "/b/c"    , n + 3), n + 2);
  assert.equal(ptr.set(obj, "/d/e/0/a", n + 4), n + 3);
  assert.equal(ptr.set(obj, "/d/e/1/b", n + 5), n + 4);
  assert.equal(ptr.set(obj, "/d/e/2/c", n + 6), n + 5);

}

elapsed(start, function(ms) {
  console.log(''.concat(ms.toFixed(3), ' ms: ', n * 5, ' reads and ', n * 5, ' writes against 5 pointers.'));
});