import { Type } from "finitio"
import { transform } from "./transform"
import { FinitioDresser } from "../../transformers"
import { wrap } from "./wrap"
import { DuplexObjectStream } from "../types"

export const dress = <T>(type: Type): DuplexObjectStream<any, T> => {
  return wrap(new FinitioDresser<T>(type));
}
