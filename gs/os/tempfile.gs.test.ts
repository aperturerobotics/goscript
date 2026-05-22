import { basename, join } from 'node:path'
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ErrUnimplemented } from './error.gs.js'
import { CreateTemp, MkdirTemp } from './tempfile.gs.js'
import * as errors from '../errors/errors.js'
import { ErrNotExist } from './error.gs.js'
import { Stat } from './stat_js.gs.js'

const tempRoots: string[] = []
const originalCrypto = globalThis.crypto

afterEach(() => {
  vi.restoreAllMocks()
  Object.defineProperty(globalThis, 'crypto', {
    configurable: true,
    value: originalCrypto,
  })
  for (const root of tempRoots.splice(0)) {
    rmSync(root, { force: true, recursive: true })
  }
})

function makeTempRoot(): string {
  const root = mkdtempSync(join(tmpdir(), 'goscript-os-temp-'))
  tempRoots.push(root)
  return root
}

function stubRandomBytes(bytes: number[]): void {
  Object.defineProperty(globalThis, 'crypto', {
    configurable: true,
    value: {
      getRandomValues: vi.fn((dst: Uint8Array) => {
        for (let i = 0; i < dst.length; i++) {
          dst[i] = bytes[i] ?? 0
        }
        return dst
      }),
    },
  })
}

function forbidMathRandom(): void {
  vi.spyOn(Math, 'random').mockImplementation(() => {
    throw new Error('os temp names must not use Math.random')
  })
}

describe('os temp files', () => {
  it('uses Web Crypto bytes for temp names', () => {
    const root = makeTempRoot()
    stubRandomBytes([0x78, 0x56, 0x34, 0x12])
    forbidMathRandom()

    const [dir, dirErr] = MkdirTemp(root, 'dir-*.tmp')
    expect(dirErr).toBeNull()
    expect(basename(dir)).toBe('dir-305419896.tmp')
    expect(existsSync(dir)).toBe(true)

    const [file, fileErr] = CreateTemp(root, 'file-*.tmp')
    expect(fileErr).toBeNull()
    expect(file).not.toBeNull()
    expect(basename(file!.Name())).toBe('file-305419896.tmp')
    expect(existsSync(file!.Name())).toBe(true)
    file!.Close()
  })

  it('does not truncate an existing path after a random collision', () => {
    const root = makeTempRoot()
    const existing = join(root, 'file-305419896.tmp')
    writeFileSync(existing, 'keep')
    stubRandomBytes([0x78, 0x56, 0x34, 0x12])
    forbidMathRandom()

    const [file, err] = CreateTemp(root, 'file-*.tmp')

    expect(file).toBeNull()
    expect(err).not.toBeNull()
    expect(readFileSync(existing, 'utf8')).toBe('keep')
  })

  it('reports ErrUnimplemented without a secure random source', () => {
    const root = makeTempRoot()
    Object.defineProperty(globalThis, 'crypto', {
      configurable: true,
      value: {},
    })
    forbidMathRandom()

    const [dir, err] = MkdirTemp(root, 'dir-*')

    expect(dir).toBe('')
    expect(err).toBe(ErrUnimplemented)
  })

  it('maps host missing-path errors to ErrNotExist', () => {
    const root = makeTempRoot()

    const [, err] = Stat(join(root, 'missing'))

    expect(errors.Is(err, ErrNotExist)).toBe(true)
  })
})
