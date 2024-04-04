import { Duplex, Readable, Writable } from "stream"

export type ResultingStream<T, I, O> =
  T extends WritableObjectStream<I>
    ? never
    : T extends DuplexObjectStream<I, infer O>
      ? ReadableObjectStream<O>
      : never;

export type ReadableObjectStream<T> = Omit<Readable, 'pipe'> & {
  _objectType: T

  pipe<O>(destination: DuplexObjectStream<T, O>): DuplexObjectStream<T, O>
  pipe(destination: WritableObjectStream<T>): WritableObjectStream<T>
}

export type WritableObjectStream<T> = Writable & {
  _objectType: T
}

export type DuplexObjectStream<I, O> = Omit<Duplex, 'pipe'> & {
  _inputObjectType: I
  _outputObjectType: O

  pipe<O2>(destination: DuplexObjectStream<O, O2>): DuplexObjectStream<O, O2>
  pipe(destination: WritableObjectStream<O>): WritableObjectStream<O>
}

export type PipeDestination<I> = WritableObjectStream<I> | DuplexObjectStream<I, unknown>
