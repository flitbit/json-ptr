/* jshint laxbreak: true, laxcomma: true*/
/* global global, window */

(function (undefined) {
	"use strict";

	var $scope
	, conflict, conflictResolution = [];
	if (typeof global === 'object' && global) {
		$scope = global;
		conflict = global.JsonPointer;
	} else if (typeof window !== 'undefined') {
		$scope = window;
		conflict = window.JsonPointer;
	} else {
		$scope = {};
	}
	if (conflict) {
		conflictResolution.push(
			function () {
				if ($scope.JsonPointer === JsonPointer) {
					$scope.JsonPointer = conflict;
					conflict = undefined;
				}
			});
	}

	function decodePointer(ptr) {
		if (typeof ptr !== 'string') { throw new TypeError('Invalid type: JSON Pointers are represented as strings.'); }
		if (ptr.length === 0) { return []; }
		if (ptr[0] !== '/') { throw new ReferenceError('Invalid JSON Pointer syntax. Non-empty pointer must begin with a solidus `/`.'); }
		var path = ptr.substring(1).split('/')
		, i = -1
		, len = path.length
		;
		while (++i < len) {
			path[i] = path[i].replace('~1', '/').replace('~0', '~');
		}
		return path;
	}

	function encodePointer(path) {
		if (path && !Array.isArray(path)) { throw new TypeError('Invalid type: path must be an array of segments.'); }
		if (path.length === 0) { return ''; }
		var res = []
		, i = -1
		, len = path.length
		;
		while (++i < len) {
			res.push(path[i].replace('~', '~0').replace('/', '~1'));
		}
		return "/".concat(res.join('/'));
	}

	function decodeUriFragmentIdentifier(ptr) {
		if (typeof ptr !== 'string') { throw new TypeError('Invalid type: JSON Pointers are represented as strings.'); }
		if (ptr.length === 0 || ptr[0] !== '#') { throw new ReferenceError('Invalid JSON Pointer syntax; URI fragment idetifiers must begin with a hash.'); }
		if (ptr.length === 1) { return []; }
		if (ptr[1] !== '/') { throw new ReferenceError('Invalid JSON Pointer syntax.'); }
		var path = ptr.substring(2).split('/')
		, i = -1
		, len = path.length
		;
		while (++i < len) {
			path[i] = decodeURIComponent(path[i]).replace('~1', '/').replace('~0', '~');
		}
		return path;
	}

	function encodeUriFragmentIdentifier(path) {
		if (path && !Array.isArray(path)) { throw new TypeError('Invalid type: path must be an array of segments.'); }
		if (path.length === 0) { return '#'; }
		var res = []
		, i = -1
		, len = path.length
		;
		while (++i < len) {
			res.push(encodeURIComponent(path[i].replace('~', '~0').replace('/', '~1')));
		}
		return "#/".concat(res.join('/'));
	}

	function toArrayIndexReference(arr, idx) {
		var len = idx.length
		, cursor = 0
		;
		if (len === 0 || len > 1 && idx[0] === '0')  { return -1; }
		if (len === 1 && idx[0] === '-') { return arr.length; }

		while (++cursor < len) {
			if (idx[cursor] < '0' || idx[cursor] > '9') { return -1; }
		}
		return parseInt(idx, 10);
	}

	function get(obj, path) {
		if (typeof obj !== 'undefined') {
			var it = obj
			, len = path.length
			, cursor = -1
			, step, p;
			if (len) {
				while (++cursor < len && it) {
					step = path[cursor];
					if (Array.isArray(it)) {
						if (isNaN(step)) {
							return;
						}
						p = toArrayIndexReference(it, step);
						if (it.length > p) {
							it = it[p];
						} else {
							return;
						}
					} else {
						it = it[step];
					}
				}
				return it;
			} else {
				return obj;
			}
		}
	}

	function set(obj, val, path, enc) {
		if (path.length === 0) { throw new Error("Cannot set the root object; assign it directly."); }
		if (typeof obj !== 'undefined') {
			var it = obj
			, len = path.length
			, end = path.length - 1
			, cursor = -1
			, step, p, rem;
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
							it.push(val);
							return undefined;
						} else {
							throw new ReferenceError("Not found: "
								.concat(enc(path.slice(0, cursor + 1), true), '.'));
						}
					} else {
						if (cursor === end) {
							rem = it[step];
							it[step] = val;
							return rem;
						}
						it = it[step];
						if (typeof it === 'undefined') {
							throw new ReferenceError("Not found: "
								.concat(enc(path.slice(0, cursor + 1), true), '.'));
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

	function JsonPointer(ptr) {
		this.encode = (ptr.length > 0 && ptr[0] === '#') ? encodeUriFragmentIdentifier : encodePointer;
		if (Array.isArray(ptr)) {
			this.path = ptr;
		} else {
			var decode = (ptr.length > 0 && ptr[0] === '#') ? decodeUriFragmentIdentifier : decodePointer;
			this.path = decode(ptr);
		}
	}

	Object.defineProperty(JsonPointer.prototype, 'pointer', {
		enumerable: true,
		get: function () { return encodePointer(this.path); }
	});

	Object.defineProperty(JsonPointer.prototype, 'uriFragmentIdentifier', {
		enumerable: true,
		get: function () { return encodeUriFragmentIdentifier(this.path); }
	});

	JsonPointer.prototype.get = function (obj) {
		return get(obj, this.path);
	};

	JsonPointer.prototype.set = function (obj, val) {
		return set(obj, val, this.path, this.encode);
	};

	JsonPointer.prototype.toString = function () {
		return this.pointer;
	};

	JsonPointer.create = function (ptr) { return new JsonPointer(ptr); };
	JsonPointer.get = function (obj, ptr) {
		var decode = (ptr.length > 0 && ptr[0] === '#') ? decodeUriFragmentIdentifier : decodePointer;
		return get(obj, decode(ptr));
	};
	JsonPointer.set = function (obj, ptr, val) {
		var encode = (ptr.length > 0 && ptr[0] === '#') ? encodeUriFragmentIdentifier : encodePointer;
		var decode = (ptr.length > 0 && ptr[0] === '#') ? decodeUriFragmentIdentifier : decodePointer;

		return set(obj, val, decode(ptr), encode);
	};
	JsonPointer.decodePointer = decodePointer;
	JsonPointer.encodePointer = encodePointer;
	JsonPointer.decodeUriFragmentIdentifier = decodeUriFragmentIdentifier;
	JsonPointer.encodeUriFragmentIdentifier = encodeUriFragmentIdentifier;

	JsonPointer.noConflict = function () {
		if (conflictResolution) {
			conflictResolution.forEach(function (it) { it(); });
			conflictResolution = null;
		}
		return JsonPointer;
	};

	if (typeof module !== 'undefined' && module && typeof exports === 'object' && exports && module.exports === exports) {
		module.exports = JsonPointer; // nodejs
	} else {
		$scope.JsonPointer = JsonPointer; // other... browser?
	}
}());
