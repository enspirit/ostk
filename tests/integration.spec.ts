import { beforeEach, describe, test, expect } from "vitest";
import { Dresser, Grouper, builder, createTransformer, readSheet } from '../src'
import { waitForEnd } from "./helpers";
import { join } from "path";
import { Success, Transformer } from "../src/types";
import { Writable } from "stream";
import { System } from './schema'

describe('Integration tests', () => {

  type Row = { id: number, name: string, country: string }

  let dresser: Transformer<any, Row>;
  let toUpperCase: Transformer<Row, Row>
  let grouper: Transformer<Row, Array<Row>>
  let dripped: Array<unknown>;
  let sink: Writable;

  beforeEach(() => {
    dripped = [];
    dresser = Dresser<Row>(System)
    grouper = Grouper('country');

    toUpperCase = createTransformer(async (input: Row): Promise<Row> => {
      return {
        ...input,
        name: input.name.toUpperCase()
      }
    })

    sink = new Writable({
      objectMode: true,
      write(obj: unknown, enc, cb) {
        dripped.push(obj);
        cb()
      }
    })
  });

  test('with a basic setup dressing and uppercasing', async () => {
    const stream = readSheet(join(__dirname, './fixtures/basic.xlsx'), 'Sheet1');

    builder(stream)
      .pipe(dresser)
      .pipe(toUpperCase)
      .pipe(sink)

    await waitForEnd(sink);

    expect(dripped).toHaveLength(4)
    expect(dripped[0]).to.be.an.instanceof(Success)
    expect((dripped[0] as Success<Row>).result).to.deep.equal(
      { id: 1, name: 'JOHN DOE', country: 'England', language: 'en' }
    )
    expect(dripped[1]).to.be.an.instanceof(Success)
    expect((dripped[1] as Success<Row>).result).to.deep.equal(
      { id: 2, name: 'JANE DOE', country: 'France', language: 'fr' }
    )
    expect(dripped[2]).to.be.an.instanceof(Success)
    expect((dripped[2] as Success<Row>).result).to.deep.equal(
      { id: 3, name: 'MARY DOE', country: 'France' }
    )
    expect(dripped[3]).to.be.an.instanceof(Success)
    expect((dripped[3] as Success<Row>).result).to.deep.equal(
      { id: 4, name: 'STEVEN DOE', country: 'Spain', language: 'es' }
    )
  })

  test.only('with a more advanced setup dressing, uppercasing and grouping', async () => {
    const stream = readSheet(join(__dirname, './fixtures/basic.xlsx'), 'Sheet1');

    builder(stream)
      .pipe(dresser)
      .pipe(toUpperCase)
      .pipe(grouper)
      .pipe(sink)

    await waitForEnd(sink);

    expect(dripped).toHaveLength(3)
    expect(dripped[0]).to.be.an.instanceof(Success)
    expect((dripped[0] as Success<Row>).result).to.deep.equal([
      { id: 1, name: 'JOHN DOE', country: 'England', language: 'en' }
    ]);
    expect(dripped[1]).to.be.an.instanceof(Success)
    expect((dripped[1] as Success<Row>).result).to.deep.equal([
      { id: 2, name: 'JANE DOE', country: 'France', language: 'fr' },
      { id: 3, name: 'MARY DOE', country: 'France' },
    ])
    expect(dripped[2]).to.be.an.instanceof(Success)
    expect((dripped[2] as Success<Row>).result).to.deep.equal([
      { id: 4, name: 'STEVEN DOE', country: 'Spain', language: 'es' },
    ])
  })
})
