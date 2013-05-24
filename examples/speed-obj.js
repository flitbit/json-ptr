var assert = require('assert'),
ptr = require('..')
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
, a = ptr.create("/a")
, b = ptr.create("/b/c")
, d = ptr.create("/d/e/0/a")
, e = ptr.create("/d/e/1/b")
, f = ptr.create("/d/e/2/c")

while(++n < ub) {

  assert.equal(a.get(obj), 1);
  assert.equal(b.get(obj), 2);
  assert.equal(d.get(obj), 3);
  assert.equal(e.get(obj), 4);
  assert.equal(f.get(obj), 5);

}

elapsed(start, function(ms) {
  console.log(''.concat(ms.toFixed(3), ' ms: ', n * 5, ' reads against 5 pointers.'));
});