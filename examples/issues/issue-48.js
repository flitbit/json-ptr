const { JsonPointer } = require('../../');

// run `node index.js` in the terminal to repro

const obj = {};

const ptr = JsonPointer.create('/hi/e');

ptr.set(obj, 'hello', true);

console.log(`result`, obj);

// expected:
// { hi: {e: 'hello'} }

// got:
// { hi: [] }
