import { Readable, Transform } from "stream";
import { ReadableObjectStream } from "../types";
import { Ok } from "../../transformers";

export const readable = <T>(stream: Readable): ReadableObjectStream<T> => {
  const wrapper = new Transform({
    objectMode: true,
    transform(chunk: T, encoding: BufferEncoding, callback) {
      callback(null, Ok(chunk));
    }
  }) as any;

  return stream.pipe(wrapper);
}

