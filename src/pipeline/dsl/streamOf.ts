import { Readable } from "stream"
import { readable } from "./readable"
import { ReadableObjectStream } from "../types"

export const streamOf = <T>(...items: Array<T>): ReadableObjectStream<T> => {
  return readable(Readable.from(items, { objectMode: true }))
}
