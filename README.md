# json-ptr

[![CircleCI](https://circleci.com/gh/flitbit/json-ptr/tree/master.svg?style=svg)](https://circleci.com/gh/flitbit/json-ptr/tree/master) [![codecov](https://codecov.io/gh/flitbit/json-ptr/branch/master/graph/badge.svg)](https://codecov.io/gh/flitbit/json-ptr)

A complete implementation of JSON Pointer ([RFC 6901](https://tools.ietf.org/html/rfc6901)) for nodejs and modern browsers.

## Background

I wrote this a few years back when I was unable to find a _complete implementation_ of [RFC 6901](https://tools.ietf.org/html/rfc6901). It turns out that I now use the hell out of it.

## Breaking Changes at v1.3.0

As was rightly pointed out in [this issue](https://github.com/flitbit/json-ptr/issues/24), I should have rolled the major version at `v1.3.0` instead of the minor version due to [breaking changes to the API](#user-content-where-did-the-global-functions-go). Not the worst blunder I've made, but my apologies all the same. Since the ship has sailed, I'm boosting the visibility of these breaking changes.

## Install

```bash
npm install json-ptr
```

## Use

### [nodejs](https://nodejs.org/en/)

```javascript
import { JsonPointer, create } from 'json-ptr';
```

## API Documentation

The [API documentation is generated from code by typedoc and hosted here](http://flitbit.github.io/json-ptr/classes/_src_pointer_.jsonpointer.html). Read the docs.

Documentation is always a work in progress, let us know by creating an issue if you need a scenario documented.

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

### Where did the Global Functions Go?

In version `v1.3.0` of the library, global functions were moved to static functions of the `JsonPointer` class. There should be no difference in arguments or behavior. If you were previously importing the global functions it is a small change to destructure them and have compatible code.

| Global Fn | Static Fn | Documentation |
|---|---|---|
| `create()`| `JsonPointer.create()`          | [Factory function that creates a `JsonPointer`](http://flitbit.github.io/json-ptr/classes/_src_pointer_.jsonpointer.html#create)                                                                                                        |
| `decode()`          | `JsonPointer.decode()`          | [Decodes the specified pointer into path segments.](http://flitbit.github.io/json-ptr/classes/_src_pointer_.jsonpointer.html#decode)                                                                                                    |
| `flatten()`         | `JsonPointer.flatten()`         | [DEvaluates the target's object graph, returning a Record&lt;Pointer, unknown> populated with pointers and the corresponding values from the graph..](http://flitbit.github.io/json-ptr/classes/_src_pointer_.jsonpointer.html#flatten) |
| `get()`             | `JsonPointer.get()`             | [Gets the target object's value at the pointer's location.](http://flitbit.github.io/json-ptr/classes/_src_pointer_.jsonpointer.html#get)                                                                                               |
| `has()`             | `JsonPointer.has()`             | [Determines if the specified target's object graph has a value at the pointer's location.](http://flitbit.github.io/json-ptr/classes/_src_pointer_.jsonpointer.html#has)                                                                |
| `list()`            |                                 | Replaced by `JsonPointer.listFragmentIds()` and `JsonPointer.listPointers()`.                                                                                                                                                           |
| `listFragmentIds()` | `JsonPointer.listFragmentIds()` | [Evaluates the target's object graph, returning a UriFragmentIdentifierPointerListItem for each location in the graph.](http://flitbit.github.io/json-ptr/classes/_src_pointer_.jsonpointer.html#listFragmentIds)                       |
| `listPointers()`    | `JsonPointer.listPointers()`    | [Evaluates the target's object graph, returning a JsonStringPointerListItem for each location in the graph.](http://flitbit.github.io/json-ptr/classes/_src_pointer_.jsonpointer.html#listPointers)                                     |
| `map()`             | `JsonPointer.map()`             | [Evaluates the target's object graph, returning a Map&lt;Pointer,unknown> populated with pointers and the corresponding values form the graph.](http://flitbit.github.io/json-ptr/classes/_src_pointer_.jsonpointer.html#map)           |
| `set()`             | `JsonPointer.set()`             | [Sets the target object's value, as specified, at the pointer's location.](http://flitbit.github.io/json-ptr/classes/_src_pointer_.jsonpointer.html#set)                                                                                |
|                     | `JsonPointer.unset()`           | [Removes the target object's value at the pointer's location.](http://flitbit.github.io/json-ptr/classes/_src_pointer_.jsonpointer.html#unset)                                                                                          |
| `visit()`           | `JsonPointer.visit()`           | [Evaluates the target's object graph, calling the specified visitor for every unique pointer location discovered while walking the graph.](http://flitbit.github.io/json-ptr/classes/_src_pointer_.jsonpointer.html#visit)              |

## Tests

We're maintaining near 100% test coverage. Visit our [circleci build page](https://app.circleci.com/pipelines/github/flitbit/json-ptr) and drill down on a recent build's _build and test_ step to see where we're at. It should look something like:

```text
=============================== Coverage summary ===============================
Statements   : 100% ( 270/270 )
Branches     : 100% ( 172/172 )
Functions    : 100% ( 49/49 )
Lines        : 100% ( 265/265 )
================================================================================
```

We use [mocha](https://mochajs.org/) so you can also clone the code and:

```text
$ npm install
$ npm test
```

Once you've run the tests on the command line you can open up [./tests.html](https://github.com/flitbit/json-ptr/blob/master/tests.html) in the browser of your choice.

## Performance

> WARNING! These performance metrics are quite outdated. We'll be updating as soon as we have time.

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

## Releases

- 2020-10-21 — **2.0.0** _*Breaking Change*_
  - Prototype pollution using this library is now disallowed and will throw an error. I've been looking into the origin of this issue and it seems to have been disclosed by mohan on [huntr.dev](https://www.huntr.dev/bounties/1-npm-json-ptr/). I received [a PR from](https://github.com/flitbit/json-ptr/pull/26) [@luci-m-666](https://github.com/luci-m-666), but found [another PR](https://github.com/418sec/json-ptr/pull/1) by [@alromh87](https://github.com/alromh87) that looks like the origin of the solution. Don't know who to thank, but thanks all -- somebody is due a bounty.
  - Just in case somebody was relying on `json-ptr` to support pointers across the prototype, I'm rolling the major version number because you're now broken.

> BEWARE of [Breaking Changes at v1.3.0!](#user-content-where-did-the-global-functions-go)

-   2020-07-20 — **1.3.2**
    -   Added missing `tslib` dependency.
    -   Documented [where the global functions are now located; moving them broke compatibility at v1.3.0](#user-content-where-did-the-global-functions-go).


-   2020-07-10 — **1.3.0** **BREAKING CHANGES**
    -   **BREAKING CHANGE:** Global functions are now static functions on the `JsonPointer` type. See [_Where did the Global Functions Go?_](#user-content-where-did-the-global-functions-go)
    -   Merged new `.unset()` function contributed by @chrishalbert, updated dependencies.
    -   Migrated to typescript and retooled build/test/deploy pipeline. Definitely typed.
    -   100% test coverage which illuminated some idiosyncrasies; maybe we killed unobserved bugs, nobody knows.

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
