import '../helpers'
import { describe, expect, test, beforeEach, vi } from 'vitest'
import { Sink, useSink } from '../pipeline/helpers'
import { dress, streamOf, transform } from '../../src';
import { ReadableObjectStream, DuplexObjectStream, WritableObjectStream } from '../../src/pipeline/types';
import type { Row } from '../fixtures/schema';
import System from '../fixtures/schema';

describe('a pipeline using finitio\'s dresser', () => {

  let sink: Sink<Row>
  beforeEach(() => {
    sink = useSink()
  })

  test('works', async () => {
    const source: ReadableObjectStream<unknown> = streamOf(
      { id: 42, name: 'foo', country: 'es', language: 'es' },
      { id: 43, name: 'bar', country: 'uk' },
      { wrong: 'type' }
    );

    const dresser = dress<Row>(System().Main!);

    const res = source
      .pipe(dresser)
      .pipe(sink.stream);

    await sink.wait();

    expect(sink.items).toHaveLength(3);

    expect(sink.items[0]).toBeSuccess()
    expect(sink.items[1]).toBeSuccess()
    expect(sink.items[2]).toBeFailure(err => expect(err).to.match(/Invalid Row/))
  })

});
