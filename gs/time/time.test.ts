import { describe, expect, it } from 'vitest'

import * as $ from '@goscript/builtin/index.js'

import {
  ANSIC,
  Date,
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
  FixedZone,
  Friday,
  January,
  Kitchen,
  LoadLocation,
  LoadLocationFromTZData,
  Local,
  Microsecond,
  Millisecond,
  Minute,
  Month_String,
  NewTicker,
  NewTimer,
  RFC1123,
  RFC3339,
  RFC3339Nano,
  Saturday,
  Second,
  StampMicro,
  Sunday,
  May,
  Time,
  Tick,
  UTC,
  UnixMicro,
  UnixMilli,
} from './time.js'
import type { Month } from './time.js'

describe('time.Duration_String', () => {
  it('formats common durations', () => {
    expect(Duration_String(0n)).toBe('0s')
    expect(Duration_String(1500n * Millisecond)).toBe('1.5s')
    expect(Duration_String(-1500n * Millisecond)).toBe('-1.5s')
    expect(Duration_String(2n * Second)).toBe('2s')
    expect(Duration_String(9n * Millisecond)).toBe('9ms')
    expect(Duration_String(1500n * Microsecond)).toBe('1.5ms')
    expect(Duration_String(1500n)).toBe('1.5\u00b5s')
    expect(Duration_String(12n)).toBe('12ns')
  })
})

describe('time.Duration methods', () => {
  it('converts to integer and fractional units', () => {
    expect(Duration_Nanoseconds(1500n * Microsecond)).toBe(1500000n)
    expect(Duration_Microseconds(1500n * Microsecond)).toBe(1500n)
    expect(Duration_Milliseconds(1500n * Microsecond)).toBe(1n)
    expect(Duration_Seconds(1500n * Millisecond)).toBe(1.5)
    expect(Duration_Minutes(90n * Second)).toBe(1.5)
    expect(Duration_Hours(90n * Minute)).toBe(1.5)
  })

  it('rounds and truncates with Go duration semantics', () => {
    expect(Duration_Truncate(1500n * Millisecond, Second)).toBe(Second)
    expect(Duration_Truncate(-1500n * Millisecond, Second)).toBe(-Second)
    expect(Duration_Round(1500n * Millisecond, Second)).toBe(2n * Second)
    expect(Duration_Round(-1500n * Millisecond, Second)).toBe(-2n * Second)
    expect(Duration_Round(1500n * Millisecond, 0n)).toBe(1500n * Millisecond)
  })

  it('returns absolute values', () => {
    expect(Duration_Abs(2n * Second)).toBe(2n * Second)
    expect(Duration_Abs(-2n * Second)).toBe(2n * Second)
  })
})

describe('time constants and timers', () => {
  it('exports layout and location constants', () => {
    expect(ANSIC).toBe('Mon Jan _2 15:04:05 2006')
    expect(RFC1123).toBe('Mon, 02 Jan 2006 15:04:05 MST')
    expect(RFC3339Nano).toBe('2006-01-02T15:04:05.999999999Z07:00')
    expect(Kitchen).toBe('3:04PM')
    expect(StampMicro).toBe('Jan _2 15:04:05.000000')
    expect(Local.String()).toBe('Local')
  })

  it('exports month and weekday constants directly', () => {
    const zeroMonth: Month = 0

    expect(zeroMonth).toBe(0)
    expect(January).toBe(1)
    expect(Month_String(May)).toBe('May')
    expect(Sunday).toBe(0)
    expect(Friday).toBe(5)
    expect(Saturday).toBe(6)
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

  it('delivers Tick values on C', async () => {
    const value = await Tick(0).receive()

    expect(value.Unix()).toBeGreaterThan(0)
  })
})

describe('time.Time.In', () => {
  it('returns the same instant in another fixed location', () => {
    const utc = Date(2025, May, 15, 1, 10, 42, 0, UTC)
    const pdt = FixedZone('PDT', -7 * 60 * 60)

    expect(utc.In(pdt).Format(RFC3339)).toBe('2025-05-14T18:10:42-07:00')
    expect(utc.In($.varRef(pdt)).Format(RFC3339)).toBe(
      '2025-05-14T18:10:42-07:00',
    )
  })

  it('panics for nil locations', () => {
    expect(() => new Time().In(null)).toThrow(
      'time: missing Location in call to Time.In',
    )
  })
})

describe('time.Time calendar and binary helpers', () => {
  it('round-trips Unix millisecond and microsecond constructors', () => {
    const millis = UnixMilli(1234567890123n)
    const micros = UnixMicro(1234567890123456n)

    expect(millis.UnixMilli()).toBe(1234567890123n)
    expect(millis.Unix()).toBe(1234567890n)
    expect(micros.UnixMicro()).toBe(1234567890123456n)
    expect(micros.Unix()).toBe(1234567890n)
  })

  it('appends formatted text to byte slices', () => {
    const t = Date(2025, May, 15, 1, 10, 42, 0, UTC)
    const out = t.AppendFormat($.stringToBytes('ts='), RFC3339)

    expect(new TextDecoder().decode(out as Uint8Array)).toBe(
      'ts=2025-05-15T01:10:42Z',
    )
  })

  it('computes yearday in the receiver location', () => {
    const utc = Date(2025, January, 1, 1, 0, 0, 0, UTC)
    const pst = FixedZone('PST', -8 * 60 * 60)

    expect(utc.YearDay()).toBe(1)
    expect(utc.In(pst).YearDay()).toBe(366)
  })

  it('computes ISO weeks across year boundaries', () => {
    expect(Date(2020, 12, 31, 12, 0, 0, 0, UTC).ISOWeek()).toEqual([2020, 53])
    expect(Date(2021, January, 1, 12, 0, 0, 0, UTC).ISOWeek()).toEqual([
      2020, 53,
    ])
    expect(Date(2021, January, 4, 12, 0, 0, 0, UTC).ISOWeek()).toEqual([
      2021, 1,
    ])
  })

  it('marshals Go binary time encodings', () => {
    const utc = Date(2025, May, 15, 1, 10, 42, 123456789, UTC)
    const pdt = Date(
      2025,
      May,
      14,
      18,
      10,
      42,
      123456789,
      FixedZone('PDT', -7 * 60 * 60),
    )

    expect(utc.MarshalBinary()).toEqual([
      new Uint8Array([
        1, 0, 0, 0, 14, 223, 183, 54, 18, 7, 91, 205, 21, 255, 255,
      ]),
      null,
    ])
    expect(pdt.MarshalBinary()).toEqual([
      new Uint8Array([
        1, 0, 0, 0, 14, 223, 183, 54, 18, 7, 91, 205, 21, 254, 92,
      ]),
      null,
    ])
  })
})

describe('time location loading', () => {
  it('returns Go-style location tuples', () => {
    expect(LoadLocation('UTC')).toEqual([UTC, null])
    expect(LoadLocation('')).toEqual([UTC, null])
    expect(LoadLocation('Local')).toEqual([Local, null])

    const [missing, err] = LoadLocation('America/NotReal')
    expect(missing).toBeNull()
    expect(err?.Error()).toBe('time: unknown time zone America/NotReal')
  })

  it('returns tuple shape for timezone data loaders', () => {
    const [loc, err] = LoadLocationFromTZData('Custom/Zone', new Uint8Array())

    expect(err).toBeNull()
    expect(loc?.String()).toBe('Custom/Zone')
  })
})
