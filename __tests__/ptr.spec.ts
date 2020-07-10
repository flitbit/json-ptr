/**
 * @hidden
 * @packageDocumentation
 */


import {
  JsonPointer,
  encodePointer,
  encodeUriFragmentIdentifier,
  JsonStringPointerListItem,
  UriFragmentIdentifierPointerListItem,
} from '../src';
import { expect } from 'chai';

const create = JsonPointer.create;

describe('JsonPointer', function () {
  describe('when working with the example data from the rfc', function () {
    const data = {
      foo: ['bar', 'baz'],
      '': 0,
      'a/b': 1,
      'c%d': 2,
      'e^f': 3,
      'g|h': 4,
      'i\\j': 5,
      'k"l': 6,
      ' ': 7,
      'm~n': 8,
    };

    describe('with a JSON pointer to the root ``', function () {
      const p = create('');

      it('#get should resolve to the object itself', function () {
        expect(p.get(data)).to.eql(data);
      });

      it('#set should throw', function () {
        expect(function () {
          p.set(data, {
            this: 'should cause an exception',
          });
        }).to.throw();
      });

      it('#unset should throw', function () {
        expect(function () {
          p.unset(data);
        }).to.throw('Cannot unset the root object; assign it directly.');
      });

      it('should have an empty path', function () {
        expect(p.path).to.have.length(0);
      });

      it('should have a pointer that is empty', function () {
        expect(p.pointer).to.eql('');
      });

      it('should have a URI fragment identifier that is empty', function () {
        expect(p.uriFragmentIdentifier).to.eql('#');
      });
    });

    describe('a URI fragment identifier to the root #', function () {
      const p = create('#');

      it('#get should resolve to the object itself', function () {
        expect(p.get(data)).to.eql(data);
      });

      it('#set should throw', function () {
        expect(function () {
          p.set(data, {
            this: 'should cause an exception',
          });
        }).to.throw();
      });

      it('should have an empty path', function () {
        expect(p.path).to.have.length(0);
      });

      it('should have a pointer that is empty', function () {
        expect(p.pointer).to.eql('');
      });

      it('should have a URI fragment identifier that is empty', function () {
        expect(p.uriFragmentIdentifier).to.eql('#');
      });
    });

    describe('with a JSON pointer of `/foo`', function () {
      const p = create('/foo');

      it('#get should resolve to data["foo"]', function () {
        expect(p.get(data)).to.eql(data.foo);
      });

      it('#set should succeed changing the referenced value', function () {
        const capture = p.get(data);
        const updated = {
          this: 'should succeed',
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

      it('should have the URI fragment identifier `#/foo`', function () {
        expect(p.uriFragmentIdentifier).to.eql('#/foo');
      });
    });

    describe('a URI fragment identifier of `#/foo`', function () {
      const p = create('#/foo');

      it('#get should resolve to data["foo"]', function () {
        expect(p.get(data)).to.eql(data.foo);
      });

      it('#set should succeed changing the referenced value', function () {
        const capture = p.get(data);
        const updated = {
          this: 'should succeed',
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

      it('should have the URI fragment identifier `#/foo`', function () {
        expect(p.uriFragmentIdentifier).to.eql('#/foo');
      });
    });

    describe('with a JSON pointer of `/foo/0`', function () {
      const p = create('/foo/0');

      it('#get should resolve to data.foo[0]', function () {
        expect(p.get(data)).to.eql(data.foo[0]);
      });

      it('#set should succeed changing the referenced value', function () {
        const capture = p.get(data);
        const updated = {
          this: 'should succeed',
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

      it('should have the URI fragment identifier `#/foo/0`', function () {
        expect(p.uriFragmentIdentifier).to.eql('#/foo/0');
      });
    });

    describe('a URI fragment identifier of `#/foo/0`', function () {
      const p = create('#/foo/0');

      it('#get should resolve to data.foo[0]', function () {
        expect(p.get(data)).to.eql(data.foo[0]);
      });

      it('#set should succeed changing the referenced value', function () {
        const capture = p.get(data);
        const updated = {
          this: 'should succeed',
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

      it('should have the URI fragment identifier `#/foo/0`', function () {
        expect(p.uriFragmentIdentifier).to.eql('#/foo/0');
      });
    });

    describe('a URI fragment identifier of `#/newArray/0`', function () {
      const p = create('#/newArray/0');

      it('#get should resolve to undefined', function () {
        expect(p.get(data)).to.eql(undefined);
      });

      interface ItemWithNewArray {
        newArray?: unknown[];
      }

      it('#set with force should succeed creating an array and setting the referenced value', function () {
        const blank: ItemWithNewArray = {};
        const capture = p.get(data);
        const updated = {
          this: 'should succeed',
        };
        p.set(blank, updated, true);
        expect(Array.isArray(blank.newArray)).to.eql(true);
        expect(p.get(blank)).to.eql(updated);
        p.set(blank, capture);
      });

      it('should have a path of [ "newArray", "0" ]', function () {
        expect(p.path).to.eql(['newArray', '0']);
      });

      it('should have the pointer `/newArray/0`', function () {
        expect(p.pointer).to.eql('/newArray/0');
      });

      it('should have the URI fragment identifier `#/newArray/0`', function () {
        expect(p.uriFragmentIdentifier).to.eql('#/newArray/0');
      });
    });

    describe('with a JSON pointer of `/`', function () {
      const p = create('/');

      it('#get should resolve to data[""]', function () {
        expect(p.get(data)).to.eql(data['']);
      });

      it('#set should succeed changing the referenced value', function () {
        const capture = p.get(data);
        const updated = {
          this: 'should succeed',
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

      it('should have the URI fragment identifier `#/`', function () {
        expect(p.uriFragmentIdentifier).to.eql('#/');
      });
    });

    describe('a URI fragment identifier of `#/`', function () {
      const p = create('#/');

      it('#get should resolve to data[""]', function () {
        expect(p.get(data)).to.eql(data['']);
      });

      it('#set should succeed changing the referenced value', function () {
        const capture = p.get(data);
        const updated = {
          this: 'should succeed',
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

      it('should have the URI fragment identifier `#/`', function () {
        expect(p.uriFragmentIdentifier).to.eql('#/');
      });
    });

    describe('with a JSON pointer of `/a~1b`', function () {
      const p = create('/a~1b');

      it('#get should resolve to data["a/b"]', function () {
        expect(p.get(data)).to.eql(data['a/b']);
      });

      it('#set should succeed changing the referenced value', function () {
        const capture = p.get(data);
        const updated = {
          this: 'should succeed',
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

      it('should have the URI fragment identifier `#/a~1b`', function () {
        expect(p.uriFragmentIdentifier).to.eql('#/a~1b');
      });
    });

    describe('a URI fragment identifier of `#/a~1b`', function () {
      const p = create('#/a~1b');

      it('#get should resolve to data["a/b"]', function () {
        expect(p.get(data)).to.eql(data['a/b']);
      });

      it('#set should succeed changing the referenced value', function () {
        const capture = p.get(data);
        const updated = {
          this: 'should succeed',
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

      it('should have the URI fragment identifier `#/a~1b`', function () {
        expect(p.uriFragmentIdentifier).to.eql('#/a~1b');
      });
    });

    describe('with a JSON pointer of `/c%d`', function () {
      const p = create('/c%d');

      it('#get should resolve to data["c%d"]', function () {
        expect(p.get(data)).to.eql(data['c%d']);
      });

      it('#set should succeed changing the referenced value', function () {
        const capture = p.get(data);
        const updated = {
          this: 'should succeed',
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

      it('should have the URI fragment identifier `#/c%25d`', function () {
        expect(p.uriFragmentIdentifier).to.eql('#/c%25d');
      });
    });

    describe('a URI fragment identifier of `#/c%25d`', function () {
      const p = create('#/c%25d');

      it('#get should resolve to data["c%d"]', function () {
        expect(p.get(data)).to.eql(data['c%d']);
      });

      it('#set should succeed changing the referenced value', function () {
        const capture = p.get(data);
        const updated = {
          this: 'should succeed',
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

      it('should have the URI fragment identifier `#/c%25d`', function () {
        expect(p.uriFragmentIdentifier).to.eql('#/c%25d');
      });
    });

    describe('with a JSON pointer of `/e^f`', function () {
      const p = create('/e^f');

      it('#get should resolve to data["e^f"]', function () {
        expect(p.get(data)).to.eql(data['e^f']);
      });

      it('#set should succeed changing the referenced value', function () {
        const capture = p.get(data);
        const updated = {
          this: 'should succeed',
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

      it('should have the URI fragment identifier `#/e%5Ef`', function () {
        expect(p.uriFragmentIdentifier).to.eql('#/e%5Ef');
      });
    });

    describe('a URI fragment identifier of `#/e%5Ef`', function () {
      const p = create('#/e%5Ef');

      it('#get should resolve to data["e^f"]', function () {
        expect(p.get(data)).to.eql(data['e^f']);
      });

      it('#set should succeed changing the referenced value', function () {
        const capture = p.get(data);
        const updated = {
          this: 'should succeed',
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

      it('should have the URI fragment identifier `#/e%5Ef`', function () {
        expect(p.uriFragmentIdentifier).to.eql('#/e%5Ef');
      });
    });

    describe('with a JSON pointer of `/g|h`', function () {
      const p = create('/g|h');

      it('#get should resolve to data["g|h"]', function () {
        expect(p.get(data)).to.eql(data['g|h']);
      });

      it('#set should succeed changing the referenced value', function () {
        const capture = p.get(data);
        const updated = {
          this: 'should succeed',
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

      it('should have the URI fragment identifier `#/g%7Ch`', function () {
        expect(p.uriFragmentIdentifier).to.eql('#/g%7Ch');
      });
    });

    describe('a URI fragment identifier of `#/g%7Ch`', function () {
      const p = create('#/g%7Ch');

      it('#get should resolve to data["g|h"]', function () {
        expect(p.get(data)).to.eql(data['g|h']);
      });

      it('#set should succeed changing the referenced value', function () {
        const capture = p.get(data);
        const updated = {
          this: 'should succeed',
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

      it('should have the URI fragment identifier `#/g%7Ch`', function () {
        expect(p.uriFragmentIdentifier).to.eql('#/g%7Ch');
      });
    });

    describe('with a JSON pointer of "/i\\j"', function () {
      const p = create('/i\\j');

      it('#get should resolve to data["i\\j"]', function () {
        expect(p.get(data)).to.eql(data['i\\j']);
      });

      it('#set should succeed changing the referenced value', function () {
        const capture = p.get(data);
        const updated = {
          this: 'should succeed',
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

      it('should have the URI fragment identifier `#/i%5Cj`', function () {
        expect(p.uriFragmentIdentifier).to.eql('#/i%5Cj');
      });
    });

    describe('a URI fragment identifier of `#/i%5Cj`', function () {
      const p = create('#/i%5Cj');

      it('#get should resolve to data["i\\j"]', function () {
        expect(p.get(data)).to.eql(data['i\\j']);
      });

      it('#set should succeed changing the referenced value', function () {
        const capture = p.get(data);
        const updated = {
          this: 'should succeed',
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

      it('should have the URI fragment identifier `#/i%5Cj`', function () {
        expect(p.uriFragmentIdentifier).to.eql('#/i%5Cj');
      });
    });

    describe("with a JSON pointer of '/k\\\"l'", function () {
      // eslint-disable-next-line no-useless-escape
      const p = create('/k"l');

      // eslint-disable-next-line no-useless-escape
      it('#get should resolve to data["k"l"]', function () {
        // eslint-disable-next-line no-useless-escape
        expect(p.get(data)).to.eql(data['k"l']);
      });

      it('#set should succeed changing the referenced value', function () {
        const capture = p.get(data);
        const updated = {
          this: 'should succeed',
        };
        p.set(data, updated);
        expect(p.get(data)).to.eql(updated);
        p.set(data, capture);
      });

      // eslint-disable-next-line no-useless-escape
      it('should have a path of [ "k"l" ]', function () {
        // eslint-disable-next-line no-useless-escape
        expect(p.path).to.eql(['k"l']);
      });

      // eslint-disable-next-line no-useless-escape
      it('should have the pointer `/k"l`', function () {
        // eslint-disable-next-line no-useless-escape
        expect(p.pointer).to.eql('/k"l');
      });

      it('should have the URI fragment identifier `#/k%22l`', function () {
        expect(p.uriFragmentIdentifier).to.eql('#/k%22l');
      });
    });

    describe('a URI fragment identifier of `#/k%22l`', function () {
      const p = create('#/k%22l');

      // eslint-disable-next-line no-useless-escape
      it('#get should resolve to data["k"l"]', function () {
        // eslint-disable-next-line no-useless-escape
        expect(p.get(data)).to.eql(data['k"l']);
      });

      it('#set should succeed changing the referenced value', function () {
        const capture = p.get(data);
        const updated = {
          this: 'should succeed',
        };
        p.set(data, updated);
        expect(p.get(data)).to.eql(updated);
        p.set(data, capture);
      });

      // eslint-disable-next-line no-useless-escape
      it('should have a path of [ "k"l" ]', function () {
        // eslint-disable-next-line no-useless-escape
        expect(p.path).to.eql(['k"l']);
      });

      // eslint-disable-next-line no-useless-escape
      it('should have the pointer `/k"l`', function () {
        // eslint-disable-next-line no-useless-escape
        expect(p.pointer).to.eql('/k"l');
      });

      it('should have the URI fragment identifier `#/k%22l`', function () {
        expect(p.uriFragmentIdentifier).to.eql('#/k%22l');
      });
    });

    describe('with a JSON pointer of `/ `', function () {
      const p = create('/ ');

      it('#get should resolve to data[" "]', function () {
        expect(p.get(data)).to.eql(data[' ']);
      });

      it('#set should succeed changing the referenced value', function () {
        const capture = p.get(data);
        const updated = {
          this: 'should succeed',
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

      it('should have the URI fragment identifier `#/%20`', function () {
        expect(p.uriFragmentIdentifier).to.eql('#/%20');
      });
    });

    describe('a URI fragment identifier of `#/%20`', function () {
      const p = create('#/%20');

      it('#get should resolve to data[" "]', function () {
        expect(p.get(data)).to.eql(data[' ']);
      });

      it('#set should succeed changing the referenced value', function () {
        const capture = p.get(data);
        const updated = {
          this: 'should succeed',
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

      it('should have the URI fragment identifier `#/%20`', function () {
        expect(p.uriFragmentIdentifier).to.eql('#/%20');
      });
    });

    describe('with a JSON pointer of `/m~0n`', function () {
      const p = create('/m~0n');

      it('#get should resolve to data["m~n"]', function () {
        expect(p.get(data)).to.eql(data['m~n']);
      });

      it('#set should succeed changing the referenced value', function () {
        const capture = p.get(data);
        const updated = {
          this: 'should succeed',
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

      it('should have the URI fragment identifier `#/m~0n`', function () {
        expect(p.uriFragmentIdentifier).to.eql('#/m~0n');
      });
    });

    describe('a URI fragment identifier of `#/m~0n`', function () {
      const p = create('#/m~0n');

      it('#get should resolve to data["m~n"]', function () {
        expect(p.get(data)).to.eql(data['m~n']);
      });

      it('#set should succeed changing the referenced value', function () {
        const capture = p.get(data);
        const updated = {
          this: 'should succeed',
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

      it('should have the URI fragment identifier `#/m~0n`', function () {
        expect(p.uriFragmentIdentifier).to.eql('#/m~0n');
      });
    });

    describe('a special array pointer from draft-ietf-appsawg-json-pointer-08 `/foo/-`', function () {
      const p = create('/foo/-');

      it('should not resolve via #get', function () {
        expect(p.get(data)).to.be.undefined;
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
          create('a/');
        }).to.throw();
      });
    });

    describe('an invalid URI fragment identifier', function () {
      it('should fail to parse', function () {
        expect(function () {
          create('#a');
        }).to.throw();
      });
    });
  });

  describe('when working with complex data', function () {
    const data = {
      a: 1,
      b: {
        c: 2,
      },
      d: {
        e: [
          {
            a: 3,
          },
          {
            b: 4,
          },
          {
            c: 5,
          },
        ],
      },
      f: null as string,
      'http://schema.org/name': 'Phillip',
    };

    it('#get should return `undefined` when the requested element is undefined (#/g/h)', function () {
      const unk = JsonPointer.get(data, '#/g/h');
      expect(unk).to.be.undefined;
    });

    it('#get should return null when the requested element has a null value (#/f)', function () {
      const unk = JsonPointer.get(data, '#/f');
      expect(unk).to.be.null;
    });

    it('#get should return the value of a prop named with multiple slahes (#/http:~1~1schema.org~1name)', function () {
      const unk = JsonPointer.get(data, '#/http:~1~1schema.org~1name');
      expect(unk).to.eql('Phillip');
    });

    it('#get should return the value of a prop named with multiple slahes (/http:~1~1schema.org~1name)', function () {
      const unk = JsonPointer.get(data, '/http:~1~1schema.org~1name');
      expect(unk).to.eql('Phillip');
    });

    it('#set should set the value of a prop named with multiple slahes (#/http:~1~1schema.org~1name)', function () {
      JsonPointer.set(data, '#/http:~1~1schema.org~1name', 'Phil');
      const unk = JsonPointer.get(data, '/http:~1~1schema.org~1name');
      expect(unk).to.eql('Phil');
    });

    it('#set should set the value of a prop named with multiple slahes (/http:~1~1schema.org~1name)', function () {
      JsonPointer.set(data, '/http:~1~1schema.org~1name', 'Phil');
      const unk = JsonPointer.get(data, '/http:~1~1schema.org~1name');
      expect(unk).to.eql('Phil');
    });
  });

  describe('given an sequence of property names ["d", "e~f", "2"]', function () {
    const path = ['d', 'e~f', '2'];

    it('#encodePointer should produce a pointer (/d/e~0f/2)', function () {
      expect(encodePointer(path)).to.eql('/d/e~0f/2');
    });

    it('#encodeUriFragmentIdentifier should produce a pointer (#/d/e~0f/2)', function () {
      expect(encodeUriFragmentIdentifier(path)).to.eql('#/d/e~0f/2');
    });
  });

  describe('#list...', function () {
    const data = {
      a: 1,
      b: { c: 2 },
      d: { e: [{ a: 3 }, { b: 4 }, { c: 5 }] },
      f: null as string,
    };
    const pointerList = [
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
      ['/d/e/2/c', data.d.e[2].c],
    ];
    const fragmentList = [
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
      ['#/d/e/2/c', data.d.e[2].c],
    ];
    describe('listPointers(target)', function () {
      const items: JsonStringPointerListItem[] = JsonPointer.listPointers(data);
      pointerList.forEach(function (tt, n) {
        it(`item ${n} has pointer ${tt[0]}`, () => {
          expect(items[n].pointer).to.eql(tt[0]);
        });
        it(`item ${n} has value ${tt[1]}`, () => {
          expect(items[n].value).to.eql(tt[1]);
        });
      });
    });
    describe('listFragmentIds(target)', function () {
      const items: UriFragmentIdentifierPointerListItem[] = JsonPointer.listFragmentIds(data);
      fragmentList.forEach(function (tt, n) {
        it(`item ${n} has fragmentId ${tt[0]}`, () => {
          expect(items[n].fragmentId).to.eql(tt[0]);
        });
        it(`item ${n} has value ${tt[1]}`, () => {
          expect(items[n].value).to.eql(tt[1]);
        });
      });
    });
  });
});
describe('when data contains an array early in the path', function () {
  const data = {
    foo: [] as number[],
  };

  it('#set(o, val, true) should create the path through the array #/foo/0/wilbur/idiocies', function () {
    const p = create('#/foo/0/wilbur/idiocies');
    p.set(data, 5, true);
    expect(p.get(data) as number).to.eql(5);
  });
});

describe('concat pointers', function () {
  const ptr1 = create('/a/b');
  const ptr2 = create('/c/d');
  const result = '/a/b/c/d';

  it('#concat JsonPointer("/a/b") with array ["a", "b"] should produce ' + result, function () {
    expect(ptr1.concat(Array.from(ptr2.path)).pointer).to.eql(result);
  });

  it('#concat JsonPointer("/a/b") with JsonPointer("/b/c") should produce ' + result, function () {
    expect(ptr1.concat(ptr2).pointer).to.eql(result);
  });

  it('#concat JsonPointer("/a/b") with string "/b/c" should produce ' + result, function () {
    expect(ptr1.concat(ptr2.pointer).pointer).to.eql(result);
  });

  it('#concat JsonPointer("/a/b") with string "#/b/c" should produce ' + result, function () {
    expect(ptr1.concat(ptr2.uriFragmentIdentifier).toString()).to.eql(result);
  });
});
