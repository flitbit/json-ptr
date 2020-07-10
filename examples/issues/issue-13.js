const assert = require('assert');
const jsonpointer = require('../../dist');
const thing = Object.assign([1, 2, 3], { foo: 'bar' });

assert.equal('bar', jsonpointer.get(thing, '/foo'));
