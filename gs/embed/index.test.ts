import { describe, expect, it } from 'vitest'

import { cloneStructValue, markAsStructValue } from '@goscript/builtin/index.js'
import { EOF } from '@goscript/io/index.js'
import { ReadDir, ReadFile, Stat } from '@goscript/io/fs/index.js'

import { FS } from './index.js'

describe('embed.FS', () => {
  it('clones embedded files as Go struct values', () => {
    const original = markAsStructValue(
      new FS(new Map([['config-set.bin', new Uint8Array([1, 2, 3])]])),
    )

    const cloned = cloneStructValue(original)
    const [data, err] = cloned.ReadFile('config-set.bin')

    expect(err).toBeNull()
    expect(Array.from(data)).toEqual([1, 2, 3])
  })

  it('supports io/fs read, stat, and directory APIs', () => {
    const fsys = markAsStructValue(
      new FS(
        new Map([
          ['config-set.bin', new Uint8Array([1, 2, 3])],
          ['assets/config.json', new Uint8Array([4])],
        ]),
      ),
    )

    const [data, readErr] = ReadFile(fsys, 'config-set.bin')
    expect(readErr).toBeNull()
    expect(Array.from(data)).toEqual([1, 2, 3])
    data[0] = 9
    const [dataAgain, readAgainErr] = ReadFile(fsys, 'config-set.bin')
    expect(readAgainErr).toBeNull()
    expect(Array.from(dataAgain)).toEqual([1, 2, 3])

    const [rootEntries, rootErr] = ReadDir(fsys, '.')
    expect(rootErr).toBeNull()
    expect(rootEntries!.map((entry) => entry!.Name())).toEqual([
      'assets',
      'config-set.bin',
    ])

    const [assetInfo, statErr] = Stat(fsys, 'assets')
    expect(statErr).toBeNull()
    expect(assetInfo!.IsDir()).toBe(true)

    const [assetEntries, assetErr] = ReadDir(fsys, 'assets')
    expect(assetErr).toBeNull()
    expect(assetEntries!.map((entry) => entry!.Name())).toEqual(['config.json'])
  })

  it('supports Open file reads and directory iteration', () => {
    const fsys = markAsStructValue(
      new FS(
        new Map([
          ['config-set.bin', new Uint8Array([1, 2, 3])],
          ['assets/config.json', new Uint8Array([4])],
        ]),
      ),
    )

    const [file, openErr] = fsys.Open('config-set.bin')
    expect(openErr).toBeNull()
    const buffer = new Uint8Array(2)
    const [firstRead, firstErr] = file!.Read(buffer)
    expect(firstErr).toBeNull()
    expect(firstRead).toBe(2)
    expect(Array.from(buffer)).toEqual([1, 2])
    const [secondRead, secondErr] = file!.Read(buffer)
    expect(secondErr).toBeNull()
    expect(secondRead).toBe(1)
    expect(Array.from(buffer)).toEqual([3, 2])
    const [eofRead, eofErr] = file!.Read(buffer)
    expect(eofRead).toBe(0)
    expect(eofErr).toBe(EOF)

    const [dir, dirOpenErr] = fsys.Open('.')
    expect(dirOpenErr).toBeNull()
    const [entries, readDirErr] = dir!.ReadDir(1)
    expect(readDirErr).toBeNull()
    expect(entries!.map((entry) => entry!.Name())).toEqual(['assets'])
  })
})
