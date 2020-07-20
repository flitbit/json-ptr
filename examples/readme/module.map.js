
const { JsonPointer: ptr } = require('../../'); // json-ptr
const { data } = require('./data');

// const map = ptr.map(data);
const map = ptr.map(data, true);

for (const it of map) {
  console.log(JSON.stringify(it, null, '  '));
}
