import { describe, expect, it } from 'vitest'

import * as context from '@goscript/context/index.js'

import { IsEnabled, Log, NewTask, Start, StartRegion, Stop, WithRegion } from './index.js'

describe('runtime/trace override', () => {
  it('creates no-op tasks from nil context', () => {
    const [ctx, task] = NewTask(null, 'task')

    expect(ctx).not.toBeNull()
    expect(task).not.toBeNull()
    task.End()
    Log(ctx, 'category', 'message')
    expect(IsEnabled()).toBe(false)
  })

  it('runs no-op regions', () => {
    const [ctx] = NewTask(context.Background(), 'task')
    const called = { value: false }

    WithRegion(ctx, 'region', () => {
      called.value = true
    })
    StartRegion(ctx, 'region').End()

    expect(called.value).toBe(true)
  })

  it('reports execution tracing as unsupported', () => {
    const chunks: Uint8Array[] = []
    const writer = {
      Write(p: Uint8Array): [number, null] {
        chunks.push(new Uint8Array(p))
        return [p.length, null]
      },
    }

    expect(Start(writer)?.Error()).toBe(
      'runtime/trace: execution tracing is unsupported in GoScript',
    )
    Log(context.Background(), 'category', 'message')
    Stop()

    expect(chunks).toHaveLength(0)
  })
})
