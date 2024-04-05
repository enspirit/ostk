import { Type } from "finitio"
import { transform } from "./transform"
import { FinitioDresser, Mapping, Ok, RenamerTransformer, Result, Success, TransformerInput, TransformerOutput } from "../../transformers"
import { wrap } from "./wrap"
import { duplex } from "./duplex"
import { Transform } from "stream"
import { DuplexObjectStream } from "../types"

export const group = <I>(grouping: Array<keyof I>): DuplexObjectStream<I, Array<I>> => {

  // We only group the successes
  let items: Array<I> = [];

  const matches = (item: I): boolean => {
    return grouping.every((key) => {
      return item[key] === items[0][key];
    })
  }

  return duplex(
    new Transform({
      objectMode: true,
      final(cb) {
        this.push(Ok(items));
        cb(null)
      },
      async transform(res: Result<I>, enc, cb) {

        if (!res.success) {
          this.push(res);
          return cb(null);
        }

        const item = (res as Success<I>).result;

        if (!items.length || matches(item)) {
          items.push(item);
          return cb(null);
        }

        this.push(Ok([...items]));
        items = [item];

        cb(null)
      }
    }
  ))
}
