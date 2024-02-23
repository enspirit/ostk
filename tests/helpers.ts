import { Stream, Writable } from "stream"
import { expect } from "vitest"
import type { Assertion, AsymmetricMatchersContaining } from 'vitest'
import { Failure, Success, dress } from "../src"
import { Row, System } from "./fixtures/schema";

// Utils

export const RowDresser = dress<Row>(System.Main!);

// Add custom chai/expect assertions

interface CustomMatchers<R = unknown> {
  toBeSuccess: <T>(cb?: (result: unknown) => void) => R
  toBeFailure: (cb?: (error: string) => void) => R
}

declare module 'vitest' {
  interface Assertion<T = any> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}

expect.extend({
  toBeSuccess<T>(received: T, cb?: (result: unknown) => void) {
    const { isNot } = this

    const isSuccess = received instanceof Success
    if (isSuccess && cb) {
      cb((received as Success<unknown>).result)
    }

    return {
      pass: isSuccess,
      // @ts-ignore
      message: () => `${received} is${isNot ? ' not' : ''} a Success`
    }
  },
  toBeFailure<T>(received: T, cb?: (error: string) => void) {
    const { isNot } = this

    const isFailure = received instanceof Failure
    if (isFailure && cb) {
      cb((received as Failure<unknown>).err)
    }

    return {
      pass: isFailure,
      // @ts-ignore
      message: () => `${received} is${isNot ? ' not' : ''} a Success`
    }
  }
})
