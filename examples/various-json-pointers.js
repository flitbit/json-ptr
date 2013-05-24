var assert = require('assert'),
ptr = require('..')
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

// JSON Pointers (as strings)

var n = -1
, ub = 10000
, start = process.hrtime();


while(++n < ub) {

  assert.equal(ptr.get(obj, "/a"), n + 1);
  assert.equal(ptr.get(obj, "/b/c"), n + 2);
  assert.equal(ptr.get(obj, "/d/e/0/a"), n + 3);
  assert.equal(ptr.get(obj, "/d/e/1/b"), n + 4);
  assert.equal(ptr.get(obj, "/d/e/2/c"), n + 5);

  assert.equal(ptr.set(obj, "/a", n + 2), n + 1);
  assert.equal(ptr.set(obj, "/b/c", n + 3), n + 2);
  assert.equal(ptr.set(obj, "/d/e/0/a", n + 4), n + 3);
  assert.equal(ptr.set(obj, "/d/e/1/b", n + 5), n + 4);
  assert.equal(ptr.set(obj, "/d/e/2/c", n + 6), n + 5);

  assert.equal(ptr.get(obj, "/a"), n + 2);
  assert.equal(ptr.get(obj, "/b/c"), n + 3);
  assert.equal(ptr.get(obj, "/d/e/0/a"), n + 4);
  assert.equal(ptr.get(obj, "/d/e/1/b"), n + 5);
  assert.equal(ptr.get(obj, "/d/e/2/c"), n + 6);

  assert.equal(ptr.get(obj, ""), obj);
}

assert.throws(function() { 
  ptr.get(obj, "a");
});

assert.throws(function() { 
  ptr.set(obj, "a", {a: "value"});
});

// JSON Pointers (as URI fragments)
ub = ub * 2;
n--;
while(++n < ub) {

 assert.equal(ptr.get(obj, "#/a"), n + 1);
 assert.equal(ptr.get(obj, "#/b/c"), n + 2);
 assert.equal(ptr.get(obj, "#/d/e/0/a"), n + 3);
 assert.equal(ptr.get(obj, "#/d/e/1/b"), n + 4);
 assert.equal(ptr.get(obj, "#/d/e/2/c"), n + 5);

 assert.equal(ptr.set(obj, "#/a", n + 2), n + 1);
 assert.equal(ptr.set(obj, "#/b/c", n + 3), n + 2);
 assert.equal(ptr.set(obj, "#/d/e/0/a", n + 4), n + 3);
 assert.equal(ptr.set(obj, "#/d/e/1/b", n + 5), n + 4);
 assert.equal(ptr.set(obj, "#/d/e/2/c", n + 6), n + 5);

 assert.equal(ptr.get(obj, "#/a"), n + 2);
 assert.equal(ptr.get(obj, "#/b/c"), n + 3);
 assert.equal(ptr.get(obj, "#/d/e/0/a"), n + 4);
 assert.equal(ptr.get(obj, "#/d/e/1/b"), n + 5);
 assert.equal(ptr.get(obj, "#/d/e/2/c"), n + 6);

 assert.equal(ptr.get(obj, ""), obj);
}

assert.throws(function() { 
  // Cannot assign the root object:
  ptr.set(obj, "#", {});
});

assert.throws(function() { 
  ptr.get(obj, "#a");
});
assert.throws(function() { 
  ptr.set(obj, "#a", {a: "value"});
});

assert.throws(function() {
  ptr.get(obj, "a/");
});

var complexKeys = {
  "a/b": {
    c: 1
  },
  d: {
    "e/f": 2
  },
  "~1": 3,
  "01": 4
}

assert.equal(ptr.get(complexKeys, "/a~1b/c"), 1);
assert.equal(ptr.get(complexKeys, "/d/e~1f"), 2);
assert.equal(ptr.get(complexKeys, "/~01"), 3);
assert.equal(ptr.get(complexKeys, "/01"), 4);
assert.equal(ptr.get(complexKeys, "/a/b/c"), null);
assert.equal(ptr.get(complexKeys, "/~1"), null);

// draft-ietf-appsawg-json-pointer-08 has special array rules
var ary = [ "zero", "one", "two" ];
assert.equal(ptr.get(ary, "/01"), null);

// we should be able to push the end of an array with the special pointer '-'
assert.equal(ptr.set(ary, "/-", "three"), null);
assert.equal(ary[3], "three");
assert.equal(ptr.set(ary, "/-", "four"), null);
assert.equal(ary[4], "four");

// Examples from the draft:
var example = {
  "foo": ["bar", "baz"],
  "": 0,
  "a/b": 1,
  "c%d": 2,
  "e^f": 3,
  "g|h": 4,
  "i\\j": 5,
  "k\"l": 6,
  " ": 7,
  "m~n": 8
};

assert.equal(ptr.get(example, ""), example);
var ans = ptr.get(example, "/foo");
assert.equal(ans.length, 2);
assert.equal(ans[0], "bar");
assert.equal(ans[1], "baz");
assert.equal(ptr.get(example, "/foo/0"), "bar");
assert.equal(ptr.get(example, "/"), 0);
assert.equal(ptr.get(example, "/a~1b"), 1);
assert.equal(ptr.get(example, "/c%d"), 2);
assert.equal(ptr.get(example, "/e^f"), 3);
assert.equal(ptr.get(example, "/g|h"), 4);
assert.equal(ptr.get(example, "/i\\j"), 5);
assert.equal(ptr.get(example, "/k\"l"), 6);
assert.equal(ptr.get(example, "/ "), 7);
assert.equal(ptr.get(example, "/m~0n"), 8);

assert.equal(ptr.get(example, "#"), example);
var ans = ptr.get(example, "#/foo");
assert.equal(ans.length, 2);
assert.equal(ans[0], "bar");
assert.equal(ans[1], "baz");
assert.equal(ptr.get(example, "#/foo/0"), "bar");
assert.equal(ptr.get(example, "#/"), 0);
assert.equal(ptr.get(example, "#/a~1b"), 1);
assert.equal(ptr.get(example, "#/c%25d"), 2);
assert.equal(ptr.get(example, "#/e%5Ef"), 3);
assert.equal(ptr.get(example, "#/g%7Ch"), 4);
assert.equal(ptr.get(example, "#/i%5Cj"), 5);
assert.equal(ptr.get(example, "#/k%22l"), 6);
assert.equal(ptr.get(example, "#/%20"), 7);
assert.equal(ptr.get(example, "#/m~0n"), 8);

console.log("All tests pass.");