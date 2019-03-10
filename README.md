# json-ptr

[![CircleCI](https://circleci.com/gh/flitbit/json-ptr/tree/master.svg?style=svg)](https://circleci.com/gh/flitbit/json-ptr/tree/master)

[![bitHound Overall Score](https://www.bithound.io/github/flitbit/json-ptr/badges/score.svg)](https://www.bithound.io/github/flitbit/json-ptr)

A complete implementation of JSON Pointer ([RFC 6901](https://tools.ietf.org/html/rfc6901)) for nodejs and modern browsers.

## Background

I wrote this module a couple of years ago when I was unable to find what I considered a _complete implementation_ of [RFC 6901](https://tools.ietf.org/html/rfc6901). It turns out that I now use the hell out of it.

Since there are a few npm modules for you to choose from, see [the section on performance later in this _readme_](#user-content-performance); you can use your own judgement as to which package you should employ.

## Install

```bash
npm install json-ptr
```

## Use/Import

### [nodejs](https://nodejs.org/en/)

```javascript
// npm install json-ptr
var ptr = require('json-ptr')
```

### browser

```html
<script src="https://cdn.jsdelivr.net/npm/json-ptr@1/dist/json-ptr.min.js"></script>
<!-- exports an object named JsonPointer -->
<script>var ptr = JsonPointer.noConflict()</script>
```

### Module API

#### Classes

* [`JsonPointer`](#user-content-jsonpointer-class) : _class_ &ndash; a convenience class for working with JSON pointers.
* [`JsonReference`](#user-content-jsonreference-class) : _class_ &ndash; a convenience class for working with JSON references.

#### Functions

* [`.create(pointer)`](#user-content-createpointer)
* [`.has(target,pointer)`](#user-content-hastargetpointer)
* [`.get(target,pointer)`](#user-content-gettargetpointer)
* [`.set(target,pointer,value,force)`](#user-content-settarget-pointer-value-force)
* [`.flatten(target,fragmentId)`](#user-content-flattentarget-fragmentid)
* [`.list(target,fragmentId)`](#user-content-listtarget-fragmentid)
* [`.map(target,fragmentId)`](#user-content-maptarget-fragmentid)

All example code assumes data has this structure:

```javascript
var data = {
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
    name: 'plit peas',
    unit: 'lbs',
    instock: 8
  }]
}
```

#### .create(pointer)

Creates an instance of the `JsonPointer` class.

_arguments:_

* `pointer` : _string, required_ &ndash; a JSON pointer in [JSON string representation](https://tools.ietf.org/html/rfc6901#section-5) or [URI fragment identifier representation](https://tools.ietf.org/html/rfc6901#section-6)

_returns:_

* a new [`JsonPointer` instance](#user-content-jsonpointer-class)

_example:_

```javascript
var pointer = ptr.create('/legumes/0');
// fragmentId: #/legumes/0
```

#### .has(target,pointer)

Determins whether the specified `target` has a value at the `pointer`'s path.

_arguments:_

* `target` : _object, required_ &ndash; the target object
* `pointer` : _string, required_ &ndash; a JSON pointer in [JSON string representation](https://tools.ietf.org/html/rfc6901#section-5) or [URI fragment identifier representation](https://tools.ietf.org/html/rfc6901#section-6)

_returns:_

* the dereferenced value or _undefined_ if nonexistent

#### .get(target,pointer)

Gets a value from the specified `target` object at the `pointer`'s path

_arguments:_

* `target` : _object, required_ &ndash; the target object
* `pointer` : _string, required_ &ndash; a JSON pointer in [JSON string representation](https://tools.ietf.org/html/rfc6901#section-5) or [URI fragment identifier representation](https://tools.ietf.org/html/rfc6901#section-6)

_returns:_

* the dereferenced value or _undefined_ if nonexistent

_example:_

```javascript
var value = ptr.get(data, '/legumes/1');
// fragmentId: #/legumes/1
```

#### .set(target, pointer, value, force)

Sets the `value` at the specified `pointer` on the `target`. The default behavior is to do nothing if `pointer` is nonexistent.

_arguments:_

* `target` : _object, required_ &ndash; the target object
* `pointer` : _string, required_ &ndash; a JSON pointer in [JSON string representation](https://tools.ietf.org/html/rfc6901#section-5) or [URI fragment identifier representation](https://tools.ietf.org/html/rfc6901#section-6)
* `value` : _any_ &ndash; the value to be set at the specified `pointer`'s path
* `force` : _boolean, optional_ &ndash; indicates [whether nonexistent paths are created during the call](https://tools.ietf.org/html/rfc6901#section-7)

_returns:_

* The prior value at the pointer's path &mdash; therefore, _undefined_ means the pointer's path was nonexistent.

_example:_

```javascript
var prior = ptr.set(data, '#/legumes/1/instock', 50);
```

example force:

```javascript
var data = {};

ptr.set(data, '#/peter/piper', 'man', true);
ptr.set(data, '#/peter/pan', 'boy', true);
ptr.set(data, '#/peter/pickle', 'dunno', true);

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

#### .list(target, fragmentId)

Lists all of the pointers available on the specified `target`.

> See [a discussion about cycles in the object graph later in this document](#user-content-object-graph-cycles-and-recursion) if you have interest in how such is dealt with.

_arguments:_

* `target` : _object, required_ &ndash; the target object
* `fragmentId` : _boolean, optional_ &ndash; indicates whether fragment identifiers should be listed instead of pointers

_returns:_

* an array of `pointer-value` pairs

_example:_

```javascript
var list = ptr.list(data);
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
var list = ptr.list(data, true);
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

* `target` : _object, required_ &ndash; the target object
* `fragmentId` : _boolean, optional_ &ndash; indicates whether fragment identifiers should be listed instead of pointers

_returns:_

* a flattened object of `property-value` pairs as properties.

_example:_

```javascript
var obj = ptr.flatten(data, true);
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

* `target` : _object, required_ &ndash; the target object
* `fragmentId` : _boolean, optional_ &ndash; indicates whether fragment identifiers should be listed instead of pointers

_returns:_

* a Map object containing key-value pairs where keys are pointers.

_example:_

```javascript
var map = ptr.map(data, true);

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

* `pointer` : _string, required_ &ndash; a JSON pointer in [JSON string representation](https://tools.ietf.org/html/rfc6901#section-5) or [URI fragment identifier representation](https://tools.ietf.org/html/rfc6901#section-6).

_returns:_

* An array of path segments used as indexers to descend from a root/`target` object to a referenced value.

_example:_

```javascript
var path = ptr.decode('#/legumes/1/instock');
```

```json
[ "legumes", "1", "instock" ]
```

#### .decodePointer(pointer)

Decodes the specified `pointer`.

_arguments:_

* `pointer` : _string, required_ &ndash; a JSON pointer in [JSON string representation](https://tools.ietf.org/html/rfc6901#section-5).

_returns:_

* An array of path segments used as indexers to descend from a root/`target` object to a referenced value.

_example:_

```javascript
var path = ptr.decodePointer('/people/wilbur dongleworth/age');
```

```json
[ "people", "wilbur dongleworth", "age" ]
```

#### .encodePointer(path)

Encodes the specified `path` as a JSON pointer in [JSON string representation](https://tools.ietf.org/html/rfc6901#section-5).

_arguments:_

* `path` : _Array, required_ &ndash; an array of path segments

_returns:_

* A JSON pointer in [JSON string representation](https://tools.ietf.org/html/rfc6901#section-5).

_example:_

```javascript
var path = ptr.encodePointer(['people', 'wilbur dongleworth', 'age']);
```

```json
"/people/wilbur dongleworth/age"
```

#### .decodeUriFragmentIdentifier(pointer)

Decodes the specified `pointer`.

_arguments:_

* `pointer` : _string, required_ &ndash; a JSON pointer in [URI fragment identifier representation](https://tools.ietf.org/html/rfc6901#section-6).

_returns:_

* An array of path segments used as indexers to descend from a root/`target` object to a referenced value.

_example:_

```javascript
var path = ptr.decodePointer('#/people/wilbur%20dongleworth/age');
```

```json
[ "people", "wilbur dongleworth", "age" ]
```

#### .encodeUriFragmentIdentifier(path)

Encodes the specified `path` as a JSON pointer in [URI fragment identifier representation](https://tools.ietf.org/html/rfc6901#section-6).

_arguments:_

* `path` : _Array, required_ - an array of path segments

_returns:_

* A JSON pointer in [URI fragment identifier representation](https://tools.ietf.org/html/rfc6901#section-6).

_example:_

```javascript
var path = ptr.encodePointer(['people', 'wilbur dongleworth', 'age']);
```

```json
"#/people/wilbur%20dongleworth/age"
```

#### .noConflict()

Restores a conflicting `JsonPointer` variable in the global/root namespace (not necessary in node, but useful in browsers).

_example:_

```html
  <!-- ur codez -->
  <script src="/json-ptr-0.3.0.min.js"></script>
  <script>
  // At this point, JsonPointer is the json-ptr module
  var ptr = JsonPointer.noConflict();
  // and now it is restored to whatever it was before the json-ptr import.
  </script>
```

### `JsonPointer` Class

Encapsulates pointer related operations for a specified `pointer`.

_properties:_

* `.path` : _array_ &ndash; contains the pointer's path segements.
* `.pointer` : _string_ &ndash; the pointer's [JSON string representation](https://tools.ietf.org/html/rfc6901#section-5)
* `.uriFragmentIdentifier` : _string_ &ndash; the pointer's [URI fragment identifier representation](https://tools.ietf.org/html/rfc6901#section-6)

_methods:_

#### .has(target)

Determins whether the specified `target` has a value at the pointer's path.

#### .get(target)

Looks up the specified `target`'s value at the pointer's path if such exists; otherwise _undefined_.

#### .set(target, value, force)

Sets the specified `target`'s value at the pointer's path, if such exists.If `force` is specified (_truthy_), missing path segments are created and the value is always set at the pointer's path.

_arguments:_

* `target` : _object, required_ &ndash; the target object
* `value` : _any_ &ndash; the value to be set at the specified `pointer`'s path
* `force` : _boolean, optional_ &ndash; indicates [whether nonexistent paths are created during the call](https://tools.ietf.org/html/rfc6901#section-7)

_result:_

* The prior value at the pointer's path &mdash; therefore, _undefined_ means the pointer's path was nonexistent.

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

var ptr = require('..'),
  http = require('http'),
  util = require('util');

// A flickr feed, tags surf,pipeline
var feed = 'http://api.flickr.com/services/feeds/photos_public.gne?tags=surf,pipeline&tagmode=all&format=json&jsoncallback=processResponse';

// Compile/prepare the pointers...
var items = ptr.create('#/items');
var author = ptr.create('#/author');
var media = ptr.create('#/media/m');

function processResponse(json) {
  var data = items.get(json);

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
  var data = '';

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

* 2019-03-10 &mdash; __1.1.2__
  * Updated packages to remove critical security concern among dev dependencies'

* 2016-07-26 &mdash; __1.0.1__
  * Fixed a problem with the Babel configuration

* 2016-01-12 &mdash; __1.0.0__
  * Rolled major version to 1 to reflect breaking change in `.list(obj, fragmentId)`.

* 2016-01-02 &mdash; __0.3.0__
  * Retooled for node 4+
  * Better compiled pointers
  * Unrolled recursive `.list` function
  * Added `.map` function
  * Fully linted
  * Lots more tests and examples.
  * Documented many previously undocumented features.

* 2014-10-21 &mdash; __0.2.0__  Added #list function to enumerate all properties in a graph, producing fragmentId/value pairs.

## License

[MIT](https://github.com/flitbit/json-ptr/blob/master/LICENSE)
