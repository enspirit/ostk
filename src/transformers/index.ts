import { LambdaTransformer } from './LambdaTransformer'
import { FirstArg, SimpleLambda } from './types'

export * from './Transformer'
export * from './LambdaTransformer'
export * from './types'

export const transform = <T extends SimpleLambda>(lambda: T) => {
  return new LambdaTransformer<FirstArg<T>, Awaited<ReturnType<T>>>(lambda)
}
