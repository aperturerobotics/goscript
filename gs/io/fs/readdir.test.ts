import { describe, expect, it } from 'vitest'
import * as $ from '@goscript/builtin/index.js'

import { File, FileInfo, ReadDir } from './index.js'

describe('io/fs ReadDir override', () => {
  it('returns a nil entry slice without sorting when directory read fails', async () => {
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

    const [list, err] = await ReadDir(
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

  it('awaits async FS.Open fallback implementations', async () => {
    const entries = [
      {
        Name(): string {
          return 'b.txt'
        },
        IsDir(): boolean {
          return false
        },
        Info(): [FileInfo, $.GoError] {
          return [null, null]
        },
        Type(): number {
          return 0
        },
      },
      {
        Name(): string {
          return 'a.txt'
        },
        IsDir(): boolean {
          return false
        },
        Info(): [FileInfo, $.GoError] {
          return [null, null]
        },
        Type(): number {
          return 0
        },
      },
    ]
    const file: File & {
      ReadDir(n: number): Promise<[$.Slice<any>, $.GoError]>
    } = {
      Close(): $.GoError {
        return null
      },
      Read(_p0: Uint8Array): [number, $.GoError] {
        return [0, null]
      },
      Stat(): [FileInfo, $.GoError] {
        return [null, null]
      },
      async ReadDir(_n: number): Promise<[$.Slice<any>, $.GoError]> {
        return [$.arrayToSlice(entries), null]
      },
    }

    const [list, err] = await ReadDir(
      {
        async Open(_name: string): Promise<[File, $.GoError]> {
          return [file, null]
        },
      },
      'dir',
    )

    expect(err).toBeNull()
    expect(list?.map((entry) => entry?.Name())).toEqual(['a.txt', 'b.txt'])
  })
})
