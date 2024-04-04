import '../helpers'
import { describe, expect, test, beforeEach, vi } from 'vitest'
import { Sink, useSink } from '../pipeline/helpers'
import { dress, excel, streamOf, transform } from '../../src';
import { ReadableObjectStream, DuplexObjectStream, WritableObjectStream } from '../../src/pipeline/types';
import type { Row } from '../fixtures/schema';
import System from '../fixtures/schema';
import { RowDresser } from '../helpers';
import path from 'path';

describe('a pipeline using an excel sheet as a source', () => {

  let sink: Sink<Row>
  beforeEach(() => {
    sink = useSink()
  })

  test('works', async () => {
    const source: ReadableObjectStream<unknown> = excel(
      path.join(__dirname, '../fixtures/basic.xlsx'),
      'Sheet1',
    );

    const res = source
      .pipe(RowDresser)
      .pipe(sink.stream);

    await sink.wait();

    expect(sink.items).toHaveLength(5);

    expect(sink.items[0]).toBeSuccess()
    expect(sink.items[1]).toBeSuccess()
    expect(sink.items[2]).toBeFailure(err => expect(err).toMatch(/Invalid Row/))
    expect(sink.items[3]).toBeSuccess()
    expect(sink.items[4]).toBeSuccess()
  })

});
