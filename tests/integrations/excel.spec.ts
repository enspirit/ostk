import '../helpers'
import { describe, expect, test, beforeEach } from 'vitest'
import { Sink, useSink } from '../pipeline/helpers'
import { excel } from '../../src';
import { ReadableObjectStream } from '../../src/pipeline/types';
import type { Row } from '../fixtures/schema';
import { RowDresser } from '../helpers';
import path from 'path';
import { readFile } from 'fs/promises';

describe('a pipeline using an excel sheet as a source', () => {

  test('using a file path', async () => {
    const source: ReadableObjectStream<unknown> = excel(
      path.join(__dirname, '../fixtures/basic.xlsx'),
      'Sheet1',
    );

    const sink: Sink<Row> = useSink()

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

  test('using an ArrayBuffer', async () => {
    const buffer = await readFile(path.join(__dirname, '../fixtures/basic.xlsx'));
    const blob = new Blob([buffer])

    const source: ReadableObjectStream<unknown> = excel(
      await blob.arrayBuffer(),
      'Sheet1',
    );

    const sink: Sink<Row> = useSink()

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
})
