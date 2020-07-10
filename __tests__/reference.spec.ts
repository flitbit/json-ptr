/**
 * @hidden
 * @packageDocumentation
 */


import { expect } from 'chai';

import { JsonReference, JsonPointer, } from '../src';

describe('JsonReference', () => {

  describe('.ctor()', () => {

    it('throws when pointer unspecified', () => {
      expect(() => new JsonReference(undefined))
        .to.throw('Invalid type: JSON Pointers are represented as strings.');
    });

    it('succeeds when pointer specified as string', () => {
      const ref = new JsonReference('');
      expect(ref.pointer().path).to.eql([]);
    });

    it('succeeds when pointer specified as PathSegments', () => {
      const ref = new JsonReference([]);
      expect(ref.pointer().path).to.eql([]);
    });

    it('succeeds when pointer specified as JsonPointer', () => {
      const ref = new JsonReference(new JsonPointer('/foo'));
      expect(ref.pointer().path).to.eql(['foo']);
    });

  });

  describe('static .isReference()', () => {

    it('returns false when reference unspecified', () => {
      expect(JsonReference.isReference(undefined)).to.be.false;
    });

    it('returns false when reference specified as null', () => {
      expect(JsonReference.isReference(null)).to.be.false;
    });

    it('returns false when reference specified is not a reference', () => {
      expect(JsonReference.isReference(new Date)).to.be.false;
    });

    it('returns true when reference specified', () => {
      expect(JsonReference.isReference(new JsonReference(''))).to.be.true;
    });

  });

  describe('.resolve()', () => {
    const data = { foo: { bar: "baz" } };

    it('resolves to referenced property', () => {
      const ref = new JsonReference('/foo/bar')
      expect(ref.resolve(data)).to.eql(data.foo.bar);
    });

    it('resolves to undefined when no such property', () => {
      const ref = new JsonReference('/foo/baz')
      expect(ref.resolve(data)).to.be.undefined;
    });

  });

  describe('.toString()', () => {

    it('is interpolated', () => {
      const ref = new JsonReference('/foo/bar')
      expect(`${ref}`).to.eql('#/foo/bar');
    });

    it('is coerced', () => {
      const ref = new JsonReference('/foo/bar')
      expect('' + ref).to.eql('#/foo/bar');
    });

  });

});

