import type { Transformer } from "./Transformer";

export class Success<T> {
  constructor(public result: T) {}

  get success() {
    return true;
  }

  unwrap(): T {
    return this.result;
  }
}

export class Failure<T> {
  constructor(public err: Error) {}

  get success() {
    return false;
  }

  unwrap(): T {
    throw new Error('Cannot unwrap a Failure')
  }
}

export type Result<T> = Success<T> | Failure<T>

export type SimpleLambda<I, O> = (input: I) => Promise<O>

export type TransformerInput<T> = T extends Transformer<infer I, unknown> ? I : never
export type TransformerOutput<T> = T extends Transformer<unknown, infer O> ? O : never

export const Err = <T>(err: string|Error|Failure<T>): Failure<T> => {
  if (err instanceof Failure) {
    return err;
  }

  if (err instanceof Error) {
    return new Failure(err);
  }

  return new Failure(new Error(err));
}

export const Ok = <T>(result: T|Success<T>): Success<T> => {
  if (result instanceof Success) {
    return result;
  }

  return new Success(result);
}
