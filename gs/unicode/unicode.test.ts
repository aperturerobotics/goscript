import { describe, expect, it } from 'vitest'

import * as $ from '@goscript/builtin/index.js'

import {
  AzeriCase,
  CategoryAliases,
  Cn,
  Is,
  IsControl,
  IsDigit,
  IsGraphic,
  IsLetter,
  IsLower,
  IsPrint,
  IsPunct,
  IsSpace,
  IsSymbol,
  IsTitle,
  IsUpper,
  Range16,
  Range32,
  RangeTable,
  SimpleFold,
  ToLower,
  ToTitle,
  ToUpper,
  TurkishCase,
} from './unicode.js'

describe('unicode overrides', () => {
  it('accepts generated struct-literal constructor shapes', () => {
    const table = new RangeTable({
      R16: $.arrayToSlice<Range16>([
        new Range16({ Lo: 0x41, Hi: 0x5a, Stride: 1 }),
      ]),
      R32: $.arrayToSlice<Range32>([
        new Range32({ Lo: 0x10000, Hi: 0x10002, Stride: 1 }),
      ]),
      LatinOffset: 1,
    })

    expect(table.LatinOffset).toBe(1)
    expect(Is(table, 0x41)).toBe(true)
    expect(Is(table, 0x10001)).toBe(true)
    expect(Is(table, 0x61)).toBe(false)
  })

  it('exports category aliases used by regexp/syntax', () => {
    expect(CategoryAliases.get('digit')).toBe('Nd')
    expect(Cn).toBeInstanceOf(RangeTable)
  })

  // Behavior parity with Go's unicode package: values are the ground truth from
  // running the corresponding Go functions (go run against unicode 15.0.0).
  it('classifies runes across the full Unicode range', () => {
    expect(IsLetter(0x4e2d)).toBe(true) // CJX ideograph
    expect(IsDigit(0x660)).toBe(true) // Arabic-Indic digit zero
    expect(IsSpace(0x2000)).toBe(true) // en quad
    expect(IsSpace(0xa0)).toBe(true) // NBSP
    expect(IsUpper(0x3a3)).toBe(true) // Greek capital sigma
    expect(IsLower(0x3c3)).toBe(true) // Greek small sigma
    expect(IsTitle(0x01c5)).toBe(true) // Dz with caron (titlecase)
    expect(IsControl(0x7f)).toBe(true) // DEL
    expect(IsPunct(0x3001)).toBe(true) // ideographic comma
    expect(IsSymbol(0xa2)).toBe(true) // cent sign
  })

  it('distinguishes Graphic from Print for non-ASCII space', () => {
    expect(IsGraphic(0xa0)).toBe(true) // NBSP is graphic
    expect(IsPrint(0xa0)).toBe(false) // but not printable
    expect(IsPrint(0x20)).toBe(true) // ASCII space is printable
  })

  it('maps case using Go case ranges, not JS toUpperCase/toLowerCase', () => {
    expect(ToUpper(0x61)).toBe(0x41)
    expect(ToLower(0x41)).toBe(0x61)
    expect(ToUpper(0xdf)).toBe(0xdf) // sharp s has no simple uppercase
    expect(ToUpper(0xe9)).toBe(0xc9) // e-acute
    expect(ToLower(0xc9)).toBe(0xe9)
    expect(ToUpper(0xb5)).toBe(0x39c) // micro sign maps to Greek capital mu
  })

  it('handles the upper/lower/title digraph sentinel', () => {
    expect(ToUpper(0x01c6)).toBe(0x01c4) // dz-caron -> DZ-caron
    expect(ToTitle(0x01c6)).toBe(0x01c5) // dz-caron -> Dz-caron
    expect(ToLower(0x01c6)).toBe(0x01c6) // already lower
  })

  it('applies Turkish special casing', () => {
    expect(TurkishCase.ToUpper(0x69)).toBe(0x130) // i -> dotted capital I
    expect(TurkishCase.ToLower(0x49)).toBe(0x131) // I -> dotless small i
    expect(TurkishCase.ToLower(0x130)).toBe(0x69)
    expect(AzeriCase.ToUpper(0x69)).toBe(0x130)
  })

  it('walks the simple-fold orbit', () => {
    expect(SimpleFold(0x6b)).toBe(0x212a) // k -> Kelvin sign
    expect(SimpleFold(0x212a)).toBe(0x4b) // Kelvin -> K
    expect(SimpleFold(0x4b)).toBe(0x6b) // K -> k (orbit closes)
    expect(SimpleFold(0x3a3)).toBe(0x3c2) // capital sigma -> final sigma
    expect(SimpleFold(0x3c2)).toBe(0x3c3) // final sigma -> small sigma
    expect(SimpleFold(0x3c3)).toBe(0x3a3) // small sigma -> capital sigma
  })
})
