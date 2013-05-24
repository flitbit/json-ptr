
function decodePointer (ptr) {
	if (typeof ptr !== 'string') throw new TypeError('Invalid type: JSON Pointers are represented as strings.');
	if (ptr.length === 0) return [];
	if (ptr[0] !== '/') throw new ReferenceError('Invalid JSON Pointer syntax. Non-empty pointer must begin with a solidus `/`.')
	var path = ptr.substring(1).split('/')
	, i = -1
	, len = path.length;
	while(++i < len) {
		path[i] = path[i].replace('~1', '/').replace('~0', '~');
	}
	return path;
}

function encodePointer (path) {
	if (path && !Array.isArray(path)) throw new TypeError('Invalid type: path must be an array of segments.');
	path = path || [];
	if (path.length === 0) return '';
	var clone = path.slice(0)
	, i = -1
	, len = path.length
	while(++i < len) {
		clone[i] = clone[i].replace('~', '~0').replace('/', '~1');
	}
	return "/".concat(clone.join('/'));
}

function decodeUriFragmentIdentifier(ptr) {
	if (typeof ptr !== 'string') throw new TypeError('Invalid type: JSON Pointers are represented as strings.');
	if (ptr.length === 0 || ptr[0] !== '#') throw new ReferenceError('Invalid JSON Pointer syntax; URI fragment idetifiers must begin with a hash.');
	if (ptr.length === 1) return [];
	if (ptr[1] !== '/') throw new ReferenceError('Invalid JSON Pointer syntax.');
	var path = ptr.substring(2).split('/')
	, i = -1
	, len = path.length;
	while(++i < len) {
		path[i] = decodeURIComponent(path[i]).replace('~1', '/').replace('~0', '~');
	}
	return path;
}

function encodeUriFragmentIdentifier(path) {
	if (path && !Array.isArray(path)) throw new TypeError('Invalid type: path must be an array of segments.');
	path = path || [];
	if (path.length === 0) return '#';
	var clone = path.slice(0)
	, i = -1
	, len = path.length
	while(++i < len) {
		clone[i] = encodeURIComponent(clone[i].replace('~', '~0').replace('/', '~1'));
	}
	return "#/".concat(clone.join('/'));
}

function toArrayIndexReference(arr, idx) {
	var len = idx.length
	, cursor = 0;
	if (len === 0 || len > 1 && idx[0] === '0') return -1;
	if (len === 1 && idx[0] === '-') return arr.length;

	while(++cursor < len) {
		if (idx[cursor] < '0' || idx[cursor] > '9') return -1;
	}
	return parseInt(idx);
}

function JsonPointer(ptr) {
	Object.defineProperty(this, "encode",
		this.encode = (ptr.length > 0 && ptr[0] === '#') ? encodeUriFragmentIdentifier : encodePointer
		);
	if (Array.isArray(ptr)) {
		Object.defineProperty(this, "path", { enumerable: true, value: ptr });
	} else {
		var decode = (ptr.length > 0 && ptr[0] === '#') ? decodeUriFragmentIdentifier : decodePointer;
		Object.defineProperty(this, "path", { enumerable: true, value: decode(ptr) });
	}
}

Object.defineProperty(JsonPointer.prototype, 'pointer', {
	enumerable: true,
	get: function() { return encodePointer(this.path); }
});

Object.defineProperty(JsonPointer.prototype, 'uriFragmentIdentifier', {
	enumerable: true,
	get: function() { return encodeUriFragmentIdentifier(this.path); }
});

JsonPointer.prototype.get = function (obj) {
	if (typeof obj !== 'undefined') {
		var path = this.path
		, it = obj
		, len = path.length
		, cursor = -1
		, step, p;
		// non-recursive object descent...
		if (len) {
			while(++cursor < len) {
				step = path[cursor];
				if (Array.isArray(it)) {
					if (isNaN(step)) {
						break;
					}
					p = toArrayIndexReference(it, step);
					if (it.length > p) {
						it = it[p];
					} else {
						break;
					}
				} else {
					it = it[step];
					if (typeof it === 'undefined') {
						break;
					}
				}
			}
			if (cursor === len) {
				return it;
			}
		} else {
			return it;
		}
	}
	// implicit return undefined, allows us to
	// differentiate null as a valid value.
}

JsonPointer.prototype.set = function (obj, val) {
	if (this.path.length === 0) throw new Error("Cannot set the root object; assign it directly.")
	if (typeof obj !== 'undefined') {
		var path = this.path
		, it = obj
		, len = path.length
		, set = path.length - 1
		, cursor = -1
		, step, p, rem;
		// non-recursive object descent...
		if (len) {
			while(++cursor < len) {
				step = path[cursor];
				if (Array.isArray(it)) {
					p = toArrayIndexReference(it, step);
					if (it.length > p) {
						if (cursor === set) {
							rem = it[p];
							it[p] = val;
							return rem;
						}
						it = it[p];
					} else if (it.length === p) {
						// special case; extends the array...
						it.push(val);
						return undefined;
					} else {
						throw new ReferenceError("Not found: "
							.concat(this.encode(path.slice(0, cursor + 1), true), '.'));
					}
				} else {
					if (cursor === set) {
						rem = it[step];
						it[step] = val;
						return rem;
					}
					it = it[step];
					if (typeof it === 'undefined') {
						throw new ReferenceError("Not found: "
							.concat(this.encode(path.slice(0, cursor + 1), true), '.'));
					}
				}
			}
			if (cursor === len) {
				return it;
			}
		} else {
			return it;
		}
	}
}

JsonPointer.prototype.toString = function () {
	return this.pointer;
}

module.exports.JsonPointer = JsonPointer;
module.exports.create = function (ptr) { return new JsonPointer(ptr); };
module.exports.get = function (obj, ptr) { return (new JsonPointer(ptr)).get(obj); };
module.exports.set = function (obj, ptr, val) { return (new JsonPointer(ptr)).set(obj, val); };
module.exports.decodePointer = decodePointer;
module.exports.encodePointer = encodePointer;
