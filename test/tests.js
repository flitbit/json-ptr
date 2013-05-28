var should   = require('should'),
ptr = require('..')
;

describe('JsonPointer', function() {
	'use strict';

	describe('when working with the example data from the rfc', function() {
		var data = {
			"foo":      ["bar", "baz"],
			"":         0,
			"a/b":      1,
			"c%d":      2,
			"e^f":      3,
			"g|h":      4,
			"i\\j":     5,
			"k\"l":     6,
			" ":        7,
			"m~n":      8
		};

		describe('with a JSON pointer to the root ``', function() {
			var p = ptr.create('');

			it('#get should resolve to the object itself', function() {
				p.get(data).should.equal(data);
			});

			it('#set should throw', function() {
				(function() {
					p.set(data, { this: "should cause an exception"});
				}).should.throw();
			});

			it('should have an empty path', function() {
				p.path.should.have.length(0);
			});

			it('should have a pointer that is empty', function() {
				p.pointer.should.eql('');
			});

			it('should have a URI fragment identfier that is empty', function() {
				p.uriFragmentIdentifier.should.eql('#');
			});
		});

		describe('a URI fragment identfier to the root #', function() {
			var p = ptr.create('#');

			it('#get should resolve to the object itself', function() {
				p.get(data).should.equal(data);
			});

			it('#set should throw', function() {
				(function() {
					p.set(data, { this: "should cause an exception"});
				}).should.throw();
			});

			it('should have an empty path', function() {
				p.path.should.have.length(0);
			});

			it('should have a pointer that is empty', function() {
				p.pointer.should.eql('');
			});

			it('should have a URI fragment identfier that is empty', function() {
				p.uriFragmentIdentifier.should.eql('#');
			});
		});

		describe('with a JSON pointer of `/foo`', function() {
			var p = ptr.create('/foo');

			it('#get should resolve to data["foo"]', function() {
				p.get(data).should.equal(data["foo"]);
			});

			it('#set should succeed changing the referenced value', function() {
				var capture = p.get(data);
				var updated = { this: "should succeed" }; 
				p.set(data, updated);
				p.get(data).should.eql(updated);
				p.set(data, capture);
			});

			it('should have a path of [ "foo" ]', function() {
				p.path.should.eql(["foo"]);
			});

			it('should have the pointer `/foo`', function() {
				p.pointer.should.eql('/foo');
			});

			it('should have the URI fragment identfier `#/foo`', function() {
				p.uriFragmentIdentifier.should.eql('#/foo');
			});
		});

		describe('a URI fragment identifier of `#/foo`', function() {
			var p = ptr.create('#/foo');

			it('#get should resolve to data["foo"]', function() {
				p.get(data).should.equal(data["foo"]);
			});

			it('#set should succeed changing the referenced value', function() {
				var capture = p.get(data);
				var updated = { this: "should succeed" }; 
				p.set(data, updated);
				p.get(data).should.eql(updated);
				p.set(data, capture);
			});

			it('should have a path of [ "foo" ]', function() {
				p.path.should.eql(["foo"]);
			});

			it('should have the pointer `/foo`', function() {
				p.pointer.should.eql('/foo');
			});

			it('should have the URI fragment identfier `#/foo`', function() {
				p.uriFragmentIdentifier.should.eql('#/foo');
			});
		});

		describe('with a JSON pointer of `/foo/0`', function() {
			var p = ptr.create('/foo/0');

			it('#get should resolve to data.foo[0]', function() {
				p.get(data).should.equal(data.foo[0]);
			});

			it('#set should succeed changing the referenced value', function() {
				var capture = p.get(data);
				var updated = { this: "should succeed" }; 
				p.set(data, updated);
				p.get(data).should.eql(updated);
				p.set(data, capture);
			});

			it('should have a path of [ "foo", "0" ]', function() {
				p.path.should.eql(["foo", "0"]);
			});

			it('should have the pointer `/foo/0`', function() {
				p.pointer.should.eql('/foo/0');
			});

			it('should have the URI fragment identfier `#/foo/0`', function() {
				p.uriFragmentIdentifier.should.eql('#/foo/0');
			});
		});

		describe('a URI fragment identifier of `#/foo/0`', function() {
			var p = ptr.create('#/foo/0');

			it('#get should resolve to data.foo[0]', function() {
				p.get(data).should.equal(data.foo[0]);
			});

			it('#set should succeed changing the referenced value', function() {
				var capture = p.get(data);
				var updated = { this: "should succeed" }; 
				p.set(data, updated);
				p.get(data).should.eql(updated);
				p.set(data, capture);
			});

			it('should have a path of [ "foo", "0" ]', function() {
				p.path.should.eql(["foo", "0"]);
			});

			it('should have the pointer `/foo/0`', function() {
				p.pointer.should.eql('/foo/0');
			});

			it('should have the URI fragment identfier `#/foo/0`', function() {
				p.uriFragmentIdentifier.should.eql('#/foo/0');
			});
		});

		describe('with a JSON pointer of `/`', function() {
			var p = ptr.create('/');

			it('#get should resolve to data[""]', function() {
				p.get(data).should.equal(data[""]);
			});

			it('#set should succeed changing the referenced value', function() {
				var capture = p.get(data);
				var updated = { this: "should succeed" }; 
				p.set(data, updated);
				p.get(data).should.eql(updated);
				p.set(data, capture);
			});

			it('should have a path of [ "" ]', function() {
				p.path.should.eql([""]);
			});

			it('should have the pointer `/`', function() {
				p.pointer.should.eql('/');
			});

			it('should have the URI fragment identfier `#/`', function() {
				p.uriFragmentIdentifier.should.eql('#/');
			});
		});

		describe('a URI fragment identifier of `#/`', function() {
			var p = ptr.create('#/');

			it('#get should resolve to data[""]', function() {
				p.get(data).should.equal(data[""]);
			});

			it('#set should succeed changing the referenced value', function() {
				var capture = p.get(data);
				var updated = { this: "should succeed" }; 
				p.set(data, updated);
				p.get(data).should.eql(updated);
				p.set(data, capture);
			});

			it('should have a path of [ "" ]', function() {
				p.path.should.eql([""]);
			});

			it('should have the pointer `/`', function() {
				p.pointer.should.eql('/');
			});

			it('should have the URI fragment identfier `#/`', function() {
				p.uriFragmentIdentifier.should.eql('#/');
			});
		});

		describe('with a JSON pointer of `/a~1b`', function() {
			var p = ptr.create('/a~1b');

			it('#get should resolve to data["a/b"]', function() {
				p.get(data).should.equal(data["a/b"]);
			});

			it('#set should succeed changing the referenced value', function() {
				var capture = p.get(data);
				var updated = { this: "should succeed" }; 
				p.set(data, updated);
				p.get(data).should.eql(updated);
				p.set(data, capture);
			});

			it('should have a path of [ "a/b" ]', function() {
				p.path.should.eql(["a/b"]);
			});

			it('should have the pointer `/a~1b`', function() {
				p.pointer.should.eql('/a~1b');
			});

			it('should have the URI fragment identfier `#/a~1b`', function() {
				p.uriFragmentIdentifier.should.eql('#/a~1b');
			});
		});

		describe('a URI fragment identifier of `#/a~1b`', function() {
			var p = ptr.create('#/a~1b');

			it('#get should resolve to data["a/b"]', function() {
				p.get(data).should.equal(data["a/b"]);
			});

			it('#set should succeed changing the referenced value', function() {
				var capture = p.get(data);
				var updated = { this: "should succeed" }; 
				p.set(data, updated);
				p.get(data).should.eql(updated);
				p.set(data, capture);
			});

			it('should have a path of [ "a/b" ]', function() {
				p.path.should.eql(["a/b"]);
			});

			it('should have the pointer `/a~1b`', function() {
				p.pointer.should.eql('/a~1b');
			});

			it('should have the URI fragment identfier `#/a~1b`', function() {
				p.uriFragmentIdentifier.should.eql('#/a~1b');
			});
		});

		describe('with a JSON pointer of `/c%d`', function() {
			var p = ptr.create('/c%d');

			it('#get should resolve to data["c%d"]', function() {
				p.get(data).should.equal(data["c%d"]);
			});

			it('#set should succeed changing the referenced value', function() {
				var capture = p.get(data);
				var updated = { this: "should succeed" }; 
				p.set(data, updated);
				p.get(data).should.eql(updated);
				p.set(data, capture);
			});

			it('should have a path of [ "c%d" ]', function() {
				p.path.should.eql(["c%d"]);
			});

			it('should have the pointer `/c%d`', function() {
				p.pointer.should.eql('/c%d');
			});

			it('should have the URI fragment identfier `#/c%25d`', function() {
				p.uriFragmentIdentifier.should.eql('#/c%25d');
			});
		});

		describe('a URI fragment identifier of `#/c%25d`', function() {
			var p = ptr.create('#/c%25d');

			it('#get should resolve to data["c%d"]', function() {
				p.get(data).should.equal(data["c%d"]);
			});

			it('#set should succeed changing the referenced value', function() {
				var capture = p.get(data);
				var updated = { this: "should succeed" }; 
				p.set(data, updated);
				p.get(data).should.eql(updated);
				p.set(data, capture);
			});

			it('should have a path of [ "c%d" ]', function() {
				p.path.should.eql(["c%d"]);
			});

			it('should have the pointer `/c%d`', function() {
				p.pointer.should.eql('/c%d');
			});

			it('should have the URI fragment identfier `#/c%25d`', function() {
				p.uriFragmentIdentifier.should.eql('#/c%25d');
			});
		});

		describe('with a JSON pointer of `/e^f`', function() {
			var p = ptr.create('/e^f');

			it('#get should resolve to data["e^f"]', function() {
				p.get(data).should.equal(data["e^f"]);
			});

			it('#set should succeed changing the referenced value', function() {
				var capture = p.get(data);
				var updated = { this: "should succeed" }; 
				p.set(data, updated);
				p.get(data).should.eql(updated);
				p.set(data, capture);
			});

			it('should have a path of [ "e^f" ]', function() {
				p.path.should.eql(["e^f"]);
			});

			it('should have the pointer `/e^f`', function() {
				p.pointer.should.eql('/e^f');
			});

			it('should have the URI fragment identfier `#/e%5Ef`', function() {
				p.uriFragmentIdentifier.should.eql('#/e%5Ef');
			});
		});

		describe('a URI fragment identifier of `#/e%5Ef`', function() {
			var p = ptr.create('#/e%5Ef');

			it('#get should resolve to data["e^f"]', function() {
				p.get(data).should.equal(data["e^f"]);
			});

			it('#set should succeed changing the referenced value', function() {
				var capture = p.get(data);
				var updated = { this: "should succeed" }; 
				p.set(data, updated);
				p.get(data).should.eql(updated);
				p.set(data, capture);
			});

			it('should have a path of [ "e^f" ]', function() {
				p.path.should.eql(["e^f"]);
			});

			it('should have the pointer `/e^f`', function() {
				p.pointer.should.eql('/e^f');
			});

			it('should have the URI fragment identfier `#/e%5Ef`', function() {
				p.uriFragmentIdentifier.should.eql('#/e%5Ef');
			});
		});

		describe('with a JSON pointer of `/g|h`', function() {
			var p = ptr.create('/g|h');

			it('#get should resolve to data["g|h"]', function() {
				p.get(data).should.equal(data["g|h"]);
			});

			it('#set should succeed changing the referenced value', function() {
				var capture = p.get(data);
				var updated = { this: "should succeed" }; 
				p.set(data, updated);
				p.get(data).should.eql(updated);
				p.set(data, capture);
			});

			it('should have a path of [ "g|h" ]', function() {
				p.path.should.eql(["g|h"]);
			});

			it('should have the pointer `/g|h`', function() {
				p.pointer.should.eql('/g|h');
			});

			it('should have the URI fragment identfier `#/g%7Ch`', function() {
				p.uriFragmentIdentifier.should.eql('#/g%7Ch');
			});
		});

		describe('a URI fragment identifier of `#/g%7Ch`', function() {
			var p = ptr.create('#/g%7Ch');

			it('#get should resolve to data["g|h"]', function() {
				p.get(data).should.equal(data["g|h"]);
			});

			it('#set should succeed changing the referenced value', function() {
				var capture = p.get(data);
				var updated = { this: "should succeed" }; 
				p.set(data, updated);
				p.get(data).should.eql(updated);
				p.set(data, capture);
			});

			it('should have a path of [ "g|h" ]', function() {
				p.path.should.eql(["g|h"]);
			});

			it('should have the pointer `/g|h`', function() {
				p.pointer.should.eql('/g|h');
			});

			it('should have the URI fragment identfier `#/g%7Ch`', function() {
				p.uriFragmentIdentifier.should.eql('#/g%7Ch');
			});
		});

		describe('with a JSON pointer of `/i\\j`', function() {
			var p = ptr.create('/i\\j');

			it('#get should resolve to data["i\\j"]', function() {
				p.get(data).should.equal(data["i\\j"]);
			});

			it('#set should succeed changing the referenced value', function() {
				var capture = p.get(data);
				var updated = { this: "should succeed" }; 
				p.set(data, updated);
				p.get(data).should.eql(updated);
				p.set(data, capture);
			});

			it('should have a path of [ "i\\j" ]', function() {
				p.path.should.eql(["i\\j"]);
			});

			it('should have the pointer `/i\\j`', function() {
				p.pointer.should.eql('/i\\j');
			});

			it('should have the URI fragment identfier `#/i%5Cj`', function() {
				p.uriFragmentIdentifier.should.eql('#/i%5Cj');
			});
		});

		describe('a URI fragment identifier of `#/i%5Cj`', function() {
			var p = ptr.create('#/i%5Cj');

			it('#get should resolve to data["i\\j"]', function() {
				p.get(data).should.equal(data["i\\j"]);
			});

			it('#set should succeed changing the referenced value', function() {
				var capture = p.get(data);
				var updated = { this: "should succeed" }; 
				p.set(data, updated);
				p.get(data).should.eql(updated);
				p.set(data, capture);
			});

			it('should have a path of [ "i\\j" ]', function() {
				p.path.should.eql(["i\\j"]);
			});

			it('should have the pointer `/i\\j`', function() {
				p.pointer.should.eql('/i\\j');
			});

			it('should have the URI fragment identfier `#/i%5Cj`', function() {
				p.uriFragmentIdentifier.should.eql('#/i%5Cj');
			});
		});

		describe('with a JSON pointer of `/k\"l`', function() {
			var p = ptr.create('/k\"l');

			it('#get should resolve to data["k\"l"]', function() {
				p.get(data).should.equal(data["k\"l"]);
			});

			it('#set should succeed changing the referenced value', function() {
				var capture = p.get(data);
				var updated = { this: "should succeed" }; 
				p.set(data, updated);
				p.get(data).should.eql(updated);
				p.set(data, capture);
			});

			it('should have a path of [ "k\"l" ]', function() {
				p.path.should.eql(["k\"l"]);
			});

			it('should have the pointer `/k\"l`', function() {
				p.pointer.should.eql('/k\"l');
			});

			it('should have the URI fragment identfier `#/k%22l`', function() {
				p.uriFragmentIdentifier.should.eql('#/k%22l');
			});
		});

		describe('a URI fragment identifier of `#/k%22l`', function() {
			var p = ptr.create('#/k%22l');

			it('#get should resolve to data["k\"l"]', function() {
				p.get(data).should.equal(data["k\"l"]);
			});

			it('#set should succeed changing the referenced value', function() {
				var capture = p.get(data);
				var updated = { this: "should succeed" }; 
				p.set(data, updated);
				p.get(data).should.eql(updated);
				p.set(data, capture);
			});

			it('should have a path of [ "k\"l" ]', function() {
				p.path.should.eql(["k\"l"]);
			});

			it('should have the pointer `/k\"l`', function() {
				p.pointer.should.eql('/k\"l');
			});

			it('should have the URI fragment identfier `#/k%22l`', function() {
				p.uriFragmentIdentifier.should.eql('#/k%22l');
			});
		});

		describe('with a JSON pointer of `/ `', function() {
			var p = ptr.create('/ ');

			it('#get should resolve to data[" "]', function() {
				p.get(data).should.equal(data[" "]);
			});

			it('#set should succeed changing the referenced value', function() {
				var capture = p.get(data);
				var updated = { this: "should succeed" }; 
				p.set(data, updated);
				p.get(data).should.eql(updated);
				p.set(data, capture);
			});

			it('should have a path of [ " " ]', function() {
				p.path.should.eql([" "]);
			});

			it('should have the pointer `/ `', function() {
				p.pointer.should.eql('/ ');
			});

			it('should have the URI fragment identfier `#/%20`', function() {
				p.uriFragmentIdentifier.should.eql('#/%20');
			});
		});

		describe('a URI fragment identifier of `#/%20`', function() {
			var p = ptr.create('#/%20');

			it('#get should resolve to data[" "]', function() {
				p.get(data).should.equal(data[" "]);
			});

			it('#set should succeed changing the referenced value', function() {
				var capture = p.get(data);
				var updated = { this: "should succeed" }; 
				p.set(data, updated);
				p.get(data).should.eql(updated);
				p.set(data, capture);
			});

			it('should have a path of [ " " ]', function() {
				p.path.should.eql([" "]);
			});

			it('should have the pointer `/ `', function() {
				p.pointer.should.eql('/ ');
			});

			it('should have the URI fragment identfier `#/%20`', function() {
				p.uriFragmentIdentifier.should.eql('#/%20');
			});
		});

		describe('with a JSON pointer of `/m~0n`', function() {
			var p = ptr.create('/m~0n');

			it('#get should resolve to data["m~n"]', function() {
				p.get(data).should.equal(data["m~n"]);
			});

			it('#set should succeed changing the referenced value', function() {
				var capture = p.get(data);
				var updated = { this: "should succeed" }; 
				p.set(data, updated);
				p.get(data).should.eql(updated);
				p.set(data, capture);
			});

			it('should have a path of [ "m~n" ]', function() {
				p.path.should.eql(["m~n"]);
			});

			it('should have the pointer `/m~0n`', function() {
				p.pointer.should.eql('/m~0n');
			});

			it('should have the URI fragment identfier `#/m~0n`', function() {
				p.uriFragmentIdentifier.should.eql('#/m~0n');
			});
		});

		describe('a URI fragment identifier of `#/m~0n`', function() {
			var p = ptr.create('#/m~0n');

			it('#get should resolve to data["m~n"]', function() {
				p.get(data).should.equal(data["m~n"]);
			});

			it('#set should succeed changing the referenced value', function() {
				var capture = p.get(data);
				var updated = { this: "should succeed" }; 
				p.set(data, updated);
				p.get(data).should.eql(updated);
				p.set(data, capture);
			});

			it('should have a path of [ "m~n" ]', function() {
				p.path.should.eql(["m~n"]);
			});

			it('should have the pointer `/m~0n`', function() {
				p.pointer.should.eql('/m~0n');
			});

			it('should have the URI fragment identfier `#/m~0n`', function() {
				p.uriFragmentIdentifier.should.eql('#/m~0n');
			});
		});

		describe('a special array pointer from draft-ietf-appsawg-json-pointer-08 `/foo/-`', function() {
			var p = ptr.create('/foo/-');

			it('should not resolve via #get', function() {
				should.not.exist(p.get(data));
			});

			it('should set the next element of the array, repeatedly...', function() {
				p.set(data, 'qux');
				data.foo[2].should.eql('qux');
			});

			it('...', function() {
				p.set(data, 'quux');
				data.foo[3].should.eql('quux');
			});

			it('...', function() {
				p.set(data, 'corge');
				data.foo[4].should.eql('corge');
			});

			it('...', function() {
				p.set(data, 'grault');
				data.foo[5].should.eql('grault');
			});
		});

		describe('an invalid pointer', function() {

			it('should fail to parse', function() {
				(function() {
					ptr.create('a/');
				}).should.throw();
			});
		});

		describe('an invalid URI fragment identifier', function() {

			it('should fail to parse', function() {
				(function() {
					ptr.create('#a');
				}).should.throw();
			});

		});
	});

describe('when working with complex data', function() {
	var data = {
		a: 1,
		b: {
			c: 2
		},
		d: {
			e: [{a:3}, {b:4}, {c:5}]
		}
	};

	it('#get should return `undefined` when the requested element is undefined (#/g/h)', function() {
		var unk = ptr.get(data, '#/g/h');
		(typeof unk).should.eql('undefined');
	});
});

});
