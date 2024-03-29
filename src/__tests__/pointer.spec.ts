/**
 * @hidden
 * @packageDocumentation
 */

import { expect } from 'chai';
import { inspect } from 'util';

import { JsonPointer, PathSegment } from '..';

const rand = (min: number, max: number): number =>
  Math.random() * (max - min) + min;

describe('JsonPointer', () => {
  const data0 = {
    has: 'data',
    arr: ['data', { nested: 'object with data' }, null],
    nested: { even: { further: 'hello' } },
  };
  type TestArr0 = [string, unknown];
  // list paths in order so the .set method can work in reverse order
  const tests0: TestArr0[] = [
    ['', data0],
    ['/has', data0.has],
    ['/arr', data0.arr],
    ['/arr/0', data0.arr[0]],
    ['/arr/1', data0.arr[1]],
    ['/arr/1/nested', (data0.arr[1] as Record<string, unknown>).nested],
    ['/arr/2', data0.arr[2]],
    ['/nested', data0.nested],
    ['/nested/even', data0.nested.even],
    ['/nested/even/further', data0.nested.even.further],
    ['/hasnot', undefined],
  ];

  const data1 = {
    foo: 'bar',
    baz: [
      'qux',
      'quux',
      {
        garply: { waldo: ['fred', 'plugh'] },
      },
    ],
  };

  const tests1: TestArr0[] = [
    ['', data1],
    ['/foo', data1.foo],
    ['/baz', data1.baz],
    ['/baz/0', data1.baz[0]],
    ['/baz/1', data1.baz[1]],
    ['/baz/2', data1.baz[2]],
    ['/baz/2/garply', (data1.baz[2] as { garply: unknown }).garply],
    [
      '/baz/2/garply/waldo',
      ((data1.baz[2] as { garply: unknown }).garply as { waldo: string[] })
        .waldo,
    ],
    [
      '/baz/2/garply/waldo/0',
      ((data1.baz[2] as { garply: unknown }).garply as { waldo: string[] })
        .waldo[0],
    ],
    [
      '/baz/2/garply/waldo/1',
      ((data1.baz[2] as { garply: unknown }).garply as { waldo: string[] })
        .waldo[1],
    ],
  ];
  const tests1f: TestArr0[] = [
    ['#', data1],
    ['#/foo', data1.foo],
    ['#/baz', data1.baz],
    ['#/baz/0', data1.baz[0]],
    ['#/baz/1', data1.baz[1]],
    ['#/baz/2', data1.baz[2]],
    ['#/baz/2/garply', (data1.baz[2] as { garply: unknown }).garply],
    [
      '#/baz/2/garply/waldo',
      ((data1.baz[2] as { garply: unknown }).garply as { waldo: string[] })
        .waldo,
    ],
    [
      '#/baz/2/garply/waldo/0',
      ((data1.baz[2] as { garply: unknown }).garply as { waldo: string[] })
        .waldo[0],
    ],
    [
      '#/baz/2/garply/waldo/1',
      ((data1.baz[2] as { garply: unknown }).garply as { waldo: string[] })
        .waldo[1],
    ],
  ];

  describe('static .create()', () => {
    it('throws on undefined', () => {
      expect(() => JsonPointer.create(undefined as unknown as string)).to.throw(
        'Invalid type: JSON Pointers are represented as strings.',
      );
    });

    it('succeeds when pointer is string', () => {
      expect(JsonPointer.create('')).to.be.a('object');
    });

    it('succeeds when pointer is PathSegment', () => {
      expect(JsonPointer.create([])).to.be.a('object');
    });
  });

  describe('.ctor()', () => {
    it('throws on undefined', () => {
      expect(() => new JsonPointer(undefined as unknown as string)).to.throw(
        'Invalid type: JSON Pointers are represented as strings.',
      );
    });

    it('succeeds when pointer is string', () => {
      expect(new JsonPointer('')).to.be.a('object');
    });

    it('succeeds when pointer is PathSegment', () => {
      expect(new JsonPointer([])).to.be.a('object');
    });
  });

  describe('static .has()', () => {
    for (const [p, expected] of tests0) {
      it(`static .has(data, '${p}') = ${expected !== undefined}`, () => {
        expect(JsonPointer.has(data0, p)).to.be.eql(expected !== undefined);
      });
      it(`static .has(data, '${JSON.stringify(JsonPointer.decode(p))}') = ${
        expected !== undefined
      }`, () => {
        expect(JsonPointer.has(data0, JsonPointer.decode(p))).to.be.eql(
          expected !== undefined,
        );
      });
      it(`static .has(data, p'${p}') = ${expected !== undefined}`, () => {
        expect(JsonPointer.has(data0, new JsonPointer(p))).to.be.eql(
          expected !== undefined,
        );
      });
    }
  });

  describe('.has()', () => {
    for (const [p, expected] of tests0) {
      it(`.has('${p}') = ${expected !== undefined}`, () => {
        const ptr = new JsonPointer(p);
        expect(ptr.has(data0)).to.be.eql(expected !== undefined);
      });
    }
  });

  describe('static .get()', () => {
    for (const [p, expected] of tests0) {
      it(`static .get(data, '${p}') = ${JSON.stringify(expected)}`, () => {
        expect(JsonPointer.get(data0, p)).to.be.eql(expected);
      });
      it(`static .get(data, '${JSON.stringify(
        JsonPointer.decode(p),
      )}') = ${JSON.stringify(expected)}`, () => {
        expect(JsonPointer.get(data0, JsonPointer.decode(p))).to.be.eql(
          expected,
        );
      });
      it(`static .get(data, p'${p}') = ${JSON.stringify(expected)}`, () => {
        expect(JsonPointer.get(data0, new JsonPointer(p))).to.be.eql(expected);
      });
    }
  });

  describe('static .set() unforced', () => {
    const dataCopy0 = JSON.parse(JSON.stringify(data0));
    const dataCopy1 = JSON.parse(JSON.stringify(data0));
    const dataCopy2 = JSON.parse(JSON.stringify(data0));
    for (const [p, expected] of tests0.reverse()) {
      const r = rand(1, 99999);
      it(`static .set(data, '${p}', ${r})`, () => {
        if (p === '') {
          expect(() => JsonPointer.set(dataCopy0, p, r)).to.throw(
            'Cannot set the root object; assign it directly.',
          );
          return;
        }
        JsonPointer.set(dataCopy0, p, r);
        if (expected === undefined) {
          expect(JsonPointer.get(dataCopy0, p)).to.be.eql(expected);
        } else {
          expect(JsonPointer.get(dataCopy0, p)).to.be.eql(r);
        }
      });
      it(`static .set(data, ${JSON.stringify(
        JsonPointer.decode(p),
      )}, ${r})`, () => {
        if (p.length === 0) {
          expect(() =>
            JsonPointer.set(dataCopy1, JsonPointer.decode(p), r),
          ).to.throw('Cannot set the root object; assign it directly.');
          return;
        }
        JsonPointer.set(dataCopy1, JsonPointer.decode(p), r);
        if (expected === undefined) {
          expect(JsonPointer.get(dataCopy1, JsonPointer.decode(p))).to.be.eql(
            expected,
          );
        } else {
          expect(JsonPointer.get(dataCopy1, JsonPointer.decode(p))).to.be.eql(
            r,
          );
        }
      });
      it(`static .set(data, p'${p}', ${r})`, () => {
        if (p === '') {
          expect(() =>
            JsonPointer.set(dataCopy2, new JsonPointer(p), r),
          ).to.throw('Cannot set the root object; assign it directly.');
          return;
        }
        JsonPointer.set(dataCopy2, new JsonPointer(p), r);
        if (expected === undefined) {
          expect(JsonPointer.get(dataCopy2, p)).to.be.eql(expected);
        } else {
          expect(JsonPointer.get(dataCopy2, p)).to.be.eql(r);
        }
      });
    }

    it('throws on attempted prototype pollution', () => {
      const subject = { my: 'subject' };
      expect(() =>
        JsonPointer.set(
          subject,
          new JsonPointer('/__proto__/polluted'),
          "Yes! It's polluted",
        ),
      ).to.throw('Attempted prototype pollution disallowed.');
    });
  });

  describe('static .unset()', () => {
    const dataCopy0 = JSON.parse(JSON.stringify(data0));
    const dataCopy1 = JSON.parse(JSON.stringify(data0));
    const dataCopy2 = JSON.parse(JSON.stringify(data0));
    for (const [p] of tests0.reverse()) {
      it(`static .unset(data, '${p}')`, () => {
        if (p === '') {
          expect(() => JsonPointer.unset(dataCopy0, p)).to.throw(
            'Cannot unset the root object; assign it directly.',
          );
          return;
        }
        // values are changing! get it so we know what to expect
        const updatedExpected = JsonPointer.get(dataCopy0, p);
        expect(JsonPointer.unset(dataCopy0, p)).to.be.eql(updatedExpected);
        expect(JsonPointer.get(dataCopy0, p)).to.be.undefined;
      });
      it(`static .unset(data, ${JSON.stringify(
        JsonPointer.decode(p),
      )})`, () => {
        if (p.length === 0) {
          expect(() =>
            JsonPointer.unset(dataCopy1, JsonPointer.decode(p)),
          ).to.throw('Cannot unset the root object; assign it directly.');
          return;
        }
        // values are changing! get it so we know what to expect
        const updatedExpected = JsonPointer.get(dataCopy1, p);
        expect(JsonPointer.unset(dataCopy1, JsonPointer.decode(p))).to.be.eql(
          updatedExpected,
        );
        expect(JsonPointer.get(dataCopy1, JsonPointer.decode(p))).to.be
          .undefined;
      });
      it(`static .unset(data, p'${p}')`, () => {
        if (p === '') {
          expect(() =>
            JsonPointer.unset(dataCopy2, new JsonPointer(p)),
          ).to.throw('Cannot unset the root object; assign it directly.');
          return;
        }
        // values are changing! get it so we know what to expect
        const updatedExpected = JsonPointer.get(dataCopy2, p);
        expect(JsonPointer.unset(dataCopy2, new JsonPointer(p))).to.be.eql(
          updatedExpected,
        );
        expect(JsonPointer.get(dataCopy2, p)).to.be.undefined;
      });
    }
  });

  describe('static .visit()', () => {
    it(`static .visit(data)`, () => {
      const sequence: PathSegment[] = [];
      JsonPointer.visit(data1, (p, v) => {
        const path = JsonPointer.decode(p);
        if (path.length) {
          sequence.push(path[path.length - 1]);
          if (typeof v === 'string') {
            sequence.push(v);
          }
        }
      });
      expect(sequence).to.eql([
        'foo',
        'bar',
        'baz',
        '0',
        'qux',
        '1',
        'quux',
        '2',
        'garply',
        'waldo',
        '0',
        'fred',
        '1',
        'plugh',
      ]);
    });

    it(`static .visit(data) fragments`, () => {
      const sequence: PathSegment[] = [];
      JsonPointer.visit(
        data1,
        (p, v) => {
          const path = JsonPointer.decode(p);
          if (path.length) {
            sequence.push(path[path.length - 1]);
            if (typeof v === 'string') {
              sequence.push(v);
            }
          }
        },
        true,
      );
      expect(sequence).to.eql([
        'foo',
        'bar',
        'baz',
        '0',
        'qux',
        '1',
        'quux',
        '2',
        'garply',
        'waldo',
        '0',
        'fred',
        '1',
        'plugh',
      ]);
    });

    const obj = { my: { obj: 'with nested data' } };
    const objWithReferences: Record<string, unknown> = {
      your: { obj: { refers_to: obj } },
      my: obj,
    };
    objWithReferences.self = {
      nested: [objWithReferences, obj],
    };

    it('handles references', () => {
      const pointers: Record<string, unknown> = {};
      JsonPointer.visit(objWithReferences, (p, v) => {
        pointers[p] = v;
      });
      console.log(inspect(pointers, false, 9));
    });
  });

  describe('static .flatten()', () => {
    const data = {
      foo: 'bar',
      baz: [
        'qux',
        'quux',
        {
          garply: { waldo: ['fred', 'plugh'] },
        },
      ],
    };

    const obj = JsonPointer.flatten(data);
    const objf = JsonPointer.flatten(data, true);

    it('obj to # of items', () => {
      expect(Object.keys(obj).length).to.eql(tests1.length);
    });

    for (const [p, expected] of tests1) {
      it(`obj['${p}'] === ${JSON.stringify(expected)}`, () => {
        expect(obj[p]).to.eql(expected);
      });
    }
    for (const [p, expected] of tests1f) {
      it(`obj['${p}'] === ${JSON.stringify(expected)}`, () => {
        expect(objf[p]).to.eql(expected);
      });
    }
  });

  describe('static .map()', () => {
    const data = {
      foo: 'bar',
      baz: [
        'qux',
        'quux',
        {
          garply: { waldo: ['fred', 'plugh'] },
        },
      ],
    };

    const map = JsonPointer.map(data);
    const mapf = JsonPointer.map(data, true);

    it('map to # of items', () => {
      expect(Array.from(map.keys()).length).to.eql(tests1.length);
    });

    for (const [p, expected] of tests1) {
      it(`map.get('${p}') === ${JSON.stringify(expected)}`, () => {
        expect(map.get(p)).to.eql(expected);
      });
    }
    for (const [p, expected] of tests1f) {
      it(`map.get('${p}') === ${JSON.stringify(expected)}`, () => {
        expect(mapf.get(p)).to.eql(expected);
      });
    }
  });

  describe('static .decode()', () => {
    type Test = [string, string[]];
    const tests: Test[] = [
      ['', []],
      ['/foo', ['foo']],
      ['/foo/0', ['foo', '0']],
      ['/', ['']],
      ['/a~1b', ['a/b']],
      ['/c%d', ['c%d']],
      ['/e^f', ['e^f']],
      ['/g|h', ['g|h']],
      ['/i\\j', ['i\\j']],
      ['/k"l', ['k"l']],
      ['/ ', [' ']],
      ['/m~0n', ['m~n']],
      ['/foo/bar/baz', ['foo', 'bar', 'baz']],
      ['#/foo/bar/baz', ['foo', 'bar', 'baz']],
    ];

    for (const [p, expected] of tests) {
      it(`.decode('${p}') = ${JSON.stringify(expected)}`, () => {
        expect(JsonPointer.decode(p)).to.be.eql(expected);
      });
    }
  });

  describe('.pointer property', () => {
    it('encodes pointer', () => {
      const p = new JsonPointer('/foo');
      expect(p.pointer).to.eql('/foo');
      expect(p.pointer).to.eql(p.pointer);
    });

    it('encodes fragment', () => {
      const p = new JsonPointer('#/foo');
      expect(p.pointer).to.eql('/foo');
      expect(p.pointer).to.eql(p.pointer);
      expect(p.uriFragmentIdentifier).to.eql('#/foo');
    });
  });

  describe('.relative method', () => {
    const doc = {
      foo: ['bar', 'baz'],
      highly: {
        nested: {
          objects: true,
        },
      },
    };

    it('throws when relative pointer unspecified', () => {
      const p = new JsonPointer('/highly/nested/objects');
      expect(() => p.rel(doc, undefined as unknown as string)).to.throw(
        'Invalid type: Relative JSON Pointers are represented as strings.',
      );
    });
    it('throws when relative pointer empty', () => {
      const p = new JsonPointer('/highly/nested/objects');
      expect(() => p.rel(doc, '')).to.throw(
        'Invalid Relative JSON Pointer syntax. Relative pointer must begin with a non-negative integer, followed by either the number sign (#), or a JSON Pointer.',
      );
    });
    it('throws when relative pointer invalid [0](NaN)', () => {
      const p = new JsonPointer('/highly/nested/objects');
      expect(() => p.rel(doc, 'b/z')).to.throw(
        'Invalid Relative JSON Pointer syntax. Relative pointer must begin with a non-negative integer, followed by either the number sign (#), or a JSON Pointer.',
      );
    });
    it('throws when relative pointer invalid 1#/z', () => {
      const p = new JsonPointer('/highly/nested/objects');
      expect(() => p.rel(doc, '1#/z')).to.throw(
        'Invalid Relative JSON Pointer syntax. Relative pointer must begin with a non-negative integer, followed by either the number sign (#), or a JSON Pointer.',
      );
    });
    it('Spec examples 1', () => {
      const p = new JsonPointer('/foo/1');
      expect(p.rel(doc, '0')).to.eql('baz');
      expect(p.rel(doc, '1/0')).to.eql('bar');
      expect(p.rel(doc, '2/highly/nested/objects')).to.eql(true);
      expect(p.rel(doc, '0#')).to.eql(1);
      expect(p.rel(doc, '1#')).to.eql('foo');
    });
    it('Spec examples 2', () => {
      const p = new JsonPointer('/highly/nested');
      expect(p.rel(doc, '0/objects')).to.eql(true);
      expect(p.rel(doc, '1/nested/objects')).to.eql(true);
      expect(p.rel(doc, '2/foo/0')).to.eql('bar');
      expect(p.rel(doc, '0#')).to.eql('nested');
      expect(p.rel(doc, '1#')).to.eql('highly');
    });
    it('returns undefined when relative location cannot exist', () => {
      const p = new JsonPointer('/highly/nested/objects');
      expect(p.rel(doc, '5/not-here')).to.be.undefined;
    });
  });

  describe('.rel method', () => {
    const doc = {
      foo: ['bar', 'baz'],
      highly: {
        nested: {
          objects: true,
        },
      },
    };

    it('throws when relative pointer unspecified', () => {
      const p = new JsonPointer('/highly/nested/objects');
      expect(() => p.relative(undefined as unknown as string)).to.throw(
        'Invalid type: Relative JSON Pointers are represented as strings.',
      );
    });
    it('throws when relative pointer empty', () => {
      const p = new JsonPointer('/highly/nested/objects');
      expect(() => p.relative('')).to.throw(
        'Invalid Relative JSON Pointer syntax. Relative pointer must begin with a non-negative integer, followed by either the number sign (#), or a JSON Pointer.',
      );
    });
    it('throws when relative pointer invalid [0](NaN)', () => {
      const p = new JsonPointer('/highly/nested/objects');
      expect(() => p.relative('b/z')).to.throw(
        'Invalid Relative JSON Pointer syntax. Relative pointer must begin with a non-negative integer, followed by either the number sign (#), or a JSON Pointer.',
      );
    });
    it('throws when relative pointer invalid 1#/z', () => {
      const p = new JsonPointer('/highly/nested/objects');
      expect(() => p.relative('1#/z')).to.throw(
        'Invalid Relative JSON Pointer syntax. Relative pointer must begin with a non-negative integer, followed by either the number sign (#), or a JSON Pointer.',
      );
    });
    it('throws when relative pointer to name (#)', () => {
      const p = new JsonPointer('/highly/nested/objects');
      expect(() => p.relative('1#')).to.throw(
        "We won't compile a pointer that will always return 'nested'. Use JsonPointer.rel(target, ptr) instead.",
      );
    });
    it('throws when relative location cannot exist', () => {
      const p = new JsonPointer('/highly/nested/objects');
      expect(() => p.relative('5/not-here')).to.throw(
        'Relative location does not exist.',
      );
    });

    it('Spec example from 1', () => {
      const p = new JsonPointer('/foo/1');
      const q = p.relative('2/highly/nested/objects');
      expect(q.get(doc)).to.eql(true);
    });
    it('Spec example from 2', () => {
      const p = new JsonPointer('/highly/nested');
      const q = p.relative('2/foo/0');
      expect(q.get(doc)).to.eql('bar');
    });
  });
});
