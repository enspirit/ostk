import { createTransformer } from "../../src/transformers";
import { describe, expect, test, beforeEach, vi } from 'vitest'
import { Err, Failure, Ok, Result, Success } from "../../src/types";
import { Readable, Transform, Writable } from "stream";
import { waitForEnd } from "../helpers";

describe('createTransformer()', () => {

  let
    start: Readable,
    uppercase: Transform,
    lowercase: Transform,
    failing: Transform,
    end: Writable,
    dripped: Array<Result<any>>

  beforeEach(() => {
    start = new Readable({
      objectMode: true,
    });
    uppercase = createTransformer<string, string>(async (input: string) => {
      return input.toUpperCase();
    })
    lowercase = createTransformer<string, string>(async (input: string) => {
      return input.toLowerCase();
    })
    failing = createTransformer(async (input: string) => {
      return Err('could not do it')
    })
    end = new Writable({
      objectMode: true,
      write(obj, enc, cb) {
        dripped.push(obj);
        cb();
      }
    })

    dripped = [];
  })

  test('it returns Transform instances', () => {
    const transformer = createTransformer<string, string>(async (input: string) => {
      return input.toUpperCase();
    })

    expect(transformer).to.be.an.instanceof(Transform)
  })

  describe('the returned Transform instances', () => {

    test('process things properly', async () => {
      start
        .pipe(lowercase)
        .pipe(uppercase)
        .pipe(end);

      start.push(Ok('Foo'));
      start.push(Ok('Bar'));
      start.push(null);

      await waitForEnd(end);

      expect(dripped).to.have.length(2);
      expect(dripped[0]).to.be.an.instanceof(Success)
      expect(dripped[0] as Success<string>).to.have.property('result', 'FOO')

      expect(dripped[1]).to.be.an.instanceof(Success)
      expect(dripped[1] as Success<string>).to.have.property('result', 'BAR')
    })

    test('let errors flow down', async () => {
      start
        .pipe(failing)
        .pipe(lowercase)
        .pipe(uppercase)
        .pipe(end);

      start.push(Ok('foo'));
      start.push(null);

      await waitForEnd(start);

      expect(dripped).to.have.length(1);

      expect(dripped[0]).to.be.an.instanceof(Failure)
    })

  })

})
