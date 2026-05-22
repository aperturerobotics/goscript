import { describe, expect, it } from 'vitest'

import { AfterFunc, WithCancel, Background } from './index.js'

async function nextMicrotask(): Promise<void> {
  await new Promise<void>((resolve) => queueMicrotask(resolve))
}

describe('context override', () => {
  it('runs AfterFunc after cancellation', async () => {
    const [ctx, cancel] = WithCancel(Background())
    let called = false

    const stop = AfterFunc(ctx, () => {
      called = true
    })

    cancel?.()
    await nextMicrotask()
    await nextMicrotask()

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
})
