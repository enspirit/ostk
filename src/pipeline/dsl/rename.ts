import { Type } from "finitio"
import { transform } from "./transform"
import { FinitioDresser, Mapping, RenamerTransformer } from "../../transformers"
import { wrap } from "./wrap"

export const rename = <
  T extends Record<PropertyKey, any>,
  M extends Mapping<T>
>(mapping: M) => {
  return wrap(
    new RenamerTransformer<T, M>(mapping)
  );
}
