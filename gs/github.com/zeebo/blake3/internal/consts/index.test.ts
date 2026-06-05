import { describe, expect, test } from 'vitest'

import {
  BlockLen,
  ChunkLen,
  Flag_ChunkEnd,
  Flag_ChunkStart,
  Flag_DeriveKeyContext,
  Flag_DeriveKeyMaterial,
  Flag_Keyed,
  Flag_Parent,
  Flag_Root,
  HasAVX2,
  HasSSE41,
  IV,
  IV0,
  OptimizeLittleEndian,
} from './index.js'

describe('blake3 consts override', () => {
  test('uses portable constants for GoScript', () => {
    expect(IV).toEqual([
      0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c,
      0x1f83d9ab, 0x5be0cd19,
    ])
    expect(IV[0]).toBe(IV0)
    expect(BlockLen).toBe(64)
    expect(ChunkLen).toBe(1024)
    expect(Flag_ChunkStart).toBe(1)
    expect(Flag_ChunkEnd).toBe(2)
    expect(Flag_Parent).toBe(4)
    expect(Flag_Root).toBe(8)
    expect(Flag_Keyed).toBe(16)
    expect(Flag_DeriveKeyContext).toBe(32)
    expect(Flag_DeriveKeyMaterial).toBe(64)
    expect(HasAVX2).toBe(false)
    expect(HasSSE41).toBe(false)
    expect(OptimizeLittleEndian).toBe(false)
  })
})
