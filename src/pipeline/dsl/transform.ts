import { SimpleLambda, LambdaTransformer } from "../../transformers"
import { DuplexObjectStream } from "../types"
import { wrap } from "./wrap"

type LambdaInput<T> = T extends SimpleLambda<infer X, any> ? X : never
type LambdaOutput<T> = T extends SimpleLambda<any, infer X> ? X : never

export const transform = <I, O>(lambda: SimpleLambda<I, O>): DuplexObjectStream<I, O> => {
  return wrap(new LambdaTransformer(lambda))
}
