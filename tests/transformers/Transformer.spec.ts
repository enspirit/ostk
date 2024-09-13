import { describe, expect, test, beforeEach, vi } from 'vitest'
import { Err, Ok, Success, Transformer } from '../../src'

describe('Transformer', () => {

  class ToUpperCaseTransformer extends Transformer<string, string> {
    async _process(item: string): Promise<string> {
      return item.toUpperCase();
    }
  }

  describe('process', () => {
    test('passes Failures without touching them', () => {
      let t = new ToUpperCaseTransformer();
      const err = Err('oops', 'input');
      expect(t.process(err)).resolves.toEqual(err)
    })

    test('process inputs properly', async () => {
      let t = new ToUpperCaseTransformer();
      const input = Ok('foo bar');

      const output = await t.process(input);
      expect(output).toBeInstanceOf(Success);
      expect((output as Success<string>).result).toEqual('FOO BAR')
    })
  })
})
