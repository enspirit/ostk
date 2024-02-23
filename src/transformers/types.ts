export class Success<T> {
  success = true;
  constructor(public result: T) {}
}

export class Failure<T> {
  success = false;
  constructor(public err: string) {}
}

export type Result<T> = Success<T> | Failure<T>

export type SimpleLambda = (input: any) => Promise<any>
export type FirstArg<T extends SimpleLambda> = Parameters<T>[0]

export const Err = <T>(err: string|Error|Failure<T>): Failure<T> => {
  if (err instanceof Failure) {
    return err;
  }

  if (err instanceof Error) {
    return Err(err.message);
  }

  return new Failure(err);
}

export const Ok = <T>(result: T|Success<T>): Success<T> => {
  if (result instanceof Success) {
    return result;
  }

  return new Success(result);
}
