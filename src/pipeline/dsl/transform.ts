import { SimpleLambda, LambdaTransformer } from "../../transformers"
import { DuplexObjectStream } from "../types"
import { wrap } from "./wrap"

export const transform = <I, O>(lambda: SimpleLambda<I, O>): DuplexObjectStream<I, O> => {
  return wrap(new LambdaTransformer(lambda))
}
