import {
  Dereference,
  decodePtrInit,
  compilePointerDereference,
  setValueAtPath,
  encodePointer,
  encodeUriFragmentIdentifier,
  pickDecoder,
  Encoder,
} from './util';

/**
 * Signature of visitor functions, used with [[JsonPointer.visit]] method. Visitors are callbacks invoked for every segment/branch of a target's object graph.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Visitor = (ptr: string, val: any) => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let descendingVisit: (target: any, visitor: Visitor, encoder: Encoder, cycle?: boolean) => void = null;

const $ptr = Symbol('pointer');
const $frg = Symbol('fragmentId');
const $get = Symbol('getter');

/**
 * A simple dictionary interface used while calculating pointers present in an object graph.
 */
export interface Dict {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [ptr: string]: any;
}

/**
 * A simple interface used to list pointers and their values in an object graph.
 */
export interface PointerPair {
  /**
   * Contains the location of the value in the evaluated object graph. Present unless `fragmentId` is requested during the operation.
   */
  pointer?: string;
  /**
   * Contains the location (as a fragmentId) of the value in the evaluated object graph. Present if `fragmentId` is requested during the operation.
   */
  fragmentId?: string;
  /**
   * The value at the pointer's location in the object graph.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
}

/**
 * Represents a JSON Pointer, capable of getting and setting values on object graphs at the pointer's dereferenced location.
 *
 * While there are static variants for most operations, our recommendation is to use the instance level methods, which enables you avoid repeated compiling/emitting transient accessors. Take a look at the speed comparisons for our justification.
 *
 * In most cases, create and reuse instances of JsonPointer within a scope that makes sense for your app. We often use a cache of frequently used pointers, but your use case may support constants, static members, or other long-lived scenarios.
 */
export class JsonPointer {
  private [$ptr]: string;
  private [$frg]: string;
  private [$get]: Dereference;

  /**
   * Creates a JsonPointer instance.
   * @param ptr the string representation of a pointer, or it's decoded path.
   */
  static create(ptr: string | string[]): JsonPointer {
    return new JsonPointer(ptr);
  }

  /**
   * Determines if the `target` object has a value at the pointer's location in the object graph.
   * @param target the target of the operation
   * @param ptr the string representation of a pointer, it's decoded path, or an instance of JsonPointer indicating the where in the object graph to make the determination.
   */
  static has<T>(target: T, ptr: string | string[] | JsonPointer): boolean {
    if (typeof ptr === 'string' || Array.isArray(ptr)) {
      ptr = new JsonPointer(ptr);
    }
    return ptr.has(target);
  }
  /**
   * Gets the value at the specified pointer's location in the object graph. If there is no value, then the result is `undefined`.
   * @param target the target of the operation
   * @param ptr the string representation of a pointer, it's decoded path, or an instance of JsonPointer indicating the where in the object graph to get the value.
   */
  static get<T, R>(target: T, ptr: string | string[] | JsonPointer): R {
    if (typeof ptr === 'string' || Array.isArray(ptr)) {
      ptr = new JsonPointer(ptr);
    }
    return ptr.get(target);
  }

  /**
   * Set the value at the specified pointer's location in the object graph.
   * @param target the target of the operation
   * @param ptr the string representation
   * @param val a value to wite into the object graph at the specified pointer location
   * @param force indications whether the operation should force the pointer's location into existence in the object graph.
   */
  static set<T, V, R>(target: T, ptr: string | string[] | JsonPointer, val: V, force?: boolean): R {
    if (typeof ptr === 'string' || Array.isArray(ptr)) {
      ptr = new JsonPointer(ptr);
    }
    return ptr.set(target, val, force);
  }

  /**
   * Decodes the specified pointer into path segments.
   * @param ptr a string representation of a JSON Pointer
   */
  static decode(ptr: string): string[] {
    return pickDecoder(ptr)(ptr);
  }

  /**
   * Evaluates the target's object graph, calling the specified visitor for every unique pointer location discovered while walking the graph.
   * @param target the target of the operation
   * @param visitor a callback function invoked for each unique pointer location in the object graph
   * @param fragmentId indicates whether the visitor should receive fragment identifiers or regular pointers
   */
  static visit<T>(target: T, visitor: Visitor, fragmentId?: boolean): void {
    descendingVisit(target, visitor, fragmentId ? encodeUriFragmentIdentifier : encodePointer);
  }

  /**
   * Evaluates the target's object graph, returning a [[PointerPair]] for each location in the graph.
   * @param target the target of the operation
   * @param fragmentId indicates whether the results are populated with fragment identifiers rather than regular pointers
   */
  static list<T>(target: T, fragmentId?: boolean): PointerPair[] {
    const res: PointerPair[] = [];
    descendingVisit(
      target,
      fragmentId
        ? (fragmentId, value): void => {
            res.push({ fragmentId, value });
          }
        : (pointer, value): void => {
            res.push({ pointer, value });
          },
      fragmentId ? encodeUriFragmentIdentifier : encodePointer
    );
    return res;
  }

  /**
   * Evaluates the target's object graph, returning a [[Dict]] populated with pointers and the corresponding values from the graph.
   * @param target the target of the operation
   * @param fragmentId indicates whether the results are populated with fragment identifiers rather than regular pointers
   */
  static flatten<T>(target: T, fragmentId?: boolean): Dict {
    const res: Dict = {};
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
   * Evaluates the target's object graph, returning a Map&lt;string,any>  populated with pointers and the corresponding values form the graph.
   * @param target the target of the operation
   * @param fragmentId indicates whether the results are populated with fragment identifiers rather than regular pointers
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static map<T>(target: T, fragmentId?: boolean): Map<string, any> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = new Map<string, any>();
    descendingVisit(target, res.set.bind(res), fragmentId ? encodeUriFragmentIdentifier : encodePointer);
    return res;
  }

  /**
   * The pointer's decoded path through the object graph.
   */
  public path: string[];

  /**
   * Creates a new instance.
   * @param ptr a string representation of a JSON Pointer, or a decoded array of path segments.
   */
  constructor(ptr: string | string[]) {
    this.path = decodePtrInit(ptr);
  }

  /**
   * Gets the value the specified target's object graph at this pointer's location.
   * @param target the target of the operation
   */
  get<T, V>(target: T): V {
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set<T, V>(target: T, value: V, force?: boolean): any {
    return setValueAtPath(target, value, this.path, force);
  }

  /**
   * Determines if the specified target's object graph has a value at the pointer's location.
   * @param target the target of the operation
   */
  has<T>(target: T): boolean {
    return typeof this.get(target) !== 'undefined';
  }

  /**
   * Creates a new instance by concatenating the specified pointer's path with this pointer's path.
   * @param ptr the string representation of a pointer, it's decoded path, or an instance of JsonPointer indicating the additional path to concatenate onto the existing pointer.
   */
  concat(ptr: JsonPointer | string | string[]): JsonPointer {
    return new JsonPointer(this.path.concat(ptr instanceof JsonPointer ? ptr.path : decodePtrInit(ptr)));
  }

  /**
   * This pointer's JSON Pointer encoded string representation.
   */
  get pointer(): string {
    if (!this[$ptr]) {
      this[$ptr] = encodePointer(this.path);
    }
    return this[$ptr];
  }

  /**
   * This pointer's URI fragment identifier encoded string representation.
   */
  get uriFragmentIdentifier(): string {
    if (!this[$frg]) {
      this[$frg] = encodeUriFragmentIdentifier(this.path);
    }
    return this[$frg];
  }
}

/**
 * Produces this pointer's JSON Pointer encoded string representation.
 */
JsonPointer.prototype.toString = function toString(): string {
  return this.pointer;
};

export class JsonReference {
  static isReference<T>(candidate: T): boolean {
    if (!candidate) return false;
    const ref = (candidate as unknown) as JsonReference;
    return typeof ref.$ref === 'string' && typeof ref.resolve === 'function';
  }

  public pointer: JsonPointer;
  public $ref: string;

  constructor(ptr: JsonPointer | string | string[]) {
    this.pointer = ptr instanceof JsonPointer ? ptr : new JsonPointer(ptr);
    this.$ref = this.pointer.uriFragmentIdentifier;
  }

  resolve<T, R>(target: T): R {
    return this.pointer.get(target);
  }
}

JsonReference.prototype.toString = function toString(): string {
  return this.$ref;
};

interface Item {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  obj: any;
  path: string[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
descendingVisit = (target: any, visitor: Visitor, encoder: Encoder, cycle: boolean): void => {
  let distinctObjects;
  const q: Item[] = [];
  let cursor2 = 0;
  q.push({
    obj: target,
    path: [],
  });
  if (cycle) {
    distinctObjects = Object.create(null);
  }
  visitor(encoder([]), target);
  while (cursor2 < q.length) {
    const cursor = q[cursor2++];
    const typeT = typeof cursor.obj;
    if (typeT === 'object' && cursor.obj !== null) {
      if (Array.isArray(cursor.obj)) {
        let j = -1;
        const len2 = cursor.obj.length;
        while (++j < len2) {
          const it = cursor.obj[j];
          const path = cursor.path.concat([j + '']);
          if (typeof it === 'object' && it !== null) {
            if (cycle && distinctObjects[it]) {
              visitor(encoder(path), new JsonReference(distinctObjects[it]));
              continue;
            }
            q.push({
              obj: it,
              path: path,
            });
            if (cycle) {
              distinctObjects[it] = new JsonPointer(encodeUriFragmentIdentifier(path));
            }
          }
          visitor(encoder(path), it);
        }
      } else {
        const keys = Object.keys(cursor.obj);
        const len3 = keys.length;
        let i = -1;
        while (++i < len3) {
          const it = cursor.obj[keys[i]];
          const path = cursor.path.concat(keys[i]);
          if (typeof it === 'object' && it !== null) {
            if (cycle && distinctObjects[it]) {
              visitor(encoder(path), new JsonReference(distinctObjects[it]));
              continue;
            }
            q.push({
              obj: it,
              path: path,
            });
            if (cycle) {
              distinctObjects[it] = new JsonPointer(encodeUriFragmentIdentifier(path));
            }
          }
          visitor(encoder(path), it);
        }
      }
    }
  }
};
