import { Writable } from "stream";
import { WritableObjectStream } from "../types";

export const writable = <T>(stream: Writable): WritableObjectStream<T> => {
  if (!stream.writableObjectMode) {
    throw new Error(`Non object stream detected`);
  }

  return stream as WritableObjectStream<T>
}

