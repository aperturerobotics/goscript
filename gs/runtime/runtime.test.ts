import { describe, expect, it } from 'vitest'

import {
  Compiler,
  FuncForPC,
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
})
