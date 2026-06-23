import { describe, expect, it } from 'vitest'
import * as $ from '@goscript/builtin/index.js'

import { File, FileInfo, Stat } from './index.js'

function fileInfo(name: string, isDir = false): FileInfo {
  return {
    IsDir(): boolean {
      return isDir
    },
    ModTime(): any {
      return null
    },
    Mode(): number {
      return isDir ? 0o040000 : 0
    },
    Name(): string {
      return name
    },
    Size(): bigint {
      return 0n
    },
    Sys(): null {
      return null
    },
  }
}

describe('io/fs Stat override', () => {
  it('awaits async StatFS implementations', async () => {
    const info = fileInfo('pkg', true)

    const [got, err] = await Stat(
      {
        async Stat(_name: string): Promise<[FileInfo, $.GoError]> {
          return [info, null]
        },
        Open(_name: string): [File, $.GoError] {
          throw new Error('StatFS path should not open')
        },
      },
      'pkg',
    )

    expect(err).toBeNull()
    expect(got).toBe(info)
  })

  it('awaits async Open, File.Stat, and Close fallback implementations', async () => {
    const info = fileInfo('file.txt')
    let closed = false
    const file: File = {
      async Close(): Promise<$.GoError> {
        closed = true
        return null
      },
      Read(_p0: Uint8Array): [number, $.GoError] {
        return [0, null]
      },
      async Stat(): Promise<[FileInfo, $.GoError]> {
        expect(closed).toBe(false)
        return [info, null]
      },
    } as unknown as File

    const [got, err] = await Stat(
      {
        async Open(_name: string): Promise<[File, $.GoError]> {
          return [file, null]
        },
      } as any,
      'file.txt',
    )

    expect(err).toBeNull()
    expect(got).toBe(info)
    expect(closed).toBe(true)
  })
})
