import { describe, expect, it } from 'vitest'

import {
  FixedZone,
  Hour,
  Now,
  Parse,
  ParseInLocation,
  RFC3339,
  Since,
  Until,
} from './index.js'

// Reference Unix seconds are produced by Go's time package for the same input.
describe('time parse/since/until (Go semantics)', () => {
  it('Parse reads an RFC3339 timestamp as UTC', () => {
    const [t, err] = Parse(RFC3339, '2026-06-22T15:04:05Z')
    expect(err).toBeNull()
    expect(t.Unix()).toBe(1782140645n)
  })

  it('ParseInLocation honors the zone offset', () => {
    const [t, err] = ParseInLocation(
      RFC3339,
      '2026-06-22T15:04:05+01:00',
      FixedZone('X', 3600),
    )
    expect(err).toBeNull()
    expect(t.Unix()).toBe(1782137045n)
  })

  it('Since measures elapsed time as a positive delta', () => {
    const past = Now().Add(-Hour)
    const elapsed = Since(past)
    expect(elapsed >= Hour).toBe(true)
    expect(elapsed < Hour + 5n * 1000000000n).toBe(true)
  })

  it('Until measures remaining time toward a future instant', () => {
    const future = Now().Add(Hour)
    const remaining = Until(future)
    expect(remaining <= Hour).toBe(true)
    expect(remaining > Hour - 5n * 1000000000n).toBe(true)
  })
})
