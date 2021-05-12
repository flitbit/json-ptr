const { JsonPointer } = require('../../dist');
const util = require('util');

const o = {
  id: 1234,
  employee: null,
  created_on: '2021-05-11'
};

console.log(JsonPointer.get(o, '/employee/st_price'));