import { describe, expect, test, beforeEach } from 'vitest'
import { transform, pipe, streamOf } from '../../src/pipeline'
import { Stream } from 'stream'
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

      const t = pipe(source, destination);
      const stream: DuplexObjectStream<number, string> = pipe(source, destination);
    })

  })

})
