/**
 * @hidden
 * @packageDocumentation
 */
const assert = require('assert');
const { JsonPointer, replace } = require('../');

const $wat = Symbol('$wat');

const origin = {
  [$wat]: { this: { is: 'subordinate ' } },
  name: 'name',
  age: 4,
};

const now = ['one', 2];

console.log(
  `typeof $wat = ${typeof $wat}, $wat.description = ${$wat.description}`,
);

console.log('map...');
for (let it of JsonPointer.map(origin, false, true).entries()) {
  console.log(JSON.stringify(it, null, ' '));
}
console.log('listPointers...');
console.log(JSON.stringify(JsonPointer.listPointers(origin, true), null, ' '));

console.log('listFragmentIds...');
console.log(
  JSON.stringify(JsonPointer.listFragmentIds(origin, true), null, ' '),
);

console.log('listPairs...');
const pairs = JsonPointer.listPairs(origin, true);
console.log(JSON.stringify(pairs, null, ' '));

// Ensure we can get and set by pointer path
console.log('pointersWithSymbol...');
const p = JsonPointer.pointersWithSymbol(origin, $wat);
console.log(JSON.stringify(p, null, ' '));

assert(p[0].get(origin) === origin[$wat]);
const expect = { is: 'the replacement' };
p[1].set(origin, expect);
assert(p[1].get(origin) === expect);

console.log(JSON.stringify(origin, null, ' '));
