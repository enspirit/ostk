import { Err, Failure, Ok, Result } from "./types";

export abstract class Transformer<Input, Output> {

  async process(item: Result<Input>): Promise<Result<Output>|Failure<any>> {
    if (item instanceof Failure) {
      return item;
    }

    try {
      return Ok(await this._process(item.result));
    } catch (err) {
      return Err(err as Error, item.result)
    }
  }

  abstract _process(item: Input): Promise<Output>;

}
