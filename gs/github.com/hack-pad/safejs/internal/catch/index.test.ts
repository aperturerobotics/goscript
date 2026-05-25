import { describe, expect, test } from 'vitest'
import * as $ from '@goscript/builtin/index.js'
import * as js from '@goscript/syscall/js/index.js'

import { Try, TrySideEffect } from './index.js'

describe('safejs catch override', () => {
  test('returns happy path result', async () => {
    await expect(Try(() => 'ok')).resolves.toEqual(['ok', null])
  })

  test('converts Go panic payloads to errors', async () => {
    const [, err] = await Try(() => {
      $.panic('some error')
    })

    expect(err?.Error()).toBe('some error')
  })

  test('converts syscall/js values to js errors', async () => {
    const err = await TrySideEffect(() => {
      $.panic(js.ValueOf(new Error('bad js')))
    })

    expect(err?.Error()).toBe('JavaScript error: bad js')
  })

  test('converts JavaScript throws to js errors', async () => {
    const [, err] = await Try(() => {
      throw new Error('bad throw')
    })

    expect(err?.Error()).toBe('JavaScript error: bad throw')
  })
})
