(function (root, factory) {
  if (typeof define === 'function' && define.amd) { // eslint-disable-line no-undef
    define([], factory);// eslint-disable-line no-undef
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.returnExports = factory();
  }
  // eslint-disable-next-line no-undef
}(typeof self !== 'undefined' ? self : this, function () {
  var root = this;
  var $savedJsonPointer = this.JsonPointer;

  function replace(str, find, repl) {
    // modified from http://jsperf.com/javascript-replace-all/10
    var orig = str.toString();
    var res = '';
    var rem = orig;
    var beg = 0;
    var end = -1;
    while ((end = rem.indexOf(find)) > -1) {
      res += orig.substring(beg, beg + end) + repl;
      rem = rem.substring(end + find.length, rem.length);
      beg += end + find.length;
    }
    if (rem.length > 0) {
      res += orig.substring(orig.length - rem.length, orig.length);
    }
    return res;
  }

  function decodeFragmentSegments(segments) {
    var i = -1;
    var len = segments.length;
    var res = new Array(len);
    while (++i < len) {
      res[i] = replace(replace(decodeURIComponent('' + segments[i]), '~1', '/'), '~0', '~');
    }
    return res;
  }

  function encodeFragmentSegments(segments) {
    var i = -1;
    var len = segments.length;
    var res = new Array(len);
    while (++i < len) {
      if (typeof segments[i] === 'string') {
        res[i] = encodeURIComponent(replace(replace(segments[i], '~', '~0'), '/', '~1'));
      } else {
        res[i] = segments[i];
      }
    }
    return res;
  }

  function decodePointerSegments(segments) {
    var i = -1;
    var len = segments.length;
    var res = new Array(len);
    while (++i < len) {
      res[i] = replace(replace(segments[i], '~1', '/'), '~0', '~');
    }
    return res;
  }

  function encodePointerSegments(segments) {
    var i = -1;
    var len = segments.length;
    var res = new Array(len);
    while (++i < len) {
      if (typeof segments[i] === 'string') {
        res[i] = replace(replace(segments[i], '~', '~0'), '/', '~1');
      } else {
        res[i] = segments[i];
      }
    }
    return res;
  }

  function decodePointer(ptr) {
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

  function encodePointer(path) {
    if (path && !Array.isArray(path)) {
      throw new TypeError('Invalid type: path must be an array of segments.');
    }
    if (path.length === 0) {
      return '';
    }
    return '/'.concat(encodePointerSegments(path).join('/'));
  }

  function decodeUriFragmentIdentifier(ptr) {
    if (typeof ptr !== 'string') {
      throw new TypeError('Invalid type: JSON Pointers are represented as strings.');
    }
    if (ptr.length === 0 || ptr[0] !== '#') {
      throw new ReferenceError('Invalid JSON Pointer syntax; URI fragment idetifiers must begin with a hash.');
    }
    if (ptr.length === 1) {
      return [];
    }
    if (ptr[1] !== '/') {
      throw new ReferenceError('Invalid JSON Pointer syntax.');
    }
    return decodeFragmentSegments(ptr.substring(2).split('/'));
  }

  function encodeUriFragmentIdentifier(path) {
    if (path && !Array.isArray(path)) {
      throw new TypeError('Invalid type: path must be an array of segments.');
    }
    if (path.length === 0) {
      return '#';
    }
    return '#/'.concat(encodeFragmentSegments(path).join('/'));
  }

  function toArrayIndexReference(arr, idx) {
    var len = idx.length;
    var cursor = 0;
    if (len === 1 && idx[0] === '-') {
      if (!Array.isArray(arr)) {
        return 0;
      }
      return arr.length;
    }
    if (len === 0 || len > 1 && idx[0] === '0' || !isFinite(idx)) {
      return -1;
    }

    while (++cursor < len) {
      if (idx[cursor] < '0' || idx[cursor] > '9') {
        return -1;
      }
    }
    return parseInt(idx, 10);
  }

  function hasValueAtPath(target, path) {
    var it;
    var len;
    var cursor;
    var step;
    var p;
    if (typeof target !== 'undefined') {
      it = target;
      len = path.length;
      cursor = -1;
      if (len) {
        while (++cursor < len && it) {
          step = path[cursor];
          if (Array.isArray(it)) {
            if (isNaN(step) || !isFinite(step)) {
              it = it[step];
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

  function getValueAtPath(target, path) {
    var it;
    var len;
    var cursor;
    var step;
    var p;
    var nonexistent;
    if (typeof target !== 'undefined') {
      it = target;
      len = path.length;
      cursor = -1;
      if (len) {
        while (++cursor < len && it) {
          step = path[cursor];
          if (Array.isArray(it)) {
            if (isNaN(step) || !isFinite(step)) {
              it = it[step];
              continue;
            }
            p = toArrayIndexReference(it, step);
            if (it.length > p) {
              it = it[p];
            } else {
              return nonexistent;
            }
          } else {
            it = it[step];
          }
        }
      }
      return it;
    }
    return nonexistent;
  }

  function compilePointerDereference(path) {
    var body = 'if (typeof(obj) !== \'undefined\'';
    if (path.length === 0) {
      return function (it) {
        return it;
      };
    }
    // eslint-disable-next-line
    body = path.reduce(function (body, p, i) {
      return body + ' && \n\ttypeof((obj = obj[\'' +
        replace(path[i], '\\', '\\\\') + '\'])) !== \'undefined\'';
    }, 'if (typeof(obj) !== \'undefined\'');
    body = body + ') {\n\treturn obj;\n }';
    // eslint-disable-next-line no-new-func
    return new Function(['obj'], body);
  }

  function setValueAtPath(target, val, path, force) {
    var it;
    var len;
    var end;
    var cursor;
    var step;
    var p;
    var rem;
    var nonexistent;
    if (path.length === 0) {
      throw new Error('Cannot set the root object; assign it directly.');
    }
    if (typeof target === 'undefined') {
      throw new TypeError('Cannot set values on undefined');
    }
    it = target;
    len = path.length;
    end = path.length - 1;
    cursor = -1;
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
              return nonexistent;
            } else if (force) {
              it = it[p] = {};
            }
          }
        } else {
          if (typeof it[step] === 'undefined') {
            if (force) {
              if (cursor === end) {
                it[step] = val;
                return nonexistent;
              }
              // if the next step is an array index, this step should be an array.
              if (toArrayIndexReference(it[step], path[cursor + 1]) !== -1) {
                it = it[step] = [];
                continue;
              }
              it = it[step] = {};
              continue;
            }
            return nonexistent;
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

  function looksLikeFragment(ptr) {
    return ptr && ptr.length && ptr[0] === '#';
  }

  function pickDecoder(ptr) {
    return (looksLikeFragment(ptr)) ? decodeUriFragmentIdentifier : decodePointer;
  }

  function JsonPointer(ptr) {
    // decode if necessary, make immutable.
    var localPath = (Array.isArray(ptr)) ?
      ptr.slice(0) :
      ptr = pickDecoder(ptr)(ptr);
    var $original = (Array.isArray(ptr)) ? encodePointer(localPath) : ptr;
    var $pointer;
    var $fragmentId;
    var $compiledGetter = compilePointerDereference(localPath);
    Object.defineProperties(this, {
      get: {
        enumerable: true,
        value: $compiledGetter
      },
      set: {
        enumerable: true,
        value: function (target, value, force) {
          return setValueAtPath(target, value, localPath, force);
        }
      },
      has: {
        enumerable: true,
        value: function (target) {
          return typeof ($compiledGetter(target)) !== 'undefined';
        }
      },
      path: {
        enumerable: true,
        get: function () {
          return localPath.slice(0);
        }
      },
      pointer: {
        enumerable: true,
        get: function () {
          if (!$pointer) {
            $pointer = encodePointer(localPath);
          }
          return $pointer;
        }
      },
      uriFragmentIdentifier: {
        enumerable: true,
        get: function () {
          if (!$fragmentId) {
            $fragmentId = encodeUriFragmentIdentifier(localPath);
          }
          return $fragmentId;
        }
      },
      toString: {
        enumerable: true,
        configurable: true,
        writable: true,
        value: function () {
          return $original;
        }
      }
    });
  }

  function JsonReference(pointer) {
    var localPtr = (typeof (pointer) === 'string' || Array.isArray(pointer)) ?
      new JsonPointer(pointer) :
      pointer;

    Object.defineProperties(this, {
      $ref: {
        enumerable: true,
        value: localPtr.uriFragmentIdentifier
      },
      resolve: {
        enumerable: true,
        value: function (target) {
          return localPtr.get(target);
        }
      },
      toString: {
        enumerable: true,
        writable: true,
        configurable: true,
        value: function () {
          return localPtr.uriFragmentIdentifier;
        }
      }
    });
  }

  JsonReference.isReference = function (obj) {
    return obj && obj instanceof JsonReference ||
      (typeof obj.$ref === 'string' &&
        typeof obj.resolve === 'function');
  };

  function visit(target, visitor, cycle) {
    var items, i, ilen, j, jlen, it, path, cursor, typeT;
    var distinctObjects;
    var q = [];
    var qcursor = 0;
    q.push({
      obj: target,
      path: []
    });
    if (cycle) {
      distinctObjects = Object.create(null);
    }
    visitor(encodePointer([]), target);
    while (qcursor < q.length) {
      cursor = q[qcursor++];
      typeT = typeof cursor.obj;
      if (typeT === 'object' && cursor.obj !== null) {
        if (Array.isArray(cursor.obj)) {
          j = -1;
          jlen = cursor.obj.length;
          while (++j < jlen) {
            it = cursor.obj[j];
            path = cursor.path.concat(j);
            if (typeof it === 'object' && it !== null) {
              if (cycle && distinctObjects[it]) {
                visitor(encodePointer(path), new JsonReference(distinctObjects[it]));
                continue;
              }
              q.push({
                obj: it,
                path: path
              });
              if (cycle) {
                distinctObjects[it] = new JsonPointer(encodeUriFragmentIdentifier(path));
              }
            }
            visitor(encodePointer(path), it);
          }
        } else {
          items = Object.keys(cursor.obj);
          ilen = items.length;
          i = -1;
          while (++i < ilen) {
            it = cursor.obj[items[i]];
            path = cursor.path.concat(items[i]);
            if (typeof it === 'object' && it !== null) {
              if (cycle && distinctObjects[it]) {
                visitor(encodePointer(path), new JsonReference(distinctObjects[it]));
                continue;
              }
              q.push({
                obj: it,
                path: path
              });
              if (cycle) {
                distinctObjects[it] = new JsonPointer(encodeUriFragmentIdentifier(path));
              }
            }
            visitor(encodePointer(path), it);
          }
        }
      }
    }
  }

  JsonPointer.create = function (ptr) {
    return new JsonPointer(ptr);
  };

  JsonPointer.has = function (target, ptr) {
    return hasValueAtPath(target, pickDecoder(ptr)(ptr));
  };

  JsonPointer.get = function (target, ptr) {
    return getValueAtPath(target, pickDecoder(ptr)(ptr));
  };

  JsonPointer.set = function (target, ptr, val, force) {
    return setValueAtPath(target, val, pickDecoder(ptr)(ptr), force);
  };

  JsonPointer.list = function (target, fragmentId) {
    var res = [];
    var visitor = (fragmentId) ?
      function (ptr, val) {
        res.push({
          fragmentId: encodeUriFragmentIdentifier(decodePointer(ptr)),
          value: val
        });
      } :
      function (ptr, val) {
        res.push({
          pointer: ptr,
          value: val
        });
      };
    visit(target, visitor);
    return res;
  };

  JsonPointer.flatten = function (target, fragmentId) {
    var res = {};
    var visitor = (fragmentId) ?
      function (ptr, val) {
        res[encodeUriFragmentIdentifier(decodePointer(ptr))] = val;
      } :
      function (ptr, val) {
        res[ptr] = val;
      };
    visit(target, visitor);
    return res;
  };

  JsonPointer.map = function (target, fragmentId) {
    var res = [];
    var visitor = (fragmentId) ?
      function (ptr, val) {
        res.push({ key: encodeUriFragmentIdentifier(decodePointer(ptr)), value: val });
      } : res.set.bind(res);
    visit(target, visitor);
    return res;
  };

  JsonPointer.visit = visit;

  JsonPointer.decode = function (ptr) {
    return pickDecoder(ptr)(ptr);
  };

  JsonPointer.decodePointer = decodePointer;
  JsonPointer.encodePointer = encodePointer;
  JsonPointer.decodeUriFragmentIdentifier = decodeUriFragmentIdentifier;
  JsonPointer.encodeUriFragmentIdentifier = encodeUriFragmentIdentifier;

  // support ES6 style destructuring...
  JsonPointer.JsonPointer = JsonPointer;
  JsonPointer.JsonReference = JsonReference;
  JsonPointer.isReference = JsonReference.isReference;

  JsonPointer.noConflict = function () {
    root.JsonPointer = $savedJsonPointer;
    return JsonPointer;
  };

  root.JsonPointer = JsonPointer;
  return JsonPointer;
}));
