import { Transform } from "stream";
import { Transformer, TransformerInput, TransformerOutput } from "../../transformers";
import { DuplexObjectStream } from "../types";
import { duplex } from "./duplex";

export const wrap = <
  I,
  O,
  T extends Transformer<I, O>
>
(transformer: T): DuplexObjectStream<I, O> => {
  return duplex(
    new Transform({
      objectMode: true,
      async transform(item, enc, cb) {
        cb(null, await transformer.process(item));
      }
    }
  ))
}
