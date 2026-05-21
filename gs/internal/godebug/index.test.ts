import { describe, expect, it } from 'vitest'

import { New, Setting, Value } from './index.js'

describe('internal/godebug override', () => {
  it('returns stable setting values', () => {
    const setting = New('#fips140')

    expect(setting).toBeInstanceOf(Setting)
    expect(setting.Name()).toBe('fips140')
    expect(setting.Undocumented()).toBe(true)
    expect(setting.Value()).toBe('')
    expect(setting.String()).toBe('fips140=')
    expect(Value('fips140')).toBe('')
  })
})
