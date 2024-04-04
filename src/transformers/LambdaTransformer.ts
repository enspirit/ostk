import { Transformer } from "./Transformer";
import { SimpleLambda } from "./types";

export class LambdaTransformer<I, O> extends Transformer<I, O> {
  public constructor(public lambda: SimpleLambda<I, O>) {
    super();
  }

  _process(item: I): Promise<O> {
    return this.lambda(item);
  }
}
