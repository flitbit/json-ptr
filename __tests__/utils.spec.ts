/**
 * @hidden
 * @packageDocumentation
 */

import { expect } from 'chai';

import {
  encodeFragmentSegments,
  decodeFragmentSegments,
  encodePointerSegments,
  decodePointerSegments,
  PathSegments,
  encodePointer,
  decodeUriFragmentIdentifier,
  encodeUriFragmentIdentifier,
  toArrayIndexReference,
  setValueAtPath,
  unsetValueAtPath,
  decodePointer,
} from '../src';

describe('Utils', () => {

  type Tests = [PathSegments, PathSegments, string];
  const fragments: Tests[] = [
    [[], [], '#'],
    [[''], [''], '#/'],
    [['foo bar'], ['foo%20bar'], "#/foo%20bar"],
    [['foo bar', 0], ['foo%20bar', 0], '#/foo%20bar/0'],
  ];
  const pointers: Tests[] = [
    [[], [], ''],
    [[''], [''], '/'],
    [['foo bar'], ['foo bar'], '/foo bar'],
    [['foo bar', 0], ['foo bar', 0], '/foo bar/0'],
  ];


  describe('encodeFragmentSegments()', () => {
    for (const [decoded, encoded] of fragments) {
      it(`${JSON.stringify(decoded)} encodes to ${JSON.stringify(encoded)}`, () => {
        expect(encodeFragmentSegments(decoded)).to.eql(encoded);
      });
    }
  });

  describe('decodeFragmentSegments()', () => {
    for (const [decoded, encoded] of fragments) {
      it(`${JSON.stringify(encoded)} encodes to ${JSON.stringify(decoded)}`, () => {
        expect(decodeFragmentSegments(encoded)).to.eql(decoded);
      });
    }
  });

  describe('encodePointerSegments()', () => {
    for (const [decoded, encoded] of pointers) {
      it(`${JSON.stringify(decoded)} encodes to ${JSON.stringify(encoded)}`, () => {
        expect(encodePointerSegments(decoded)).to.eql(encoded);
      });
    }
  });

  describe('decodePointerSegments()', () => {
    for (const [decoded, encoded] of pointers) {
      it(`${JSON.stringify(encoded)} encodes to ${JSON.stringify(decoded)}`, () => {
        expect(decodePointerSegments(encoded)).to.eql(decoded);
      });
    }
  });

  describe('encodePointer()', () => {
    it('throws when segments unspecified', () => {
      expect(() => encodePointer(undefined)).to.throw('Invalid type: path must be an array of segments.');
    });
    it('throws when segments specified wrong type', () => {
      expect(() => encodePointer({} as unknown as PathSegments)).to.throw('Invalid type: path must be an array of segments.');
    });
    for (const [, encoded, p] of pointers) {
      it(`${JSON.stringify(encoded)} = '${p}'`, () => {
        expect(encodePointer(encoded)).to.eql(p);
      });
    }
  });

  describe('encodeUriFragmentIdentifier()', () => {
    it('throws when segments unspecified', () => {
      expect(() => encodeUriFragmentIdentifier(undefined)).to.throw('Invalid type: path must be an array of segments.');
    });
    it('throws when segments specified wrong type', () => {
      expect(() => encodeUriFragmentIdentifier({} as unknown as PathSegments)).to.throw('Invalid type: path must be an array of segments.');
    });
    for (const [decoded, , p] of fragments) {
      it(`${JSON.stringify(decoded)} = '${p}'`, () => {
        expect(encodeUriFragmentIdentifier(decoded)).to.eql(p);
      });
    }
  });


  describe('decodeUriFragmentIdentifier()', () => {
    it('throws when ptr unspecified', () => {
      expect(() => decodeUriFragmentIdentifier(undefined)).to.throw('Invalid type: JSON Pointers are represented as strings.');
    });
    it('throws when ptr specified wrong type', () => {
      expect(() => decodeUriFragmentIdentifier({} as unknown as string)).to.throw('Invalid type: JSON Pointers are represented as strings.');
    });
    it('throws when invalid ptr specified', () => {
      expect(() => decodeUriFragmentIdentifier('')).to.throw('Invalid JSON Pointer syntax; URI fragment identifiers must begin with a hash.');
    });
    for (const [decoded, , p] of fragments) {
      const d = decoded.map(v => v + '');
      it(`'${p}' === ${JSON.stringify(d)}`, () => {
        expect(decodeUriFragmentIdentifier(p)).to.eql(d);
      });
    }
  });


  describe('toArrayIndexReference()', () => {
    it('returns idx when specified as number', () => {
      expect(toArrayIndexReference([], 1000)).to.eql(1000);
    });
    it('returns 0 when array falsy and idx === \'-\'', () => {
      expect(toArrayIndexReference(undefined, '-')).to.eql(0);
    });
    it('returns length when idx === \'-\'', () => {
      expect(toArrayIndexReference(['one'], '-')).to.eql(1);
    });
    it('returns -1 when idx NAN', () => {
      expect(toArrayIndexReference([], 'NaN')).to.eql(-1);
    });
    it('returns -1 when idx empty', () => {
      expect(toArrayIndexReference([], '')).to.eql(-1);
    });
    it('returns -1 when idx large numeric string but NaN', () => {
      expect(toArrayIndexReference([], '999s9')).to.eql(-1);
    });
  });


  describe('setValueAtPath()', () => {
    it('throws when target undefined', () => {
      expect(() => setValueAtPath(undefined, 0, ['foo'])).to.throw('Cannot set values on undefined');
    });
    const data = { one: ['two', { three: 'four' }] };
    it('does not set at end of array if not forced', () => {
      const expected = data.one.length;
      expect(setValueAtPath(data, 'VV', ['one', 2])).to.be.undefined;
      expect(data.one.length).to.eql(expected);
    });
    it('will set at end of array if forced', () => {
      expect(setValueAtPath(data, 'VV', ['one', 2], true)).to.be.undefined;
      expect(data.one[2]).to.eql('VV');
    });
    it('does not set beyond end of array if not forced', () => {
      const expected = data.one.length;
      expect(setValueAtPath(data, 'VV', ['one', 5])).to.be.undefined;
      expect(data.one.length).to.eql(expected);
    });
    it('will set beyond end of array if forced', () => {
      expect(setValueAtPath(data, 'VV', ['one', 5], true)).to.be.undefined;
      expect(data.one[5]).to.eql('VV');
    });
  });

  describe('unsetValueAtPath()', () => {
    it('throws when target undefined', () => {
      expect(() => unsetValueAtPath(undefined, ['foo'])).to.throw('Cannot unset values on undefined');
    });
    const data = { a: ['one', { two: 'three' }, 'four', { five: { six: 'seven' } }] };
    it('can unset array elements', () => {
      const expected = data.a[0];
      expect(unsetValueAtPath(data, decodePointer('/a/0'))).to.eql(expected);
      expect(data.a[0]).to.be.undefined;
    });
    it('returns undefined if reference beyond array length', () => {
      expect(unsetValueAtPath(data, decodePointer('/a/7'))).to.undefined;
    });
    it('succeeds when path through array', () => {
      const expected = (data.a[3] as Record<string, unknown>).six;
      expect(unsetValueAtPath(data, decodePointer('/a/3/six'))).to.eql(expected);
    });
  });

});

