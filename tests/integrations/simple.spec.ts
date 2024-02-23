import { describe, expect, test, beforeEach, vi } from 'vitest'
import { Transformer } from '../../src'
import { readable, transform, pipe, streamOf, ReadableObjectStream, DuplexObjectStream } from '../../src/pipeline'
import { Readable, Stream, Writable } from 'stream'
import { Sink, useSink } from '../pipeline/helpers'

describe('a simple pipeline', () => {

  let sink: Sink<string>
  beforeEach(() => {
    sink = useSink()
  })

  test('works', async () => {
    const source = streamOf(1, 2, 3, 4);
    const toStr = transform(async (input: number) => input.toString());
    const toUpCase = transform(async (i: string) => i.toUpperCase() );

    const one = source.pipe(toStr);

    const two = one.pipe(toUpCase)

    const three = two.pipe(sink.stream)

    await sink.wait();

    expect(sink.items).toHaveLength(4);
  })

});
