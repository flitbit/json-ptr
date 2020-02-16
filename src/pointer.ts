import {
  Dereference,
  decodePtrInit,
  compilePointerDereference,
  setValueAtPath,
  encodePointer,
  encodeUriFragmentIdentifier,
  pickDecoder,
  Encoder,
  hasValueAtPath,
  getValueAtPath,
} from './util';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Visitor = (ptr: string, val: any) => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let visit: (target: any, visitor: Visitor, encoder: Encoder, cycle?: boolean) => void = null;

const $ptr = Symbol('pointer');
const $frg = Symbol('fragmentId');
const $get = Symbol('getter');

export interface Dict {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface PointerItem {
  pointer?: string;
  fragmentId?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
}

export class JsonPointer {
  private [$ptr]: string;
  private [$frg]: string;
  private [$get]: Dereference;

  static has<T>(target: T, ptr: string): boolean {
    return hasValueAtPath(target, pickDecoder(ptr)(ptr));
  }

  static get<T, R>(target: T, ptr: string): R {
    return getValueAtPath(target, pickDecoder(ptr)(ptr));
  }

  static set<T, V, R>(target: T, ptr: string, val: V, force?: boolean): R {
    return setValueAtPath(target, val, pickDecoder(ptr)(ptr), force);
  }

  static decode(ptr: string): string[] {
    return pickDecoder(ptr)(ptr);
  }

  static list<T>(target: T, fragmentId?: boolean): PointerItem[] {
    const res: PointerItem[] = [];
    visit(
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

  static flatten<T>(target: T, fragmentId?: boolean): Dict {
    const res: Dict = {};
    visit(
      target,
      (p, v) => {
        res[p] = v;
      },
      fragmentId ? encodeUriFragmentIdentifier : encodePointer
    );
    return res;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static map<T>(target: T, fragmentId?: boolean): Map<string, any> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = new Map<string, any>();
    visit(target, res.set.bind(res), fragmentId ? encodeUriFragmentIdentifier : encodePointer);
    return res;
  }

  public path: string[];

  constructor(ptr: string | string[]) {
    this.path = decodePtrInit(ptr);
  }

  get<T, V>(target: T): V {
    if (!this[$get]) {
      this[$get] = compilePointerDereference(this.path);
    }
    return this[$get](target);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set<T, V>(target: T, value: V, force?: boolean): any {
    return setValueAtPath(target, value, this.path, force);
  }

  has<T>(target: T): boolean {
    return typeof this.get(target) !== 'undefined';
  }

  concat(target: JsonPointer | string | string[]): JsonPointer {
    return new JsonPointer(this.path.concat(target instanceof JsonPointer ? target.path : decodePtrInit(target)));
  }

  get pointer(): string {
    if (!this[$ptr]) {
      this[$ptr] = encodePointer(this.path);
    }
    return this[$ptr];
  }

  get uriFragmentIdentifier(): string {
    if (!this[$frg]) {
      this[$frg] = encodeUriFragmentIdentifier(this.path);
    }
    return this[$frg];
  }
}

JsonPointer.prototype.toString = function toString(): string {
  return this.pointer;
};

export function create(ptr: string | string[]): JsonPointer {
  return new JsonPointer(ptr);
}

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
visit = (target: any, visitor: Visitor, encoder: Encoder, cycle: boolean): void => {
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
