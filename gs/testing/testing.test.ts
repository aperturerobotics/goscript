import { describe, expect, it } from 'vitest'

import { B, F, Short, T, type TB } from './testing.js'

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

  it('exports the benchmark and fuzz test surfaces used by compiled tests', async () => {
    const b = new B('bench')
    b.N = 2
    b.ReportAllocs()
    b.ResetTimer()
    b.SetBytes(12)
    b.ReportMetric(3, 'items')

    let ran = false
    const ok = await b.Run('child', (child) => {
      ran = true
      expect(child.Name()).toBe('bench/child')
    })

    const f = new F('fuzz')
    f.Add('seed')
    f.Fuzz(() => {})

    const tb: TB = b
    tb.Helper()

    expect(ok).toBe(true)
    expect(ran).toBe(true)
    expect(Short()).toBe(false)
  })
})
