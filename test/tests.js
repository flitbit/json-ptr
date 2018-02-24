(function (root, factory) {
  if (typeof define === 'function' && define.amd) { // eslint-disable-line no-undef
    define(['json-ptr', 'expect.js'], factory);// eslint-disable-line no-undef
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../'), require('expect.js'));
  } else {
    root.returnExports = factory(root.JsonPointer, root.expect);
  }
  // eslint-disable-next-line no-undef
}(typeof self !== 'undefined' ? self : this, function (ptr, expect) {

  describe('JsonPointer', function () {

    describe('when working with the example data from the rfc', function () {
      var data = {
        'foo': ['bar', 'baz'],
        '': 0,
        'a/b': 1,
        'c%d': 2,
        'e^f': 3,
        'g|h': 4,
        'i\\j': 5,
        'k"l': 6,
        ' ': 7,
        'm~n': 8
      };

      describe('with a JSON pointer to the root ``', function () {
        var p = ptr.create('');

        it('#get should resolve to the object itself', function () {
          expect(p.get(data)).to.eql(data);
        });

        it('#set should throw', function () {
          expect(function () {
            p.set(data, {
              this: 'should cause an exception'
            });
          }).to.throwError();
        });

        it('should have an empty path', function () {
          expect(p.path).to.have.length(0);
        });

        it('should have a pointer that is empty', function () {
          expect(p.pointer).to.eql('');
        });

        it('should have a URI fragment identfier that is empty', function () {
          expect(p.uriFragmentIdentifier).to.eql('#');
        });
      });

      describe('a URI fragment identfier to the root #', function () {
        var p = ptr.create('#');

        it('#get should resolve to the object itself', function () {
          expect(p.get(data)).to.equal(data);
        });

        it('#set should throw', function () {
          expect(function () {
            p.set(data, {
              this: 'should cause an exception'
            });
          }).to.throwError();
        });

        it('should have an empty path', function () {
          expect(p.path).to.have.length(0);
        });

        it('should have a pointer that is empty', function () {
          expect(p.pointer).to.eql('');
        });

        it('should have a URI fragment identfier that is empty', function () {
          expect(p.uriFragmentIdentifier).to.eql('#');
        });
      });

      describe('with a JSON pointer of `/foo`', function () {
        var p = ptr.create('/foo');

        it('#get should resolve to data["foo"]', function () {
          expect(p.get(data)).to.equal(data.foo);
        });

        it('#set should succeed changing the referenced value', function () {
          var capture = p.get(data);
          var updated = {
            this: 'should succeed'
          };
          p.set(data, updated);
          expect(p.get(data)).to.eql(updated);
          p.set(data, capture);
        });

        it('should have a path of [ "foo" ]', function () {
          expect(p.path).to.eql(['foo']);
        });

        it('should have the pointer `/foo`', function () {
          expect(p.pointer).to.eql('/foo');
        });

        it('should have the URI fragment identfier `#/foo`', function () {
          expect(p.uriFragmentIdentifier).to.eql('#/foo');
        });
      });

      describe('a URI fragment identifier of `#/foo`', function () {
        var p = ptr.create('#/foo');

        it('#get should resolve to data["foo"]', function () {
          expect(p.get(data)).to.equal(data.foo);
        });

        it('#set should succeed changing the referenced value', function () {
          var capture = p.get(data);
          var updated = {
            this: 'should succeed'
          };
          p.set(data, updated);
          expect(p.get(data)).to.eql(updated);
          p.set(data, capture);
        });

        it('should have a path of [ "foo" ]', function () {
          expect(p.path).to.eql(['foo']);
        });

        it('should have the pointer `/foo`', function () {
          expect(p.pointer).to.eql('/foo');
        });

        it('should have the URI fragment identfier `#/foo`', function () {
          expect(p.uriFragmentIdentifier).to.eql('#/foo');
        });
      });

      describe('with a JSON pointer of `/foo/0`', function () {
        var p = ptr.create('/foo/0');

        it('#get should resolve to data.foo[0]', function () {
          expect(p.get(data)).to.equal(data.foo[0]);
        });

        it('#set should succeed changing the referenced value', function () {
          var capture = p.get(data);
          var updated = {
            this: 'should succeed'
          };
          p.set(data, updated);
          expect(p.get(data)).to.eql(updated);
          p.set(data, capture);
        });

        it('should have a path of [ "foo", "0" ]', function () {
          expect(p.path).to.eql(['foo', '0']);
        });

        it('should have the pointer `/foo/0`', function () {
          expect(p.pointer).to.eql('/foo/0');
        });

        it('should have the URI fragment identfier `#/foo/0`', function () {
          expect(p.uriFragmentIdentifier).to.eql('#/foo/0');
        });
      });

      describe('a URI fragment identifier of `#/foo/0`', function () {
        var p = ptr.create('#/foo/0');

        it('#get should resolve to data.foo[0]', function () {
          expect(p.get(data)).to.equal(data.foo[0]);
        });

        it('#set should succeed changing the referenced value', function () {
          var capture = p.get(data);
          var updated = {
            this: 'should succeed'
          };
          p.set(data, updated);
          expect(p.get(data)).to.eql(updated);
          p.set(data, capture);
        });

        it('should have a path of [ "foo", "0" ]', function () {
          expect(p.path).to.eql(['foo', '0']);
        });

        it('should have the pointer `/foo/0`', function () {
          expect(p.pointer).to.eql('/foo/0');
        });

        it('should have the URI fragment identfier `#/foo/0`', function () {
          expect(p.uriFragmentIdentifier).to.eql('#/foo/0');
        });
      });

      describe('a URI fragment identifier of `#/newArray/0`', function () {
        var p = ptr.create('#/newArray/0');

        it('#get should resolve to undefined', function () {
          expect(p.get(data)).to.equal(undefined);
        });

        it('#set with force should succeed creating an array and setting the referenced value', function () {
          var capture = p.get(data);
          var updated = {
            this: 'should succeed'
          };
          p.set(data, updated, true);
          expect(data.newArray).to.be.an('array');
          expect(p.get(data)).to.eql(updated);
          p.set(data, capture);
        });

        it('should have a path of [ "newArray", "0" ]', function () {
          expect(p.path).to.eql(['newArray', '0']);
        });

        it('should have the pointer `/newArray/0`', function () {
          expect(p.pointer).to.eql('/newArray/0');
        });

        it('should have the URI fragment identfier `#/newArray/0`', function () {
          expect(p.uriFragmentIdentifier).to.eql('#/newArray/0');
        });
      });

      describe('with a JSON pointer of `/`', function () {
        var p = ptr.create('/');

        it('#get should resolve to data[""]', function () {
          expect(p.get(data)).to.equal(data['']);
        });

        it('#set should succeed changing the referenced value', function () {
          var capture = p.get(data);
          var updated = {
            this: 'should succeed'
          };
          p.set(data, updated);
          expect(p.get(data)).to.eql(updated);
          p.set(data, capture);
        });

        it('should have a path of [ "" ]', function () {
          expect(p.path).to.eql(['']);
        });

        it('should have the pointer `/`', function () {
          expect(p.pointer).to.eql('/');
        });

        it('should have the URI fragment identfier `#/`', function () {
          expect(p.uriFragmentIdentifier).to.eql('#/');
        });
      });

      describe('a URI fragment identifier of `#/`', function () {
        var p = ptr.create('#/');

        it('#get should resolve to data[""]', function () {
          expect(p.get(data)).to.equal(data['']);
        });

        it('#set should succeed changing the referenced value', function () {
          var capture = p.get(data);
          var updated = {
            this: 'should succeed'
          };
          p.set(data, updated);
          expect(p.get(data)).to.eql(updated);
          p.set(data, capture);
        });

        it('should have a path of [ "" ]', function () {
          expect(p.path).to.eql(['']);
        });

        it('should have the pointer `/`', function () {
          expect(p.pointer).to.eql('/');
        });

        it('should have the URI fragment identfier `#/`', function () {
          expect(p.uriFragmentIdentifier).to.eql('#/');
        });
      });

      describe('with a JSON pointer of `/a~1b`', function () {
        var p = ptr.create('/a~1b');

        it('#get should resolve to data["a/b"]', function () {
          expect(p.get(data)).to.equal(data['a/b']);
        });

        it('#set should succeed changing the referenced value', function () {
          var capture = p.get(data);
          var updated = {
            this: 'should succeed'
          };
          p.set(data, updated);
          expect(p.get(data)).to.eql(updated);
          p.set(data, capture);
        });

        it('should have a path of [ "a/b" ]', function () {
          expect(p.path).to.eql(['a/b']);
        });

        it('should have the pointer `/a~1b`', function () {
          expect(p.pointer).to.eql('/a~1b');
        });

        it('should have the URI fragment identfier `#/a~1b`', function () {
          expect(p.uriFragmentIdentifier).to.eql('#/a~1b');
        });
      });

      describe('a URI fragment identifier of `#/a~1b`', function () {
        var p = ptr.create('#/a~1b');

        it('#get should resolve to data["a/b"]', function () {
          expect(p.get(data)).to.equal(data['a/b']);
        });

        it('#set should succeed changing the referenced value', function () {
          var capture = p.get(data);
          var updated = {
            this: 'should succeed'
          };
          p.set(data, updated);
          expect(p.get(data)).to.eql(updated);
          p.set(data, capture);
        });

        it('should have a path of [ "a/b" ]', function () {
          expect(p.path).to.eql(['a/b']);
        });

        it('should have the pointer `/a~1b`', function () {
          expect(p.pointer).to.eql('/a~1b');
        });

        it('should have the URI fragment identfier `#/a~1b`', function () {
          expect(p.uriFragmentIdentifier).to.eql('#/a~1b');
        });
      });

      describe('with a JSON pointer of `/c%d`', function () {
        var p = ptr.create('/c%d');

        it('#get should resolve to data["c%d"]', function () {
          expect(p.get(data)).to.equal(data['c%d']);
        });

        it('#set should succeed changing the referenced value', function () {
          var capture = p.get(data);
          var updated = {
            this: 'should succeed'
          };
          p.set(data, updated);
          expect(p.get(data)).to.eql(updated);
          p.set(data, capture);
        });

        it('should have a path of [ "c%d" ]', function () {
          expect(p.path).to.eql(['c%d']);
        });

        it('should have the pointer `/c%d`', function () {
          expect(p.pointer).to.eql('/c%d');
        });

        it('should have the URI fragment identfier `#/c%25d`', function () {
          expect(p.uriFragmentIdentifier).to.eql('#/c%25d');
        });
      });

      describe('a URI fragment identifier of `#/c%25d`', function () {
        var p = ptr.create('#/c%25d');

        it('#get should resolve to data["c%d"]', function () {
          expect(p.get(data)).to.equal(data['c%d']);
        });

        it('#set should succeed changing the referenced value', function () {
          var capture = p.get(data);
          var updated = {
            this: 'should succeed'
          };
          p.set(data, updated);
          expect(p.get(data)).to.eql(updated);
          p.set(data, capture);
        });

        it('should have a path of [ "c%d" ]', function () {
          expect(p.path).to.eql(['c%d']);
        });

        it('should have the pointer `/c%d`', function () {
          expect(p.pointer).to.eql('/c%d');
        });

        it('should have the URI fragment identfier `#/c%25d`', function () {
          expect(p.uriFragmentIdentifier).to.eql('#/c%25d');
        });
      });

      describe('with a JSON pointer of `/e^f`', function () {
        var p = ptr.create('/e^f');

        it('#get should resolve to data["e^f"]', function () {
          expect(p.get(data)).to.equal(data['e^f']);
        });

        it('#set should succeed changing the referenced value', function () {
          var capture = p.get(data);
          var updated = {
            this: 'should succeed'
          };
          p.set(data, updated);
          expect(p.get(data)).to.eql(updated);
          p.set(data, capture);
        });

        it('should have a path of [ "e^f" ]', function () {
          expect(p.path).to.eql(['e^f']);
        });

        it('should have the pointer `/e^f`', function () {
          expect(p.pointer).to.eql('/e^f');
        });

        it('should have the URI fragment identfier `#/e%5Ef`', function () {
          expect(p.uriFragmentIdentifier).to.eql('#/e%5Ef');
        });
      });

      describe('a URI fragment identifier of `#/e%5Ef`', function () {
        var p = ptr.create('#/e%5Ef');

        it('#get should resolve to data["e^f"]', function () {
          expect(p.get(data)).to.equal(data['e^f']);
        });

        it('#set should succeed changing the referenced value', function () {
          var capture = p.get(data);
          var updated = {
            this: 'should succeed'
          };
          p.set(data, updated);
          expect(p.get(data)).to.eql(updated);
          p.set(data, capture);
        });

        it('should have a path of [ "e^f" ]', function () {
          expect(p.path).to.eql(['e^f']);
        });

        it('should have the pointer `/e^f`', function () {
          expect(p.pointer).to.eql('/e^f');
        });

        it('should have the URI fragment identfier `#/e%5Ef`', function () {
          expect(p.uriFragmentIdentifier).to.eql('#/e%5Ef');
        });
      });

      describe('with a JSON pointer of `/g|h`', function () {
        var p = ptr.create('/g|h');

        it('#get should resolve to data["g|h"]', function () {
          expect(p.get(data)).to.equal(data['g|h']);
        });

        it('#set should succeed changing the referenced value', function () {
          var capture = p.get(data);
          var updated = {
            this: 'should succeed'
          };
          p.set(data, updated);
          expect(p.get(data)).to.eql(updated);
          p.set(data, capture);
        });

        it('should have a path of [ "g|h" ]', function () {
          expect(p.path).to.eql(['g|h']);
        });

        it('should have the pointer `/g|h`', function () {
          expect(p.pointer).to.eql('/g|h');
        });

        it('should have the URI fragment identfier `#/g%7Ch`', function () {
          expect(p.uriFragmentIdentifier).to.eql('#/g%7Ch');
        });
      });

      describe('a URI fragment identifier of `#/g%7Ch`', function () {
        var p = ptr.create('#/g%7Ch');

        it('#get should resolve to data["g|h"]', function () {
          expect(p.get(data)).to.equal(data['g|h']);
        });

        it('#set should succeed changing the referenced value', function () {
          var capture = p.get(data);
          var updated = {
            this: 'should succeed'
          };
          p.set(data, updated);
          expect(p.get(data)).to.eql(updated);
          p.set(data, capture);
        });

        it('should have a path of [ "g|h" ]', function () {
          expect(p.path).to.eql(['g|h']);
        });

        it('should have the pointer `/g|h`', function () {
          expect(p.pointer).to.eql('/g|h');
        });

        it('should have the URI fragment identfier `#/g%7Ch`', function () {
          expect(p.uriFragmentIdentifier).to.eql('#/g%7Ch');
        });
      });

      describe('with a JSON pointer of "/i\\j"', function () {
        var p = ptr.create('/i\\j');

        it('#get should resolve to data["i\\j"]', function () {
          expect(p.get(data)).to.equal(data['i\\j']);
        });

        it('#set should succeed changing the referenced value', function () {
          var capture = p.get(data);
          var updated = {
            this: 'should succeed'
          };
          p.set(data, updated);
          expect(p.get(data)).to.eql(updated);
          p.set(data, capture);
        });

        it('should have a path of [ "i\\j" ]', function () {
          expect(p.path).to.eql(['i\\j']);
        });

        it('should have the pointer `/i\\j`', function () {
          expect(p.pointer).to.eql('/i\\j');
        });

        it('should have the URI fragment identfier `#/i%5Cj`', function () {
          expect(p.uriFragmentIdentifier).to.eql('#/i%5Cj');
        });
      });

      describe('a URI fragment identifier of `#/i%5Cj`', function () {
        var p = ptr.create('#/i%5Cj');

        it('#get should resolve to data["i\\j"]', function () {
          expect(p.get(data)).to.equal(data['i\\j']);
        });

        it('#set should succeed changing the referenced value', function () {
          var capture = p.get(data);
          var updated = {
            this: 'should succeed'
          };
          p.set(data, updated);
          expect(p.get(data)).to.eql(updated);
          p.set(data, capture);
        });

        it('should have a path of [ "i\\j" ]', function () {
          expect(p.path).to.eql(['i\\j']);
        });

        it('should have the pointer `/i\\j`', function () {
          expect(p.pointer).to.eql('/i\\j');
        });

        it('should have the URI fragment identfier `#/i%5Cj`', function () {
          expect(p.uriFragmentIdentifier).to.eql('#/i%5Cj');
        });
      });

      describe('with a JSON pointer of \'/k\\"l\'', function () {
        // eslint-disable-next-line no-useless-escape
        var p = ptr.create('/k\"l');

        // eslint-disable-next-line no-useless-escape
        it('#get should resolve to data["k\"l"]', function () {

          // eslint-disable-next-line no-useless-escape
          expect(p.get(data)).to.equal(data['k\"l']);
        });

        it('#set should succeed changing the referenced value', function () {
          var capture = p.get(data);
          var updated = {
            this: 'should succeed'
          };
          p.set(data, updated);
          expect(p.get(data)).to.eql(updated);
          p.set(data, capture);
        });

        // eslint-disable-next-line no-useless-escape
        it('should have a path of [ "k\"l" ]', function () {
          // eslint-disable-next-line no-useless-escape
          expect(p.path).to.eql(['k\"l']);
        });

        // eslint-disable-next-line no-useless-escape
        it('should have the pointer `/k\"l`', function () {
          // eslint-disable-next-line no-useless-escape
          expect(p.pointer).to.eql('/k\"l');
        });

        it('should have the URI fragment identfier `#/k%22l`', function () {
          expect(p.uriFragmentIdentifier).to.eql('#/k%22l');
        });
      });

      describe('a URI fragment identifier of `#/k%22l`', function () {
        var p = ptr.create('#/k%22l');

        // eslint-disable-next-line no-useless-escape
        it('#get should resolve to data["k\"l"]', function () {
          // eslint-disable-next-line no-useless-escape
          expect(p.get(data)).to.equal(data['k\"l']);
        });

        it('#set should succeed changing the referenced value', function () {
          var capture = p.get(data);
          var updated = {
            this: 'should succeed'
          };
          p.set(data, updated);
          expect(p.get(data)).to.eql(updated);
          p.set(data, capture);
        });

        // eslint-disable-next-line no-useless-escape
        it('should have a path of [ "k\"l" ]', function () {
          // eslint-disable-next-line no-useless-escape
          expect(p.path).to.eql(['k\"l']);
        });

        // eslint-disable-next-line no-useless-escape
        it('should have the pointer `/k\"l`', function () {
          // eslint-disable-next-line no-useless-escape
          expect(p.pointer).to.eql('/k\"l');
        });

        it('should have the URI fragment identfier `#/k%22l`', function () {
          expect(p.uriFragmentIdentifier).to.eql('#/k%22l');
        });
      });

      describe('with a JSON pointer of `/ `', function () {
        var p = ptr.create('/ ');

        it('#get should resolve to data[" "]', function () {
          expect(p.get(data)).to.equal(data[' ']);
        });

        it('#set should succeed changing the referenced value', function () {
          var capture = p.get(data);
          var updated = {
            this: 'should succeed'
          };
          p.set(data, updated);
          expect(p.get(data)).to.eql(updated);
          p.set(data, capture);
        });

        it('should have a path of [ " " ]', function () {
          expect(p.path).to.eql([' ']);
        });

        it('should have the pointer `/ `', function () {
          expect(p.pointer).to.eql('/ ');
        });

        it('should have the URI fragment identfier `#/%20`', function () {
          expect(p.uriFragmentIdentifier).to.eql('#/%20');
        });
      });

      describe('a URI fragment identifier of `#/%20`', function () {
        var p = ptr.create('#/%20');

        it('#get should resolve to data[" "]', function () {
          expect(p.get(data)).to.equal(data[' ']);
        });

        it('#set should succeed changing the referenced value', function () {
          var capture = p.get(data);
          var updated = {
            this: 'should succeed'
          };
          p.set(data, updated);
          expect(p.get(data)).to.eql(updated);
          p.set(data, capture);
        });

        it('should have a path of [ " " ]', function () {
          expect(p.path).to.eql([' ']);
        });

        it('should have the pointer `/ `', function () {
          expect(p.pointer).to.eql('/ ');
        });

        it('should have the URI fragment identfier `#/%20`', function () {
          expect(p.uriFragmentIdentifier).to.eql('#/%20');
        });
      });

      describe('with a JSON pointer of `/m~0n`', function () {
        var p = ptr.create('/m~0n');

        it('#get should resolve to data["m~n"]', function () {
          expect(p.get(data)).to.equal(data['m~n']);
        });

        it('#set should succeed changing the referenced value', function () {
          var capture = p.get(data);
          var updated = {
            this: 'should succeed'
          };
          p.set(data, updated);
          expect(p.get(data)).to.eql(updated);
          p.set(data, capture);
        });

        it('should have a path of [ "m~n" ]', function () {
          expect(p.path).to.eql(['m~n']);
        });

        it('should have the pointer `/m~0n`', function () {
          expect(p.pointer).to.eql('/m~0n');
        });

        it('should have the URI fragment identfier `#/m~0n`', function () {
          expect(p.uriFragmentIdentifier).to.eql('#/m~0n');
        });
      });

      describe('a URI fragment identifier of `#/m~0n`', function () {
        var p = ptr.create('#/m~0n');

        it('#get should resolve to data["m~n"]', function () {
          expect(p.get(data)).to.equal(data['m~n']);
        });

        it('#set should succeed changing the referenced value', function () {
          var capture = p.get(data);
          var updated = {
            this: 'should succeed'
          };
          p.set(data, updated);
          expect(p.get(data)).to.eql(updated);
          p.set(data, capture);
        });

        it('should have a path of [ "m~n" ]', function () {
          expect(p.path).to.eql(['m~n']);
        });

        it('should have the pointer `/m~0n`', function () {
          expect(p.pointer).to.eql('/m~0n');
        });

        it('should have the URI fragment identfier `#/m~0n`', function () {
          expect(p.uriFragmentIdentifier).to.eql('#/m~0n');
        });
      });

      describe('a special array pointer from draft-ietf-appsawg-json-pointer-08 `/foo/-`', function () {
        var p = ptr.create('/foo/-');

        it('should not resolve via #get', function () {
          expect(p.get(data)).to.not.be.ok();
        });

        it('should set the next element of the array, repeatedly...', function () {
          p.set(data, 'qux');
          expect(data.foo[2]).to.eql('qux');
        });

        it('...3', function () {
          p.set(data, 'quux');
          expect(data.foo[3]).to.eql('quux');
        });

        it('...4', function () {
          p.set(data, 'corge');
          expect(data.foo[4]).to.eql('corge');
        });

        it('...5', function () {
          p.set(data, 'grault');
          expect(data.foo[5]).to.eql('grault');
        });
      });

      describe('an invalid pointer', function () {

        it('should fail to parse', function () {
          expect(function () {
            ptr.create('a/');
          }).to.throwError();
        });
      });

      describe('an invalid URI fragment identifier', function () {

        it('should fail to parse', function () {
          expect(function () {
            ptr.create('#a');
          }).to.throwError();
        });

      });
    });

    describe('can revert namespace using noConflict', function () {
      ptr = ptr.noConflict();

      it('conflict is restored (when applicable)', function () {
        // In node there is no global conflict.
        if (typeof globalConflict !== 'undefined') {
          expect(JsonPointer).to.be(globalConflict); // eslint-disable-line no-undef
        }
      });

      it('JsonPointer functionality available through result of noConflict()', function () {
        expect(ptr).to.have.property('get');
      });
    });

    describe('when working with complex data', function () {
      var data = {
        a: 1,
        b: {
          c: 2
        },
        d: {
          e: [{
            a: 3
          }, {
            b: 4
          }, {
            c: 5
          }]
        },
        f: null,
        'http://schema.org/name': 'Phillip'
      };


      it('#get should return `undefined` when the requested element is undefined (#/g/h)',
        function () {
          var unk = ptr.get(data, '#/g/h');
          expect(unk).to.be.an('undefined');
        });


      it('#get should return null when the requested element has a null value (#/f)',
        function () {
          var unk = ptr.get(data, '#/f');
          expect(unk).to.be(null);
        });

      it('#get should return the value of a prop named with multiple slahes (#/http:~1~1schema.org~1name)',
        function () {
          var unk = ptr.get(data, '#/http:~1~1schema.org~1name');
          expect(unk).to.be('Phillip');
        });

      it('#get should return the value of a prop named with multiple slahes (/http:~1~1schema.org~1name)',
        function () {
          var unk = ptr.get(data, '/http:~1~1schema.org~1name');
          expect(unk).to.be('Phillip');
        });

      it('#set should set the value of a prop named with multiple slahes (#/http:~1~1schema.org~1name)',
        function () {
          ptr.set(data, '#/http:~1~1schema.org~1name', 'Phil');
          var unk = ptr.get(data, '/http:~1~1schema.org~1name');
          expect(unk).to.be('Phil');
        });

      it('#set should set the value of a prop named with multiple slahes (/http:~1~1schema.org~1name)',
        function () {
          ptr.set(data, '/http:~1~1schema.org~1name', 'Phil');
          var unk = ptr.get(data, '/http:~1~1schema.org~1name');
          expect(unk).to.be('Phil');
        });

    });

    describe('given an sequence of property names ["d", "e~f", "2"]', function () {
      var path = ['d', 'e~f', '2'];

      it('#encodePointer should produce a pointer (/d/e~0f/2)', function () {
        expect(ptr.encodePointer(path)).to.be('/d/e~0f/2');
      });

      it('#encodeUriFragmentIdentifier should produce a pointer (#/d/e~0f/2)', function () {
        expect(ptr.encodeUriFragmentIdentifier(path)).to.be('#/d/e~0f/2');
      });

    });

    describe('#list', function () {
      var data = {
        a: 1,
        b: {
          c: 2
        },
        d: {
          e: [{
            a: 3
          }, {
            b: 4
          }, {
            c: 5
          }]
        },
        f: null
      };
      var tests = [
        ['#list(data)', [data, undefined], 'pointer', [
          ['', data],
          ['/a', data.a],
          ['/b', data.b],
          ['/d', data.d],
          ['/f', data.f],
          ['/b/c', data.b.c],
          ['/d/e', data.d.e],
          ['/d/e/0', data.d.e[0]],
          ['/d/e/1', data.d.e[1]],
          ['/d/e/2', data.d.e[2]],
          ['/d/e/0/a', data.d.e[0].a],
          ['/d/e/1/b', data.d.e[1].b],
          ['/d/e/2/c', data.d.e[2].c]
        ]],
        ['#list(data, true)', [data, true], 'fragmentId', [
          ['#', data],
          ['#/a', data.a],
          ['#/b', data.b],
          ['#/d', data.d],
          ['#/f', data.f],
          ['#/b/c', data.b.c],
          ['#/d/e', data.d.e],
          ['#/d/e/0', data.d.e[0]],
          ['#/d/e/1', data.d.e[1]],
          ['#/d/e/2', data.d.e[2]],
          ['#/d/e/0/a', data.d.e[0].a],
          ['#/d/e/1/b', data.d.e[1].b],
          ['#/d/e/2/c', data.d.e[2].c]
        ]]
      ];
      tests.forEach(function (test) {
        describe(test[0], function () {
          var items;
          before(function () {
            items = ptr.list(test[1][0], test[1][1]);
          });
          test[3].forEach(function (tt, n) {
            it('item ' + n + ' has ' + test[2] + ' \'' + tt[0] + '\'', function () {
              expect(items[n][test[2]]).to.equal(tt[0]);
            });
            it('item ' + n + ' has correct value', function () {
              expect(items[n].value).to.equal(tt[1]);
            });
          });
        });
      });

    });

  });
  describe('when data contains an array early in the path', function () {
    var data = {
      foo: []
    };

    it('#set(o, val, true) should create the path through the array #/foo/0/wilbur/idiocies',
      function () {
        var p = ptr.create('#/foo/0/wilbur/idiocies');
        p.set(data, 5, true);
        expect(p.get(data)).to.be(5);
      });
  });

}));
