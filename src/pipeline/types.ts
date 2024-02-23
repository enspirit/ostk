import { Duplex, Readable, Writable } from "stream"

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
