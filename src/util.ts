import { JsonStringPointer, UriFragmentIdentifierPointer, Pointer, PathSegment, PathSegments, Decoder } from './types';

export function replace(source: string, find: string, repl: string): string {
  let res = '';
  let rem = source;
  let beg = 0;
  let end = -1;
  while ((end = rem.indexOf(find)) > -1) {
    res += source.substring(beg, beg + end) + repl;
    rem = rem.substring(end + find.length, rem.length);
    beg += end + find.length;
  }
  if (rem.length > 0) {
    res += source.substring(source.length - rem.length, source.length);
  }
  return res;
}

export function decodeFragmentSegments(segments: PathSegments): PathSegments {
  let i = -1;
  const len = segments.length;
  const res = new Array(len);
  while (++i < len) {
    res[i] = replace(replace(decodeURIComponent('' + segments[i]), '~1', '/'), '~0', '~');
  }
  return res;
}

export function encodeFragmentSegments(segments: PathSegments): PathSegments {
  let i = -1;
  const len = segments.length;
  const res = new Array(len);
  while (++i < len) {
    if (typeof segments[i] === 'string') {
      res[i] = encodeURIComponent(replace(replace(segments[i], '~', '~0'), '/', '~1'));
    } else {
      res[i] = segments[i];
    }
  }
  return res;
}

export function decodePointerSegments(segments: PathSegments): PathSegments {
  let i = -1;
  const len = segments.length;
  const res = new Array(len);
  while (++i < len) {
    res[i] = replace(replace(segments[i], '~1', '/'), '~0', '~');
  }
  return res;
}

export function encodePointerSegments(segments: PathSegments): PathSegments {
  let i = -1;
  const len = segments.length;
  const res = new Array(len);
  while (++i < len) {
    if (typeof segments[i] === 'string') {
      res[i] = replace(replace(segments[i], '~', '~0'), '/', '~1');
    } else {
      res[i] = segments[i];
    }
  }
  return res;
}

export function decodePointer(ptr: Pointer): PathSegments {
  if (typeof ptr !== 'string') {
    throw new TypeError('Invalid type: JSON Pointers are represented as strings.');
  }
  if (ptr.length === 0) {
    return [];
  }
  if (ptr[0] !== '/') {
    throw new ReferenceError('Invalid JSON Pointer syntax. Non-empty pointer must begin with a solidus `/`.');
  }
  return decodePointerSegments(ptr.substring(1).split('/'));
}

export function encodePointer(path: PathSegments): JsonStringPointer {
  if (path && !Array.isArray(path)) {
    throw new TypeError('Invalid type: path must be an array of segments.');
  }
  if (path.length === 0) {
    return '';
  }
  return '/'.concat(encodePointerSegments(path).join('/'));
}

export function decodeUriFragmentIdentifier(ptr: UriFragmentIdentifierPointer): PathSegments {
  if (typeof ptr !== 'string') {
    throw new TypeError('Invalid type: JSON Pointers are represented as strings.');
  }
  if (ptr.length === 0 || ptr[0] !== '#') {
    throw new ReferenceError('Invalid JSON Pointer syntax; URI fragment identifiers must begin with a hash.');
  }
  if (ptr.length === 1) {
    return [];
  }
  if (ptr[1] !== '/') {
    throw new ReferenceError('Invalid JSON Pointer syntax.');
  }
  return decodeFragmentSegments(ptr.substring(2).split('/'));
}

export function encodeUriFragmentIdentifier(path: PathSegments): UriFragmentIdentifierPointer {
  if (path && !Array.isArray(path)) {
    throw new TypeError('Invalid type: path must be an array of segments.');
  }
  if (path.length === 0) {
    return '#';
  }
  return '#/'.concat(encodeFragmentSegments(path).join('/'));
}

export function toArrayIndexReference(arr: readonly unknown[], idx: string): number {
  const len = idx.length;
  let cursor = 0;
  if (len === 1 && idx[0] === '-') {
    if (!Array.isArray(arr)) {
      return 0;
    }
    return arr.length;
  }
  if (len === 0 || (len > 1 && idx[0] === '0') || !isFinite(Number(idx))) {
    return -1;
  }
  while (++cursor < len) {
    if (idx[cursor] < '0' || idx[cursor] > '9') {
      return -1;
    }
  }
  return parseInt(idx, 10);
}

export function hasValueAtPath(target: unknown, path: PathSegments): boolean {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let it: any;
  let len: number;
  let cursor: number;
  let step: PathSegment;
  let p: number;
  if (typeof target !== 'undefined') {
    it = target;
    len = path.length;
    cursor = -1;
    if (len) {
      while (++cursor < len && it) {
        step = path[cursor];
        if (Array.isArray(it)) {
          const n = Number(step);
          if (isNaN(n) || !isFinite(n)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            it = (it as any)[step];
            continue;
          }
          p = toArrayIndexReference(it, step);
          if (it.length > p) {
            it = it[p];
          } else {
            break;
          }
        } else {
          it = it[step];
        }
      }
    }
    return cursor === len && typeof it !== 'undefined';
  }
  return false;
}

export function getValueAtPath(target: unknown, path: PathSegments): unknown {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let it: any;
  let len: number;
  let cursor: number;
  let step: PathSegment;
  let p;
  if (typeof target !== 'undefined') {
    it = target;
    len = path.length;
    cursor = -1;
    if (len) {
      while (++cursor < len && it) {
        step = path[cursor];
        if (Array.isArray(it)) {
          const n = Number(step);
          if (isNaN(n) || !isFinite(n)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            it = (it as any)[step];
            continue;
          }
          p = toArrayIndexReference(it, step);
          if (it.length > p) {
            it = it[p];
          } else {
            return undefined;
          }
        } else {
          it = it[step];
        }
      }
    }
    return it;
  }
  return undefined;
}

export type Dereference = (it: unknown) => unknown;

export function compilePointerDereference(path: PathSegments): Dereference {
  let body = "if (typeof(it) !== 'undefined'";
  if (path.length === 0) {
    return (it): unknown => it;
  }
  body = path.reduce((body, _, i) => {
    return body + " && \n\ttypeof((it = it['" + replace(path[i], '\\', '\\\\') + "'])) !== 'undefined'";
  }, "if (typeof(it) !== 'undefined'");
  body = body + ') {\n\treturn it;\n }';
  // eslint-disable-next-line no-new-func
  return new Function('it', body) as Dereference;
}

export function setValueAtPath(target: unknown, val: unknown, path: PathSegments, force: boolean): unknown {
  if (path.length === 0) {
    throw new Error('Cannot set the root object; assign it directly.');
  }
  if (typeof target === 'undefined') {
    throw new TypeError('Cannot set values on undefined');
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let it: any = target;
  const len = path.length;
  const end = path.length - 1;
  let step: string;
  let cursor = -1;
  let rem: unknown;
  let p: number;
  if (len) {
    while (++cursor < len) {
      step = path[cursor];
      if (Array.isArray(it)) {
        p = toArrayIndexReference(it, step);
        if (it.length > p) {
          if (cursor === end) {
            rem = it[p];
            it[p] = val;
            return rem;
          }
          it = it[p];
        } else if (it.length === p) {
          if (cursor === end) {
            it.push(val);
            return undefined;
          } else if (force) {
            it = it[p] = {};
          }
        }
      } else {
        if (typeof it[step] === 'undefined') {
          if (force) {
            if (cursor === end) {
              it[step] = val;
              return undefined;
            }
            // if the next step is an array index, this step should be an array.
            if (toArrayIndexReference(it[step], path[cursor + 1]) !== -1) {
              it = it[step] = [];
              continue;
            }
            it = it[step] = {};
            continue;
          }
          return undefined;
        }
        if (cursor === end) {
          rem = it[step];
          it[step] = val;
          return rem;
        }
        it = it[step];
      }
    }
  }
  return it;
}

export function looksLikeFragment(ptr: string): boolean {
  return ptr && ptr.length && ptr[0] === '#';
}

export function pickDecoder(ptr: Pointer): Decoder {
  return looksLikeFragment(ptr) ? decodeUriFragmentIdentifier : decodePointer;
}

export function decodePtrInit(ptr: Pointer | PathSegments): PathSegments {
  return Array.isArray(ptr) ? ptr.slice(0) : pickDecoder(ptr as Pointer)(ptr as Pointer);
}
