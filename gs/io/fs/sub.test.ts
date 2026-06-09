import { describe, expect, it } from 'vitest'
import * as $ from '@goscript/builtin/index.js'

import { File, FileInfo, Sub, Stat } from './index.js'

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
    Size(): number {
      return 0
    },
    Sys(): null {
      return null
    },
  }
}

describe('io/fs Sub override', () => {
  it('preserves the backing filesystem and directory in fallback subFS', async () => {
    const opened: string[] = []
    const dirInfo = fileInfo('pkg', true)
    const file: File = {
      async Close(): Promise<$.GoError> {
        return null
      },
      Read(_p0: Uint8Array): [number, $.GoError] {
        return [0, null]
      },
      async Stat(): Promise<[FileInfo, $.GoError]> {
        return [dirInfo, null]
      },
    } as unknown as File

    const [sub, subErr] = await Sub(
      {
        async Open(name: string): Promise<[File, $.GoError]> {
          opened.push(name)
          return [file, null]
        },
      } as any,
      'pkg',
    )
    expect(subErr).toBeNull()

    const [got, statErr] = await Stat(sub, '.')
    expect(statErr).toBeNull()
    expect(got).toBe(dirInfo)
    expect(opened).toEqual(['pkg'])
  })

  it('joins nested fallback subFS directories', async () => {
    const opened: string[] = []
    const fileInfoValue = fileInfo('index.js')
    const file: File = {
      async Close(): Promise<$.GoError> {
        return null
      },
      Read(_p0: Uint8Array): [number, $.GoError] {
        return [0, null]
      },
      async Stat(): Promise<[FileInfo, $.GoError]> {
        return [fileInfoValue, null]
      },
    } as unknown as File

    const backingFS = {
      async Open(name: string): Promise<[File, $.GoError]> {
        opened.push(name)
        return [file, null]
      },
    } as any
    const [pkgFS, pkgErr] = await Sub(backingFS, '@scope')
    expect(pkgErr).toBeNull()
    const [clientFS, clientErr] = await Sub(pkgFS, 'client')
    expect(clientErr).toBeNull()

    const [got, statErr] = await Stat(clientFS, 'index.js')
    expect(statErr).toBeNull()
    expect(got).toBe(fileInfoValue)
    expect(opened).toEqual(['@scope/client/index.js'])
  })
})
