export * from './utils'

import { Duplex, Readable, Stream, Transform, Writable } from "stream";
import { Transformer } from "../transformers";

export type ReadableObjectStream<T> = Readable & {
  _objectType: T
}

export type WritableObjectStream<T> = Writable & {
  _objectType: T
}

export type DuplexObjectStream<T> = Duplex & {
  _objectType: T
}

export const readable = <T>(stream: Readable): ReadableObjectStream<T> => {
  if (!stream.readableObjectMode) {
    throw new Error(`Non object stream detected`);
  }

  return stream as ReadableObjectStream<T>
}

export const writable = <T>(stream: Writable): WritableObjectStream<T> => {
  if (!stream.writableObjectMode) {
    throw new Error(`Non object stream detected`);
  }

  return stream as WritableObjectStream<T>
}

export const duplex = <T>(stream: Duplex): DuplexObjectStream<T> => {
  if (!stream.writableObjectMode) {
    throw new Error(`Non object stream detected`);
  }

  return stream as DuplexObjectStream<T>
}

export const wrap = <T extends Transformer<unknown, unknown>>
(transformer: T): DuplexObjectStream<T> => {
  return duplex(
    new Transform({
      objectMode: true,
      async transform(item, enc, cb) {
        cb(null, await transformer.process(item));
      }
    }
  ))
}

type PipeDestination<I> = WritableObjectStream<I>
  | Transformer<I, unknown>

type ResultingStream<I, T extends PipeDestination<I>> =
  T extends WritableObjectStream<I> ? WritableObjectStream<I>
  : T extends Transformer<I, infer X> ? DuplexObjectStream<X>
  : never

export const pipe = <I, T extends PipeDestination<I>>(
  stream: ReadableObjectStream<I>,
  destination: T
): ResultingStream<I, T> => {
  if (destination instanceof Transformer) {
    return stream.pipe(wrap(destination)) as ResultingStream<I, T>;
  }

  return stream.pipe(destination) as ResultingStream<I, T>;
}

export const pipeline = (
  stream: ReadableObjectStream<any>,
  ...transformers: Array<Transformer<unknown, unknown>>
) => {
  return transformers.reduce((str: Stream, tra) => {
    return str.pipe(new Transform({
      objectMode: true,
      async transform(item, enc, cb) {
        cb(null, await tra.process(item));
      }
    }))
  }, stream)
}
