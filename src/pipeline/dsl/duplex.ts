import { Duplex } from "stream";
import { DuplexObjectStream } from "../types";

export const duplex = <I, O>(stream: Duplex): DuplexObjectStream<I, O> => {
  return stream as DuplexObjectStream<I, O>
}

