export * from './transformers'

import * as XLSX from 'xlsx';
import { Readable, Transform, Writable } from 'stream';
import * as fs from 'fs';
import {
  readFile as xlsxReadFile,
  stream
} from "xlsx";
import { Ok, ReadableStream, Transformer, WritableStream } from './types';

XLSX.set_fs(fs);
XLSX.stream.set_readable(Readable);

export const readFile = (path: string) => {
  return xlsxReadFile(path)
}

export const readSheet = (path: string, sheetName: string) => {
  const wb = readFile(path);
  const sheet = wb.Sheets[sheetName];

  if (!sheet) {
    throw new Error(`Sheet not found: ${sheetName}`)
  }

  return stream.to_json(sheet).pipe(new Transform({
    objectMode: true,
    transform(obj, encoding, cb) {
      return cb(null, Ok(obj))
    }
  }));
}

export const builder = <I, O>(readable: ReadableStream<O>) => {

  const pipe = <I2 extends O, O2>(next: Transformer<I2, O2>|WritableStream<O2>) => {
    readable.pipe(next as Writable);
    if (next instanceof Transform) {
      return builder<I2, O2>(next as Transform)
    }
  }

  return {
    pipe
  }
}
