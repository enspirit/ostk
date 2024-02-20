import { Readable, Transform, TransformCallback } from "stream"
import { createTransformer } from "./transformers"

export class Success<T> {
  success = true
  constructor(public result: T) {}
}

export class Failure<T> {
  success = false
  constructor(public error: string) {}
}

export type Result<T> = Success<T>|Failure<T>
export type Processor<Input, Output> = (input: Input) => Promise<Output>
export interface Transformer<Input, Output> extends Transform {
  _transform(obj: Result<Input>, encoding: BufferEncoding, cb: TransformCallback): void
}

export const Ok = <T>(result: T): Result<T> => new Success<T>(result)
export const Err = <T>(err: string): Result<T> => new Failure<T>(err)

export type InputType<P> = P extends Processor<infer I, unknown> ? I : unknown
export type OutputType<P, X = any> = P extends Processor<X, infer O> ? O : unknown

export type Piper = <
  P1 extends Processor<I, O>,
  P2 extends Processor<O, E>,
  I = InputType<P1>,
  O = OutputType<P1>,
  E = OutputType<P2>,
>(p1: P1, p2: P2) => OutputType<P2>
