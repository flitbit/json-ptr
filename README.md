# json-ptr

[![CircleCI](https://circleci.com/gh/flitbit/json-ptr/tree/master.svg?style=svg)](https://circleci.com/gh/flitbit/json-ptr/tree/master)

A complete implementation of JSON Pointer ([RFC 6901](https://tools.ietf.org/html/rfc6901)) for nodejs and modern browsers.

## Background

I wrote this a few years back when I was unable to find a _complete implementation_ of [RFC 6901](https://tools.ietf.org/html/rfc6901). It turns out that I now use the hell out of it.

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

### Example

There are many uses for JSON Pointers, here's one we encountered when we updated a public API and suddenly had clients sending two different message bodies to our APIs. This example is contrived to illustrate how we supported both new and old incoming messages:

```ts
// examples/versions.ts
import { JsonPointer } from 'json-ptr';

export type SupportedVersion = '1.0' | '1.1';

interface PrimaryGuestNamePointers {
  name: JsonPointer;
  surname: JsonPointer;
  honorific: JsonPointer;
}
const versions: Record<SupportedVersion, PrimaryGuestNamePointers> = {
  '1.0': {
    name: JsonPointer.create('/guests/0/name'),
    surname: JsonPointer.create('/guests/0/surname'),
    honorific: JsonPointer.create('/guests/0/honorific'),
  },
  '1.1': {
    name: JsonPointer.create('/primary/primaryGuest/name'),
    surname: JsonPointer.create('/primary/primaryGuest/surname'),
    honorific: JsonPointer.create('/primary/primaryGuest/honorific'),
  }
};

interface Reservation extends Record<string, unknown> {
  version?: SupportedVersion;
}

/**
 * Gets the primary guest's name from the specified reservation.
 * @param reservation a reservation, either version 1.0 or bearing a `version`
 * property indicating the version.
 */
function primaryGuestName(reservation: Reservation): string {
  const pointers = versions[reservation.version || '1.0'];
  if (!pointers) {
    throw new Error(`Unsupported reservation version: ${reservation.version}`);
  }
  const name = pointers.name.get(reservation) as string;
  const surname = pointers.surname.get(reservation) as string;
  const honorific = pointers.honorific.get(reservation) as string;
  const names: string[] = [];
  if (honorific) names.push(honorific);
  if (name) names.push(name);
  if (surname) names.push(surname);
  return names.join(' ');
}

// The original layout of a reservation (only the parts relevant to our example)
const reservationV1: Reservation = {
  guests: [{
    name: 'Wilbur',
    surname: 'Finkle',
    honorific: 'Mr.'
  }, {
    name: 'Wanda',
    surname: 'Finkle',
    honorific: 'Mrs.'
  }, {
    name: 'Wilma',
    surname: 'Finkle',
    honorific: 'Miss',
    child: true,
    age: 12
  }]
  // ...
};

// The new layout of a reservation (only the parts relevant to our example)
const reservationV1_1: Reservation = {
  version: '1.1',
  primary: {
    primaryGuest: {
      name: 'Wilbur',
      surname: 'Finkle',
      honorific: 'Mr.'
    },
    additionalGuests: [{
      name: 'Wanda',
      surname: 'Finkle',
      honorific: 'Mrs.'
    }, {
      name: 'Wilma',
      surname: 'Finkle',
      honorific: 'Miss',
      child: true,
      age: 12
    }]
    // ...
  }
  // ...
};

console.log(primaryGuestName(reservationV1));
console.log(primaryGuestName(reservationV1_1));

```

## API Documentation

The API documentation is generated from code comments by typedoc and [hosted here](<>).

We welcome new issues if you have questions or need additional documentation.

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
