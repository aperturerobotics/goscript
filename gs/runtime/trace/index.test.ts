import { describe, expect, it } from 'vitest'

import * as context from '@goscript/context/index.js'

import {
  IsEnabled,
  Log,
  NewTask,
  Start,
  StartRegion,
  Stop,
  WithRegion,
} from './index.js'

function captureWriter(): { chunks: Uint8Array[]; bytes(): Uint8Array } {
  const chunks: Uint8Array[] = []
  return {
    chunks,
    bytes(): Uint8Array {
      const total = chunks.reduce((n, c) => n + c.length, 0)
      const out = new Uint8Array(total)
      let off = 0
      for (const c of chunks) {
        out.set(c, off)
        off += c.length
      }
      return out
    },
  }
}

const writerOf = (chunks: Uint8Array[]) => ({
  Write(p: Uint8Array): [number, null] {
    chunks.push(new Uint8Array(p))
    return [p.length, null]
  },
})

describe('runtime/trace override', () => {
  it('creates no-op tasks when tracing is disabled', () => {
    const [ctx, task] = NewTask(null, 'task')

    expect(ctx).not.toBeNull()
    expect(task).not.toBeNull()
    task.End()
    Log(ctx, 'category', 'message')
    expect(IsEnabled()).toBe(false)
  })

  it('runs regions', () => {
    const [ctx] = NewTask(context.Background(), 'task')
    const called = { value: false }

    WithRegion(ctx, 'region', () => {
      called.value = true
    })
    StartRegion(ctx, 'region').End()

    expect(called.value).toBe(true)
  })

  it('rejects a nil trace writer', () => {
    expect(Start(null)?.Error()).toBe('runtime/trace: nil trace writer')
  })

  it('emits a trace v2 stream for user tasks', () => {
    const capture = captureWriter()

    expect(Start(writerOf(capture.chunks))).toBeNull()
    expect(IsEnabled()).toBe(true)

    const [ctx, task] = NewTask(context.Background(), 'proof-task')
    WithRegion(ctx, 'proof-region', () => {
      Log(ctx, 'proof-key', 'proof-value')
    })
    task.End()

    Stop()
    expect(IsEnabled()).toBe(false)

    const bytes = capture.bytes()
    expect(bytes.length).toBeGreaterThan(0)

    const header = new TextDecoder().decode(bytes.slice(0, 13))
    expect(header).toBe('go 1.22 trace')

    // The interned task and region names appear in the string batch.
    const text = new TextDecoder('latin1').decode(bytes)
    expect(text).toContain('proof-task')
    expect(text).toContain('proof-region')
    expect(text).toContain('proof-value')
  })
})
