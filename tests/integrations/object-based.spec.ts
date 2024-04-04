import '../helpers'
import { describe, expect, test, beforeEach, vi } from 'vitest'
import { Sink, useSink } from '../pipeline/helpers'
import { group, rename, streamOf, transform } from '../../src';
import { ReadableObjectStream, DuplexObjectStream, WritableObjectStream } from '../../src/pipeline/types';

describe('an object based pipeline', () => {

  type Row = { id: number, name: string, group: number }
  type RenamedRow = {
    row_id: number,
    row_name: string,
    row_constant: number,
    row_group: number
  }

  let sink: Sink<Array<RenamedRow>>
  beforeEach(() => {
    sink = useSink()
  })

  test('works', async () => {
    const source: ReadableObjectStream<Row> = streamOf({
      id: 1,
      name: 'foo',
      group: 1
    }, {
      id: 2,
      name: 'bar',
      group: 1
    }, {
      id: 3,
      name: 'baz',
      group: 2
    });

    const prependHello: DuplexObjectStream<Row, Row> = transform(async (input: Row) => ({ ...input, name: `Hello ${input.name}`}));
    const toUpCase: DuplexObjectStream<Row, Row> = transform(async (input: Row) => ({ ...input, name: input.name.toUpperCase() }));
    const renamer: DuplexObjectStream<Row, RenamedRow> = rename({
      'row_id': 'id',
      'row_name': 'name',
      'row_group': 'group',
      'row_constant': (row) => 42
    })
    const grouper: DuplexObjectStream<RenamedRow, Array<RenamedRow>> = group(['row_group'])

    const one: DuplexObjectStream<Row, Row> = source.pipe(prependHello);
    const two: DuplexObjectStream<Row, Row> = one.pipe(toUpCase)
    const three: DuplexObjectStream<Row, RenamedRow> = two.pipe(renamer)
    const four: DuplexObjectStream<RenamedRow, Array<RenamedRow>> = three.pipe(grouper);
    const five: WritableObjectStream<Array<RenamedRow>> = four.pipe(sink.stream)

    await sink.wait();

    expect(sink.items).toHaveLength(2);

    expect(sink.items[0]).to.toBeSuccess((result) => {
      expect(result).to.eql([{
        row_id: 1,
        row_name: 'HELLO FOO',
        row_constant: 42,
        row_group: 1
      }, {
        row_id: 2,
        row_name: 'HELLO BAR',
        row_constant: 42,
        row_group: 1
      }])
    })

    expect(sink.items[1]).to.toBeSuccess((result) => {
      expect(result).to.eql([{
        row_id: 3,
        row_name: 'HELLO BAZ',
        row_constant: 42,
        row_group: 2
      }])
    })
  })

});
