import { describe, expect, test, beforeEach, vi } from 'vitest'
import { Err, Ok, Success, RenamerTransformer } from '../../src'

describe('RenamerTransformer', () => {

  describe('process', () => {
    test('passes Failures without touching them', () => {
      let t = new RenamerTransformer({});
      const err = Err('oops');
      expect(t.process(err)).resolves.toEqual(err)
    })

    test('does not return unmapped properties', async () => {
      // empty mapping
      const mapping = {};
      let t = new RenamerTransformer(mapping);
      const output = await t.process(Ok({
        foo: 'bar'
      }));
      expect(output).toBeInstanceOf(Success);
      const result = output.unwrap();
      expect(result).toEqual({
      })
    })

    test('does return mapped properties', async () => {
      const mapping = {
        renamed: 'foo'
      };
      type Input = { foo: string }
      let t = new RenamerTransformer(mapping);

      const output = await t.process(Ok({
        foo: 'bar'
      }));
      expect(output).toBeInstanceOf(Success);
      const result = output.unwrap();
      expect(result).toEqual({
        renamed: 'bar'
      })
    })
  })
})
