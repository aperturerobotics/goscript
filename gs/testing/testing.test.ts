import { describe, expect, it } from 'vitest'

import { T } from './testing.js'

describe('testing.T', () => {
  it('runs passing subtests', () => {
    const t = new T('root')

    const ok = t.Run('child', (child) => {
      expect(child.Name()).toBe('root/child')
    })

    expect(ok).toBe(true)
    expect(t.Failed()).toBe(false)
  })

  it('propagates failed subtests', () => {
    const t = new T('root')

    const ok = t.Run('child', (child) => {
      child.Error('failed')
    })

    expect(ok).toBe(false)
    expect(t.Failed()).toBe(true)
  })
})
