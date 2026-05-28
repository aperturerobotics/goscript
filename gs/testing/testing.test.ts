import { describe, expect, it } from 'vitest'
import { existsSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { B, F, Short, T, type TB } from './testing.js'
import { runTests } from './testing.js'

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

  it('reports short mode while a short run is active', async () => {
    let observed = false

    const result = await runTests(
      'example.test/short',
      [
        {
          name: 'TestShort',
          fn: () => {
            observed = Short()
          },
        },
      ],
      { short: true },
    )

    expect(result.ok).toBe(true)
    expect(observed).toBe(true)
    expect(Short()).toBe(false)
  })

  it('accepts parallel tests in the sequential runner', () => {
    const t = new T('root')

    t.Parallel()

    expect(t.Failed()).toBe(false)
  })

  it('accepts nil cleanup values and fails when cleanup runs', async () => {
    const t = new T('root')

    t.Cleanup(null)

    await expect(t.runCleanups()).rejects.toThrow(
      'testing: nil cleanup function',
    )
  })

  it('returns a non-nil context', () => {
    const t = new T('root')

    expect(t.Context()).not.toBeNull()
  })

  it('creates unique TempDir paths and removes them during cleanup', async () => {
    const t = new T('root')

    const first = t.TempDir()
    const second = t.TempDir()
    expect(first).not.toBe(second)
    writeFileSync(join(first, 'marker.txt'), 'marker')
    expect(existsSync(first)).toBe(true)

    await t.runCleanups()

    expect(existsSync(first)).toBe(false)
    expect(existsSync(second)).toBe(false)
  })

  it('formats common testing printf verbs', () => {
    const t = new T('root')
    const messages: string[] = []
    const originalLog = console.log
    console.log = (message?: unknown) => {
      messages.push(String(message))
    }
    try {
      t.Logf(
        'quoted=%q value=%#v plus=%+v number=%d string=%s plain=%v',
        'key',
        7,
        { ok: true },
        3,
        'ok',
        true,
      )
      t.flushLogs()
    } finally {
      console.log = originalLog
    }

    expect(messages).toEqual([
      '    quoted="key" value=7 plus=[object Object] number=3 string=ok plain=true',
    ])
  })

  it('formats Go-style error objects with Error methods', () => {
    const t = new T('root')
    const messages: string[] = []
    const originalLog = console.log
    console.log = (message?: unknown) => {
      messages.push(String(message))
    }
    try {
      t.Logf('err=%v', { Error: () => 'host path missing' })
      t.flushLogs()
    } finally {
      console.log = originalLog
    }

    expect(messages).toEqual(['    err=host path missing'])
  })
})
