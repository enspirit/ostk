import { Dresser } from '../../src'
import { Readable, Transform, Writable } from 'stream';
import { describe, expect, test, beforeEach, vi } from 'vitest'
import Finitio, { System } from 'finitio';
import { it } from 'node:test';
import { Success } from '../../src/types';

describe('The Dresser transformer', () => {

  test('is a function', () => {
    expect(Dresser).to.be.an.instanceOf(Function)
  })

  test('expects a finitio schema or type as argument', () => {
    // @ts-expect-error
    expect(() => Dresser()).to.throw(/Finitio Type or Schema expected/);
    // @ts-expect-error
    expect(() => Dresser(null)).to.throw(/Finitio Type or Schema expected/);
    expect(() => Dresser({})).to.throw(/Finitio Type or Schema expected/);
  })

  describe('When provided with finitio schemas and types', () => {
    let system: System;
    beforeEach(() => {
      system = Finitio.system('.String');
    })

    test('with a system with main type, it works', () => {
      expect(Dresser(system)).to.be.an.instanceof(Transform);
    })

    test('with a type, it works', () => {
      expect(Dresser(system.Main!)).to.be.an.instanceof(Transform);
    })

    test('with a schema without main type, it fails', () => {
      expect(() => Dresser(Finitio.system('String = .String')))
        .to.throw(/Finitio Schema must have main type/)
    })
  })
})
