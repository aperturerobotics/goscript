import { describe, expect, it } from 'vitest'

import {
  Duration_Abs,
  Duration_Hours,
  Duration_Microseconds,
  Duration_Milliseconds,
  Duration_Minutes,
  Duration_Nanoseconds,
  Duration_Round,
  Duration_Seconds,
  Duration_String,
  Duration_Truncate,
  January,
  Microsecond,
  Millisecond,
  Minute,
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

describe('time.Duration methods', () => {
  it('converts to integer and fractional units', () => {
    expect(Duration_Nanoseconds(1500 * Microsecond)).toBe(1500000)
    expect(Duration_Microseconds(1500 * Microsecond)).toBe(1500)
    expect(Duration_Milliseconds(1500 * Microsecond)).toBe(1)
    expect(Duration_Seconds(1500 * Millisecond)).toBe(1.5)
    expect(Duration_Minutes(90 * Second)).toBe(1.5)
    expect(Duration_Hours(90 * Minute)).toBe(1.5)
  })

  it('rounds and truncates with Go duration semantics', () => {
    expect(Duration_Truncate(1500 * Millisecond, Second)).toBe(Second)
    expect(Duration_Truncate(-1500 * Millisecond, Second)).toBe(-Second)
    expect(Duration_Round(1500 * Millisecond, Second)).toBe(2 * Second)
    expect(Duration_Round(-1500 * Millisecond, Second)).toBe(-2 * Second)
    expect(Duration_Round(1500 * Millisecond, 0)).toBe(1500 * Millisecond)
  })

  it('returns absolute values', () => {
    expect(Duration_Abs(2 * Second)).toBe(2 * Second)
    expect(Duration_Abs(-2 * Second)).toBe(2 * Second)
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
