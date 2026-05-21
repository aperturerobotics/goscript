import { describe, expect, it } from 'vitest'

import { T } from './testing.js'

describe('testing.T', () => {
  it('runs passing subtests', async () => {
    const t = new T('root')

    const ok = await t.Run('child', (child) => {
      expect(child.Name()).toBe('root/child')
    })

    expect(ok).toBe(true)
    expect(t.Failed()).toBe(false)
  })

  it('runs async subtests before returning', async () => {
    const t = new T('root')
    let completed = false

    const ok = await t.Run('child', async (child) => {
      await Promise.resolve()
      expect(child.Name()).toBe('root/child')
      completed = true
    })

    expect(ok).toBe(true)
    expect(completed).toBe(true)
    expect(t.Failed()).toBe(false)
  })

  it('propagates failed subtests', async () => {
    const t = new T('root')

    const ok = await t.Run('child', (child) => {
      child.Error('failed')
    })

    expect(ok).toBe(false)
    expect(t.Failed()).toBe(true)
  })
})
