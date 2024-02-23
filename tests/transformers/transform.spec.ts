import { describe, expect, test, beforeEach, vi } from 'vitest'
import { Err, Ok, Success, Transformer, transform } from '../../src'

describe('transform()', () => {
  test('give us a shortcut for creating lambda based transformers', async () => {
    let t = transform(async (input: string) => input.toUpperCase());
    const input = Ok('foo bar');

    const output = await t.process(input);
    expect(output).toBeInstanceOf(Success);
    expect((output as Success<string>).result).toEqual('FOO BAR')
  })
})
