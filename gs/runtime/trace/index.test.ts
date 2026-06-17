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

// maxBatchSize mirrors the trace v2 reader limit (tracev2.MaxBatchSize, 64<<10).
// A batch whose declared data length exceeds this is rejected with "invalid
// batch size", so the encoder must split large captures across batches.
const maxBatchSize = 64 * 1024

// batchSizes walks the trace v2 stream past the 16-byte header and returns the
// declared data length of every EvEventBatch frame. Each frame is the batch
// kind byte (1), then uvarints for generation, M id, base timestamp, and data
// length, then the data block.
function batchSizes(bytes: Uint8Array): number[] {
  const sizes: number[] = []
  let i = 16 // header: "go 1.22 trace\x00\x00\x00"
  const readUvarint = (): number => {
    let value = 0
    let shift = 0
    for (;;) {
      const b = bytes[i++]
      value += (b & 0x7f) * 2 ** shift
      if ((b & 0x80) === 0) {
        break
      }
      shift += 7
    }
    return value
  }
  while (i < bytes.length) {
    i++ // EvEventBatch kind byte
    readUvarint() // generation
    readUvarint() // M id
    readUvarint() // base timestamp
    const size = readUvarint()
    sizes.push(size)
    i += size
  }
  return sizes
}

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

  it('splits a large capture into batches under the size limit', () => {
    const capture = captureWriter()

    expect(Start(writerOf(capture.chunks))).toBeNull()

    // Record enough distinct tasks and logs to overflow the single-batch ceiling
    // in both the string dictionary and the event stream.
    const eventCount = 4000
    for (let i = 0; i < eventCount; i++) {
      const [ctx, task] = NewTask(context.Background(), `multibatch-task-${i}`)
      Log(ctx, 'multibatch-key', `multibatch-message-${i}`)
      task.End()
    }

    Stop()

    const sizes = batchSizes(capture.bytes())
    // Frequency, plus several string and event batches.
    expect(sizes.length).toBeGreaterThan(3)
    for (const size of sizes) {
      expect(size).toBeLessThanOrEqual(maxBatchSize)
    }
  })
})
