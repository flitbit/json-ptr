'use strict';

const assert = require('assert');
const { JsonPointer: ptr, encodePointer, encodeUriFragmentIdentifier } = require('../../dist'); // json-ptr

const pointer = '/people/wilbur dongleworth/age';
const fragmentId = '#/people/wilbur%20dongleworth/age';

// round-trip encode pointer
const path = ptr.decode(pointer);
const decodedPointer = encodePointer(path);

// round-trip encode fragmentId
const fragmentPath = ptr.decode(fragmentId);
const decodedFragmentId = encodeUriFragmentIdentifier(fragmentPath);

// pointers and fragments decode to equal paths and round-trip encode equal
assert.equal(pointer, decodedPointer);
assert.equal(fragmentId, decodedFragmentId);
assert.equal(path.length, fragmentPath.length);
path.forEach((segment, i) => {
  assert.equal(segment, fragmentPath[i]);
});

console.log(JSON.stringify({
  path, pointer, fragmentId
}, null, '  '));
