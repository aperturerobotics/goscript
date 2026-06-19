import { describe, expect, it } from 'vitest'

import {
  BOOLEAN,
  INTEGER,
  SEQUENCE,
  Tag_Constructed,
  Tag_ContextSpecific,
} from './index.js'

describe('cryptobyte/asn1 override', () => {
  it('exports tag constants and class helpers', () => {
    expect(BOOLEAN).toBe(1)
    expect(INTEGER).toBe(2)
    expect(SEQUENCE).toBe(0x30)
    expect(Tag_Constructed(16)).toBe(0x30)
    expect(Tag_ContextSpecific(3)).toBe(0x83)
  })
})
