import { Type } from "finitio"
import { transform } from "./transform"
import { FinitioDresser } from "../../transformers"
import { wrap } from "./wrap"

export const dress = <T>(type: Type) => {
  return wrap(new FinitioDresser<T>(type));
}
