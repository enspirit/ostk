export type PathImpl<T, K extends keyof T> =
  K extends string
  ? NonNullable<T[K]> extends Record<string, any>
    ? NonNullable<T[K]> extends ArrayLike<any>
      ? K | `${K}.${PathImpl<NonNullable<T[K]>, Exclude<keyof NonNullable<T[K]>, keyof any[]>>}`
      : K | `${K}.${PathImpl<NonNullable<T[K]>, keyof NonNullable<T[K]>>}`
    : K
  : never;

export type Path<T> = PathImpl<T, keyof T> | keyof T;

export type RequireOnlyOne<T, Keys extends keyof T = keyof T> =
  Pick<T, Exclude<keyof T, Keys>>
  & { [K in Keys]-?:
      Required<Pick<T, K>>
      & Partial<Record<Exclude<Keys, K>, undefined>>
  }[Keys]

