import { describe, expect, it } from 'vitest'

import { Cond, Map, Mutex, RWMutex, WaitGroup } from './sync.js'

describe('sync.WaitGroup', () => {
  it('Go tracks scheduled work and unblocks Wait after completion', async () => {
    const wg = new WaitGroup()
    const events: string[] = []

    wg.Go(async () => {
      events.push('worker start')
      await Promise.resolve()
      events.push('worker done')
    })

    const wait = wg.Wait().then(() => {
      events.push('wait done')
    })

    expect(events).toEqual([])
    await wait
    expect(events).toEqual(['worker start', 'worker done', 'wait done'])
  })
})

describe('sync.Cond', () => {
  it('exposes the Locker as public field L', async () => {
    const mutex = new Mutex()
    const cond = new Cond(mutex)

    expect(cond.L).toBe(mutex)
    await cond.L.Lock()
    cond.L.Unlock()
  })
})

describe('sync.RWMutex', () => {
  it('exposes RLocker as a read-lock Locker', async () => {
    const rw = new RWMutex()
    const locker = rw.RLocker()

    await locker.Lock()
    locker.Unlock()
  })
})

describe('sync.Map', () => {
  it('CompareAndSwap swaps only matching entries', async () => {
    const m = new Map()

    await m.Store('key', 'value')
    expect(await m.CompareAndSwap('key', 'other', 'next')).toBe(false)
    expect(await m.Load('key')).toEqual(['value', true])
    expect(await m.CompareAndSwap('key', 'value', 'next')).toBe(true)
    expect(await m.Load('key')).toEqual(['next', true])
  })

  it('CompareAndDelete deletes only matching entries', async () => {
    const m = new Map()

    await m.Store('key', 'value')
    expect(await m.CompareAndDelete('key', 'other')).toBe(false)
    expect(await m.Load('key')).toEqual(['value', true])
    expect(await m.CompareAndDelete('key', 'value')).toBe(true)
    expect(await m.Load('key')).toEqual([undefined, false])
  })

  it('Range accepts generated async-shaped callbacks', async () => {
    const m = new Map()
    const visited: string[] = []

    await m.Store('a', 1)
    await m.Store('b', 2)
    await m.Range(async (key, value) => {
      visited.push(`${key}:${value}`)
      return key !== 'a'
    })

    expect(visited).toEqual(['a:1'])
  })
})
