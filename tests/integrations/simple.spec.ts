import '../helpers'
import { describe, expect, test, beforeEach, vi } from 'vitest'
import { Sink, useSink } from '../pipeline/helpers'
import { streamOf, transform } from '../../src';
import { ReadableObjectStream, DuplexObjectStream, WritableObjectStream } from '../../src/pipeline/types';

describe('a simple pipeline', () => {

  let sink: Sink<string>
  beforeEach(() => {
    sink = useSink()
  })

  test('works', async () => {
    const source: ReadableObjectStream<number> = streamOf(1, 2, 3, 4);
    const toStr: DuplexObjectStream<number, string> = transform(async (input: number) => input.toString());
    const prependHello: DuplexObjectStream<string, string> = transform(async (input: string) => `Hello ${input}`);
    const toUpCase: DuplexObjectStream<string, string> = transform(async (i: string) => i.toUpperCase() );

    const one: DuplexObjectStream<number, string> = source.pipe(toStr);
    const two: DuplexObjectStream<string, string> = one.pipe(prependHello)
    const three: DuplexObjectStream<string, string> = two.pipe(toUpCase)
    const four: WritableObjectStream<string> = three.pipe(sink.stream)

    await sink.wait();

    expect(sink.items).toHaveLength(4);

    expect(sink.items[0]).to.toBeSuccess((result) => {
      expect(result).to.eq('HELLO 1')
    })
    expect(sink.items[1]).to.toBeSuccess((result) => {
      expect(result).to.eq('HELLO 2')
    })
    expect(sink.items[2]).to.toBeSuccess((result) => {
      expect(result).to.eq('HELLO 3')
    })
    expect(sink.items[3]).to.toBeSuccess((result) => {
      expect(result).to.eq('HELLO 4')
    })
  })

});
