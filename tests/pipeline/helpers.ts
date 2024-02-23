import { Readable, Writable } from "stream";
import { ReadableObjectStream, readable } from "../../src/pipeline";

export type Sink<T> = {
  items: Array<T>,
  drain(): void
  stream: Writable,
  wait(): Promise<unknown>
}

export const useSink = <T>(): Sink<T> => {
  let items: Array<any> = []

  const drain = () => {
    items = [];
  }

  const stream = new Writable({
    objectMode: true,
    write(obj, enc, cb) {
      items.push(obj);
      cb();
    }
  });

  const wait = () => {
    return new Promise((resolve) => {
      stream.on('finish', resolve)
    })
  }

  return {
    items,
    drain,
    stream,
    wait,
  }
}
