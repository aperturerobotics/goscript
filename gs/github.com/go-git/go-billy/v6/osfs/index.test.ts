import * as $ from '@goscript/builtin/index.js'
import * as os from '@goscript/os/index.js'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'

import { New } from './index.js'

const roots: string[] = []

afterEach(() => {
  for (const root of roots.splice(0)) {
    rmSync(root, { force: true, recursive: true })
  }
})

function tempRoot(): string {
  const root = mkdtempSync(join(tmpdir(), 'goscript-billy-osfs-'))
  roots.push(root)
  return root
}

describe('go-billy osfs override', () => {
  it('writes through to the host directory used by os.DirFS', () => {
    const root = tempRoot()
    const fsys = New(root)

    const [file, openErr] = fsys.OpenFile(
      'README.md',
      os.O_WRONLY | os.O_CREATE | os.O_TRUNC,
      0o666,
    )
    expect(openErr).toBeNull()
    const [n, writeErr] = file!.Write($.stringToBytes('hello\n'))
    expect(writeErr).toBeNull()
    expect(n).toBe(6)
    expect(file!.Close()).toBeNull()

    expect(readFileSync(join(root, 'README.md'), 'utf8')).toBe('hello\n')
  })

  it('keeps chrooted writes under the child host directory', () => {
    const root = tempRoot()
    const fsys = New(root)
    const [child, chrootErr] = fsys.Chroot('sub')
    expect(chrootErr).toBeNull()

    const [file, openErr] = child!.Create('nested/file.txt')
    expect(openErr).toBeNull()
    const [, writeErr] = file!.Write($.stringToBytes('child'))
    expect(writeErr).toBeNull()
    expect(file!.Close()).toBeNull()

    expect(readFileSync(join(root, 'sub', 'nested', 'file.txt'), 'utf8')).toBe(
      'child',
    )
  })

  it('rejects parent traversal outside the base directory', () => {
    const root = tempRoot()
    const fsys = New(root)

    const [file, err] = fsys.Open('../escape.txt')

    expect(file).toBeNull()
    expect(err).not.toBeNull()
  })

  it('reads host directory entries', () => {
    const root = tempRoot()
    writeFileSync(join(root, 'one.txt'), 'one')
    writeFileSync(join(root, 'two.txt'), 'two')
    const fsys = New(root)

    const [entries, err] = fsys.ReadDir('.')

    expect(err).toBeNull()
    expect(
      Array.from(entries ?? [])
        .map((entry) => entry.Name())
        .sort(),
    ).toEqual(['one.txt', 'two.txt'])
  })
})
