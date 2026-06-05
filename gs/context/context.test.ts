import { describe, expect, it } from 'vitest'

import * as $ from '@goscript/builtin/index.js'

import { AfterFunc, WithCancel, Background, WithValue } from './index.js'

async function nextMicrotask(): Promise<void> {
  await new Promise<void>((resolve) => queueMicrotask(resolve))
}

async function nextTask(): Promise<void> {
  await new Promise<void>((resolve) => setTimeout(resolve, 0))
}

describe('context override', () => {
  it('matches generated struct keys by Go comparable value', () => {
    class Key {
      public _fields: Record<string, $.VarRef<unknown>>

      constructor() {
        this._fields = {}
      }
    }

    const ctx = WithValue(
      Background(),
      $.interfaceValue($.markAsStructValue(new Key()), 'example.key'),
      'stored',
    )

    expect(
      ctx.Value(
        $.interfaceValue($.markAsStructValue(new Key()), 'example.key'),
      ),
    ).toBe('stored')
  })

  it('runs AfterFunc after cancellation', async () => {
    const [ctx, cancel] = WithCancel(Background())
    let called = false

    const stop = AfterFunc(ctx, () => {
      called = true
    })

    cancel?.()
    await nextMicrotask()
    await nextTask()

    expect(called).toBe(true)
    expect(stop()).toBe(false)
  })

  it('stops AfterFunc before cancellation', async () => {
    const [ctx, cancel] = WithCancel(Background())
    let called = false

    const stop = AfterFunc(ctx, () => {
      called = true
    })

    expect(stop()).toBe(true)
    cancel?.()
    await nextMicrotask()
    await nextMicrotask()

    expect(called).toBe(false)
  })

  it('accepts nil AfterFunc callbacks for type compatibility', () => {
    const [ctx] = WithCancel(Background())

    const stop = AfterFunc(ctx, null)

    expect(stop()).toBe(true)
  })
})
