import { Readable } from "stream"
import { ReadableObjectStream, readable } from "."

export const streamOf = <T>(...items: Array<T>): ReadableObjectStream<T> => {
  return readable(Readable.from(items, { objectMode: true }))
}
