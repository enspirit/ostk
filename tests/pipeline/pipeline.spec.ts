import { describe, expect, test, beforeEach, vi } from 'vitest'
import { transform } from '../../src'
import { readable, pipeline, streamOf } from '../../src/pipeline'
import { Readable, Stream, Writable } from 'stream'
import { Sink, useSink } from './helpers'

describe('pipeline()', () => {
  test('when given non object based stream', () => {
    expect(() => pipeline(readable(new Readable))).to.throw(/Non object stream/)
  })

  let pp: Stream;
  let sink: Sink<number>
  beforeEach(() => {
    pp = pipeline(
      streamOf(1, 2, 3, 4),
      transform(async (input: number) => input.toString())
    )
    sink = useSink<number>();
  })

  test('give us a shortcut for creating object stream pipelines', async () => {
    expect(pp).to.be.an.instanceof(Stream)
  })

  test('the pipeline works', async () => {
    pp.pipe(sink.stream);
    await sink.wait();

    expect(sink.items).to.have.length(4)
  })
})
