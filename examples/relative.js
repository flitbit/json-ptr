const assert = require('assert');
const { JsonPointer } = require('../dist');

const doc = {
  foo: ['bar', 'baz'],
  highly: {
    nested: {
      objects: true,
    },
  },
};

const p = new JsonPointer('/foo/1');
assert(p.relative(doc, '0') == 'baz');
assert(p.relative(doc, '1/0') == 'bar');
assert(p.relative(doc, '2/highly/nested/objects') == true);
