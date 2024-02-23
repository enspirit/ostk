import { Duplex } from "stream";
import { DuplexObjectStream } from "../types";

export const duplex = <I, O>(stream: Duplex): DuplexObjectStream<I, O> => {
  if (!stream.writableObjectMode) {
    throw new Error(`Non object stream detected`);
  }

  return stream as DuplexObjectStream<I, O>
}

