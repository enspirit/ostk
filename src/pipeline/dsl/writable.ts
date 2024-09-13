import { Writable } from "stream";
import { WritableObjectStream } from "../types";

export const writable = <T>(stream: Writable): WritableObjectStream<T> => {
  return stream as WritableObjectStream<T>
}

