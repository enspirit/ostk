export * from './utils'

import { Duplex, Readable, Stream, Transform, Writable } from "stream";
import { FirstArg, LambdaTransformer, SimpleLambda, Transformer, TransformerInput, TransformerOutput } from "../transformers";

export type ReadableObjectStream<T> = Omit<Readable, 'pipe'> & {
  _objectType: T

  pipe<D extends PipeDestination<T>>(destination: D): D
}

export type WritableObjectStream<T> = Writable & {
  _objectType: T
}

export type DuplexObjectStream<I, O> = Omit<Duplex, 'pipe'> & {
  _inputObjectType: I
  _outputObjectType: O

  pipe<D extends PipeDestination<O>>(destination: D): D
}

export type PipeDestination<I> = WritableObjectStream<I> | DuplexObjectStream<I, unknown>

export const transform = <T extends SimpleLambda>(lambda: T): DuplexObjectStream<FirstArg<T>, Awaited<ReturnType<T>>> => {
  return wrap(new LambdaTransformer<FirstArg<T>, Awaited<ReturnType<T>>>(lambda))
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

export const duplex = <I, O>(stream: Duplex): DuplexObjectStream<I, O> => {
  if (!stream.writableObjectMode) {
    throw new Error(`Non object stream detected`);
  }

  return stream as DuplexObjectStream<I, O>
}

export const wrap = <T extends Transformer<unknown, unknown>>
(transformer: T): DuplexObjectStream<TransformerInput<T>, TransformerOutput<T>> => {
  return duplex(
    new Transform({
      objectMode: true,
      async transform(item, enc, cb) {
        cb(null, await transformer.process(item));
      }
    }
  ))
}


export const pipe = <I, T extends PipeDestination<I>>(
  stream: ReadableObjectStream<I>,
  destination: T
): T => {
  if (destination instanceof Transformer) {
    return stream.pipe(
      // @ts-ignore
      wrap(destination)
    ) as T
  }

  return stream.pipe(destination) as T;
}

