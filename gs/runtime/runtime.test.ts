import { describe, expect, it } from 'vitest'

import * as $ from '@goscript/builtin/index.js'

import {
  Compiler,
  FuncForPC,
  MemStats,
  ReadMemStats,
  ReadTrace,
  SetFinalizer,
  StartTrace,
  StopTrace,
} from './runtime.js'

describe('runtime override', () => {
  it('exposes stack and trace compatibility helpers', () => {
    expect(Compiler).toBe('gc')
    expect(FuncForPC(0)).toBeNull()
    expect(StartTrace()?.Error()).toBe(
      'runtime: execution tracing is unsupported in GoScript',
    )
    expect(ReadTrace()).toBeNull()
    expect(() => StopTrace()).not.toThrow()
  })

  it('ignores finalizer registration and clearing', () => {
    const obj = {}
    expect(() => SetFinalizer(obj, () => {})).not.toThrow()
    expect(() => SetFinalizer(obj, null)).not.toThrow()
  })

  it('exposes heap and stack MemStats fields', () => {
    const stats = new MemStats()

    ReadMemStats($.varRef(stats))

    expect(stats.HeapAlloc).toBe(stats.Alloc)
    expect(stats.HeapSys).toBe(stats.Sys)
    expect(stats.HeapInuse).toBe(stats.Alloc)
    expect(stats.StackInuse).toBe(0)
    expect(stats.StackSys).toBe(0)
  })
})
