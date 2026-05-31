import { describe, expect, it } from 'vitest'
import { formatCompileError } from './diagnostics.js'
import { compileErrorFromResult } from './goscript-wasm.js'

describe('website compiler diagnostics', () => {
  it('preserves structured WASM diagnostics and formats them for display', () => {
    const diagnostics = [{
      severity: 'error',
      code: 'goscript/wasm:parse',
      message: 'browser source compilation failed to parse Go source',
      detail: 'main.go:2:12: expected ")"',
      position: {
        file: 'main.go',
        displayFile: 'main.go',
        line: 2,
        column: 12,
      },
    }]

    const err = compileErrorFromResult({
      error: 'main.go:2:12: goscript/wasm:parse: browser source compilation failed to parse Go source',
      output: '',
      diagnostics,
    })

    expect(err.message).toContain('goscript/wasm:parse')
    expect(err.diagnostics).toEqual(diagnostics)
    expect(formatCompileError(err)).toBe(
      'main.go:2:12: goscript/wasm:parse: browser source compilation failed to parse Go source (main.go:2:12: expected ")")',
    )
  })
})
