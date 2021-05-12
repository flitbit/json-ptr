const { JsonPointer } = require('../../dist');
const util = require('util');

var p = new JsonPointer("/I'm/bad");
console.log(util.inspect(p, false, 9));

var a = p.get({}); // expecting this to return undefined
console.log(util.inspect(a, false, 9));

p = new JsonPointer(["I'm", "also", "bad"]);
console.log(util.inspect(p, false, 9));

var a = p.get({}); // expecting this to return undefined
console.log(util.inspect(a, false, 9));