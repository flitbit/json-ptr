'use strict';

var assert = require('assert');
var ptr = require('../../'); // json-ptr

var pointer = '/people/wilbur dongleworth/age';
var fragmentId = '#/people/wilbur%20dongleworth/age';

// round-trip encode pointer
var path = ptr.decode(pointer);
var decodedPointer = ptr.encodePointer(path);

// round-trip encode fragmentId
var fragmentPath = ptr.decode(fragmentId);
var decodedFragmentId = ptr.encodeUriFragmentIdentifier(fragmentPath);

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
