import { Type } from "finitio"
import { transform } from "./transform"
import { FinitioDresser, Mapping, Ok, RenamerTransformer, Result, Success, TransformerInput, TransformerOutput } from "../../transformers"
import { wrap } from "./wrap"
import { duplex } from "./duplex"
import { Transform } from "stream"
import { DuplexObjectStream } from "../types"

export const group = <
  T extends Record<PropertyKey, any>,
  G extends Array<keyof T>>(
  grouping: G
): DuplexObjectStream<TransformerInput<T>, TransformerOutput<Array<T>>> => {

  // We only group the successes
  let items: Array<T> = [];

  const matches = (item: T): boolean => {
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
      async transform(res: Result<T>, enc, cb) {

        if (!res.success) {
          this.push(res);
          return cb(null);
        }

        const item = (res as Success<T>).result;

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
