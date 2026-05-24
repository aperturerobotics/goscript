import { describe, expect, it } from 'vitest'

import { Clone, Values } from './index.js'

describe('maps overrides', () => {
  it('accept nilable comparable keys', () => {
    const source = new Map<object | null, number>()
    const key = { name: 'type' }
    source.set(null, 1)
    source.set(key, 2)

    const cloned = Clone(source)
    expect(cloned?.get(null)).toBe(1)
    expect(cloned?.get(key)).toBe(2)

    const values: number[] = []
    Values(cloned)((value) => {
      values.push(value)
      return true
    })
    expect(values.sort()).toEqual([1, 2])
  })
})
