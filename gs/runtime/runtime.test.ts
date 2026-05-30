import { describe, expect, it } from 'vitest'

import {
  Compiler,
  FuncForPC,
  ReadTrace,
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
})
