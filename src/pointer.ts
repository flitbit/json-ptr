import {
  Dereference,
  decodePtrInit,
  compilePointerDereference,
  setValueAtPath,
  encodePointer,
  encodeUriFragmentIdentifier,
  pickDecoder,
  unsetValueAtPath,
} from './util';
import {
  JsonStringPointer,
  UriFragmentIdentifierPointer,
  Pointer,
  PathSegments,
  Encoder,
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
export type Visitor = (ptr: JsonStringPointer, val: unknown) => void;

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
function descendingVisit(target: unknown, visitor: Visitor, encoder: Encoder): void {
  const distinctObjects = new Map<unknown, JsonPointer>();
  const q: Item[] = [{ obj: target, path: [] }];
  while (q.length) {
    const { obj, path } = q.shift();
    visitor(encoder(path), obj);
    if (shouldDescend(obj)) {
      distinctObjects.set(obj, new JsonPointer(encodeUriFragmentIdentifier(path)));
      if (!Array.isArray(obj)) {
        const keys = Object.keys(obj);
        const len = keys.length;
        let i = -1;
        while (++i < len) {
          const it = (obj as Record<string, unknown>)[keys[i]];
          if (isObject(it) && distinctObjects.has(it)) {
            q.push({
              obj: new JsonReference(distinctObjects.get(it)),
              path: path.concat(keys[i])
            });
          } else {
            q.push({
              obj: it,
              path: path.concat(keys[i])
            });
          }
        }
      } else {
        // handleArray
        let j = -1;
        const len = obj.length;
        while (++j < len) {
          const it = obj[j];
          if (isObject(it) && distinctObjects.has(it)) {
            q.push({
              obj: new JsonReference(distinctObjects.get(it)),
              path: path.concat([j + ''])
            });
          } else {
            q.push({
              obj: it,
              path: path.concat([j + ''])
            });
          }
        }
      }
    }
  }
}

/** @hidden */
const $ptr = Symbol('pointer');
/** @hidden */
const $frg = Symbol('fragmentId');
/** @hidden */
const $get = Symbol('getter');

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
  private [$ptr]: JsonStringPointer;
  /** @hidden */
  private [$frg]: UriFragmentIdentifierPointer;
  /** @hidden */
  private [$get]: Dereference;

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
  static has(target: unknown, pointer: Pointer | PathSegments | JsonPointer): boolean {
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
  static get(target: unknown, pointer: Pointer | PathSegments | JsonPointer): unknown {
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
  static set(target: unknown, pointer: Pointer | PathSegments | JsonPointer, val: unknown, force = false): unknown {
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
  static unset(target: unknown, pointer: Pointer | PathSegments | JsonPointer): unknown {
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
   * @param fragmentId indicates whether the visitor should receive fragment identifiers or regular pointers
   */
  static visit(target: unknown, visitor: Visitor, fragmentId = false): void {
    descendingVisit(target, visitor, fragmentId ? encodeUriFragmentIdentifier : encodePointer);
  }

  /**
   * Evaluates the target's object graph, returning a [[JsonStringPointerListItem]] for each location in the graph.
   * @param target the target of the operation
   */
  static listPointers(target: unknown): JsonStringPointerListItem[] {
    const res: JsonStringPointerListItem[] = [];
    descendingVisit(
      target,
      (pointer, value): void => {
        res.push({ pointer, value });
      },
      encodePointer
    );
    return res;
  }

  /**
   * Evaluates the target's object graph, returning a [[UriFragmentIdentifierPointerListItem]] for each location in the graph.
   * @param target the target of the operation
   */
  static listFragmentIds(target: unknown): UriFragmentIdentifierPointerListItem[] {
    const res: UriFragmentIdentifierPointerListItem[] = [];
    descendingVisit(
      target,
      (fragmentId, value): void => {
        res.push({ fragmentId, value });
      },
      encodeUriFragmentIdentifier
    );
    return res;
  }

  /**
   * Evaluates the target's object graph, returning a Record&lt;Pointer, unknown> populated with pointers and the corresponding values from the graph.
   * @param target the target of the operation
   * @param fragmentId indicates whether the results are populated with fragment identifiers rather than regular pointers
   */
  static flatten(target: unknown, fragmentId = false): Record<Pointer, unknown> {
    const res: Record<Pointer, unknown> = {};
    descendingVisit(
      target,
      (p, v) => {
        res[p] = v;
      },
      fragmentId ? encodeUriFragmentIdentifier : encodePointer
    );
    return res;
  }

  /**
   * Evaluates the target's object graph, returning a Map&lt;Pointer,unknown>  populated with pointers and the corresponding values form the graph.
   * @param target the target of the operation
   * @param fragmentId indicates whether the results are populated with fragment identifiers rather than regular pointers
   */
  static map(target: unknown, fragmentId = false): Map<Pointer, unknown> {
    const res = new Map<Pointer, unknown>();
    descendingVisit(target, res.set.bind(res), fragmentId ? encodeUriFragmentIdentifier : encodePointer);
    return res;
  }

  /**
   * The pointer's decoded path segments.
   */
  public readonly path: PathSegments;

  /**
   * Creates a new instance.
   * @param ptr a string representation of a JSON Pointer, or a decoded array of path segments.
   */
  constructor(ptr: Pointer | PathSegments) {
    this.path = decodePtrInit(ptr);
  }

  /**
   * Gets the target object's value at the pointer's location.
   * @param target the target of the operation
   */
  get(target: unknown): unknown {
    if (!this[$get]) {
      this[$get] = compilePointerDereference(this.path);
    }
    return this[$get](target);
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
   * Creates a new instance by concatenating the specified pointer's path onto this pointer's path.
   * @param ptr the string representation of a pointer, it's decoded path, or an instance of JsonPointer indicating the additional path to concatenate onto the pointer.
   */
  concat(ptr: JsonPointer | Pointer | PathSegments): JsonPointer {
    return new JsonPointer(this.path.concat(ptr instanceof JsonPointer ? ptr.path : decodePtrInit(ptr)));
  }

  /**
   * This pointer's JSON Pointer encoded string representation.
   */
  get pointer(): JsonStringPointer {
    if (this[$ptr] === undefined) {
      this[$ptr] = encodePointer(this.path);
    }
    return this[$ptr];
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
    const ref = (candidate as unknown) as JsonReference;
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
  constructor(pointer: JsonPointer | Pointer | PathSegments) {
    this[$pointer] = pointer instanceof JsonPointer ? pointer : new JsonPointer(pointer);
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
  pointer(): JsonPointer { return this[$pointer]; }

  /**
   * Gets the reference pointer's string representation (a URI fragment identifier).
   */
  toString(): string {
    return this.$ref;
  }
}
