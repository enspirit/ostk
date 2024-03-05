import '../helpers'
import { describe, expect, test, beforeEach, vi } from 'vitest'
import { Sink, useSink } from '../pipeline/helpers'
import { rename, streamOf, transform } from '../../src';
import { ReadableObjectStream, DuplexObjectStream, WritableObjectStream } from '../../src/pipeline/types';

describe.only('an object based pipeline', () => {

  type Row = { id: number, name: string }
  type RenamedRow = {
    row_id: number,
    row_name: string,
    extra: number
  }

  let sink: Sink<RenamedRow>
  beforeEach(() => {
    sink = useSink()
  })

  test('works', async () => {
    const source: ReadableObjectStream<Row> = streamOf({
      id: 1,
      name: 'foo'
    }, {
      id: 2,
      name: 'bar'
    }, {
      id: 3,
      name: 'baz'
    });

    const prependHello: DuplexObjectStream<Row, Row> = transform(async (input: Row) => ({ ...input, name: `Hello ${input.name}`}));
    const toUpCase: DuplexObjectStream<Row, Row> = transform(async (input: Row) => ({ ...input, name: input.name.toUpperCase() }));
    const renamer: DuplexObjectStream<Row, RenamedRow> = rename({
      'row_id': 'id',
      'row_name': 'name',
      'extra': (row) => 42
    })

    const one: DuplexObjectStream<Row, Row> = source.pipe(prependHello);
    const two: DuplexObjectStream<Row, Row> = one.pipe(toUpCase)
    const three: DuplexObjectStream<Row, RenamedRow> = two.pipe(renamer)
    const four: WritableObjectStream<RenamedRow> = three.pipe(sink.stream)

    await sink.wait();

    expect(sink.items).toHaveLength(3);

    expect(sink.items[0]).to.toBeSuccess((result) => {
      expect(result).to.eql({
        row_id: 1,
        row_name: 'HELLO FOO',
        extra: 42
      })
    })
    expect(sink.items[1]).to.toBeSuccess((result) => {
      expect(result).to.eql({
        row_id: 2,
        row_name: 'HELLO BAR',
        extra: 42
      })
    })
    expect(sink.items[2]).to.toBeSuccess((result) => {
      expect(result).to.eql({
        row_id: 3,
        row_name: 'HELLO BAZ',
        extra: 42
      })
    })
  })

});
