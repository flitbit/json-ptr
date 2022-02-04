import {
  Dereference,
  decodePtrInit,
  compilePointerDereference,
  setValueAtPath,
  encodePointer,
  encodeUriFragmentIdentifier,
  pickDecoder,
  unsetValueAtPath,
  decodeRelativePointer,
} from './util';
import {
  JsonStringPointer,
  UriFragmentIdentifierPointer,
  Pointer,
  RelativeJsonPointer,
  PathSegments,
  JsonStringPointerListItem,
  UriFragmentIdentifierPointerListItem,
} from './types';

/**
 * Determines if the value is an object (not null)
 * @param value the value
 * @returns true if the value is a non-null object; otherwise false.
 *
 * @hidden
 */
function isObject(value: unknown): boolean {
  return typeof value === 'object' && value !== null;
}

/**
 * Signature of visitor functions, used with [[JsonPointer.visit]] method. Visitors are callbacks invoked for every segment/branch of a target's object graph.
 *
 * Tree descent occurs in-order, breadth first.
 */
export type Visitor = (ptr: JsonPointer, val: unknown) => void;

/** @hidden */
interface Item {
  obj: unknown;
  path: PathSegments;
}

/** @hidden */
function shouldDescend(obj: unknown): boolean {
  return isObject(obj) && !JsonReference.isReference(obj);
}

/** @hidden */
function descendingVisit(
  target: unknown,
  visitor: Visitor,
  includeSymbols = false,
): void {
  const distinctObjects = new Map<unknown, JsonPointer>();
  const q: Item[] = [{ obj: target, path: [] }];
  while (q.length) {
    const { obj, path } = q.shift() as Item;
    visitor(new JsonPointer(path), obj);
    if (shouldDescend(obj)) {
      distinctObjects.set(obj, new JsonPointer(path));
      if (!Array.isArray(obj)) {
        let keys: (string | symbol)[] = Object.keys(obj as object);
        if (includeSymbols) {
          keys = keys.concat(Object.getOwnPropertySymbols(obj));
        }
        const len = keys.length;
        let i = -1;
        while (++i < len) {
          const it = (obj as Record<string | symbol, unknown>)[keys[i]];
          if (isObject(it) && distinctObjects.has(it)) {
            q.push({
              obj: new JsonReference(distinctObjects.get(it) as JsonPointer),
              path: path.concat(keys[i]),
            });
          } else {
            q.push({
              obj: it,
              path: path.concat(keys[i]),
            });
          }
        }
      } else {
        // handleArray
        let i = -1;
        const len = obj.length;
        while (++i < len) {
          const it = obj[i];
          if (isObject(it) && distinctObjects.has(it)) {
            q.push({
              obj: new JsonReference(distinctObjects.get(it) as JsonPointer),
              path: path.concat([i]),
            });
          } else {
            q.push({
              obj: it,
              path: path.concat([i]),
            });
          }
        }
      }
    }
  }
}

/** @hidden */
const $get = Symbol('$get');
/** @hidden */
const $frg = Symbol('$frg');
/** @hidden */
const $symbols = Symbol('$symbols');
/**
 * Symbol used to cache pre-compiled getters on target objects used with static
 * pointer methods.
 * @hidden
 */
const $cache = Symbol('$cache');

interface Symbols {
  [$symbols]: number[];
}

interface Caching {
  [$cache]?: Map<string, [number[], PathSegments, Dereference][]>;
}

/**
 * Enables pointer caching for the specified object. Pointer caching can save
 * processing cycles when frequently executing pointer operations against an
 * object, using transient JsonPointer instances, such as those used by static
 * methods like [[JsonPointer.get]].
 *
 * The cache gets cleaned up with the target instance, when the target goes out
 * of scope.
 * @param target the object on which pointer caching will be enabled.
 * @returns the target object
 */
export const enablePointerCaching = (target: unknown): unknown => {
  const caching = target as Caching;
  let cache = caching[$cache];
  if (!cache) {
    cache = new Map<string, [number[], PathSegments, Dereference][]>();
    caching[$cache] = cache;
  }
  return target;
};

export const disablePointerCaching = (target: unknown): unknown => {
  const caching = target as Caching;
  if (caching[$cache]) {
    delete caching[$cache];
  }
  return target;
};

function countSymbols(path: PathSegments | Symbols): number[] {
  let symbols = (path as Symbols)[$symbols];
  if (typeof symbols === 'undefined') {
    symbols = [];
    const certainlyPath = path as PathSegments;
    let i = -1;
    const len = certainlyPath.length;
    while (++i < len) {
      if (typeof certainlyPath[i] === 'symbol') {
        symbols.push(i);
      }
    }
    (path as Symbols)[$symbols] = symbols;
  }
  return symbols;
}

function resolveGetterOrCompile(
  ptr: JsonPointer,
  target: unknown,
  getter?: Dereference,
): Dereference {
  const { pointer, path } = ptr;
  const symbols = countSymbols(path);
  const cache = (target as Caching)[$cache];
  if (cache) {
    // the object has a pointer cache.
    let records = cache.get(pointer);
    if (!records) {
      // the object has not seen this pointer
      getter = getter || compilePointerDereference(path);
      records = [[symbols, path, getter]];
      cache.set(pointer, records);
      return getter;
    }
    // There should only be a few, because it requires symbols at the same path
    // segment, with the same name, but different symbol scope. Possible but
    // unlikely.
    for (const [s, p, g] of records) {
      if (s.length == symbols.length) {
        // somewhat unroll the loops
        switch (s.length) {
          case 0:
            return g;
          case 1:
            if (s[0] === symbols[0] && p[s[0]] === path[symbols[0]]) return g;
            break;
          case 2:
            if (
              s[0] === symbols[0] &&
              p[s[0]] === path[symbols[0]] &&
              s[1] === symbols[1] &&
              p[s[1]] === path[symbols[1]]
            )
              return g;
            break;
          case 3:
            if (
              s[0] === symbols[0] &&
              p[s[0]] === path[symbols[0]] &&
              s[1] === symbols[1] &&
              p[s[1]] === path[symbols[1]] &&
              s[2] === symbols[2] &&
              p[s[2]] === path[symbols[2]]
            )
              return g;
            break;
          default:
            // ok, more than 3, so loop
            if (
              s[0] === symbols[0] &&
              p[s[0]] === path[symbols[0]] &&
              s[1] === symbols[1] &&
              p[s[1]] === path[symbols[1]] &&
              s[2] === symbols[2] &&
              p[s[2]] === path[symbols[2]] &&
              s[3] === symbols[3] &&
              p[s[3]] === path[symbols[3]]
            ) {
              // loop over the remainder...
              let seemsEqual = true;
              let j = 3;
              const len = s.length;
              while (seemsEqual && ++j < len) {
                seemsEqual =
                  s[j] === symbols[j] && p[s[j]] === path[symbols[j]];
              }
              if (seemsEqual) return g;
            }
            break;
        }
      }
    }
    // We get here if there isn't a match in the cache.
    getter = getter || compilePointerDereference(path);
    records.push([symbols, path, getter]);
    return getter;
  }
  return getter || compilePointerDereference(path);
}

/**
 * Tuple representing a pointer:value pair.
 */
export type PointerPair = [JsonPointer, unknown];
export type PointerLike = Pointer | PathSegments | JsonPointer;

/**
 * Represents a JSON Pointer, capable of getting and setting the value on target
 * objects at the pointer's location.
 *
 * While there are static variants for most operations, our recommendation is
 * to use the instance level methods, which enables you avoid repeated
 * compiling/emitting transient accessors. Take a look at the speed comparisons
 * for our justification.
 *
 * In most cases, you should create and reuse instances of JsonPointer within
 * scope that makes sense for your app. We often create constants for frequently
 * used pointers, but your use case may vary.
 *
 * The following is a contrived example showing a function that uses pointers to
 * deal with changes in the structure of data (a version independent function):
 *
 * ```ts
 * import { JsonPointer } from 'json-ptr';
 *
 * export type SupportedVersion = '1.0' | '1.1';
 *
 * interface PrimaryGuestNamePointers {
 *   name: JsonPointer;
 *   surname: JsonPointer;
 *   honorific: JsonPointer;
 * }
 * const versions: Record<SupportedVersion, PrimaryGuestNamePointers> = {
 *   '1.0': {
 *     name: JsonPointer.create('/guests/0/name'),
 *     surname: JsonPointer.create('/guests/0/surname'),
 *     honorific: JsonPointer.create('/guests/0/honorific'),
 *   },
 *   '1.1': {
 *     name: JsonPointer.create('/primary/primaryGuest/name'),
 *     surname: JsonPointer.create('/primary/primaryGuest/surname'),
 *     honorific: JsonPointer.create('/primary/primaryGuest/honorific'),
 *   }
 * };
 *
 * interface Reservation extends Record<string, unknown> {
 *   version?: SupportedVersion;
 * }
 *
 * function primaryGuestName(reservation: Reservation): string {
 *   const pointers = versions[reservation.version || '1.0'];
 *   const name = pointers.name.get(reservation) as string;
 *   const surname = pointers.surname.get(reservation) as string;
 *   const honorific = pointers.honorific.get(reservation) as string;
 *   const names: string[] = [];
 *   if (honorific) names.push(honorific);
 *   if (name) names.push(name);
 *   if (surname) names.push(surname);
 *   return names.join(' ');
 * }
 *
 * // The original layout of a reservation (only the parts relevant to our example)
 * const reservationV1: Reservation = {
 *   guests: [{
 *     name: 'Wilbur',
 *     surname: 'Finkle',
 *     honorific: 'Mr.'
 *   }, {
 *     name: 'Wanda',
 *     surname: 'Finkle',
 *     honorific: 'Mrs.'
 *   }, {
 *     name: 'Wilma',
 *     surname: 'Finkle',
 *     honorific: 'Miss',
 *     child: true,
 *     age: 12
 *   }]
 *   // ...
 * };
 *
 * // The new layout of a reservation (only the parts relevant to our example)
 * const reservationV1_1: Reservation = {
 *   version: '1.1',
 *   primary: {
 *     primaryGuest: {
 *       name: 'Wilbur',
 *       surname: 'Finkle',
 *       honorific: 'Mr.'
 *     },
 *     additionalGuests: [{
 *       name: 'Wanda',
 *       surname: 'Finkle',
 *       honorific: 'Mrs.'
 *     }, {
 *       name: 'Wilma',
 *       surname: 'Finkle',
 *       honorific: 'Miss',
 *       child: true,
 *       age: 12
 *     }]
 *     // ...
 *   }
 *   // ...
 * };
 *
 * console.log(primaryGuestName(reservationV1));
 * console.log(primaryGuestName(reservationV1_1));
 *
 * ```
 *
 * There are many uses for pointers.
 */
export class JsonPointer {
  /** @hidden */
  private [$get]: Dereference;
  /** @hidden */
  private [$frg]: JsonStringPointer;

  /**
   * This pointer's JSON Pointer encoded string representation.
   */
  readonly pointer: JsonStringPointer;

  /**
   * Factory function that creates a JsonPointer instance.
   *
   * ```ts
   * const ptr = JsonPointer.create('/deeply/nested/data/0/here');
   * ```
   * _or_
   * ```ts
   * const ptr = JsonPointer.create(['deeply', 'nested', 'data', 0, 'here']);
   * ```
   * @param pointer the pointer or path.
   */
  static create(pointer: Pointer | PathSegments): JsonPointer {
    return new JsonPointer(pointer);
  }

  /**
   * Determines if the specified `target`'s object graph has a value at the `pointer`'s location.
   *
   * ```ts
   * const target = {
   *   first: 'second',
   *   third: ['fourth', 'fifth', { sixth: 'seventh' }],
   *   eighth: 'ninth'
   * };
   *
   * console.log(JsonPointer.has(target, '/third/0'));
   * // true
   * console.log(JsonPointer.has(target, '/tenth'));
   * // false
   * ```
   *
   * @param target the target of the operation
   * @param pointer the pointer or path
   */
  static has(target: unknown, pointer: PointerLike): boolean {
    if (typeof pointer === 'string' || Array.isArray(pointer)) {
      pointer = new JsonPointer(pointer);
    }
    return (pointer as JsonPointer).has(target);
  }

  /**
   * Gets the `target` object's value at the `pointer`'s location.
   *
   * ```ts
   * const target = {
   *   first: 'second',
   *   third: ['fourth', 'fifth', { sixth: 'seventh' }],
   *   eighth: 'ninth'
   * };
   *
   * console.log(JsonPointer.get(target, '/third/2/sixth'));
   * // seventh
   * console.log(JsonPointer.get(target, '/tenth'));
   * // undefined
   * ```
   *
   * @param target the target of the operation
   * @param pointer the pointer or path.
   */
  static get(target: unknown, pointer: PointerLike): unknown {
    if (typeof pointer === 'string' || Array.isArray(pointer)) {
      pointer = new JsonPointer(pointer);
    }
    return (pointer as JsonPointer).get(target);
  }

  /**
   * Sets the `target` object's value, as specified, at the `pointer`'s location.
   *
   * ```ts
   * const target = {
   *   first: 'second',
   *   third: ['fourth', 'fifth', { sixth: 'seventh' }],
   *   eighth: 'ninth'
   * };
   *
   * console.log(JsonPointer.set(target, '/third/2/sixth', 'tenth'));
   * // seventh
   * console.log(JsonPointer.set(target, '/tenth', 'eleventh', true));
   * // undefined
   * console.log(JSON.stringify(target, null, ' '));
   * // {
   * // "first": "second",
   * // "third": [
   * //  "fourth",
   * //  "fifth",
   * //  {
   * //   "sixth": "tenth"
   * //  }
   * // ],
   * // "eighth": "ninth",
   * // "tenth": "eleventh"
   * // }
   * ```
   *
   * @param target the target of the operation
   * @param pointer the pointer or path
   * @param val a value to write into the object graph at the specified pointer location
   * @param force indications whether the operation should force the pointer's location into existence in the object graph.
   *
   * @returns the prior value at the pointer's location in the object graph.
   */
  static set(
    target: unknown,
    pointer: PointerLike,
    val: unknown,
    force = false,
  ): unknown {
    if (typeof pointer === 'string' || Array.isArray(pointer)) {
      pointer = new JsonPointer(pointer);
    }
    return (pointer as JsonPointer).set(target, val, force);
  }

  /**
   * Removes the `target` object's value at the `pointer`'s location.
   *
   * ```ts
   * const target = {
   *   first: 'second',
   *   third: ['fourth', 'fifth', { sixth: 'seventh' }],
   *   eighth: 'ninth'
   * };
   *
   * console.log(JsonPointer.unset(target, '/third/2/sixth'));
   * // seventh
   * console.log(JsonPointer.unset(target, '/tenth'));
   * // undefined
   * console.log(JSON.stringify(target, null, ' '));
   * // {
   * // "first": "second",
   * // "third": [
   * //  "fourth",
   * //  "fifth",
   * //  {}
   * // ],
   * // "eighth": "ninth",
   * // }
   * ```
   * @param target the target of the operation
   * @param pointer the pointer or path
   *
   * @returns the value that was removed from the object graph.
   */
  static unset(target: unknown, pointer: PointerLike): unknown {
    if (typeof pointer === 'string' || Array.isArray(pointer)) {
      pointer = new JsonPointer(pointer);
    }
    return (pointer as JsonPointer).unset(target);
  }

  /**
   * Decodes the specified pointer into path segments.
   * @param pointer a string representation of a JSON Pointer
   */
  static decode(pointer: Pointer): PathSegments {
    return pickDecoder(pointer)(pointer);
  }

  /**
   * Evaluates the target's object graph, calling the specified visitor for every unique pointer location discovered while walking the graph.
   * @param target the target of the operation
   * @param visitor a callback function invoked for each unique pointer location in the object graph
   * @param includeSymbols indicates whether the results should include paths across symbols (these don't round-trip to legitimate JSON Pointers)
   */
  static visit(
    target: unknown,
    visitor: Visitor,
    includeSymbols = false,
  ): void {
    descendingVisit(target, visitor, includeSymbols);
  }

  /**
   * Evaluates the target's object graph, returning a [[PointerPair]] for each location in the graph.
   * @param target the target of the operation
   * @param includeSymbols indicates whether the results should include paths across symbols (these don't round-trip to legitimate JSON Pointers)
   */
  static listPairs(target: unknown, includeSymbols = false): PointerPair[] {
    const res: PointerPair[] = [];
    descendingVisit(
      target,
      (pointer, value): void => {
        res.push([pointer, value]);
      },
      includeSymbols,
    );
    return res;
  }

  /**
   * Evaluates the target's object graph, returning a [[JsonStringPointerListItem]] for each location in the graph.
   * @param target the target of the operation
   * @param includeSymbols indicates whether the results should include paths across symbols (these don't round-trip to legitimate JSON Pointers)
   */
  static listPointers(
    target: unknown,
    includeSymbols = false,
  ): JsonStringPointerListItem[] {
    const res: JsonStringPointerListItem[] = [];
    descendingVisit(
      target,
      (pointer, value): void => {
        res.push({ pointer: pointer.pointer, value });
      },
      includeSymbols,
    );
    return res;
  }

  /**
   * Evaluates the target's object graph, returning a [[JsonStringPointerListItem]] for each location in the graph.
   * @param target the target of the operation
   * @param includeSymbols indicates whether the results should include paths across symbols (these don't round-trip to legitimate JSON Pointers)
   */
  static listFragmentIds(
    target: unknown,
    includeSymbols = false,
  ): UriFragmentIdentifierPointerListItem[] {
    const res: UriFragmentIdentifierPointerListItem[] = [];
    descendingVisit(
      target,
      (pointer, value): void => {
        res.push({ fragmentId: pointer.uriFragmentIdentifier, value });
      },
      includeSymbols,
    );
    return res;
  }

  /**
   * Evaluates the target's object graph, returning a Record&lt;Pointer, unknown> populated with pointers and the corresponding values from the graph.
   * @param target the target of the operation
   * @param includeSymbols indicates whether the results should include paths across symbols (these don't round-trip to legitimate JSON Pointers)
   */
  static flatten(
    target: unknown,
    includeSymbols = false,
  ): Record<Pointer, unknown> {
    const res: Record<Pointer, unknown> = {};
    descendingVisit(
      target,
      (pointer, value) => {
        res[pointer.pointer] = value;
      },
      includeSymbols,
    );
    return res;
  }

  static pointersWithSymbol(target: unknown, sym: symbol): JsonPointer[] {
    const res: JsonPointer[] = [];
    descendingVisit(
      target,
      (pointer) => {
        if (~pointer.path.indexOf(sym)) {
          res.push(pointer);
        }
      },
      true,
    );
    return res;
  }

  /**
   * Evaluates the target's object graph, returning a Map&lt;Pointer,unknown>  populated with pointers and the corresponding values form the graph.
   * @param target the target of the operation
   * @param fragmentId indicates whether the results are populated with fragment identifiers rather than regular pointers
   * @param includeSymbols indicates whether the results should include paths across symbols (these don't round-trip to legitimate JSON Pointers)
   */
  static map(
    target: unknown,
    fragmentId = false,
    includeSymbols = false,
  ): Map<string, unknown> {
    const res = new Map<Pointer, unknown>();
    const encoder = fragmentId ? encodeUriFragmentIdentifier : encodePointer;
    descendingVisit(
      target,
      (p, v) => {
        res.set(encoder(p.path), v);
      },
      includeSymbols,
    );
    return res;
  }

  /**
   * The pointer's decoded path segments.
   */
  public readonly path: PathSegments;

  /**
   * Creates a new instance.
   *
   * If [[ptr]] is another [[JsonPointer]] then consider this a copy constructor.
   * @param ptr a string representation of a JSON Pointer, a decoded array of path segments, or another JsonPointer.
   */
  constructor(ptr: PointerLike) {
    if (ptr instanceof JsonPointer) {
      // copy construct...
      this.path = ptr.path;
      this.pointer = ptr.pointer;
      this[$get] = ptr[$get];
      return;
    }
    const path = (this.path = decodePtrInit(ptr));
    this.pointer = encodePointer(path);
  }

  /**
   * Gets the target object's value at the pointer's location.
   * @param target the target of the operation
   */
  get(target: unknown): unknown {
    if (!this[$get]) {
      this[$get] = resolveGetterOrCompile(this, target);
    }
    return this[$get](this.path, target);
  }

  /**
   * Sets the target object's value, as specified, at the pointer's location.
   *
   * If any part of the pointer's path does not exist, the operation aborts
   * without modification, unless the caller indicates that pointer's location
   * should be created.
   *
   * @param target the target of the operation
   * @param value the value to set
   * @param force indicates whether the pointer's location should be created if it doesn't already exist.
   */
  set(target: unknown, value: unknown, force = false): unknown {
    return setValueAtPath(target, value, this.path, force);
  }

  /**
   * Removes the target object's value at the pointer's location.
   * @param target the target of the operation
   *
   * @returns the value that was removed from the object graph.
   */
  unset(target: unknown): unknown {
    return unsetValueAtPath(target, this.path);
  }

  /**
   * Determines if the specified target's object graph has a value at the pointer's location.
   * @param target the target of the operation
   */
  has(target: unknown): boolean {
    return typeof this.get(target) !== 'undefined';
  }

  /**
   * Gets the value in the object graph that is the parent of the pointer location.
   * @param target the target of the operation
   */
  parent(target: unknown): unknown {
    const p = this.path;
    if (p.length == 1) return undefined;
    const parent = new JsonPointer(p.slice(0, p.length - 1));
    return parent.get(target);
  }

  /**
   * Creates a new JsonPointer instance, pointing to the specified relative location in the object graph.
   * @param ptr the relative pointer (relative to this)
   * @returns A new instance that points to the relative location.
   */
  relative(ptr: RelativeJsonPointer): JsonPointer {
    const p = this.path;
    const decoded = decodeRelativePointer(ptr) as string[];
    const n = parseInt(decoded[0]);
    if (n > p.length) throw new Error('Relative location does not exist.');
    const r = p.slice(0, p.length - n).concat(decoded.slice(1));
    if (decoded[0][decoded[0].length - 1] == '#') {
      // It references the path segment/name, not the value
      const name = r[r.length - 1] as string;
      throw new Error(
        `We won't compile a pointer that will always return '${name}'. Use JsonPointer.rel(target, ptr) instead.`,
      );
    }
    return new JsonPointer(r);
  }

  /**
   * Resolves the specified relative pointer path against the specified target object, and gets the target object's value at the relative pointer's location.
   * @param target the target of the operation
   * @param ptr the relative pointer (relative to this)
   * @returns the value at the relative pointer's resolved path; otherwise undefined.
   */
  rel(target: unknown, ptr: RelativeJsonPointer): unknown {
    const p = this.path;
    const decoded = decodeRelativePointer(ptr) as string[];
    const n = parseInt(decoded[0]);
    if (n > p.length) {
      // out of bounds
      return undefined;
    }
    const r = p.slice(0, p.length - n).concat(decoded.slice(1));
    const other = new JsonPointer(r);
    if (decoded[0][decoded[0].length - 1] == '#') {
      // It references the path segment/name, not the value
      const name = r[r.length - 1] as string;
      const parent = other.parent(target);
      return Array.isArray(parent) ? parseInt(name, 10) : name;
    }
    return other.get(target);
  }

  /**
   * Creates a new instance by concatenating the specified pointer's path onto this pointer's path.
   * @param ptr the string representation of a pointer, it's decoded path, or an instance of JsonPointer indicating the additional path to concatenate onto the pointer.
   */
  concat(ptr: PointerLike): JsonPointer {
    return new JsonPointer(
      this.path.concat(
        ptr instanceof JsonPointer ? ptr.path : decodePtrInit(ptr),
      ),
    );
  }

  /**
   * This pointer's URI fragment identifier encoded string representation.
   */
  get uriFragmentIdentifier(): UriFragmentIdentifierPointer {
    if (!this[$frg]) {
      this[$frg] = encodeUriFragmentIdentifier(this.path);
    }
    return this[$frg];
  }

  /**
   * Emits the JSON Pointer encoded string representation.
   */
  toString(): string {
    return this.pointer;
  }
}

/**
 * Re-export of [[JsonPointer.create]] to support classic API
 */
export const create = JsonPointer.create;
/**
 * Re-export of [[JsonPointer.get]] to support classic API
 */
export const get = JsonPointer.get;
/**
 * Re-export of [[JsonPointer.set]] to support classic API
 */
export const set = JsonPointer.set;
/**
 * Re-export of [[JsonPointer.unset]] to support classic API
 */
export const unset = JsonPointer.unset;
/**
 * Re-export of [[JsonPointer.decode]] to support classic API
 */
export const decode = JsonPointer.decode;
/**
 * Re-export of [[JsonPointer.visit]] to support classic API
 */
export const visit = JsonPointer.visit;
/**
 * Re-export of [[JsonPointer.listPointers]] to support classic API
 */
export const listPointers = JsonPointer.listPointers;
/**
 * Re-export of [[JsonPointer.listFragmentIds]] to support classic API
 */
export const listFragmentIds = JsonPointer.listFragmentIds;
/**
 * Re-export of [[JsonPointer.flatten]] to support classic API
 */
export const flatten = JsonPointer.flatten;
/**
 * Re-export of [[JsonPointer.map]] to support classic API
 */
export const map = JsonPointer.map;

/** @hidden */
const $pointer = Symbol('pointer');

/**
 * A reference to a location in an object graph.
 *
 * This type is used by this module to break cycles in an object graph and to
 * reference locations that have already been visited when enumerating pointers.
 */
export class JsonReference {
  /**
   * Determines if the specified `candidate` is a JsonReference.
   * @param candidate the candidate
   */
  static isReference(candidate: unknown): candidate is JsonReference {
    if (!candidate) return false;
    const ref = candidate as unknown as JsonReference;
    return typeof ref.$ref === 'string' && typeof ref.resolve === 'function';
  }

  /** @hidden */
  private readonly [$pointer]: JsonPointer;

  /**
   * A reference to a position if an object graph.
   */
  public readonly $ref: UriFragmentIdentifierPointer;

  /**
   * Creates a new instance.
   * @param pointer a JSON Pointer for the reference.
   */
  constructor(pointer: PointerLike) {
    this[$pointer] =
      pointer instanceof JsonPointer ? pointer : new JsonPointer(pointer);
    this.$ref = this[$pointer].uriFragmentIdentifier;
  }

  /**
   * Resolves the reference against the `target` object, returning the value at
   * the referenced pointer's location.
   * @param target the target object
   */
  resolve(target: unknown): unknown {
    return this[$pointer].get(target);
  }

  /**
   * Gets the reference's pointer.
   */
  pointer(): JsonPointer {
    return this[$pointer];
  }

  /**
   * Gets the reference pointer's string representation (a URI fragment identifier).
   */
  toString(): string {
    return this.$ref;
  }
}
