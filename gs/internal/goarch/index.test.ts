import { describe, expect, it } from 'vitest'

import {
  ArchFamily,
  BigEndian,
  DefaultPhysPageSize,
  GOARCH,
  Int64Align,
  IsAmd64,
  IsWasm,
  PCQuantum,
  PtrBits,
  PtrSize,
  StackAlign,
  WASM,
} from './index.js'

describe('internal/goarch override', () => {
  it('matches JS/WASM Go architecture constants', () => {
    expect(GOARCH).toBe('wasm')
    expect(IsWasm).toBe(1)
    expect(IsAmd64).toBe(0)
    expect(PtrSize).toBe(8)
    expect(PtrBits).toBe(64)
    expect(Int64Align).toBe(PtrSize)
    expect(StackAlign).toBe(PtrSize)
    expect(BigEndian).toBe(false)
    expect(DefaultPhysPageSize).toBe(65536)
    expect(PCQuantum).toBe(1)
    expect(ArchFamily).toBe(WASM)
  })
})
