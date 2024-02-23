import { resolve } from 'path';
import { readSheet } from '../../src'
import { Readable, Transform, Writable } from 'stream';
import { describe, expect, test, beforeEach, vi } from 'vitest'
import { waitForEnd } from '../helpers';

const devNull = new Writable({
  objectMode: true,
  write(chunk, encoding, callback) {
    callback();
  }
})

describe('readSheet()', () => {

  test('throws when file not found', () => {
    const file = resolve(__dirname, '../fixtures/wrong.xlsx');
    expect(() => readSheet(file, 'Sheet1')).to.throw(/no such file/)
  })

  test('throws when sheet does not exist', () => {
    const file = resolve(__dirname, '../fixtures/basic.xlsx');
    expect(() => readSheet(file, 'invalid')).to.throw(/Sheet not found/)
  })

  test('returns a stream', () => {
    const file = resolve(__dirname, '../fixtures/basic.xlsx');
    expect(readSheet(file, 'Sheet1')).to.be.an.instanceof(Readable)
  })

  describe('the returned stream', () => {

    let stream: Readable;
    beforeEach(() => {
      const file = resolve(__dirname, '../fixtures/basic.xlsx');
      stream = readSheet(file, 'Sheet1');
    })

    test('can be consumed', async () => {
      const process = vi.fn().mockImplementation(() => {});
      const consumer = new Transform({
        objectMode: true,
        transform(object, encoding, callback) {
          process(object)
          callback(null, object);
        }
      })

      stream.pipe(consumer).pipe(devNull);

      await waitForEnd(stream);

      expect(process).toHaveBeenCalledTimes(4)
    });

    test('produces rows', async () => {
      const dripped: Array<unknown> = [];
      const consumer = new Transform({
        objectMode: true,
        transform(object, encoding, callback) {
          dripped.push(object);
          callback(null, object);
        }
      })

      stream.pipe(consumer).pipe(devNull);

      await waitForEnd(stream);

      expect(dripped[0]).to.include({
        id: 1,
        country: 'England',
        language: 'en',
        name: 'John Doe'
      })
    });
  })

})
