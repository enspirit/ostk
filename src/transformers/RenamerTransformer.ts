import { Transformer } from "./Transformer";

export type Mapping<T> =
  Record<PropertyKey, keyof T | ((obj: T) => any)>

// Inspired/taken by/from https://github.com/posva/shapify
export type Mapped<
  T extends Record<PropertyKey, any>,
  K extends keyof T,
  M extends Mapping<T>
> = {
  [P in keyof M]: M[P] extends K
    ? T[M[P]]
    : M[P] extends (obj: T) => any
      ? ReturnType<M[P]>
      : never
}

export class RenamerTransformer<
  T extends Record<PropertyKey, any>,
  M extends Mapping<T>
> extends Transformer<T, Mapped<T, keyof T, M>> {

  constructor(protected mapping: M) {
    super()
  }

  async _process(item: T): Promise<Mapped<T, keyof T, M>> {
    return Object.entries(this.mapping)
      .reduce((mapped, [newKey, oldKey]) => {
        if (typeof oldKey === 'function') {
          mapped[newKey as keyof T] = oldKey(item);
        } else {
          mapped[newKey as keyof T] = item[oldKey as keyof T];
        }
        return mapped;
      }, {} as Mapped<T, keyof T, M>);
  }
}
