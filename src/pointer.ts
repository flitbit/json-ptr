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

function isObject(value: unknown): boolean {
  return typeof value === 'object' && value !== null;
}

/**
 * Signature of visitor functions, used with [[JsonPointer.visit]] method. Visitors are callbacks invoked for every segment/branch of a target's object graph.
 */
export type Visitor = (ptr: JsonStringPointer, val: unknown) => void;

interface Item {
  obj: unknown;
  path: PathSegments;
}

function shouldDescend(obj: unknown): boolean {
  return isObject(obj) && !JsonReference.isReference(obj);
}

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

const $ptr = Symbol('pointer');
const $frg = Symbol('fragmentId');
const $get = Symbol('getter');

/**
 * Represents a JSON Pointer, capable of getting and setting values on object graphs at the pointer's dereferenced location.
 *
 * While there are static variants for most operations, our recommendation is to use the instance level methods, which enables you avoid repeated compiling/emitting transient accessors. Take a look at the speed comparisons for our justification.
 *
 * In most cases, create and reuse instances of JsonPointer within a scope that makes sense for your app. We often use a cache of frequently used pointers, but your use case may support constants, static members, or other long-lived scenarios.
 */
export class JsonPointer {
  private [$ptr]: JsonStringPointer;
  private [$frg]: UriFragmentIdentifierPointer;
  private [$get]: Dereference;

  /**
   * Creates a JsonPointer instance.
   * @param ptr the pointer or path.
   */
  static create(ptr: Pointer | PathSegments): JsonPointer {
    return new JsonPointer(ptr);
  }

  /**
   * Determines if the `target` object has a value at the pointer's location in the object graph.
   * @param target the target of the operation
   * @param ptr the pointer or path
   */
  static has(target: unknown, ptr: Pointer | PathSegments | JsonPointer): boolean {
    if (typeof ptr === 'string' || Array.isArray(ptr)) {
      ptr = new JsonPointer(ptr);
    }
    return (ptr as JsonPointer).has(target);
  }

  /**
   * Gets the value at the specified pointer's location in the object graph. If there is no value, then the result is `undefined`.
   * @param target the target of the operation
   * @param ptr the pointer or path.
   */
  static get(target: unknown, ptr: Pointer | PathSegments | JsonPointer): unknown {
    if (typeof ptr === 'string' || Array.isArray(ptr)) {
      ptr = new JsonPointer(ptr);
    }
    return (ptr as JsonPointer).get(target);
  }

  /**
   * Set the value at the specified pointer's location in the object graph.
   * @param target the target of the operation
   * @param ptr the pointer or path
   * @param val a value to wite into the object graph at the specified pointer location
   * @param force indications whether the operation should force the pointer's location into existence in the object graph.
   *
   * @returns the prior value at the pointer's location in the object graph.
   */
  static set(target: unknown, ptr: Pointer | PathSegments | JsonPointer, val: unknown, force = false): unknown {
    if (typeof ptr === 'string' || Array.isArray(ptr)) {
      ptr = new JsonPointer(ptr);
    }
    return (ptr as JsonPointer).set(target, val, force);
  }

  /**
   * Removes the value at the specified pointer's location in the object graph.
   * @param target the target of the operation
   * @param ptr the pointer or path
   *
   * @returns the value that was removed from the object graph.
   */
  static unset(target: unknown, ptr: Pointer | PathSegments | JsonPointer): unknown {
    if (typeof ptr === 'string' || Array.isArray(ptr)) {
      ptr = new JsonPointer(ptr);
    }
    return (ptr as JsonPointer).unset(target);
  }

  /**
   * Decodes the specified pointer into path segments.
   * @param ptr a string representation of a JSON Pointer
   */
  static decode(ptr: Pointer): PathSegments {
    return pickDecoder(ptr)(ptr);
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
   * The pointer's decoded path through the object graph.
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
   * Gets the value the specified target's object graph at this pointer's location.
   * @param target the target of the operation
   */
  get(target: unknown): unknown {
    if (!this[$get]) {
      this[$get] = compilePointerDereference(this.path);
    }
    return this[$get](target);
  }

  /**
   * Set's the specified value in the specified target's object graph at this pointer's location.
   *
   * If any part of the pointer's path does not exist, the operation returns unless the caller indicates that pointer's location should be created.
   * @param target the target of the operation
   * @param value the value to set
   * @param force indicates whether the pointer's location should be created if it doesn't already exist.
   */
  set(target: unknown, value: unknown, force = false): unknown {
    return setValueAtPath(target, value, this.path, force);
  }

  /***
   * Removes the value from the target's object graph.
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
   * Creates a new instance by concatenating the specified pointer's path with this pointer's path.
   * @param ptr the string representation of a pointer, it's decoded path, or an instance of JsonPointer indicating the additional path to concatenate onto the existing pointer.
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
   * Produces this pointer's JSON Pointer encoded string representation.
   */
  toString(): string {
    return this.pointer;
  }
}

const $pointer = Symbol('pointer');

export class JsonReference {
  static isReference(candidate: unknown): candidate is JsonReference {
    if (!candidate) return false;
    const ref = (candidate as unknown) as JsonReference;
    return typeof ref.$ref === 'string' && typeof ref.resolve === 'function';
  }

  private readonly [$pointer]: JsonPointer;
  public readonly $ref: UriFragmentIdentifierPointer;

  constructor(ptr: JsonPointer | Pointer | PathSegments) {
    this[$pointer] = ptr instanceof JsonPointer ? ptr : new JsonPointer(ptr);
    this.$ref = this[$pointer].uriFragmentIdentifier;
  }

  resolve(target: unknown): unknown {
    return this[$pointer].get(target);
  }

  pointer(): JsonPointer { return this[$pointer]; }

  toString(): string {
    return this.$ref;
  }
}
