const { JsonPointer } = require( '../../dist');
const { data } = require( './data');

const pointer = JsonPointer.create('/legumes/2');
// const pointer = new JsonPointer('/legumes/2');
// fragmentId: #/legumes/2

const value = pointer.get(data);

console.log(`There are ${value.instock} ${value.unit} of ${value.name} in stock.`);
