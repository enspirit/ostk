import { Readable, Transform } from "stream";
import { ReadableObjectStream } from "../types";
import { Ok } from "../../transformers";

export const readable = <T>(stream: Readable): ReadableObjectStream<T> => {
  if (!stream.readableObjectMode) {
    throw new Error(`Non object stream detected`);
  }

  const wrapper = new Transform({
    objectMode: true,
    transform(chunk: T, encoding: BufferEncoding, callback) {
      callback(null, Ok(chunk));
    }
  }) as any;

  return stream.pipe(wrapper) as ReadableObjectStream<T>
}

