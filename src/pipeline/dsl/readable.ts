import { Readable } from "stream";
import { ReadableObjectStream } from "../types";

export const readable = <T>(stream: Readable): ReadableObjectStream<T> => {
  if (!stream.readableObjectMode) {
    throw new Error(`Non object stream detected`);
  }

  return stream as ReadableObjectStream<T>
}

