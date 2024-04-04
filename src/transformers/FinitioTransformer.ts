import type { Type } from 'finitio';
import { Transformer } from "./Transformer";

export class FinitioDresser<T> extends Transformer<unknown, T> {

  constructor(protected schema: Type) {
    super()
  }

  async _process(item: unknown): Promise<T> {
    return this.schema.dress(item) as T
  }

}
