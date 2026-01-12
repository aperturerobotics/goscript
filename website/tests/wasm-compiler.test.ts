import { expect, test, describe } from 'vitest'
import * as goscriptRuntime from '@goscript/builtin'

// This test verifies the @goscript/builtin import works
describe('Runtime import', () => {
  test('@goscript/builtin can be imported', () => {
    expect(goscriptRuntime).toBeDefined()
    expect(typeof goscriptRuntime.println).toBe('function')
  })

  test('println function exists', () => {
    expect(goscriptRuntime.println).toBeDefined()
  })
})
