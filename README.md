# json-ptr

[![CircleCI](https://circleci.com/gh/flitbit/json-ptr/tree/master.svg?style=svg)](https://circleci.com/gh/flitbit/json-ptr/tree/master)

A complete implementation of JSON Pointer ([RFC 6901](https://tools.ietf.org/html/rfc6901)) for nodejs and modern browsers.

## Background

I wrote this module a couple of years ago when I was unable to find what I considered a _complete implementation_ of [RFC 6901](https://tools.ietf.org/html/rfc6901). It turns out that I now use the hell out of it.

Since there are a few npm modules for you to choose from, see [the section on performance later in this _readme_](#user-content-performance); you can use your own judgement as to which package you should employ.

## Install

```bash
npm install json-ptr
```

## Use

### [nodejs](https://nodejs.org/en/)

```javascript
import { JsonPointer, create } from 'json-ptr';
```

### Module API

#### Classes

-   [`JsonPointer`](#user-content-jsonpointer-class) : _class_ – a convenience class for working with JSON pointers.
-   [`JsonReference`](#user-content-jsonreference-class) : _class_ – a convenience class for working with JSON references.

#### Functions

-   [`.create(pointer)`](#user-content-createpointer)
-   [`.has(target,pointer)`](#user-content-hastargetpointer)
-   [`.get(target,pointer)`](#user-content-gettargetpointer)
-   [`.set(target,pointer,value,force)`](#user-content-settarget-pointer-value-force)
-   [`.unset(target,pointer,value,force)`](#user-content-settarget-pointer-value-force)
-   [`.flatten(target,fragmentId)`](#user-content-flattentarget-fragmentid)
-   [`.list(target,fragmentId)`](#user-content-listtarget-fragmentid)
-   [`.map(target,fragmentId)`](#user-content-maptarget-fragmentid)

All example code assumes data has this structure:

```javascript
const data = {
  legumes: [{
    name: 'pinto beans',
    unit: 'lbs',
    instock: 4
  }, {
    name: 'lima beans',
    unit: 'lbs',
    instock: 21
  }, {
    name: 'black eyed peas',
    unit: 'lbs',
    instock: 13
  }, {
    name: 'split peas',
    unit: 'lbs',
    instock: 8
  }]
}
```

#### .create(pointer: string | string\[]): JsonPointer

Creates an instance of the `JsonPointer` class.

_arguments:_

-   `pointer` : _string, required_ – a JSON pointer in [JSON string representation](https://tools.ietf.org/html/rfc6901#section-5) or [URI fragment identifier representation](https://tools.ietf.org/html/rfc6901#section-6)

_returns:_

-   a new [`JsonPointer` instance](#user-content-jsonpointer-class)

_example:_

```ts
const pointer = JsonPointer.create('/legumes/0');
// fragmentId: #/legumes/0
```

#### .has(target: unknown, pointer: string | string\[] | JsonPointer): boolean

Determines whether the specified `target` has a value at the `pointer`'s path.

_arguments:_

-   `target` : _object, required_ – the target object
-   `pointer` : _string, required_ – a JSON pointer in [JSON string representation](https://tools.ietf.org/html/rfc6901#section-5) or [URI fragment identifier representation](https://tools.ietf.org/html/rfc6901#section-6)

_returns:_

-   the dereferenced value or _undefined_ if nonexistent

#### .get(target,pointer)

Gets a value from the specified `target` object at the `pointer`'s path

_arguments:_

-   `target` : _object, required_ – the target object
-   `pointer` : _string, required_ – a JSON pointer in [JSON string representation](https://tools.ietf.org/html/rfc6901#section-5) or [URI fragment identifier representation](https://tools.ietf.org/html/rfc6901#section-6)

_returns:_

-   the dereferenced value or _undefined_ if nonexistent

_example:_

```javascript
let value = JsonPointer.get(data, '/legumes/1');
// fragmentId: #/legumes/1
```

#### .set(target, pointer, value, force)

Sets the `value` at the specified `pointer` on the `target`. The default behavior is to do nothing if `pointer` is nonexistent.

_arguments:_

-   `target` : _object, required_ – the target object
-   `pointer` : _string, required_ – a JSON pointer in [JSON string representation](https://tools.ietf.org/html/rfc6901#section-5) or [URI fragment identifier representation](https://tools.ietf.org/html/rfc6901#section-6)
-   `value` : _any_ – the value to be set at the specified `pointer`'s path
-   `force` : _boolean, optional_ – indicates [whether nonexistent paths are created during the call](https://tools.ietf.org/html/rfc6901#section-7)

_returns:_

-   The prior value at the pointer's path — therefore, _undefined_ means the pointer's path was nonexistent.

_example:_

```javascript
let prior = JsonPointer.set(data, '#/legumes/1/instock', 50);
```

example force:

```javascript
let data = {};

JsonPointer.set(data, '#/peter/piper', 'man', true);
JsonPointer.set(data, '#/peter/pan', 'boy', true);
JsonPointer.set(data, '#/peter/pickle', 'dunno', true);

console.log(JSON.stringify(data, null, '  '));
```

```json
{
  "peter": {
    "piper": "man",
    "pan": "boy",
    "pickle": "dunno"
  }
}
```

#### .unset(target, pointer)

Unsets the `value` at the specified `pointer` on the `target` and returns the value. The default behavior is to do nothing if `pointer` is nonexistent.

_arguments:_

-   `target` : _object, required_ – the target object
-   `pointer` : _string, required_ – a JSON pointer in [JSON string representation](https://tools.ietf.org/html/rfc6901#section-5) or [URI fragment identifier representation](https://tools.ietf.org/html/rfc6901#section-6)

_returns:_

-   The dereferenced value or _undefined_ if nonexistent

_example:_

```javascript
var prior = ptr.unset(data, '#/legumes/1/instock');
```

example force:

```javascript
var data = {};

ptr.unset(data, '#/peter/piper');
ptr.unset(data, '#/peter/pan');

console.log(JSON.stringify(data, null, '  '));
```

```json
{
  "peter": {
    "pickle": "dunno"
  }
}
```

#### .list(target, fragmentId)

Lists all of the pointers available on the specified `target`.

> See [a discussion about cycles in the object graph later in this document](#user-content-object-graph-cycles-and-recursion) if you have interest in how such is dealt with.

_arguments:_

-   `target` : _object, required_ – the target object
-   `fragmentId` : _boolean, optional_ – indicates whether fragment identifiers should be listed instead of pointers

_returns:_

-   an array of `pointer-value` pairs

_example:_

```javascript
let list = JsonPointer.list(data);
```

```json
[ ...
  {
    "pointer": "/legumes/2/unit",
    "value": "ea"
  },
  {
    "pointer": "/legumes/2/instock",
    "value": 9340
  },
  {
    "pointer": "/legumes/3/name",
    "value": "plit peas"
  },
  {
    "pointer": "/legumes/3/unit",
    "value": "lbs"
  },
  {
    "pointer": "/legumes/3/instock",
    "value": 8
  }
]
```

_`fragmentId` example:_

```javascript
let list = JsonPointer.list(data, true);
```

```json
[ ...
  {
    "fragmentId": "#/legumes/2/unit",
    "value": "ea"
  },
  {
    "fragmentId": "#/legumes/2/instock",
    "value": 9340
  },
  {
    "fragmentId": "#/legumes/3/name",
    "value": "plit peas"
  },
  {
    "fragmentId": "#/legumes/3/unit",
    "value": "lbs"
  },
  {
    "fragmentId": "#/legumes/3/instock",
    "value": 8
  }
]
```

#### .flatten(target, fragmentId)

Flattens an object graph (the `target`) into a single-level object of `pointer-value` pairs.

_arguments:_

-   `target` : _object, required_ – the target object
-   `fragmentId` : _boolean, optional_ – indicates whether fragment identifiers should be listed instead of pointers

_returns:_

-   a flattened object of `property-value` pairs as properties.

_example:_

```javascript
let obj = JsonPointer.flatten(data, true);
```

```json
{ ...
  "#/legumes/1/name": "lima beans",
  "#/legumes/1/unit": "lbs",
  "#/legumes/1/instock": 21,
  "#/legumes/2/name": "black eyed peas",
  "#/legumes/2/unit": "ea",
  "#/legumes/2/instock": 9340,
  "#/legumes/3/name": "plit peas",
  "#/legumes/3/unit": "lbs",
  "#/legumes/3/instock": 8
}
```

#### .map(target, fragmentId)

Flattens an object graph (the `target`) into a [Map object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map).

_arguments:_

-   `target` : _object, required_ – the target object
-   `fragmentId` : _boolean, optional_ – indicates whether fragment identifiers should be listed instead of pointers

_returns:_

-   a Map object containing key-value pairs where keys are pointers.

_example:_

```javascript
let map = JsonPointer.map(data, true);

for (let it of map) {
  console.log(JSON.stringify(it, null, '  '));
}
```

```json
...
["#/legumes/0/name", "pinto beans"]
["#/legumes/0/unit", "lbs"]
["#/legumes/0/instock", 4 ]
["#/legumes/1/name", "lima beans"]
["#/legumes/1/unit", "lbs"]
["#/legumes/1/instock", 21 ]
["#/legumes/2/name", "black eyed peas"]
["#/legumes/2/unit", "ea"]
["#/legumes/2/instock", 9340 ]
["#/legumes/3/name", "plit peas"]
["#/legumes/3/unit", "lbs"]
["#/legumes/3/instock", 8 ]
```

#### .decode(pointer)

Decodes the specified `pointer`.

_arguments:_

-   `pointer` : _string, required_ – a JSON pointer in [JSON string representation](https://tools.ietf.org/html/rfc6901#section-5) or [URI fragment identifier representation](https://tools.ietf.org/html/rfc6901#section-6).

_returns:_

-   An array of path segments used as indexers to descend from a root/`target` object to a referenced value.

_example:_

```javascript
let path = JsonPointer.decode('#/legumes/1/instock');
```

```json
[ "legumes", "1", "instock" ]
```

#### decodePointer(pointer)

Decodes the specified `pointer`.

_arguments:_

-   `pointer` : _string, required_ – a JSON pointer in [JSON string representation](https://tools.ietf.org/html/rfc6901#section-5).

_returns:_

-   An array of path segments used as indexers to descend from a root/`target` object to a referenced value.

_example:_

```javascript
let path = decodePointer('/people/wilbur dongleworth/age');
```

```json
[ "people", "wilbur dongleworth", "age" ]
```

#### encodePointer(path)

Encodes the specified `path` as a JSON pointer in [JSON string representation](https://tools.ietf.org/html/rfc6901#section-5).

_arguments:_

-   `path` : _Array, required_ – an array of path segments

_returns:_

-   A JSON pointer in [JSON string representation](https://tools.ietf.org/html/rfc6901#section-5).

_example:_

```javascript
let path = encodePointer(['people', 'wilbur dongleworth', 'age']);
```

```json
"/people/wilbur dongleworth/age"
```

#### decodeUriFragmentIdentifier(pointer)

Decodes the specified `pointer`.

_arguments:_

-   `pointer` : _string, required_ – a JSON pointer in [URI fragment identifier representation](https://tools.ietf.org/html/rfc6901#section-6).

_returns:_

-   An array of path segments used as indexers to descend from a root/`target` object to a referenced value.

_example:_

```javascript
let path = decodePointer('#/people/wilbur%20dongleworth/age');
```

```json
[ "people", "wilbur dongleworth", "age" ]
```

#### encodeUriFragmentIdentifier(path)

Encodes the specified `path` as a JSON pointer in [URI fragment identifier representation](https://tools.ietf.org/html/rfc6901#section-6).

_arguments:_

-   `path` : _Array, required_ - an array of path segments

_returns:_

-   A JSON pointer in [URI fragment identifier representation](https://tools.ietf.org/html/rfc6901#section-6).

_example:_

```javascript
let path = ptr.encodePointer(['people', 'wilbur dongleworth', 'age']);
```

```json
"#/people/wilbur%20dongleworth/age"
```

### `JsonPointer` Class

Encapsulates pointer related operations for a specified `pointer`.

_properties:_

-   `.path` : _array_ – contains the pointer's path segements.
-   `.pointer` : _string_ – the pointer's [JSON string representation](https://tools.ietf.org/html/rfc6901#section-5)
-   `.uriFragmentIdentifier` : _string_ – the pointer's [URI fragment identifier representation](https://tools.ietf.org/html/rfc6901#section-6)

_methods:_

#### .has(target)

Determins whether the specified `target` has a value at the pointer's path.

#### .get(target)

Looks up the specified `target`'s value at the pointer's path if such exists; otherwise _undefined_.

#### .set(target, value, force)

Sets the specified `target`'s value at the pointer's path, if such exists.If `force` is specified (_truthy_), missing path segments are created and the value is always set at the pointer's path.

_arguments:_

-   `target` : _object, required_ – the target object
-   `value` : _any_ – the value to be set at the specified `pointer`'s path
-   `force` : _boolean, optional_ – indicates [whether nonexistent paths are created during the call](https://tools.ietf.org/html/rfc6901#section-7)

_result:_

-   The prior value at the pointer's path — therefore, _undefined_ means the pointer's path was nonexistent.

#### .concat(target)

Creates new pointer appending target to the current pointer's path

_arguments:_

-   `target` : _JsonPointer, array or string, required_ – the path to be appended to the current path

## Performance

This repository has a [companion repository that makes some performance comparisons](https://github.com/flitbit/json-pointer-comparison) between `json-ptr`, [`jsonpointer`](https://www.npmjs.com/package/jsonpointer) and [`json-pointer`](https://www.npmjs.com/package/json-pointer).

**All timings are expressed as nanoseconds:**

```text
.flatten(obj)
...
MODULE       | METHOD  | COMPILED | SAMPLES |       AVG | SLOWER
json-pointer | dict    |          | 10      | 464455181 |
json-ptr     | flatten |          | 10      | 770424039 | 65.88%
jsonpointer  | n/a     |          | -       |         - |

.has(obj, pointer)
...
MODULE       | METHOD | COMPILED | SAMPLES | AVG  | SLOWER
json-ptr     | has    | compiled | 1000000 | 822  |
json-ptr     | has    |          | 1000000 | 1747 | 112.53%
json-pointer | has    |          | 1000000 | 2683 | 226.4%
jsonpointer  | n/a    |          | -       | -    |

.has(obj, fragmentId)
...
MODULE       | METHOD | COMPILED | SAMPLES | AVG  | SLOWER
json-ptr     | has    | compiled | 1000000 | 602  |
json-ptr     | has    |          | 1000000 | 1664 | 176.41%
json-pointer | has    |          | 1000000 | 2569 | 326.74%
jsonpointer  | n/a    |          | -       | -    |

.get(obj, pointer)
...
MODULE       | METHOD | COMPILED | SAMPLES | AVG  | SLOWER
json-ptr     | get    | compiled | 1000000 | 590  |
json-ptr     | get    |          | 1000000 | 1676 | 184.07%
jsonpointer  | get    | compiled | 1000000 | 2102 | 256.27%
jsonpointer  | get    |          | 1000000 | 2377 | 302.88%
json-pointer | get    |          | 1000000 | 2585 | 338.14%

.get(obj, fragmentId)
...
MODULE       | METHOD | COMPILED | SAMPLES | AVG  | SLOWER
json-ptr     | get    | compiled | 1000000 | 587  |
json-ptr     | get    |          | 1000000 | 1673 | 185.01%
jsonpointer  | get    | compiled | 1000000 | 2105 | 258.6%
jsonpointer  | get    |          | 1000000 | 2451 | 317.55%
json-pointer | get    |          | 1000000 | 2619 | 346.17%

```

> These results have been elided because there is too much detail in the actual. Your results will vary slightly depending on the resources available where you run it.

It is important to recognize in the performance results that _compiled_ options are faster. As a general rule, you should _compile_ any pointers you'll be using repeatedly.

_Consider this example code that queries the flickr API and prints results to the console:_

```javascript
'use strict';

let ptr = require('..'),
  http = require('http'),
  util = require('util');

// A flickr feed, tags surf,pipeline
let feed = 'http://api.flickr.com/services/feeds/photos_public.gne?tags=surf,pipeline&tagmode=all&format=json&jsoncallback=processResponse';

// Compile/prepare the pointers...
let items = ptr.create('#/items');
let author = ptr.create('#/author');
let media = ptr.create('#/media/m');

function processResponse(json) {
  let data = items.get(json);

  if (data && Array.isArray(data)) {
    let images = data.reduce((acc, it) => {
      // Using the prepared pointers to select parts...
      acc.push({
        author: author.get(it),
        media: media.get(it)
      });
      return acc;
    }, []);
    console.log(util.inspect(images, false, 9));
  }
}

http.get(feed, function(res) {
  let data = '';

  res.on('data', function(chunk) {
    data += chunk;
  });

  res.on('end', function() {
    // result is formatted as jsonp... this is for illustration only.
    data = eval(data); // eslint-disable-line no-eval
    processResponse(data);
  });
}).on('error', function(e) {
  console.log('Got error: ' + e.message);
});
```

> \[[example/real-world.js](https://github.com/flitbit/json-ptr/blob/master/examples/real-world.js)]

## Tests

Tests are written using [mocha](https://mochajs.org/) and [expect.js](https://github.com/Automattic/expect.js).

```bash
npm test
```

... or ...

```bash
mocha
```

## Releases

-   2019-09-14 — **1.2.0**
    -   Merged new `.concat` function contributed by @vuwuv, updated dependencies.

-   2019-03-10 — **1.1.2**
    -   Updated packages to remove critical security concern among dev dependencies'

-   2016-07-26 — **1.0.1**
    -   Fixed a problem with the Babel configuration

-   2016-01-12 — **1.0.0**
    -   Rolled major version to 1 to reflect breaking change in `.list(obj, fragmentId)`.

-   2016-01-02 — **0.3.0**
    -   Retooled for node 4+
    -   Better compiled pointers
    -   Unrolled recursive `.list` function
    -   Added `.map` function
    -   Fully linted
    -   Lots more tests and examples.
    -   Documented many previously undocumented features.

-   2014-10-21 — **0.2.0**  Added #list function to enumerate all properties in a graph, producing fragmentId/value pairs.

## License

[MIT](https://github.com/flitbit/json-ptr/blob/master/LICENSE)
