import { describe, expect, it, vi } from 'vitest'

import { BuildInfo, BuildSetting, Module, PrintStack, ReadBuildInfo, Stack } from './index.js'

describe('runtime/debug override', () => {
  it('returns a stack trace as bytes', () => {
    const stack = Stack()

    expect(stack).toBeInstanceOf(Uint8Array)
    expect(new TextDecoder().decode(stack)).toContain('Error')
  })

  it('prints the current stack trace', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    try {
      PrintStack()
      expect(consoleError).toHaveBeenCalledTimes(1)
      expect(consoleError.mock.calls[0][0]).toContain('Error')
    } finally {
      consoleError.mockRestore()
    }
  })

  it('exposes build info structs and reports no embedded module table', () => {
    const module = new Module({
      Path: 'example.test/module',
      Version: 'v1.2.3',
      Sum: 'h1:sum',
      Replace: new Module({ Path: '../module' }),
    })
    const info = new BuildInfo({
      GoVersion: 'go1.26.3',
      Path: 'example.test/main',
      Main: module,
      Deps: [module],
      Settings: [new BuildSetting({ Key: 'GOOS', Value: 'js' })],
    })

    expect(info.Main.Path).toBe('example.test/module')
    expect(info.Deps?.[0]).toBe(module)
    expect(info.Settings?.[0]?.Value).toBe('js')
    expect(ReadBuildInfo()).toEqual([null, false])
  })
})
