const assert = require('assert');
const { JsonPointer } = require('../');

// https://tools.ietf.org/id/draft-handrews-relative-json-pointer-00.html#rfc.section.5.1

const doc = {
  foo: ['bar', 'baz'],
  highly: {
    nested: {
      objects: true,
    },
  },
};

const p = new JsonPointer('/foo/1');
assert(p.rel(doc, '0') == 'baz');
assert(p.rel(doc, '1/0') == 'bar');
assert(p.rel(doc, '2/highly/nested/objects') == true);
assert(p.rel(doc, '0#') == 1);
assert(p.rel(doc, '1#') == 'foo');

const p2 = new JsonPointer('/highly/nested');
assert(p2.rel(doc, '0/objects') == true);
assert(p2.rel(doc, '1/nested/objects') == true);
assert(p2.rel(doc, '2/foo/0') == 'bar');
assert(p2.rel(doc, '0#') == 'nested');
assert(p2.rel(doc, '1#') == 'highly');

// Pre-compile relative pointers to dramatically improve performance in
// scenarios such as loops or when a piece of code will be frequently using
// the same relative location:
const compiled = p2.relative('1/nested/objects');
// ...once compiled, it is just another pointer...
assert(compiled.get(doc, '1/nested/objects') == true);
