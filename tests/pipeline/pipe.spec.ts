import { describe, expect, test, beforeEach, vi } from 'vitest'
import { Transformer } from '../../src'
import { readable, transform, pipeline, pipe, streamOf, ReadableObjectStream, DuplexObjectStream } from '../../src/pipeline'
import { Readable, Stream, Writable } from 'stream'
import { Sink } from './helpers'

describe('pipe()', () => {

  let sink: Sink<number>
  beforeEach(() => {

  })

  test('works when piping a source to a transformer', () => {
    const source = streamOf(1, 2, 3, 4);
    const destination = transform(async (input: number) => input.toString())

    expect(pipe(source, destination)).to.be.instanceof(Stream);
  })

  describe('its typing', () => {

    test('finds wrong input/output combinations', () => {
      const source = streamOf(1, 2, 3, 4);
      const destination = transform(async (input: string) => input.toString())

      // @ts-expect-error incompatible input/output
      pipe(source, destination)
    })

    test('returns the proper resulting stream type', () => {
      const source = streamOf(1, 2, 3, 4);
      const destination = transform(async (input: number) => input.toString())
      const stream: DuplexObjectStream<string> = pipe(source, destination);
    })

  })

})
