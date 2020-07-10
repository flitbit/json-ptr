var ptr = require('../../dist');
var util = require('util');

var a = {
    Foo: []
};

var p = ptr.create('/Foo/0/Bar/Baz');

// Succeeds but with incorrect results.
p.set(a, 5, true);
// a is now { Foo: [5] }
// a should be
// {
//   Foo: [
//     {
//       Bar: {
//         Baz: 5
//       }
//     }
//   ]
// }
console.log(util.inspect(a, false, 9));
console.log(util.inspect(ptr.list(a), false, 9));

p = ptr.create('/Foo/Bar/Baz');

var b = {
    Foo: {}
};

p.set(b, 5, true);
// Works as you'd expect.
// b is now
// {
//   Foo: {
//     Bar: {
//       Baz: 5
//     }
//   }
// }
console.log(util.inspect(b, false, 9));
console.log(util.inspect(ptr.list(a), false, 9));
