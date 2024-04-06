import { Ok, Result, Success } from "../../transformers"
import { duplex } from "./duplex"
import { Duplex, Transform, Writable } from "stream"
import { DuplexObjectStream, PipeDestination, WritableObjectStream } from "../types"
import { transform } from "./transform"
import { wrap } from "./wrap"

export type SplitConfig<I> = {
  matcher: (input: I) => Promise<boolean>,
  pipeTo: PipeDestination<I>
}

export const split = <I>(splits: Record<PropertyKey, SplitConfig<I>>): DuplexObjectStream<I, I> => {
  return duplex(new Transform({
    objectMode: true,
    async transform(monad: Result<I>, encoding, cb) {
      if (!monad.success) {
        this.push(monad);
        return cb(null)
      }

      const input: I = monad.unwrap();
      for await (const split of Object.values(splits)) {
        if (await split.matcher(input)) {
          split.pipeTo.write(monad);
          return cb(null);
        }
      }

      this.push(monad);
      cb(null);
    }
  }))
}
