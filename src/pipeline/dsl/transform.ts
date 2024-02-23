import { SimpleLambda, FirstArg, LambdaTransformer } from "../../transformers"
import { DuplexObjectStream } from "../types"
import { wrap } from "./wrap"

export const transform = <T extends SimpleLambda>(lambda: T): DuplexObjectStream<FirstArg<T>, Awaited<ReturnType<T>>> => {
  return wrap(new LambdaTransformer<FirstArg<T>, Awaited<ReturnType<T>>>(lambda))
}
