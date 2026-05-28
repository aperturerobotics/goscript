import { describe, expect, it } from 'vitest'
import * as $ from '@goscript/builtin/index.js'

import { File, FileInfo, ReadDir } from './index.js'

describe('io/fs ReadDir override', () => {
  it('returns a nil entry slice without sorting when directory read fails', () => {
    const readErr = $.newError('read failed')
    const file: File & {
      ReadDir(n: number): [null, $.GoError]
    } = {
      Close(): $.GoError {
        return null
      },
      Read(_p0: Uint8Array): [number, $.GoError] {
        return [0, readErr]
      },
      Stat(): [FileInfo, $.GoError] {
        return [null, readErr]
      },
      ReadDir(_n: number): [null, $.GoError] {
        return [null, readErr]
      },
    }

    const [list, err] = ReadDir(
      {
        Open(_name: string): [File, $.GoError] {
          return [file, null]
        },
      },
      'dir',
    )

    expect(list).toBeNull()
    expect(err).toBe(readErr)
  })
})
