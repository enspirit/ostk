import { Transform } from "stream";
import { Transformer, TransformerInput, TransformerOutput } from "../../transformers";
import { DuplexObjectStream } from "../types";
import { duplex } from "./duplex";

export const wrap = <T extends Transformer<unknown, unknown>>
(transformer: T): DuplexObjectStream<TransformerInput<T>, TransformerOutput<T>> => {
  return duplex(
    new Transform({
      objectMode: true,
      async transform(item, enc, cb) {
        cb(null, await transformer.process(item));
      }
    }
  ))
}
