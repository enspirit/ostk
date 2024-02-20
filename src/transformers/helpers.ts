import { Transform } from "stream";
import { Err, Failure, Ok, Processor, Result, Transformer } from "../types";

export const createTransformer = <I, O>(processor: Processor<I, O>): Transformer<I, O> => {
  return new Transform({
    objectMode: true,
    async transform(input: Result<I>, encoding, cb) {
      if (input instanceof Failure) {
        return cb(null, input);
      }

      try {
        const result = await processor(input.result);
        cb(null, Ok(result))
      } catch (err) {
        cb(null, Err((err as Error).message as string))
      }
    }
  }) as Transformer<I, O>
}
