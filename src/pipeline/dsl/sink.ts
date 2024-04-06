import { Writable } from "stream";
import { WritableObjectStream } from "../types";
import { writable } from "./writable";

export const sink = <T>(callback: (input: T) => Promise<any>): WritableObjectStream<T> => {
  return writable(new Writable({
    objectMode: true,
    async write(chunk: any, encoding, cb) {
      await callback(chunk);
      cb(null);
    }
  }))
}
