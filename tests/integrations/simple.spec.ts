import { describe, expect, test, beforeEach, vi } from 'vitest'
import { transform, streamOf, ReadableObjectStream, DuplexObjectStream, WritableObjectStream } from '../../src/pipeline'
import { Sink, useSink } from '../pipeline/helpers'

describe('a simple pipeline', () => {

  let sink: Sink<string>
  beforeEach(() => {
    sink = useSink()
  })

  test('works', async () => {
    const source: ReadableObjectStream<number> = streamOf(1, 2, 3, 4);
    const toStr: DuplexObjectStream<number, string> = transform(async (input: number) => input.toString());
    const toUpCase: DuplexObjectStream<string, string> = transform(async (i: string) => i.toUpperCase() );

    const one: DuplexObjectStream<number, string> = source.pipe(toStr);
    const two: DuplexObjectStream<string, string> = one.pipe(toUpCase)
    const three: WritableObjectStream<string> = two.pipe(sink.stream)

    await sink.wait();

    expect(sink.items).toHaveLength(4);
  })

});
