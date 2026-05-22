import { describe, expect, it } from 'vitest'

import {
  Duration_String,
  January,
  Millisecond,
  NewTicker,
  NewTimer,
  RFC3339Nano,
  Second,
} from './time.js'

describe('time.Duration_String', () => {
  it('formats common durations', () => {
    expect(Duration_String(0)).toBe('0s')
    expect(Duration_String(1500 * Millisecond)).toBe('1.5s')
    expect(Duration_String(-1500 * Millisecond)).toBe('-1.5s')
    expect(Duration_String(2 * Second)).toBe('2s')
  })
})

describe('time constants and timers', () => {
  it('exports RFC3339Nano', () => {
    expect(RFC3339Nano).toBe('2006-01-02T15:04:05.999999999Z07:00')
  })

  it('exports month constants directly', () => {
    expect(January).toBe(1)
  })

  it('delivers NewTimer values on C', async () => {
    const timer = NewTimer(0)
    const value = await timer.C.receive()

    expect(value.Unix()).toBeGreaterThan(0)
  })

  it('delivers NewTicker values on C', async () => {
    const ticker = NewTicker(0)
    const value = await ticker.C.receive()
    ticker.Stop()

    expect(value.Unix()).toBeGreaterThan(0)
  })
})
